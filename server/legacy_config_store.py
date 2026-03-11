from server.store_shared import CONFIG_PATH, read_json_file, write_json_file

def load_config() -> dict:
  if CONFIG_PATH.exists():
    return read_json_file(CONFIG_PATH)
  return {}

def save_config(data: dict):
  write_json_file(CONFIG_PATH, data)


def load_applied_preset_id() -> str:
  config = load_config()
  preset_id = config.get("_applied_preset_id", "")
  return preset_id if isinstance(preset_id, str) else ""


def save_applied_preset_id(preset_id: str):
  config = load_config()
  config["_applied_preset_id"] = preset_id
  save_config(config)


def clear_applied_preset_if_matches(preset_id: str):
  config = load_config()
  current = config.get("_applied_preset_id", "")
  if current == preset_id:
    config["_applied_preset_id"] = ""
    save_config(config)
