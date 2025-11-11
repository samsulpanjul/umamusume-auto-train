# core/trainings.py
from utils.log import error, info, warning, debug
from core.actions import Action
import core.config as config
from core.state import CleanDefaultDict

# Training function names:
# max_out_friendships, most_support_cards, most_stat_gain

def max_out_friendships(state, training_template, action):
  training_results = state['training_results']
  current_stats = state['current_stats']
  risk_taking_set = training_template['risk_taking_set']

  # Filter by failure rate with risk tolerance (include capped trainings for friendship opportunities)
  filtered_results = filter_safe_trainings(training_results, risk_taking_set, current_stats, use_risk_taking=True, check_stat_caps=False)

  if not filtered_results:
    info("No safe training found for friendship maximization.")
    return action

  # Calculate scores for all available trainings once
  training_scores = {}
  best_score = (-1, -1)  # (score, tiebreaker)
  best_key = None

  for training_name, training_data in filtered_results.items():
    score_tuple = max_out_friendships_score((training_name, training_data))
    training_scores[training_name] = {
      "score_tuple": score_tuple,
      "friendship_levels": training_data.get("total_friendship_levels", {}),
      "failure": training_data["failure"],
      "total_supports": training_data.get("total_supports", 0)
    }

    # Track the best training while we're at it
    if score_tuple > best_score:
      best_score = score_tuple
      best_key = training_name

  best_data = filtered_results[best_key]

  info(f"Best friendship training: {best_key.upper()} with friendship score {best_score[0]:.1f} and {best_data['failure']}% fail chance")

  # Add training data without overriding existing action properties
  action.available_actions.append("do_training")
  action["training_name"] = best_key
  action["training_data"] = training_scores[best_key]  # Store best training info
  action["available_trainings"] = training_scores  # Store all available trainings with scores
  return action

def most_support_cards(state, training_template, action):
  debug("most_support_cards")
  training_results = state['training_results']
  current_stats = state['current_stats']
  risk_taking_set = training_template['risk_taking_set']

  # Filter by failure rate AND stat caps with dynamic risk tolerance
  filtered_results = filter_safe_trainings(training_results, risk_taking_set, current_stats, use_risk_taking=True, check_stat_caps=True)

  if not filtered_results:
    info("No safe training found. All failure chances are too high or stats are capped.")
    return action

  # Calculate scores for all available trainings once
  training_scores = {}
  best_score = (-1, -1)  # (score, tiebreaker)
  best_key = None

  for training_name, training_data in filtered_results.items():
    score_tuple = most_support_score((training_name, training_data))
    training_scores[training_name] = {
      "score_tuple": score_tuple,
      "stat_gains": training_data["stat_gains"],
      "failure": training_data["failure"],
      "total_supports": training_data["total_supports"]
    }

    # Track the best training while we're at it
    if score_tuple > best_score:
      best_score = score_tuple
      best_key = training_name

  best_data = filtered_results[best_key]

  info(f"Best training: {best_key.upper()} with {best_data['total_supports']} support cards and {best_data['failure']}% fail chance")

  # Add training data without overriding existing action properties
  action.available_actions.append("do_training")
  action["training_name"] = best_key
  action["training_data"] = training_scores[best_key]  # Store best training info
  action["available_trainings"] = training_scores  # Store all available trainings with scores
  return action


def most_stat_gain(state, training_template, action):
  training_results = state['training_results']
  current_stats = state['current_stats']
  risk_taking_set = training_template['risk_taking_set']

  filtered_results = filter_safe_trainings(training_results, risk_taking_set, current_stats, use_risk_taking=True)

  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return action

  # Calculate scores for all available trainings once
  training_scores = {}
  best_score = (-1, -1)  # (score, tiebreaker)
  best_key = None

  for training_name, training_data in filtered_results.items():
    score_tuple = most_stat_score((training_name, training_data), state, training_template)
    training_scores[training_name] = {
      "score_tuple": score_tuple,
      "stat_gains": training_data["stat_gains"],
      "failure": training_data["failure"],
      "total_supports": training_data.get("total_supports", 0)
    }

    # Track the best training while we're at it
    if score_tuple > best_score:
      best_score = score_tuple
      best_key = training_name

  if best_key:
    best_data = filtered_results[best_key]
    info(f"Best stat gain training: {best_key.upper()} with weighted value {best_score[0]:.1f} and {best_data['failure']}% fail chance")

    # Add training data without overriding existing action properties
    action.available_actions.append("do_training")
    action["training_name"] = best_key
    action["training_data"] = training_scores[best_key]  # Store best training info with score
    action["available_trainings"] = training_scores  # Store all available trainings with scores

  return action


def calculate_risk_increase(training_data, risk_taking_set):
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


def filter_safe_trainings(training_results, risk_taking_set, current_stats, use_risk_taking=False, check_stat_caps=False):
  filtered_results = CleanDefaultDict()

  for training_name, training_data in training_results.items():
    # Check if primary stat is at cap
    stat_cap = config.STAT_CAPS[training_name]
    current_stat = current_stats[training_name]
    is_capped = current_stat >= stat_cap

    # Handle stat cap filtering
    if check_stat_caps and is_capped:
      info(f"Skipping {training_name.upper()} training: stat at cap ({current_stat}/{stat_cap})")
      continue

    # Calculate max allowed failure (with or without risk bonuses)
    if use_risk_taking:
      risk_increase = calculate_risk_increase(training_data, risk_taking_set)
      max_allowed_failure = config.MAX_FAILURE + risk_increase

      # Check failure rate with dynamic threshold
      failure_rate = int(training_data["failure"])
      if failure_rate > max_allowed_failure:
        if risk_increase > 0:
          debug(f"Skipping {training_name.upper()}: {failure_rate}% > {max_allowed_failure}% (base: {config.MAX_FAILURE}, bonus: +{risk_increase})")
        continue
    else:
      # No risk taking - use base failure rate only
      failure_rate = int(training_data["failure"])
      if failure_rate > config.MAX_FAILURE:
        debug(f"Skipping {training_name.upper()}: {failure_rate}% > {config.MAX_FAILURE}% (no risk tolerance)")
        continue

    # Create a copy of training data with cap status
    enhanced_training_data = training_data.copy()
    enhanced_training_data["is_capped"] = is_capped

    filtered_results[training_name] = enhanced_training_data

  return filtered_results

PRIORITY_WEIGHTS_LIST={
  "HEAVY": 0.75,
  "MEDIUM": 0.5,
  "LIGHT": 0.25,
  "NONE": 0
}

def most_support_score(x):
  global PRIORITY_WEIGHTS_LIST
  priority_weight = PRIORITY_WEIGHTS_LIST[config.PRIORITY_WEIGHT]
  base = x[1]["total_supports"]
  if x[1]["total_hints"] > 0:
      base += 0.5

  priority_index = config.PRIORITY_STAT.index(x[0])
  priority_effect = config.PRIORITY_EFFECTS_LIST[priority_index]

  priority_adjustment = priority_effect * priority_weight

  if priority_adjustment >= 0:
    total = base * (1 + priority_adjustment)
  else:
    total = base / (1 + abs(priority_adjustment))

  debug(f"{x[0]} -> base={base}, priority={priority_effect}, adjustment={priority_adjustment}, total={total}")

  return (total, -priority_index)


def most_stat_score(x, state, training_template):
  training_name, training_data = x
  stat_gains = training_data['stat_gains']
  total_value = 0

  # Sum up weighted stat gains, excluding capped stats
  for stat, gain in stat_gains.items():
    stat_cap = config.STAT_CAPS[stat]
    current_stat = state['current_stats'][stat]

    # Skip this stat's contribution if at cap
    if current_stat >= stat_cap:
      continue

    weight = training_template["stat_weight_set"][stat]

    # Handle negative weights like most_support_score handles negative priorities
    if weight >= 0:
      total_value += gain * (1 + weight)
    else:
      total_value += gain / (1 + abs(weight))

  # Use negative priority index as tiebreaker (higher priority = lower index number = higher tiebreaker)
  priority_index = config.PRIORITY_STAT.index(training_name)
  tiebreaker = -priority_index

  debug(f"{training_name} -> total_value={total_value}, gains={stat_gains}")

  return (total_value, tiebreaker)


def max_out_friendships_score(x):
  training_name, training_data = x

  # Calculate possible friendship progression potential
  # Gray friends (0-14): most valuable (1.02x multiplier)
  # Blue friends (15-39): valuable (1.01x multiplier)
  # Green friends (40-79): base value (1.0x multiplier)
  friendship_levels = training_data['total_friendship_levels']
  possible_friendship = (
    friendship_levels['green'] +
    friendship_levels['blue'] * 1.01 +
    friendship_levels['gray'] * 1.02
  )

  # Hints provide additional progression potential
  if training_data['total_hints'] > 0:
    hint_values = {"gray": 0.612, "blue": 0.606, "green": 0.6}
    hints_per_level = training_data['hints_per_friend_level']
    for level, bonus in hint_values.items():
      if hints_per_level[level] > 0:
        possible_friendship += bonus
        break  # Only apply bonus for the lowest level with hints

  # Use negative priority index as tiebreaker
  priority_index = config.PRIORITY_STAT.index(training_name)
  tiebreaker = -priority_index

  debug(f"{training_name} -> friendship_score={possible_friendship:.3f}, gray={friendship_levels['gray']}, blue={friendship_levels['blue']}, green={friendship_levels['green']}, hints={training_data.get('total_hints', 0)}")

  return (possible_friendship, tiebreaker)


