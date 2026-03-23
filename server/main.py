from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import json
import re
import core.bot as bot
import core.config as config

from server.legacy_config_store import (
  load_config,
  save_config,
  load_applied_preset_id,
  save_applied_preset_id,
  clear_applied_preset_if_matches,
)
from server.theme_store import save_theme
from server.setup_store import load_setup_config, save_setup_config
from server.config_store import (
  list_configs,
  load_named_config,
  save_named_config,
  create_config,
  duplicate_config,
  delete_config,
)

app = FastAPI()

# resolved base dirs
DATA_DIR = Path("data").resolve()
WEB_DIR = Path("web/dist").resolve()
THEMES_DIR = Path("themes").resolve()

def safe_resolve(base: Path, user_input: str) -> Path:
  """Resolve user path and block directory traversal (e.g. ../../)."""
  target = (base / user_input).resolve()
  if not target.is_relative_to(base):
    raise HTTPException(status_code=400, detail="Invalid path")
  return target

def safe_name(name: str) -> str:
  """Allow only simple filenames — no slashes, dots, or traversal."""
  if not re.match(r'^[a-zA-Z0-9_-]+$', name):
    raise HTTPException(status_code=400, detail="Invalid name")
  return name

# restrict CORS to localhost
app.add_middleware(
  CORSMiddleware,
  allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/themes")
def list_all_themes():
  themes_dir = "themes"
  custom_themes = []
  default_themes = []
  if not os.path.exists(themes_dir):
    return []
  for filename in os.listdir(themes_dir):
    file_path = os.path.join(themes_dir, filename)
    if not filename.endswith(".json"):
      continue
    try:
      with open(file_path, "r") as f:
        content = f.read().strip()
        if not content: continue # Skip empty files
        data = json.loads(content)
        if filename == "umas.json":
          if isinstance(data, list):
            # Filter out any null/empty entries in the list
            default_themes.extend([t for t in data if t and "id" in t])
        else:
          if isinstance(data, dict) and "primary" in data:
            if "id" not in data:
              data["id"] = filename.replace(".json", "")
            custom_themes.append(data)
    except Exception as e:
      print(f"Error loading {filename}: {e}")
  default_themes.sort(key=lambda x: x.get("label", "").lower())
  return custom_themes + default_themes

@app.get("/theme/{name}")
def get_theme(name: str):
  file_path = safe_resolve(THEMES_DIR, f"{safe_name(name)}.json")
  with open(file_path, "r") as f:
    return JSONResponse(content=json.load(f))

@app.post("/theme/{name}")
def update_theme(new_theme: dict, name: str):
  save_theme(new_theme, safe_name(name))
  return {"status": "success", "data": new_theme, "name": name}

@app.post("/calculate")
async def get_results(request: Request):
  body = await request.json()
  data = dict(body)
  with open("action_calc.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

  results = _calculate_results(data)
  return results

import importlib

# Import the whole module once
_mod = importlib.import_module("core.trainings")

# Pull the list that contains the names
training_function_names = getattr(_mod, "training_function_names")

# Pull each function listed in that list
for _fn_name in training_function_names:
    globals()[_fn_name] = getattr(_mod, _fn_name)

def _calculate_results(data):
  from core.actions import Action
  from utils.shared import CleanDefaultDict
  from core.strategies import Strategy

  mock_state = CleanDefaultDict()
  strategy = Strategy()

  for training_name, training_data in data.items():
    support_data = _extract_support_card_data(training_name, training_data)
    if support_data:
      mock_state["training_results"][training_name] = support_data
    mock_state["training_results"][training_name]["stat_gains"] = training_data["stat_gains"]

  # temporary mock date
  mock_state["year"] = "Classic Year Early Sep"
  mock_state["scenario_name"] = "unity"
  mock_training_template = strategy.get_training_template(mock_state)

  mock_actions = {}
  for training_type in training_function_names:
    mock_action = Action()
    mock_actions[training_type] = globals()[training_type](mock_state, mock_training_template, mock_action, use_fallback_function=False)

  return mock_actions

def _extract_support_card_data(training_name, training_data):
  from utils.shared import CleanDefaultDict
  count_result = CleanDefaultDict()
  count_result["total_supports"] = 0
  for card_data in training_data["supports"]:
    if not card_data["enabled"]:
      continue
    key = card_data["type"]
    if key == "":
      continue
    top_right = card_data["top_right"]
    bottom_left = card_data["bottom_left"]
    if top_right == "unity_training":
      count_result["unity_trainings"] += 1
      if bottom_left == "unity_gauge_empty":
        count_result["unity_gauge_fills"] += 1
      elif bottom_left == "unity_gauge_full":
        count_result["unity_spirit_explosions"] += 1

    if key == "npc":
      continue
    count_result[key]["supports"] += 1
    count_result["total_supports"] += 1
    friend_level = card_data["friendship"]
    count_result[key]["friendship_levels"][friend_level] += 1
    count_result["total_friendship_levels"][friend_level] += 1
    if top_right == "hint":
      count_result[key]["hints"] += 1
      count_result["total_hints"] += 1
      count_result["hints_per_friend_level"][friend_level] += 1
  return count_result

@app.get("/load_action_calc")
def get_action_calc():
  with open("action_calc.json", "r", encoding="utf-8") as f:
    content = f.read().strip()
    data = json.loads(content)
    return data

@app.get("/config")
def get_config():
  return load_config()

@app.post("/config")
def update_config(new_config: dict):
  save_config(new_config)
  return {"status": "success", "data": new_config}

@app.get("/config/setup")
def get_setup_config():
  return load_setup_config()

@app.post("/config/setup")
def update_setup_config(new_setup_config: dict):
  save_setup_config(new_setup_config)
  return {"status": "success", "data": new_setup_config}

@app.post("/api/webhook")
def update_webhook(data: dict):
  config.WEBHOOK_URL = data.get("webhook_url", "")
  config.WEBHOOK_PROGRESS_ENABLED = data.get("webhook_progress_enabled", True)
  return {"status": "success"}

@app.get("/config/applied-preset")
def get_applied_preset():
  return {"preset_id": load_applied_preset_id()}

@app.post("/config/applied-preset")
def update_applied_preset(payload: dict):
  preset_id = payload.get("preset_id", "")
  if not isinstance(preset_id, str):
    raise HTTPException(status_code=400, detail="preset_id must be a string")
  safe_id = safe_name(preset_id) if preset_id else ""
  save_applied_preset_id(safe_id)
  return {"status": "success", "preset_id": safe_id}

@app.get("/configs")
def get_configs():
  return {"configs": list_configs()}

@app.post("/configs")
def add_config():
  new_config = create_config()
  return {"status": "success", "config": new_config}

@app.post("/configs/{name}/duplicate")
def duplicate_named_config(name: str):
  safe_id = safe_name(name)
  try:
    duplicated = duplicate_config(safe_id)
    return {"status": "success", "config": duplicated}
  except FileNotFoundError:
    raise HTTPException(status_code=404, detail="Config not found")

@app.get("/configs/{name}")
def get_named_config(name: str):
  safe_id = safe_name(name)
  try:
    return load_named_config(safe_id)
  except FileNotFoundError:
    raise HTTPException(status_code=404, detail="Config not found")

@app.put("/configs/{name}")
def update_named_config(name: str, new_config: dict):
  safe_id = safe_name(name)
  save_named_config(safe_id, new_config)
  return {"status": "success"}

@app.delete("/configs/{name}")
def remove_named_config(name: str):
  safe_id = safe_name(name)
  try:
    delete_config(safe_id)
    clear_applied_preset_if_matches(safe_id)
    return {"status": "success"}
  except FileNotFoundError:
    raise HTTPException(status_code=404, detail="Config not found")
  except RuntimeError as e:
    raise HTTPException(status_code=400, detail=str(e))

@app.get("/version.txt")
def get_version():
  # read version.txt from the root directory
  with open("version.txt", "r") as f:
    return PlainTextResponse(f.read().strip())

@app.get("/notifs")
def get_notifs():
  folder = "assets/notifications"
  return os.listdir(folder)

# this get returns search results for the event.
@app.get("/event/{text}")
def get_event(text: str):
  # read events.json from the root directory
  with open("data/events.json", "r", encoding="utf-8") as f:
    events = json.load(f)
  words = text.split(" ")
  results = []
  for choice in events["choiceArraySchema"]["choices"]:
    for value in choice.values():
      for word in words:
        if word not in value.lower():
          break
      else:
        results.append(choice)
        break

  return {"data": results}

@app.get("/data/{path:path}")
async def get_data_file(path: str):
  file_path = safe_resolve(DATA_DIR, path)
  if file_path.is_file():
    return FileResponse(str(file_path), headers={
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    })
  return {"error": "File not found"}

PATH = "web/dist"

@app.get("/")
async def root_index():
  return FileResponse(os.path.join(PATH, "index.html"), headers={
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  })

@app.get("/{path:path}")
async def fallback(path: str):
  file_path = safe_resolve(WEB_DIR, path)
  headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  }

  if file_path.is_file():
    media_type = "application/javascript" if str(file_path).endswith((".js", ".mjs")) else None
    return FileResponse(str(file_path), media_type=media_type, headers=headers)

  return FileResponse(os.path.join(PATH, "index.html"), headers=headers)