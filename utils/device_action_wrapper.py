import cv2
import numpy as np
import core.bot as bot
import utils.pyautogui_actions as pyautogui_actions
import utils.adb_actions as adb_actions
from utils.log import error, info, warning, debug

class BotStopException(Exception):
  #Exception raised to immediately stop the bot
  pass

def stop_bot():
  # Stop the bot immediately by raising an exception
  bot.is_bot_running = False
  raise BotStopException("Bot stopped by user")

Pos = tuple[int, int]                     # (x, y)
Box = tuple[int, int, int, int]           # (x, y, w, h)

def click(target: Pos | Box, clicks: int = 1, interval: float = 0.1, duration: float = 0.225):
  if not bot.is_bot_running:
    stop_bot()
  if len(target) == 2:
    x, y = target
    if bot.use_adb:
      adb_actions.click(x, y)
    else:
      pyautogui_actions.moveTo(x, y, duration=duration)
      pyautogui_actions.click(clicks=clicks, interval=interval)
    return True
  elif len(target) == 4:
    x, y, w, h = target
    cx = x + w // 2
    cy = y + h // 2
    if bot.use_adb:
      adb_actions.click(cx, cy)
    else:
      pyautogui_actions.moveTo(cx, cy, duration=duration)
      pyautogui_actions.click(clicks=clicks, interval=interval)
    return True
  else:
    raise TypeError("Expected (x, y) or (x, y, w, h) tuple")

def swipe(start_x_y : tuple[int, int], end_x_y : tuple[int, int], duration=0.3):
  # Swipe from start to end coordinates
  if not bot.is_bot_running:
    stop_bot()
  if bot.use_adb:
    adb_actions.swipe(start_x_y[0], start_x_y[1], end_x_y[0], end_x_y[1], duration)
  else:
    pyautogui_actions.swipe(start_x_y[0], start_x_y[1], end_x_y[0], end_x_y[1], duration)

def drag(start_x_y : tuple[int, int], end_x_y : tuple[int, int], duration=0.5):
  # Swipe from start to end coordinates and click at the end
  if not bot.is_bot_running:
    stop_bot()
  swipe(start_x_y, end_x_y, duration)
  click(end_x_y)
  return True

def long_press(mouse_x_y : tuple[int, int], duration=2.0):
  # Long press at coordinates
  if not bot.is_bot_running:
    stop_bot()
  swipe(mouse_x_y, mouse_x_y, duration)
  return True

def locate(img_path : str, confidence=0.8, min_search_time=2, region_ltrb : tuple[int, int, int, int] = None):
  if region_ltrb == None:
    screenshot = screenshot()
  else:
    screenshot = screenshot(region_ltrb=region_ltrb)
  boxes = match_template(img_path, screenshot, confidence)
  if len(boxes) == 0:
    return None
  return boxes[0]

def match_template(template_path : str, screenshot : np.ndarray, threshold=0.85):
  template = cv2.imread(template_path, cv2.IMREAD_COLOR)  # safe default
  if template.shape[2] == 4:
    template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)
  template = cv2.cvtColor(template, cv2.COLOR_RGB2BGR)
  result = cv2.matchTemplate(screenshot, template, cv2.TM_CCOEFF_NORMED)
  loc = np.where(result >= threshold)

  h, w = template.shape[:2]
  boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]

  return deduplicate_boxes(boxes)

def deduplicate_boxes(boxes_xywh : list[tuple[int, int, int, int]], min_dist=5):
  # boxes_xywh = (x, y, width, height)
  filtered = []
  for x, y, w, h in boxes_xywh:
    cx, cy = x + w // 2, y + h // 2
    if all(abs(cx - (fx + fw // 2)) > min_dist or abs(cy - (fy + fh // 2)) > min_dist
        for fx, fy, fw, fh in filtered):
      filtered.append((x, y, w, h))
  return filtered

def screenshot(region_xywh : tuple[int, int, int, int] = None):
  # region_ltrb = (left, top, right, bottom)
  if bot.use_adb:
    return adb_actions.screenshot(region_xywh=region_xywh)
  else:
    return pyautogui_actions.screenshot(region_xywh=region_xywh)

def locate_and_click(img_path : str, confidence=0.8, min_search_time=2, region_ltrb : tuple[int, int, int, int] = None, duration=0.225):
  boxes = locate(img_path, confidence, min_search_time, region_ltrb)
  if boxes:
    box = boxes[0]
    x = box[0] + box[2] // 2
    y = box[1] + box[3] // 2
    click((x, y), duration=duration)
    return True
  return False