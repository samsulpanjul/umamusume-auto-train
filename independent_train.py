# Standalone launcher for independent training careers.
# Usage:
#   py independent_train.py
#   py independent_train.py --card "Card Name" --agenda 3
#
# Portrait orientation only, designed for ADB (MumuPlayer), mirrors auto_misc.py's setup.
# Runs indefinitely, one training cycle after another:
#   0  reach the home screen (dismiss popups)
#   1  home screen -> career button state:
#        Post-Career ribbon (training completed) -> Independent Training
#        popup -> Career button -> Complete Career screen -> finish career,
#        Training Independently ribbon (training running) -> popup ->
#        Career button -> wait for the training to finish,
#        Career button (no training) -> start a new career
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
#  11  confirm the load (0, 1 or 2 popups: overwrite.png else close_btn.png),
#      close the agenda screen, then hit Start the moment it is reachable
#  12  wait for the training to start
#  15  sleep 50 minutes while the in-game training runs
#  16  overview screen -> OK
#  17  complete career screen -> spend all skill points:
#      read SP counter (OCR), scan the whole list recording cost + gold flag,
#      scroll back to top, then a cost-aware greedy second pass that maximizes
#      the number of skills bought (a gold skill's listed price includes the
#      skill under it, which buying the gold auto-buys; if the base was picked
#      as a cheaper single the plan upgrades it to the gold for the difference),
#      the top of the list is reserved (pre-bought row 1 + 2 rows never bought),
#      repeat while skill_exclamation.png shows unspent points
#  18  complete career -> spend skill points -> Finish -> Next -> Confirm x2 ->
#       Close -> Next x7 -> to_home -> loop until home screen -> next cycle

import argparse
import os
import re
import sys
import time

import cv2
import numpy as np
import Levenshtein

import pygetwindow as gw
import pyautogui
import keyboard

import utils.device_action_wrapper as device_action
import utils.constants as constants
import core.config as config
import core.bot as bot
from PIL import Image
from core.ocr import get_reader, extract_text, extract_number
from core.recognizer import compare_brightness
from utils.screenshot import enhanced_screenshot, are_screenshots_same
import utils.adb_actions as adb_actions
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
  "overview": "assets/ui/overview.png",
  "post_career": "assets/ui/post_career.png",
  "training_independently": "assets/ui/training_independently.png",
  "complete_career_btn": "assets/buttons/complete_career_btn.png",
  "career_independent_btn": "assets/buttons/career_independent_btn.png",
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

# Skill screen ("Learn") regions, measured against a 800x1080 portrait screenshot.
# SP counter number ("Skill Points 3394"), offsets relative to GAME_WINDOW_BBOX.
SKILL_SP_OFFSETS = (535, 332, -155, -698)
BUY_ICON_THRESHOLD = 0.70      # buy_skill.png "+" buttons score ~0.74, not 0.9
GOLD_SAT_THRESHOLD = 40        # HSV saturation of a gold card pixel: gold ~77+, white ~15
GOLD_PIXEL_FRACTION = 0.5      # share of saturated pixels in the sampled card area
                               # (measured: gold rows 0.73-0.97, white rows 0.04-0.20)
NAME_MATCH_THRESHOLD = 0.85    # Levenshtein ratio for skill name dedupe / target matching
# The top of the skill list is reserved: row 1 is pre-bought by default
# (disabled, no SP cost) and the following two skills must never be bought.
SKILL_LIST_RESERVED_ROWS = 2   # costed rows at the top of the list to ignore
# Scrolling the skill list: skill rows sit ~157px apart in the 450px-tall viewport.
# A normal ADB swipe always flings (lift velocity = travel/duration), and Unity
# then keeps scrolling with momentum. The no-fling gesture below moves the finger
# fast but holds it still before lifting. Measured on the real skill list:
# 400px travel = ~370px scroll, identical every repeat, static within 2s.
# The step must stay <= ~360px so every row's FIRST sighting lands mid-frame
# (rows only enter the viewport from the bottom; the buy button is matchable
# while its top is <= ~410px, so the first sighting sits at >= 410 - step).
# With a bigger step rows can appear only clipped at the frame edges, where
# the name OCR reads garbage and the gold strip falls outside the frame.
SKILL_SCROLL_STEP_PX = 420     # finger travel; (safe, row height ~157px)
SKILL_SCROLL_DURATION_S = 0.5  # only used by the slow-swipe fallback
NO_FLING_INTERP_POINTS = 10    # MOVE events interpolating the fast travel
NO_FLING_HOLD_EVENTS = 40      # stationary MOVE events before the lift (kills Unity inertia, prevents slow residual slide)
NO_FLING_SUPPORTED = True      # flips off after the first "input motionevent" failure

def skill_sp_region():
  return constants.add_tuple_elements(game_window_ltrb(), SKILL_SP_OFFSETS)

def skill_scroll_step_end():
  """End point of one predictable scroll step, starting from SKILL_SCROLL_BOTTOM_MOUSE_POS."""
  x, y = constants.SKILL_SCROLL_BOTTOM_MOUSE_POS
  return (x, y - SKILL_SCROLL_STEP_PX)

def no_fling_swipe(start_xy, end_xy):
  """Scroll gesture: press, travel fast, hold still, then lift. The hold drives
  the lift velocity to zero so neither ADB nor Unity adds fling momentum - the
  list moves exactly the dragged distance. Falls back to a slow plain swipe
  when the device doesn't support 'input motionevent'."""
  global NO_FLING_SUPPORTED
  if bot.use_adb and adb_actions.device is not None and NO_FLING_SUPPORTED:
    x1, y1 = start_xy
    x2, y2 = end_xy
    parts = [f"input motionevent DOWN {x1} {y1}"]
    for i in range(1, NO_FLING_INTERP_POINTS + 1):
      parts.append(f"input motionevent MOVE {x1 + (x2 - x1) * i // NO_FLING_INTERP_POINTS} {y1 + (y2 - y1) * i // NO_FLING_INTERP_POINTS}")
    for _ in range(NO_FLING_HOLD_EVENTS):
      parts.append(f"input motionevent MOVE {x2} {y2}")
    parts.append(f"input motionevent UP {x2} {y2}")
    output = str(adb_actions.device.shell(";".join(parts)) or "")
    if "Exception" in output:
      warning("input motionevent is not supported by this device, falling back to slow swipes.")
      adb_actions.device.shell(f"input motionevent UP {x2} {y2}")  # release a half-injected gesture, best effort
      NO_FLING_SUPPORTED = False
    return
  device_action.swipe(start_xy, end_xy, duration=SKILL_SCROLL_DURATION_S)

def skill_frames_equal(screenshot1, screenshot2):
  """Compare the content band of two skill-screen frames. The scrollbar on the
  right edge fades in and out after every scroll and would keep full-frame
  comparisons failing, so it is excluded."""
  return are_screenshots_same(screenshot1[:, 100:650], screenshot2[:, 100:650], diff_threshold=5)

def settle_skill_scroll(max_wait_s=3.5):
  """Wait until the skill list stops moving after a scroll gesture, then return
  the settled screenshot. Also covers the entrance animation after the screen
  opens, so scanning never happens on a moving frame."""
  time.sleep(0.4)
  device_action.flush_screenshot_cache()
  screenshot = device_action.screenshot(region_ltrb=constants.SCROLLING_SKILL_SCREEN_BBOX)
  deadline = time.time() + max_wait_s
  while time.time() < deadline:
    time.sleep(0.4)
    device_action.flush_screenshot_cache()
    screenshot2 = device_action.screenshot(region_ltrb=constants.SCROLLING_SKILL_SCREEN_BBOX)
    if skill_frames_equal(screenshot, screenshot2):
      return screenshot2
    screenshot = screenshot2
  debug("Skill list did not fully settle in time, using the latest frame.")
  return screenshot

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

def locate_grayscale(img_path, threshold=0.85, min_search_time=0.0, region_ltrb=None):
  """locate() equivalent using grayscale matching. Needed for UI sitting on
  animated/varied backgrounds (Complete Career screen), where the button tint
  shifts with what's behind it and color matching only scores ~0.7."""
  region = region_ltrb or game_window_ltrb()
  start_time = time.time()
  while True:
    screenshot = device_action.screenshot(region_ltrb=region)
    boxes = device_action.match_template(img_path, screenshot, threshold=threshold, grayscale=True)
    if boxes:
      x, y, w, h = boxes[0]
      return (x + region[0] + w // 2, y + region[1] + h // 2)
    if time.time() - start_time >= min_search_time:
      return None
    sleep(0.5)

def locate_grayscale_and_click(img_path, threshold=0.85, min_search_time=0.5, region_ltrb=None):
  coordinates = locate_grayscale(img_path, threshold=threshold, min_search_time=min_search_time, region_ltrb=region_ltrb)
  if coordinates:
    device_action.click(target=coordinates)
    return True
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
# Skill screen helpers (cost-aware skill buying)
# ---------------------------------------------------------------------------
def read_skill_points():
  """OCR the Skill Points counter on the Learn screen. Returns -1 on failure."""
  img = device_action.screenshot(region_ltrb=skill_sp_region())
  value = extract_number(Image.fromarray(img))
  debug(f"Skill points OCR read: {value}")
  return value

def ocr_row_name(world_icon):
  """OCR the skill name of a row, given the row's buy button in world coords."""
  x, y, _, _ = world_icon
  return extract_text(enhanced_screenshot((x - 505, y - 48, 390, 26)))

def ocr_row_cost(world_icon):
  """OCR the skill cost of a row, given the row's buy button in world coords."""
  x, y, _, _ = world_icon
  return extract_number(enhanced_screenshot((x - 75, y - 5, 70, 40)))

def is_gold_row(region_screenshot, icon):
  """Gold skills use a saturated blue-gradient card; normal skills use a
  near-grayscale one. Samples the card area left of the buy button, spanning
  above and below it and clipped to the frame, so rows partially cut off at
  the frame edges are still classified correctly. Returns True/False, or
  None when too little card area is visible."""
  rx, ry, _, _ = icon
  height = region_screenshot.shape[0]
  y1, y2 = max(0, ry - 20), min(height, ry + 80)
  x1, x2 = rx - 70, rx - 5
  if y2 - y1 < 40 or x2 <= x1:
    return None
  box = region_screenshot[y1:y2, x1:x2]
  saturation = cv2.cvtColor(box, cv2.COLOR_RGB2HSV)[:, :, 1]
  gold_fraction = float(np.mean(saturation > GOLD_SAT_THRESHOLD))
  return gold_fraction > GOLD_PIXEL_FRACTION

def find_name_match(text, candidates, threshold=NAME_MATCH_THRESHOLD):
  """Fuzzy-match an OCR'd skill name against candidate names. Returns (best, score)."""
  best, best_score = None, 0.0
  for candidate in candidates:
    score = Levenshtein.ratio(normalize_name(text), normalize_name(candidate))
    if score > best_score:
      best_score, best = score, candidate
  if best_score >= threshold:
    return best, best_score
  return None, best_score

def match_skill_icons(screenshot_region):
  """Match buy buttons on a SCROLLING_SKILL_SCREEN_BBOX screenshot, sorted top to bottom."""
  icons = device_action.match_template("assets/icons/buy_skill.png", screenshot_region, threshold=BUY_ICON_THRESHOLD)
  icons.sort(key=lambda box: box[1])
  return icons

def scan_skill_list(max_pages=40):
  """First pass: scroll the whole skill list, recording name, cost and gold flag per row.
  Returns (entries, pages)."""
  entries = []
  pages = 0
  x1, y1, _, _ = constants.SCROLLING_SKILL_SCREEN_BBOX
  screenshot1 = settle_skill_scroll()
  while pages < max_pages:
    region_height = screenshot1.shape[0]
    for icon in match_skill_icons(screenshot1):
      # Rows clipped at the frame edge must not be recorded: a top-clipped row
      # OCRs garbage for a name (the crop lands above the card) and re-sightings
      # would also overwrite a good cost with a misread one. Every row gets a
      # mid-frame sighting on another page (see SKILL_SCROLL_STEP_PX).
      if icon[1] < 48 or icon[1] > region_height - 40:
        debug(f"Skill row skipped, clipped at the frame edge (icon y {icon[1]}).")
        continue
      world_icon = (icon[0] + x1, icon[1] + y1, icon[2], icon[3])
      name = ocr_row_name(world_icon)
      cost = ocr_row_cost(world_icon)
      gold = is_gold_row(screenshot1, icon)
      if not name or cost <= 0:
        debug(f"Skill row skipped, unreadable name/cost: \"{name}\", {cost}.")
        continue
      existing, _ = find_name_match(name, [entry["name"] for entry in entries])
      if existing:
        # Seen on an overlapping scroll frame; refresh with the better sighting.
        for entry in entries:
          if entry["name"] == existing:
            entry["cost"] = cost
            if gold is not None and gold != entry["gold"]:
              debug(f"Skill \"{existing}\" gold flag changed to {gold} on a re-sighting.")
              entry["gold"] = gold
            break
        continue
      entries.append({"name": name, "cost": cost, "gold": bool(gold)})
      info(f"Skill found: \"{name}\", cost {cost}, {'gold' if gold else 'normal'}.")
    no_fling_swipe(constants.SKILL_SCROLL_BOTTOM_MOUSE_POS, skill_scroll_step_end())
    pages += 1
    screenshot2 = settle_skill_scroll()
    if skill_frames_equal(screenshot1, screenshot2):
      debug("Reached the end of the skill list.")
      break
    screenshot1 = screenshot2
  # The scan starts at the top of the list and rows are recorded in list
  # order (monotonic scroll, top-to-bottom within each frame), so the first
  # recorded entries are the reserved rows at the top. The disabled row 1 is
  # already excluded above by the cost <= 0 check.
  for entry in entries[:SKILL_LIST_RESERVED_ROWS]:
    info(f"Ignoring reserved skill \"{entry['name']}\" (top rows of the list are never bought).")
  entries = entries[SKILL_LIST_RESERVED_ROWS:]
  return entries, pages

def reopen_skill_screen(pages=0):
  """Put the skill list back at the top for the purchase pass: exiting with the
  back button and reopening via the Skills button is much faster than scrolling
  up page by page. Falls back to scrolling up when the reopen doesn't land.
  Returns True when the skill screen is open again."""
  device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  sleep(get_secs(1))
  if locate_grayscale_and_click("assets/buttons/complete_career_skills_btn.png", min_search_time=get_secs(5)):
    sleep(get_secs(1))
    debug("Skill screen reopened, list back at the top.")
    return True
  warning("Could not reopen the skill screen, scrolling back to the top instead.")
  for _ in range(pages + 2):
    screenshot1 = settle_skill_scroll()
    no_fling_swipe(constants.SKILL_SCROLL_TOP_MOUSE_POS, constants.SKILL_SCROLL_BOTTOM_MOUSE_POS)
    screenshot2 = settle_skill_scroll()
    if skill_frames_equal(screenshot1, screenshot2):
      debug("Scrolled back to the top of the skill list.")
      return True
  return False

def plan_purchases(entries, skill_points):
  """Cost-aware greedy plan that maximizes the number of skills bought. All
  math runs on the first scan pass only; the returned plan is final and is
  executed as-is by the second pass.
  A gold skill auto-buys the skill listed under it and its displayed price
  already includes that skill, so the gold bundle item costs the gold's full
  scanned price and covers both rows. When the base skill was already picked
  as a cheaper single, the plan upgrades the single to the bundle instead of
  skipping the gold: the game then charges only the reduced price
  (gold - base), which is how the two golds can end up cheaper than planned."""
  items = []
  for index, entry in enumerate(entries):
    items.append({"names": [entry["name"]], "cost": entry["cost"],
                  "gold": entry["gold"], "successor": None})
    if entry["gold"] and index + 1 < len(entries):
      successor = entries[index + 1]
      if successor["cost"] >= entry["cost"]:
        # The row under a gold is always its cheaper base skill; anything else
        # is an OCR glitch, so keep the gold as a plain full-price single.
        continue
      items.append({"names": [entry["name"], successor["name"]], "cost": entry["cost"],
                    "gold": True, "successor": successor["name"]})
  # Sort by absolute cost ascending so the cheapest items are bought first.
  # This maximizes the total number of purchases (each purchase = 1 skill,
  # gold bundles = 2). Bundles sort before equally-priced singles so a gold
  # is preferred over buying the gold and its base separately.
  items.sort(key=lambda item: (item["cost"], 0 if item["successor"] else 1))
  remaining = skill_points
  picks = []
  bought = set()
  for item in items:
    if item["names"][0] in bought:
      # Already acquired, e.g. the successor of a gold that was picked earlier.
      continue
    if item["successor"] and item["successor"] in bought:
      # The base was picked as a cheaper single earlier; upgrade it to the
      # gold bundle (refund the single, pay the gold's full price).
      single = next((p for p in picks if p["successor"] is None and p["names"][0] == item["successor"]), None)
      if single is None or item["cost"] - single["cost"] > remaining:
        continue
      picks.remove(single)
      remaining -= item["cost"] - single["cost"]
      picks.append(item)
      for name in item["names"]:
        bought.add(name)
      info(f"Plan upgrades \"{item['successor']}\" to the gold bundle \"{item['names'][0]}\" "
           f"for {item['cost'] - single['cost']} extra SP.")
      continue
    if item["cost"] > remaining:
      continue
    picks.append(item)
    remaining -= item["cost"]
    for name in item["names"]:
      bought.add(name)
  spent = skill_points - remaining
  info(f"Purchase plan: {sum(len(item['names']) for item in picks)} skills for {spent} SP, {remaining} SP left over.")
  for item in picks:
    chain = " (gold, base auto-bought)" if item["successor"] else ""
    info(f"  Plan: {', '.join(item['names'])} for {item['cost']} SP{chain}.")
  return picks

def execute_purchases(picks, pages, buy_everything=False):
  """Second pass: scroll the list and click the planned skills' buy buttons.
  With buy_everything=True (SP OCR failed), every active buy button is clicked.
  Returns how many buttons were clicked."""
  picked_names = []
  target_gold = {}
  if picks is not None:
    for item in picks:
      key = normalize_name(item["names"][0])
      picked_names.append(key)
      target_gold[key] = item["gold"]
  clicked = set()
  bought_count = 0
  reserved_left = SKILL_LIST_RESERVED_ROWS  # costed rows at the top of the list, never bought
  x1, y1, _, _ = constants.SCROLLING_SKILL_SCREEN_BBOX
  screenshot1 = settle_skill_scroll()
  for _ in range(pages + 2):
    for icon in match_skill_icons(screenshot1):
      world_icon = (icon[0] + x1, icon[1] + y1, icon[2], icon[3])
      name = ocr_row_name(world_icon)
      if not name:
        continue
      if buy_everything:
        cost = ocr_row_cost(world_icon)
        if cost <= 0:
          debug(f"Skill \"{name}\" has no SP cost (pre-bought or disabled), skipping.")
          continue
        if reserved_left > 0:
          reserved_left -= 1
          info(f"Ignoring reserved skill \"{name}\" (top rows of the list are never bought).")
          continue
        match = name
      else:
        match, _ = find_name_match(name, picked_names)
      if not match or match in clicked:
        continue
      button_shot = device_action.screenshot(region_xywh=world_icon)
      if not compare_brightness("assets/icons/buy_skill.png", button_shot, brightness_diff_threshold=0.20):
        info(f"\"{name}\" is not affordable anymore, skipping.")
        continue
      if not buy_everything and target_gold.get(match):
        info(f"Buying \"{name}\" (gold, its required skill is bought automatically).")
      else:
        info(f"Buying \"{name}\".")
      device_action.click(target=(world_icon[0] + 5, world_icon[1] + 5), duration=0.15)
      clicked.add(match)
      bought_count += 1
    no_fling_swipe(constants.SKILL_SCROLL_BOTTOM_MOUSE_POS, skill_scroll_step_end())
    screenshot2 = settle_skill_scroll()
    if skill_frames_equal(screenshot1, screenshot2):
      break
    screenshot1 = screenshot2
  return bought_count

def confirm_skill_purchases():
  """Apply the picked skills and leave the skill screen (same exit as core.skill.buy_skill)."""
  device_action.locate_and_click("assets/buttons/confirm_btn.png", min_search_time=get_secs(3))
  sleep(0.5)
  device_action.locate_and_click("assets/buttons/learn_btn.png", min_search_time=get_secs(3))
  sleep(0.5)
  device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(4))
  device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)

def buy_skills_cost_aware(max_pages=40):
  """Read SP, scan the list, plan a cost-aware greedy purchase, execute it, confirm.
  Falls back to clicking every affordable skill when the SP counter can't be read."""
  sleep(get_secs(1))
  skill_points = read_skill_points()
  if skill_points < 0:
    warning("Could not read the skill points counter, falling back to buying every affordable skill.")
    bought_count = execute_purchases(None, max_pages, buy_everything=True)
    info(f"Bought {bought_count} skills. Confirming purchase.")
    confirm_skill_purchases()
    return
  info(f"Skill points available: {skill_points}.")
  entries, pages = scan_skill_list(max_pages)
  if not entries:
    warning("No buyable skills found on the skill screen, leaving it.")
    device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    return
  if not reopen_skill_screen(pages):
    warning("Skill list may not be at the top, some planned skills can be missed.")
  picks = plan_purchases(entries, skill_points)
  if picks:
    bought_count = execute_purchases(picks, pages)
    remaining_sp = read_skill_points()
    info(f"Bought {bought_count} skills, skill points now {remaining_sp}. Confirming purchase.")
    confirm_skill_purchases()
  else:
    info("Nothing affordable to buy, leaving the skill screen.")
    device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)

# ---------------------------------------------------------------------------
# Post-training steps
# ---------------------------------------------------------------------------
def sleep_through_training(minutes=50):
  """The in-game training takes exactly 50 minutes. Display a color-coded
  countdown and update once per minute. Raw time.sleep on purpose:
  SLEEP_TIME_MULTIPLIER must not scale a real-time wait."""
  total_seconds = minutes * 60
  info(f"Training is running, sleeping for {minutes} minutes.")

  # ANSI colors (work in modern Windows terminals).
  WHITE, YELLOW, GREEN, RESET = "\x1b[37m", "\x1b[33m", "\x1b[32m", "\x1b[0m"
  header = "Independent training in progress."

  def color_for(minutes_left):
    if minutes_left <= 10:
      return GREEN
    if minutes_left <= 25:
      return YELLOW
    return WHITE

  last_minute = None
  slept = 0
  bar_width = 30
  # Block characters need a UTF-8 capable stdout (interactive console); fall
  # back to ASCII when the output is redirected to a non-UTF-8 stream.
  if "utf" in (sys.stdout.encoding or "").lower():
    fill_char, empty_char = "█", "░"
  else:
    fill_char, empty_char = "#", "-"
  while slept < total_seconds:
    if not bot.is_bot_running:
      return
    chunk = min(15, total_seconds - slept)
    time.sleep(chunk)
    slept += chunk
    minutes_left = (total_seconds - slept) // 60
    if minutes_left != last_minute:
      last_minute = minutes_left
      c = color_for(minutes_left)
      percent = slept * 100 // total_seconds
      filled = bar_width * percent // 100
      label = f" {percent}% "
      label_pos = (bar_width - len(label)) // 2
      bar = "".join(
        label[i - label_pos] if label_pos <= i < label_pos + len(label)
        else (fill_char if i < filled else empty_char)
        for i in range(bar_width)
      )
      os.system("cls" if os.name == "nt" else "clear")
      print(f"{RESET}{header}{RESET}")
      print(f"")
      print(f"{RESET}{bar}{RESET}")
      print(f"Time Left: {c}{minutes_left:02d} Minutes{RESET}")

def wait_for_training_completion(timeout_s=900):
  """After the 50-minute independent training finishes, the game may show
  the overview screen, the Complete Career screen directly, or the home
  screen (where the results open via the Post-Career popup). Transitions can
  take minutes (reconnects, slow loading), so poll until a KNOWN state is
  confirmed instead of guessing from one template hit. Returns "overview",
  "complete", "post_career", "home" (career already fully collected) or None
  on timeout."""
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    if not bot.is_bot_running:
      return None
    if locate_grayscale(flow_templates["overview"], min_search_time=get_secs(2)):
      info("Training overview screen detected.")
      return "overview"
    if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=get_secs(2)):
      info("Complete Career screen detected (training done, skipped overview).")
      return "complete"
    state = detect_career_state()
    if state == "post_career":
      info("Home screen with the Post-Career ribbon detected (training done).")
      return "post_career"
    if state == "career_btn":
      info("Home screen detected with no career running.")
      return "home"
    if state == "training_independently":
      debug("Training Independently ribbon still visible, training not finished yet.")
    sleep(2)
  error(f"No known training-completion state appeared within {timeout_s} seconds.")
  return None

def handle_in_progress_training():
  """An independent training is already running (entered via the Training
  Independently popup). Poll every 30 seconds for up to 50 minutes until the
  career ends, then proceed with the post-training flow. No OCR time reading
  needed."""
  max_wait = 50 * 60
  interval = 30
  polls = max_wait // interval
  info(f"Independent training in progress. Polling every {interval}s for up to {max_wait}s.")

  for i in range(1, polls + 1):
    if not bot.is_bot_running:
      return False
    remaining = max_wait - (i - 1) * interval
    info(f"Poll {i}/{polls} — waiting {interval}s ({remaining // 60}min remaining max).")
    sleep(interval)
    # Check whether the career has ended
    if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=get_secs(2)):
      info("Complete Career screen detected — training done.")
      break
    if locate_grayscale(flow_templates["overview"], min_search_time=get_secs(2)):
      info("Overview screen detected — training done.")
      wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(15))
      break
    if locate_grayscale(flow_templates["post_career"], min_search_time=get_secs(2)):
      info("Post-Career button detected — training done, opening its popup.")
      open_post_career_popup()
      break
  else:
    warning("Polling exhausted after 50 minutes, proceeding anyway.")

  info("Finishing the completed career.")
  return complete_career()

def click_popup_career_button(timeout_s=20):
  """Click the green Career button inside the Independent Training popup."""
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    if locate_grayscale_and_click(flow_templates["career_independent_btn"], min_search_time=get_secs(2)):
      sleep(get_secs(1))
      return True
    sleep(get_secs(1))
  warning("Career button not found in the Independent Training popup.")
  return False

def open_post_career_popup(timeout_s=20):
  """Click the Post-Career ribbon on the home screen, then the green Career
  button inside the Independent Training popup. Returns True when the popup
  button was clicked (navigation itself is verified by the caller)."""
  if not locate_grayscale_and_click(flow_templates["post_career"], min_search_time=get_secs(2)):
    warning("Could not click the Post-Career button.")
    return False
  return click_popup_career_button(timeout_s)

def ensure_complete_career_screen(timeout_s=120):
  """Wait for the Complete Career screen to appear. Right after the popup's
  Career button the game shows the training OVERVIEW screen first; click its
  OK and keep waiting for the Complete Career screen behind it. The game can
  also bounce back to the home screen (observed while a "Connecting" banner
  was up) or take over a minute to load, so retry the Post-Career popup
  navigation when the home screen reappears. Returns False when the screen
  never appears — callers must not trust a "no unspent points" result made on
  a foreign screen."""
  deadline = time.time() + timeout_s
  retries = 0
  while time.time() < deadline:
    if locate_grayscale(flow_templates["overview"], min_search_time=get_secs(2)):
      info("Training overview screen detected, clicking OK.")
      wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(15))
    if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=get_secs(2)):
      # Confirm after a settle pause: right after navigation the screen can
      # still be covered by a transition overlay.
      sleep(get_secs(2))
      if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=get_secs(1)):
        return True
    if detect_career_state() == "post_career":
      if retries >= 3:
        warning("Still bouncing back to the home screen after 3 popup navigation attempts.")
        return False
      retries += 1
      warning(f"Home screen detected while waiting for the Complete Career screen, "
              f"retrying the Post-Career popup navigation (attempt {retries}/3).")
      if not open_post_career_popup():
        return False
    sleep(2)
  warning("Complete Career screen did not appear in time.")
  return False

def handle_post_career_state():
  """Home career button shows the Post-Career ribbon: the last independent
  training has finished. Open the Independent Training popup, take the popup's
  Career button to the training overview, collect it with OK, and finish the
  career from the Complete Career screen."""
  info("Career state: Post-Career (training completed). Opening its popup.")
  if not open_post_career_popup():
    return False
  if not ensure_complete_career_screen():
    error("Complete Career screen did not appear after the popup's Career button.")
    return False
  info("Complete Career screen reached, finishing the leftover career.")
  if not complete_career():
    return False
  info("Finished the leftover career, restarting the cycle.")
  return True

def handle_training_independently_state():
  """Home career button shows the Training Independently ribbon: a training is
  running. Open the Independent Training popup, enter the training view via the
  popup's Career button, and wait for the training to finish."""
  info("Career state: Training Independently (training in progress).")
  if not locate_grayscale_and_click(flow_templates["training_independently"], min_search_time=get_secs(2)):
    warning("Could not click the Training Independently button.")
    return False
  click_popup_career_button()  # best effort: enter the training view
  info("Waiting for the training to finish.")
  if not handle_in_progress_training():
    return False
  info("Training finished, restarting the cycle.")
  return True

def buy_first_affordable_skill(max_pages=40):
  """Simplified buy for subsequent rounds: scroll the skill list and purchase
  the first affordable skill found, then confirm. The reserved rows at the top
  of the list are never bought, and rows without an SP cost (pre-bought or
  already purchased) are skipped. Returns True if a skill was bought, False if
  none were affordable."""
  x1, y1, _, _ = constants.SCROLLING_SKILL_SCREEN_BBOX
  screenshot1 = settle_skill_scroll()
  reserved_left = SKILL_LIST_RESERVED_ROWS
  for _ in range(max_pages):
    for icon in match_skill_icons(screenshot1):
      world_icon = (icon[0] + x1, icon[1] + y1, icon[2], icon[3])
      name = ocr_row_name(world_icon)
      if not name:
        continue
      cost = ocr_row_cost(world_icon)
      if cost <= 0:
        debug(f"Skill \"{name}\" has no SP cost (pre-bought or already bought), skipping.")
        continue
      if reserved_left > 0:
        reserved_left -= 1
        info(f"Ignoring reserved skill \"{name}\" (top rows of the list are never bought).")
        continue
      button_shot = device_action.screenshot(region_xywh=world_icon)
      if compare_brightness("assets/icons/buy_skill.png", button_shot, brightness_diff_threshold=0.20):
        info(f"Buying first affordable skill: \"{name}\".")
        device_action.click(target=(world_icon[0] + 5, world_icon[1] + 5), duration=0.15)
        sleep(0.5)
        confirm_skill_purchases()
        return True
    no_fling_swipe(constants.SKILL_SCROLL_BOTTOM_MOUSE_POS, skill_scroll_step_end())
    screenshot2 = settle_skill_scroll()
    if skill_frames_equal(screenshot1, screenshot2):
      break
    screenshot1 = screenshot2
  info("No affordable skills found on the skill screen.")
  device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  return False

def unspent_skill_points_visible(attempts=3):
  """Check for the unspent-points exclamation mark, retrying a few times with
  pauses: the icon can appear with a short animation once the screen settles."""
  for attempt in range(1, attempts + 1):
    if locate_grayscale("assets/ui/skill_exclamation.png", min_search_time=get_secs(2)):
      return True
    if attempt < attempts:
      sleep(get_secs(1.5))
  return False

def spend_all_skill_points(max_rounds=5):
  """On the Complete Career screen: while skill_exclamation.png shows unspent
  points, open the skill screen and buy, then continue. The first round does
  a full cost-aware scan and plan; subsequent rounds just buy the first
  affordable skill found."""
  # Only trust a "no unspent points" result made on the confirmed Complete
  # Career screen: on any other screen (e.g. bounced back to home) the
  # exclamation mark is naturally absent and the points would be lost.
  if not ensure_complete_career_screen():
    error("Not on the Complete Career screen, refusing to skip the skill-point spending.")
    return False
  for round_num in range(1, max_rounds + 1):
    if not unspent_skill_points_visible():
      debug("No unspent skill points detected.")
      return True
    info(f"Unspent skill points detected (round {round_num}), opening the skill screen.")
    if not locate_grayscale_and_click("assets/buttons/complete_career_skills_btn.png", min_search_time=get_secs(5)):
      warning("Could not find the Skills button on the Complete Career screen.")
      return False
    if round_num == 1:
      buy_skills_cost_aware()
    else:
      buy_first_affordable_skill()
    sleep(get_secs(1))
  warning("Skill points still unspent after 5 buying rounds, continuing anyway.")
  return True

def detect_career_state():
  """Which home career-button state is visible ("post_career",
  "training_independently", "career_btn"), or None when none matches."""
  for name, template in (("post_career", flow_templates["post_career"]),
                         ("training_independently", flow_templates["training_independently"]),
                         ("career_btn", flow_templates["career_btn"])):
    if device_action.locate(template, min_search_time=get_secs(0.5), region_ltrb=game_window_ltrb()) is not None:
      return name
  return None

def is_on_home_screen():
  """Check whether one of the three career button states is visible
  (home screen indicator)."""
  return detect_career_state() is not None

def complete_career_sequence():
  """After spending skill points, walk through the career completion sequence:
  Click Finish, then Next, Confirm x2, Close, Next x7, to_home.
  Keep trying until the home screen is reached or a timeout expires."""
  deadline = time.time() + get_secs(120)

  
  # 0. Click Finish
  info("Clicking Complete Career.")
  if not wait_for_and_click("assets/buttons/complete_career_btn.png", timeout_s=get_secs(20)):
    warning("Finish button not found, trying to continue anyway.")
    
  # 1. Click Finish
  info("Clicking Finish.")
  if not wait_for_and_click("assets/buttons/Finish.png", timeout_s=get_secs(20)):
    warning("Finish button not found, trying to continue anyway.")

  # 2. Click Next
  info("Clicking Next.")
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(20)):
    warning("Next button not found after Finish.")

  # 3. Click Confirm twice
  for i in range(1, 3):
    info(f"Clicking Confirm ({i}/2).")
    if not wait_for_and_click("assets/buttons/confirm_btn.png", timeout_s=get_secs(15)):
      warning(f"Confirm button ({i}/2) not found.")

  # 4. Click Close
  info("Clicking Close.")
  if not wait_for_and_click("assets/buttons/close_btn.png", timeout_s=get_secs(15)):
    warning("Close button not found.")

  # 5. Click Next 7 times
  for i in range(1, 8):
    info(f"Clicking Next ({i}/7).")
    if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(15)):
      warning(f"Next button ({i}/7) not found.")

  # 6. Click to_home
  info("Clicking to home.")
  if not wait_for_and_click("assets/buttons/to_home.png", timeout_s=get_secs(10)):
    warning("to_home button not found.")

  # 7. Keep trying to reach home screen, dismissing popups along the way
  while time.time() < deadline:
    if is_on_home_screen():
      info("Home screen reached after career completion.")
      return True
    dismiss_popups(max_rounds=3)
    sleep(0.5)

  warning("Did not reach home screen within timeout, continuing anyway.")
  return True

def complete_career():
  """Spend skill points, then walk through the career completion sequence to home."""
  if not spend_all_skill_points():
    return False
  return complete_career_sequence()

def post_training():
  """Steps 15-18: wait out the training, collect the results, spend skill points,
  complete the career and return to the home screen for the next cycle."""
  sleep_through_training()
  state = wait_for_training_completion()
  if state is None:
    return False
  if state == "home":
    # No career running: the career was already fully collected and completed.
    info("Career already completed and collected, nothing to do.")
    return True
  if state == "post_career":
    # Results open via the Post-Career popup, which finishes the career itself.
    return handle_post_career_state()
  if state == "overview":
    info("Clicking OK on the overview screen.")
    if not wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(30)):
      warning("Could not click OK on the overview screen, trying to continue from the Complete Career screen.")
  # state == "complete", or "overview" with OK clicked
  return complete_career()


# ---------------------------------------------------------------------------
# Flow steps
# ---------------------------------------------------------------------------
def step_reach_home():
  """Wait until the home screen shows one of the three career button states,
  recovering screens a previous run (or a finished training) left open."""
  home_states = (flow_templates["post_career"], flow_templates["training_independently"], flow_templates["career_btn"])
  deadline = time.time() + get_secs(30)
  while time.time() < deadline:
    for template in home_states:
      if device_action.locate(template, min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
        info("Home screen detected.")
        return True
    # Recover screens a previous run (or a finished training) may have left open.
    handled = False
    if locate_grayscale(flow_templates["overview"], min_search_time=get_secs(1)):
      info("Training overview screen detected, collecting the results.")
      wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(15))
      handled = True
    if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=get_secs(1)):
      info("Complete Career screen detected, finishing the leftover career first.")
      if not complete_career():
        return False
      handled = True
    if handled:
      deadline = time.time() + get_secs(30)
      continue
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

def reach_start_button(timeout_s=30):
  """After loading the agenda list: confirm overwrite / continue popups (0, 1
  or 2 of them, overwrite preferred over close) and close the agenda screen,
  then hit Start the moment it is reachable. Event-driven on purpose: with an
  empty agenda no popup appears and the screen goes straight back to the
  Start button, so a fixed sequence of overwrite/close searches would waste
  ~10s looking for buttons that are already gone."""
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    if device_action.locate_and_click(flow_templates["start_btn"], min_search_time=get_secs(0.5), region_ltrb=game_window_ltrb()):
      info("Start button clicked.")
      return True
    if device_action.locate_and_click(flow_templates["overwrite"], min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info("Confirmed overwrite popup.")
      sleep(1)
      continue
    if device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info("Closed a screen with the close button.")
      sleep(1)
      continue
    sleep(0.5)
  error(f"Start button did not become reachable within {timeout_s} seconds.")
  return False

def run_career_cycle():
  """Returns "started" when a new training was launched, "restarted" when a
  leftover career/training was handled (no new training started), or "failed"."""
  # 0. Reach the home screen
  info("Step 0: Navigating to the home screen.")
  if not step_reach_home():
    return "failed"

  # 1. Home screen: dispatch on the career button state
  if locate_grayscale(flow_templates["post_career"], min_search_time=get_secs(2)):
    if not handle_post_career_state():
      return "failed"
    return "restarted"  # leftover career finished, loop back to step 0
  if locate_grayscale(flow_templates["training_independently"], min_search_time=get_secs(2)):
    if not handle_training_independently_state():
      return "failed"
    return "restarted"  # training finished, loop back to step 0
  # No training: start a new career.
  info("Step 1: No training found, starting a new career.")
  if not wait_for_and_click(flow_templates["career_btn"], timeout_s=get_secs(15)):
    return "failed"
  sleep(get_secs(1))

  # 2. Scenario selection -> next
  info("Step 2: Scenario selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return "failed"

  # 3. Trainee selection -> next
  info("Step 3: Trainee selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return "failed"

  # 4. Legacy selection -> next
  info("Step 4: Legacy selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return "failed"

  # 5. Support card selection -> friends card zone
  info("Step 5: Support card selection, opening the Friends card zone.")
  sleep(get_secs(1.5))
  if not wait_for_and_click(flow_templates["add_friends"], timeout_s=get_secs(30)):
    return "failed"

  # 6. Select card
  if launch_args.card:
    info(f"Step 6: Searching for support card \"{launch_args.card}\" via OCR.")
    if not select_card_by_ocr(launch_args.card):
      return "failed"
  else:
    info("Step 6: No --card given, selecting the first card with the last login banner.")
    if not select_first_last_login_card():
      return "failed"

  # 7. Support card selection -> start career
  info("Step 7: Clicking start career.")
  sleep(get_secs(1))
  if not wait_for_and_click(flow_templates["start_career_button"], timeout_s=get_secs(30)):
    return "failed"

  # 8. Final confirmation -> select independent training if not selected -> edit
  info("Step 8: Final confirmation screen.")
  sleep(get_secs(1.5))
  if device_action.locate(flow_templates["independent_training_active_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
    info("Independent training is already selected.")
  else:
    info("Independent training not selected, selecting it.")
    if not wait_for_and_click(flow_templates["independent_training_btn"], timeout_s=get_secs(15)):
      return "failed"
  if not wait_for_and_click(flow_templates["edit_btn"], timeout_s=get_secs(15)):
    return "failed"

  # 9. Agenda screen -> my agendas
  info("Step 9: Opening My Agendas.")
  if not wait_for_and_click(flow_templates["my_agendas"], timeout_s=get_secs(15)):
    return "failed"

  # 10. My agendas -> load list slot
  info(f"Step 10: Loading agenda list slot {launch_args.agenda}.")
  sleep(get_secs(0.5))
  if not select_load_list_slot(launch_args.agenda):
    return "failed"

  # 11. Confirm the loaded agenda (overwrite / continue popups, agenda screen
  #     close) and click Start as soon as it is reachable
  info("Step 11: Confirming the agenda and starting the training.")
  sleep(get_secs(0.5))
  if not reach_start_button():
    return "failed"

  # 12. Training started
  info("Step 12: Waiting for the training to start.")
  if wait_until_gone(flow_templates["start_btn"], timeout_s=get_secs(25)) or wait_until_gone(flow_templates["edit_btn"], timeout_s=get_secs(5)):
    info("Independent training started successfully.")
  else:
    warning("Confirmation screen still visible, assuming the training started anyway.")
  return "started"

def main():
  if not bot.use_adb:
    warning("This script is designed for portrait ADB (MumuPlayer). The Steam window path is not supported.")
  card_desc = launch_args.card if launch_args.card else "<no card set, will pick the last login card>"
  info(f"Independent training launcher starting. Card: {card_desc}, Agenda slot: {launch_args.agenda}.")
  if not focus_umamusume():
    error("Failed to focus Umamusume window")
    return
  cycle = 0
  try:
    while bot.is_bot_running:
      cycle += 1
      info(f"=== Training cycle {cycle} starting. ===")
      status = run_career_cycle()
      if status == "failed":
        error("Independent training flow failed, see logs above.")
        break
      if status == "started" and not post_training():
        error("Post-training flow failed, see logs above.")
        break
  except device_action.BotStopException:
    info("Bot stopped by hotkey.")
  bot.is_bot_running = False

if __name__ == "__main__":
  main()
