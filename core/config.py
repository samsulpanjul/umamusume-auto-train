import json

MINIMUM_MOOD = None
PRIORITIZE_G1_RACE = None
IS_AUTO_BUY_SKILL = None
SKILL_PTS_CHECK = None
PRIORITY_STAT = None
MAX_FAILURE = None
STAT_CAPS = None
SKILL_LIST = None
CANCEL_CONSECUTIVE_RACE = None
SLEEP_TIME_MULTIPLIER = 1

def load_config():
  with open("config.json", "r", encoding="utf-8") as file:
    return json.load(file)

def load_var(var_name, value):
  globals()[var_name] = value

def reload_config():
  config = load_config()

  load_var('PRIORITY_STAT', config["priority_stat"])
  load_var('PRIORITY_WEIGHT', config["priority_weight"])
  load_var('MINIMUM_MOOD', config["minimum_mood"])
  load_var('MINIMUM_MOOD_JUNIOR_YEAR', config["minimum_mood_junior_year"])
  load_var('MAX_FAILURE', config["maximum_failure"])
  load_var('PRIORITIZE_G1_RACE', config["prioritize_g1_race"])
  load_var('CANCEL_CONSECUTIVE_RACE', config["cancel_consecutive_race"])
  load_var('STAT_CAPS', config["stat_caps"])
  load_var('IS_AUTO_BUY_SKILL', config["skill"]["is_auto_buy_skill"])
  load_var('SKILL_PTS_CHECK', config["skill"]["skill_pts_check"])
  load_var('SKILL_LIST', config["skill"]["skill_list"])
  load_var('PRIORITY_EFFECTS_LIST', {i: v for i, v in enumerate(config["priority_weights"])})
  load_var('SKIP_TRAINING_ENERGY', config["skip_training_energy"])
  load_var('NEVER_REST_ENERGY', config["never_rest_energy"])
  load_var('SKIP_INFIRMARY_UNLESS_MISSING_ENERGY', config["skip_infirmary_unless_missing_energy"])
  load_var('PREFERRED_POSITION', config["preferred_position"])
  load_var('ENABLE_POSITIONS_BY_RACE', config["enable_positions_by_race"])
  load_var('POSITIONS_BY_RACE', config["positions_by_race"])
  load_var('POSITION_SELECTION_ENABLED', config["position_selection_enabled"])
  load_var('SLEEP_TIME_MULTIPLIER', config["sleep_time_multiplier"])
  load_var('WINDOW_NAME', config["window_name"])
  load_var('RACE_SCHEDULE', config["race_schedule"])
  load_var('CONFIG_NAME', config["config_name"])
