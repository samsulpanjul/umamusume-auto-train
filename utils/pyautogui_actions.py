import pyautogui
import mss
from utils.constants import GAME_WINDOW_REGION

def click(x_y : tuple[int, int]):
  pyautogui.click(x, y)
  return True

def swipe(start_x_y : tuple[int, int], end_x_y : tuple[int, int], duration=0.3):
  delay_to_first_move = 0.1
  move(start_x_y[0], start_x_y[1], duration=delay_to_first_move)
  hold()
  move(end_x_y[0], end_x_y[1], duration=duration-delay_to_first_move)
  release()
  return True

def move(x, y, duration=0.2):
  pyautogui.moveTo(x, y, duration=duration)
  return True

def hold():
  pyautogui.mouseDown()
  return True

def release():
  pyautogui.mouseUp()
  return True

cached_screenshot = []
def screenshot(region_xywh : tuple[int, int, int, int] = None):
  global cached_screenshot
  if region_xywh:
    debug(f"Screenshot region: {region_xywh}")
  else:
    region_xywh = GAME_WINDOW_REGION
    debug(f"Screenshot region: {GAME_WINDOW_REGION}")
  with mss.mss() as sct:
    monitor = {
      "left": region_xywh[0],
      "top": region_xywh[1],
      "width": region_xywh[2],
      "height": region_xywh[3]
    }
    if len(cached_screenshot) > 0:
      debug(f"Using cached screenshot")
      screenshot = cached_screenshot
    else:
      debug(f"Taking new screenshot")
      screenshot = sct.grab(monitor)
      cached_screenshot = screenshot
    return screenshot
    
