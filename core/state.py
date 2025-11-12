import cv2
import numpy as np
import re
import json
import pyautogui
import time
import operator

from utils.log import info, warning, error, debug

from utils.screenshot import capture_region, enhanced_screenshot, enhance_image_for_ocr, binarize_between_colors
from core.ocr import extract_text, extract_number, extract_allowed_text
from core.recognizer import match_template, count_pixels_of_color, find_color_of_pixel, closest_color, multi_match_templates
from utils.tools import click, sleep, get_secs

import utils.constants as constants
from collections import defaultdict
from math import floor

class CleanDefaultDict(dict):
  """
  A dict-like class that creates nested instances of itself on key access for chaining.
  
  Key Feature: An instance acts like the number 0 for arithmetic, comparison,
  and numeric casting (int(), float()) operations if it is 'conceptually empty' 
  (it or its entire subtree contains no numeric values).
  
  NOTE: The __repr__ method is customized to return "0" when conceptually empty
  to fix cosmetic issues in debug logging (e.g., f'base={base}' displays 'base=0'
  instead of 'base={}'.)
  """
  def __init__(self, *args, **kwargs):
    super().__init__()
    if args:
      # convert mapping or iterable of pairs
      self.update(args[0])
    if kwargs:
      self.update(kwargs)

  def update(self, *args, **kwargs):
    # behave like dict.update but convert nested dicts
    for mapping in args:
      if hasattr(mapping, "items"):
        for k, v in mapping.items():
          self.__setitem__(k, v)
      else:
        for k, v in mapping:
          self.__setitem__(k, v)
    for k, v in kwargs.items():
      self.__setitem__(k, v)

  def setdefault(self, key, default=None):
    if key in self:
      return self[key]
    self.__setitem__(key, default if default is not None else self.__class__())
    return self[key]

  def __getitem__(self, key):
    """
    If a key is missing, this method creates a new CleanDefaultDict instance
    for that key and returns it, allowing for nested chaining.
    """
    try:
      return dict.__getitem__(self, key)
    except KeyError:
      node = self.__class__()
      dict.__setitem__(self, key, node) # Key is created here for chaining
      return node

  def __setitem__(self, key, value):
    if isinstance(value, dict) and not isinstance(value, CleanDefaultDict):
      value = CleanDefaultDict(value)
    dict.__setitem__(self, key, value)

  def __repr__(self):
    """
    Custom representation: returns "0" if conceptually zero, otherwise standard dict repr.
    """
    if self.is_numeric_zero():
      return "0"
    return dict.__repr__(self)
  
  # --- Core Logic for Numeric/Comparison Behavior ---

  def is_numeric_zero(self):
    """
    Recursively checks if the current instance is 'conceptually empty' (acts as 0).
    A dict is conceptually zero if it is physically empty OR if all its
    values are also CleanDefaultDict instances that are conceptually zero.
    """
    # 1. Physically empty dict is conceptually zero.
    if not self:
        return True
    
    # 2. Check all values. If any value is non-dict OR a non-zero dict, it's not zero.
    for value in self.values():
        if isinstance(value, CleanDefaultDict):
            if not value.is_numeric_zero():
                return False # Found a non-zero-like child
        else:
            # Contains a non-dict value (e.g., int, str) -> not conceptually zero
            return False 
    
    # If we get here, the dict only contains zero-like sub-dicts.
    return True

  # --- Numeric Casting Methods (For explicit int()/float() calls) ---

  def __int__(self):
    if self.is_numeric_zero():
        return 0
    # Follow standard dict behavior for conversion failure if non-zero
    raise TypeError(f"cannot convert non-zero 'CleanDefaultDict' object to int")

  def __float__(self):
    if self.is_numeric_zero():
        return 0.0
    # Follow standard dict behavior for conversion failure if non-zero
    raise TypeError(f"cannot convert non-zero 'CleanDefaultDict' object to float")


  def _handle_numeric_op(self, other, op, op_str, reverse=False):
    """Handles standard and in-place arithmetic operations."""
    # Handle CleanDefaultDict + CleanDefaultDict
    if isinstance(other, CleanDefaultDict):
      self_val = 0 if self.is_numeric_zero() else None
      other_val = 0 if other.is_numeric_zero() else None
      
      if self_val is None or other_val is None:
        raise TypeError(f"unsupported operand type(s) for {op_str}: non-zero 'CleanDefaultDict' and 'CleanDefaultDict'")
      
      return op(self_val, other_val)
    
    if not isinstance(other, (int, float)):
      return NotImplemented
    
    # Use the new recursive check
    if self.is_numeric_zero():
      a, b = (other, 0) if reverse else (0, other)
      return op(a, b)
      
    # Non-zero dict: numeric ops are not allowed
    raise TypeError(f"unsupported operand type(s) for {op_str}: 'CleanDefaultDict' and '{type(other).__name__}'")

  def _handle_comparison_op(self, other, op, op_str, reverse=False):
    """Handles comparison operations."""
    if not isinstance(other, (int, float)):
      return NotImplemented
      
    # Use the new recursive check
    if self.is_numeric_zero():
      a, b = (other, 0) if reverse else (0, other)
      return op(a, b)
      
    # Non-zero dict: comparison ops are not allowed
    raise TypeError(f"unsupported operand type(s) for {op_str}: 'CleanDefaultDict' and '{type(other).__name__}'")

  # --- Arithmetic Operations (Return numeric value if conceptually zero) ---
  
  def __add__(self, other): return self._handle_numeric_op(other, operator.add, '+')
  def __radd__(self, other): return self._handle_numeric_op(other, operator.add, '+', reverse=True)
  
  def __sub__(self, other): return self._handle_numeric_op(other, operator.sub, '-')
  def __rsub__(self, other): return self._handle_numeric_op(other, operator.sub, '-', reverse=True)
  
  def __mul__(self, other): return self._handle_numeric_op(other, operator.mul, '*')
  def __rmul__(self, other): return self._handle_numeric_op(other, operator.mul, '*', reverse=True)

  def __truediv__(self, other): return self._handle_numeric_op(other, operator.truediv, '/')
  def __rtruediv__(self, other): return self._handle_numeric_op(other, operator.truediv, '/', reverse=True)

  def __floordiv__(self, other): return self._handle_numeric_op(other, operator.floordiv, '//')
  def __rfloordiv__(self, other): return self._handle_numeric_op(other, operator.floordiv, '//', reverse=True)

  def __mod__(self, other): return self._handle_numeric_op(other, operator.mod, '%')
  def __rmod__(self, other): return self._handle_numeric_op(other, operator.mod, '%', reverse=True)

  def __pow__(self, other): return self._handle_numeric_op(other, operator.pow, '**')
  def __rpow__(self, other): return self._handle_numeric_op(other, operator.pow, '**', reverse=True)

  def __iadd__(self, other): return self._handle_numeric_op(other, operator.add, '+')
  def __isub__(self, other): return self._handle_numeric_op(other, operator.sub, '-')
  def __itruediv__(self, other): return self._handle_numeric_op(other, operator.truediv, '/')
  def __ifloordiv__(self, other): return self._handle_numeric_op(other, operator.floordiv, '//')
  def __imod__(self, other): return self._handle_numeric_op(other, operator.mod, '%')
  def __ipow__(self, other): return self._handle_numeric_op(other, operator.pow, '**')

  # --- Comparison Operations (Return boolean value if conceptually zero) ---
  
  def __lt__(self, other): return self._handle_comparison_op(other, operator.lt, '<')
  def __le__(self, other): return self._handle_comparison_op(other, operator.le, '<=')
  def __gt__(self, other): return self._handle_comparison_op(other, operator.gt, '>')
  def __ge__(self, other): return self._handle_comparison_op(other, operator.ge, '>=')
  
  def __eq__(self, other): 
    # Must handle equality separately because it is often called first
    if isinstance(other, (int, float)) and self.is_numeric_zero():
      return 0 == other
    return dict.__eq__(self, other)

  def __ne__(self, other):
    result = self.__eq__(other)
    if result is NotImplemented:
      return NotImplemented
    return not result

aptitudes_cache={}

def collect_state(config):
  global aptitudes_cache
  debug("Start state collection. Collecting stats.")
  #??? minimum_mood_junior_year = constants.MOOD_LIST.index(config.MINIMUM_MOOD_JUNIOR_YEAR)

  state_object = CleanDefaultDict()
  state_object["current_mood"] = get_mood()
  mood_index = constants.MOOD_LIST.index(state_object["current_mood"])
  minimum_mood_index = constants.MOOD_LIST.index(config.MINIMUM_MOOD)
  state_object["mood_difference"] = mood_index - minimum_mood_index
  state_object["turn"] = get_turn()
  state_object["year"] = get_current_year()
  state_object["criteria"] = get_criteria()
  state_object["current_stats"] = get_current_stats(state_object["turn"])
  energy_level, max_energy = get_energy_level()
  state_object["energy_level"] = energy_level
  state_object["max_energy"] = max_energy

  if aptitudes_cache:
    state_object["aptitudes"] = aptitudes_cache
  else:
    # Aptitudes are behind full stats button.
    if click(img="assets/buttons/full_stats.png", minSearch=get_secs(1)):
      sleep(0.5)
      state_object["aptitudes"] = get_aptitudes()
      aptitudes_cache = state_object["aptitudes"]
      click(img="assets/buttons/close_btn.png", minSearch=get_secs(1))

  if click("assets/buttons/training_btn.png", minSearch=get_secs(5), region=constants.SCREEN_BOTTOM_REGION):
    training_results = CleanDefaultDict()
    pyautogui.mouseDown()
    sleep(0.25)
    for name, image_path in constants.TRAINING_IMAGES.items():
      pos = pyautogui.locateCenterOnScreen(image_path, confidence=0.8, minSearchTime=get_secs(5), region=constants.SCREEN_BOTTOM_REGION)
      pyautogui.moveTo(pos, duration=0.1)
      sleep(0.15)
      training_results[name].update(get_training_data())
      training_results[name].update(get_support_card_data())

    debug(f"Training results: {training_results}")

    pyautogui.mouseUp()
    click(img="assets/buttons/back_btn.png")
    state_object["training_results"] = training_results

  return state_object

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
            count_result["hints_per_friend_level"][friend_level] += 1

  return count_result

def get_training_data():
  results = {}

  results["failure"] = get_failure_chance()
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
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(stat_screenshot[y:y+hh, x:x+ww])
    text = extract_number(cropped_image, allowlist="+0123456789")
    if text != -1:
      stat_gains[key] = text
  return stat_gains

def get_failure_chance():
  failure_region_screen = capture_region(constants.FAILURE_REGION)
  match = pyautogui.locate("assets/ui/fail_percent_symbol.png", failure_region_screen, confidence=0.7)
  if not match:
    error("Failed to match percent symbol, cannot produce failure percentage result.")
    return -1
  else:
    x,y,w,h = match
  failure_cropped = failure_region_screen.crop((x - 30, y-3, x, y + h+3))
  enhanced = enhance_image_for_ocr(failure_cropped, resize_factor=4)

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

  captured_area = capture_region(constants.MOOD_REGION)
  matches = multi_match_templates(constants.MOOD_IMAGES, captured_area)
  for name, match in matches.items():
    if match:
      debug(f"Mood: {name}")
      return name

  debug(f"Mood couldn't be determined, retrying (attempt {attempts + 1}/10)")
  return get_mood(attempts + 1)

# Check turn
def get_turn():
  turn = capture_region(constants.TURN_REGION)
  turn = enhance_image_for_ocr(turn, resize_factor=2)
  turn_text = extract_allowed_text(turn, allowlist="RaceDay0123456789")
  debug(f"Turn text: {turn_text}")
  if "Race" in turn_text:
      return "Race Day"

  digits_only = re.sub(r"[^\d]", "", turn_text)

  if digits_only:
    return int(digits_only)

  return -1

# Check year
def get_current_year():
  year = enhanced_screenshot(constants.YEAR_REGION)
  text = extract_text(year)
  debug(f"Year text: {text}")
  return text

# Check criteria
def get_criteria():
  img = enhanced_screenshot(constants.CRITERIA_REGION)
  text = extract_text(img, use_recognize=True)
  debug(f"Criteria text: {text}")
  return text

def get_current_stats(turn):
  stats_region = constants.CURRENT_STATS_REGION
  if turn == "Race Day":
    stats_region = (stats_region[0], stats_region[1] + 55, stats_region[2], stats_region[3])
  image = capture_region(stats_region)
  image = np.array(image)

  boxes = {
    "spd":  (0.062, 0.00, 0.105, 0.56),
    "sta":  (0.235, 0.00, 0.105, 0.56),
    "pwr":  (0.408, 0.00, 0.105, 0.56),
    "guts": (0.581, 0.00, 0.105, 0.56),
    "wit":  (0.753, 0.00, 0.105, 0.56),
    "sp":   (0.870, 0.00, 0.166, 1),
  }

  h, w = image.shape[:2]
  current_stats={}
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(image[y:y+hh, x:x+ww])
    current_stats[key] = extract_number(cropped_image)
    if current_stats[key] == -1:
      cropped_image = enhance_image_for_ocr(cropped_image)
      current_stats[key] = extract_number(cropped_image)
      for threshold in [0.6, 0.5, 0.4, 0.3]:
        if current_stats[key] != -1:
          break
        debug(f"Couldn't recognize stat {key}, retrying with lower threshold: {threshold}")
        current_stats[key] = extract_number(cropped_image, threshold=threshold)


  info(f"Current stats: {current_stats}")
  return current_stats

def get_aptitudes():
  aptitudes={}
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

  h, w = image.shape[:2]
  for key, (xr, yr, wr, hr) in boxes.items():
    x, y, ww, hh = int(xr*w), int(yr*h), int(wr*w), int(hr*h)
    cropped_image = np.array(image[y:y+hh, x:x+ww])
    matches = multi_match_templates(constants.APTITUDE_IMAGES, cropped_image)
    for name, match in matches.items():
      if match:
        aptitudes[key] = name
        #debug_window(cropped_image)

  info(f"Parsed aptitude values: {aptitudes}. If these values are wrong, please stop and start the bot again with the hotkey.")
  return aptitudes

def get_energy_level(threshold=0.85):
  # find where the right side of the bar is on screen
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
  if not click(img="assets/buttons/full_stats.png", minSearch=get_secs(1), region=constants.SCREEN_MIDDLE_REGION):
    error("Couldn't click full stats button. Going back.")
    return [], 0
  sleep(0.5)
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
  click(img="assets/buttons/close_btn.png", minSearch=get_secs(1), region=constants.SCREEN_BOTTOM_REGION)
  return matches, total_severity

def debug_window(screen, wait_timer=0, x=-1400, y=-100):
  screen = np.array(screen)
  cv2.namedWindow("image")
  cv2.moveWindow("image", x, y)
  cv2.imshow("image", screen)
  cv2.waitKey(wait_timer)
