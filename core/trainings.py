# core/trainings.py
"""
'guts': {'failure': 0,
          'guts': {'friendship_levels': {'blue': 0,
                                         'gray': 0,
                                         'green': 0,
                                         'max': 0,
                                         'yellow': 0},
                   'hints': 0,
                   'supports': 0}, (imagine the same structure for each support type)
          'total_friendship_levels': {'blue': 0,
                                      'gray': 0,
                                      'green': 0,
                                      'max': 0,
                                      'yellow': 0},
          'total_hints': 0,
          'total_rainbow_friends': 0,
          'total_supports': 0,}
"""

from utils.log import error, info, warning, debug
from core.actions import Action
import core.config as config

def max_out_friendships(state=None):
  """
  Prioritize training options that maximize support/friendship gains.
  """

  return { "name": "do_training", "option": "wit" }

def most_support_cards(state=None):
  """
  Choose training with the most support cards present.
  """
  action = Action()
  debug("most_support_cards")
  debug(state)
  training_results = state['training_results']
  filtered_results = {
    k: v for k, v in training_results.items()
    if int(v["failure"]) <= config.MAX_FAILURE
  }

  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return

  best_training = max(filtered_results.items(), key=training_score)

  best_key, best_data = best_training

  info(f"Best training: {best_key.upper()} with {best_data['total_supports']} support cards and {best_data['failure']}% fail chance")

  action.name = "do_training"
  action.options["training_name"] = best_key
  return action

def most_valuable_training(state=None):
  """
  Pick the training with the highest overall stat/benefit.
  """
  return { "name": "do_training", "option": "wit" }


PRIORITY_WEIGHTS_LIST={
  "HEAVY": 0.75,
  "MEDIUM": 0.5,
  "LIGHT": 0.25,
  "NONE": 0
}

def training_score(x):
  global PRIORITY_WEIGHTS_LIST
  priority_weight = PRIORITY_WEIGHTS_LIST[config.PRIORITY_WEIGHT]
  base = x[1]["total_supports"]
  if x[1]["total_hints"] > 0:
      base += 0.5
  multiplier = 1 + config.PRIORITY_EFFECTS_LIST[get_stat_priority(x[0])] * priority_weight
  total = base * multiplier

  # Debug output
  debug(f"{x[0]} -> base={base}, multiplier={multiplier}, total={total}, priority={get_stat_priority(x[0])}")

  return (total, -get_stat_priority(x[0]))

def get_stat_priority(stat_key: str) -> int:
  if stat_key in config.PRIORITY_STAT:
    return config.PRIORITY_STAT.index(stat_key)
  else:
    return 999
