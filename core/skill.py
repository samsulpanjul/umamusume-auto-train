from utils.tools import sleep, drag_scroll
import pyautogui
import Levenshtein

import utils.constants as constants

from utils.log import info, warning, error, debug
from utils.screenshot import enhanced_screenshot
from core.ocr import extract_text
from core.recognizer import match_template, is_btn_active

import core.config as config

def buy_skill():
  start_x_y = constants.SCROLLING_SELECTION_MOUSE_POS
  end_x_y = (start_x_y[0], start_x_y[1] - 450)
  device_action.click(target=start_x_y, duration=0.15)
  found = False
  
  for i in range(10):
    if i > 8:
      sleep(0.5)
    buy_skill_icon = match_template("assets/icons/buy_skill.png", threshold=0.9)

    if buy_skill_icon:
      for x, y, w, h in buy_skill_icon:
        region = (x - 420, y - 40, w + 275, h + 5)
        screenshot = enhanced_screenshot(region)
        text = extract_text(screenshot)
        if is_skill_match(text, config.SKILL_LIST):
          button_region = (x, y, w, h)
          if is_btn_active(button_region):
            info(f"Buy {text}")
            device_action.click(target=(x + 5, y + 5), duration=0.15)
            found = True
          else:
            info(f"{text} found but not enough skill points.")


    device_action.drag(start_x_y=start_x_y, end_x_y=end_x_y, duration=0.5)

  return found

def is_skill_match(text: str, skill_list: list[str], threshold: float = 0.8) -> bool:
  for skill in skill_list:
    similarity = Levenshtein.ratio(text.lower(), skill.lower())
    if similarity >= threshold:
      return True
  return False