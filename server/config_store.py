import copy
import json
from pathlib import Path
from typing import Any

from server.store_shared import (
  CONFIG_DIR,
  DEFAULT_CONFIG_FILE_ID,
  ensure_config_dir,
  load_default_config,
  without_setup_config,
  read_json_file,
  write_json_file,
)

def _default_preset_config() -> dict[str, Any]:
  """Return template defaults with setup-only keys removed."""
  raw_default = without_setup_config(load_default_config())
  return raw_default if isinstance(raw_default, dict) else {}


def _deep_merge(defaults: dict[str, Any], data: dict[str, Any]) -> dict[str, Any]:
  """Deep-merge nested dictionaries while preserving defaults."""
  merged = copy.deepcopy(defaults)
  for key, value in data.items():
    default_value = merged.get(key)
    if isinstance(default_value, dict) and isinstance(value, dict):
      merged[key] = _deep_merge(default_value, value)
    else:
      merged[key] = value
  return merged


def _normalize_preset_data(data: dict[str, Any] | None) -> dict[str, Any]:
  """Strip setup keys and merge with template defaults."""
  candidate = without_setup_config(data) if isinstance(data, dict) else {}
  if not isinstance(candidate, dict):
    candidate = {}
  return _deep_merge(_default_preset_config(), candidate)

def _display_name(config_id: str, data: dict[str, Any]) -> str:
  name = data.get("config_name")
  if isinstance(name, str) and name.strip():
    return name
  return config_id

def _entry(config_id: str, data: dict[str, Any]) -> dict[str, Any]:
  return {
    "id": config_id,
    "name": _display_name(config_id, data),
    "config": data,
  }


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
  """Ensure at least one config file exists on disk."""
  if list_config_files():
    return
  default_path = config_file_path(DEFAULT_CONFIG_FILE_ID)
  write_json_file(default_path, _default_preset_config())

def list_configs() -> list[dict]:
  """List normalized config records for all config files."""
  ensure_default_config_file()
  result = []
  for file_path in list_config_files():
    try:
      existing = read_json_file(file_path)
    except (json.JSONDecodeError, OSError):
      continue
    data = _normalize_preset_data(existing)
    result.append(_entry(file_path.stem, data))

  if not result:
    # If every file is unreadable, recreate default so UI still has one usable config.
    default_data = _default_preset_config()
    write_json_file(config_file_path(DEFAULT_CONFIG_FILE_ID), default_data)
    result.append(_entry(DEFAULT_CONFIG_FILE_ID, default_data))

  return result

def load_named_config(config_id: str) -> dict[str, Any]:
  file_path = config_file_path(config_id)
  if not file_path.exists():
    raise FileNotFoundError(f"Config not found: {config_id}")
  existing = read_json_file(file_path)
  return _normalize_preset_data(existing)

def save_named_config(config_id: str, data: dict):
  ensure_config_dir()
  write_json_file(config_file_path(config_id), _normalize_preset_data(data))

def _default_created_name(config_id: str) -> str:
  return f"Config {config_id.split('_')[-1]}"

def create_config() -> dict[str, Any]:
  ensure_default_config_file()
  config_id = next_config_id()
  data = _default_preset_config()
  data["config_name"] = _default_created_name(config_id)
  save_named_config(config_id, data)
  return _entry(config_id, data)

def duplicate_config(source_config_id: str) -> dict[str, Any]:
  source = copy.deepcopy(load_named_config(source_config_id))
  config_id = next_config_id()

  if isinstance(source, dict):
    base_name = source.get("config_name")
    source["config_name"] = (
      f"{base_name} Copy"
      if isinstance(base_name, str) and base_name.strip()
      else _default_created_name(config_id)
    )

  save_named_config(config_id, source)
  return _entry(config_id, source if isinstance(source, dict) else {})

def delete_config(config_id: str):
  configs = list_config_files()
  if len(configs) <= 1:
    raise RuntimeError("Cannot delete the last remaining config.")
  file_path = config_file_path(config_id)
  if not file_path.exists():
    raise FileNotFoundError(f"Config not found: {config_id}")
  file_path.unlink()
