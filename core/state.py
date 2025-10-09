import cv2
import numpy as np
import re
import json
import pyautogui
import time
from math import floor

from utils.log import info, warning, error, debug

from utils.screenshot import capture_region, enhanced_screenshot, enhance_numbers_for_ocr, binarize_between_colors
from core.ocr import extract_text, extract_number
from core.recognizer import match_template, count_pixels_of_color, find_color_of_pixel, closest_color

import utils.constants as constants

# Get Stat
def stat_state():
  stat_regions = constants.STAT_REGIONS

  result = {}
  for stat, region in stat_regions.items():
    img = enhanced_screenshot(region)
    val = extract_number(img)
    result[stat] = val
  return result

from collections import defaultdict
from math import floor

class CleanDefaultDict(dict):
    """A nested lazy dict:
    - missing keys auto-create another CleanDefaultDict
    - if an *empty* CleanDefaultDict is used in arithmetic, it's treated as 0
      (so `d['a']['b'] += 1` will replace the empty node with the integer 1)
    - if it's non-empty, arithmetic raises TypeError (safer)
    """
    def __getitem__(self, key):
        try:
            return dict.__getitem__(self, key)
        except KeyError:
            node = self.__class__()       # lazy-created nested dict
            dict.__setitem__(self, key, node)
            return node

    def __repr__(self):
        return dict.__repr__(self)

    def _numeric_if_empty(self, other, op):
        # Only allow numeric ops with ints/floats.
        if not isinstance(other, (int, float)):
            return NotImplemented
        if len(self) == 0:
            # empty node behaves as 0 for arithmetic
            return other
        # non-empty node: fail (you said only empty nodes should convert)
        raise TypeError(f"unsupported operand type(s) for {op}: 'CleanDefaultDict' and '{type(other).__name__}'")

    # support +, radd and iadd (covers typical += and x + y cases)
    def __add__(self, other):
        return self._numeric_if_empty(other, '+')

    def __radd__(self, other):
        return self._numeric_if_empty(other, '+')

    def __iadd__(self, other):
        # return numeric result so assignment back to parent will set an int
        return self._numeric_if_empty(other, '+')

def get_support_card_data(threshold=0.8):
  count_result = CleanDefaultDict()
  hint_matches = match_template("assets/icons/support_hint.png", constants.SUPPORT_CARD_ICON_BBOX, threshold)

  for key, icon_path in constants.SUPPORT_ICONS.items():
    matches = match_template(icon_path, constants.SUPPORT_CARD_ICON_BBOX, threshold)

    for match in matches:
      # auto-created entries if not yet present
      count_result[key]["supports"] += 1
      count_result["total_supports"] += 1

      # get friend level
      x, y, w, h = match
      match_horizontal_middle = floor((2*x + w) / 2)
      match_vertical_middle = floor((2*y + h) / 2)
      icon_to_friend_bar_distance = 66
      bbox_left = match_horizontal_middle + constants.SUPPORT_CARD_ICON_BBOX[0]
      bbox_top = match_vertical_middle + constants.SUPPORT_CARD_ICON_BBOX[1] + icon_to_friend_bar_distance
      wanted_pixel = (bbox_left, bbox_top, bbox_left + 1, bbox_top + 1)

      friendship_level_color = find_color_of_pixel(wanted_pixel)
      friend_level = closest_color(constants.SUPPORT_FRIEND_LEVELS, friendship_level_color)

      count_result[key]["friendship_levels"][friend_level] += 1
      count_result["total_friendship_levels"][friend_level] += 1

      if hint_matches:
        for hint_match in hint_matches:
          if abs(hint_match[1] - match[1]) < 45:
            count_result[key]["hints"] += 1
            count_result["total_hints"] += 1

  return count_result

def get_training_data():
  results = {}

  results["failure"] = check_failure()
  results["stat_gains"] = get_stat_gains()

  return results

def get_stat_gains():
  stat_gains={}
  stat_screenshot = capture_region(constants.STAT_GAINS_REGION)
  stat_screenshot = np.array(stat_screenshot)
  upper_yellow = [255, 240, 160]
  lower_yellow = [220, 120, 70]
  stat_screenshot = binarize_between_colors(stat_screenshot, lower_yellow, upper_yellow)
  stat_screenshot = np.array(stat_screenshot)

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
  crops = {}
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(stat_screenshot[y:y+hh, x:x+ww])
    text = extract_number(cropped_image, allowlist="+0123456789")
    if text != -1:
      stat_gains[key] = text
  return stat_gains

def check_failure():
  failure_region_screen = capture_region(constants.FAILURE_REGION)
  match = pyautogui.locate("assets/ui/fail_percent_symbol.png", failure_region_screen, confidence=0.7)
  if not match:
    error("Failed to match percent symbol, cannot produce failure percentage result.")
    debug_window(failure_region_screen)
    return -1
  else:
    x,y,w,h = match
  failure_cropped = failure_region_screen.crop((x - 30, y-3, x, y + h+3))
  enhanced = enhance_numbers_for_ocr(failure_cropped)

  debug_window(enhanced, wait_timer=5)
  threshold=0.7
  failure_text = extract_number(enhanced, threshold=threshold)
  while failure_text == -1 and threshold > 0.2:
    threshold=threshold-0.1
    failure_text = extract_number(enhanced, threshold=threshold)

  return failure_text

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

def check_skill_pts():
  img = enhanced_screenshot(constants.SKILL_PTS_REGION)
  text = extract_number(img)
  return text

def check_aptitudes():
  global APTITUDES

  image = capture_region(constants.FULL_STATS_APTITUDE_REGION)
  image = np.array(image)

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

  h, w = image.shape[:2]
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

def debug_window(screen, wait_timer=0, x=-1400, y=-100):
  screen = np.array(screen)
  cv2.namedWindow("image")
  cv2.moveWindow("image", x, y)
  cv2.imshow("image", screen)
  cv2.waitKey(wait_timer)
