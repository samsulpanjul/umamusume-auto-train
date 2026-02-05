from adbutils import adb
import numpy as np
import core.bot as bot
from utils.log import info, debug, error, debug_window, args
from utils.constants import name_of_variable

device = None
def init_adb():
  global device
  if bot.use_adb:
    try:
      adb.connect(bot.device_id)
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
def screenshot(region_xywh: tuple[int, int, int, int] = None, force_save=False):
  global cached_screenshot
  if device is None:
    error(f"ADB device is None, this should not happen, check ADB connection and device ID, if problem persists, please report this error.")
    raise Exception("ADB device is None")
  if args.device_debug:
    debug(f"Screenshot region: {region_xywh}")

  if len(cached_screenshot) > 0:
    if args.device_debug:
      debug(f"Using cached screenshot")
    screenshot = cached_screenshot
  else:
    if args.device_debug:
      debug(f"Taking new screenshot")
    try:
      screenshot = np.array(device.screenshot(error_ok=False))
    except:
      screenshot = np.array(device.screenshot())
    cached_screenshot = screenshot
  if force_save:
    debug_window(screenshot, save_name="adb_screenshot", force_save=force_save)
  if args.device_debug:
    debug(f"Screenshot shape: {screenshot.shape}")
  if screenshot.shape[0] == 800 and screenshot.shape[1] == 1080:
    # change region from portrait to landscape
    region_xywh = (0, 0, 1080, 800)
  if region_xywh:
    x, y, w, h = region_xywh
    screenshot = screenshot[y:y+h, x:x+w]
  if args.device_debug:
    debug(f"Screenshot shape: {screenshot.shape}")
    variable_name = name_of_variable(region_xywh)
    debug_window(screenshot, save_name="adb_screenshot")
  return screenshot
