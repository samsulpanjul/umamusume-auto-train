import copy
import json
from pathlib import Path

from server.store_shared import (
  CONFIG_DIR,
  DEFAULT_CONFIG_FILE_ID,
  ensure_config_dir,
  load_default_config,
  without_setup_config,
  read_json_file,
  write_json_file,
)

def config_file_path(config_id: str) -> Path:
  return CONFIG_DIR / f"{config_id}.json"

def list_config_files() -> list[Path]:
  ensure_config_dir()
  return sorted(
    [p for p in CONFIG_DIR.glob("*.json") if p.is_file() and p.stem not in {"presets", "setup"}],
    key=lambda p: p.stem.lower(),
  )

def next_config_id() -> str:
  existing_ids = {path.stem for path in list_config_files()}
  idx = 1
  while True:
    candidate = f"config_{idx}"
    if candidate not in existing_ids:
      return candidate
    idx += 1

def ensure_default_config_file():
  if list_config_files():
    return
  default_path = config_file_path(DEFAULT_CONFIG_FILE_ID)
  write_json_file(default_path, without_setup_config(load_default_config()))

def list_configs() -> list[dict]:
  ensure_default_config_file()
  result = []
  for file_path in list_config_files():
    try:
      data = read_json_file(file_path)
    except (json.JSONDecodeError, OSError):
      continue
    data = without_setup_config(data)
    display_name = data.get("config_name")
    result.append({
      "id": file_path.stem,
      "name": display_name if isinstance(display_name, str) and display_name.strip() else file_path.stem,
      "config": data,
    })

  if not result:
    # Regenerate the default config file if none exists.
    default_data = without_setup_config(load_default_config())
    if not isinstance(default_data, dict):
      default_data = {}
    default_path = config_file_path(DEFAULT_CONFIG_FILE_ID)
    write_json_file(default_path, default_data)
    result.append({
      "id": DEFAULT_CONFIG_FILE_ID,
      "name": (
        default_data.get("config_name")
        if isinstance(default_data.get("config_name"), str) and default_data.get("config_name").strip()
        else DEFAULT_CONFIG_FILE_ID
      ),
      "config": default_data,
    })

  return result

def load_named_config(config_id: str) -> dict:
  file_path = config_file_path(config_id)
  if not file_path.exists():
    raise FileNotFoundError(f"Config not found: {config_id}")
  return without_setup_config(read_json_file(file_path))

def save_named_config(config_id: str, data: dict):
  ensure_config_dir()
  write_json_file(config_file_path(config_id), without_setup_config(data))

def create_config() -> dict:
  ensure_default_config_file()
  config_id = next_config_id()
  data = copy.deepcopy(without_setup_config(load_default_config()))
  if isinstance(data, dict):
    data["config_name"] = f"Config {config_id.split('_')[-1]}"
  save_named_config(config_id, data)
  return {"id": config_id, "name": data.get("config_name", config_id), "config": data}

def duplicate_config(source_config_id: str) -> dict:
  source = copy.deepcopy(load_named_config(source_config_id))
  config_id = next_config_id()

  if isinstance(source, dict):
    base_name = source.get("config_name")
    source["config_name"] = (
      f"{base_name} Copy"
      if isinstance(base_name, str) and base_name.strip()
      else f"Config {config_id.split('_')[-1]}"
    )

  save_named_config(config_id, source)
  return {
    "id": config_id,
    "name": (
      source.get("config_name", config_id)
      if isinstance(source, dict)
      else config_id
    ),
    "config": source,
  }

def delete_config(config_id: str):
  configs = list_config_files()
  if len(configs) <= 1:
    raise RuntimeError("Cannot delete the last remaining config.")
  file_path = config_file_path(config_id)
  if not file_path.exists():
    raise FileNotFoundError(f"Config not found: {config_id}")
  file_path.unlink()
