import numpy as np
import operator
import re
import cv2
import time

from utils.log import info, warning, error, debug, debug_window, args

from utils.screenshot import enhanced_screenshot, enhance_image_for_ocr, binarize_between_colors, crop_after_plus_component, clean_noise, custom_grabcut
from core.ocr import extract_text, extract_number, extract_allowed_text
from core.recognizer import count_pixels_of_color, find_color_of_pixel, closest_color
from utils.tools import click, sleep, get_secs, check_race_suitability, get_aptitude_index
import utils.device_action_wrapper as device_action

from utils.shared import CleanDefaultDict
import core.config as config
import utils.constants as constants
from collections import defaultdict
from math import floor

aptitudes_cache = {}
def clear_aptitudes_cache():
  global aptitudes_cache
  aptitudes_cache = {}

def collect_main_state():
  global aptitudes_cache
  debug("Start state collection. Collecting stats.")
  #??? minimum_mood_junior_year = constants.MOOD_LIST.index(config.MINIMUM_MOOD_JUNIOR_YEAR)

  state_object = CleanDefaultDict()
  state_object["current_mood"] = get_mood()
  debug("Mood collection done.")
  mood_index = constants.MOOD_LIST.index(state_object["current_mood"])
  minimum_mood_index = constants.MOOD_LIST.index(config.MINIMUM_MOOD)
  minimum_mood_junior_year_index = constants.MOOD_LIST.index(config.MINIMUM_MOOD_JUNIOR_YEAR)
  state_object["mood_difference"] = mood_index - minimum_mood_index
  state_object["mood_difference_junior_year"] = mood_index - minimum_mood_junior_year_index
  debug("Before turn collection.")
  state_object["turn"] = get_turn()
  debug("Before year collection.")
  state_object["year"] = get_current_year()
  debug("Before criteria collection.")
  state_object["criteria"] = get_criteria()
  debug("Before current stats collection.")
  state_object["current_stats"] = get_current_stats(state_object["turn"])
  energy_level, max_energy = get_energy_level()
  state_object["energy_level"] = energy_level
  state_object["max_energy"] = max_energy

  #find a better way to do this
  if device_action.locate("assets/ui/recreation_with.png"):
    state_object["date_event_available"] = True
  else:
    state_object["date_event_available"] = False

  if config.DO_MISSION_RACES_IF_POSSIBLE:
    if device_action.locate("assets/icons/race_mission_icon.png", region_ltrb=constants.SCREEN_BOTTOM_BBOX):
      state_object["race_mission_available"] = True
  # first init or inspiration.
  if aptitudes_cache and "Early Apr" not in state_object["year"]:
    state_object["aptitudes"] = aptitudes_cache
  else:
    # Aptitudes are behind full stats button.
    if device_action.locate_and_click("assets/buttons/full_stats.png", min_search_time=get_secs(1)):
      sleep(1)
      state_object["aptitudes"] = get_aptitudes()
      aptitudes_cache = state_object["aptitudes"]
      filter_race_list(state_object)
      filter_race_schedule(state_object)
      device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(1), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  debug(f"Main state collection done.")
  return state_object

def collect_training_state(state_object, training_function_name):
  check_stat_gains = False
  if training_function_name == "meta_training" or training_function_name == "most_stat_gain":
    check_stat_gains = True

  if device_action.locate_and_click("assets/buttons/training_btn.png", min_search_time=get_secs(5), region_ltrb=constants.SCREEN_BOTTOM_BBOX):
    training_results = CleanDefaultDict()
    sleep(0.25)
    for name, mouse_pos in constants.TRAINING_BUTTON_POSITIONS.items():
      # swipe up to avoid clicking on the training button again.
      device_action.swipe(mouse_pos, (mouse_pos[0], mouse_pos[1] + 150), duration=0.1)
      sleep(0.15)
      if args.debug is not None and args.debug > 11:
        from utils.debug_tools import compare_training_samples
        test_results = []
        for i in range(10):
          test_results.append(get_training_data(year=state_object["year"], check_stat_gains=check_stat_gains))
          test_results.append(get_support_card_data())
        equal, info = compare_training_samples(test_results)

        if not equal:
          debug("Training samples diverged")
          debug(info)
      training_results[name].update(get_training_data(year=state_object["year"], check_stat_gains=check_stat_gains))
      training_results[name].update(get_support_card_data())

    debug(f"Training results: {training_results}")
    
    training_results = filter_training_lock(training_results)
    device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(1), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    state_object["training_results"] = training_results

  debug(f"State object: {state_object}")
  return state_object

def filter_training_lock(training_results):
  values = list(training_results.values())
  fingerprints = [training_fingerprint(v) for v in values]

  training_locked = all(fp == fingerprints[0] for fp in fingerprints)

  debug(f"Training locked: {training_locked}")

  if training_locked:
    for name, training in list(training_results.items()):
      if not is_valid_training(name, training):
        training_results.pop(name)

    debug(f"Training results after removal: {training_results}")

  return training_results

def training_fingerprint(training):
  fp = []

  # totals (sorted for determinism)
  if "total_supports" in training:
    fp.append(("total_supports", training["total_supports"]))

  if "total_friendship_levels" in training:
    tfl = training["total_friendship_levels"]
    fp.append((
      "total_friendship_levels",
      tuple(sorted(tfl.items()))
    ))

  # per-stat entries
  for stat, data in training.items():
    if stat not in ("spd", "pwr", "sta", "guts", "wit"):
      continue
    if not isinstance(data, dict):
      continue

    entry = []

    if "supports" in data:
      entry.append(("supports", data["supports"]))

    if "friendship_levels" in data:
      entry.append((
        "friendship_levels",
        tuple(sorted(data["friendship_levels"].items()))
      ))

    if entry:
      fp.append((stat, tuple(entry)))

  # final canonical form
  return tuple(sorted(fp))

valid_training_dict={
  'spd': {'stat_gains': {'spd': 1, 'pwr': 1, 'sp': 1}},
  'sta': {'stat_gains': {'sta': 1, 'guts': 1, 'sp': 1}},
  'pwr': {'stat_gains': {'sta': 1, 'pwr': 1, 'sp': 1}},
  'guts': {'stat_gains': {'spd': 1, 'pwr': 1, 'guts': 1, 'sp': 1}},
  'wit': {'stat_gains': {'spd': 1, 'wit': 1, 'sp': 1}}}

def is_valid_training(name, training):
  if name not in valid_training_dict:
    return False

  valid_keys = set(valid_training_dict[name]["stat_gains"].keys())
  training_keys = set(training["stat_gains"].keys())

  return training_keys == valid_keys

def get_support_card_data(threshold=0.8):
  count_result = CleanDefaultDict()
  if constants.SCENARIO_NAME == "unity":
    region_xywh = constants.UNITY_SUPPORT_CARD_ICON_REGION
  else:
    region_xywh = constants.SUPPORT_CARD_ICON_REGION
  screenshot = device_action.screenshot(region_xywh=region_xywh)

  if constants.SCENARIO_NAME == "unity":
    unity_training_matches = device_action.match_template("assets/unity/unity_training.png", screenshot, threshold)
    unity_gauge_matches = device_action.match_template("assets/unity/unity_gauge_unfilled.png", screenshot, threshold)
    unity_spirit_exp_matches = device_action.match_template("assets/unity/unity_spirit_explosion.png", screenshot, threshold)

    for training_match in unity_training_matches:
      count_result["unity_trainings"] += 1
      for gauge_match in unity_gauge_matches:
        dist = gauge_match[1] - training_match[1]
        if dist < 100 and dist > 0:
          count_result["unity_gauge_fills"] += 1
          # each unity training can only be matched to one gauge fill, so break
          break

    for spirit_exp_match in unity_spirit_exp_matches:
      count_result["unity_spirit_explosions"] += 1

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

      for hint_match in hint_matches:
        if abs(hint_match[1] - match[1]) < 45:
          count_result[key]["hints"] += 1
          count_result["total_hints"] += 1
          count_result["hints_per_friend_level"][friend_level] += 1

  return count_result

def get_training_data(year=None, check_stat_gains = False):
  results = {}

  if constants.SCENARIO_NAME == "unity":
    results["failure"] = get_failure_chance(region_xywh=constants.UNITY_FAILURE_REGION)
    if check_stat_gains:
      stat_gains = get_stat_gains(year=year, region_xywh=constants.UNITY_STAT_GAINS_REGION, scale_factor=1.5)
      stat_gains2 = get_stat_gains(year=year, region_xywh=constants.UNITY_STAT_GAINS_2_REGION, scale_factor=1.5, secondary_stat_gains=True)
      for key, value in stat_gains.items():
        if key in stat_gains2:
          stat_gains[key] += stat_gains2[key]
      results["stat_gains"] = stat_gains
  else:
    results["failure"] = get_failure_chance(region_xywh=constants.FAILURE_REGION)
    if check_stat_gains:
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
    if secondary_stat_gains:
      mask_area=1
    else:
      mask_area=2
    stat_screenshot = custom_grabcut(stat_screenshot, mask_area=mask_area)
    if enable_debug:
      debug_window(stat_screenshot, save_name="grabcut")
    if scale_factor != 1:
      stat_screenshot = cv2.resize(stat_screenshot, (int(stat_screenshot.shape[1] * scale_factor), int(stat_screenshot.shape[0] * scale_factor)))
    stat_screenshot = np.invert(binarize_between_colors(stat_screenshot, lower_yellow, upper_yellow))
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
  for i in range(5):
    screenshot = device_action.screenshot(region_xywh=region_xywh)
    match = device_action.match_template("assets/ui/fail_percent_symbol.png", screenshot, grayscale=True, threshold=0.75)
    if match:
      break
    else:
      device_action.flush_screenshot_cache()
      debug_window(screenshot, save_name=f"percent_symbol_not_match")

  if not match:
    error("Failed to match percent symbol, cannot produce failure percentage result.")
    return -1
  else:
    x, y, w, h = match[0]
    x = x + region_xywh[0]
    y = y + region_xywh[1]
  failure_cropped = device_action.screenshot(region_ltrb=(x - 40, y - 3, x, y + h + 3))
  enhanced = enhance_image_for_ocr(failure_cropped, resize_factor=4, binarize_threshold=None)

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
  matches = device_action.multi_match_templates(constants.MOOD_IMAGES, mood_screenshot, stop_after_first_match=True)
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

  if constants.SCENARIO_NAME == "unity":
    race_turns = device_action.screenshot(region_xywh=constants.UNITY_RACE_TURNS_REGION)
    race_turns = enhance_image_for_ocr(race_turns, resize_factor=4, binarize_threshold=None)
    race_turns_text = extract_allowed_text(race_turns, allowlist="0123456789")
    digits_only = re.sub(r"[^\d]", "", race_turns_text)
    if digits_only:
      digits_only = int(digits_only)
      debug(f"Unity cup race turns text: {race_turns_text}")
      if digits_only in [5, 10]:
        info(f"Race turns left until unity cup: {digits_only}, waiting for 3 seconds to allow banner to pass.")
        sleep(3)

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
  for i in range(10):
    year = enhanced_screenshot(region_xywh)
    text = extract_text(year, allowlist=constants.OCR_DATE_RECOGNITION_SET)
    text = text.replace("Pre Debut", "Pre-Debut")
    debug(f"Year text: {text}")
    if text in constants.TIMELINE:
      break
    else:
      device_action.flush_screenshot_cache()

  return text

# Check criteria
def get_criteria():
  if constants.SCENARIO_NAME == "unity":
    region_xywh = constants.UNITY_CRITERIA_REGION
  else:
    region_xywh = constants.CRITERIA_REGION
  img = enhanced_screenshot(region_xywh)
  text = extract_text(img)
  debug(f"Criteria text: {text}")
  return text

def is_number(text):
  try:
    int(text)
    return True
  except ValueError:
    return False

def get_current_stats(turn, enable_debug=True):
  stats_region = constants.CURRENT_STATS_REGION
  if turn == "Race Day":
    stats_region = (stats_region[0], stats_region[1] + 55, stats_region[2], stats_region[3])
  image = device_action.screenshot(region_xywh=stats_region)

  # Arcane numbers that divide the screen into boxes with ratios. Left, top, width, height
  boxes = {
    "spd":  (0.0636, 0, 0.10, 0.56),
    "sta":  (0.238,  0, 0.10, 0.56),
    "pwr":  (0.4036, 0, 0.10, 0.56),
    "guts": (0.5746, 0, 0.10, 0.56),
    "wit":  (0.7436, 0, 0.10, 0.56),
    "sp":   (0.860,  0, 0.14, 0.98),
  }

  h, w = image.shape[:2]
  current_stats={}
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(image[y:y+hh, x:x+ww])
    final_stat_value = -1
    if enable_debug:
      debug_window(cropped_image, save_name=f"stat_{key}_cropped")
    final_stat_value = extract_text(cropped_image, allowlist="0123456789MAX")
    debug(f"Initial stat value: {final_stat_value}")
    if final_stat_value == "":
      cropped_image = enhance_image_for_ocr(cropped_image, binarize_threshold=None)
      final_stat_value = extract_text(cropped_image, allowlist="0123456789MAX")
      for threshold in [0.7, 0.6]:
        if final_stat_value != "":
          break
        debug(f"Couldn't recognize stat {key}, retrying with lower threshold: {threshold}")
        final_stat_value = extract_text(cropped_image, allowlist="0123456789MAX", threshold=threshold)
        debug(f"Threshold: {threshold}, stat value: {final_stat_value}")
    if final_stat_value == "MAX":
      final_stat_value = 1200
    elif is_number(final_stat_value):
      final_stat_value = int(final_stat_value)
    else:
      final_stat_value = -1
    current_stats[key] = final_stat_value
  
  info(f"Current stats: {current_stats}")
  return current_stats

def get_aptitudes():
  aptitudes={}
  image = device_action.screenshot(region_xywh=constants.FULL_STATS_APTITUDE_REGION)
  if not device_action.locate("assets/buttons/close_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX):
    sleep(0.5)
    device_action.flush_screenshot_cache()
    image = device_action.screenshot(region_xywh=constants.FULL_STATS_APTITUDE_REGION)
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

  h, w = image.shape[:2]
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(image[y:y+hh, x:x+ww])
    matches = device_action.multi_match_templates(constants.APTITUDE_IMAGES, cropped_image, stop_after_first_match=True)
    for name, match in matches.items():
      if match:
        aptitudes[key] = name
        #debug_window(cropped_image)

  info(f"Parsed aptitude values: {aptitudes}. If these values are wrong, please stop and start the bot again with the hotkey.")
  return aptitudes

def get_energy_level(threshold=0.85):
  # find where the right side of the bar is on screen
  if constants.SCENARIO_NAME == "unity":
    region_xywh = constants.UNITY_ENERGY_REGION
  else:
    region_xywh = constants.ENERGY_REGION
  screenshot = device_action.screenshot(region_xywh=region_xywh)

  right_bar_match = device_action.match_template("assets/ui/energy_bar_right_end_part.png", screenshot, threshold)
  # longer energy bars get more round at the end
  if not right_bar_match:
    right_bar_match = device_action.match_template("assets/ui/energy_bar_right_end_part_2.png", screenshot, threshold)

  if right_bar_match:
    x, y, w, h = right_bar_match[0]
    energy_bar_length = x
    debug(f"Energy bar length: {energy_bar_length}")

    x, y, w, h = region_xywh
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

def filter_race_list(state):
  debug(f"Races before filtering: {constants.ALL_RACES}")
  constants.RACES = {}
  aptitudes = state["aptitudes"]
  min_surface_index = get_aptitude_index(config.MINIMUM_APTITUDES["surface"])
  min_distance_index = get_aptitude_index(config.MINIMUM_APTITUDES["distance"])
  for date in constants.ALL_RACES:
    if date not in constants.RACES:
      constants.RACES[date] = []
    for race in constants.ALL_RACES[date]:
      suitable = check_race_suitability(race, aptitudes, min_surface_index, min_distance_index)
      if suitable:
        constants.RACES[date].append(race)
  debug(f"Races after filtering: {constants.RACES}")

def filter_race_schedule(state):
  config.RACE_SCHEDULE = config.RACE_SCHEDULE_CONF.copy()
  debug(f"Schedule before filtering: {config.RACE_SCHEDULE}")
  schedule = {}
  for race in config.RACE_SCHEDULE:
    date_long = f"{race['year']} {race['date']}"
    if date_long not in schedule:
      schedule[date_long] = []
    schedule[date_long].append(race)
  config.RACE_SCHEDULE = schedule
  for date in schedule:
    for race in schedule[date]:
      if race["name"] not in [k["name"] for k in constants.RACES[date]]:
        schedule[date].remove(race)
      else:
        # find race name in constants.ALL_RACES[date] and get fans_gained
        for race_data in constants.ALL_RACES[date]:
          if race_data["name"] == race["name"]:
            race["fans_gained"] = race_data["fans"]["gained"]
            break
  debug(f"Schedule after filtering: {config.RACE_SCHEDULE}")
