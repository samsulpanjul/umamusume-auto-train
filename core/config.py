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

def reload_config():
  global PRIORITY_STAT, PRIORITY_WEIGHT, MINIMUM_MOOD, MINIMUM_MOOD_JUNIOR_YEAR, MAX_FAILURE
  global PRIORITIZE_G1_RACE, CANCEL_CONSECUTIVE_RACE, STAT_CAPS, IS_AUTO_BUY_SKILL, SKILL_PTS_CHECK, SKILL_LIST
  global PRIORITY_EFFECTS_LIST, SKIP_TRAINING_ENERGY, NEVER_REST_ENERGY, SKIP_INFIRMARY_UNLESS_MISSING_ENERGY, PREFERRED_POSITION
  global ENABLE_POSITIONS_BY_RACE, POSITIONS_BY_RACE, POSITION_SELECTION_ENABLED, SLEEP_TIME_MULTIPLIER
  global WINDOW_NAME, RACE_SCHEDULE, CONFIG_NAME

  config = load_config()

  PRIORITY_STAT = config["priority_stat"]
  PRIORITY_WEIGHT = config["priority_weight"]
  MINIMUM_MOOD = config["minimum_mood"]
  MINIMUM_MOOD_JUNIOR_YEAR = config["minimum_mood_junior_year"]
  MAX_FAILURE = config["maximum_failure"]
  PRIORITIZE_G1_RACE = config["prioritize_g1_race"]
  CANCEL_CONSECUTIVE_RACE = config["cancel_consecutive_race"]
  STAT_CAPS = config["stat_caps"]
  IS_AUTO_BUY_SKILL = config["skill"]["is_auto_buy_skill"]
  SKILL_PTS_CHECK = config["skill"]["skill_pts_check"]
  SKILL_LIST = config["skill"]["skill_list"]
  PRIORITY_EFFECTS_LIST = {i: v for i, v in enumerate(config["priority_weights"])}
  SKIP_TRAINING_ENERGY = config["skip_training_energy"]
  NEVER_REST_ENERGY = config["never_rest_energy"]
  SKIP_INFIRMARY_UNLESS_MISSING_ENERGY = config["skip_infirmary_unless_missing_energy"]
  PREFERRED_POSITION = config["preferred_position"]
  ENABLE_POSITIONS_BY_RACE = config["enable_positions_by_race"]
  POSITIONS_BY_RACE = config["positions_by_race"]
  POSITION_SELECTION_ENABLED = config["position_selection_enabled"]
  SLEEP_TIME_MULTIPLIER = config["sleep_time_multiplier"]
  WINDOW_NAME = config["window_name"]
  RACE_SCHEDULE = config["race_schedule"]
  CONFIG_NAME = config["config_name"]
