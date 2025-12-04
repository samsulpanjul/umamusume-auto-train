# tools
import cv2
import pyautogui
import time
import json
import inspect

import core.config as config
import core.bot as bot
import utils.constants as constants
import utils.device_action_wrapper as device_action
from .log import error
from utils.log import info, warning, error, debug

def sleep(seconds=1):
  debug(f"sleep called from {inspect.stack()[1].function} for {seconds} seconds")
  time.sleep(seconds * config.SLEEP_TIME_MULTIPLIER)

def get_secs(seconds=1):
  return seconds * config.SLEEP_TIME_MULTIPLIER

def drag_scroll(start_x, start_y, end_x, end_y, duration=0.5):
  device_action.drag(start_x, start_y, end_x, end_y, duration)
  return True

def click(img: str = None, confidence: float = 0.8, minSearch:float = 2, click: int = 1, interval: float = 0.1, text: str = "", boxes = None, region=None):
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
    device_action.click(center[0], center[1], clicks=click, interval=interval)
    return True

  if img is None:
    return False

  if region:
    btn = device_action.locate(img, confidence=confidence, minSearch=minSearch, region=region)
  else:
    btn = device_action.locate(img, confidence=confidence, minSearch=minSearch)
  if btn:
    if text:
      debug(text)
    device_action.click(btn[0], btn[1], clicks=click, interval=interval)
    return True

  return False

def remove_if_exists(lst, items):
  if isinstance(items, str):
    items = [items]

  for item in items:
    if item in lst:
      lst.remove(item)

def get_aptitude_index(aptitude):
  aptitude_order = ['g', 'f', 'e', 'd', 'c', 'b', 'a', 's']
  return aptitude_order.index(aptitude)

def check_race_suitability(race, aptitudes, min_surface_index, min_distance_index):
  race_surface = race["terrain"].lower()
  race_distance_type = race["distance"]["type"].lower()
  surface_key = f"surface_{race_surface}"
  distance_key = f"distance_{race_distance_type}"
  surface_apt = get_aptitude_index(aptitudes[surface_key])
  distance_apt = get_aptitude_index(aptitudes[distance_key])
  if surface_apt >= min_surface_index and distance_apt >= min_distance_index:
    debug(f"Race is suitable")
    return True
  else:
    debug(f"Race is not suitable")
    return False
