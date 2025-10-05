# tools
import cv2
import pyautogui
import time
import core.state as state
import core.bot as bot
import utils.constants as constants
from core.state import get_training_data, get_support_card_data
from .log import error
from utils.log import info, warning, error, debug

def sleep(seconds=1):
  time.sleep(seconds * state.SLEEP_TIME_MULTIPLIER)

def get_secs(seconds=1):
  return seconds * state.SLEEP_TIME_MULTIPLIER

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
    pyautogui.click(clicks=click)
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
    pyautogui.click(clicks=click)
    return True

  return False

def collect_state():
  debug("Start state collection. Collecting stats.")
  state_object = {}
  state_object["current_stats"] = state.stat_state()

  if click("assets/buttons/training_btn.png", minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION):
    training_results = {}
    pyautogui.mouseDown()
    sleep(0.25)
    for name, image_path in constants.TRAINING_IMAGES.items():
      pos = pyautogui.locateCenterOnScreen(image_path, confidence=0.8, minSearchTime=get_secs(5), region=constants.SCREEN_BOTTOM_REGION)
      pyautogui.moveTo(pos, duration=0.1)

      training_data = get_training_data()
      training_results[name]={**training_data}
      continue
      support_card_data = get_support_card_data()
      training_results[name] = {
          **training_data,
          **support_card_data
      }
    debug(training_results)
    exit()
    #pyautogui.mouseUp()
    #click(img="assets/buttons/back_btn.png")
    state_object.update(training_results)
  else:
    error("Couldn't click training button. Going back.")
    return {}

  return state_object
