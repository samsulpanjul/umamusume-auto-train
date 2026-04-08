from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import json
import re
import core.bot as bot
import core.config as config

from update_config import SETUP_KEYS
from update_config import update_config as _update_config
app = FastAPI()

# resolved base dirs
CONFIG_PATH = "config.json"
CONFIG_TEMPLATE_PATH = "config.template.json"
CONFIG_DIR = "config"
GLOBAL_SETUP_PATH = f"{CONFIG_DIR}/setup.json"
DEFAULT_CONFIG_PATH = f"{CONFIG_DIR}/default.json"
THEMES_DIR = "themes/"
DATA_DIR = "data/"
WEB_DIR = "web/dist/"

# startup actions
setup_json_exists = os.path.exists(GLOBAL_SETUP_PATH)
default_json_exists = os.path.exists(DEFAULT_CONFIG_PATH)
if not setup_json_exists or not default_json_exists:
  with open(CONFIG_TEMPLATE_PATH, "r") as template_file:
    template = json.load(template_file)
    if not setup_json_exists:
      setup_template = {k: v for k, v in template.items() if k in SETUP_KEYS}
      with open(GLOBAL_SETUP_PATH, "w+", encoding="utf-8") as setup_file:
        json.dump(setup_template, setup_file, indent=2)
    if not default_json_exists:
      default_template = {k: v for k, v in template.items() if k not in SETUP_KEYS}
      with open(DEFAULT_CONFIG_PATH, "w+", encoding="utf-8") as default_config_file:
        json.dump(default_template, default_config_file, indent=2)

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
  with open(f"{THEMES_DIR}/{name}.json", "r") as f:
    return JSONResponse(content=json.load(f))

@app.post("/theme/{name}")
def update_theme(new_theme: dict, name: str):
  with open(f"{THEMES_DIR}/{name}.json", "w+") as f:
    json.dump(data, f, indent=2)
    return {"status": "success", "data": new_theme, "name": name}
  return {"status": "fail"}

from server.calculator_helpers import _calculate_results
@app.post("/calculate")
async def get_results(request: Request):
  body = await request.json()
  data = dict(body)["gameState"]
  minimum_acceptable_data = dict(body)["minimum_acceptable_scores"]

  with open("action_calc.json", "w+", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
  results = _calculate_results(data, minimum_acceptable_data=minimum_acceptable_data)
  return results

@app.post("/set_min_score_state/{function_name}")
async def set_min_score(request: Request, function_name: str):
  body = await request.json()
  data = dict(body)
  with open("min_scores.json", "w+", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
  results = _calculate_results(data)
  return results

@app.post("/calc_min_score_state/{function_name}")
async def calc_min_score(request: Request, function_name: str):
  body = await request.json()
  data = dict(body)
  min_score_states = data["minScoreStates"]
  gameState = data["gameState"]
  with open("min_scores.json", "w+", encoding="utf-8") as f:
    json.dump(min_score_states, f, indent=2)
  results = _calculate_results(gameState, function_name, min_score_states[function_name])
  return results

@app.get("/load_action_calc")
def get_action_calc():
  try:
    with open("action_calc.json", "r", encoding="utf-8") as f:
      content = f.read().strip()
      data = json.loads(content)
      return data
  except:
    return {}

@app.get("/load_min_scores")
def get_min_scores():
  try:
    with open("min_scores.json", "r", encoding="utf-8") as f:
      content = f.read().strip()
      data = json.loads(content)
      return data
  except:
    return {}

@app.post("/api/webhook")
def update_webhook(data: dict):
  config.WEBHOOK_URL = data.get("webhook_url", "")
  config.WEBHOOK_PROGRESS_ENABLED = data.get("webhook_progress_enabled", True)
  return {"status": "success"}

@app.get("/config")
def get_config():
  # config.json is generated by the bot on startup so just read it.
  with open(CONFIG_PATH, "r") as f:
    return json.load(f)

@app.post("/config")
def update_config(new_config: dict):
  # use write+ to create file if somehow user deleted it before saving
  with open(CONFIG_PATH, "w+") as f:
    json.dump(new_config, f, indent=2)
    return {"status": "success", "data": new_config}
  return{"status":"fail"}

@app.get("/config/setup")
def get_setup_config():
  with open(GLOBAL_SETUP_PATH, "r", encoding="utf-8") as setup_file:
    return json.load(setup_file)
  return{"status":"fail"}

@app.post("/config/setup")
def update_setup_config(new_setup_config: dict):
  with open(GLOBAL_SETUP_PATH, "w+", encoding="utf-8") as setup_file:
    json.dump(new_setup_config, setup_file, indent=2)
    return {"status": "success", "data": new_setup_config}
  return {"status": "fail"}

CURRENT_CONFIGS=[]
GLOBAL_NUMBER = 100_000
CONFIG_PATTERN = re.compile(r'^config_(\d+)$')
def add_config_to_global_list(config_dict):
  global GLOBAL_NUMBER, CURRENT_CONFIGS, CONFIG_PATTERN
  CURRENT_CONFIGS.append(config_dict)
  GLOBAL_NUMBER = 100_000

  def sort_key(item):
    global GLOBAL_NUMBER
    match = CONFIG_PATTERN.match(item["id"])
    if match:
      return int(match.group(1))
    GLOBAL_NUMBER += 1
    return GLOBAL_NUMBER

  CURRENT_CONFIGS.sort(key=sort_key)

# find the next gap in the configs and return that
def get_next_config_id():
  global CURRENT_CONFIGS, CONFIG_PATTERN
  expected = 1
  for cfg in CURRENT_CONFIGS:
    match = CONFIG_PATTERN.match(cfg["id"])
    if not match:
      continue
    cur = int(match.group(1))
    if cur != expected:
      return expected
    expected += 1
  return expected

#populate global config list once
for file_path in sorted(
  [p for p in Path(CONFIG_DIR).glob("*.json") if p.is_file() and p.stem not in {"presets", "setup"}],
  key=lambda p: p.stem.lower(),
):
  data = _update_config(str(file_path))
  config_dict = {"id": Path(file_path).stem, "name": data["config_name"]}
  add_config_to_global_list(config_dict)

"""
# example for a middleware that prints something evertime a request comes in
@app.middleware("http")
async def print_current_configs(request: Request, call_next):
    global CURRENT_CONFIGS
    print(CURRENT_CONFIGS)
    return await call_next(request)
"""

@app.get("/configs")
@app.get("/configs/")
def get_configs():
  global CURRENT_CONFIGS
  return {"configs": CURRENT_CONFIGS}

@app.get("/config/applied-preset")
def get_applied_preset_id():
  with open(CONFIG_PATH, "r") as f:
    preset_id = json.load(f).get("preset_id", "")
  return {"preset_id": preset_id}

# added double because of dev env rules, I didn't want to bother with modifying the link in there
@app.post("/configs")
@app.post("/configs/")
def add_config():
  global SETUP_KEYS
  next_config_id = get_next_config_id()
  with open(DEFAULT_CONFIG_PATH, "r") as template_file:
    template = json.load(template_file)
    default_template = {k: v for k, v in template.items() if k not in SETUP_KEYS}

    default_template["config_name"] = f"Config {next_config_id}"
    with open(f"{CONFIG_DIR}/config_{next_config_id}.json", "w+") as new_file:
      json.dump(default_template, new_file, indent=2)
      config_dict = {"id": f"config_{next_config_id}", "name": f"Config {next_config_id}"}
      add_config_to_global_list(config_dict)
      return {"status": "success", "config": config_dict}
  return {"status": "fail"}

@app.post("/configs/{name}/duplicate")
def duplicate_named_config(name: str):
  next_config_id = get_next_config_id()
  with open(f"{CONFIG_DIR}/{name}.json", "r") as old_file:
    with open(f"{CONFIG_DIR}/config_{next_config_id}.json", "w+") as new_file:
      loaded_config = json.load(old_file)
      json.dump(loaded_config, new_file, indent=2)
      new_config_name = loaded_config.get("config_name",  f"Config {next_config_id}")
      if new_config_name == loaded_config.get("config_name"):
        new_config_name = f"{new_config_name} (Copy)"
      config_dict =  {"id": f"config_{next_config_id}", "name": new_config_name}
      add_config_to_global_list(config_dict)
      return {"status": "success", "config": config_dict}
  return {"status": "fail"}

@app.get("/configs/{name}")
def get_named_config(name: str):
  path = f"{CONFIG_DIR}/{name}.json"
  if os.path.isfile(path):
    with open(path, "r") as old_file:
      loaded_config = json.load(old_file)
      return {
        "status": "success",
        "config": {
          "id": name,
          "name": loaded_config.get("config_name", name),
          "config": loaded_config
        }
      }
  return {"status": "fail"}

@app.put("/configs/{name}")
def update_named_config(name: str, new_config: dict):
  global CURRENT_CONFIGS
  with open(f"{CONFIG_DIR}/{name}.json", "w+") as new_file:
    json.dump(new_config, new_file, indent=2)
    for cfg in CURRENT_CONFIGS:
      if cfg["id"] == name:
        cfg = {"id": name, "name": new_config["config_name"]}
    return {"status": "success"}
  return {"status": "fail"}

@app.delete("/configs/{name}")
def remove_named_config(name: str):
  global CURRENT_CONFIGS
  file_path = f"{CONFIG_DIR}/{name}.json"
  exists = False
  for cfg in CURRENT_CONFIGS:
    if cfg["id"] == name:
      CURRENT_CONFIGS.remove(cfg)
      exists=True
      break
  if exists:
    Path(file_path).unlink()
  #either file exists and we deleted it or it doesn't exist, so we always return success
  return {"status": "success"}

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
  file_path = os.path.join(DATA_DIR, path)
  return FileResponse(file_path, headers={
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  })

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
  file_path = os.path.join(WEB_DIR, path)
  headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  }

  media_type = "application/javascript" if str(file_path).endswith((".js", ".mjs")) else None
  return FileResponse(file_path, media_type=media_type, headers=headers)
