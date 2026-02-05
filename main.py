import sys
import subprocess

MIN = (3, 10)
MAX = (3, 14)

if not (MIN <= sys.version_info < MAX):
  # ask the launcher what it has
  out = subprocess.check_output(
    ["py", "--list"],
    text=True,
    stderr=subprocess.DEVNULL
  )

  candidates = []
  for line in out.splitlines():
    line = line.strip()
    if line.startswith("-V:"):
      v = line.split()[0][3:]
      try:
        major, minor = map(int, v.split("."))
        if (major, minor) >= MIN and (major, minor) < MAX:
          candidates.append(v)
      except ValueError:
        pass

  if not candidates:
    raise RuntimeError("No compatible Python 3.10-3.13 installed")

  best = sorted(candidates)[-1]

  p = subprocess.Popen(
    ["py", f"-{best}", *sys.argv],
    stdin=sys.stdin,
    stdout=sys.stdout,
    stderr=sys.stderr
  )
  p.wait()
  sys.exit(p.returncode)

from utils.tools import sleep
import pygetwindow as gw
import threading
import uvicorn
import keyboard
import pyautogui
import time
import sys
import socket

import utils.constants as constants
from utils.log import info, warning, error, debug, args, init_logging, notify

from core.skeleton import career_lobby
import core.config as config
import core.bot as bot
from server.main import app
from update_config import update_config

bot.windows_window = None

def focus_umamusume():
  if bot.use_adb:
    info("Using ADB no need to focus window.")
    constants.adjust_constants_x_coords(offset=-155)
    return True
  try:
    win = gw.getWindowsWithTitle("Umamusume")
    target_window = next((w for w in win if w.title.strip() == "Umamusume"), None)
    if not target_window:
      info(f"Couldn't get the steam version window, trying {config.WINDOW_NAME}.")
      if not config.WINDOW_NAME:
        error("Window name cannot be empty! Please set window name in the config.")
        return False
      win = gw.getWindowsWithTitle(config.WINDOW_NAME)
      target_window = next((w for w in win if w.title.strip() == config.WINDOW_NAME), None)
      if not target_window:
        error(f"Couldn't find target window named \"{config.WINDOW_NAME}\". Please double check your window name config.")
        return False

      constants.adjust_constants_x_coords()
      if target_window.isMinimized:
        target_window.restore()
      else:
        target_window.minimize()
        sleep(0.2)
        target_window.restore()
        sleep(0.5)
      pyautogui.press("esc")
      pyautogui.press("f11")
      time.sleep(5)
      close_btn = pyautogui.locateCenterOnScreen("assets/buttons/bluestacks/close_btn.png", confidence=0.8, minSearchTime=2)
      if close_btn:
        pyautogui.click(close_btn)
      return True

    if target_window.width < 1920 or target_window.height < 1080:
      error(f"Your resolution is {target_window.width} x {target_window.height}. Minimum expected size is 1920 x 1080.")
      return
    if target_window.isMinimized:
      target_window.restore()
    else:
      target_window.minimize()
      sleep(0.2)
      target_window.restore()
      sleep(0.5)
    bot.windows_window = target_window
  except Exception as e:
    error(f"Error focusing window: {e}")
    return False
  return True

def main():
  print("Uma Auto!")
  config.reload_config()
  if args.use_adb:
    bot.use_adb = True
    bot.device_id = args.use_adb
  else:
    bot.use_adb = config.USE_ADB
    if config.DEVICE_ID and config.DEVICE_ID != "":
      bot.device_id = config.DEVICE_ID
  if focus_umamusume():
    info(f"Config: {config.CONFIG_NAME}")
    career_lobby(args.dry_run_turn)
  else:
    error("Failed to focus Umamusume window")

def hotkey_listener():
  while True:
    keyboard.wait(bot.hotkey)
    if not bot.is_bot_running:
      print("[BOT] Starting...")
      bot.is_bot_running = True
      t = threading.Thread(target=main, daemon=True)
      t.start()
    else:
      print("[BOT] Stopping...")
      bot.is_bot_running = False
    sleep(0.5)

def is_port_available(host, port):
  try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind((host, port))
    sock.close()
    return True
  except OSError:
    return False

def start_server():
  host = "127.0.0.1"
  start_port = 8000
  end_port = 8010
  for port in range(start_port, end_port):
    if is_port_available(host, port):
      bot.hotkey = f"f{port - start_port + 1}"
      break
    else:
      print(f"[INFO] Port {port} is already in use. Trying {port + 1}...")

  threading.Thread(target=hotkey_listener, daemon=True).start()
  server_config = uvicorn.Config(app, host=host, port=port, workers=1, log_level="warning")
  server = uvicorn.Server(server_config)
  init_logging()
  info(f"Press '{bot.hotkey}' to start/stop the bot.")
  info(f"[SERVER] Open http://{host}:{port} to configure the bot.")
  server.run()

if __name__ == "__main__":
  update_config()
  config.reload_config(print_config=False)
  start_server()
