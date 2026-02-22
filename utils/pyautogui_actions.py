import pyautogui
import mss
from utils.constants import GAME_WINDOW_REGION
from utils.log import debug, warning, error, info, debug_window, args
import core.bot as bot
import numpy as np
import cv2

# bot.windows_window.width and bot.windows_window.height is screen resolution
# world is 1080p, screen is arbitrary
CONVERSION_PARAMS = None
def screen_to_world_conversion_init():
  global CONVERSION_PARAMS
  if CONVERSION_PARAMS is not None:
    return

  src_w = bot.windows_window.width
  src_h = bot.windows_window.height

  target_ratio = 16 / 9
  src_ratio = src_w / src_h
  eps = 1e-6

  if abs(src_ratio - target_ratio) < eps:
    crop_pixels = 0
    cut_sides = False  # irrelevant, no crop
    scale = 1920 / src_w

  elif src_ratio > target_ratio:
    # Too wide → crop sides
    new_w = int(round(src_h * target_ratio))
    crop_pixels = src_w - new_w
    cut_sides = True
    scale = 1920 / new_w

  else:
    # Too tall → crop top/bottom
    new_h = int(round(src_w / target_ratio))
    crop_pixels = src_h - new_h
    cut_sides = False
    scale = 1920 / src_w

  CONVERSION_PARAMS = {
    "crop_pixels": crop_pixels,
    "cut_sides": cut_sides,
    "scale": scale
  }

# from the actual resolution of the monitor, convert to 1920x1080
def world_to_screen_space(x, y):
  if CONVERSION_PARAMS is None:
    return x, y
  crop_pixels = CONVERSION_PARAMS["crop_pixels"]
  cut_sides = CONVERSION_PARAMS["cut_sides"]
  scale = CONVERSION_PARAMS["scale"]

  # Remove centered crop
  if cut_sides:
    x -= crop_pixels / 2
  else:
    y -= crop_pixels / 2

  # Apply uniform scaling
  x *= scale
  y *= scale

  return int(x), int(y)

# from 1920x1080 convert to real world coordinates
def screen_space_to_world(x, y):
  if CONVERSION_PARAMS is None:
    return x, y
  crop_pixels = CONVERSION_PARAMS["crop_pixels"]
  cut_sides = CONVERSION_PARAMS["cut_sides"]
  scale = CONVERSION_PARAMS["scale"]

  # Undo scaling
  x /= scale
  y /= scale

  # Restore centered crop offset
  if cut_sides:
    x += crop_pixels / 2
  else:
    y += crop_pixels / 2

  return int(x), int(y)

def click(x_y : tuple[int, int], clicks: int = 1, interval: float = 0.1, duration: float = 0.225):
  if CONVERSION_PARAMS is not None:
    x, y = screen_space_to_world(x_y[0], x_y[1])
  else:
    x, y = x_y[0], x_y[1]
  pyautogui.click(x, y, clicks=clicks, interval=interval, duration=duration)
  return True

def swipe(start_x_y : tuple[int, int], end_x_y : tuple[int, int], duration=0.3):
  if CONVERSION_PARAMS is not None:
    start_x, start_y = screen_space_to_world(start_x_y[0], start_x_y[1])
    end_x, end_y = screen_space_to_world(end_x_y[0], end_x_y[1])
  else:
    start_x, start_y = start_x_y[0], start_x_y[1]
    end_x, end_y = end_x_y[0], end_x_y[1]
  delay_to_first_move = 0.1
  pyautogui.moveTo(start_x, start_y, duration=delay_to_first_move)
  hold()
  pyautogui.moveTo(end_x, end_y, duration=duration-delay_to_first_move)
  release()
  return True

def moveTo(x, y, duration=0.2):
  if CONVERSION_PARAMS is not None:
    x, y = screen_space_to_world(x, y)
  pyautogui.moveTo(x, y, duration=duration)
  return True

def hold():
  pyautogui.mouseDown()
  return True

def release():
  pyautogui.mouseUp()
  return True

def crop_screenshot(screenshot, pixel_crop_amount):
  # crop screenshot width-wise by pixel_crop_amount
  return screenshot[:, pixel_crop_amount:-pixel_crop_amount]

def scale_screenshot(screenshot, scaling_factor):
  if screenshot.shape[0] == 1 and screenshot.shape[1] == 1:
    return screenshot
  # scale screenshot by scaling_factor
  if screenshot.shape[0] > 1:
    scale_second = int(screenshot.shape[0] * scaling_factor)
  else:
    scale_second = screenshot.shape[0]
  if screenshot.shape[1] > 1:
    scale_first = int(screenshot.shape[1] * scaling_factor)
  else:
    scale_first = screenshot.shape[1]
  return cv2.resize(screenshot, (scale_first, scale_second), interpolation=cv2.INTER_AREA)

cached_screenshot = []
def screenshot(region_xywh : tuple[int, int, int, int] = None, force_save=False):
  global cached_screenshot
  screenshot = None
  if not region_xywh:
    region_xywh = GAME_WINDOW_REGION
  if args.device_debug:
    debug(f"Screenshot region: {region_xywh}")
  if len(cached_screenshot) > 0:
    if args.device_debug:
      debug(f"Using cached screenshot")
    screenshot = cached_screenshot
  else:
    if bot.windows_window:
      window_x, window_y = bot.windows_window.left, bot.windows_window.top
      window_width, window_height = bot.windows_window.width, bot.windows_window.height
    else:
      raise Exception("Couldn't find the windows_window somehow, please report this error.")
    window_region = {
      "left": window_x,
      "top": window_y,
      "width": window_width,
      "height": window_height
    }
    with mss.mss() as sct:
      if args.device_debug:
        debug(f"Taking new screenshot")
      # take screenshot as BGRA
      screenshot = np.array(sct.grab(window_region))
      screenshot = cv2.cvtColor(screenshot, cv2.COLOR_BGRA2RGB)

  if force_save:
    debug_window(screenshot, save_name="pyautogui_screenshot", force_save=force_save)
  cached_screenshot = screenshot

  # crop screenshot to region_xywh
  if region_xywh:
    x, y, w, h = region_xywh
    debug(f"requested region: ({x},{y},{x+w},{y+h})")
    x1, y1 = screen_space_to_world(x+w, y+h)
    x, y = screen_space_to_world(x, y)
    if CONVERSION_PARAMS is not None and CONVERSION_PARAMS["scale"] < 1:
      if x == x1:
        x1 = x + 1
      if y == y1:
        y1 = y + 1
    debug(f"screenshotted region: ({x},{y},{x1},{y1})")
    screenshot = screenshot[y:y1, x:x1]
    debug_window(screenshot, save_name="pyautogui_screenshot", force_save=force_save)
    if CONVERSION_PARAMS is not None:
      screenshot = scale_screenshot(screenshot, CONVERSION_PARAMS["scale"])
      debug_window(screenshot, save_name="pyautogui_screenshot_scaled", force_save=force_save)
  #debug_window(screenshot, save_name=f"pyautogui_screenshot_{x}_{y}_{w}_{h}")
  return screenshot
