from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import json
import re
import core.bot as bot
import core.config as config

from server.legacy_config_store import (
  save_config,
  load_applied_preset_id,
  save_applied_preset_id,
  clear_applied_preset_if_matches,
)
from server.setup_store import load_setup_config, save_setup_config
from server.config_store import (
  list_configs,
  load_named_config,
  save_named_config,
  create_config,
  duplicate_config,
  delete_config,
)
from server.store_shared import merge_setup_config

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
  config.WEBHOOK_SKILL_BUY_ENABLED = data.get("webhook_skill_buy_enabled", True)
  return {"status": "success"}

@app.get("/config/applied-preset")
def get_applied_preset():
  return {"preset_id": load_applied_preset_id()}

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

@app.post("/configs/{name}/apply")
def apply_named_config(name: str):
  safe_id = safe_name(name)
  try:
    preset_config = load_named_config(safe_id)
  except FileNotFoundError:
    raise HTTPException(status_code=404, detail="Config not found")

  setup_config = load_setup_config()
  merged_config = {**preset_config, **merge_setup_config(setup_config)}
  save_config(merged_config)
  save_applied_preset_id(safe_id)

  config.reload_config()
  bot.use_adb = config.USE_ADB
  bot.device_id = config.DEVICE_ID if config.DEVICE_ID else None

  return {"status": "success", "preset_id": safe_id}

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