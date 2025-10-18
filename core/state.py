import cv2
import numpy as np
import re
import json
import threading
from math import floor

from utils.log import info, warning, error, debug

from utils.screenshot import capture_region, enhanced_screenshot
from core.ocr import extract_text, extract_number
from core.recognizer import match_template, count_pixels_of_color, find_color_of_pixel, closest_color, multi_match_templates

import utils.constants as constants

stop_event = threading.Event()
is_bot_running = False
bot_thread = None
bot_lock = threading.Lock()

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
  global WINDOW_NAME, RACE_SCHEDULE, CONFIG_NAME, USE_OPTIMAL_EVENT_CHOICE, EVENT_CHOICES

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
  USE_OPTIMAL_EVENT_CHOICE = config["event"]["use_optimal_event_choice"]
  EVENT_CHOICES = config["event"]["event_choices"]

# Get Stat
def stat_state():
  stat_regions = {
    "spd": constants.SPD_STAT_REGION,
    "sta": constants.STA_STAT_REGION,
    "pwr": constants.PWR_STAT_REGION,
    "guts": constants.GUTS_STAT_REGION,
    "wit": constants.WIT_STAT_REGION
  }

  result = {}
  for stat, region in stat_regions.items():
    img = enhanced_screenshot(region)
    val = extract_number(img)
    result[stat] = val
  return result

# Check support card in each training
def check_support_card(threshold=0.8, target="none"):
  SUPPORT_ICONS = {
    "spd": "assets/icons/support_card_type_spd.png",
    "sta": "assets/icons/support_card_type_sta.png",
    "pwr": "assets/icons/support_card_type_pwr.png",
    "guts": "assets/icons/support_card_type_guts.png",
    "wit": "assets/icons/support_card_type_wit.png",
    "friend": "assets/icons/support_card_type_friend.png"
  }

  count_result = {}

  SUPPORT_FRIEND_LEVELS = {
    "gray": [110,108,120],
    "blue": [42,192,255],
    "green": [162,230,30],
    "yellow": [255,173,30],
    "max": [255,235,120],
  }

  count_result["total_supports"] = 0
  count_result["total_hints"] = 0
  count_result["total_friendship_levels"] = {}
  count_result["hints_per_friend_level"] = {}

  for friend_level, color in SUPPORT_FRIEND_LEVELS.items():
    count_result["total_friendship_levels"][friend_level] = 0
    count_result["hints_per_friend_level"][friend_level] = 0

  hint_matches = match_template("assets/icons/support_hint.png", constants.SUPPORT_CARD_ICON_BBOX, threshold)
  for key, icon_path in SUPPORT_ICONS.items():
    count_result[key] = {}
    count_result[key]["supports"] = 0
    count_result[key]["hints"] = 0
    count_result[key]["friendship_levels"]={}

    for friend_level, color in SUPPORT_FRIEND_LEVELS.items():
      count_result[key]["friendship_levels"][friend_level] = 0

    matches = match_template(icon_path, constants.SUPPORT_CARD_ICON_BBOX, threshold)
    for match in matches:
      # add the support as a specific key
      count_result[key]["supports"] += 1
      # also add it to the grand total
      count_result["total_supports"] += 1

      #find friend colors and add them to their specific colors
      x, y, w, h = match
      match_horizontal_middle = floor((2*x+w)/2)
      match_vertical_middle = floor((2*y+h)/2)
      icon_to_friend_bar_distance = 66
      bbox_left = match_horizontal_middle + constants.SUPPORT_CARD_ICON_BBOX[0]
      bbox_top = match_vertical_middle + constants.SUPPORT_CARD_ICON_BBOX[1] + icon_to_friend_bar_distance
      wanted_pixel = (bbox_left, bbox_top, bbox_left+1, bbox_top+1)
      friendship_level_color = find_color_of_pixel(wanted_pixel)
      friend_level = closest_color(SUPPORT_FRIEND_LEVELS, friendship_level_color)
      count_result[key]["friendship_levels"][friend_level] += 1
      count_result["total_friendship_levels"][friend_level] += 1

      if hint_matches:
        for hint_match in hint_matches:
          distance = abs(hint_match[1] - match[1])
          if distance < 45:
            count_result["total_hints"] += 1
            count_result[key]["hints"] += 1
            count_result["hints_per_friend_level"][friend_level] +=1

  return count_result

# Get failure chance (idk how to get energy value)
def check_failure():
  failure = enhanced_screenshot(constants.FAILURE_REGION)
  failure_text = extract_text(failure).lower()

  if not failure_text.startswith("failure"):
    return -1

  # SAFE CHECK
  # 1. If there is a %, extract the number before the %
  match_percent = re.search(r"failure\s+(\d{1,3})%", failure_text)
  if match_percent:
    return int(match_percent.group(1))

  # 2. If there is no %, but there is a 9, extract digits before the 9
  match_number = re.search(r"failure\s+(\d+)", failure_text)
  if match_number:
    digits = match_number.group(1)
    idx = digits.find("9")
    if idx > 0:
      num = digits[:idx]
      return int(num) if num.isdigit() else -1
    elif digits.isdigit():
      return int(digits)  # fallback

  return -1

# Check mood
def check_mood():
  mood = capture_region(constants.MOOD_REGION)
  mood_text = extract_text(mood).upper()

  for known_mood in constants.MOOD_LIST:
    if known_mood in mood_text:
      return known_mood

  warning(f"Mood not recognized: {mood_text}")
  return "UNKNOWN"

# Check turn
def check_turn():
    turn = enhanced_screenshot(constants.TURN_REGION)
    turn_text = extract_text(turn)

    if "Race Day" in turn_text:
        return "Race Day"

    # sometimes easyocr misreads characters instead of numbers
    cleaned_text = (
        turn_text
        .replace("T", "1")
        .replace("I", "1")
        .replace("O", "0")
        .replace("S", "5")
    )

    digits_only = re.sub(r"[^\d]", "", cleaned_text)

    if digits_only:
      return int(digits_only)
    
    return -1

# Check year
def check_current_year():
  year = enhanced_screenshot(constants.YEAR_REGION)
  text = extract_text(year)
  return text

# Check criteria
def check_criteria():
  img = enhanced_screenshot(constants.CRITERIA_REGION)
  text = extract_text(img)
  return text

def check_criteria_detail():
  img = enhanced_screenshot(constants.CRITERIA_DETAIL_REGION)
  text = extract_text(img)
  return text

def check_skill_pts():
  img = enhanced_screenshot(constants.SKILL_PTS_REGION)
  text = extract_number(img)
  return text

previous_right_bar_match=""

def check_energy_level(threshold=0.85):
  # find where the right side of the bar is on screen
  global previous_right_bar_match
  right_bar_match = match_template("assets/ui/energy_bar_right_end_part.png", constants.ENERGY_BBOX, threshold)
  # longer energy bars get more round at the end
  if not right_bar_match:
    right_bar_match = match_template("assets/ui/energy_bar_right_end_part_2.png", constants.ENERGY_BBOX, threshold)

  if right_bar_match:
    x, y, w, h = right_bar_match[0]
    energy_bar_length = x

    x, y, w, h = constants.ENERGY_BBOX
    top_bottom_middle_pixel = round((y + h) / 2, 0)

    MAX_ENERGY_BBOX = (x, top_bottom_middle_pixel, x + energy_bar_length, top_bottom_middle_pixel+1)


    #[117,117,117] is gray for missing energy, region templating for this one is a problem, so we do this
    empty_energy_pixel_count = count_pixels_of_color([117,117,117], MAX_ENERGY_BBOX)

    #use the energy_bar_length (a few extra pixels from the outside are remaining so we subtract that)
    total_energy_length = energy_bar_length - 1
    hundred_energy_pixel_constant = 236 #counted pixels from one end of the bar to the other, should be fine since we're working in only 1080p

    previous_right_bar_match = right_bar_match

    energy_level = ((total_energy_length - empty_energy_pixel_count) / hundred_energy_pixel_constant) * 100
    info(f"Total energy bar length = {total_energy_length}, Empty energy pixel count = {empty_energy_pixel_count}, Diff = {(total_energy_length - empty_energy_pixel_count)}")
    info(f"Remaining energy guestimate = {energy_level:.2f}")
    max_energy = total_energy_length / hundred_energy_pixel_constant * 100
    return energy_level, max_energy
  else:
    warning(f"Couldn't find energy bar, returning -1")
    return -1, -1

def get_race_type():
  race_info_screen = enhanced_screenshot(constants.RACE_INFO_TEXT_REGION)
  race_info_text = extract_text(race_info_screen)
  debug(f"Race info text: {race_info_text}")
  return race_info_text

# Severity -> 0 is doesn't matter / incurable, 1 is "can be ignored for a few turns", 2 is "must be cured immediately"
BAD_STATUS_EFFECTS={
  "Migraine":{
    "Severity":2,
    "Effect":"Mood cannot be increased",
  },
  "Night Owl":{
    "Severity":1,
    "Effect":"Character may lose energy, and possibly mood",
  },
  "Practice Poor":{
    "Severity":1,
    "Effect":"Increases chance of training failure by 2%",
  },
  "Skin Outbreak":{
    "Severity":1,
    "Effect":"Character's mood may decrease by one stage.",
  },
  "Slacker":{
    "Severity":2,
    "Effect":"Character may not show up for training.",
  },
  "Slow Metabolism":{
    "Severity":2,
    "Effect":"Character cannot gain Speed from speed training.",
  },
  "Under the Weather":{
    "Severity":0,
    "Effect":"Increases chance of training failure by 5%"
  },
}

GOOD_STATUS_EFFECTS={
  "Charming":"Raises Friendship Bond gain by 2",
  "Fast Learner":"Reduces the cost of skills by 10%",
  "Hot Topic":"Raises Friendship Bond gain for NPCs by 2",
  "Practice Perfect":"Lowers chance of training failure by 2%",
  "Shining Brightly":"Lowers chance of training failure by 5%"
}

def check_status_effects():
  status_effects_screen = enhanced_screenshot(constants.FULL_STATS_STATUS_REGION)

  screen = np.array(status_effects_screen)  # currently grayscale
  screen = cv2.cvtColor(screen, cv2.COLOR_GRAY2BGR)  # convert to 3-channel BGR for display

  #debug_window(screen)

  status_effects_text = extract_text(status_effects_screen)
  debug(f"Status effects text: {status_effects_text}")

  normalized_text = status_effects_text.lower().replace(" ", "")

  matches = [
      k for k in BAD_STATUS_EFFECTS
      if k.lower().replace(" ", "") in normalized_text
  ]

  total_severity = sum(BAD_STATUS_EFFECTS[k]["Severity"] for k in matches)

  debug(f"Matches: {matches}, severity: {total_severity}")
  return matches, total_severity

APTITUDES = {}

def check_aptitudes():
  global APTITUDES

  image = capture_region(constants.FULL_STATS_APTITUDE_REGION)
  image = np.array(image)
  h, w = image.shape[:2]

  # Ratios for each aptitude box (x, y, width, height) in percentages
  boxes = {
    "surface_turf":   (0.0, 0.00, 0.25, 0.33),
    "surface_dirt":   (0.25, 0.00, 0.25, 0.33),

    "distance_sprint": (0.0, 0.33, 0.25, 0.33),
    "distance_mile":   (0.25, 0.33, 0.25, 0.33),
    "distance_medium": (0.50, 0.33, 0.25, 0.33),
    "distance_long":   (0.75, 0.33, 0.25, 0.33),

    "style_front":  (0.0, 0.66, 0.25, 0.33),
    "style_pace":   (0.25, 0.66, 0.25, 0.33),
    "style_late":   (0.50, 0.66, 0.25, 0.33),
    "style_end":    (0.75, 0.66, 0.25, 0.33),
  }

  aptitude_images = {
    "a" : "assets/ui/aptitude_a.png",
    "b" : "assets/ui/aptitude_b.png",
    "c" : "assets/ui/aptitude_c.png",
    "d" : "assets/ui/aptitude_d.png",
    "e" : "assets/ui/aptitude_e.png",
    "f" : "assets/ui/aptitude_f.png",
    "g" : "assets/ui/aptitude_g.png"
  }

  crops = {}
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(image[y:y+hh, x:x+ww])
    matches = multi_match_templates(aptitude_images, cropped_image)
    for name, match in matches.items():
      if match:
        APTITUDES[key] = name
        #debug_window(cropped_image)

  info(f"Parsed aptitude values: {APTITUDES}. If these values are wrong, please stop and start the bot again with the hotkey.")

def debug_window(screen, x=-1400, y=-100):
  cv2.namedWindow("image")
  cv2.moveWindow("image", x, y)
  cv2.imshow("image", screen)
  cv2.waitKey(0)
