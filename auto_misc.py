import utils.log as log
import cv2

import pygetwindow as gw
import pyautogui
import keyboard
import time

import utils.device_action_wrapper as device_action
import utils.constants as constants
from utils.log import info, warning, error, debug, debug_window, args, init_logging
from utils.tools import sleep, get_secs
import core.config as config
import core.bot as bot

from utils.adb_actions import init_adb

config.reload_config()
init_logging()

if args.use_adb:
  bot.use_adb = True
  bot.device_id = args.use_adb
else:
  bot.use_adb = config.USE_ADB
  if config.DEVICE_ID and config.DEVICE_ID != "":
    bot.device_id = config.DEVICE_ID

init_adb()

bot.is_bot_running = True

stop_key='left ctrl+q'
def stop_callback():
  bot.is_bot_running = False
  print(f"{stop_key} pressed — stopping gracefully.")

# Register hotkey once
keyboard.add_hotkey(stop_key, stop_callback)

def focus_umamusume():
  if bot.use_adb:
    info("Using ADB no need to focus window.")
    constants.adjust_constants_x_coords(offset=-155)
    return True
  try:
    win = gw.getWindowsWithTitle("Umamusume")
    target_window = next((w for w in win if w.title.strip() == "Umamusume"), None)
    if not target_window:
      info(f"Couldn't get the steam version window, trying {config.WINDOW_NAME}.")
      if not config.WINDOW_NAME:
        info("Window name cannot be empty! Please set window name in the config.")
        return False
      win = gw.getWindowsWithTitle(config.WINDOW_NAME)
      target_window = next((w for w in win if w.title.strip() == config.WINDOW_NAME), None)
      if not target_window:
        info(f"Couldn't find target window named \"{config.WINDOW_NAME}\". Please double check your window name config.")
        return False

      constants.adjust_constants_x_coords()
      if target_window.isMinimized:
        target_window.restore()
      else:
        target_window.minimize()
        sleep(0.2)
        target_window.restore()
        sleep(0.5)
      pyautogui.press("esc")
      pyautogui.press("f11")
      time.sleep(5)
      close_btn = pyautogui.locateCenterOnScreen("assets/buttons/bluestacks/close_btn.png", confidence=0.8, minSearchTime=2)
      if close_btn:
        pyautogui.click(close_btn)
      return True

    if target_window.width < 1920 or target_window.height < 1080:
      error(f"Your resolution is {res.width} x {res.height}. Minimum expected size is 1920 x 1080.")
      return
    if target_window.isMinimized:
      target_window.restore()
    else:
      target_window.minimize()
      sleep(0.2)
      target_window.restore()
      sleep(0.5)
    bot.windows_window = target_window
  except Exception as e:
    error(f"Error focusing window: {e}")
    return False
  return True

focus_umamusume()

def do_race():
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
      print(f"Could not find \"Race!\" button after {i+1} attempts. Probably can't move onto the race. Please report this.")
  sleep(0.5)

  skip_btn, skip_btn_big = find_skip_buttons(get_secs(2))
  if not skip_btn and not skip_btn_big:
    print("Couldn't find skip buttons at first search.")
    skip_btn, skip_btn_big = find_skip_buttons(get_secs(10))

  click_any_button(skip_btn, skip_btn_big)
  sleep(0.5)
  click_any_button(skip_btn, skip_btn_big)
  sleep(0.25)
  click_any_button(skip_btn, skip_btn_big)
  sleep(0.5)
  click_any_button(skip_btn, skip_btn_big)
  skip_btn, _ = find_skip_buttons(get_secs(2))
  device_action.click(target=skip_btn)
  device_action.click(target=skip_btn, clicks=3, interval=0.2) #???
  sleep(2)

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
      device_action.click(target=btn, clicks=3, interval=0.15)
      return True
  return False

templates = {
  "next": "assets/buttons/next_btn.png",
  "next2": "assets/buttons/next2_btn.png",
  "race": "assets/buttons/race_btn.png",
  "race_2": "assets/buttons/race_btn_portrait.png",
  "main_menu_races": "assets/buttons/main_menu_races.png",
  "retry": "assets/buttons/retry_btn.png",
  "confirm": "assets/buttons/confirm_btn.png",
  "race_events": "assets/buttons/race_events.png",
  "team_trials": "assets/buttons/team_trials.png",
  "legend_race": "assets/buttons/legend_race.png",
  "collect": "assets/buttons/collect_all.png",
  "ok_btn": "assets/buttons/ok_btn.png",
  "close_btn": "assets/buttons/close_btn.png",
  "skip_btn": "assets/buttons/skip_btn.png",
}

cm_templates = {
  "cm_special_missions": "assets/buttons/cm_special_missions.png",
  "cm_entry": "assets/buttons/cm_entry.png",
  "cm_register": "assets/buttons/cm_register.png",
  "cm_event": "assets/buttons/cm_event.png",
  "cm_race": "assets/buttons/cm_race_btn.png",
  "cm_claim": "assets/buttons/cm_claim_btn.png",
}

lr_templates = {
  "lr_ticket": "assets/buttons/lr_ticket.png",
  "lr_confirm": "assets/buttons/confirm_btn.png",
  "lr_next": "assets/buttons/next_btn.png",
  "lr_next2": "assets/buttons/next2_btn.png",
  "lr_race": "assets/buttons/race_exclamation_btn.png",
  "lr_race2": "assets/buttons/race_exclamation_btn_portrait.png",
  "lr_race3": "assets/buttons/race_exclamation_btn.png",
  "lr_race3": "assets/buttons/race_exclamation_btn.png",
  "lr_view_results": "assets/buttons/view_results.png",
}

tt_templates = {
  "tt_team_race": "assets/buttons/tt_team_race.png",
  "tt_race": "assets/buttons/tt_race.png",
  "tt_gift": "assets/buttons/tt_gift.png",
  "tt_select_opponent": "assets/buttons/tt_select_opponent.png",
  "tt_select_opponent_2": "assets/buttons/tt_select_opponent_2.png",
  "tt_see_all": "assets/buttons/tt_see_all.png",
}

race_events_entered=False
cm_entered=False
cm_missions_collected=False
legend_races=False
team_trials_entered=False

non_match_count=0
previous_click_name=None
same_button_clicks=0
while True:
  sleep(0.5)
  device_action.flush_screenshot_cache()
  screenshot = device_action.screenshot()
  matches = device_action.multi_match_templates(templates, screenshot=screenshot)

  if non_match_count > 20:
    info("Career lobby stuck, quitting.")
    quit()

  def click_match(matches, name = None):
    global previous_click_name, same_button_clicks, non_match_count
    if len(matches) > 0:
      x, y, w, h = matches[0]
      offset_x = constants.GAME_WINDOW_REGION[0]
      cx = offset_x + x + w // 2
      cy = y + h // 2
      if name:
        if same_button_clicks > 0:
          debug(f"same_button_clicks: {same_button_clicks} ")
          if same_button_clicks > 20:
            info("Career lobby stuck, quitting.")
            quit()
        if name == previous_click_name:
          debug(f"name == previous_click_name")
          same_button_clicks += 1
        else:
          same_button_clicks = 0
        info(f"Clicking {name}.")
        previous_click_name = name
      return device_action.click(target=(cx, cy), text=f"Clicked match: {matches[0]}")
    return False

  if not cm_missions_collected and click_match(matches.get("collect"), "collect"):
    non_match_count=0
    cm_missions_collected=True
    continue

  if matches.get("skip_btn"):
    for i in range(5):
      click_match(matches.get("skip_btn"), "skip_btn")
      sleep(0.1)

  if (
      click_match(matches.get("next"), "next") or
      click_match(matches.get("next2"), "next2") or
      click_match(matches.get("confirm"), "confirm") or
      click_match(matches.get("ok_btn"), "ok_btn") or
      click_match(matches.get("retry"), "retry") or
      click_match(matches.get("close_btn"), "close_btn")
    ):
    non_match_count = 0
    continue

  if args.cm and (click_match(matches.get("race")) or click_match(matches.get("race_2"))):
    info("Pressed race.")
    sleep(2)
    do_race()
    non_match_count = 0
    continue

  if args.cm or args.tt or args.lr:
    if click_match(matches.get("main_menu_races"), "main_menu_races"):
      non_match_count=0
      continue

  if args.cm or args.lr:
    if click_match(matches.get("race_events"), "race_events"):
      non_match_count=0
      continue

  if args.cm:
    device_action.flush_screenshot_cache()
    cm_matches = device_action.multi_match_templates(cm_templates, screenshot=screenshot)
    if not cm_missions_collected and click_match(cm_matches.get("cm_special_missions"), "cm_special_missions"):
      non_match_count=0
      continue
    if (
        click_match(cm_matches.get("cm_entry"), "cm_entry") or
        click_match(cm_matches.get("cm_register"), "cm_register") or
        click_match(cm_matches.get("cm_race"), "cm_race") or
        click_match(cm_matches.get("cm_claim"), "cm_claim") or
        click_match(cm_matches.get("cm_event"), "cm_event")
      ):
      non_match_count = 0
      cm_entered = True
      continue

  if args.tt:
    if click_match(matches.get("team_trials"), "team_trials"):
      non_match_count=0
      continue

    device_action.flush_screenshot_cache()
    tt_matches = device_action.multi_match_templates(tt_templates, screenshot=screenshot)
    if (
        click_match(tt_matches.get("tt_team_race"), "tt_team_race") or
        click_match(tt_matches.get("tt_see_all"), "tt_see_all") or
        click_match(tt_matches.get("tt_race"), "tt_race") or
        click_match(tt_matches.get("tt_gift"), "tt_gift")
      ):
      non_match_count=0
      continue
    opponent_matches = device_action.deduplicate_boxes(tt_matches.get("tt_select_opponent") + tt_matches.get("tt_select_opponent_2"), min_dist=10)
    opponent_matches.sort(key=lambda x: x[1])
    info(f"Matched buttons: {opponent_matches}")
    if len(opponent_matches) == 3:
      # Map difficulty to button index (hard=0, medium=1, easy=2)
      difficulty_indices = {"hard": 0, "medium": 1, "easy": 2}

      if args.tt in difficulty_indices:
        target_index = difficulty_indices[args.tt]
        # Check if we have enough buttons for the selected difficulty
        info(f"Selecting opponent button {target_index} (for {args.tt} difficulty)")
        click_match_array = []
        click_match_array.append(opponent_matches[target_index])
        debug(f"click_match_array: {click_match_array}")
        click_match(click_match_array, "opponent_btn")
      else:
        info(f"Invalid difficulty level: {args.tt}.")
      continue

  if args.lr:
    if click_match(matches.get("legend_race"), "legend_race"):
      non_match_count=0
      continue
    device_action.flush_screenshot_cache()
    lr_matches = device_action.multi_match_templates(lr_templates, screenshot=screenshot)
    info(f"Legend race matches: {lr_matches}")
    if click_match(lr_matches.get("lr_view_results"), "lr_view_results"):
      close_btn = device_action.locate("assets/buttons/close_btn.png", min_search_time=get_secs(1))
      if not close_btn:
        device_action.click(target=constants.RACE_SCROLL_BOTTOM_MOUSE_POS, clicks=2, interval=0.1)
        sleep(0.2)
        device_action.click(target=constants.RACE_SCROLL_BOTTOM_MOUSE_POS, clicks=2, interval=0.2)
        info("Race should be over.")
        non_match_count = 0
        continue
      else:
        info(f"Close button for view results found. Trying to go into the race.")
        device_action.click(target=close_btn)
        if click_match(matches.get("race")) or click_match(matches.get("race_2")):
          info("Pressed race.")
          sleep(2)
          do_race()
          non_match_count = 0
          continue

    if (
      click_match(lr_matches.get("lr_confirm"), "lr_confirm") or
      click_match(lr_matches.get("lr_next"), "lr_next") or
      click_match(lr_matches.get("lr_next2"), "lr_next2") or
      click_match(lr_matches.get("lr_race"), "lr_race") or
      click_match(lr_matches.get("lr_race2"), "lr_race2") or
      click_match(lr_matches.get("lr_race3"), "lr_race3")
    ):
      non_match_count=0
      continue

    if lr_matches.get("lr_ticket"):
      device_action.click(constants.LR_TOP_RACE_MOUSE_POS)

  device_action.click(constants.SAFE_SPACE_MOUSE_POS)
  non_match_count+=1
