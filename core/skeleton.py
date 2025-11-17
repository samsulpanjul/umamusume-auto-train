import pyautogui
from utils.tools import sleep, get_secs, click
from core.state import collect_state
import core.config as config
from PIL import ImageGrab
from core.actions import Action

pyautogui.useImageNotFoundException(False)

import core.bot as bot
from core.recognizer import multi_match_templates, match_template
from utils.log import info, warning, error, debug, log_encoded

from core.strategies import Strategy

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
def career_lobby():
  sleep(1)
  global PREFERRED_POSITION_SET
  PREFERRED_POSITION_SET = False
  strategy = Strategy()
  action_count = 0

  if strategy is None:
    info("No training strategy provided using the default.")
    strategy = default_strategy

  while bot.is_bot_running:
    screen = ImageGrab.grab()
    matches = multi_match_templates(templates, screen=screen)

    if click(boxes=matches.get("event"), text="[INFO] Event found, selecting top choice."):
      continue
    if click(boxes=matches.get("inspiration"), text="[INFO] Inspiration found."):
      continue
    if click(boxes=matches.get("next")):
      continue
    if matches["cancel"]:
      clock_icon = match_template("assets/icons/clock_icon.png", threshold=0.9)
      if matches["retry"]:
        info("Lost race, wait for input.")
        continue
      else:
        info("else lost race wait for input")
        click(boxes=matches.get("cancel"))
        continue
    if click(boxes=matches.get("retry")):
      continue

    if not matches.get("tazuna"):
      print(".", end="")
      continue
    else:
      info("Tazuna matched, moving to state collection.")

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
      if action.func == "do_rest":
        action["energy_level"] = state_obj["energy_level"]
      action.run()
      limit_turns = 14
      if limit_turns > 0:
        action_count += 1
        if action_count >= limit_turns:
          info(f"Completed {action_count} actions, stopping bot as requested.")
          quit()

    sleep(2)
