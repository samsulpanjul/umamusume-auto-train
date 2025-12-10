import json
import os

from utils.log import debug

TEMPLATE_FILE = "config.template.json"
CONFIG_FILE = "config.json"

def update_config():
  if not os.path.exists(TEMPLATE_FILE):
    raise FileNotFoundError(f"Missing template file: {TEMPLATE_FILE}")

  # Load template
  with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
    template = json.load(f)

  # If config doesn't exist, create it from template
  if not os.path.exists(CONFIG_FILE):
    debug("config.json not found. Creating a new one from template...")
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
      json.dump(template, f, indent=2)
    return template

  # Otherwise, just return the existing config
  with open(CONFIG_FILE, "r", encoding="utf-8") as f:
    return json.load(f)
