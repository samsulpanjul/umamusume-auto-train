# core/actions.py
# Atomic game actions — lowest-level clicks.
# These don’t decide *when*, only *how*.

def do_training(state, options):
  training_options = options
  name = training_options.name

def do_infirmary(state):
  infirmary_btn = pyautogui.locateCenterOnScreen("assets/buttons/infirmary_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  if not infirmary_btn:
    return False
  else:
    pyautogui.moveTo(infirmary_btn, duration=0.1)
    pyautogui.click(infirmary_btn)
    return True

def do_recreation(state):
  recreation_btn = pyautogui.locateCenterOnScreen("assets/buttons/recreation_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)
  recreation_summer_btn = pyautogui.locateCenterOnScreen("assets/buttons/rest_summer_btn.png", confidence=0.8, region=constants.SCREEN_BOTTOM_REGION)

  if recreation_btn:
    pyautogui.moveTo(recreation_btn, duration=0.15)
    pyautogui.click(recreation_btn)
  elif recreation_summer_btn:
    pyautogui.moveTo(recreation_summer_btn, duration=0.15)
    pyautogui.click(recreation_summer_btn)
  else:
    return False
  return True

def do_race(state, options):
  pass

def skip_turn(state):
  pass
