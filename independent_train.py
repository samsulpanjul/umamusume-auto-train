# Standalone launcher for independent training careers.
# Usage:
#   py independent_train.py
#   py independent_train.py --card "Card Name" --agenda 3
#
# Portrait orientation only, designed for ADB (MumuPlayer), mirrors auto_misc.py's setup.
# Flow:
#   0  reach the home screen (dismiss popups)
#   1  home screen -> career
#   2  scenario selection -> next
#   3  trainee selection -> next
#   4  legacy selection -> next
#   5  support card selection -> friends card zone
#   6  select card: --card name via OCR search (scroll + refresh until found),
#      otherwise first card with the last login banner
#   7  support card selection -> start career
#   8  final confirmation -> select independent training (if not selected) -> edit
#   9  agenda screen -> my agendas
#  10  my agendas -> load list slot 1/2/3 (--agenda)
#  11  overwrite / continue popups (0, 1 or 2 of them): overwrite.png else close_btn.png
#  12  agenda screen -> close
#  13  final confirmation -> start!
#  14  wait for the training to start, then stop the script (no notification)

import argparse
import re
import time

import cv2
import numpy as np

import pygetwindow as gw
import pyautogui
import keyboard

import utils.device_action_wrapper as device_action
import utils.constants as constants
import core.config as config
import core.bot as bot
from core.ocr import get_reader
from utils.adb_actions import init_adb
from utils.log import info, warning, error, debug, args, init_logging
from utils.tools import sleep, get_secs
from rapidfuzz import fuzz

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

stop_key = 'left ctrl+q'
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
    import pyautogui
    from utils.pyautogui_actions import screen_to_world_conversion_init
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
      error(f"Your resolution is {target_window.width} x {target_window.height}. Minimum expected size is 1920 x 1080.")
      return
    if target_window.isMinimized:
      target_window.restore()
    else:
      target_window.minimize()
      sleep(0.2)
      target_window.restore()
      sleep(0.5)
    bot.windows_window = target_window
    if target_window.width > 1920 or target_window.height > 1080:
      info("Screen bigger than standard 1080p. Initializing screen space conversions.")
      screen_to_world_conversion_init()
  except Exception as e:
    error(f"Error focusing window: {e}")
    return False
  return True

# ---------------------------------------------------------------------------
# Launch parameters (own parser, doesn't interfere with utils.log's args)
# ---------------------------------------------------------------------------
launch_parser = argparse.ArgumentParser(add_help=False)
launch_parser.add_argument('--card', type=str, default=None,
  help='Support card name to select in the Friends card zone via OCR search. '
       'If omitted, the first card showing the last login banner is picked instead.')
launch_parser.add_argument('--agenda', type=int, choices=[1, 2, 3], default=1,
  help='Which "Load List" slot to use on the My Agendas screen. Defaults to 1.')
launch_args, _ = launch_parser.parse_known_args()

# ---------------------------------------------------------------------------
# Flow templates (portrait only)
# ---------------------------------------------------------------------------
flow_templates = {
  "career_btn": "assets/buttons/career_btn.png",
  "add_friends": "assets/buttons/add_friends.png",
  "last_login": "assets/buttons/last_login.png",
  "start_career_button": "assets/buttons/start_career_button.png",
  "independent_training_btn": "assets/buttons/independent_training_btn.png",
  "independent_training_active_btn": "assets/buttons/independent_training_active_btn.png",
  "edit_btn": "assets/buttons/edit_btn.png",
  "my_agendas": "assets/buttons/my_agendas.png",
  "load_list": "assets/buttons/load_list.png",
  "overwrite": "assets/buttons/overwrite.png",
  "start_btn": "assets/buttons/start_btn.png",
  "refresh_btn": "assets/buttons/tt_refresh_btn.png",
}

dismiss_templates = {
  "ok_btn": "assets/buttons/ok_btn.png",
  "ok_2_btn": "assets/buttons/ok_2_btn.png",
  "confirm_btn": "assets/buttons/confirm_btn.png",
  "close_btn": "assets/buttons/close_btn.png",
  "cancel_btn": "assets/buttons/cancel_btn.png",
}

# ---------------------------------------------------------------------------
# Regions / swipe coordinates.
# Computed at call time because adjust_constants_x_coords() shifts
# GAME_WINDOW_BBOX when running over ADB.
# ---------------------------------------------------------------------------
def game_window_ltrb():
  return constants.GAME_WINDOW_BBOX

def swipe_up_start():
  x, y = game_window_ltrb()[0], game_window_ltrb()[1]
  return (x + 400, y + 880)

def swipe_up_end():
  x, y = game_window_ltrb()[0], game_window_ltrb()[1]
  return (x + 400, y + 480)

MAX_CARD_CYCLES = 15          # refresh cycles before giving up on a card
CARD_NAME_MATCH_THRESHOLD = 0.75  # rapidfuzz ratio required to accept an OCR name match

# ---------------------------------------------------------------------------
# Generic helpers
# ---------------------------------------------------------------------------
def dismiss_popups(max_rounds=3):
  """Dismiss unexpected popups (ok / confirm / close / cancel). Returns True if any were clicked."""
  any_clicked = False
  for _ in range(max_rounds):
    device_action.flush_screenshot_cache()
    screenshot = device_action.screenshot()
    matches = device_action.multi_match_templates(dismiss_templates, screenshot=screenshot)
    clicked = False
    for name in ["ok_btn", "ok_2_btn", "confirm_btn", "close_btn", "cancel_btn"]:
      boxes = matches.get(name)
      if boxes:
        x, y, w, h = boxes[0]
        offset_x = constants.GAME_WINDOW_REGION[0]
        device_action.click(target=(offset_x + x + w // 2, y + h // 2), text=f"Dismissed popup with {name}.")
        clicked = True
        any_clicked = True
        sleep(0.8)
        break
    if not clicked:
      break
  return any_clicked

def wait_for_and_click(img_path, timeout_s=20, region_ltrb=None, settle=0.5):
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    if device_action.locate_and_click(img_path, min_search_time=get_secs(0.5), region_ltrb=region_ltrb or game_window_ltrb()):
      sleep(settle)
      return True
    sleep(0.5)
  error(f"Could not find \"{img_path}\" within {timeout_s} seconds.")
  return False

def wait_until_gone(img_path, timeout_s=20):
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    if not device_action.locate(img_path, min_search_time=get_secs(0.5), region_ltrb=game_window_ltrb()):
      return True
    sleep(0.5)
  return False

# ---------------------------------------------------------------------------
# Card selection helpers
# ---------------------------------------------------------------------------
def normalize_name(text):
  return " ".join(re.sub(r"[^a-z0-9 ]", " ", text.lower()).split())

def ocr_find_card(screenshot_img, card_name):
  """OCR the card list, return (x, y, matched_text, score) of the best name match or None.
  Coordinates are relative to the passed screenshot."""
  reader = get_reader()
  results = reader.readtext(
    screenshot_img,
    allowlist="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'&.! ",
  )
  target = normalize_name(card_name)
  best = None
  best_score = 0.0
  for quad, text, confidence in results:
    score = fuzz.ratio(target, normalize_name(text)) / 100.0
    if score > best_score:
      best_score = score
      best = (quad, text)
  if best and best_score >= CARD_NAME_MATCH_THRESHOLD:
    quad, text = best
    xs = [point[0] for point in quad]
    ys = [point[1] for point in quad]
    return (int(sum(xs) / 4), int(sum(ys) / 4)), text, best_score
  return None

def card_list_page_changed(before, after):
  if before is None or after is None or before.shape != after.shape:
    return False
  return float(np.mean(cv2.absdiff(before, after))) > 2.0

def scroll_card_list():
  """Swipe the card list up one page. Returns True if the visible content changed."""
  device_action.flush_screenshot_cache()
  before = device_action.screenshot()
  device_action.swipe(swipe_up_start(), swipe_up_end(), duration=0.4)
  sleep(0.6)
  device_action.flush_screenshot_cache()
  after = device_action.screenshot()
  return card_list_page_changed(before, after)

def refresh_card_list():
  info("Reached the end of the card list, hitting the refresh button and starting over.")
  if not device_action.locate_and_click(flow_templates["refresh_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
    warning("Refresh button not found, continuing anyway.")
  sleep(1)

def select_card_by_ocr(card_name, max_cycles=MAX_CARD_CYCLES):
  """Scroll/scan the card list until the OCR finds the card name, then click it."""
  for cycle in range(1, max_cycles + 1):
    device_action.flush_screenshot_cache()
    screenshot = device_action.screenshot()
    hit = ocr_find_card(screenshot, card_name)
    if hit:
      (x, y), text, score = hit
      offset_x = constants.GAME_WINDOW_REGION[0]
      info(f"Found card \"{text}\" (match score {score:.2f}) on cycle {cycle}. Clicking it.")
      device_action.click(target=(offset_x + x, y))
      sleep(0.5)
      return True
    info(f"Card \"{card_name}\" not visible (cycle {cycle}/{max_cycles}). Scanning further.")
    if not scroll_card_list():
      refresh_card_list()
  error(f"Could not find card \"{card_name}\" after {max_cycles} scroll/refresh cycles.")
  return False

def select_first_last_login_card(max_cycles=MAX_CARD_CYCLES):
  """Scroll/scan the card list until a card with the last login banner shows up, then click it."""
  for cycle in range(1, max_cycles + 1):
    if device_action.locate_and_click(flow_templates["last_login"], min_search_time=get_secs(0.5), region_ltrb=game_window_ltrb()):
      info(f"Selected the first card with the last login banner on cycle {cycle}.")
      sleep(0.5)
      return True
    info(f"No last login banner visible (cycle {cycle}/{max_cycles}). Scanning further.")
    if not scroll_card_list():
      refresh_card_list()
  error(f"Could not find a card with the last login banner after {max_cycles} scroll/refresh cycles.")
  return False

# ---------------------------------------------------------------------------
# Flow steps
# ---------------------------------------------------------------------------
def step_reach_home():
  deadline = time.time() + get_secs(30)
  while time.time() < deadline:
    if device_action.locate(flow_templates["career_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
      info("Home screen detected.")
      return True
    dismiss_popups()
    sleep(0.5)
  error("Could not reach the home screen within 30 seconds.")
  return False

def select_load_list_slot(slot):
  """Click the Nth (1-based) \"Load List\" button on the My Agendas screen."""
  for attempt in range(5):
    device_action.flush_screenshot_cache()
    screenshot = device_action.screenshot()
    boxes = device_action.match_template(flow_templates["load_list"], screenshot, threshold=0.85)
    if boxes:
      boxes.sort(key=lambda box: (box[1], box[0]))
      if len(boxes) >= slot:
        x, y, w, h = boxes[slot - 1]
        offset_x = constants.GAME_WINDOW_REGION[0]
        info(f"Clicking \"Load List\" slot {slot} of {len(boxes)} found.")
        device_action.click(target=(offset_x + x + w // 2, y + h // 2))
        return True
      info(f"Only found {len(boxes)} \"Load List\" button(s), need slot {slot}. Retrying.")
    sleep(1)
  error(f"Could not find \"Load List\" slot {slot} on the My Agendas screen.")
  return False

def handle_overwrite_popups(max_rounds=3):
  """Overwrite / continue popups: 0, 1 or 2 can appear. Prefer overwrite, else close."""
  for round_num in range(1, max_rounds + 1):
    if device_action.locate_and_click(flow_templates["overwrite"], min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info(f"Confirmed overwrite popup (round {round_num}).")
      sleep(1)
      continue
    if device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info(f"Closed a popup with the close button (round {round_num}).")
      sleep(1)
      continue
    break

def run_flow():
  # 0. Reach the home screen
  info("Step 0: Navigating to the home screen.")
  if not step_reach_home():
    return False

  # 1. Home screen -> career
  info("Step 1: Clicking career.")
  if not wait_for_and_click(flow_templates["career_btn"], timeout_s=get_secs(15)):
    return False

  # 2. Scenario selection -> next
  info("Step 2: Scenario selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return False

  # 3. Trainee selection -> next
  info("Step 3: Trainee selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return False

  # 4. Legacy selection -> next
  info("Step 4: Legacy selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return False

  # 5. Support card selection -> friends card zone
  info("Step 5: Support card selection, opening the Friends card zone.")
  sleep(get_secs(1.5))
  if not wait_for_and_click(flow_templates["add_friends"], timeout_s=get_secs(30)):
    return False

  # 6. Select card
  if launch_args.card:
    info(f"Step 6: Searching for support card \"{launch_args.card}\" via OCR.")
    if not select_card_by_ocr(launch_args.card):
      return False
  else:
    info("Step 6: No --card given, selecting the first card with the last login banner.")
    if not select_first_last_login_card():
      return False

  # 7. Support card selection -> start career
  info("Step 7: Clicking start career.")
  sleep(get_secs(1))
  if not wait_for_and_click(flow_templates["start_career_button"], timeout_s=get_secs(30)):
    return False

  # 8. Final confirmation -> select independent training if not selected -> edit
  info("Step 8: Final confirmation screen.")
  sleep(get_secs(1.5))
  if device_action.locate(flow_templates["independent_training_active_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
    info("Independent training is already selected.")
  else:
    info("Independent training not selected, selecting it.")
    if not wait_for_and_click(flow_templates["independent_training_btn"], timeout_s=get_secs(15)):
      return False
  if not wait_for_and_click(flow_templates["edit_btn"], timeout_s=get_secs(15)):
    return False

  # 9. Agenda screen -> my agendas
  info("Step 9: Opening My Agendas.")
  if not wait_for_and_click(flow_templates["my_agendas"], timeout_s=get_secs(15)):
    return False

  # 10. My agendas -> load list slot
  info(f"Step 10: Loading agenda list slot {launch_args.agenda}.")
  sleep(get_secs(1))
  if not select_load_list_slot(launch_args.agenda):
    return False

  # 11. Overwrite / continue popups (optional, sometimes two)
  info("Step 11: Handling overwrite / continue popups if any.")
  sleep(get_secs(1))
  handle_overwrite_popups()

  # 12. Agenda screen -> close
  info("Step 12: Closing the agenda screen.")
  device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(2), region_ltrb=game_window_ltrb())
  sleep(get_secs(0.5))

  # 13. Final confirmation -> start!
  info("Step 13: Clicking start!")
  if not wait_for_and_click(flow_templates["start_btn"], timeout_s=get_secs(30)):
    return False

  # 14. Completion, no notification
  info("Step 14: Waiting for the training to start.")
  if wait_until_gone(flow_templates["start_btn"], timeout_s=get_secs(25)) or wait_until_gone(flow_templates["edit_btn"], timeout_s=get_secs(5)):
    info("Independent training started successfully.")
  else:
    warning("Confirmation screen still visible, assuming the training started anyway.")
  return True

def main():
  if not bot.use_adb:
    warning("This script is designed for portrait ADB (MumuPlayer). The Steam window path is not supported.")
  card_desc = launch_args.card if launch_args.card else "<no card set, will pick the last login card>"
  info(f"Independent training launcher starting. Card: {card_desc}, Agenda slot: {launch_args.agenda}.")
  if not focus_umamusume():
    error("Failed to focus Umamusume window")
    return
  try:
    if run_flow():
      info("Independent training flow finished.")
    else:
      error("Independent training flow failed, see logs above.")
  except device_action.BotStopException:
    info("Bot stopped by hotkey.")
  bot.is_bot_running = False

if __name__ == "__main__":
  main()
