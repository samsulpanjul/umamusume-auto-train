# core/actions.py
# Atomic game actions — lowest-level clicks.
# These don’t decide *when*, only *how*.

import utils.constants as constants
from utils.log import error, info, warning
import pyautogui

class Action:
  def __init__(self, func=None, **options):
    self.func = func
    self.options = options

  def run(self):
    """Execute the stored function with its options."""
    if self.func is None:
        raise ValueError("No function assigned to this Action")
    return self.func(self.options)

  def get(self, key, default=None):
    """Get an option safely with a default if missing."""
    return self.options.get(key, default)

  # Optional: allow dict-like access
  def __getitem__(self, key):
    return self.options[key]

  def __setitem__(self, key, value):
    self.options[key] = value

  def __repr__(self):
    return f"<Action func={self.func}, options={self.options!r}>"

  def __str__(self):
    return f"Action<{self.func}, {self.options}>"

def do_training(options):
  training_name = options["training_name"]
  if training_name not in constants.training_types:
    error(f"Training name \"{training_name}\" not found in training types.")
    return False
  training_img = constants.training_types[training_name]
  if not click("assets/buttons/training_btn.png"):
    error(f"Couldn't find training button.")
    return False
  sleep(0.5)
  if not click(training_img):
    error(f"Couldn't find {training_name} button.")
    return False
  return True

def do_infirmary():
  infirmary_btn = pyautogui.locateCenterOnScreen("assets/buttons/infirmary_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if not infirmary_btn:
    error(f"Infirmay button not found.")
    return False
  else:
    pyautogui.moveTo(infirmary_btn, duration=0.1)
    pyautogui.click()
  return True

def do_recreation():
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

def do_race(options):
  race_name = options["name"]
  race_image_path = options["image_path"]
  race_grade = options["grade"]
  is_race_day = options["is_race_day"]

  enter_race(is_race_day, race_name, race_image_path)

  start_race()


def skip_turn():
  return do_training("wit")

def enter_race(is_race_day, race_name, race_image_path):

  if is_race_day is True:
    click(img="assets/buttons/race_day_btn.png", minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
    click(img="assets/buttons/ok_btn.png")
    sleep(0.5)
    for i in range(2):
      if not click(img="assets/buttons/race_btn.png", minSearch=get_secs(2)):
        click(img="assets/buttons/bluestacks/race_btn.png", minSearch=get_secs(2))
      sleep(0.5)
    return True
  else:
    click(img="assets/buttons/races_btn.png", minSearch=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
    if race_name == "any" or race_image_path == "":
      race_image_path = "assets/ui/match_track.png"
    click(img=race_image_path, minSearch=get_secs(3), region=constants.RACE_LIST_BOX_REGION)
    return True
  return False

# support functions for actions
def start_race():
  if config.POSITION_SELECTION_ENABLED:
    select_position()
  view_result_btn = pyautogui.locateCenterOnScreen("assets/buttons/view_results.png", confidence=0.8, minSearchTime=get_secs(10), region=constants.SCREEN_BOTTOM_REGION)
  pyautogui.click(view_result_btn, duration=0.1)
  sleep(0.5)
  pyautogui.moveTo(constants.RACE_SCROLL_BOTTOM_MOUSE_POS)
  pyautogui.tripleClick(interval=0.5)
  close_btn = pyautogui.locateCenterOnScreen("assets/buttons/close_btn.png", confidence=0.8, minSearchTime=get_secs(5))
  if not close_btn:
    info("Race should be over.")
    next_button = pyautogui.locateCenterOnScreen("assets/buttons/next_btn.png", confidence=0.9, minSearchTime=get_secs(4), region=constants.SCREEN_BOTTOM_REGION)
    if next_button:
      info("Next button found.")
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

  # these two are mutually exclusive, so we only use preferred position if positions by race is not enabled.
  if config.ENABLE_POSITIONS_BY_RACE:
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
    click(img="assets/buttons/change_btn.png", minSearch=get_secs(6), region=constants.SCREEN_MIDDLE_REGION)
    click(img=f"assets/buttons/positions/{config.PREFERRED_POSITION}_position_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
    click(img="assets/buttons/confirm_btn.png", minSearch=get_secs(2), region=constants.SCREEN_MIDDLE_REGION)
    PREFERRED_POSITION_SET = True
