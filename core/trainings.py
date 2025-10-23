# core/trainings.py
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

  action.func = "do_training"
  action.options["training_name"] = best_key
  return action

def most_valuable_training(state=None):
  """
  Pick the training with the highest overall stat/benefit.
  """
  return { "name": "do_training", "option": "wit" }

def most_stat_gain(state, training_template, action):
  """
  Choose training with the highest weighted stat gains.
  Uses stat_weights from config to calculate value.
  """
  training_results = state.get('training_results', {})
  
  # Filter by failure rate
  filtered_results = {
    k: v for k, v in training_results.items()
    if int(v.get("failure", 0)) <= config.MAX_FAILURE
  }

  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return action

  best_training = None
  best_value = -1

  # Calculate weighted stat gains for each training
  for training_name, training_data in filtered_results.items():
    stat_gains = training_data.get('stat_gains', {})
    total_value = 0
    
    # Sum up weighted stat gains
    for stat, gain in stat_gains.items():
      weight = config.STAT_WEIGHTS.get(stat, 1.0)
      total_value += gain * weight
    
    debug(f"{training_name} -> total_value={total_value}, gains={stat_gains}")
    
    if total_value > best_value:
      best_value = total_value
      best_training = (training_name, training_data)

  if best_training:
    best_key, best_data = best_training
    info(f"Best stat gain training: {best_key.upper()} with weighted value {best_value:.1f} and {best_data.get('failure', 0)}% fail chance")
    
    action.func = "do_training"
    action.options["training_name"] = best_key
  
  return action


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
