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

from utils.log import error, info, warning
from core.actions import Action
from core.logic import training_score

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
  filtered_results = {
    k: v for k, v in results.items()
    if int(v["failure"]) <= state.MAX_FAILURE
  }

  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return 

  best_training = max(filtered_results.items(), key=training_score)

  best_key, best_data = best_training

  info(f"Best training: {best_key.upper()} with {best_data['total_supports']} support cards and {best_data['failure']}% fail chance")

  if state["energy_level"] > state.NEVER_REST_ENERGY:
    action.name = "do_training"
    action.options["training_name"] = best_key
    return action
  else:
    return action

def most_valuable_training(state=None):
  """
  Pick the training with the highest overall stat/benefit.
  """
  return { "name": "do_training", "option": "wit" }
