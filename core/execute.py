import pyautogui
import time
from PIL import ImageGrab

pyautogui.useImageNotFoundException(False)

import core.state as state
from core.state import check_support_card, check_failure, check_turn, check_mood, check_current_year, check_criteria, check_skill_pts, check_energy_level
from core.logic import do_something, all_values_equal
from utils.constants import MOOD_LIST, SCREEN_BOTTOM_REGION, SCREEN_MIDDLE_REGION, SKIP_BTN_BIG_REGION
from core.recognizer import is_btn_active, match_template, multi_match_templates
from utils.scenario import ura
from core.skill import buy_skill

templates = {
  "event": "assets/icons/event_choice_1.png",
  "inspiration": "assets/buttons/inspiration_btn.png",
  "next": "assets/buttons/next_btn.png",
  "cancel": "assets/buttons/cancel_btn.png",
  "tazuna": "assets/ui/tazuna_hint.png",
  "infirmary": "assets/buttons/infirmary_btn.png",
  "retry": "assets/buttons/retry_btn.png"
}

training_types = {
  "spd": "assets/icons/train_spd.png",
  "sta": "assets/icons/train_sta.png",
  "pwr": "assets/icons/train_pwr.png",
  "guts": "assets/icons/train_guts.png",
  "wit": "assets/icons/train_wit.png"
}

def click(img: str = None, confidence: float = 0.8, minSearch:float = 2, click: int = 1, text: str = "", boxes = None, region=None):
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
      print(text)
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
      print(text)
    pyautogui.moveTo(btn, duration=0.225)
    pyautogui.click(clicks=click)
    return True
  
  return False

def go_to_training():
  return click("assets/buttons/training_btn.png")

def check_training():
  results = {}

  fail_check_states="train","no_train","check_all"

  failcheck="check_all"
  margin=5
  for key, icon_path in training_types.items():
    pos = pyautogui.locateCenterOnScreen(icon_path, confidence=0.8, region=SCREEN_BOTTOM_REGION)
    if pos:
      pyautogui.moveTo(pos, duration=0.1)
      pyautogui.mouseDown()
      support_card_results = check_support_card()

      if key != "wit":
        if failcheck == "check_all":
          failure_chance = check_failure()
          if failure_chance > (state.MAX_FAILURE + margin):
            print("Failure rate too high skip to check wit")
            failcheck="no_train"
            failure_chance = state.MAX_FAILURE + margin
          elif failure_chance < (state.MAX_FAILURE - margin):
            print("Failure rate is low enough, skipping the rest of failure checks.")
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

      print(f"[{key.upper()}] → Total Supports {support_card_results['total_supports']}, Levels:{support_card_results['total_friendship_levels']} , Fail: {failure_chance}%")
      time.sleep(0.1)
  
  pyautogui.mouseUp()
  click(img="assets/buttons/back_btn.png")
  return results

def do_train(train):
  train_btn = pyautogui.locateCenterOnScreen(f"assets/icons/train_{train}.png", confidence=0.8, region=SCREEN_BOTTOM_REGION)
  if train_btn:
    pyautogui.tripleClick(train_btn, interval=0.1, duration=0.2)

def do_rest(energy_level):
  if state.NEVER_REST_ENERGY > 0 and energy_level > state.NEVER_REST_ENERGY:
    print(f"[INFO] Wanted to rest when energy was above {state.NEVER_REST_ENERGY}, retrying from beginning.")
    return
  rest_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_btn.png", confidence=0.8, region=SCREEN_BOTTOM_REGION)
  rest_summber_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=SCREEN_BOTTOM_REGION)

  if rest_btn:
    pyautogui.moveTo(rest_btn, duration=0.15)
    pyautogui.click(rest_btn)
  elif rest_summber_btn:
    pyautogui.moveTo(rest_summber_btn, duration=0.15)
    pyautogui.click(rest_summber_btn)

def do_recreation():
  recreation_btn = pyautogui.locateCenterOnScreen("assets/buttons/recreation_btn.png", confidence=0.8, region=SCREEN_BOTTOM_REGION)
  recreation_summer_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=SCREEN_BOTTOM_REGION)

  if recreation_btn:
    pyautogui.moveTo(recreation_btn, duration=0.15)
    pyautogui.click(recreation_btn)
  elif recreation_summer_btn:
    pyautogui.moveTo(recreation_summer_btn, duration=0.15)
    pyautogui.click(recreation_summer_btn)

def do_race(prioritize_g1 = False):
  click(img="assets/buttons/races_btn.png", minSearch=10)

  consecutive_cancel_btn = pyautogui.locateCenterOnScreen("assets/buttons/cancel_btn.png", minSearchTime=0.7, confidence=0.8)
  if state.CANCEL_CONSECUTIVE_RACE and consecutive_cancel_btn:
    click(img="assets/buttons/cancel_btn.png", text="[INFO] Already raced 3+ times consecutively. Cancelling race and doing training.")
    return False
  elif not state.CANCEL_CONSECUTIVE_RACE and consecutive_cancel_btn:
    click(img="assets/buttons/ok_btn.png", minSearch=0.7)

  time.sleep(0.7)
  found = race_select(prioritize_g1=prioritize_g1)
  if not found:
    print("[INFO] No race found.")
    return False

  race_prep()
  time.sleep(1)
  after_race()
  return True

def race_day():
  click(img="assets/buttons/race_day_btn.png", minSearch=10)
  
  click(img="assets/buttons/ok_btn.png")
  time.sleep(0.5)

  for i in range(2):
    click(img="assets/buttons/race_btn.png", minSearch=2)
    time.sleep(0.5)

  race_prep()
  time.sleep(1)
  after_race()

def race_select(prioritize_g1 = False):
  pyautogui.moveTo(x=560, y=680)

  time.sleep(0.2)

  if prioritize_g1:
    print("[INFO] Looking for G1 race.")
    for i in range(2):
      race_card = match_template("assets/ui/g1_race.png", threshold=0.9)

      if race_card:
        for x, y, w, h in race_card:
          region = (x, y, 310, 90)
          match_aptitude = pyautogui.locateCenterOnScreen("assets/ui/match_track.png", confidence=0.8, minSearchTime=0.7, region=region)
          if match_aptitude:
            print("[INFO] G1 race found.")
            pyautogui.moveTo(match_aptitude, duration=0.2)
            pyautogui.click()
            for i in range(2):
              click(img="assets/buttons/race_btn.png")
              time.sleep(0.5)
            return True
      
      for i in range(4):
        pyautogui.scroll(-300)
    
    return False
  else:
    print("[INFO] Looking for race.")
    for i in range(4):
      match_aptitude = pyautogui.locateCenterOnScreen("assets/ui/match_track.png", confidence=0.8, minSearchTime=0.7)
      if match_aptitude:
        print("[INFO] Race found.")
        pyautogui.moveTo(match_aptitude, duration=0.2)
        pyautogui.click(match_aptitude)

        for i in range(2):
          click(img="assets/buttons/race_btn.png")
          time.sleep(0.5)
        return True
      
      for i in range(4):
        pyautogui.scroll(-300)
    
    return False

def race_prep():
#  lock_icon = pyautogui.locateCenterOnScreen("assets/ui/lock_icon.png", confidence=0.9, minSearchTime=10, region=SCREEN_BOTTOM_REGION)
#  if not lock_icon:
#    print(f"lock icon not found trying to find view results")
  view_result_btn = pyautogui.locateCenterOnScreen("assets/buttons/view_results.png", confidence=0.8, minSearchTime=10, region=SCREEN_BOTTOM_REGION)
  pyautogui.click(view_result_btn)
  time.sleep(0.5)
  for i in range(2):
    pyautogui.tripleClick(interval=0.2)
    time.sleep(0.5)
  pyautogui.click()
  next_button = pyautogui.locateCenterOnScreen("assets/buttons/next_btn.png", confidence=0.9, minSearchTime=4, region=SCREEN_BOTTOM_REGION)
  if not next_button:
    print(f"Wouldn't be able to move onto the after race since there's no next button.")
    race_btn = pyautogui.locateCenterOnScreen("assets/buttons/race_btn.png", confidence=0.8, minSearchTime=10, region=SCREEN_BOTTOM_REGION)
    pyautogui.click(race_btn)
    time.sleep(2)
    race_exclamation_btn = pyautogui.locateCenterOnScreen("assets/buttons/race_exclamation_btn.png", confidence=0.9, minSearchTime=20)
    pyautogui.click(race_exclamation_btn)
    time.sleep(0.5)
    skip_btn = pyautogui.locateCenterOnScreen("assets/buttons/skip_btn.png", confidence=0.8, minSearchTime=2, region=SCREEN_BOTTOM_REGION)
    skip_btn_big = pyautogui.locateCenterOnScreen("assets/buttons/skip_btn_big.png", confidence=0.8, minSearchTime=2, region=SKIP_BTN_BIG_REGION)
    if not skip_btn_big and not skip_btn:
      skip_btn = pyautogui.locateCenterOnScreen("assets/buttons/skip_btn.png", confidence=0.8, minSearchTime=10, region=SCREEN_BOTTOM_REGION)
      skip_btn_big = pyautogui.locateCenterOnScreen("assets/buttons/skip_btn_big.png", confidence=0.8, minSearchTime=10, region=SKIP_BTN_BIG_REGION)
    if skip_btn:
      pyautogui.tripleClick(skip_btn, interval=0.2, duration=0.4)
    if skip_btn_big:
      pyautogui.tripleClick(skip_btn_big, interval=0.2, duration=0.4)
    time.sleep(3)
    if skip_btn:
      pyautogui.tripleClick(skip_btn, interval=0.2, duration=0.4)
    if skip_btn_big:
      pyautogui.tripleClick(skip_btn_big, interval=0.2, duration=0.4)
    time.sleep(0.5)
    if skip_btn:
      pyautogui.tripleClick(skip_btn, interval=0.2, duration=0.4)
    if skip_btn_big:
      pyautogui.tripleClick(skip_btn_big, interval=0.2, duration=0.4)
    time.sleep(3)
    skip_btn = pyautogui.locateCenterOnScreen("assets/buttons/skip_btn.png", confidence=0.8, minSearchTime=10, region=SCREEN_BOTTOM_REGION)
    pyautogui.tripleClick(skip_btn, interval=0.2, duration=0.4)
    #since we didn't get the trophy before, if we get it we close the trophy
    close_btn = pyautogui.locateCenterOnScreen("assets/buttons/close_btn.png", confidence=0.8, minSearchTime=10)
    pyautogui.tripleClick(close_btn, interval=0.2, duration=0.4)


def after_race():
  click(img="assets/buttons/next_btn.png", minSearch=5)
  time.sleep(0.3)
  pyautogui.click()
  click(img="assets/buttons/next2_btn.png", minSearch=5)

def auto_buy_skill():
  if check_skill_pts() < state.SKILL_PTS_CHECK:
    return

  click(img="assets/buttons/skills_btn.png")
  print("[INFO] Buying skills")
  time.sleep(0.5)

  if buy_skill():
    pyautogui.locateCenterOnScreen("assets/buttons/confirm_btn.png")
    click(img="assets/buttons/confirm_btn.png", minSearch=1, region=SCREEN_BOTTOM_REGION)
    time.sleep(0.5)
    click(img="assets/buttons/learn_btn.png", minSearch=1, region=SCREEN_BOTTOM_REGION)
    time.sleep(0.5)
    click(img="assets/buttons/close_btn.png", minSearch=2, region=SCREEN_MIDDLE_REGION)
    time.sleep(0.5)
    click(img="assets/buttons/back_btn.png")
  else:
    print("[INFO] No matching skills found. Going back.")
    click(img="assets/buttons/back_btn.png")

def career_lobby():
  # Program start
  while state.is_bot_running:
    screen = ImageGrab.grab()
    matches = multi_match_templates(templates, screen=screen)

    if click(boxes=matches["event"], text="[INFO] Event found, selecting top choice."):
      continue
    if click(boxes=matches["inspiration"], text="[INFO] Inspiration found."):
      continue
    if click(boxes=matches["next"]):
      continue
    if click(boxes=matches["cancel"]):
      continue
    if click(boxes=matches["retry"]):
      continue

    if not matches["tazuna"]:
      #print("[INFO] Should be in career lobby.")
      print(".", end="")
      continue

    energy_level, max_energy = check_energy_level()

    # infirmary always gives 20 energy, it's better to spend energy before going to the infirmary 99% of the time.
    if (max_energy - energy_level) > state.SKIP_INFIRMARY_UNLESS_MISSING_ENERGY:
      if matches["infirmary"]:
        if is_btn_active(matches["infirmary"][0]):
          click(boxes=matches["infirmary"][0], text="[INFO] Character debuffed, going to infirmary.")
          continue

    mood = check_mood()
    mood_index = MOOD_LIST.index(mood)
    minimum_mood = MOOD_LIST.index(state.MINIMUM_MOOD)
    minimum_mood_junior_year = MOOD_LIST.index(state.MINIMUM_MOOD_JUNIOR_YEAR)
    turn = check_turn()
    year = check_current_year()
    criteria = check_criteria()
    year_parts = year.split(" ")

    print("\n=======================================================================================\n")
    print(f"Year: {year}")
    print(f"Mood: {mood}")
    print(f"Turn: {turn}\n")

    # URA SCENARIO
    if year == "Finale Season" and turn == "Race Day":
      print("[INFO] URA Finale")
      if state.IS_AUTO_BUY_SKILL:
        auto_buy_skill()
      ura()
      for i in range(2):
        if click(img="assets/buttons/race_btn.png", minSearch=2):
          time.sleep(0.5)

      race_prep()
      time.sleep(1)
      after_race()
      continue

    # If calendar is race day, do race
    if turn == "Race Day" and year != "Finale Season":
      print("[INFO] Race Day.")
      if state.IS_AUTO_BUY_SKILL and year_parts[0] != "Junior":
        auto_buy_skill()
      race_day()
      continue

    # Mood check
    if year_parts[0] == "Junior":
      if mood_index < minimum_mood_junior_year:
        print("[INFO] Mood is low, trying recreation to increase mood")
        do_recreation()
        continue
    else:
      if mood_index < minimum_mood:
        print("[INFO] Mood is low, trying recreation to increase mood")
        do_recreation()
        continue

    # Check if goals is not met criteria AND it is not Pre-Debut AND turn is less than 10 AND Goal is already achieved
    if criteria.split(" ")[0] != "criteria" and year != "Junior Year Pre-Debut" and turn < 10 and criteria != "Goal Achievedl":
      race_found = do_race()
      if race_found:
        continue
      else:
        # If there is no race matching to aptitude, go back and do training instead
        click(img="assets/buttons/back_btn.png", minSearch=1, text="[INFO] Race not found. Proceeding to training.")
        time.sleep(0.5)

    # If Prioritize G1 Race is true, check G1 race every turn
    if state.PRIORITIZE_G1_RACE and year_parts[0] != "Junior" and len(year_parts) > 3 and year_parts[3] not in ["Jul", "Aug"]:
      g1_race_found = do_race(state.PRIORITIZE_G1_RACE)
      if g1_race_found:
        continue
      else:
        # If there is no G1 race, go back and do training
        click(img="assets/buttons/back_btn.png", minSearch=1, text="[INFO] G1 race not found. Proceeding to training.")
        time.sleep(0.5)

    # Check training button
    if not go_to_training():
      print("[INFO] Training button is not found.")
      continue

    # Last, do training
    time.sleep(0.5)
    results_training = check_training()

    best_training = do_something(results_training)
    if best_training:
      go_to_training()
      time.sleep(0.5)
      do_train(best_training)
    else:
      do_rest(energy_level)
    time.sleep(1)
