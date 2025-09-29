import pyautogui
from utils.tools import sleep, get_secs
from PIL import ImageGrab

pyautogui.useImageNotFoundException(False)

import core.state as state
from core.recognizer import multi_match_templates
from utils.log import info, warning, error, debug

from core.strategies import Strategy

default_strategy = {
  "name": "default",
  "config": {
    "Junior Year Pre-Debut": "max_out_friendships",
    "Junior Year Late Aug": "try_not_to_rest",
    "Classic Year Early Jan": "most_support_cards",
    "Classic Year Early Jul": "try_not_to_rest",
    "Senior Year Early Jan": "most_valuable_training",
    "URA Finale": "try_not_to_rest"
  }
}

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
def career_lobby(strategy_config):
  global PREFERRED_POSITION_SET
  PREFERRED_POSITION_SET = False
  strategy = Strategy(strategy_config)

  if strategy is None:
    info("No training strategy provided using the default.")
    strategy = default_strategy

  while state.is_bot_running:
    screen = ImageGrab.grab()
    matches = multi_match_templates(templates, screen=screen)

    if click(boxes=matches.get("event"), text="[INFO] Event found, selecting top choice."):
      continue
    if click(boxes=matches.get("inspiration"), text="[INFO] Inspiration found."):
      continue
    if click(boxes=matches.get("next")):
      continue
    if click(boxes=matches.get("cancel")):
      continue
    if click(boxes=matches.get("retry")):
      continue

    if not matches.get("tazuna"):
      print(".", end="")
      continue
    else:
      info("Tazuna matched, moving to state collection.")

    state_obj = state.collect_state()

    action = strategy.decide(state_obj)

    if action is None:
      error("No action was returned by strategy. Not doing anything.")
    else:
      action.run()

    sleep(1)
