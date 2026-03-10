from server.store_shared import THEME_PATH, write_json_file

def save_theme(data: dict, name: str):
  file_path = THEME_PATH / f"{name}.json"
  write_json_file(file_path, data)
