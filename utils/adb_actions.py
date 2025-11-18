from adbutils import adb

import core.bot as bot
from utils.log import info

device = adb.device(bot.device_id)

def click(x, y):
  return device.click(x, y)

def swipe(x1, y1, x2, y2, duration=0.3):
  return device.swipe(x1, y1, x2, y2, duration)

def text(content):
  return device.send_keys(content)

def enable_cursor_display():
  try:
    device.shell("settings put system pointer_location 1")
    device.shell("settings put system show_touches 1")
    device.shell("settings put system show_screen_updates 1")
    return True
  except Exception:
    return False

def disable_cursor_display():
  try:
    device.shell("settings put system pointer_location 0")
    device.shell("settings put system show_touches 0")
    device.shell("settings put system show_screen_updates 0")
    return True
  except Exception:
    return False

def screenshot(region=None):
  try:
    screenshot = device.screenshot(error_ok=False)
  except Exception:
    screenshot = device.screenshot()
  return screenshot