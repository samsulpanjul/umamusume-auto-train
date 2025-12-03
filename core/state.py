import numpy as np
import operator
import re
import json
import threading
from math import floor

from utils.log import info, warning, error, debug, debug_window

from utils.screenshot import capture_region, enhanced_screenshot
from core.ocr import extract_text, extract_number, extract_text_improved
from core.recognizer import match_template, count_pixels_of_color, find_color_of_pixel, closest_color, multi_match_templates

import core.config as config
import utils.constants as constants
from collections import defaultdict
from math import floor

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

  if constants.SCENARIO_NAME == "unity":
    unity_training_matches = device_action.match_template("assets/unity/unity_training.png", screenshot, threshold)
    unity_gauge_matches = device_action.match_template("assets/unity/unity_gauge_unfilled.png", screenshot, threshold)
    unity_spirit_exp_matches = device_action.match_template("assets/unity/unity_spirit_explosion.png", screenshot, threshold)

  count_result["total_supports"] = 0
  count_result["total_hints"] = 0
  count_result["total_friendship_levels"] = {}
  count_result["hints_per_friend_level"] = {}

  for friend_level, color in SUPPORT_FRIEND_LEVELS.items():
    count_result["total_friendship_levels"][friend_level] = 0
    count_result["hints_per_friend_level"][friend_level] = 0

  hint_matches = device_action.match_template("assets/icons/support_hint.png", screenshot, threshold)

  for key, icon_path in constants.SUPPORT_ICONS.items():
    matches = device_action.match_template(icon_path, screenshot, threshold)

    for match in matches:
      # auto-created entries if not yet present
      debug(f"{key} match: {match}")
      count_result[key]["supports"] += 1
      count_result["total_supports"] += 1

      # get friend level
      x, y, w, h = match
      icon_to_friend_bar_distance = 66
      bbox_left = region_xywh[0] + x + w // 2
      bbox_top = region_xywh[1] + y + h // 2 + icon_to_friend_bar_distance
      wanted_pixel = (bbox_left, bbox_top, bbox_left + 1, bbox_top + 1)

      friendship_level_color = find_color_of_pixel(wanted_pixel)
      friend_level = closest_color(constants.SUPPORT_FRIEND_LEVELS, friendship_level_color)

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

def get_training_data(year=None):
  results = {}

  if constants.SCENARIO_NAME == "unity":
    results["failure"] = get_failure_chance(region_xywh=constants.UNITY_FAILURE_REGION)
    stat_gains = get_stat_gains(year=year, region_xywh=constants.UNITY_STAT_GAINS_REGION, scale_factor=1.5)
    stat_gains2 = get_stat_gains(year=year, region_xywh=constants.UNITY_STAT_GAINS_2_REGION, scale_factor=1.5, secondary_stat_gains=True)
    for key, value in stat_gains.items():
      if key in stat_gains2:
        stat_gains[key] += stat_gains2[key]
    results["stat_gains"] = stat_gains
  else:
    results["failure"] = get_failure_chance(region_xywh=constants.FAILURE_REGION)
    results["stat_gains"] = get_stat_gains(year=year, region_xywh=constants.URA_STAT_GAINS_REGION)

  return results

def get_stat_gains(year=1, attempts=0, enable_debug=True, show_screenshot=False, region_xywh=None, scale_factor=1, secondary_stat_gains=False):
  if region_xywh is None:
    raise ValueError("region_xywh is required")
  
  stat_gains={}
  #[220, 100, 60], [255, 245, 170]

  if secondary_stat_gains:
    upper_yellow = [255, 245, 170]
    lower_yellow = [220, 100, 45]
  else:
    upper_yellow = [255, 245, 170]
    lower_yellow = [220, 100, 60]
  stat_screenshots = []
  for i in range(1):
    if i > 0:
      device_action.flush_screenshot_cache()
    stat_screenshot = device_action.screenshot(region_xywh=region_xywh)
    stat_screenshot = custom_grabcut(stat_screenshot)
    if enable_debug:
      debug_window(stat_screenshot, save_name="grabcut")
    stat_screenshot = np.invert(binarize_between_colors(stat_screenshot, lower_yellow, upper_yellow))
    if scale_factor != 1:
      stat_screenshot = cv2.resize(stat_screenshot, (int(stat_screenshot.shape[1] * scale_factor), int(stat_screenshot.shape[0] * scale_factor)))
    if enable_debug:
      debug_window(stat_screenshot, save_name="binarized")
    # if screenshot is 95% black or white
    mean = np.mean(stat_screenshot)
    if mean > 253 or mean < 2:
      debug(f"Empty screenshot, skipping. Mean: {mean}")
      return {}
    stat_screenshots.append(stat_screenshot)
    if enable_debug:
      debug_window(stat_screenshot, save_name=f"stat_screenshot_{i}_{year}", show_on_screen=show_screenshot)
    sleep(0.15)
  
  # find black pixels that do not change between the three screenshots
  diff = stat_screenshots[0]
  for i in range(1, len(stat_screenshots)):
    diff = diff & stat_screenshots[i]
  if enable_debug:
    debug_window(diff, save_name="stat_gains_diff")

  stat_screenshot = diff
  boxes = {
    "spd":  (0.000, 0.00, 0.166, 1),
    "sta":  (0.167, 0.00, 0.166, 1),
    "pwr":  (0.334, 0.00, 0.166, 1),
    "guts": (0.500, 0.00, 0.166, 1),
    "wit":  (0.667, 0.00, 0.166, 1),
    "sp":   (0.834, 0.00, 0.166, 1),
  }

  h, w = stat_screenshot.shape
  stat_gains={}
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(stat_screenshot[y:y+hh, x:x+ww])
    if enable_debug:
      debug_window(cropped_image, save_name=f"stat_{key}", show_on_screen=show_screenshot)
    if secondary_stat_gains:
      cropped_image = crop_after_plus_component(cropped_image, plus_length=12, bar_width=0)
    else:
      cropped_image = crop_after_plus_component(cropped_image)
    if np.all(cropped_image == 0):
      continue
    if enable_debug:
      debug_window(cropped_image, save_name=f"stat_{key}_cropped_{year}", show_on_screen=show_screenshot)
    cropped_image = clean_noise(cropped_image)
    if enable_debug:
      debug_window(cropped_image, save_name=f"stat_{key}_cleaned_{year}", show_on_screen=show_screenshot)
    text = extract_number(cropped_image)

    if text != -1:
      if enable_debug:
        debug_window(cropped_image, save_name=f"{text}_stat_{key}_gain_screenshot_{year}", show_on_screen=show_screenshot)
      stat_gains[key] = text

  if attempts >= 10:
    if enable_debug:
      debug(f"[STAT_GAINS] {year} Extraction failed. Gains: {stat_gains}")
    return stat_gains
  elif any(value > 100 for value in stat_gains.values()):
    if enable_debug:
      debug(f"[STAT_GAINS] {year} Too high, retrying. Gains: {stat_gains}")
    return get_stat_gains(year=year, attempts=attempts + 1, enable_debug=enable_debug, show_screenshot=show_screenshot, region_xywh=region_xywh)
  debug(f"[STAT_GAINS] {year} Gains: {stat_gains}")
  return stat_gains


def get_failure_chance(region_xywh=None):
  if region_xywh is None:
    raise ValueError("region_xywh is required")
  screenshot = device_action.screenshot(region_xywh=region_xywh)
  match = device_action.match_template("assets/ui/fail_percent_symbol.png", screenshot, grayscale=True, threshold=0.75)
  if not match:
    error("Failed to match percent symbol, cannot produce failure percentage result.")
    return -1
  else:
    x, y, w, h = match[0]
    x = x + region_xywh[0]
    y = y + region_xywh[1]
  failure_cropped = device_action.screenshot(region_ltrb=(x - 40, y - 3, x, y + h + 3))
  enhanced = enhance_image_for_ocr(failure_cropped, resize_factor=4, binarize_threshold=None, debug_flag=True)

  threshold=0.7
  failure_text = extract_number(enhanced, threshold=threshold)
  while failure_text == -1 and threshold > 0.2:
    threshold=threshold-0.1
    failure_text = extract_number(enhanced, threshold=threshold)

  return failure_text

def get_mood(attempts=0):
  if attempts >= 10:
    debug("Mood determination failed after 10 attempts, returning GREAT for compatibility reasons")
    return "GREAT"

  mood_screenshot = device_action.screenshot(region_xywh=constants.MOOD_REGION) 
  matches = device_action.multi_match_templates(constants.MOOD_IMAGES, mood_screenshot)
  for name, match in matches.items():
    if match:
      debug(f"Mood: {name}")
      return name

  debug(f"Mood couldn't be determined, retrying (attempt {attempts + 1}/10)")
  return get_mood(attempts + 1)

# Check turn
def get_turn():
  if device_action.locate("assets/buttons/race_day_btn.png", region_ltrb=constants.SCREEN_BOTTOM_BBOX):
    return "Race Day"
  elif device_action.locate("assets/ura/ura_race_btn.png", region_ltrb=constants.SCREEN_BOTTOM_BBOX):
    return "Race Day"
  if constants.SCENARIO_NAME == "unity":
    region_xywh = constants.UNITY_TURN_REGION
  else:
    region_xywh = constants.TURN_REGION
  turn = device_action.screenshot(region_xywh=region_xywh)
  turn = enhance_image_for_ocr(turn, resize_factor=2)
  turn_text = extract_allowed_text(turn, allowlist="0123456789")
  debug(f"Turn text: {turn_text}")
  #if "Race" in turn_text:
  #    return "Race Day"

  digits_only = re.sub(r"[^\d]", "", turn_text)

# Check turn
def check_turn():
    turn = capture_region(constants.TURN_REGION)
    turn_text = extract_text_improved(turn)

    if "race" in turn_text.lower():
        return "Race Day"

    digits_only = re.sub(r"[^\d]", "", turn_text)

    if digits_only:
      return int(digits_only)
    
    return -1

# Check year
def get_current_year():
  if constants.SCENARIO_NAME == "unity":
    region_xywh = constants.UNITY_YEAR_REGION
  else:
    region_xywh = constants.YEAR_REGION
  year = enhanced_screenshot(region_xywh)
  text = extract_text(year)
  debug(f"Year text: {text}")
  return text

# Check criteria
def get_criteria():
  img = enhanced_screenshot(constants.CRITERIA_REGION)
  text = extract_text(img)
  debug(f"Criteria text: {text}")
  return text

def check_criteria_detail():
  img = enhanced_screenshot(constants.CRITERIA_DETAIL_REGION)
  text = extract_text(img)
  return text

def check_skill_pts():
  img = enhanced_screenshot(constants.SKILL_PTS_REGION)
  text = extract_number(img)
  return text

  h, w = image.shape[:2]
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(image[y:y+hh, x:x+ww])
    matches = device_action.multi_match_templates(constants.APTITUDE_IMAGES, cropped_image)
    for name, match in matches.items():
      if match:
        aptitudes[key] = name
        #debug_window(cropped_image)

  info(f"Parsed aptitude values: {aptitudes}. If these values are wrong, please stop and start the bot again with the hotkey.")
  return aptitudes

def get_energy_level(threshold=0.85):
  # find where the right side of the bar is on screen
  
  screenshot = device_action.screenshot(region_xywh=constants.ENERGY_REGION)
  right_bar_match = device_action.match_template("assets/ui/energy_bar_right_end_part.png", screenshot, threshold)
  # longer energy bars get more round at the end
  if not right_bar_match:
    right_bar_match = device_action.match_template("assets/ui/energy_bar_right_end_part_2.png", screenshot, threshold)

  if right_bar_match:
    x, y, w, h = right_bar_match[0]
    energy_bar_length = x
    debug(f"Energy bar length: {energy_bar_length}")

    x, y, w, h = constants.ENERGY_REGION
    top_bottom_middle_pixel = int(y + h // 2)
    debug(f"Top bottom middle pixel: {top_bottom_middle_pixel}")
    MAX_ENERGY_REGION = (x, top_bottom_middle_pixel, x + energy_bar_length, top_bottom_middle_pixel+1)
    debug_window(device_action.screenshot(region_ltrb=MAX_ENERGY_REGION), save_name="MAX_ENERGY_REGION")
    debug(f"MAX_ENERGY_REGION: {MAX_ENERGY_REGION}")
    #[117,117,117] is gray for missing energy, region templating for this one is a problem, so we do this
    empty_energy_pixel_count = count_pixels_of_color([115,115,115], MAX_ENERGY_REGION, tolerance=5)

    #use the energy_bar_length (a few extra pixels from the outside are remaining so we subtract that)
    total_energy_length = energy_bar_length - 1
    hundred_energy_pixel_constant = 236 #counted pixels from one end of the bar to the other, should be fine since we're working in only 1080p

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
  if not device_action.locate_and_click("assets/buttons/full_stats.png", min_search_time=get_secs(1), region_ltrb=constants.SCREEN_MIDDLE_BBOX):
    error("Couldn't click full stats button. Going back.")
    return [], 0
  sleep(0.5)
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
  device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(1), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
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
    "s" : "assets/ui/aptitude_s.png",
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
