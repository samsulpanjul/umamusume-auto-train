import pyautogui
import os

from utils.tools import sleep, get_secs, click
from core.state import collect_state, CleanDefaultDict
import core.config as config
from PIL import ImageGrab
from core.actions import Action
import utils.constants as constants

pyautogui.useImageNotFoundException(False)

import core.bot as bot
from utils.log import info, warning, error, debug, log_encoded, log_dir, args
from utils.device_action_wrapper import BotStopException
import utils.device_action_wrapper as device_action

from core.strategies import Strategy

last_state = CleanDefaultDict()
def record_turn(state, action):
  global last_state
  if state["year"] == "Junior Year Pre-Debut":
    turn = f"{state["year"], state["turn"]}"
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
        diffs += f"{stat}: {state["mood_difference"] - last_state["mood_difference"]} | "
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

templates = {
  "event": "assets/icons/event_choice_1.png",
  "inspiration": "assets/buttons/inspiration_btn.png",
  "next": "assets/buttons/next_btn.png",
  "cancel": "assets/buttons/cancel_btn.png",
  "tazuna": "assets/ui/tazuna_hint.png",
  "infirmary": "assets/buttons/infirmary_btn.png",
  "retry": "assets/buttons/retry_btn.png"
}

PREFERRED_POSITION_SET = False
def career_lobby(dry_run_turn=False):
  sleep(1)
  global PREFERRED_POSITION_SET
  PREFERRED_POSITION_SET = False
  strategy = Strategy()
  action_count = 0

  if strategy is None:
    info("No training strategy provided using the default.")
    strategy = default_strategy
  non_match_count = 0
  try:
    while bot.is_bot_running:
      device_action.flush_screenshot_cache()
      screenshot = device_action.screenshot()
      matches = device_action.multi_match_templates(templates, screenshot=screenshot)

      def click_match(matches):
        if len(matches) > 0:
          x, y, w, h = matches[0]
          offset_x = constants.GAME_WINDOW_REGION[0]
          cx = offset_x + x + w // 2
          cy = y + h // 2
          return device_action.click(target=(cx, cy), text=f"Clicked match: {matches[0]}")
        return False

      if click_match(matches.get("event")):
        info("Pressed event.")
        non_match_count = 0
        continue
      if click_match(matches.get("inspiration")):
        info("Pressed inspiration.")
        non_match_count = 0
        continue
      if click_match(matches.get("next")):
        info("Pressed next.")
        non_match_count = 0
        continue
      if matches["cancel"]:
        clock_icon = device_action.match_template("assets/icons/clock_icon.png", screenshot=screenshot, threshold=0.9)
        if clock_icon:
          info("Lost race, wait for input.")
        elif click_match(matches.get("cancel")):
          info("Pressed cancel.")
        non_match_count = 0
        continue
      if click_match(matches.get("retry")):
        info("Pressed retry.")
        non_match_count = 0
        continue

      if not matches.get("tazuna"):
        print(".", end="")
        sleep(2)
        non_match_count += 1
        if non_match_count > 20:
          info("No tazuna matched for 20 tries, quitting.")
          quit()
        continue
      else:
        info("Tazuna matched, moving to state collection.")
        non_match_count = 0

      state_obj = collect_state(config)

      log_encoded(f"{state_obj}", "Encoded state: ")
      debug(f"{state_obj}")

      action = strategy.decide(state_obj)

      if isinstance(action, dict):
        error(f"Strategy returned an invalid action. Please report this line. Returned structure: {action}")
      elif action.func == "no_action":
        info("State is invalid, retrying...")
        debug(f"State: {state_obj}")
      else:
        info(f"Taking action: {action.func}")
        if dry_run_turn:
          info("Dry run turn, quitting.")
          quit()
        if args.debug:
          record_turn(state_obj, action)
        if not action.run():
          info(f"Action {action.func} failed, trying other actions.")
          action.available_actions.remove(action.func)
          for function_name in action.available_actions:
            action.func = function_name
            if action.run():
              break
        limit_turns = 0
        if limit_turns > 0:
          action_count += 1
          if action_count >= limit_turns:
            info(f"Completed {action_count} actions, stopping bot as requested.")
            quit()
      sleep(2)
  except BotStopException:
    info("Bot stopped by user.")
    return
