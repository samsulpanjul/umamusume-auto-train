# tools
import cv2
import pyautogui
import time
import json
import inspect

import core.config as config
import core.bot as bot
import utils.constants as constants
from .log import error
from utils.log import info, warning, error, debug

def sleep(seconds=1):
  debug(f"sleep called from {inspect.stack()[1].function} for {seconds} seconds")
  time.sleep(seconds * config.SLEEP_TIME_MULTIPLIER)

def get_secs(seconds=1):
  return seconds * config.SLEEP_TIME_MULTIPLIER

def drag_scroll(mousePos, to):
  '''to: negative to scroll down, positive to scroll up'''
  if not to or not mousePos:
    error("drag_scroll correct variables not supplied.")
  pyautogui.moveTo(mousePos, duration=0.1)
  pyautogui.mouseDown()
  pyautogui.moveRel(0, to, duration=0.25)
  pyautogui.mouseUp()
  pyautogui.click()

def click(img: str = None, confidence: float = 0.8, minSearch:float = 2, click: int = 1, text: str = "", boxes = None, region=None):
  if not bot.is_bot_running:
    return False

  if boxes:
    if isinstance(boxes, list):
      if len(boxes) == 0:
        return False
      box = boxes[0]
    else :
      box = boxes

    if text:
      debug(text)
    x, y, w, h = box
    center = (x + w // 2, y + h // 2)
    pyautogui.moveTo(center[0], center[1], duration=0.225)
    pyautogui.click(clicks=click, interval=0.05)
    return True

  if img is None:
    return False

  if region:
    btn = pyautogui.locateCenterOnScreen(img, confidence=confidence, minSearchTime=minSearch, region=region)
  else:
    btn = pyautogui.locateCenterOnScreen(img, confidence=confidence, minSearchTime=minSearch)
  if btn:
    if text:
      debug(text)
    pyautogui.moveTo(btn, duration=0.225)
    pyautogui.click(clicks=click, interval=0.05)
    return True

  return False

def remove_if_exists(lst, items):
  """Remove item(s) from list if they exist, otherwise do nothing.
  Args:
    lst: The list to remove from
    items: Single item (str) or list of items to remove
  """
  if isinstance(items, str):
    items = [items]

  for item in items:
    if item in lst:
      lst.remove(item)