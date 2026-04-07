import json
import os

TEMPLATE_FILE = "config.template.json"
CONFIG_FILE = "config.json"
is_changed = False

SETUP_KEYS = [
  "sleep_time_multiplier",
  "use_adb",
  "window_name",
  "device_id",
  "ocr_use_gpu",
  "notifications_enabled",
  "info_notification",
  "error_notification",
  "success_notification",
  "notification_volume",
  "preset_id"
]

# one level deep merge on only whitelisted keys
NESTED_SHALLOW_KEYS = ["skill","stat_caps","minimum_aptitudes","positions_by_race","hint_hunting_weights","event"]

def update_config(file_path=None):
  global is_changed, NESTED_SHALLOW_KEYS, TEMPLATE_FILE, CONFIG_FILE
  is_changed = False
  if not file_path:
    file_path = CONFIG_FILE

  if not os.path.exists(TEMPLATE_FILE):
    raise FileNotFoundError(f"Missing template file: {TEMPLATE_FILE}")

  # Load template
  with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
    template = json.load(f)

  # If config doesn't exist, create it exactly from template
  if not os.path.exists(file_path):
    print("config.json not found. Creating a new one from template...")
    with open(file_path, "w", encoding="utf-8") as f:
      json.dump(template, f, indent=2)
    return template

  # Load user config
  with open(file_path, "r", encoding="utf-8") as f:
    user_config = json.load(f)

  # Apply shallow merge (only top-level keys)
  updated = shallow_merge(template, user_config, file_path)

  for k in NESTED_SHALLOW_KEYS:
    updated = shallow_merge_key(k, template, updated)

  # Save only if something changed
  if is_changed:
    print("Saving updated config.json with added top-level keys...")
    with open(file_path, "w", encoding="utf-8") as f:
      json.dump(updated, f, indent=2)

  return updated

def shallow_merge(template: dict, user_config: dict, file_path: str) -> dict:
  global is_changed, SETUP_KEYS

  final = {}

  # This has become complicated, should look into separating it into two functions maybe.
  for key, t_val in template.items():
    if key in user_config:
      if file_path == CONFIG_FILE:
        final[key] = user_config[key]
      else:
        if key in SETUP_KEYS:
          is_changed = True
          print(f"Removing top-level key: {key}")
        else:
          final[key] = user_config[key]
    else:
      if file_path == CONFIG_FILE:
        is_changed = True
        print(f"Adding missing top-level key: {key}")
        final[key] = t_val
      else:
        if key not in SETUP_KEYS:
          is_changed = True
          print(f"Adding missing top-level key: {key}")
          final[key] = t_val

  # Add any user-defined extra keys at the end, preserving their order
  for key, u_val in user_config.items():
    if key not in template:
      final[key] = u_val

  return final

def shallow_merge_key(key: str, template: dict, user_config: dict) -> dict:
  global is_changed

  if key not in template:
    return user_config

  t_val = template[key]

  if key not in user_config:
    print(f"Adding missing top-level key (via shallow_merge_key): {key}")
    user_config[key] = t_val
    is_changed = True
    return user_config

  u_val = user_config[key]

  if not isinstance(t_val, dict) or not isinstance(u_val, dict):
    return user_config

  for subkey, t_subval in t_val.items():
    if subkey not in u_val:
      print(f"Adding missing nested key: {key}.{subkey}")
      u_val[subkey] = t_subval
      is_changed = True

  return user_config
