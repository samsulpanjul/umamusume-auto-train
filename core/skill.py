from utils.tools import sleep, get_secs
import pyautogui
import Levenshtein

import utils.constants as constants

from utils.log import info, warning, error, debug
from utils.screenshot import enhanced_screenshot, are_screenshots_same
from core.ocr import extract_text
from core.recognizer import is_btn_active, compare_brightness
import utils.device_action_wrapper as device_action

import core.config as config

previous_action_count = -1

def init_skill_py():
  global previous_action_count
  previous_action_count = -1

def buy_skill(state, action_count, race_check=False):
  global previous_action_count
  debug(f"Skill buy: {action_count}, {previous_action_count}, {race_check}")
  if (config.IS_AUTO_BUY_SKILL and state["current_stats"]["sp"] >= config.SKILL_PTS_CHECK):
    pass
  else:
    return False
  if config.CHECK_SKILL_BEFORE_RACES and race_check and (action_count > previous_action_count):
    debug(f"Passed race check condition.")
    pass
  elif (action_count - previous_action_count) < config.SKILL_CHECK_TURNS:
    info("Hasn't been enough turns since last skill buy. Not trying.")
    return False

  previous_action_count = action_count
  device_action.locate_and_click("assets/buttons/skills_btn.png", min_search_time=get_secs(2))
  sleep(1)
  shopping_list=[]
  while True:
    screenshot1 = device_action.screenshot(region_ltrb=constants.SCROLLING_SKILL_SCREEN_BBOX)
    buy_skill_icons = device_action.match_template("assets/icons/buy_skill.png", screenshot1, threshold=0.9)
    debug(f"icon locations: {buy_skill_icons}")
    x1, y1, x2, y2 = constants.SCROLLING_SKILL_SCREEN_BBOX

    if buy_skill_icons:
      for x, y, w, h in buy_skill_icons:
        # mutate local coordinates to world coordinates
        x = x + x1
        y = y + y1
        region = (x - 420, y - 40, w + 275, h + 5)
        screenshot = enhanced_screenshot(region)
        text = extract_text(screenshot)
        debug(f"Extracted skill text: {text}")
        if is_skill_match(text, config.SKILL_LIST):
          button_region = (x, y, w, h)
          screenshot = device_action.screenshot(region_xywh=button_region)
          if compare_brightness(template_path="assets/icons/buy_skill.png", other=screenshot, brightness_diff_threshold=0.20):
            info(f"Buying {text}.")
            shopping_list.append(text)
            device_action.click(target=(x + 5, y + 5), duration=0.15)
          else:
            info(f"{text} found but not enough skill points.")
    sleep(0.5)
    debug(f"Scrolling skills...")
    device_action.swipe(constants.SKILL_SCROLL_BOTTOM_MOUSE_POS, constants.SKILL_SCROLL_TOP_MOUSE_POS)
    device_action.click(constants.SKILL_SCROLL_TOP_MOUSE_POS, duration=0)
    sleep(0.25)
    screenshot2 = device_action.screenshot(region_ltrb=constants.SCROLLING_SKILL_SCREEN_BBOX)
    if are_screenshots_same(screenshot1, screenshot2, diff_threshold=5):
      if len(shopping_list) > 0:
        info(f"Found skills, shopping list: {shopping_list}")
        device_action.locate_and_click("assets/buttons/confirm_btn.png", min_search_time=get_secs(3))
        sleep(0.5)
        device_action.locate_and_click("assets/buttons/learn_btn.png", min_search_time=get_secs(3))
        sleep(0.5)
        device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(4))
        device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
        return
      else:
        info(f"Reached end of skill screen. Returning.")
        device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
        return

def is_skill_match(text: str, skill_list: list[str], threshold: float = 0.9) -> bool:
  for skill in skill_list:
    similarity = Levenshtein.ratio(text.lower(), skill.lower())
    if similarity >= threshold:
      return True
  return False