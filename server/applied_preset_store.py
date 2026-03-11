import json

from server.store_shared import (
  CONFIG_DIR,
  ensure_config_dir,
  read_json_file,
  write_json_file,
)

APPLIED_PRESET_PATH = CONFIG_DIR / "applied_preset.json"


def ensure_applied_preset_file():
  ensure_config_dir()
  if APPLIED_PRESET_PATH.exists():
    return
  write_json_file(APPLIED_PRESET_PATH, {"preset_id": ""})


def load_applied_preset_id() -> str:
  ensure_applied_preset_file()
  try:
    data = read_json_file(APPLIED_PRESET_PATH)
  except (json.JSONDecodeError, OSError):
    data = {}
  preset_id = data.get("preset_id", "")
  return preset_id if isinstance(preset_id, str) else ""


def save_applied_preset_id(preset_id: str):
  ensure_applied_preset_file()
  write_json_file(APPLIED_PRESET_PATH, {"preset_id": preset_id})


def clear_applied_preset_if_matches(preset_id: str):
  current = load_applied_preset_id()
  if current == preset_id:
    save_applied_preset_id("")
