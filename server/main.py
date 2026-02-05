from fastapi import FastAPI
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import core.bot as bot

from server.utils import load_config, save_config, save_theme

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
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
  with open(f"themes/{name}.json", "r") as f:
    return JSONResponse(content=json.load(f))

@app.post("/theme/{name}")
def update_theme(new_theme: dict, name: str):
  save_theme(new_theme, name)
  return {"status": "success", "data": new_theme, "name": name}

@app.get("/config")
def get_config():
  return load_config()

@app.post("/config")
def update_config(new_config: dict):
  save_config(new_config)
  return {"status": "success", "data": new_config}

@app.get("/version.txt")
def get_version():
  # read version.txt from the root directory
  with open("version.txt", "r") as f:
    return PlainTextResponse(f.read().strip())

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

@app.get("/notifications-poll")
def poll_notifications():
  if not bot.notifications:
    return {"notifications": []}
  n = list(bot.notifications)
  bot.notifications.clear()
  return {"notifications": n}

@app.get("/notifications/{filename}")
def get_notification_file(filename: str):
  file_path = os.path.join("notifications", filename)
  if os.path.exists(file_path):
    return FileResponse(file_path)
  return {"error": "File not found"}

@app.get("/data/{path:path}")
async def get_data_file(path: str):
  file_path = os.path.join("data", path)
  if os.path.isfile(file_path):
    return FileResponse(file_path, headers={
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
  file_path = os.path.join(PATH, path)
  headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  }

  if os.path.isfile(file_path):
    media_type = "application/javascript" if file_path.endswith((".js", ".mjs")) else None
    return FileResponse(file_path, media_type=media_type, headers=headers)

  return FileResponse(os.path.join(PATH, "index.html"), headers=headers)