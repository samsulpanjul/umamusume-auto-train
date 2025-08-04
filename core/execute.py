import pyautogui
import time
import json

pyautogui.useImageNotFoundException(False)

from core.state import check_support_card, check_failure, check_turn, check_mood, check_current_year, check_criteria, get_event_name
from core.logic import do_something
from utils.constants import MOOD_LIST
from core.recognizer import is_infirmary_active, match_template
from utils.scenario import ura
from core.events import get_optimal_choice

with open("config.json", "r", encoding="utf-8") as file:
  config = json.load(file)

MINIMUM_MOOD = config["minimum_mood"]
PRIORITIZE_G1_RACE = config["prioritize_g1_race"]
USE_OPTIMAL_EVENT_CHOICES = config["use_optimal_event_choices"]

def click(img, confidence = 0.8, minSearch = 2, click = 1, text = ""):
  btn = pyautogui.locateCenterOnScreen(img, confidence=confidence, minSearchTime=minSearch)
  if btn:
    if text:
      print(text)
    pyautogui.moveTo(btn, duration=0.175)
    pyautogui.click(clicks=click)
    return True
  
  return False

def go_to_training():
  return click("assets/buttons/training_btn.png")

def check_training():
  training_types = {
    "spd": "assets/icons/train_spd.png",
    "sta": "assets/icons/train_sta.png",
    "pwr": "assets/icons/train_pwr.png",
    "guts": "assets/icons/train_guts.png",
    "wit": "assets/icons/train_wit.png"
  }
  results = {}

  for key, icon_path in training_types.items():
    pos = pyautogui.locateCenterOnScreen(icon_path, confidence=0.8)
    if pos:
      pyautogui.moveTo(pos, duration=0.1)
      pyautogui.mouseDown()
      support_counts = check_support_card()
      total_support = sum(support_counts.values())
      failure_chance = check_failure()
      results[key] = {
        "support": support_counts,
        "total_support": total_support,
        "failure": failure_chance
      }
      print(f"[{key.upper()}] → {support_counts}, Fail: {failure_chance}%")
      time.sleep(0.1)
  
  pyautogui.mouseUp()
  click(img="assets/buttons/back_btn.png")
  return results

def do_train(train):
  train_btn = pyautogui.locateCenterOnScreen(f"assets/icons/train_{train}.png", confidence=0.8)
  if train_btn:
    pyautogui.tripleClick(train_btn, interval=0.1, duration=0.2)

def do_rest():
  rest_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_btn.png", confidence=0.8)
  rest_summber_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8)

  if rest_btn:
    pyautogui.moveTo(rest_btn, duration=0.15)
    pyautogui.click(rest_btn)
  elif rest_summber_btn:
    pyautogui.moveTo(rest_summber_btn, duration=0.15)
    pyautogui.click(rest_summber_btn)

def do_recreation():
  recreation_btn = pyautogui.locateCenterOnScreen("assets/buttons/recreation_btn.png", confidence=0.8)
  recreation_summer_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8)

  if recreation_btn:
    pyautogui.moveTo(recreation_btn, duration=0.15)
    pyautogui.click(recreation_btn)
    time.sleep(1)
    
    aoi_event = pyautogui.locateCenterOnScreen("assets/ui/aoi_event.png", confidence=0.8)
    if aoi_event:
      pyautogui.moveTo(aoi_event, duration=0.15)
      pyautogui.click(aoi_event)

  elif recreation_summer_btn:
    pyautogui.moveTo(recreation_summer_btn, duration=0.15)
    pyautogui.click(recreation_summer_btn)

def do_race(prioritize_g1 = False):
  click(img="assets/buttons/races_btn.png", minSearch=10)
  click(img="assets/buttons/ok_btn.png", minSearch=0.7)

  found = race_select(prioritize_g1=prioritize_g1)
  if not found:
    print("[INFO] No race found.")
    return False

  race_prep()
  time.sleep(1)
  after_race()
  return True

def event_choice():
  event_choice_1 = pyautogui.locateCenterOnScreen("assets/icons/event_choice_1.png", confidence=0.8, minSearchTime=0.2)

  if not event_choice_1:
    return False
  
  if not USE_OPTIMAL_EVENT_CHOICES:
    print("[INFO] Event found, automatically select top choice.")
    pyautogui.moveTo(event_choice_1, duration=0.2)
    pyautogui.click(event_choice_1)
    return True
  
  event_name = get_event_name()

  if event_name:
    total_choices, choice = get_optimal_choice(event_name)
    
    if not total_choices:
      pyautogui.moveTo(event_choice_1, duration=0.2)
      pyautogui.click(event_choice_1)
      return True
    
    print(f"[INFO] Selecting optimal choice: {choice}")
    pyautogui.moveTo(300, 750 - 111 * (total_choices - choice), duration=0.175)
    pyautogui.click()
    return True
  
  return False


def race_day():
  click(img="assets/buttons/race_day_btn.png", minSearch=10)
  
  click(img="assets/buttons/ok_btn.png", minSearch=0.7)
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
              race_btn = pyautogui.locateCenterOnScreen("assets/buttons/race_btn.png", confidence=0.8, minSearchTime=2)
              if race_btn:
                pyautogui.moveTo(race_btn, duration=0.2)
                pyautogui.click(race_btn)
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
          race_btn = pyautogui.locateCenterOnScreen("assets/buttons/race_btn.png", confidence=0.8, minSearchTime=2)
          if race_btn:
            pyautogui.moveTo(race_btn, duration=0.2)
            pyautogui.click(race_btn)
            time.sleep(0.5)
        return True
      
      for i in range(4):
        pyautogui.scroll(-300)
    
    return False

def race_prep():
  view_result_btn = pyautogui.locateCenterOnScreen("assets/buttons/view_results.png", confidence=0.8, minSearchTime=20)
  if view_result_btn:
    pyautogui.click(view_result_btn)
    time.sleep(0.5)
    for i in range(3):
      pyautogui.tripleClick(interval=0.2)
      time.sleep(0.5)

def after_race():
  click(img="assets/buttons/next_btn.png", minSearch=5)
  time.sleep(0.3)
  pyautogui.click()
  click(img="assets/buttons/next2_btn.png", minSearch=5)

def career_lobby():
  # Program start
  while True:
    # First check, event
    if event_choice():
      continue

    # Second check, inspiration
    if click(img="assets/buttons/inspiration_btn.png", minSearch=0.2, text="[INFO] Inspiration found."):
      continue

    if click(img="assets/buttons/next_btn.png", minSearch=0.2):
      continue

    if click(img="assets/buttons/cancel_btn.png", minSearch=0.2):
      continue

    # Check if current menu is in career lobby
    tazuna_hint = pyautogui.locateCenterOnScreen("assets/ui/tazuna_hint.png", confidence=0.8, minSearchTime=0.2)

    if tazuna_hint is None:
      print("[INFO] Should be in career lobby.")
      continue

    time.sleep(0.5)

    # Check if there is debuff status
    debuffed = pyautogui.locateOnScreen("assets/buttons/infirmary_btn2.png", confidence=0.9, minSearchTime=1)
    if debuffed:
      if is_infirmary_active((debuffed.left, debuffed.top, debuffed.width, debuffed.height)):
        pyautogui.click(debuffed)
        print("[INFO] Character has debuff, go to infirmary instead.")
        continue

    mood = check_mood()
    mood_index = MOOD_LIST.index(mood)
    minimum_mood = MOOD_LIST.index(MINIMUM_MOOD)
    turn = check_turn()
    year = check_current_year()
    criteria = check_criteria()
    
    print("\n=======================================================================================\n")
    print(f"Year: {year}")
    print(f"Mood: {mood}")
    print(f"Turn: {turn}\n")

    # URA SCENARIO
    if year == "Finale Season" and turn == "Race Day":
      print("[INFO] URA Finale")
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
      race_day()
      continue

    # Mood check
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
        click(img="assets/buttons/back_btn.png", text="[INFO] Race not found. Proceeding to training.")
        time.sleep(0.5)

    year_parts = year.split(" ")
    # If Prioritize G1 Race is true, check G1 race every turn
    if PRIORITIZE_G1_RACE and year_parts[0] != "Junior" and len(year_parts) > 3 and year_parts[3] not in ["Jul", "Aug"]:
      g1_race_found = do_race(PRIORITIZE_G1_RACE)
      if g1_race_found:
        continue
      else:
        # If there is no G1 race, go back and do training
        click(img="assets/buttons/back_btn.png", text="[INFO] G1 race not found. Proceeding to training.")
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
      do_rest()
    time.sleep(1)
