import pyautogui
from utils.tools import sleep, get_secs, drag_scroll
from PIL import ImageGrab

pyautogui.useImageNotFoundException(False)

import re
import core.state as state

from core.state import stat_state, check_support_card, check_failure, check_turn, check_mood, check_current_year, check_criteria, check_skill_pts, check_energy_level, get_race_type, check_status_effects, check_aptitudes
from core.logic import do_something, decide_race_for_goal, remove_hint
from core.ocr import extract_text


from utils.log import info, warning, error, debug
import utils.constants as constants
from utils.screenshot import enhanced_screenshot, enhanced_existing_screenshot

import numpy as np


from core.recognizer import is_btn_active, match_template, multi_match_templates, save_template_cache
from utils.scenario import ura
from core.skill import buy_skill

templates = {
  "event": "assets/icons/event_choice_1.png",
  "inspiration": "assets/buttons/inspiration_btn.png",
  "next": "assets/buttons/next_btn.png",
  "next2": "assets/buttons/next2_btn.png",
  "cancel": "assets/buttons/cancel_btn.png",
  "tazuna": "assets/ui/tazuna_hint.png",
  "infirmary": "assets/buttons/infirmary_btn.png",
  "hint": "assets/hint_icons/hint.png",
  "retry": "assets/buttons/retry_btn.png"
}

event_exceptions = ['assets/event_icons/yaeno1.png', 'assets/event_icons/yaeno2.png']

training_types = {
  "spd": "assets/icons/train_spd.png",
  "sta": "assets/icons/train_sta.png",
  "pwr": "assets/icons/train_pwr.png",
  "guts": "assets/icons/train_guts.png",
  "wit": "assets/icons/train_wit.png"
}


def click(img: str = None, confidence: float = 0.8, minSearch:float = 2, click: int = 1, text: str = "", boxes = None, region=None):
  if state.stop_event.is_set():
    return False
  if not state.is_bot_running:
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
    pyautogui.click(clicks=click, interval=0.15)
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
    pyautogui.click(clicks=click, interval=0.15)
    return True

  return False

def go_to_training():
  return click("assets/buttons/training_btn.png")

def check_where_hints():
  hints = []
  for key, icon_path in list(training_types.items())[2:]:
    if match_template("assets/icons/support_hint.png", region = constants.HINT_BBOXES[key], use_cache = False):
      hints.append((key, icon_path))
      info(f"Hint at {key} found!")
  return hints

def check_training_hints(year, current_stats):
  if state.stop_event.is_set():
      return {}

  results = {}


  # failcheck enum "train","no_train","check_all"
  failcheck="check_all"
  margin=5

  for key, icon_path in list(training_types.items())[:2]:
    if state.stop_event.is_set():
      return {}

    pos = pyautogui.locateCenterOnScreen(icon_path, confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
    if pos:
      pyautogui.moveTo(pos, duration=0.1)
      pyautogui.mouseDown()
      support_card_results = check_support_card(with_hint_cards = True)

      if key != "wit":
        if failcheck == "check_all":
          failure_chance = check_failure()
          if failure_chance > (state.MAX_FAILURE + margin):
            info("Failure rate too high skip to check wit")
            failcheck="no_train"
            failure_chance = state.MAX_FAILURE + margin
          elif failure_chance < (state.MAX_FAILURE - margin):
            info("Failure rate is low enough, skipping the rest of failure checks.")
            failcheck="train"
            failure_chance = 0
        elif failcheck == "no_train":
          failure_chance = state.MAX_FAILURE + margin
        elif failcheck == "train":
          failure_chance = 0
      else:
        if failcheck == "train":
          failure_chance = 0
        else:
          failure_chance = check_failure()

      support_card_results["failure"] = failure_chance
      results[key] = support_card_results

      debug(f"[{key.upper()}] → Total Supports {support_card_results['total_supports']}, Levels:{support_card_results['total_friendship_levels']} , Fail: {failure_chance}%")
      sleep(0.2)

  # Populate with null data
  for key, icon_path in list(training_types.items())[2:]:
    support_card_results = {}
    support_card_results["failure"] = 100
    support_card_results["total_supports"] = 0
    support_card_results["total_friendship_levels"] = 0
    for key in training_types.keys():
      support_card_results[key] = {}
      support_card_results[key]["supports"] = 0
      support_card_results[key]["hints"] = 0
      support_card_results[key]["friendship_levels"]={}
      for friend_level in ["gray", "blue", "yellow", "green", "max"]:
        support_card_results[key]["friendship_levels"][friend_level] = 0
    results[key] = support_card_results
  
  # Check trainings with hints
  remaining_trainings = check_where_hints()
  for key, icon_path in remaining_trainings:
    if state.stop_event.is_set():
      return {}

    pos = pyautogui.locateCenterOnScreen(icon_path, confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
    if pos:
      pyautogui.moveTo(pos, duration=0.1)
      pyautogui.mouseDown()
      support_card_results = check_support_card(with_hint_cards = True)

      if key != "wit":
        if failcheck == "check_all":
          failure_chance = check_failure()
          if failure_chance > (state.MAX_FAILURE + margin):
            info("Failure rate too high skip to check wit")
            failcheck="no_train"
            failure_chance = state.MAX_FAILURE + margin
          elif failure_chance < (state.MAX_FAILURE - margin):
            info("Failure rate is low enough, skipping the rest of failure checks.")
            failcheck="train"
            failure_chance = 0
        elif failcheck == "no_train":
          failure_chance = state.MAX_FAILURE + margin
        elif failcheck == "train":
          failure_chance = 0
      else:
        if failcheck == "train":
          failure_chance = 0
        else:
          failure_chance = check_failure()

      support_card_results["failure"] = failure_chance
      results[key] = support_card_results

      debug(f"[{key.upper()}] → Total Supports {support_card_results['total_supports']}, Levels:{support_card_results['total_friendship_levels']} , Fail: {failure_chance}%")
      sleep(0.2)

  pos = pyautogui.locateCenterOnScreen(training_types["wit"], confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if pos:
    pyautogui.moveTo(pos, duration=0.1)
    sleep(0.1)

  pyautogui.mouseUp()
  return results

def check_training_fans(year, current_stats):
  if state.stop_event.is_set():
    return {}

  results = {}

  # failcheck enum "train","no_train","check_all"
  failcheck="check_all"
  margin=5

  training_id_cap = 2
  if "Junior Year" in year and current_stats.get("spd", 0) < 300:
    info("SPD is below 300 in Junior Year, prioritizing SPD training.")
    training_id_cap = 1
  if "Classic Year" in year and current_stats.get("spd", 0) < 500:
    info("SPD is below 500 in Classic Year, prioritizing SPD training.")
    training_id_cap = 1
  if "Senior Year" in year and current_stats.get("spd", 0) < 620:
    info("SPD is below 620 in Senior Year, prioritizing SPD training.")
    training_id_cap = 1

  for key, icon_path in list(training_types.items())[:training_id_cap]:
    if state.stop_event.is_set():
      return {}

    pos = pyautogui.locateCenterOnScreen(icon_path, confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
    if pos:
      pyautogui.moveTo(pos, duration=0.1)
      pyautogui.mouseDown()
      support_card_results = check_support_card()

      if key != "wit":
        if failcheck == "check_all":
          failure_chance = check_failure()
          if failure_chance > (state.MAX_FAILURE + margin):
            info("Failure rate too high skip to check wit")
            failcheck="no_train"
            failure_chance = state.MAX_FAILURE + margin
          elif failure_chance < (state.MAX_FAILURE - margin):
            info("Failure rate is low enough, skipping the rest of failure checks.")
            failcheck="train"
            failure_chance = 0
        elif failcheck == "no_train":
          failure_chance = state.MAX_FAILURE + margin
        elif failcheck == "train":
          failure_chance = 0
      else:
        if failcheck == "train":
          failure_chance = 0
        else:
          failure_chance = check_failure()

      support_card_results["failure"] = failure_chance
      results[key] = support_card_results

      debug(f"[{key.upper()}] → Total Supports {support_card_results['total_supports']}, Levels:{support_card_results['total_friendship_levels']} , Fail: {failure_chance}%")
      sleep(0.1)

  for key, icon_path in list(training_types.items())[training_id_cap:]:
    support_card_results = {}
    support_card_results["failure"] = 100
    support_card_results["total_supports"] = 0
    support_card_results["total_friendship_levels"] = 0
    for key in training_types.keys():
      support_card_results[key] = {}
      support_card_results[key]["supports"] = 0
      support_card_results[key]["hints"] = 0
      support_card_results[key]["friendship_levels"]={}
      for friend_level in ["gray", "blue", "yellow", "green", "max"]:
        support_card_results[key]["friendship_levels"][friend_level] = 0
    results[key] = support_card_results

  #LMAO click guts to reset stamina button so you can actually click it
  pos = pyautogui.locateCenterOnScreen(training_types["guts"], confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if pos:
    pyautogui.moveTo(pos, duration=0.1)
    sleep(0.1)

  pyautogui.mouseUp()
  #click(img="assets/buttons/back_btn.png")
  return results

def do_train(train):
  if state.stop_event.is_set():
    return
  train_btn = pyautogui.locateOnScreen(f"assets/icons/train_{train}.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if train_btn:
    click(boxes=train_btn, click=3)

def do_rest(energy_level):
  if state.stop_event.is_set():
    return
  if state.NEVER_REST_ENERGY > 0 and energy_level > state.NEVER_REST_ENERGY:
    info(f"Wanted to rest when energy was above {state.NEVER_REST_ENERGY}, retrying from beginning.")
    return 
  rest_btn = pyautogui.locateOnScreen("assets/buttons/rest_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  rest_summber_btn = pyautogui.locateOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if rest_btn:
    click(boxes=rest_btn)
  elif rest_summber_btn:
    click(boxes=rest_summber_btn)
  else:
    info("Neither rest button found")

def do_recreation():
  if state.stop_event.is_set():
    return
  recreation_btn = pyautogui.locateOnScreen("assets/buttons/recreation_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  recreation_summer_btn = pyautogui.locateOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)

  if recreation_btn:
    click(boxes=recreation_btn)
  elif recreation_summer_btn:
    click(boxes=recreation_summer_btn)

def do_race(prioritize_g1 = False, img = None):
  if state.stop_event.is_set():
    return False
  click(img="assets/buttons/races_btn.png", minSearch=get_secs(10))

  consecutive_cancel_btn = pyautogui.locateCenterOnScreen("assets/buttons/cancel_btn.png", minSearchTime=get_secs(0.7), confidence=0.8)
  if state.CANCEL_CONSECUTIVE_RACE and consecutive_cancel_btn:
    click(img="assets/buttons/cancel_btn.png", text="[INFO] Already raced 3+ times consecutively. Cancelling race and doing training.")
    return False
  elif not state.CANCEL_CONSECUTIVE_RACE and consecutive_cancel_btn:
    click(img="assets/buttons/ok_btn.png", minSearch=get_secs(0.7))

  sleep(0.7)
  found = race_select(prioritize_g1=prioritize_g1, img=img)
  if not found:
    if img is not None:
      info(f"{img} not found.")
    else:
      info("Race not found.")
    return False

  race_prep()
  sleep(0.7)
  after_race()
  return True

def race_day():
  if state.stop_event.is_set():
    return
  click(img="assets/buttons/race_day_btn.png", minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)

  click(img="assets/buttons/ok_btn.png")
  sleep(0.2)

  #move mouse off the race button so that image can be matched
#  pyautogui.moveTo(x=400, y=400)

  for i in range(2):
    if state.stop_event.is_set():
      return
    if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
      click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
    sleep(0.2)

  race_prep()
  sleep()
  after_race()

def race_select(prioritize_g1 = False, img = None):
  if state.stop_event.is_set():
    return False

  if prioritize_g1:
    info(f"Looking for {img}.")
    for i in range(2):
      if state.stop_event.is_set():
        return False
      if click(img=f"assets/races/{img}.png", minSearch=get_secs(0.7), text=f"{img} found.", region=constants.RACE_LIST_BOX_REGION):
        for i in range(2):
          if state.stop_event.is_set():
            return False
          if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
            click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
          sleep(0.2)
        return True
      drag_scroll(constants.RACE_SCROLL_BOTTOM_MOUSE_POS, -270)

    return False
  else:
    pyautogui.moveTo(constants.SCROLLING_SELECTION_MOUSE_POS)

    sleep(0.3)
    info("Looking for race.")
    for i in range(4):
      if state.stop_event.is_set():
        return False
      match_aptitude = pyautogui.locateOnScreen("assets/ui/match_track.png", confidence=0.8, minSearchTime=get_secs(0.7))

      if match_aptitude:
        # locked avg brightness = 163
        # unlocked avg brightness = 230
        if not is_btn_active(match_aptitude, treshold=200):
          info("Race found, but it's locked.")
          return False
        info("Race found.")
        click(boxes=match_aptitude)

        for i in range(2):
          if state.stop_event.is_set():
            return False
          if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
            click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
          sleep(0.2)
        return True
      drag_scroll(constants.RACE_SCROLL_BOTTOM_MOUSE_POS, -270)

    return False

def race_prep():
  global PREFERRED_POSITION_SET

  if state.stop_event.is_set():
    return

  if state.POSITION_SELECTION_ENABLED:
    # these two are mutually exclusive, so we only use preferred position if positions by race is not enabled.
    if state.ENABLE_POSITIONS_BY_RACE:
      click(img="assets/buttons/info_btn.png", minSearch=get_secs(5), region=constants.SCREEN_TOP_REGION)
      sleep(0.2)
      #find race text, get part inside parentheses using regex, strip whitespaces and make it lowercase for our usage
      race_info_text = get_race_type()
      match_race_type = re.search(r"\(([^)]+)\)", race_info_text)
      race_type = match_race_type.group(1).strip().lower() if match_race_type else None
      click(img="assets/buttons/close_btn.png", minSearch=get_secs(2), region=constants.SCREEN_BOTTOM_REGION)

      if race_type != None:
        position_for_race = state.POSITIONS_BY_RACE[race_type]
        info(f"Selecting position {position_for_race} based on race type {race_type}")
        click(img="assets/buttons/change_btn.png", minSearch=get_secs(4), region=constants.SCREEN_MIDDLE_REGION)
        click(img=f"assets/buttons/positions/{position_for_race}_position_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
        click(img="assets/buttons/confirm_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
    elif not PREFERRED_POSITION_SET:
      click(img="assets/buttons/change_btn.png", minSearch=get_secs(6), region=constants.SCREEN_MIDDLE_REGION)
      click(img=f"assets/buttons/positions/{state.PREFERRED_POSITION}_position_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
      click(img="assets/buttons/confirm_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
      PREFERRED_POSITION_SET = True

  view_result_btn = pyautogui.locateCenterOnScreen("assets/buttons/view_results.png", confidence=0.8, minSearchTime=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
  click("assets/buttons/view_results.png", click=3)
  sleep(0.2)
  pyautogui.click()
  sleep(0.1)
  pyautogui.moveTo(constants.SCROLLING_SELECTION_MOUSE_POS)
  for i in range(2):
    if state.stop_event.is_set():
      return
    pyautogui.tripleClick(interval=0.2)
    sleep(0.2)
  pyautogui.click()
  next_button = pyautogui.locateCenterOnScreen("assets/buttons/next_btn.png", confidence=0.9, minSearchTime=get_secs(4), region=constants.SCREEN_BOTTOM_REGION)
  if not next_button:
    info(f"Wouldn't be able to move onto the after race since there's no next button.")
    if click("assets/buttons/race_btn.png", confidence=0.8, minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION):
      info(f"Went into the race, sleep for {get_secs(10)} seconds to allow loading.")
      sleep(10)
      if not click("assets/buttons/race_exclamation_btn.png", confidence=0.8, minSearch=get_secs(10)):
        info("Couldn't find \"Race!\" button, looking for alternative version.")
        click("assets/buttons/race_exclamation_btn_portrait.png", confidence=0.8, minSearch=get_secs(10))
      sleep(0.2)
      skip_btn = pyautogui.locateOnScreen("assets/buttons/skip_btn.png", confidence=0.8, minSearchTime=get_secs(2), region=constants.SCREEN_BOTTOM_REGION)
      skip_btn_big = pyautogui.locateOnScreen("assets/buttons/skip_btn_big.png", confidence=0.8, minSearchTime=get_secs(2), region=constants.SKIP_BTN_BIG_REGION_LANDSCAPE)
      if not skip_btn_big and not skip_btn:
        warning("Coulnd't find skip buttons at first search.")
        skip_btn = pyautogui.locateOnScreen("assets/buttons/skip_btn.png", confidence=0.8, minSearchTime=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
        skip_btn_big = pyautogui.locateOnScreen("assets/buttons/skip_btn_big.png", confidence=0.8, minSearchTime=get_secs(10), region=constants.SKIP_BTN_BIG_REGION_LANDSCAPE)
      if skip_btn:
        click(boxes=skip_btn, click=3)
      if skip_btn_big:
        click(boxes=skip_btn_big, click=3)
      sleep(3)
      if skip_btn:
        click(boxes=skip_btn, click=3)
      if skip_btn_big:
        click(boxes=skip_btn_big, click=3)
      sleep(0.2)
      if skip_btn:
        click(boxes=skip_btn, click=3)
      if skip_btn_big:
        click(boxes=skip_btn_big, click=3)
      sleep(3)
      skip_btn = pyautogui.locateOnScreen("assets/buttons/skip_btn.png", confidence=0.8, minSearchTime=get_secs(5), region=constants.SCREEN_BOTTOM_REGION)
      click(boxes=skip_btn, click=3)
      #since we didn't get the trophy before, if we get it we close the trophy
      close_btn = pyautogui.locateOnScreen("assets/buttons/close_btn.png", confidence=0.8, minSearchTime=get_secs(5))
      click(boxes=close_btn, click=3)
      info("Finished race skipping job.")

def after_race():
  if state.stop_event.is_set():
    return
  click(img="assets/buttons/next_btn.png", minSearch=get_secs(1))
  sleep(0.2)
  pyautogui.click()
  click(img="assets/buttons/next2_btn.png", minSearch=get_secs(1))

def auto_buy_skill():
  info(f"Attempting to buy skill.")
  if state.stop_event.is_set():
    return
  if check_skill_pts() < state.SKILL_PTS_CHECK:
    info(f"Not enough skill points to buy skill, need at least {state.SKILL_PTS_CHECK}, have {check_skill_pts()}, skipping.")
    return

  click(img="assets/buttons/skills_btn.png")
  info("Buying skills")
  sleep(0.2)

  if buy_skill():
    pyautogui.locateCenterOnScreen("assets/buttons/confirm_btn.png")
    click(img="assets/buttons/confirm_btn.png", minSearch=get_secs(1), region=constants.SCREEN_BOTTOM_REGION)
    sleep(0.2)
    click(img="assets/buttons/learn_btn.png", minSearch=get_secs(1), region=constants.SCREEN_BOTTOM_REGION)
    sleep(0.2)
    click(img="assets/buttons/close_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
    sleep(0.2)
    click(img="assets/buttons/back_btn.png")
  else:
    info("No matching skills found. Going back.")
    click(img="assets/buttons/back_btn.png")

import time 

PREFERRED_POSITION_SET = False
def career_lobby():
  # Program start
  info(f"Mode is {state.FARM_MODE}")
  global PREFERRED_POSITION_SET
  PREFERRED_POSITION_SET = False
  while state.is_bot_running and not state.stop_event.is_set():
    screen = ImageGrab.grab()
    screen_arr = np.array(screen)
    matches = multi_match_templates(templates, screen=screen)
    if len(matches["event"]) > 1:
      info("event found")
      if click(boxes=match_template("assets/event_icons/yaeno1.png", threshold = 0.95, abort_condition = True), text="Yaeno event found, want medium corners, going with second choice"):
        continue
      if click(boxes=match_template("assets/event_icons/yaeno2.png", threshold = 0.95, abort_condition = True), text="Yaeno event found, want PTO, going with second choice"):
        continue
      sleep(0.1)
      click(boxes=matches["event"], text="Event with multiple options found, selecting top choice.")
      continue
    if click(boxes=matches["inspiration"], text="Inspiration found."):
      continue
    if click(boxes=matches["next"]):
      continue
    if click(boxes=matches["next2"]):
      continue
    if click(boxes=matches["cancel"]):
      continue
    if "hint" in matches and matches["hint"]:
      screenshot = enhanced_existing_screenshot(screen_arr, constants.HINT_TEXT_REGION)
      text = extract_text(screenshot)
      info(f"Found hint: {text}")
      remove_hint(text)
      continue
    if click(boxes=matches["retry"]):
      race_prep()
      sleep(0.6)
      after_race()
      continue

    if not matches["tazuna"]:
      #info("Should be in career lobby.")
      print(".", end="")
      continue

    energy_level, max_energy = check_energy_level()

    mood = check_mood()
    mood_index = constants.MOOD_LIST.index(mood)
    minimum_mood = constants.MOOD_LIST.index(state.MINIMUM_MOOD)
    minimum_mood_junior_year = constants.MOOD_LIST.index(state.MINIMUM_MOOD_JUNIOR_YEAR)
    turn = check_turn()
    year = check_current_year()
    criteria = check_criteria()
    year_parts = year.split(" ")

    print("\n=======================================================================================\n")
    info(f"Year: {year}")
    info(f"Mood: {mood}")
    info(f"Turn: {turn}")
    info(f"Criteria: {criteria}")
    info(f"Skill points: {check_skill_pts()}")
    print("\n=======================================================================================\n")

    # URA SCENARIO
    if year == "Finale Season" and turn == "Race Day":
      info("URA Finale")
      if state.IS_AUTO_BUY_SKILL:
        auto_buy_skill()
      ura()
      for i in range(2):
        if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
          click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
        sleep(0.2)

      race_prep()
      sleep(0.6)
      after_race()
      save_template_cache()
      continue

    # If calendar is race day, do race
    if turn == "Race Day" and year != "Finale Season":
      info("Race Day.")
      if state.IS_AUTO_BUY_SKILL and year_parts[0] != "Junior":
        auto_buy_skill()
      race_day()
      continue

    # If Prioritize G1 Race is true, check G1 race every turn
    if state.PRIORITIZE_G1_RACE and "Pre-Debut" not in year and len(year_parts) > 3 and year_parts[3] not in ["Jul", "Aug"]:
      race_done = False
      for race_list in state.RACE_SCHEDULE:
        if state.stop_event.is_set():
          break
        if len(race_list):
          if race_list['year'] in year and race_list['date'] in year:
            debug(f"Race now, {race_list['name']}, {race_list['year']} {race_list['date']}")
            if state.IS_AUTO_BUY_SKILL and year_parts[0] != "Junior":
              auto_buy_skill()
            if do_race(state.PRIORITIZE_G1_RACE, img=race_list['name']):
              race_done = True
              break
            else:
              click(img="assets/buttons/back_btn.png", minSearch=get_secs(1), text=f"{race_list['name']} race not found. Proceeding to training.")
              sleep(0.2)
      if race_done:
        continue
        
    skipped_infirmary=False
    if matches["infirmary"] and is_btn_active(matches["infirmary"][0]):
      sleep(0.2)
      info("Trying to do infirmary, check again")
      check_infirmary_again = match_template(templates["infirmary"], abort_condition = True)
      if check_infirmary_again and is_btn_active(check_infirmary_again[0]):
        # infirmary always gives 20 energy, it's better to spend energy before going to the infirmary 99% of the time.
        if max(0, (max_energy - energy_level)) >= state.SKIP_INFIRMARY_UNLESS_MISSING_ENERGY:
          info(f"Infirmary located: {matches["infirmary"][0]}")
          click(boxes=matches["infirmary"][0], text="Character debuffed, going to infirmary.")
          continue
        else:
          info("Skipping infirmary because of high energy.")
          skipped_infirmary=True
      else:
        continue
  
    # Mood check
    if year_parts[0] == "Junior":
      mood_check = minimum_mood_junior_year
    else:
      mood_check = minimum_mood
    if mood_index < mood_check:
      if skipped_infirmary:
        info("Since we skipped infirmary due to energy, check full stats for statuses.")
        if click(img="assets/buttons/full_stats.png", minSearch=get_secs(1)):
          sleep(0.2)
          conditions, total_severity = check_status_effects()
          click(img="assets/buttons/close_btn.png", minSearch=get_secs(1))
          if total_severity > 1:
            info("Severe condition found, visiting infirmary even though we will waste some energy.")
            click(boxes=matches["infirmary"][0])
            continue
        else:
          warning("Coulnd't find full stats button.")
      else:
        info("Mood is low, trying recreation to increase mood")
        do_recreation()
        continue

    # Check if we need to race for goal
    if not "Achieved" in criteria:
      if state.APTITUDES == {}:
        sleep(0.1)
        if click(img="assets/buttons/full_stats.png", minSearch=get_secs(1)):
          sleep(0.2)
          check_aptitudes()
          click(img="assets/buttons/close_btn.png", minSearch=get_secs(1))
      keywords = ("fan", "Maiden", "Progress")

      prioritize_g1, race_name = decide_race_for_goal(year, turn, criteria, keywords)
      info(f"prioritize_g1: {prioritize_g1}, race_name: {race_name}")
      if race_name:
        if race_name == "any":
          race_found = do_race(prioritize_g1, img=None)
        else:
          race_found = do_race(prioritize_g1, img=race_name)
        if race_found:
          continue
        else:
          # If there is no race matching to aptitude, go back and do training instead
          click(img="assets/buttons/back_btn.png", minSearch=get_secs(1), text="Proceeding to training.")
          sleep(0.)

    if energy_level < state.SKIP_TRAINING_ENERGY:
      info(f"Energy level {energy_level} less than {state.SKIP_TRAINING_ENERGY}, resting.")
      do_rest(energy_level)
      sleep(0.2)
      continue

    # Check training button
    if not go_to_training():
      debug("Training button is not found.")
      continue

    # Last, do training
    sleep(0.2)
    current_stats = stat_state()
    if state.FARM_MODE == "hints":
      results_training = check_training_hints(year, current_stats)
    else:
      results_training = check_training_fans(year, current_stats)


    best_training = do_something(results_training, current_stats)
    if best_training:
      do_train(best_training)
    else:
      click(img="assets/buttons/back_btn.png")
      sleep(0.2)
      do_rest(energy_level)
    info
    sleep(0.2)
