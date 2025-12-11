import pyautogui
import os

from utils.tools import sleep, get_secs, click
from core.state import collect_state, CleanDefaultDict
import core.config as config
from PIL import ImageGrab
from core.actions import Action
import utils.constants as constants
from scenarios.unity import unity_cup_function
from core.events import select_event

pyautogui.useImageNotFoundException(False)

import core.bot as bot
from utils.log import info, warning, error, debug, log_encoded, log_dir, args
from utils.device_action_wrapper import BotStopException
import utils.device_action_wrapper as device_action

from core.strategies import Strategy
from utils.adb_actions import init_adb

last_state = CleanDefaultDict()
def record_turn(state, action):
  global last_state
  if state["year"] == "Junior Year Pre-Debut":
    turn = f"{state['year']}, {state['turn']}"
  else:
    turn = state["year"]
  changes = ""
  tracked_stats = ["current_stats", "current_mood", "energy_level", "max_energy", "aptitudes"]
  if last_state == {}:
    for stat in tracked_stats:
      changes += f"{stat}: {state[stat]} | "
    last_state = state

    with open(os.path.join(log_dir, "year_changes.txt"), "a", encoding="utf-8") as f:
      f.write(f"{turn}\n")
      f.write(f"First turn stats:{changes}\n")
      f.write("--------------------------------\n")

    with open(os.path.join(log_dir, "actions_taken.txt"), "a", encoding="utf-8") as f:
      f.write(f"{turn}\n")
      f.write(f"Action: {action}\n")
      f.write("--------------------------------\n")
    return
  
  diffs = ""
  for stat in tracked_stats:
    if state[stat] != last_state[stat]:
      changes += f"{stat}: {state[stat]} | "
      if stat == "energy_level" or stat == "max_energy":
        diffs += f"{stat}: {state[stat] - last_state[stat]:+g} | "
      elif stat == "current_mood":
        diffs += f"{stat}: {state['mood_difference'] - last_state['mood_difference']} | "
      elif stat == "current_stats":
        for stat_name, stat_value in state[stat].items():
          diffs += f"{stat_name}: {stat_value - last_state[stat][stat_name]} | "

  with open(os.path.join(log_dir, "year_changes.txt"), "a", encoding="utf-8") as f:
    f.write(f"{turn}\n")
    f.write(f"Changed stats:{changes} \n")
    f.write(f"Diffs: {diffs} \n")
    f.write("--------------------------------\n")
  
  with open(os.path.join(log_dir, "actions_taken.txt"), "a", encoding="utf-8") as f:
    f.write(f"{turn}\n")
    f.write(f"Action: {action}\n")
    f.write("--------------------------------\n")

  last_state = state

templates = {
  "event": "assets/icons/event_choice_1.png",
  "inspiration": "assets/buttons/inspiration_btn.png",
  "next": "assets/buttons/next_btn.png",
  "next2": "assets/buttons/next2_btn.png",
  "cancel": "assets/buttons/cancel_btn.png",
  "tazuna": "assets/ui/tazuna_hint.png",
  "infirmary": "assets/buttons/infirmary_btn.png",
  "retry": "assets/buttons/retry_btn.png"
}

UNITY_TEMPLATES = {
  "close_btn": "assets/buttons/close_btn.png",
  "unity_cup_btn": "assets/unity/unity_cup_btn.png",
  "unity_banner_mid_screen": "assets/unity/unity_banner_mid_screen.png"
}

def detect_scenario():
  screenshot = device_action.screenshot()
  if not device_action.locate_and_click("assets/buttons/details_btn.png", confidence=0.75, min_search_time=get_secs(2), region_ltrb=constants.SCREEN_TOP_BBOX):
    error("Details button not found.")
    raise ValueError("Details button not found.")
  sleep(0.5)
  screenshot = device_action.screenshot()
  # find files in assets/scenario_banner make them the same as templates
  scenario_banners = {f.split(".")[0]: f"assets/scenario_banner/{f}" for f in os.listdir("assets/scenario_banner") if f.endswith(".png")}
  matches = device_action.multi_match_templates(scenario_banners, screenshot=screenshot, stop_after_first_match=True)
  device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(1))
  sleep(0.5)
  for name, match in matches.items():
    if match:
      return name
  raise ValueError("No scenario banner matched.")

PREFERRED_POSITION_SET = False
LIMIT_TURNS = args.limit_turns
if LIMIT_TURNS is None:
  LIMIT_TURNS = 0
def career_lobby(dry_run_turn=False):
  sleep(1)
  global PREFERRED_POSITION_SET
  PREFERRED_POSITION_SET = False
  constants.SCENARIO_NAME = ""
  strategy = Strategy()
  action_count = 0
  
  init_adb()

  non_match_count = 0
  try:
    while bot.is_bot_running:
      device_action.flush_screenshot_cache()
      screenshot = device_action.screenshot()
      matches = device_action.multi_match_templates(templates, screenshot=screenshot, threshold=0.9)

      if non_match_count > 20:
        info("Career lobby stuck, quitting.")
        quit()
      if constants.SCENARIO_NAME == "":
        if device_action.locate_and_click("assets/unity/unity_cup_btn.png", min_search_time=get_secs(1)):
          constants.SCENARIO_NAME = "unity"
          info("Unity race detected, calling unity cup function. If this is not correct, please report this.")
          unity_cup_function()
          continue

      def click_match(matches):
        if len(matches) > 0:
          x, y, w, h = matches[0]
          offset_x = constants.GAME_WINDOW_REGION[0]
          cx = offset_x + x + w // 2
          cy = y + h // 2
          return device_action.click(target=(cx, cy), text=f"Clicked match: {matches[0]}")
        return False

      # modify this portion to get event data out instead. Maybe call collect state or a partial version of it.
      if len(matches.get("event")) > 0:
        select_event()
        continue
      if click_match(matches.get("inspiration")):
        info("Pressed inspiration.")
        non_match_count = 0
        continue
      if click_match(matches.get("next")):
        info("Pressed next.")
        non_match_count = 0
        continue
      if click_match(matches.get("next2")):
        info("Pressed next2.")
        non_match_count = 0
        continue
      if matches["cancel"]:
        clock_icon = device_action.match_template("assets/icons/clock_icon.png", screenshot=screenshot, threshold=0.9)
        if clock_icon:
          info("Lost race, wait for input.")
          non_match_count += 1
        elif click_match(matches.get("cancel")):
          info("Pressed cancel.")
          non_match_count = 0
        continue
      if click_match(matches.get("retry")):
        info("Pressed retry.")
        non_match_count = 0
        continue

      if constants.SCENARIO_NAME == "unity":
        unity_matches = device_action.multi_match_templates(UNITY_TEMPLATES, screenshot=screenshot)
        if click_match(unity_matches.get("unity_cup_btn")):
          info("Pressed unity cup.")
          unity_cup_function()
          non_match_count = 0
          continue
        if click_match(unity_matches.get("close_btn")):
          info("Pressed close.")
          non_match_count = 0
          continue
        if click_match(unity_matches.get("unity_banner_mid_screen")):
          info("Unity banner mid screen found. Starting over.")
          non_match_count = 0
          continue

      if not matches.get("tazuna"):
        print(".", end="")
        sleep(2)
        non_match_count += 1
        continue
      else:
        info("Tazuna matched, moving to state collection.")
        if constants.SCENARIO_NAME == "":
          scenario_name = detect_scenario()
          info(f"Scenario detected: {scenario_name}, if this is not correct, please report this.")
          constants.SCENARIO_NAME = scenario_name
        non_match_count = 0

      state_obj = collect_state(config)

      log_encoded(f"{state_obj}", "Encoded state: ")
      info(f"State: {state_obj}")

      action = strategy.decide(state_obj)

      if isinstance(action, dict):
        error(f"Strategy returned an invalid action. Please report this line. Returned structure: {action}")
      elif action.func == "no_action":
        info("State is invalid, retrying...")
        debug(f"State: {state_obj}")
      else:
        info(f"Taking action: {action.func}")
        if action.func == "skip_turn":
          info("Skipping turn, retrying...")
          continue
        if dry_run_turn:
          info("Dry run turn, quitting.")
          quit()
        if args.debug:
          record_turn(state_obj, action)
        if action.func == "no_action":
          info("No action, retrying...")
          continue
        if not action.run():
          info(f"Action {action.func} failed, trying other actions.")
          info(f"Available actions: {action.available_actions}")
          action.available_actions.remove(action.func)
          for function_name in action.available_actions:
            info(f"Trying action: {function_name}")
            action.func = function_name
            if action.run():
              break
            info(f"Action {function_name} failed, trying other actions.")

        

        if LIMIT_TURNS > 0:
          action_count += 1
          if action_count >= LIMIT_TURNS:
            info(f"Completed {action_count} actions, stopping bot as requested.")
            quit()
      sleep(2)
  except BotStopException:
    info("Bot stopped by user.")
    return
