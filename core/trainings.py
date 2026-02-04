# core/trainings.py
from utils.log import error, info, warning, debug
from core.actions import Action
import core.config as config
from utils.shared import CleanDefaultDict
import utils.constants as constants

# Training function names:
# max_out_friendships, most_support_cards, most_stat_gain, rainbow_training, meta_training

def create_training_score_entry(training_name, training_data, score_tuple):
  """
  Create a standardized training score entry with enforced required fields.

  Args:
    training_name: Name of the training
    training_data: Training data dictionary
    score_tuple: Calculated score tuple

  Returns:
    Dictionary with standardized training score data
  """
  total_rainbow_friends = training_data[training_name]["friendship_levels"]["yellow"] + training_data[training_name]["friendship_levels"]["max"]
  total_friendship_increases = training_data[training_name]["friendship_levels"]["gray"] + training_data[training_name]["friendship_levels"]["blue"] + training_data[training_name]["friendship_levels"]["green"]

  entry = {
    "score_tuple": score_tuple,
    "failure": training_data["failure"],
    "total_supports": training_data["total_supports"],
    "stat_gains": training_data["stat_gains"],
    "friendship_levels": training_data["total_friendship_levels"],
    "total_rainbow_friends": total_rainbow_friends,
    "total_friendship_increases": total_friendship_increases
  }
  if constants.SCENARIO_NAME == "unity":
    entry["unity_gauge_fills"] = training_data["unity_gauge_fills"]
    entry["unity_trainings"] = training_data["unity_trainings"]
    entry["unity_spirit_explosions"] = training_data["unity_spirit_explosions"]

  return entry

def sort_trainings_by_score(training_scores):
  return sorted(training_scores.items(), key=lambda x: (x[1]["score_tuple"][0], -x[1]["score_tuple"][1]), reverse=True)

def fill_trainings_for_action(action, training_scores):
  # sort scores by score then tiebreaker
  training_scores = sort_trainings_by_score(training_scores)
  # Add training data without overriding existing action properties
  action.available_actions.append("do_training")
  action["training_name"] = training_scores[0][0]
  action["training_data"] = training_scores[0][1]
  training_score_dict = CleanDefaultDict()
  for training_score in training_scores:
    training_score_dict[training_score[0]] = training_score[1]
  action["available_trainings"] = training_score_dict  # Store all available trainings with scores
  return action

def rainbow_training(state, training_template, action):
  filtered_results = filter_safe_trainings(state, training_template, use_risk_taking=True, check_stat_caps=True)
  if not filtered_results:
    info("No safe training found for rainbow training.")
    return action
  
  training_scores = {}
  best_score = -1

  def _calculate_score(x):
    # main score
    score_tuple = rainbow_training_score(x)
    score_tuple = add_scenario_gimmick_score(x, score_tuple, state)
    # supporting score
    non_max_support_score = max_out_friendships_score(x)
    non_max_support_score = (non_max_support_score[0] * config.NON_MAX_SUPPORT_WEIGHT, non_max_support_score[1])
    score_tuple = (score_tuple[0] + non_max_support_score[0], score_tuple[1])
    debug(f"Total training score: {score_tuple[0]}")
    return score_tuple

  for training_name, training_data in filtered_results.items():
    score_tuple = _calculate_score((training_name, training_data))
    training_scores[training_name] = create_training_score_entry(
      training_name, training_data, score_tuple
    )
  
    if score_tuple[0] > best_score:
      best_score = score_tuple[0]

  minimum_acceptable_data = (
    'training_name',
    CleanDefaultDict({
      'training_name': {'supports': 1, 'friendship_levels': {'max': 1}},
      'unity_spirit_explosions': 1,
    })
  )

  minimum_score = _calculate_score(minimum_acceptable_data)
  if not action.get("min_scores"):
    action["min_scores"] = CleanDefaultDict()
  action["min_scores"]["rainbow_training"] = minimum_score
  info(f"rainbow_training scores: {training_scores}")

  if best_score < minimum_score[0]:
    info(f"Rainbow score is too low, falling back to most_support_cards. {best_score} < {minimum_score[0]}")
    return most_support_cards(state, training_template, action)

  action = fill_trainings_for_action(action, training_scores)

  return action

def max_out_friendships(state, training_template, action):
  filtered_results = filter_safe_trainings(state, training_template, use_risk_taking=False, check_stat_caps=False)

  if not filtered_results:
    info("No safe training found for friendship maximization.")
    return action

  # Calculate scores for all available trainings once
  training_scores = {}
  best_score = -1
  def _calculate_score(x):
    # main score
    max_friendships_score_tuple = max_out_friendships_score(x)
    score_tuple = add_scenario_gimmick_score(x, max_friendships_score_tuple, state)
    # supporting score
    rainbow_score = rainbow_training_score(x)

    score_tuple = (score_tuple[0] + rainbow_score[0] * 0.25 * config.RAINBOW_SUPPORT_WEIGHT_ADDITION, score_tuple[1])
    debug(f"Total training score: {score_tuple[0]}")

    return score_tuple

  for training_name, training_data in filtered_results.items():
    score_tuple = _calculate_score((training_name, training_data))
    training_scores[training_name] = create_training_score_entry(
      training_name, training_data, score_tuple
    )

    if score_tuple[0] > best_score:
      best_score = score_tuple[0]

  minimum_acceptable_data = (
    "training_name",
    CleanDefaultDict({
      "total_friendship_levels":{"green": 2},
      "unity_gauge_fills": 1
    })
  )
  minimum_score = _calculate_score(minimum_acceptable_data)
  if not action.get("min_scores"):
    action["min_scores"] = CleanDefaultDict()
  action["min_scores"]["max_out_friendships"] = minimum_score
  info(f"max_out_friendships scores: {training_scores}")

  if best_score < minimum_score[0]:
    info(f"Friendship score is too low, falling back to rainbow_training. {best_score} < {minimum_score[0]}")
    return rainbow_training(state, training_template, action)

  action = fill_trainings_for_action(action, training_scores)

  return action

def most_support_cards(state, training_template, action):
  filtered_results = filter_safe_trainings(state, training_template, use_risk_taking=True, check_stat_caps=True)

  if not filtered_results:
    info("No safe training found. All failure chances are too high or stats are capped.")
    return action

  # Calculate scores for all available trainings once
  training_scores = {}
  best_score = -1

  def _calculate_score(x):
    # main score
    most_support_score_tuple = most_support_score(x)
    most_support_score_tuple = add_scenario_gimmick_score(x, most_support_score_tuple, state)
    # supporting score
    non_max_support_score = max_out_friendships_score(x)
    score_tuple = (non_max_support_score[0] * config.NON_MAX_SUPPORT_WEIGHT + most_support_score_tuple[0],
                             non_max_support_score[1] + most_support_score_tuple[1])
    debug(f"Total training score: {score_tuple[0]}")
    return score_tuple

  for training_name, training_data in filtered_results.items():
    score_tuple = _calculate_score((training_name, training_data))
    training_scores[training_name] = create_training_score_entry(
      training_name, training_data, score_tuple
    )
    debug(f"{training_name} -> score_tuple={score_tuple}, best_score={best_score}")
    
    if score_tuple[0] > best_score:
      best_score = score_tuple[0]
  info(f"most_support_card scores: {training_scores}")
  minimum_acceptable_data = (
    'minimum',
    CleanDefaultDict({
      'total_supports': 1,
      'total_friendship_levels': {'green': 1},
      'unity_gauge_fills': 1
    })
  )
  minimum_score = _calculate_score(minimum_acceptable_data)
  if not action.get("min_scores"):
    action["min_scores"] = CleanDefaultDict()
  action["min_scores"]["most_support_cards"] = minimum_score
  debug(f"Best score: {best_score} vs threshold: {minimum_score[0]}")
  if best_score < minimum_score[0]:
    info(f"Support score is too low. No good training. ({best_score} < {minimum_score[0]}) If bot keeps looping, please report this with your config.json attached.")

  action = fill_trainings_for_action(action, training_scores)

  return action

def most_stat_gain(state, training_template, action):
  filtered_results = filter_safe_trainings(state, training_template, use_risk_taking=True)

  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return action

  # Calculate scores for all available trainings once
  training_scores = {}
  for training_name, training_data in filtered_results.items():
    score_tuple = most_stat_score((training_name, training_data), state, training_template)
    training_scores[training_name] = create_training_score_entry(
      training_name, training_data, score_tuple
    )
    debug(f"{training_name} -> score_tuple={score_tuple}")
  
  action = fill_trainings_for_action(action, training_scores)

  return action

def meta_training(state, training_template, action):
  filtered_results = filter_safe_trainings(state, training_template, use_risk_taking=True, check_stat_caps=True)
  if not filtered_results:
    info("No safe training found. All failure chances are too high.")
    return action

  training_scores = {}
  best_score = -1
  score_dict = {}
  # generate scores for all trainings
  for training_name, training_data in filtered_results.items():
    stat_gain_score = most_stat_score((training_name, training_data), state, training_template)
    non_max_support_score = max_out_friendships_score((training_name, training_data))
    rainbow_score = rainbow_training_score((training_name, training_data))
    rainbow_score = add_scenario_gimmick_score((training_name, training_data), rainbow_score, state)

    score_dict[training_name] = {
      "stat_gain_score": stat_gain_score,
      "non_max_support_score": non_max_support_score,
      "rainbow_score": rainbow_score
    }

  # normalize stat gain score
  for training_name, scores in score_dict.items():
    score_dict[training_name] = (
      (scores["stat_gain_score"][0] / 10) + (scores["non_max_support_score"][0] + scores["rainbow_score"][0]),
      scores["stat_gain_score"][1]
      )
  
  for training_name, training_data in filtered_results.items():
    training_scores[training_name] = create_training_score_entry(
      training_name, training_data, score_dict[training_name]
    )
  info(f"Meta training scores: {training_scores}")
  action = fill_trainings_for_action(action, training_scores)
  return action

def find_min_and_max_score(score_dict, score_name):
  max_score = 0
  min_score = float('inf')
  for training_name, scores in score_dict.items():
    stat_gain_score = scores[score_name][0]
    stat_gain_score += scores[score_name][1] * 1e-9
    if stat_gain_score > max_score:
      max_score = stat_gain_score
    if stat_gain_score < min_score:
      min_score = stat_gain_score
  debug(f"Score name: {score_name}, Max score: {max_score}, min score: {min_score}")
  return min_score, max_score

def calculate_risk_increase(training_name, training_data, risk_taking_set):
  total_friendship_levels = training_data[training_name]['friendship_levels']

  # Count rainbow friends (yellow + max levels)
  rainbow_count = total_friendship_levels['yellow'] + total_friendship_levels['max']

  # Count total supports
  total_supports = training_data['total_supports']

  # First support doesn't count at all
  if total_supports <= 1:
    return 0

  additional_supports = max(0, total_supports - 1)

  # Of the additional supports, how many are rainbows vs normal?
  # Rainbow supports beyond the first (at least rainbow_count - 1 of the additional supports)
  additional_rainbows = max(0, rainbow_count - 1)
  # Remaining additional supports are normal
  additional_normal = max(0, additional_supports - additional_rainbows)

  risk_increase = (additional_rainbows * risk_taking_set['rainbow_increase']) + \
                  (additional_normal * risk_taking_set['normal_increase'])

  return risk_increase


def filter_safe_trainings(state, training_template, use_risk_taking=False, check_stat_caps=False):
  training_results = state['training_results']
  current_stats = state['current_stats']
  risk_taking_set = training_template['risk_taking_set']
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

    max_allowed_failure = config.MAX_FAILURE
    # Calculate max allowed failure (with or without risk bonuses)
    if use_risk_taking:
      risk_increase = calculate_risk_increase(training_name, training_data, risk_taking_set)
      max_allowed_failure += risk_increase

      # Check failure rate with dynamic threshold
      failure_rate = int(training_data["failure"])
      if failure_rate > max_allowed_failure:
        debug(f"Skipping {training_name.upper()}: {failure_rate}% > {max_allowed_failure}% (base: {config.MAX_FAILURE}, bonus: +{risk_increase})")
        continue
      else:
        debug(f"Fail rate of {training_name.upper()}: {failure_rate}% < {max_allowed_failure}% (base: {config.MAX_FAILURE}, bonus: +{risk_increase})")
    else:
      # No risk taking - use base failure rate only
      failure_rate = int(training_data["failure"])
      if failure_rate > config.MAX_FAILURE:
        debug(f"Skipping {training_name.upper()}: {failure_rate}% > {config.MAX_FAILURE}% (no risk tolerance)")
        continue
      else:
        debug(f"Fail rate of training {training_name.upper()}: {failure_rate}% < {config.MAX_FAILURE}% (no risk tolerance)")

    training_data["is_capped"] = is_capped
    training_data["max_allowed_failure"] = max_allowed_failure

    filtered_results[training_name] = training_data

  return filtered_results

PRIORITY_WEIGHTS_LIST={
  "HEAVY": 0.75,
  "MEDIUM": 0.5,
  "LIGHT": 0.25,
  "NONE": 0
}

def get_priority_index(x):
  if x[0] in config.PRIORITY_STAT:
    priority_index = config.PRIORITY_STAT.index(x[0])
    priority_effect = config.PRIORITY_EFFECTS_LIST[priority_index]
  else:
    priority_index = 0
  return priority_index

def most_support_score(x):
  global PRIORITY_WEIGHTS_LIST
  priority_weight = PRIORITY_WEIGHTS_LIST[config.PRIORITY_WEIGHT]
  base = x[1]["total_supports"]
  if x[1]["total_hints"] > 0:
      base += 0.5

  priority_index = get_priority_index(x)
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
    if stat != "sp":
      stat_cap = config.STAT_CAPS[stat]
    else:
      stat_cap = 9999
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
  priority_index = get_priority_index(x)
  tiebreaker = -priority_index

  debug(f"Most stat score: {training_name} -> total_value={total_value}, gains={stat_gains}")

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
    friendship_levels['blue'] * 1.05 +
    friendship_levels['gray'] * 1.1 +
    friendship_levels['max'] * 0.2 +
    friendship_levels['yellow'] * 0.2
  )
  
  hint_bonus = 0
  # Hints provide additional progression potential
  if training_data['total_hints'] > 0:
    hint_values = {"gray": 0.612, "blue": 0.606, "green": 0.6, "max": 0.1, "yellow": 0.1}
    hints_per_level = training_data['hints_per_friend_level']
    for level, bonus in hint_values.items():
      if hints_per_level[level] > 0:
        possible_friendship += bonus
        hint_bonus = bonus
        break  # Only apply bonus for the lowest level with hints

  priority_index = get_priority_index(x)
  tiebreaker = -priority_index
  # adjust by priority index, 5 stats, higher priority = lower index = more value to the training
  possible_friendship = possible_friendship * (1 + (5 - priority_index) * 0.025)

  debug(f"Max out friendships score: {training_name} -> {possible_friendship:.3f} -> {friendship_levels['gray']} + {friendship_levels['blue']} + {friendship_levels['green']} + {friendship_levels['max']} + {friendship_levels['yellow']} + {hint_bonus}")

  return (possible_friendship, tiebreaker)

def rainbow_increase_formula(n: int, multiplier: float) -> float:
  if n < 1:
    return n
  return n + multiplier * n * (n - 1)

def rainbow_training_score(x):
  global PRIORITY_WEIGHTS_LIST
  priority_weight = PRIORITY_WEIGHTS_LIST[config.PRIORITY_WEIGHT]
  training_name, training_data = x

  priority_index = get_priority_index(x)
  priority_effect = config.PRIORITY_EFFECTS_LIST[priority_index]
  priority_adjustment = priority_effect * priority_weight

  debug(f"Total supports: {training_data}")
  total_rainbow_friends = training_data[training_name]["friendship_levels"]["yellow"] + training_data[training_name]["friendship_levels"]["max"]
  debug(f"Total rainbow friends: {total_rainbow_friends}")
  total_rainbow_friends = rainbow_increase_formula(total_rainbow_friends, 0.15)
  debug(f"Total rainbow friends after formula: {total_rainbow_friends}")
  #adding total rainbow friends on top of total supports for two times value nudging the formula towards more rainbows
  rainbow_points = total_rainbow_friends * config.RAINBOW_SUPPORT_WEIGHT_ADDITION + training_data["total_supports"] * 0.20
  debug(f"Rainbow points after unity training score: {rainbow_points}")
  if total_rainbow_friends > 0:
    rainbow_points = rainbow_points + 0.5
  if training_data['total_hints'] > 0:
    rainbow_points += 0.5
  if config.HINT_HUNTING_ENABLED:
    hint_hunting_weights = sorted(config.HINT_HUNTING_WEIGHTS.items(), key=lambda x: x[1], reverse=True)
    for support_type, weight in hint_hunting_weights:
      if training_data[support_type]["hints"] > 0:
        rainbow_points += weight
        break

  debug(f"Rainbow points before priority adjustment: {rainbow_points}")
  if priority_adjustment >= 0:
    rainbow_points = rainbow_points * (1 + priority_adjustment)
  else:
    rainbow_points = rainbow_points / (1 + abs(priority_adjustment))
  training_data["rainbow_points"] = rainbow_points
  training_data["total_rainbow_friends"] = total_rainbow_friends
  debug(f"Rainbow training score: {training_name} -> {rainbow_points} -> {total_rainbow_friends}")
  return (rainbow_points, -priority_index)

def add_scenario_gimmick_score(training_dict, score_tuple, state):
  score = 0
  if constants.SCENARIO_NAME == "unity":
    score = unity_training_score(training_dict, state["year"].split()[0]) * config.SCENARIO_GIMMICK_WEIGHT
  debug(f"Scenario gimmick score: {score}")

  score_tuple = (score_tuple[0] + score, score_tuple[1])
  return score_tuple

def unity_training_score(x, year):
  training_name, training_data = x
  priority_index = get_priority_index(x)
  priority_effect = config.PRIORITY_EFFECTS_LIST[priority_index]
  priority_weight = PRIORITY_WEIGHTS_LIST[config.PRIORITY_WEIGHT]
  priority_adjustment = priority_effect * priority_weight

  # spirit explosions are more important later years.
  if year == "Junior":
    year_adjustment = -0.35
  elif year == "Classic":
    year_adjustment = 0
  elif year == "Senior" or year == "Finale":
    year_adjustment = 0.35
  else:
    warning("Didn't get year value, this should not happen.")
    year_adjustment = 0

  score = 0
  # unity gauges fills are more important during earlier years and spirit explosions are more important later years.
  score += training_data["unity_gauge_fills"] * (1 - year_adjustment)
  score += (training_data["unity_trainings"] - training_data["unity_gauge_fills"]) * 0.1
  if priority_adjustment >= 0:
    score += training_data["unity_spirit_explosions"] * (1 + year_adjustment) * (1 + priority_adjustment)
  else:
    score += training_data["unity_spirit_explosions"] * (1 + year_adjustment) / (1 + abs(priority_adjustment))

  debug(f"Unity training score: {training_name} -> {score}")
  return score
