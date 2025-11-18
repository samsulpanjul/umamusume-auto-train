# core/actions.py
# Atomic game actions — lowest-level clicks.
# These don’t decide *when*, only *how*.

import utils.constants as constants
import core.config as config
import re
from utils.tools import sleep, get_secs
import utils.device_action_wrapper as device_action
from utils.log import error, info, warning, debug
import pyautogui

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
  if training_name not in constants.TRAINING_IMAGES:
    error(f"Training name \"{training_name}\" not found in training images.")
    return False
  training_img = constants.TRAINING_IMAGES[training_name]
  if not device_action.locate_and_click("assets/buttons/training_btn.png", region_ltrb=constants.SCREEN_BOTTOM_REGION):
    error(f"Couldn't find training button.")
    return False
  sleep(0.5)
  if not device_action.locate_and_click(training_img, region_ltrb=constants.SCREEN_BOTTOM_REGION):
    error(f"Couldn't find {training_name} button.")
    return False
  return True

def do_infirmary(options=None):
  infirmary_btn = pyautogui.locateCenterOnScreen("assets/buttons/infirmary_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if not infirmary_btn:
    error(f"Infirmary button not found.")
    return False
  else:
    pyautogui.moveTo(infirmary_btn, duration=0.1)
    pyautogui.click()
  return True

def do_recreation(options=None):
  recreation_btn = pyautogui.locateCenterOnScreen("assets/buttons/recreation_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  recreation_summer_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)

  if recreation_btn:
    pyautogui.moveTo(recreation_btn, duration=0.15)
    pyautogui.click()
  elif recreation_summer_btn:
    pyautogui.moveTo(recreation_summer_btn, duration=0.15)
    pyautogui.click()
  else:
    return False
  return True

def do_race(options=None):
  if options is None:
    options = {}
  if "is_race_day" in options and options["is_race_day"]:
    race_day(options)
  elif "race_name" in options and options["race_name"] != "any":
    race_name = options["race_name"]
    race_image_path = f"assets/races/{race_name}.png"
    #race_grade = options["grade"]
    enter_race(race_name, race_image_path)
  else:
    enter_race()

  sleep(2)

  start_race()


def skip_turn(options=None):
  return do_training("wit")

def do_rest(options=None):
  if config.NEVER_REST_ENERGY > 0 and options["energy_level"] > config.NEVER_REST_ENERGY:
    info(f"Wanted to rest when energy was above {config.NEVER_REST_ENERGY}, training wit instead.")
    return skip_turn(options)
  rest_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  rest_summber_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)

  if rest_btn:
    pyautogui.moveTo(rest_btn, duration=0.15)
    pyautogui.click(rest_btn)
  elif rest_summber_btn:
    pyautogui.moveTo(rest_summber_btn, duration=0.15)
    pyautogui.click(rest_summber_btn)

def race_day(options=None):
  if options["year"] == "Finale Underway":
    device_action.locate_and_click("assets/ura/ura_race_btn.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_REGION)
  else:
    device_action.locate_and_click("assets/buttons/race_day_btn.png", min_search_time=get_secs(10), region_ltrb=constants.SCREEN_BOTTOM_REGION)
  sleep(0.5)
  click(img="assets/buttons/ok_btn.png")
  sleep(0.5)
  for i in range(2):
    if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
      click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
    sleep(0.5)

def enter_race(race_name="any", race_image_path=""):
  click(img="assets/buttons/races_btn.png", minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
  if race_name == "any" or race_image_path == "":
    race_image_path = "assets/ui/match_track.png"
  click(img=race_image_path, minSearch=get_secs(3), region=constants.RACE_LIST_BOX_REGION)
  sleep(0.5)
  for i in range(2):
    if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
      click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
    sleep(0.5)

# support functions for actions
def start_race():
  if config.POSITION_SELECTION_ENABLED:
    select_position()
    sleep(0.5)
  view_result_btn = pyautogui.locateCenterOnScreen("assets/buttons/view_results.png", confidence=0.8, minSearchTime=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
  pyautogui.moveTo(view_result_btn, duration=0.1)
  pyautogui.click()
  sleep(0.5)
  pyautogui.moveTo(constants.RACE_SCROLL_BOTTOM_MOUSE_POS)
  pyautogui.click(clicks=20, interval=0.1)
  sleep(0.2)
  pyautogui.click(clicks=2, interval=0.2)
  close_btn = pyautogui.locateCenterOnScreen("assets/buttons/close_btn.png", confidence=0.8, minSearchTime=get_secs(5))
  if not close_btn:
    info("Race should be over.")
    next_button = pyautogui.locateCenterOnScreen("assets/buttons/next_btn.png", confidence=0.9, minSearchTime=get_secs(4), region=constants.SCREEN_BOTTOM_REGION)
    if next_button:
      info("Next button found.")
      pyautogui.moveTo(next_button, duration=0.1)
      pyautogui.click()
      sleep(0.25)
      pyautogui.moveTo(constants.RACE_SCROLL_BOTTOM_MOUSE_POS)
      pyautogui.click(clicks=2, interval=0.2)
      click(img="assets/buttons/next2_btn.png", minSearch=get_secs(4), region=constants.SCREEN_BOTTOM_REGION)
      return True
    else:
      warning("Next button not found. Please report this.")
      return False
  else:
    info(f"Close button for view results found. Trying to go into the race.")
    click(close_btn)

  if click("assets/buttons/race_btn.png", confidence=0.8, minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION):
    info(f"Went into the race, sleep for {get_secs(10)} seconds to allow loading.")
    sleep(10)

    # Step 1: Press the race start button (try both versions)
    if not click("assets/buttons/race_exclamation_btn.png", confidence=0.8, minSearch=get_secs(10)):
      info("Couldn't find \"Race!\" button, looking for alternative version.")
      click("assets/buttons/race_exclamation_btn_portrait.png", confidence=0.8, minSearch=get_secs(10))
    sleep(0.5)

    # Step 2: Locate skip buttons (retry if not found)
    skip_btn, skip_btn_big = find_skip_buttons(get_secs(2))
    if not skip_btn and not skip_btn_big:
      warning("Couldn't find skip buttons at first search.")
      skip_btn, skip_btn_big = find_skip_buttons(get_secs(10))

    # Step 3: Perform multiple skip clicks in phases
    click_any_button(skip_btn, skip_btn_big)
    sleep(3)
    click_any_button(skip_btn, skip_btn_big)
    sleep(0.5)
    click_any_button(skip_btn, skip_btn_big)
    sleep(3)

    # Step 4: Locate and click skip again after delay
    skip_btn, _ = find_skip_buttons(get_secs(5))
    click(skip_btn)

    # Step 5: Close trophy popup if it appears
    close_btn = pyautogui.locateCenterOnScreen(
      "assets/buttons/close_btn.png",
      confidence=0.8,
      minSearchTime=get_secs(5)
    )
    click(close_btn)

  info("Finished race.")

def find_skip_buttons(minSearchTime):
  skip_btn = pyautogui.locateCenterOnScreen(
    "assets/buttons/skip_btn.png",
    confidence=0.8,
    minSearchTime=minSearchTime,
    region=constants.SCREEN_BOTTOM_REGION
  )
  skip_btn_big = pyautogui.locateCenterOnScreen(
    "assets/buttons/skip_btn_big.png",
    confidence=0.8,
    minSearchTime=minSearchTime,
    region=constants.SKIP_BTN_BIG_REGION_LANDSCAPE
  )
  return skip_btn, skip_btn_big

def click_any_button(*buttons):
  for btn in buttons:
    if btn:
      pyautogui.tripleClick(btn, interval=0.2, duration=0.4)
      return True
  return False

PREFERRED_POSITION_SET = False
def select_position():
  global PREFERRED_POSITION_SET
  sleep(0.5)
  debug("Selecting position")
  # these two are mutually exclusive, so we only use preferred position if positions by race is not enabled.
  if config.ENABLE_POSITIONS_BY_RACE:
    debug(f"Selecting position based on race type: {config.ENABLE_POSITIONS_BY_RACE}")
    click(img="assets/buttons/info_btn.png", minSearch=get_secs(5), region=constants.SCREEN_TOP_REGION)
    sleep(0.5)
    #find race text, get part inside parentheses using regex, strip whitespaces and make it lowercase for our usage
    race_info_text = get_race_type()
    match_race_type = re.search(r"\(([^)]+)\)", race_info_text)
    race_type = match_race_type.group(1).strip().lower() if match_race_type else None
    click(img="assets/buttons/close_btn.png", minSearch=get_secs(2), region=constants.SCREEN_BOTTOM_REGION)

    if race_type != None:
      position_for_race = config.POSITIONS_BY_RACE[race_type]
      info(f"Selecting position {position_for_race} based on race type {race_type}")
      click(img="assets/buttons/change_btn.png", minSearch=get_secs(4), region=constants.SCREEN_MIDDLE_REGION)
      click(img=f"assets/buttons/positions/{position_for_race}_position_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
      click(img="assets/buttons/confirm_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
  elif not PREFERRED_POSITION_SET:
    debug(f"Setting preferred position: {config.PREFERRED_POSITION}")
    click(img="assets/buttons/change_btn.png", minSearch=get_secs(6), region=constants.SCREEN_MIDDLE_REGION)
    click(img=f"assets/buttons/positions/{config.PREFERRED_POSITION}_position_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
    click(img="assets/buttons/confirm_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
    PREFERRED_POSITION_SET = True
