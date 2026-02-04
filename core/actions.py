# core/actions.py
# Atomic game actions — lowest-level clicks.
# These don’t decide *when*, only *how*.

import utils.constants as constants
import core.config as config
import re
from utils.tools import sleep, get_secs
import utils.device_action_wrapper as device_action
from utils.log import error, info, warning, debug
from utils.screenshot import are_screenshots_same
import pyautogui
import core.bot as bot
from utils.shared import CleanDefaultDict, get_race_type

class Action:
  def __init__(self, **options):
    self.func = None
    self.available_actions = []
    self.options = options

  def run(self):

    return globals()[self.func](self.options)

  def get(self, key, default=None):
    """Get an option safely with a default if missing."""
    return self.options.get(key, default)

  # Optional: allow dict-like access
  def __getitem__(self, key):
    return self.options[key]

  def __setitem__(self, key, value):
    self.options[key] = value

  def _format_dict_floats(self, d):
    """Format floats in dictionary string to 2 decimal places using pure regex."""
    s = str(d)
    # Match: digits, dot, 1-2 digits, then any additional digits, comma
    # Replace with: first group (digits.dot.1-2digits) + comma
    return re.sub(r'(\d+\.\d{1,2})\d*,', r'\1,', s)

  def __repr__(self):
    string = f"<Action func={self.func}, available_actions={self.available_actions}, options={self.options!r}>"
    return self._format_dict_floats(string)

  def __str__(self):
    string = f"Action<{self.func}, available_actions={self.available_actions}, options={self.options}>"
    return self._format_dict_floats(string)

def do_training(options):
  training_name = options["training_name"]
  if training_name not in constants.TRAINING_BUTTON_POSITIONS:
    error(f"Training name \"{training_name}\" not found in training images.")
    return False
  mouse_pos = constants.TRAINING_BUTTON_POSITIONS[training_name]
  if not device_action.locate_and_click("assets/buttons/training_btn.png", region_ltrb=constants.SCREEN_BOTTOM_BBOX, min_search_time=get_secs(2)):
    error(f"Couldn't find training button.")
    return False
  sleep(0.75)
  device_action.click(target=mouse_pos, clicks=2, interval=0.15)
  return True

def do_infirmary(options=None):
  infirmary_btn = device_action.locate("assets/buttons/infirmary_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  if not infirmary_btn:
    error(f"Infirmary button not found.")
    return False
  else:
    device_action.click(target=infirmary_btn, duration=0.1)
  return True

event_templates = {
  "aoi_event": "assets/ui/aoi_event.png",
  "tazuna_event": "assets/ui/tazuna_event.png",
  "riko_event": "assets/ui/riko_event.png",
  "trainee_uma": "assets/ui/trainee_uma.png"
}

event_progress_templates = [
  "assets/ui/pal_progress_1.png",
  "assets/ui/pal_progress_2.png",
  "assets/ui/pal_progress_3.png",
  "assets/ui/pal_progress_4.png",
  "assets/ui/pal_progress_5.png"
]

def do_recreation(options=None):
  recreation_btn = device_action.locate("assets/buttons/recreation_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)

  if recreation_btn:
    device_action.click(target=recreation_btn, duration=0.15)
    sleep(1)
    screenshot = device_action.screenshot()
    matches = CleanDefaultDict()
    for name, path in event_templates.items():
      match = device_action.match_template(path, screenshot)
      if len(match) > 0:
        matches[name] = match[0]
        debug(f"{name} found: {match[0]}")
      else:
        debug(f"{name} not found")

    available_recreation = None
    for name, box in matches.items():
      debug(f"{name}, {box}")
      x, y, w, h = box
      x = x + constants.GAME_WINDOW_BBOX[0]
      region_xywh = (x, y, 550, 85)
      # for later, use event_progress_templates to loop through and find our progress
      pal_screenshot = device_action.screenshot(region_xywh=region_xywh)
      match = device_action.match_template(event_progress_templates[4], pal_screenshot)
      if len(match) > 0:
        debug(f"{name} is NOT available for recreation.")
      else:
        available_recreation = (x + w // 2, y + h // 2)
        debug(f"{name} is available for recreation.")
        break
      
    debug(f"Available recreation: {available_recreation}")  
    device_action.click(target=available_recreation, duration=0.15)
  else:
    debug(f"No recreation button found, clicking rest summer button")
    recreation_summer_btn = device_action.locate("assets/buttons/rest_summer_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    if recreation_summer_btn:
      device_action.click(target=recreation_summer_btn, duration=0.15)
    else:
      return False
  
  # quit to wait for input
  return True

def do_race(options=None):
  if options is None:
    options = {}
  debug(f"do_race options before enter race: {options}")
  if "is_race_day" in options and options["is_race_day"]:
    race_day(options)
  elif ("race_mission_available" in options and options["race_mission_available"]):
    if not enter_race(options=options):
      return False
  elif "race_name" in options and options["race_name"] != "any" and options["race_name"] != "":
    race_name = options["race_name"]
    race_image_path = f"assets/races/{race_name}.png"
    if not enter_race(race_name, race_image_path, options=options):
      return False
  else:
    if not enter_race(options=options):
      return False

  debug(f"do_race options after enter race: {options}")
  sleep(2)

  start_race()
  return True


def skip_turn(options=None):
  options["training_name"] = "wit"
  return do_training(options)

def do_rest(options=None):
  if config.NEVER_REST_ENERGY > 0 and options["energy_level"] > config.NEVER_REST_ENERGY:
    info(f"Wanted to rest when energy was above {config.NEVER_REST_ENERGY}, training wit instead.")
    return skip_turn(options)
  rest_btn = device_action.locate("assets/buttons/rest_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)

  if rest_btn:
    device_action.click(target=rest_btn, duration=0.15)
  else:
    rest_summber_btn = device_action.locate("assets/buttons/rest_summer_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    if rest_summber_btn:
      device_action.click(target=rest_summber_btn, duration=0.15)
    else:
      return False
  return True

def race_day(options=None):
  if options["year"] == "Finale Underway":
    device_action.locate_and_click("assets/ura/ura_race_btn.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  else:
    device_action.locate_and_click("assets/buttons/race_day_btn.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  sleep(0.5)
  device_action.locate_and_click("assets/buttons/ok_btn.png")
  sleep(0.5)
  for i in range(2):
    if not device_action.locate_and_click("assets/buttons/race_btn.png", min_search_time=get_secs(2)):
      device_action.locate_and_click("assets/buttons/bluestacks/race_btn.png", min_search_time=get_secs(2))
    sleep(0.5)

def go_to_racebox_top():
  for i in range(10):
    screenshot1 = device_action.screenshot(region_ltrb=constants.RACE_LIST_BOX_BBOX)
    device_action.swipe(constants.RACE_SCROLL_TOP_MOUSE_POS, constants.RACE_SCROLL_BOTTOM_MOUSE_POS)
    device_action.click(constants.RACE_SCROLL_BOTTOM_MOUSE_POS)
    sleep(0.25)
    screenshot2 = device_action.screenshot(region_ltrb=constants.RACE_LIST_BOX_BBOX)
    if are_screenshots_same(screenshot1, screenshot2, diff_threshold=5):
      return True
  return False

def enter_race(race_name="any", race_image_path="", options=None):
  if not device_action.locate_and_click("assets/buttons/races_btn.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_BBOX):
    warning("Couldn't find races_btn, something probably went wrong. Looking for race day.")
    if device_action.locate("assets/buttons/race_day_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX):
      info("We missed a race day check somehow. Found the race_day_btn now, proceed to race_day.")
      race_day(options=options)
      return True
    elif device_action.locate("assets/buttons/ura_race_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX):
      info("We missed a race day check somehow. Found the ura_race_btn now, proceed to race_day.")
      race_day(options=options)
      return True
    else:
      warning("Couldn't find races_btn/race_day_btn/ura_race_btn, something probably went very wrong. Probably retry turn.")
      return False

  debug(f"race_name: {race_name}, race_image_path: {race_image_path}")
  sleep(1)
  consecutive_cancel_btn = device_action.locate("assets/buttons/cancel_btn.png", min_search_time=get_secs(1))
  if config.CANCEL_CONSECUTIVE_RACE and consecutive_cancel_btn:
    device_action.locate_and_click("assets/buttons/cancel_btn.png", min_search_time=get_secs(1), text="[INFO] Already raced 3+ times consecutively. Cancelling race and doing training.")
    return False
  elif consecutive_cancel_btn:
    device_action.locate_and_click("assets/buttons/ok_btn.png", min_search_time=get_secs(1))

  if race_name == "any" or race_image_path == "":
    race_image_path = "assets/ui/match_track.png"
  sleep(1)

  go_to_racebox_top()
  while True:
    screenshot1 = device_action.screenshot(region_ltrb=constants.RACE_LIST_BOX_BBOX)
    if options is not None and "race_mission_available" in options and options["race_mission_available"]:
      mission_icon = device_action.locate("assets/icons/race_mission_icon.png", min_search_time=get_secs(1), region_ltrb=constants.RACE_LIST_BOX_BBOX, template_scaling=0.72)
      if mission_icon:
        debug(f"Found mission icon, looking for aptitude match.")
        screenshot_region = (mission_icon[0], mission_icon[1], mission_icon[0] + 400, mission_icon[1] + 110)
        if device_action.locate_and_click(race_image_path, min_search_time=get_secs(1), region_ltrb=screenshot_region):
          break
    elif device_action.locate_and_click(race_image_path, min_search_time=get_secs(1), region_ltrb=constants.RACE_LIST_BOX_BBOX):
      break
    sleep(0.5)
    debug(f"Scrolling races...")
    device_action.swipe(constants.RACE_SCROLL_BOTTOM_MOUSE_POS, constants.RACE_SCROLL_TOP_MOUSE_POS)
    device_action.click(constants.RACE_SCROLL_TOP_MOUSE_POS, duration=0)
    sleep(0.25)
    screenshot2 = device_action.screenshot(region_ltrb=constants.RACE_LIST_BOX_BBOX)
    if are_screenshots_same(screenshot1, screenshot2, diff_threshold=5):
      info(f"Couldn't find race image")
      device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
      return False

  for i in range(2):
    if not device_action.locate_and_click("assets/buttons/race_btn.png", min_search_time=get_secs(2)):
      device_action.locate_and_click("assets/buttons/bluestacks/race_btn.png", min_search_time=get_secs(2))
    sleep(0.5)
  return True

# support functions for actions
def start_race():
  if config.POSITION_SELECTION_ENABLED:
    select_position()
    sleep(0.5)
  device_action.locate_and_click("assets/buttons/view_results.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  sleep(0.5)

  close_btn = device_action.locate("assets/buttons/close_btn.png", min_search_time=get_secs(1))
  if not close_btn:
    device_action.click(target=constants.RACE_SCROLL_BOTTOM_MOUSE_POS, clicks=2, interval=0.1)
    sleep(0.2)
    device_action.click(target=constants.RACE_SCROLL_BOTTOM_MOUSE_POS, clicks=2, interval=0.2)
    info("Race should be over.")
  else:
    info(f"Close button for view results found. Trying to go into the race.")
    device_action.click(target=close_btn)

  for i in range(5):
    device_action.locate_and_click("assets/buttons/next_btn.png", region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    device_action.click(target=constants.SAFE_SPACE_MOUSE_POS)
    if device_action.locate_and_click("assets/buttons/next2_btn.png", region_ltrb=constants.SCREEN_BOTTOM_BBOX):
      return True
    sleep(0.25)

  if device_action.locate_and_click("assets/buttons/race_btn.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_BBOX):
    info(f"Went into the race, sleep for {get_secs(10)} seconds to allow loading.")
    sleep(10)
    info("Looking for \"Race!\" button...")
    for i in range(5):
      if device_action.locate_and_click("assets/buttons/race_exclamation_btn.png", min_search_time=get_secs(2), region_ltrb=constants.FULL_SCREEN_LANDSCAPE):
        info("Found \"Race!\" button landscape. After searching for 2 seconds.")
        break
      elif device_action.locate_and_click("assets/buttons/race_exclamation_btn_portrait.png", min_search_time=get_secs(2)):
        info("Found \"Race!\" button portrait. After searching for 2 seconds.")
        break
      elif device_action.locate_and_click("assets/buttons/race_exclamation_btn.png", min_search_time=get_secs(2), template_scaling=0.56):
        info("Found \"Race!\" button landscape. After searching for 2 seconds.")
        break
      elif i == 4:
        warning(f"Could not find \"Race!\" button after {i+1} attempts. Probably can't move onto the race. Please report this.")
    sleep(0.5)

    skip_btn, skip_btn_big = find_skip_buttons(get_secs(2))
    if not skip_btn and not skip_btn_big:
      warning("Couldn't find skip buttons at first search.")
      skip_btn, skip_btn_big = find_skip_buttons(get_secs(10))

    click_any_button(skip_btn, skip_btn_big)
    sleep(0.5)
    click_any_button(skip_btn, skip_btn_big)
    sleep(2)
    click_any_button(skip_btn, skip_btn_big)
    sleep(0.5)
    click_any_button(skip_btn, skip_btn_big)
    skip_btn, _ = find_skip_buttons(get_secs(2))
    device_action.click(target=skip_btn)
    sleep(2)

    while True:
      sleep(1)
      device_action.flush_screenshot_cache()
      screenshot_size = device_action.screenshot().shape # (height 1080, width 800, channels 3)
      if screenshot_size[0] == 800 and screenshot_size[1] == 1080:
        info("Landscape mode detected after race, probably concert. Looking for close button.")
        if device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(5)):
          info("Close button found.")
          break
      else:
        info("Portrait mode detected.")
        break

    device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(5))

def find_skip_buttons(min_search_time):
  skip_btn = device_action.locate("assets/buttons/skip_btn.png", min_search_time=min_search_time, region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  if not skip_btn and not bot.use_adb:
    skip_btn_big = device_action.locate("assets/buttons/skip_btn_big.png", min_search_time=min_search_time, region_ltrb=constants.SKIP_BTN_BIG_BBOX_LANDSCAPE)
  else:
    skip_btn_big = None
  return skip_btn, skip_btn_big

def click_any_button(*buttons):
  for btn in buttons:
    if btn:
      device_action.click(target=btn, clicks=3, interval=0.2)
      return True
  return False

race_types = ["sprint", "mile", "medium", "long"]
def select_position():
  sleep(0.5)
  debug("Selecting position")
  # these two are mutually exclusive, so we only use preferred position if positions by race is not enabled.
  if config.ENABLE_POSITIONS_BY_RACE:
    debug(f"Selecting position based on race type: {config.ENABLE_POSITIONS_BY_RACE}")
    device_action.locate_and_click("assets/buttons/info_btn.png", min_search_time=get_secs(5), region_ltrb=constants.SCREEN_TOP_BBOX)
    sleep(0.5)
    #find race text, get part inside parentheses using regex, strip whitespaces and make it lowercase for our usage
    race_info_text = get_race_type().lower()
    race_type = None
    for distance in race_types:
      if distance in race_info_text:
        race_type = distance
        debug(f"Race type: {race_type}")
        break

    device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    if race_type:
      position_for_race = config.POSITIONS_BY_RACE[race_type]
      info(f"Selecting position {position_for_race} based on race type {race_type}")
      device_action.locate_and_click("assets/buttons/change_btn.png", min_search_time=get_secs(4), region_ltrb=constants.SCREEN_MIDDLE_BBOX)
      device_action.locate_and_click(f"assets/buttons/positions/{position_for_race}_position_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_MIDDLE_BBOX)
      device_action.locate_and_click("assets/buttons/confirm_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_MIDDLE_BBOX)
  elif not bot.PREFERRED_POSITION_SET:
    debug(f"Setting preferred position: {config.PREFERRED_POSITION}")
    device_action.locate_and_click("assets/buttons/change_btn.png", min_search_time=get_secs(6), region_ltrb=constants.SCREEN_MIDDLE_BBOX)
    device_action.locate_and_click(f"assets/buttons/positions/{config.PREFERRED_POSITION}_position_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_MIDDLE_BBOX)
    device_action.locate_and_click("assets/buttons/confirm_btn.png", min_search_time=get_secs(2), region_ltrb=constants.SCREEN_MIDDLE_BBOX)
    bot.PREFERRED_POSITION_SET = True
