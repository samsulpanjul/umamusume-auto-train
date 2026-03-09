import json
import copy
from pathlib import Path

ROOT_PATH = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_PATH / "config.json"
CONFIG_TEMPLATE_PATH = ROOT_PATH / "config.template.json"
CONFIG_DIR = ROOT_PATH / "config"
PRESETS_PATH = CONFIG_DIR / "presets.json"
MAX_PRESET = 10

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
  if CONFIG_PATH.exists():
    with open(CONFIG_PATH, "r") as f:
      return json.load(f)
  if CONFIG_TEMPLATE_PATH.exists():
    with open(CONFIG_TEMPLATE_PATH, "r") as f:
      return json.load(f)
  return {}

def _default_preset_storage() -> dict:
  default_config = _load_default_config()
  presets = [
    {
      "name": f"Preset {idx + 1}",
      "config": copy.deepcopy(default_config)
    }
    for idx in range(MAX_PRESET)
  ]
  return {"index": 0, "presets": presets}

def _normalize_preset_storage(raw_data: dict) -> dict:
  default_storage = _default_preset_storage()
  if not isinstance(raw_data, dict):
    return default_storage

  presets_in = raw_data.get("presets", [])
  if not isinstance(presets_in, list):
    presets_in = []

  normalized_presets = []
  for idx in range(MAX_PRESET):
    fallback_preset = default_storage["presets"][idx]
    if idx < len(presets_in) and isinstance(presets_in[idx], dict):
      preset = presets_in[idx]
      name = preset.get("name")
      config = preset.get("config")
      normalized_presets.append({
        "name": name if isinstance(name, str) and name.strip() else fallback_preset["name"],
        "config": config if isinstance(config, dict) else fallback_preset["config"]
      })
    else:
      normalized_presets.append(fallback_preset)

  raw_index = raw_data.get("index", 0)
  index = raw_index if isinstance(raw_index, int) else 0
  index = min(max(index, 0), MAX_PRESET - 1)

  return {"index": index, "presets": normalized_presets}

def load_preset_storage() -> dict:
  _ensure_config_dir()
  if not PRESETS_PATH.exists():
    default_storage = _default_preset_storage()
    save_preset_storage(default_storage)
    return default_storage

  try:
    with open(PRESETS_PATH, "r") as f:
      raw_data = json.load(f)
  except (json.JSONDecodeError, OSError):
    raw_data = _default_preset_storage()

  normalized = _normalize_preset_storage(raw_data)
  save_preset_storage(normalized)
  return normalized

def save_preset_storage(data: dict):
  _ensure_config_dir()
  normalized = _normalize_preset_storage(data)
  with open(PRESETS_PATH, "w") as f:
    json.dump(normalized, f, indent=2)

def save_theme(data: dict, name: str):
  file_path = THEME_PATH / f"{name}.json"
  with open(file_path, "w") as f:
    json.dump(data, f, indent=2)
