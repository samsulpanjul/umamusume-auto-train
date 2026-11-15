# Standalone launcher for independent training careers.
# Usage:
#   py independent_train.py
#   py independent_train.py --card "Card Name" --agenda 3
#
# Portrait orientation only, designed for ADB (MumuPlayer), mirrors auto_misc.py's setup.
# Runs indefinitely, one full career cycle after another. Screen numbers refer
# to the screenshots in devtools/independent_flow; the whole loop lives in
# run_career_cycle():
#   1   home screen -> career button state (1B shows the Independent Training
#       popup while a career is running/finished):
#         Post-Career ribbon (training completed) -> popup -> Career button ->
#         Complete Career screen -> finish the career,
#         Training Independently ribbon (training running) -> popup -> OCR
#         timer -> wait at the popup until it shows 0:00:00 (falls back to
#         polling inside the training view),
#         Career button (no training) -> start a new career
#   2   scenario selection -> next
#   3   trainee selection -> next
#   4   legacy selection -> next
#   5   support formation (empty) -> friends card zone
#   6   borrow card popup -> card picked via OCR search (--card name, scroll +
#       refresh until found) or the first card with the last login banner
#   7   support formation (filled) -> start career
#   8   final confirmation (initial) -> select independent training
#       (if not selected) -> edit
#   9   agenda screen -> my agendas
#   10  my agendas -> load list slot 1/2/3 (--agenda)
#   11  agenda (filled): confirm the load (0, 1 or 2 popups: overwrite.png
#       else close_btn.png), close the agenda screen
#   12  final confirmation (filled) -> hit Start the moment it is reachable
#   13  independent training: verify it actually began (the game can bounce
#       back to the Support Formation screen right after Start!), sleep
#       50 minutes while the in-game training runs
#   14  overview screen -> OK
#   15  complete career screen -> spend all skill points (16-18: skill screen
#       rounds, repeating while unspent points are detected):
#       read SP counter (OCR), scan the whole list recording cost + gold flag,
#       scroll back to top, then a cost-aware greedy second pass that maximizes
#       the number of skills bought (a gold skill's listed price includes the
#       skill under it, which buying the gold auto-buys; if the base was picked
#       as a cheaper single the plan upgrades it to the gold for the difference),
#       the top of the list is reserved (pre-bought row 1 + 2 rows never bought)
#   18  complete career (all points spent) -> Complete Career button
#   19  complete career confirmation -> Finish
#   20  career rank -> Next
#   21  sparks, umamusume details, rating, rewards and the event reward
#       screens: Confirm x2, Close, then an adaptive Next loop that checks
#       to_home each iteration and clicks it on the career complete screen
#       (28) -> loop back to screen 1

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
from core.ocr import get_reader, extract_text, extract_number, extract_allowed_text
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
  "independent_training_banner": "assets/ui/independent_training_banner.png",
  "complete_career_btn": "assets/buttons/complete_career_btn.png",
  "career_independent_btn": "assets/buttons/career_independent_btn.png",
  "independent_training_popup": "assets/ui/independent_training.png",
  "home_tab": "assets/buttons/main_menu_home.png",
  
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

MAX_CARD_CYCLES = 15          # refresh cycles before giving up on a card
CARD_NAME_MATCH_THRESHOLD = 0.75  # rapidfuzz ratio required to accept an OCR name match

# Skill screen ("Learn") constants, measured on a 800x1080 portrait screenshot.
SKILL_SP_OFFSETS = (535, 332, -155, -698)  # SP counter, offsets relative to GAME_WINDOW_BBOX
BUY_ICON_THRESHOLD = 0.70      # buy_skill.png "+" buttons score ~0.74, not 0.9
GOLD_SAT_THRESHOLD = 40        # HSV saturation: gold card pixels ~77+, white ~15
GOLD_PIXEL_FRACTION = 0.5      # saturated-pixel share: gold rows 0.73-0.97, white 0.04-0.20
NAME_MATCH_THRESHOLD = 0.85    # Levenshtein ratio for skill name dedupe / target matching
SKILL_LIST_RESERVED_ROWS = 2   # costed rows at the top of the list, never bought (row 1 is pre-bought)

# Scrolling the skill list: rows sit ~157px apart, and a plain ADB swipe always
# flings (Unity keeps scrolling with momentum), so no_fling_swipe() holds the
# finger still before lifting. The step must keep every row's FIRST sighting
# mid-frame: with bigger steps rows appear only clipped at the frame edges,
# where the name OCR reads garbage and the gold strip falls outside the frame.
SKILL_SCROLL_STEP_PX = 420     # finger travel (safe, rows ~157px apart)
SKILL_SCROLL_DURATION_S = 0.5  # slow-swipe fallback only
NO_FLING_INTERP_POINTS = 10    # MOVE events interpolating the fast travel
NO_FLING_HOLD_EVENTS = 40      # stationary MOVE events before the lift
NO_FLING_SUPPORTED = True      # flips off after the first "input motionevent" failure

def skill_sp_region():
  return constants.add_tuple_elements(game_window_ltrb(), SKILL_SP_OFFSETS)

def skill_scroll_step_end():
  # End point of one predictable scroll step, starting from SKILL_SCROLL_BOTTOM_MOUSE_POS.
  x, y = constants.SKILL_SCROLL_BOTTOM_MOUSE_POS
  return (x, y - SKILL_SCROLL_STEP_PX)

def no_fling_swipe(start_xy, end_xy):
  # Scroll gesture: press, travel fast, hold still, then lift. The hold kills fling momentum, so the list moves exactly the dragged distance. Falls back to a slow plain swipe when the device doesn't support 'input motionevent'.
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
  # Compare two skill-screen frames, excluding the right edge: the scrollbar fades in and out after every scroll and would keep comparisons failing.
  return are_screenshots_same(screenshot1[:, 100:650], screenshot2[:, 100:650], diff_threshold=5)

def settle_skill_scroll(max_wait_s=3.5):
  # Wait until the skill list stops moving (also covers the screen's entrance animation, so scanning never happens on a moving frame), then return the settled screenshot.
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
  # Dismiss unexpected popups (ok / confirm / close / cancel). Returns True if any were clicked.
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
    device_action.flush_screenshot_cache()
    if device_action.locate_and_click(img_path, min_search_time=get_secs(0.5), region_ltrb=region_ltrb or game_window_ltrb()):
      sleep(settle)
      return True
    sleep(0.5)
  error(f"Could not find \"{img_path}\" within {timeout_s} seconds.")
  return False

def click_back_btn():
  # Click the bottom-screen back button (exits the skill screen).
  return device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(3), region_ltrb=constants.SCREEN_BOTTOM_BBOX)

def locate_grayscale(img_path, threshold=0.85, min_search_time=0.0, region_ltrb=None):
  # Grayscale matching for UI on animated backgrounds, where the button tint shifts and color matching only scores ~0.7 (e.g. the Complete Career screen).
  region = region_ltrb or game_window_ltrb()
  start_time = time.time()
  while True:
    device_action.flush_screenshot_cache()
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

# The game wraps card names in brackets, but the OCR allowlist has no bracket
# glyphs, so they get misread as these lookalike characters glued to the
# name's ends ("[Planned Perfection]" reads as "IPlanned Perfectionl").
BRACKET_ARTIFACTS = "[]|!Il1"

def strip_bracket_artifacts(text):
  # Strip the brackets' misread lookalikes from an OCR'd card name's ends (boundary-only: the same characters inside the name are legitimate).
  return text.strip().strip(BRACKET_ARTIFACTS)

def ocr_find_card(screenshot_img, card_name):
  # OCR the card list, return (x, y, matched_text, score) of the best name match or None. Coordinates are relative to the passed screenshot.
  reader = get_reader()
  results = reader.readtext(
    screenshot_img,
    allowlist="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'&.! ",
  )
  target = normalize_name(card_name)
  best = None
  best_score = 0.0
  for quad, text, confidence in results:
    normalized = normalize_name(text)
    # Score both the raw read and the bracket-stripped one: stripping helps
    # short names most, while the raw read protects legit artifact initials
    # (e.g. "Ivy" -> "lIvy").
    stripped = normalize_name(strip_bracket_artifacts(text))
    score = max(fuzz.ratio(target, normalized), fuzz.ratio(target, stripped)) / 100.0
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
  # Swipe the card list up one page. Returns True if the visible content changed.
  device_action.flush_screenshot_cache()
  before = device_action.screenshot()
  x, y = game_window_ltrb()[0], game_window_ltrb()[1]
  device_action.swipe((x + 400, y + 880), (x + 400, y + 480), duration=0.4)
  sleep(0.6)
  device_action.flush_screenshot_cache()
  after = device_action.screenshot()
  return card_list_page_changed(before, after)

def refresh_card_list():
  info("Reached the end of the card list, hitting the refresh button and starting over.")
  if not device_action.locate_and_click(flow_templates["refresh_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
    warning("Refresh button not found, continuing anyway.")
  sleep(1)

def scan_card_list(find_and_click, label, max_cycles=MAX_CARD_CYCLES):
  # Scroll/scan the card list, calling find_and_click(screenshot) each cycle until it returns True (a card was clicked).
  for cycle in range(1, max_cycles + 1):
    device_action.flush_screenshot_cache()
    if find_and_click(device_action.screenshot()):
      return True
    info(f"{label} not visible (cycle {cycle}/{max_cycles}). Scanning further.")
    if not scroll_card_list():
      refresh_card_list()
  error(f"Could not find {label} after {max_cycles} scroll/refresh cycles.")
  return False

def select_card_by_ocr(card_name, max_cycles=MAX_CARD_CYCLES):
  # Click the card matching card_name via OCR search.
  def find_and_click(screenshot):
    hit = ocr_find_card(screenshot, card_name)
    if not hit:
      return False
    (x, y), text, score = hit
    info(f"Found card \"{text}\" (match score {score:.2f}). Clicking it.")
    device_action.click(target=(constants.GAME_WINDOW_REGION[0] + x, y))
    sleep(0.5)
    return True
  return scan_card_list(find_and_click, f"card \"{card_name}\"", max_cycles)

def select_first_last_login_card(max_cycles=MAX_CARD_CYCLES):
  # Click the first card showing the last login banner.
  def find_and_click(screenshot):
    if not device_action.locate_and_click(flow_templates["last_login"], min_search_time=get_secs(0.5), region_ltrb=game_window_ltrb()):
      return False
    info("Selected the first card with the last login banner.")
    sleep(0.5)
    return True
  return scan_card_list(find_and_click, "a card with the last login banner", max_cycles)

# ---------------------------------------------------------------------------
# Skill screen helpers (cost-aware skill buying)
# ---------------------------------------------------------------------------
def read_skill_points():
  # OCR the Skill Points counter on the Learn screen. Returns -1 on failure.
  img = device_action.screenshot(region_ltrb=skill_sp_region())
  value = extract_number(Image.fromarray(img))
  debug(f"Skill points OCR read: {value}")
  return value

def ocr_row_name(world_icon):
  # OCR the skill name of a row, given the row's buy button in world coords.
  x, y, _, _ = world_icon
  return extract_text(enhanced_screenshot((x - 505, y - 48, 390, 26)))

def ocr_row_cost(world_icon):
  # OCR the skill cost of a row, given the row's buy button in world coords.
  x, y, _, _ = world_icon
  return extract_number(enhanced_screenshot((x - 75, y - 5, 70, 40)))

def is_gold_row(region_screenshot, icon):
  # Gold skills use a saturated card, normal ones near-grayscale. Samples the card area left of the buy button, clipped to the frame so partially visible rows still classify. True/False, or None when too little area is visible.
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
  # Fuzzy-match an OCR'd skill name against candidate names. Returns (best, score).
  best, best_score = None, 0.0
  for candidate in candidates:
    score = Levenshtein.ratio(normalize_name(text), normalize_name(candidate))
    if score > best_score:
      best_score, best = score, candidate
  if best_score >= threshold:
    return best, best_score
  return None, best_score

def match_skill_icons(screenshot_region):
  # Match buy buttons on a SCROLLING_SKILL_SCREEN_BBOX screenshot, sorted top to bottom.
  icons = device_action.match_template("assets/icons/buy_skill.png", screenshot_region, threshold=BUY_ICON_THRESHOLD)
  icons.sort(key=lambda box: box[1])
  return icons

def scan_skill_list(max_pages=40):
  # First pass: scroll the whole skill list, recording name, cost and gold flag per row. Returns (entries, pages).
  entries = []
  pages = 0
  x1, y1, _, _ = constants.SCROLLING_SKILL_SCREEN_BBOX
  screenshot1 = settle_skill_scroll()
  while pages < max_pages:
    region_height = screenshot1.shape[0]
    for icon in match_skill_icons(screenshot1):
      # Clipped rows must not be recorded: their name OCRs garbage and
      # re-sightings could overwrite a good cost with a misread one. Every
      # row gets a mid-frame sighting on another page (see SKILL_SCROLL_STEP_PX).
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
    info(f"Ignoring legacy skills \"{entry['name']}\".")
  entries = entries[SKILL_LIST_RESERVED_ROWS:]
  return entries, pages

def reopen_skill_screen(pages=0):
  # Back out and reopen the skill screen (much faster than scrolling back up); falls back to scrolling to the top. True when the skill screen is open.
  click_back_btn()
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
  # Greedy plan maximizing the number of skills bought (final; executed as-is by the second pass). A gold skill auto-buys the row under it and its price already includes that row: the bundle covers both. A base picked earlier as a cheaper single is upgraded to the bundle for the difference (the game charges gold - base), instead of double-buying.
  items = []
  for index, entry in enumerate(entries):
    items.append({"names": [entry["name"]], "cost": entry["cost"],
                  "gold": entry["gold"], "successor": None})
    if entry["gold"] and index + 1 < len(entries):
      successor = entries[index + 1]
      if successor["cost"] >= entry["cost"]:
        # The row under a gold is always its cheaper base skill; anything
        # else is an OCR glitch, keep the gold a full-price single.
        continue
      items.append({"names": [entry["name"], successor["name"]], "cost": entry["cost"],
                    "gold": True, "successor": successor["name"]})
  # Cheapest first maximizes the purchase count; bundles beat equally-priced
  # singles so a gold is preferred over buying gold + base separately.
  items.sort(key=lambda item: (item["cost"], 0 if item["successor"] else 1))
  remaining = skill_points
  picks = []
  bought = set()
  for item in items:
    if item["names"][0] in bought:
      # Already acquired (e.g. a gold bundle's successor picked earlier).
      continue
    if item["successor"] and item["successor"] in bought:
      # Upgrade the earlier cheap single to the bundle (pay the difference).
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

def execute_purchases(picks, pages, buy_everything=False, first_only=False):
  # Second pass: scroll the list and click the planned skills' buy buttons. With buy_everything=True (SP OCR failed or later rounds), every active buy button is clicked; with first_only=True, stop after the first purchase. Returns how many buttons were clicked.
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
      if first_only:
        return bought_count
    no_fling_swipe(constants.SKILL_SCROLL_BOTTOM_MOUSE_POS, skill_scroll_step_end())
    screenshot2 = settle_skill_scroll()
    if skill_frames_equal(screenshot1, screenshot2):
      break
    screenshot1 = screenshot2
  return bought_count

def confirm_skill_purchases():
  # Apply the picked skills and leave the skill screen (same exit as core.skill.buy_skill).
  device_action.locate_and_click("assets/buttons/confirm_btn.png", min_search_time=get_secs(3))
  sleep(0.5)
  device_action.locate_and_click("assets/buttons/learn_btn.png", min_search_time=get_secs(3))
  sleep(0.5)
  device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(4))
  click_back_btn()

def buy_skills_cost_aware(max_pages=40):
  # Read SP, scan the list, plan a cost-aware greedy purchase, execute it, confirm. Falls back to clicking every affordable skill when the SP counter can't be read.
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
    click_back_btn()
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
    click_back_btn()

# ---------------------------------------------------------------------------
# Post-training steps
# ---------------------------------------------------------------------------
def sleep_through_training(minutes=50):
  # Sleep through the 50-minute training with a progress display. Raw time.sleep on purpose: SLEEP_TIME_MULTIPLIER must not scale a real wait.
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

# ---------------------------------------------------------------------------
# Independent Training popup (OCR timer wait)
# ---------------------------------------------------------------------------
# The popup is located via its green header banner; the "Time Left" text sits
# at a fixed offset from it (offsets measured on the popup screenshot: reads
# "0:37:57 left", region x 480-645, y 578-622 for a banner at (238, 322)).
POPUP_TIMER_OFFSETS = (78, 231, 243, 275)  # timer region relative to the banner center

def read_popup_time_left():
  # OCR the "0:37:57 left" text on the Independent Training popup. Returns
  # seconds left, or None when the popup or its timer isn't found/readable.
  banner = locate_grayscale(flow_templates["independent_training_popup"], min_search_time=get_secs(2))
  if not banner:
    debug("Independent Training popup not found.")
    return None
  cx, cy = banner
  x1, y1, x2, y2 = POPUP_TIMER_OFFSETS
  device_action.flush_screenshot_cache()
  img = device_action.screenshot(region_ltrb=(cx + x1, cy + y1, cx + x2, cy + y2))
  text = extract_allowed_text(Image.fromarray(img), allowlist="0123456789:")
  match = re.search(r"(\d+):(\d+):(\d+)", text)
  if not match:
    debug(f"Popup timer OCR read: {text!r}")
    return None
  h, m, s = (int(part) for part in match.groups())
  return h * 3600 + m * 60 + s

def wait_independent_training_popup(max_wait_s=55 * 60):
  # Wait at the Independent Training popup until the training ends: OCR the
  # time left once, sleep the countdown in real time, then confirm "0:00:00"
  # with a second read. A mismatched confirm loops into a fresh read (bounded
  # by max_wait_s). True when the timer confirmed zero.
  deadline = time.time() + max_wait_s
  while time.time() < deadline:
    if not bot.is_bot_running:
      return False
    seconds_left = read_popup_time_left()
    if seconds_left is None:
      warning("Could not read the time left on the Independent Training popup.")
      return False
    if seconds_left <= 0:
      info("Independent Training popup shows 0:00:00 left, training finished.")
      return True
    info(f"Independent Training popup shows {seconds_left // 60}m {seconds_left % 60:02d}s left, waiting at the popup.")
    # Real-time countdown in chunks so the stop hotkey stays responsive; the
    # +5s buffer covers the OCR reads' own duration. Raw time.sleep on
    # purpose: SLEEP_TIME_MULTIPLIER must not scale a real-time wait.
    target = seconds_left + 5
    slept = 0
    while slept < target and bot.is_bot_running:
      chunk = min(15, target - slept)
      time.sleep(chunk)
      slept += chunk
    confirm = read_popup_time_left()
    if confirm is None:
      warning("Could not re-read the popup timer to confirm the countdown.")
      return False
    if confirm > 0:
      warning(f"Popup timer still shows {confirm}s left after the countdown, re-reading.")
  warning("Popup countdown did not reach zero in time.")
  return False

def wait_for_training_completion(timeout_s=900):
  # After the training finishes the game may land on the overview, the Complete Career screen directly or the home screen; transitions can take minutes, so poll until a known state is confirmed. Returns "overview", "complete", "post_career", "home" (career already fully collected) or None.
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
    if not bot.is_bot_running:
      return None
    if locate_grayscale(flow_templates["overview"], min_search_time=0):
      info("Training overview screen detected.")
      return "overview"
    if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=0):
      info("Complete Career screen detected (training done, skipped overview).")
      return "complete"
    if locate_grayscale(flow_templates["start_btn"], min_search_time=0) or \
       locate_grayscale(flow_templates["start_career_button"], min_search_time=0):
      warning("Career setup screen detected while waiting for the training to finish (bounced session).")
      return "bounced"
    if locate_grayscale(flow_templates["independent_training_banner"], min_search_time=0):
      debug("Independent Training view still on screen, training not finished yet.")
    state = detect_career_state(min_search=0)
    if state == "post_career":
      info("Home screen with the Post-Career ribbon detected (training done).")
      return "post_career"
    if state == "career_btn":
      info("Home screen detected with no career running.")
      return "home"
    if state == "training_independently":
      debug("Training Independently ribbon still visible, training not finished yet.")
    sleep(1)
  error(f"No known training-completion state appeared within {timeout_s} seconds.")
  return None

def handle_in_progress_training():
  # A training is already running (Training Independently popup): poll every 30s for up to 50 minutes, then proceed with the post-training flow.
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
    device_action.flush_screenshot_cache()
    if locate_grayscale(flow_templates["independent_training_banner"], min_search_time=0):
      debug("Independent Training view still on screen, training not finished yet.")
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
  # Press the popup's green Career button until it leaves the screen: a tap during the popup's entrance animation can be swallowed, so keep pressing. False when the button never appeared or never left.
  deadline = time.time() + timeout_s
  clicks = 0
  while time.time() < deadline:
    if locate_grayscale_and_click(flow_templates["career_independent_btn"], min_search_time=get_secs(1)):
      clicks += 1
      debug(f"Pressed the popup Career button (attempt {clicks}).")
      sleep(get_secs(1.5))
      continue
    if clicks:
      debug(f"Popup Career button gone after {clicks} press(es).")
      return True
    sleep(get_secs(1))
  if clicks:
    warning(f"Pressed the popup Career button {clicks} time(s) but it never left the popup.")
  else:
    warning("Career button not found in the Independent Training popup.")
  return False

def open_post_career_popup(timeout_s=20):
  # Click the Post-Career ribbon, then the popup's Career button. True when the popup button was clicked (navigation is verified by the caller).
  if not locate_grayscale_and_click(flow_templates["post_career"], min_search_time=get_secs(2)):
    warning("Could not click the Post-Career button.")
    return False
  return click_popup_career_button(timeout_s)

def ensure_complete_career_screen(timeout_s=120):
  # Wait for the Complete Career screen: click OK on the overview shown first, and retry the Post-Career popup navigation when the game bounces back to the home screen. False when the screen never appears — callers must not trust a "no unspent points" check made on a foreign screen.
  deadline = time.time() + timeout_s
  retries = 0
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
    if locate_grayscale(flow_templates["overview"], min_search_time=0):
      info("Training overview screen detected, clicking OK.")
      wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(15))
    if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=0):
      # Confirm after a settle pause: right after navigation the screen can
      # still be covered by a transition overlay.
      sleep(get_secs(2))
      if locate_grayscale(flow_templates["complete_career_btn"], min_search_time=0):
        return True
    if detect_career_state(min_search=0) == "post_career":
      if retries >= 3:
        warning("Still bouncing back to the home screen after 3 popup navigation attempts.")
        return False
      retries += 1
      warning(f"Home screen detected while waiting for the Complete Career screen, "
              f"retrying the Post-Career popup navigation (attempt {retries}/3).")
      if not open_post_career_popup():
        return False
    sleep(1)
  warning("Complete Career screen did not appear in time.")
  return False

def handle_post_career_state():
  # Post-Career ribbon: the training finished. Open its popup, collect the overview and finish the career from the Complete Career screen.
  info("Career state: Post-Career (training completed). Opening its popup.")
  if not open_post_career_popup():
    return False
  if not ensure_complete_career_screen():
    error("Complete Career screen did not appear after the popup's Career button.")
    return False
  info("Complete Career screen reached, finishing the leftover career.")
  if not complete_career(screen_verified=True):
    return False
  info("Finished the leftover career, restarting the cycle.")
  return True

def handle_training_independently_state():
  # Training Independently ribbon: a training is running. Open its popup and
  # wait there for the OCR timer to hit zero (saves sitting on the resource-
  # heavy training view). Falls back to polling inside the training view when
  # the popup timer can't be read.
  info("Career state: Training Independently (training in progress).")
  if not locate_grayscale_and_click(flow_templates["training_independently"], min_search_time=get_secs(2)):
    warning("Could not click the Training Independently button.")
    return False
  if wait_independent_training_popup():
    # Training done: the popup's Career button now leads to the overview /
    # Complete Career screen (same path as the Post-Career popup).
    if not click_popup_career_button():
      return False
    if not ensure_complete_career_screen():
      error("Complete Career screen did not appear after the popup's Career button.")
      return False
    info("Complete Career screen reached, finishing the leftover career.")
    return complete_career(screen_verified=True)
  # Fallback: enter the training view and poll as before.
  click_popup_career_button()  # best effort: enter the training view
  info("Waiting for the training to finish.")
  if not handle_in_progress_training():
    return False
  info("Training finished, restarting the cycle.")
  return True

def unspent_skill_points_visible(attempts=3):
  # Check for the unspent-points exclamation mark, retrying a few times: the icon can appear with a short animation.
  for attempt in range(1, attempts + 1):
    if locate_grayscale("assets/ui/skill_exclamation.png", min_search_time=get_secs(2)):
      return True
    if attempt < attempts:
      sleep(get_secs(1.5))
  return False

def spend_all_skill_points(max_rounds=5, screen_verified=False):
  # On the Complete Career screen: while skill_exclamation.png shows unspent points, open the skill screen and buy, then continue (round 1: full cost-aware scan and plan, later rounds: first affordable skill).
  # Only trust a "no unspent points" result made on the confirmed Complete
  # Career screen: elsewhere the exclamation mark is naturally absent and the
  # points would be lost. screen_verified=True skips the wait when the caller
  # just confirmed the screen itself.
  if not screen_verified and not ensure_complete_career_screen():
    error("Not on the Complete Career screen, refusing to skip the skill-point spending.")
    return False
  for round_num in range(1, max_rounds + 1):
    if not unspent_skill_points_visible():
      debug("No unspent skill points detected.")
      return True
    info(f"Unspent skill points detected, opening the skill screen.")
    if not locate_grayscale_and_click("assets/buttons/complete_career_skills_btn.png", min_search_time=get_secs(5)):
      warning("Could not find the Skills button on the Complete Career screen.")
      return False
    if round_num == 1:
      buy_skills_cost_aware()
    else:
      if execute_purchases(None, 40, buy_everything=True, first_only=True):
        sleep(get_secs(0.5))
        confirm_skill_purchases()
      else:
        info("No affordable skills found on the skill screen.")
        click_back_btn()
    sleep(get_secs(1))
  warning("Skill points still unspent after 5 buying rounds, continuing anyway.")
  return True

def detect_career_state(min_search=0.5):
  # Which home career-button state is visible ("post_career", "training_independently", "career_btn"), or None. min_search=0 does a single quick attempt per template (for polling loops).
  for name, template in (("post_career", flow_templates["post_career"]),
                         ("training_independently", flow_templates["training_independently"]),
                         ("career_btn", flow_templates["career_btn"])):
    if device_action.locate(template, min_search_time=get_secs(min_search), region_ltrb=game_window_ltrb()) is not None:
      return name
  return None

def complete_career_sequence():
  # Finish -> Next -> Confirm x2 -> Close -> adaptive Next/to_home loop (the number of Next screens varies) until the home screen is reached.
  deadline = time.time() + get_secs(120)

  
  # 0. Complete Career button
  info("Pressing Complete Career.")
  if not wait_for_and_click("assets/buttons/complete_career_btn.png", timeout_s=get_secs(20)):
    warning("Finish button not found, trying to continue anyway.")
    
  # 1. Finish
  info("Pressing Finish.")
  if not wait_for_and_click("assets/buttons/Finish.png", timeout_s=get_secs(20)):
    warning("Finish button not found, trying to continue anyway.")

  # 2. Click Next
  info("Pressing Next.")
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(20)):
    warning("Next button not found after Finish.")

  # 3. Click Confirm twice
  for i in range(1, 3):
    info(f"Pressing Confirm ({i}/2).")
    if not wait_for_and_click("assets/buttons/confirm_btn.png", timeout_s=get_secs(15)):
      warning(f"Confirm button ({i}/2) not found.")

  # 4. Click Close
  info("Pressing Close.")
  if not wait_for_and_click("assets/buttons/close_btn.png", timeout_s=get_secs(15)):
    warning("Close button not found.")

  # 5. Adaptive Next/to_home loop: click Next while it's visible, but also
  #    check for to_home on every iteration so we don't waste time when the
  #    Next screens have ended. Up to 15 Next clicks to avoid infinite loops.
  next_count = 0
  home_clicked = False
  while next_count < 15 and time.time() < deadline:
    device_action.flush_screenshot_cache()
    # Check for to_home first — it may appear on the same frame as the last Next
    if device_action.locate_and_click("assets/buttons/to_home.png", min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info("Home button found, returning home.")
      home_clicked = True
      break
    if device_action.locate_and_click("assets/buttons/next_btn.png", min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      next_count += 1
      info(f"Pressing Next ({next_count}).")
      sleep(get_secs(1))
      continue
    sleep(0.5)
  if not home_clicked:
    if next_count >= 15:
      warning("Reached max Next clicks, falling back to to_home.")
    else:
      info("No more Next buttons visible, looking for to_home.")
    if not wait_for_and_click("assets/buttons/to_home.png", timeout_s=get_secs(10)):
      warning("to_home button not found.")

  # 6. Keep trying to reach home screen, dismissing popups along the way
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
    if detect_career_state() is not None:
      info("Home screen reached after career completion.")
      return True
    dismiss_popups(max_rounds=3)
    sleep(0.5)

  warning("Did not reach home screen within timeout, continuing anyway.")
  return True

def complete_career(screen_verified=False):
  # Spend skill points, then walk the completion sequence to the home screen. screen_verified=True skips the Complete Career screen wait.
  if not spend_all_skill_points(screen_verified=screen_verified):
    return False
  return complete_career_sequence()

# ---------------------------------------------------------------------------
# Flow steps
# ---------------------------------------------------------------------------
def step_reach_home():
  # Wait until the home screen shows one of the three career button states, actively navigating back when needed.
  home_states = (flow_templates["post_career"], flow_templates["training_independently"], flow_templates["career_btn"])
  deadline = time.time() + get_secs(60)
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
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
    # Actively try to navigate back to home: the main menu's Home tab jumps
    # straight to the home screen from any random game screen, so try it
    # before the slower to_home / back button walk.
    if device_action.locate_and_click(flow_templates["home_tab"], min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info("Clicked the main menu Home tab.")
      sleep(get_secs(3))
      continue
    if device_action.locate_and_click("assets/buttons/to_home.png", min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info("Clicked 'to home' button.")
      sleep(get_secs(3))
      continue
    if device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(1), region_ltrb=game_window_ltrb()):
      info("Clicked 'back' button.")
      sleep(get_secs(2))
      continue
    dismiss_popups()
    sleep(0.5)
  error("Could not reach the home screen within 60 seconds.")
  return False

def select_load_list_slot(slot):
  # Click the Nth (1-based) "Load List" button on the My Agendas screen.
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
  # Confirm the 0-2 load popups (overwrite preferred over close), close the agenda screen, then hit Start the moment it is reachable. Event-driven on purpose: with an empty agenda no popup appears, so a fixed sequence would waste ~10s searching for buttons already gone.
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
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

def confirm_training_started(timeout_s=30):
  # Verify the training actually began after Start!: the game can bounce back to the Support Formation screen (a "button gone" check would be fooled), and also flashes those screens in passing while the training view loads, so a bounce only counts after two sightings ~2s apart. Returns "started", "bounced" or "failed" (Start! never left the screen).
  deadline = time.time() + timeout_s
  bounce_sighted = False
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
    if not bot.is_bot_running:
      return "failed"
    if locate_grayscale(flow_templates["start_btn"], min_search_time=0):
      debug("Final Confirmation screen still visible, waiting for it to leave.")
      bounce_sighted = False
      sleep(1)
      continue
    if locate_grayscale(flow_templates["start_career_button"], min_search_time=0):
      if not bounce_sighted:
        debug("Support Formation screen sighted after Start!, re-checking before calling it a bounce.")
        bounce_sighted = True
        sleep(get_secs(2))
        continue
      warning("Game bounced back to the Support Formation screen after Start!.")
      return "bounced"
    # Neither career setup screen is visible: the training view took over.
    return "started"
  warning("The Start! button never left the confirmation screen.")
  return "failed"

def recover_after_start_bounce(timeout_s=60):
  # Walk back home after a bounce and report the career state: returns "training_independently" when the training is running anyway (home ribbon or the Independent Training view on screen), the home state otherwise, or None when home is not reached in time.
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    device_action.flush_screenshot_cache()
    if not bot.is_bot_running:
      return None
    # The Independent Training view has neither a back button nor a home
    # career button: once it is up, the training is running and there is
    # nowhere left to walk.
    if locate_grayscale(flow_templates["independent_training_banner"], min_search_time=0):
      info("Independent Training view is on screen, the training is running.")
      return "training_independently"
    state = detect_career_state(min_search=0)
    if state:
      return state
    if device_action.locate_and_click("assets/buttons/back_btn.png", min_search_time=get_secs(0.5), region_ltrb=game_window_ltrb()):
      info("Clicked Back to leave the bounced screen.")
      sleep(get_secs(1.5))
      continue
    sleep(1)
  warning("Home screen not reached within the bounce recovery timeout.")
  return None

def run_career_cycle():
  # One full career loop: home -> career setup (screens 2-12) -> training (~50 min) -> overview -> skill points -> completion -> home again. Returns "completed" (ran start to finish), "restarted" (leftover handled or launch failed, loop back to the home screen) or "failed".
  # Screen 1. Home screen: dispatch on the career button state. The popup in
  #     1B (Independent Training) is handled inside the two career-state
  #     handlers below.
  info("Navigating to the home screen.")
  if not step_reach_home():
    return "failed"
  if locate_grayscale(flow_templates["post_career"], min_search_time=get_secs(2)):
    if not handle_post_career_state():
      return "failed"
    return "restarted"  # leftover career finished, loop back to screen 1
  if locate_grayscale(flow_templates["training_independently"], min_search_time=get_secs(2)):
    if not handle_training_independently_state():
      return "failed"
    return "restarted"  # training finished, loop back to screen 1
  # No training: start a new career.
  info("No training found, starting a new career.")
  if not wait_for_and_click(flow_templates["career_btn"], timeout_s=get_secs(15)):
    return "failed"
  sleep(get_secs(1))

  # Screen 2. Scenario selection -> next
  info("Scenario selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return "failed"

  # Screen 3. Trainee selection -> next
  info("Trainee selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return "failed"

  # Screen 4. Legacy selection -> next
  info("Legacy selection, clicking next.")
  sleep(get_secs(1.5))
  if not wait_for_and_click("assets/buttons/next_btn.png", timeout_s=get_secs(30)):
    return "failed"

  # Screen 5. Support Formation (empty) -> friends card zone
  info("Support card selection, opening the Friends card zone.")
  sleep(get_secs(1.5))
  if not wait_for_and_click(flow_templates["add_friends"], timeout_s=get_secs(30)):
    return "failed"

  # Screen 6. Borrow Card popup: the card is picked via OCR search (--card)
  #     or the last login banner, which also dismisses the popup.
  if launch_args.card:
    info(f"Searching for support card \"{launch_args.card}\" via OCR.")
    if not select_card_by_ocr(launch_args.card):
      return "failed"
  else:
    info("No --card given, selecting the first card with the last login banner.")
    if not select_first_last_login_card():
      return "failed"

  # Screen 7. Support Formation (filled) -> start career
  info("Clicking start career.")
  sleep(get_secs(1))
  if not wait_for_and_click(flow_templates["start_career_button"], timeout_s=get_secs(30)):
    return "failed"

  # Screen 8. Final Confirmation (initial) -> select independent training
  #     (if not selected) -> edit
  info("Final confirmation screen.")
  sleep(get_secs(1.5))
  if device_action.locate(flow_templates["independent_training_active_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
    info("Independent training is already selected.")
  else:
    info("Independent training not selected, selecting it.")
    if not wait_for_and_click(flow_templates["independent_training_btn"], timeout_s=get_secs(15)):
      return "failed"
  if not wait_for_and_click(flow_templates["edit_btn"], timeout_s=get_secs(15)):
    return "failed"

  # Screen 9. Agenda -> my agendas
  info("Opening My Agendas.")
  if not wait_for_and_click(flow_templates["my_agendas"], timeout_s=get_secs(15)):
    return "failed"

  # Screen 10. My Agendas -> load list slot
  info(f"Loading agenda list slot {launch_args.agenda}.")
  sleep(get_secs(0.5))
  if not select_load_list_slot(launch_args.agenda):
    return "failed"

  # Screens 11-12. Agenda (filled): confirm the loaded agenda (overwrite /
  #     continue popups, agenda screen close) and hit Start! on the filled
  #     Final Confirmation screen the moment it is reachable.
  info("Confirming the agenda and starting the training.")
  sleep(get_secs(0.5))
  if not reach_start_button():
    return "failed"

  # Screen 13. Independent Training: verify it actually began — the game can
  #     bounce back to the Support Formation screen right after the Start!
  #     click.
  info("Waiting for the training to start.")
  status = confirm_training_started()
  if status == "failed":
    return "failed"
  if status == "bounced":
    state = recover_after_start_bounce()
    if state == "training_independently":
      info("The training did start despite the bounce, continuing.")
    elif state in ("career_btn", "post_career"):
      warning(f"The training did not start (home shows the {state} state), restarting the cycle.")
      return "restarted"
    else:
      return "failed"

  # Screen 13 (cont.). The training runs in real time: sleep through it, then
  #     poll for a known completion state (the game may land on the overview,
  #     the Complete Career screen or the home screen).
  sleep_through_training()
  state = wait_for_training_completion()
  if state is None:
    return "failed"
  if state == "bounced":
    # The session bounced back to the career setup screens. Walk home; the
    # next cycle dispatches on whatever state it finds there (training still
    # running, results ready, or nothing running).
    career = recover_after_start_bounce()
    if career:
      info(f"Bounced session recovered (home shows the {career} state), restarting the cycle.")
      return "restarted"
    error("Could not recover from the bounced session.")
    return "failed"
  if state == "home":
    # No career running: the career was already fully collected and completed.
    info("Career already completed and collected, nothing to do.")
    return "restarted"
  if state == "post_career":
    # Results open via the Post-Career popup, which finishes the career itself.
    if not handle_post_career_state():
      return "failed"
    return "restarted"

  # Screen 14. Overview -> OK (state == "overview"); state == "complete"
  #     means the game went straight to the Complete Career screen.
  if state == "overview":
    info("Clicking OK on the overview screen.")
    if not wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(30)):
      warning("Could not click OK on the overview screen, trying to continue from the Complete Career screen.")

  # Screens 15-18. Complete Career: spend all skill points (first round does
  #     a cost-aware full scan of the skill list, later rounds buy the first
  #     affordable skill; repeats while unspent points are detected).
  info("Spending all skill points.")
  if not spend_all_skill_points():
    return "failed"

  # Screens 19-28. Career completion sequence: Finish -> Next -> Confirm x2 ->
  #     Close -> adaptive Next loop (sparks, details, rating, rewards and the
  #     event reward screens, checking to_home each iteration) -> to_home on
  #     the career complete screen -> home screen.
  info("Walking through the career completion sequence.")
  complete_career_sequence()
  info("Career cycle complete, back at the home screen.")
  return "completed"

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
      # "completed" = full career cycle done, "restarted" = leftover handled;
      # both loop straight into the next cycle.
  except device_action.BotStopException:
    info("Bot stopped by hotkey.")
  bot.is_bot_running = False

if __name__ == "__main__":
  main()
