import json
import os

from utils.log import debug

TEMPLATE_FILE = "config.template.json"
CONFIG_FILE = "config.json"
is_changed = False

def deep_merge(template: dict, user_config: dict) -> dict:
  global is_changed
  updated_config = {}

  # add all keys from template
  for key, value in template.items():
    if key in user_config:
      # recursive merge if value is dict
      if isinstance(value, dict) and isinstance(user_config[key], dict):
        updated_config[key] = deep_merge(value, user_config[key])
      else:
        updated_config[key] = user_config[key]
    else:
      is_changed = True
      debug(f"Adding new key: {key} = {value}")
      updated_config[key] = value

  # remove unused key
  for key in user_config:
    if key not in template:
      debug(f"Removing deprecated key: {key}")
      is_changed = True

  return updated_config

def update_config():
  if not os.path.exists(TEMPLATE_FILE):
    raise FileNotFoundError(f"Missing template file: {TEMPLATE_FILE}")

  # load template
  with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
    template = json.load(f)

  # if there's no config.json, make a new one
  if not os.path.exists(CONFIG_FILE):
    debug("config.json not found. Creating a new one from template...")
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
      json.dump(template, f, indent=2)
    return template

  # load user config
  with open(CONFIG_FILE, "r", encoding="utf-8") as f:
    user_config = json.load(f)
    return user_config

  # merge config
  updated_config = deep_merge(template, user_config)

  if is_changed:
    # save new config
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
      json.dump(updated_config, f, indent=2)
    debug("config.json successfully updated!")
  else:
    debug("No update in config.json.")

  return updated_config
