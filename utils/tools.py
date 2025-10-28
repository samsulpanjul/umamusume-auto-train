# tools
import cv2
import pyautogui
import time
import json

import core.config as config
import core.state as state
import core.bot as bot
import utils.constants as constants
from .log import error
from utils.log import info, warning, error, debug

def sleep(seconds=1):
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
  #??? minimum_mood_junior_year = constants.MOOD_LIST.index(config.MINIMUM_MOOD_JUNIOR_YEAR)

  state_object = state.CleanDefaultDict()
  state_object["current_mood"] = state.get_mood()
  mood_index = constants.MOOD_LIST.index(state_object["current_mood"])
  minimum_mood_index = constants.MOOD_LIST.index(config.MINIMUM_MOOD)
  state_object["mood_difference"] = mood_index - minimum_mood_index
  state_object["turn"] = state.get_turn()
  state_object["year"] = state.get_current_year()
  state_object["criteria"] = state.get_criteria()
  state_object["current_stats"] = state.get_current_stats()
  energy_level, max_energy = state.get_energy_level()
  state_object["energy_level"] = energy_level
  state_object["max_energy"] = max_energy

  if click(img="assets/buttons/full_stats.png", minSearch=get_secs(1)):
    sleep(0.5)
    state_object["aptitudes"] = state.get_aptitudes()
    click(img="assets/buttons/close_btn.png", minSearch=get_secs(1))

  if click("assets/buttons/training_btn.png", minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION):
    training_results = state.CleanDefaultDict()
    pyautogui.mouseDown()
    sleep(0.25)
    for name, image_path in constants.TRAINING_IMAGES.items():
      pos = pyautogui.locateCenterOnScreen(image_path, confidence=0.8, minSearchTime=get_secs(5), region=constants.SCREEN_BOTTOM_REGION)
      pyautogui.moveTo(pos, duration=0.1)
      sleep(0.15)
      training_data = state.get_training_data()
      support_card_data = state.get_support_card_data()
      training_results[name] = state.CleanDefaultDict()
      training_results[name].update(support_card_data, training_data)

    debug(f"Training results: {training_results}")

    pyautogui.mouseUp()
    click(img="assets/buttons/back_btn.png")
    state_object["training_results"] = training_results

  else:
    error("Couldn't click training button. Going back.")
    return {}

  return state_object

