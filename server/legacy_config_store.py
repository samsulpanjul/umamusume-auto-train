from server.store_shared import CONFIG_PATH, read_json_file, write_json_file

def load_config() -> dict:
  if CONFIG_PATH.exists():
    return read_json_file(CONFIG_PATH)
  return {}

def save_config(data: dict):
  write_json_file(CONFIG_PATH, data)
