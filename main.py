from utils.tools import sleep
import pygetwindow as gw
import threading
import uvicorn
import keyboard
import pyautogui
import time

import utils.constants as constants
from utils.log import info, warning, error, debug

from core.execute import career_lobby
import core.state as state
from server.main import app

hotkey = "f1"

def focus_umamusume():
  try:
    win = ""
    target_window = ""
    if state.WINDOW_NAME !="":
      win = gw.getWindowsWithTitle(state.WINDOW_NAME)
      target_window = next((w for w in win if w.title.strip() == state.WINDOW_NAME), None)
      if not target_window:
        error(f"Couldn't find target window named \"{state.WINDOW_NAME}\". Please double check your window name config.")

    info(f"Trying default window names.")
    for window_name in constants.DEFAULT_WINDOW_NAME_LIST:
      win = gw.getWindowsWithTitle(window_name)
      target_window = next((w for w in win if w.title.strip() == window_name), None)
      if target_window:
        info(f"Found window with name \"{window_name}\".")
        break

    if target_window.title != "Umamusume":
      constants.adjust_constants_x_coords()
      if target_window.isMinimized:
        target_window.restore()
      else:
        target_window.minimize()
        sleep(0.2)
        target_window.restore()
        sleep(0.5)
      # leave and re-enter full screen to be sure we're in full screen and not just a maximized window
      pyautogui.press("esc")
      pyautogui.press("f11")
      # static sleep time, not multiplied like other sleep function
      time.sleep(5)
      close_btn = pyautogui.locateCenterOnScreen("assets/buttons/bluestacks/close_btn.png", confidence=0.8, minSearchTime=2)
      if close_btn:
        pyautogui.click(close_btn)
      return True

    if target_window.isMinimized:
      target_window.restore()
    else:
      target_window.minimize()
      sleep(0.2)
      target_window.restore()
      sleep(0.5)
  except Exception as e:
    error(f"Error focusing window: {e}")
    return False
  return True

def main():
  print("Uma Auto!")
  #had to move reload_config out of focus_umamusume since we're trying to look into config before focusing the window
  state.reload_config()
  if focus_umamusume():
    career_lobby()
  else:
    error("Failed to focus Umamusume window")

def hotkey_listener():
  while True:
    keyboard.wait(hotkey)
    if not state.is_bot_running:
      print("[BOT] Starting...")
      state.is_bot_running = True
      t = threading.Thread(target=main, daemon=True)
      t.start()
    else:
      print("[BOT] Stopping...")
      state.is_bot_running = False
    sleep(0.5)

def start_server():
  res = pyautogui.resolution()
  if res.width != 1920 or res.height != 1080:
    error(f"Your resolution is {res.width} x {res.height}. Please set your screen to 1920 x 1080.")
    return
  host = "127.0.0.1"
  port = 8000
  info(f"Press '{hotkey}' to start/stop the bot.")
  print(f"[SERVER] Open http://{host}:{port} to configure the bot.")
  config = uvicorn.Config(app, host=host, port=port, workers=1, log_level="warning")
  server = uvicorn.Server(config)
  server.run()

if __name__ == "__main__":
  threading.Thread(target=hotkey_listener, daemon=True).start()
  start_server()
