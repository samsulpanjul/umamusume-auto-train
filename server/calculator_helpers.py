from core.actions import Action
from utils.shared import CleanDefaultDict
from core.strategies import Strategy

import importlib

# Import the whole module once
_mod = importlib.import_module("core.trainings")

# Pull the list that contains the names
training_function_names = getattr(_mod, "training_function_names")

# Pull each function listed in that list
for _fn_name in training_function_names:
    globals()[_fn_name] = getattr(_mod, _fn_name)

def _calculate_results(data, function_name=None, min_training_dict=None, minimum_acceptable_data=None):
  mock_state = CleanDefaultDict()
  strategy = Strategy()
  if min_training_dict:
    training_name = min_training_dict["training_type"]
    training_data = min_training_dict
    min_score_dict = _extract_support_card_data(training_name, training_data)
    min_score_dict["stat_gains"] = min_training_dict["stat_gains"]
    minimum_acceptable_data = (
      training_name,
      CleanDefaultDict(min_score_dict)
    )

  for training_name, training_data in data.items():
    support_data = _extract_support_card_data(training_name, training_data)
    if support_data:
      mock_state["training_results"][training_name] = support_data
    mock_state["training_results"][training_name]["stat_gains"] = training_data["stat_gains"]

  # temporary mock date
  mock_state["year"] = "Classic Year Early Sep"
  mock_state["scenario_name"] = "unity"
  mock_training_template = strategy.get_training_template(mock_state)
  mock_actions = {}

  if min_training_dict:
    import copy
    mock_action = Action()
    mock_actions["minimum_acceptable_data"] = minimum_acceptable_data[1]
    mock_actions["training_type"] = minimum_acceptable_data[0]
    mock_actions[function_name] = globals()[function_name](mock_state, mock_training_template, mock_action,
                                                          use_fallback_function=False,
                                                          minimum_acceptable_data=minimum_acceptable_data)
  else:
    for training_type in training_function_names:
      min_training_dict = minimum_acceptable_data[training_type]["minimum_acceptable_training"]
      training_name = min_training_dict["training_type"]
      training_data = min_training_dict
      minimum_acceptable_scores = (
        training_name,
        CleanDefaultDict(training_data)
      )
      mock_action = Action()
      mock_actions[training_type] = globals()[training_type](mock_state, mock_training_template, mock_action,
                                                            use_fallback_function=False,
                                                            minimum_acceptable_data=minimum_acceptable_scores)
  return mock_actions

def _extract_support_card_data(training_name, training_data):
  from utils.shared import CleanDefaultDict
  count_result = CleanDefaultDict()
  count_result["total_supports"] = 0
  for card_data in training_data["supports"]:
    if not card_data.get("enabled", False): # Set default to prevent JSON.parse errors on initial load.
      continue
    key = card_data["type"]
    if key == "":
      continue
    top_right = card_data["top_right"]
    bottom_left = card_data["bottom_left"]
    if top_right == "unity_training":
      count_result["unity_trainings"] += 1
      if bottom_left == "unity_gauge_empty":
        count_result["unity_gauge_fills"] += 1
      elif bottom_left == "unity_gauge_full":
        count_result["unity_spirit_explosions"] += 1

    if key == "npc":
      continue
    count_result[key]["supports"] += 1
    count_result["total_supports"] += 1
    friend_level = card_data["friendship"]
    count_result[key]["friendship_levels"][friend_level] += 1
    count_result["total_friendship_levels"][friend_level] += 1
    if top_right == "hint":
      count_result[key]["hints"] += 1
      count_result["total_hints"] += 1
      count_result["hints_per_friend_level"][friend_level] += 1
  return count_result
