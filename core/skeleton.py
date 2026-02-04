import pyautogui
import os
import cv2

from utils.tools import sleep, get_secs, click
from core.state import collect_main_state, collect_training_state, clear_aptitudes_cache
from utils.shared import CleanDefaultDict
import core.config as config
from PIL import ImageGrab
from core.actions import Action
import utils.constants as constants
from scenarios.unity import unity_cup_function
from core.events import select_event
from core.claw_machine import play_claw_machine
from core.skill import buy_skill, init_skill_py

pyautogui.useImageNotFoundException(False)

import core.bot as bot
from utils.log import info, warning, error, debug, log_encoded, args, record_turn, VERSION
from utils.device_action_wrapper import BotStopException
import utils.device_action_wrapper as device_action

from core.strategies import Strategy
from utils.adb_actions import init_adb

def cache_templates(templates):
  cache={}
  image_read_color = cv2.IMREAD_COLOR
  for name, path in templates.items():
    img = cv2.imread(path, image_read_color)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    if img is None:
      warning(f"Image doesn't exist: {img}")
      continue
    cache[name] = img
  return cache

templates = {
  "next": "assets/buttons/next_btn.png",
  "next2": "assets/buttons/next2_btn.png",
  "event": "assets/icons/event_choice_1.png",
  "inspiration": "assets/buttons/inspiration_btn.png",
  "cancel": "assets/buttons/cancel_btn.png",
  "retry": "assets/buttons/retry_btn.png",
  "tazuna": "assets/ui/tazuna_hint.png",
  "infirmary": "assets/buttons/infirmary_btn.png",
  "claw_btn": "assets/buttons/claw_btn.png",
  "claw_btn_2": "assets/buttons/claw_btn_2.png",
  "ok_2_btn": "assets/buttons/ok_2_btn.png"
}

cached_templates = cache_templates(templates)

unity_templates = {
  "close_btn": "assets/buttons/close_btn.png",
  "unity_cup_btn": "assets/unity/unity_cup_btn.png",
  "unity_banner_mid_screen": "assets/unity/unity_banner_mid_screen.png"
}

cached_unity_templates = cache_templates(unity_templates)

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

LIMIT_TURNS = args.limit_turns
if LIMIT_TURNS is None:
  LIMIT_TURNS = 0

non_match_count = 0
action_count=0
last_state = CleanDefaultDict()

def career_lobby(dry_run_turn=False):
  global last_state, action_count, non_match_count
  non_match_count = 0
  action_count=0
  sleep(1)
  bot.PREFERRED_POSITION_SET = False
  constants.SCENARIO_NAME = ""
  clear_aptitudes_cache()
  strategy = Strategy()
  init_adb()
  init_skill_py()
  try:
    while bot.is_bot_running:
      sleep(1)
      device_action.flush_screenshot_cache()
      screenshot = device_action.screenshot()

      if non_match_count > 20:
        info("Career lobby stuck, quitting.")
        quit()
      if constants.SCENARIO_NAME == "":
        info("Trying to find what scenario we're on.")
        if device_action.locate_and_click("assets/unity/unity_cup_btn.png", min_search_time=get_secs(1)):
          constants.SCENARIO_NAME = "unity"
          info("Unity race detected, calling unity cup function. If this is not correct, please report this.")
          unity_cup_function()
          continue

      matches = device_action.match_cached_templates(cached_templates, region_ltrb=constants.GAME_WINDOW_BBOX, threshold=0.9, stop_after_first_match=True)
      def click_match(matches):
        if matches and len(matches) > 0:
          x, y, w, h = matches[0]
          cx = x + w // 2
          cy = y + h // 2
          return device_action.click(target=(cx, cy), text=f"Clicked match: {matches[0]}")
        return False

      # modify this portion to get event data out instead. Maybe call collect state or a partial version of it.
      if len(matches.get("event", [])) > 0:
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
      if matches.get("cancel", False):
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

      # adding skip function for claw machine
      if matches.get("claw_btn", False) or matches.get("claw_btn_2", False):
        if not config.USE_SKIP_CLAW_MACHINE:
          continue

        claw_match = ""
        if matches.get("claw_btn", False):
          claw_match = matches["claw_btn"][0]
        elif matches.get("claw_btn_2", False):
          claw_match = matches["claw_btn_2"][0]
        else:
          warning("Got into claw machine match but there's no match in both versions, this should never happen.")
          continue

        sleep(0.5)
        play_claw_machine(claw_match)
        info("Played claw machine.")
        non_match_count = 0
        continue

      if click_match(matches.get("ok_2_btn")):
        info("Pressed Okay button.")
        non_match_count = 0
        continue

      if constants.SCENARIO_NAME == "unity":
        unity_matches = device_action.match_cached_templates(cached_unity_templates, region_ltrb=constants.GAME_WINDOW_BBOX)
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
        non_match_count += 1
        continue
      else:
        info("Tazuna matched, moving to state collection.")
        if constants.SCENARIO_NAME == "":
          scenario_name = detect_scenario()
          info(f"Scenario detected: {scenario_name}, if this is not correct, please report this.")
          constants.SCENARIO_NAME = scenario_name
        non_match_count = 0
      device_action.flush_screenshot_cache()
      info(f"Bot version: {VERSION}")

      action = Action()
      state_obj = collect_main_state()
      if not validate_turn(state_obj):
        info("Couldn't read turn text correctly, retrying to avoid unnecessary races. If this keeps happening please report it.")
        continue

      if state_obj["turn"] == "Race Day":
        action.func = "do_race"
        action["is_race_day"] = True
        action["year"] = state_obj["year"]
        info(f"Race Day")
        if action.run():
          record_and_finalize_turn(state_obj, action)
          continue
        else:
          action.func = None
          del action.options["is_race_day"]
          del action.options["year"]

      if config.PRIORITIZE_MISSIONS_OVER_G1 and config.DO_MISSION_RACES_IF_POSSIBLE and state_obj["race_mission_available"]:
        debug(f"Mission race logic entered with priority.")
        action.func = "do_race"
        action["race_name"] = "any"
        action["race_image_path"] = "assets/ui/match_track.png"
        action["race_mission_available"] = True
        buy_skill(state_obj, action_count, race_check=True)
        if action.run():
          record_and_finalize_turn(state_obj, action)
          continue
        else:
          action.func = None
          action.options.pop("race_name", None)
          action.options.pop("race_image_path", None)
          action.options.pop("race_mission_available", None)

      # check and do scheduled races. Dirty version, should be cleaned up.
      action = strategy.check_scheduled_races(state_obj, action)
      if "race_name" in action.options:
        action.func = "do_race"
        info(f"Taking action: {action.func}")
        buy_skill(state_obj, action_count, race_check=True)
        if action.run():
          record_and_finalize_turn(state_obj, action)
          continue
        else:
          action.func = None
          action.options.pop("race_name", None)
          action.options.pop("race_image_path", None)

      if (not config.PRIORITIZE_MISSIONS_OVER_G1) and config.DO_MISSION_RACES_IF_POSSIBLE and state_obj["race_mission_available"]:
        debug(f"Mission race logic entered.")
        action.func = "do_race"
        action["race_name"] = "any"
        action["race_image_path"] = "assets/ui/match_track.png"
        action["prioritize_missions_over_g1"] = config.PRIORITIZE_MISSIONS_OVER_G1
        action["race_mission_available"] = True
        buy_skill(state_obj, action_count, race_check=True)
        if action.run():
          record_and_finalize_turn(state_obj, action)
          continue
        else:
          action.func = None
          action.options.pop("race_name", None)
          action.options.pop("race_image_path", None)
          action.options.pop("race_mission_available", None)

      # check and do goal races. Dirty version, should be cleaned up.
      if not "Achieved" in state_obj["criteria"]:
        action = strategy.decide_race_for_goal(state_obj, action)
        if action.func == "do_race":
          info(f"Taking action: {action.func}")
          buy_skill(state_obj, action_count, race_check=True)
          if action.run():
            record_and_finalize_turn(state_obj, action)
            continue
          else:
            action.func = None

      training_function_name = strategy.get_training_template(state_obj)['training_function']

      state_obj = collect_training_state(state_obj, training_function_name)

      # go to skill buy function every turn, conditions are handled inside the function.
      buy_skill(state_obj, action_count)

      log_encoded(f"{state_obj}", "Encoded state: ")
      info(f"State: {state_obj}")

      action = strategy.decide(state_obj, action)

      if isinstance(action, dict):
        error(f"Strategy returned an invalid action. Please report this line. Returned structure: {action}")
      elif action.func == "no_action":
        info("State is invalid, retrying...")
        debug(f"State: {state_obj}")
      elif action.func == "skip_turn":
        info("Skipping turn, retrying...")
      else:
        info(f"Taking action: {action.func}")

        # go to skill buy function if we come across a do_race function, conditions are handled in buy_skill
        if action.func == "do_race":
          buy_skill(state_obj, action_count, race_check=True)
        if dry_run_turn:
          info("Dry run turn, quitting.")
          quit()
        elif not action.run():
          if action.available_actions:  # Check if the list is not empty
            action.available_actions.pop(0)
          else:
            warning("No more actions remaining in available_actions. Retrying turn to fix.")
            non_match_count += 1
            continue

          if action.get("race_mission_available") and action.func == "do_race":
            info(f"Couldn't match race mission to aptitudes, trying next action.")
          else:
            info(f"Action {action.func} failed, trying other actions.")
          info(f"Available actions: {action.available_actions}")

          for function_name in action.available_actions:
            sleep(1)
            info(f"Trying action: {function_name}")
            action.func = function_name
            # go to skill buy function if we come across a do_race function, conditions are handled in buy_skill
            if action.func == "do_race":
              buy_skill(state_obj, action_count, race_check=True)
            if action.run():
              break
            info(f"Action {function_name} failed, trying other actions.")

        record_and_finalize_turn(state_obj, action)
        continue

  except BotStopException:
    info("Bot stopped by user.")
    return

def record_and_finalize_turn(state_obj, action):
  global last_state, action_count
  if args.debug is not None:
    record_turn(state_obj, last_state, action)
    last_state = state_obj

  action_count += 1
  if LIMIT_TURNS > 0:
    if action_count >= LIMIT_TURNS:
      info(f"Completed {action_count} actions, stopping bot as requested.")
      quit()

def validate_turn(state):
  if state["turn"] == -1:
    return False
  return True
