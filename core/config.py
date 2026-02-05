import json
import os

#put a default for sleep time multiplier since it's an important value
SLEEP_TIME_MULTIPLIER = 1

# to see any config variables you must call reload_config()
def load_config():
  with open("config.json", "r", encoding="utf-8") as file:
    return json.load(file)

def load_var(var_name, value):
  globals()[var_name] = value

def reload_config(print_config=True):
  try:
    config = load_config()

    load_var('PRIORITY_STAT', config["priority_stat"])
    load_var('PRIORITY_WEIGHT', config["priority_weight"])
    load_var('MINIMUM_MOOD', config["minimum_mood"])
    load_var('MINIMUM_MOOD_JUNIOR_YEAR', config["minimum_mood_junior_year"])
    load_var('MAX_FAILURE', config["maximum_failure"])
    load_var('MINIMUM_APTITUDES', config["minimum_aptitudes"])
    load_var('USE_RACE_SCHEDULE', config["use_race_schedule"])
    load_var('CANCEL_CONSECUTIVE_RACE', config["cancel_consecutive_race"])
    load_var('STAT_CAPS', config["stat_caps"])
    load_var('IS_AUTO_BUY_SKILL', config["skill"]["is_auto_buy_skill"])
    load_var('SKILL_CHECK_TURNS', config["skill"]["skill_check_turns"])
    load_var('CHECK_SKILL_BEFORE_RACES', config["skill"]["check_skill_before_races"])
    load_var('SKILL_PTS_CHECK', config["skill"]["skill_pts_check"])
    load_var('SKILL_LIST', config["skill"]["skill_list"])
    load_var('PRIORITY_EFFECTS_LIST', {i: v for i, v in enumerate(config["priority_weights"])})
    load_var('SKIP_TRAINING_ENERGY', config["skip_training_energy"])
    load_var('NEVER_REST_ENERGY', config["never_rest_energy"])
    load_var('SKIP_INFIRMARY_UNLESS_MISSING_ENERGY', config["skip_infirmary_unless_missing_energy"])
    load_var('WIT_TRAINING_SCORE_RATIO_THRESHOLD', config["wit_training_score_ratio_threshold"])
    load_var('MINIMUM_CONDITION_SEVERITY', config["minimum_condition_severity"])
    load_var('PREFERRED_POSITION', config["preferred_position"])
    load_var('ENABLE_POSITIONS_BY_RACE', config["enable_positions_by_race"])
    load_var('POSITIONS_BY_RACE', config["positions_by_race"])
    load_var('POSITION_SELECTION_ENABLED', config["position_selection_enabled"])
    load_var('SLEEP_TIME_MULTIPLIER', config["sleep_time_multiplier"])
    load_var('WINDOW_NAME', config["window_name"])
    load_var('RACE_SCHEDULE', config["race_schedule"])
    load_var('RACE_SCHEDULE_CONF', config["race_schedule"])
    load_var('CONFIG_NAME', config["config_name"])
    load_var('REST_BEFORE_SUMMER_ENERGY', config["rest_before_summer_energy"])
    load_var('RAINBOW_SUPPORT_WEIGHT_ADDITION', config["rainbow_support_weight_addition"])
    load_var('NON_MAX_SUPPORT_WEIGHT', config["non_max_support_weight"])
    load_var('RACE_TURN_THRESHOLD', config["race_turn_threshold"])
    load_var('USE_ADB', config["use_adb"])
    load_var('DEVICE_ID', config["device_id"])
    load_var('NOTIFICATIONS_ENABLED', config["notifications_enabled"])
    load_var('INFO_NOTIFICATION', config["info_notification"])
    load_var('ERROR_NOTIFICATION', config["error_notification"])
    load_var('SUCCESS_NOTIFICATION', config["success_notification"])
    load_var('DO_MISSION_RACES_IF_POSSIBLE', config["do_mission_races_if_possible"])
    load_var('PRIORITIZE_MISSIONS_OVER_G1', config["prioritize_missions_over_g1"])
    load_var('USE_OPTIMAL_EVENT_CHOICE', config["event"]["use_optimal_event_choice"])
    load_var('EVENT_CHOICES', config["event"]["event_choices"])
    load_var('HINT_HUNTING_ENABLED', config["hint_hunting_enabled"])
    load_var('HINT_HUNTING_WEIGHTS', config["hint_hunting_weights"])
    load_var('SCENARIO_GIMMICK_WEIGHT', config["scenario_gimmick_weight"])
    load_var('USE_SKIP_CLAW_MACHINE', config["use_skip_claw_machine"])
      
  except KeyError as e:
    raise RuntimeError(f"Missing config key: {e.args[0]}, please copy it to config.json from config.template.json and try again")

  load_training_strategy(config["training_strategy"])
  if print_config:
    line = f"[DEBUG] Config: {config}\n"
    print(line)

    try:
      with open(os.path.join("logs", "log.txt"), "a", encoding="utf-8") as f:
        f.write(line + "\n")
    except Exception:
      # Never let logging break startup/config
      pass

def load_training_strategy(training_strategy_raw):
  global TRAINING_STRATEGY
  TRAINING_STRATEGY = {"name": training_strategy_raw["name"]}

  # Copy timeline directly — it just references template names
  TRAINING_STRATEGY["timeline"] = training_strategy_raw.get("timeline", {}).copy()

  # Detect all *_sets dynamically so future additions work automatically
  set_types = {
    key: value
    for key, value in training_strategy_raw.items()
    if key.endswith("_sets")
  }

  expanded_templates = {}

  for template_name, template_data in training_strategy_raw.get("templates", {}).items():
    expanded = {}

    for key, val in template_data.items():
      if key.endswith("_set"):
        plural_key = key + "s"  # e.g. stat_weight_set → stat_weight_sets

        # Ensure the plural key actually exists in the input
        if plural_key not in set_types:
          raise ValueError(
            f"❌ Configuration error: '{plural_key}' section not found in training strategy "
            f"while expanding template '{template_name}'."
          )

        # Ensure the requested set exists
        sets_dict = set_types[plural_key]
        if val not in sets_dict:
          raise ValueError(
            f"❌ Configuration error: Set '{val}' not found under '{plural_key}' "
            f"while expanding template '{template_name}'."
          )

        # Expand the reference into its actual dict/list value
        expanded[key] = sets_dict[val]
      else:
        # Keep non-reference values as-is
        expanded[key] = val

    expanded_templates[template_name] = expanded

  TRAINING_STRATEGY["templates"] = expanded_templates

