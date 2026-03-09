import copy
import json
from pathlib import Path

ROOT_PATH = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_PATH / "config.json"
CONFIG_TEMPLATE_PATH = ROOT_PATH / "config.template.json"
CONFIG_DIR = ROOT_PATH / "config"
DEFAULT_CONFIG_FILE_ID = "default"

THEME_PATH = ROOT_PATH / "themes/"

def load_config() -> dict:
  if CONFIG_PATH.exists():
    with open(CONFIG_PATH, "r") as f:
      return json.load(f)
  return {}

def save_config(data: dict):
  with open(CONFIG_PATH, "w") as f:
    json.dump(data, f, indent=2)

def _ensure_config_dir():
  CONFIG_DIR.mkdir(parents=True, exist_ok=True)

def _load_default_config() -> dict:
  if CONFIG_TEMPLATE_PATH.exists():
    with open(CONFIG_TEMPLATE_PATH, "r") as f:
      return json.load(f)
  if CONFIG_PATH.exists():
    with open(CONFIG_PATH, "r") as f:
      return json.load(f)
  return {}

def _config_file_path(config_id: str) -> Path:
  return CONFIG_DIR / f"{config_id}.json"

def _read_json_file(file_path: Path) -> dict:
  with open(file_path, "r") as f:
    return json.load(f)

def _list_config_files() -> list[Path]:
  _ensure_config_dir()
  return sorted(
    [p for p in CONFIG_DIR.glob("*.json") if p.is_file() and p.stem != "presets"],
    key=lambda p: p.stem.lower()
  )

def _next_config_id() -> str:
  existing_ids = {path.stem for path in _list_config_files()}
  idx = 1
  while True:
    candidate = f"config_{idx}"
    if candidate not in existing_ids:
      return candidate
    idx += 1

def ensure_default_config_file():
  if _list_config_files():
    return
  default_path = _config_file_path(DEFAULT_CONFIG_FILE_ID)
  with open(default_path, "w") as f:
    json.dump(_load_default_config(), f, indent=2)

def list_configs() -> list[dict]:
  ensure_default_config_file()
  result = []
  for file_path in _list_config_files():
    try:
      data = _read_json_file(file_path)
    except (json.JSONDecodeError, OSError):
      continue
    display_name = data.get("config_name")
    result.append({
      "id": file_path.stem,
      "name": display_name if isinstance(display_name, str) and display_name.strip() else file_path.stem,
      "config": data,
    })
  if not result:
    ensure_default_config_file()
    return list_configs()
  return result

def load_named_config(config_id: str) -> dict:
  file_path = _config_file_path(config_id)
  if not file_path.exists():
    raise FileNotFoundError(f"Config not found: {config_id}")
  return _read_json_file(file_path)

def save_named_config(config_id: str, data: dict):
  _ensure_config_dir()
  with open(_config_file_path(config_id), "w") as f:
    json.dump(data, f, indent=2)

def create_config() -> dict:
  ensure_default_config_file()
  config_id = _next_config_id()
  data = copy.deepcopy(_load_default_config())
  if isinstance(data, dict):
    data["config_name"] = f"Config {config_id.split('_')[-1]}"
  save_named_config(config_id, data)
  return {"id": config_id, "name": data.get("config_name", config_id), "config": data}

def delete_config(config_id: str):
  configs = _list_config_files()
  if len(configs) <= 1:
    raise RuntimeError("Cannot delete the last remaining config.")
  file_path = _config_file_path(config_id)
  if not file_path.exists():
    raise FileNotFoundError(f"Config not found: {config_id}")
  file_path.unlink()

def save_theme(data: dict, name: str):
  file_path = THEME_PATH / f"{name}.json"
  with open(file_path, "w") as f:
    json.dump(data, f, indent=2)
