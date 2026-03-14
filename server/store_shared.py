import json
from pathlib import Path

ROOT_PATH = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_PATH / "config.json"
CONFIG_TEMPLATE_PATH = ROOT_PATH / "config.template.json"
CONFIG_DIR = ROOT_PATH / "config"
DEFAULT_CONFIG_FILE_ID = "default"
GLOBAL_SETUP_PATH = CONFIG_DIR / "setup.json"
THEME_PATH = ROOT_PATH / "themes/"

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
]

def ensure_config_dir():
  CONFIG_DIR.mkdir(parents=True, exist_ok=True)

def read_json_file(file_path: Path):
  with open(file_path, "r") as f:
    return json.load(f)

def write_json_file(file_path: Path, data):
  with open(file_path, "w") as f:
    json.dump(data, f, indent=2)

def load_default_config():
  if CONFIG_TEMPLATE_PATH.exists():
    return read_json_file(CONFIG_TEMPLATE_PATH)
  if CONFIG_PATH.exists():
    return read_json_file(CONFIG_PATH)
  return {}


def merge_with_defaults(source, defaults):
  if isinstance(source, dict) and isinstance(defaults, dict):
    merged = {}
    for key, default_value in defaults.items():
      if key in source:
        merged[key] = merge_with_defaults(source[key], default_value)
      else:
        merged[key] = default_value
    for key, value in source.items():
      if key not in merged:
        merged[key] = value
    return merged
  return source


def merge_with_default_config(data):
  defaults = load_default_config()
  if not isinstance(defaults, dict):
    defaults = {}
  if not isinstance(data, dict):
    data = {}
  return merge_with_defaults(data, defaults)

def extract_setup_config(data):
  if not isinstance(data, dict):
    return {}
  return {key: data[key] for key in SETUP_KEYS if key in data}

def without_setup_config(data):
  if not isinstance(data, dict):
    return {}
  return {key: value for key, value in data.items() if key not in SETUP_KEYS}

def default_setup_config():
  return extract_setup_config(load_default_config())

def merge_setup_config(data):
  merged = default_setup_config()
  if isinstance(data, dict):
    merged.update(extract_setup_config(data))
  return merged
