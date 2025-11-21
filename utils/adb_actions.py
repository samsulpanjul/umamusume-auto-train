from adbutils import adb
import numpy as np
import core.bot as bot
from utils.log import info, debug, error, debug_window


device = None
def init_adb():
  global device
  if bot.use_adb:
    try:
      device = adb.device(bot.device_id)
    except Exception as e:
      error(f"Failed to initialize ADB: {e}")
      return False
  return True

def click(x, y):
  if device is None:
    return False
  return device.click(x, y)

def swipe(x1, y1, x2, y2, duration=0.3):
  if device is None:
    return False
  return device.swipe(x1, y1, x2, y2, duration)

def text(content):
  if device is None:
    return False
  return device.send_keys(content)

def enable_cursor_display():
  if device is None:
    return False
  try:
    device.shell("settings put system pointer_location 1")
    device.shell("settings put system show_touches 1")
    device.shell("settings put system show_screen_updates 1")
    return True
  except Exception:
    return False

def disable_cursor_display():
  if device is None:
    return False
  try:
    device.shell("settings put system pointer_location 0")
    device.shell("settings put system show_touches 0")
    device.shell("settings put system show_screen_updates 0")
    return True
  except Exception:
    return False

cached_screenshot = []
def screenshot(region_xywh: tuple[int, int, int, int] = None):
  global cached_screenshot
  if device is None:
    debug(f"ADB device is None")
    return None
  else:
    debug(f"Screenshot region: {region_xywh}")

  if len(cached_screenshot) > 0:
    debug(f"Using cached screenshot")
    screenshot = cached_screenshot
  else:
    debug(f"Taking new screenshot")
    screenshot = np.array(device.screenshot(error_ok=False))
    cached_screenshot = screenshot
  if region_xywh:
    x, y, w, h = region_xywh
    screenshot = screenshot[y:y+h, x:x+w]
  debug_window(screenshot, save_name="adb_screenshot")
  return screenshot
