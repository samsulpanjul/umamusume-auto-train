# core/trainings.py
from utils.log import error, info, warning, debug
from core.actions import Action
import core.config as config

def max_out_friendships(state=None):
  """
  Prioritize training options that maximize support/friendship gains.
  """

  return { "name": "do_training", "option": "wit" }

def most_support_cards(state, training_template, action):
  """
  Choose training with the most support cards present.
  Eliminates training types where the primary stat is at cap.
  Allows higher failure rates when rainbow friends or many supports are present.
  """
  debug("most_support_cards")
  debug(state)
  training_results = state['training_results']
  current_stats = state['current_stats']
  risk_taking_set = training_template['risk_taking_set']
  
  # Filter by failure rate AND stat caps
  filtered_results = {}
  for training_name, training_data in training_results.items():
    # Calculate dynamic max failure based on support quality
    risk_increase = calculate_risk_increase(training_data, risk_taking_set)
    max_allowed_failure = config.MAX_FAILURE + risk_increase
    
    # Check failure rate with dynamic threshold
    failure_rate = int(training_data["failure"])
    if failure_rate > max_allowed_failure:
      if risk_increase > 0:
        debug(f"Skipping {training_name.upper()}: {failure_rate}% > {max_allowed_failure}% (base: {config.MAX_FAILURE}, bonus: +{risk_increase})")
      continue
    
    # Check if primary stat is at cap (eliminate entire training)
    stat_cap = config.STAT_CAPS[training_name]
    current_stat = current_stats[training_name]
    
    if current_stat >= stat_cap:
      info(f"Skipping {training_name.upper()} training: stat at cap ({current_stat}/{stat_cap})")
      continue
    
    filtered_results[training_name] = training_data

  if not filtered_results:
    info("No safe training found. All failure chances are too high or stats are capped.")
    return action

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
  Excludes capped stats from value calculation but keeps training if it has other valuable stats.
  """
  training_results = state['training_results']
  current_stats = state['current_stats']
  
  # Filter by failure rate
  filtered_results = {
    k: v for k, v in training_results.items()
    if int(v["failure"]) <= config.MAX_FAILURE
  }

  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return action

  best_training = None
  best_value = -1

  # Calculate weighted stat gains for each training
  for training_name, training_data in filtered_results.items():
    stat_gains = training_data['stat_gains']
    total_value = 0
    excluded_stats = []
    
    # Sum up weighted stat gains, excluding capped stats
    for stat, gain in stat_gains.items():
      stat_cap = config.STAT_CAPS[stat]
      current_stat = current_stats[stat]
      
      # Skip this stat's contribution if at cap
      if current_stat >= stat_cap:
        excluded_stats.append(f"{stat}({current_stat}/{stat_cap})")
        continue
      
      weight = config.STAT_WEIGHTS[stat]
      total_value += gain * weight
    
    if excluded_stats:
      debug(f"{training_name} -> total_value={total_value}, gains={stat_gains}, excluded={excluded_stats}")
    else:
      debug(f"{training_name} -> total_value={total_value}, gains={stat_gains}")
    
    if total_value > best_value:
      best_value = total_value
      best_training = (training_name, training_data)

  if best_training:
    best_key, best_data = best_training
    info(f"Best stat gain training: {best_key.upper()} with weighted value {best_value:.1f} and {best_data['failure']}% fail chance")
    
    action.func = "do_training"
    action.options["training_name"] = best_key
  
  return action


def calculate_risk_increase(training_data, risk_taking_set):
  """
  Calculate how much to increase failure tolerance based on support quality.
  
  First support doesn't count. Additional supports beyond first are categorized as:
  - Rainbow supports (yellow/max friendship) → rainbow_increase per support
  - Normal supports → normal_increase per support
  
  Returns additional failure % that can be tolerated for this training.
  """
  total_friendship_levels = training_data['total_friendship_levels']
  
  # Count rainbow friends (yellow + max levels)
  rainbow_count = total_friendship_levels['yellow'] + total_friendship_levels['max']
  
  # Count total supports
  total_supports = training_data['total_supports']
  
  # First support doesn't count at all
  if total_supports <= 1:
    return 0
  
  additional_supports = total_supports - 1
  
  # Of the additional supports, how many are rainbows vs normal?
  # Rainbow supports beyond the first (at least rainbow_count - 1 of the additional supports)
  additional_rainbows = max(0, rainbow_count - 1)
  # Remaining additional supports are normal
  additional_normal = max(0, additional_supports - additional_rainbows)
  
  risk_increase = (additional_rainbows * risk_taking_set['rainbow_increase']) + \
                  (additional_normal * risk_taking_set['normal_increase'])
  
  return risk_increase


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
