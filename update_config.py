import json
import os

TEMPLATE_FILE = "config.template.json"
CONFIG_FILE = "config.json"

def update_config():
  if not os.path.exists(TEMPLATE_FILE):
    raise FileNotFoundError(f"Missing template file: {TEMPLATE_FILE}")

  # Load template
  with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
    template = json.load(f)

  # If config doesn't exist, create it exactly from template
  if not os.path.exists(CONFIG_FILE):
    print("config.json not found. Creating a new one from template...")
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
      json.dump(template, f, indent=2)
    return template

  # Load user config
  with open(CONFIG_FILE, "r", encoding="utf-8") as f:
    user_config = json.load(f)

  # Apply recursive merge to add missing keys while preserving user values.
  updated, is_changed = merge_with_template(template, user_config)

  # Save only if something changed
  if is_changed:
    print("Saving updated config.json with added missing keys...")
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
      json.dump(updated, f, indent=2)

  return updated

def merge_with_template(template: dict, user_config: dict, prefix: str = "") -> tuple[dict, bool]:
  changed = False
  merged = {}

  # Follow template order, recursively filling missing dict keys.
  for key, template_value in template.items():
    full_key = f"{prefix}.{key}" if prefix else key
    if key in user_config:
      user_value = user_config[key]
      if isinstance(template_value, dict) and isinstance(user_value, dict):
        merged_value, nested_changed = merge_with_template(template_value, user_value, full_key)
        merged[key] = merged_value
        changed = changed or nested_changed
      else:
        merged[key] = user_value
    else:
      print(f"Adding missing key: {full_key}")
      merged[key] = template_value
      changed = True

  # Preserve user-defined extra keys at each level.
  for key, user_value in user_config.items():
    if key not in template:
      merged[key] = user_value

  return merged, changed