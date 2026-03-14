import json

from server.store_shared import (
  GLOBAL_SETUP_PATH,
  ensure_config_dir,
  read_json_file,
  write_json_file,
  default_setup_config,
  merge_setup_config,
)

def ensure_setup_config_file():
  ensure_config_dir()
  if GLOBAL_SETUP_PATH.exists():
    return
  write_json_file(GLOBAL_SETUP_PATH, default_setup_config())

def load_setup_config() -> dict:
  ensure_setup_config_file()
  try:
    setup_data = read_json_file(GLOBAL_SETUP_PATH)
  except (json.JSONDecodeError, OSError):
    setup_data = {}

  merged = merge_setup_config(setup_data)
  if setup_data != merged:
    save_setup_config(merged)
  return merged

def save_setup_config(data: dict):
  ensure_config_dir()
  write_json_file(GLOBAL_SETUP_PATH, merge_setup_config(data))
