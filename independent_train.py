# Standalone launcher for independent training careers.
# Usage:
#   py independent_train.py
#   py independent_train.py --card "Card Name" --agenda 3
#
# Portrait orientation only, designed for ADB (MumuPlayer), mirrors auto_misc.py's setup.
# Runs indefinitely, one training cycle after another:
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
#  14  wait for the training to start
#  15  sleep 50 minutes while the in-game training runs
#  16  overview screen -> OK
#  17  complete career screen -> spend all skill points:
#      read SP counter (OCR), scan the whole list recording cost + gold flag,
#      scroll back to top, then a cost-aware greedy second pass that maximizes
#      the number of skills bought (gold skill cost is reduced by the cost of
#      the skill succeeding it, since buying a gold auto-buys that skill),
#      repeat while skill_exclamation.png shows unspent points
#  18  complete career -> spend skill points -> Finish -> Next -> Confirm x2 ->
#       Close -> Next x7 -> to_home -> loop until home screen -> next cycle

import argparse
import re
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
  "complete_career_btn": "assets/buttons/complete_career_btn.png",
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
GOLD_SAT_THRESHOLD = 40        # HSV saturation of the card bottom strip: gold ~77, white ~15
NAME_MATCH_THRESHOLD = 0.85    # Levenshtein ratio for skill name dedupe / target matching
# Scrolling the skill list: skill rows sit ~157px apart in the 450px-tall viewport.
# A normal ADB swipe always flings (lift velocity = travel/duration), and Unity
# then keeps scrolling with momentum. The no-fling gesture below moves the finger
# fast but holds it still before lifting. Measured on the real skill list:
# 400px travel = ~370px scroll, identical every repeat, static within 2s.
SKILL_SCROLL_STEP_PX = 470     # finger travel; leaves ~90px overlap between frames (safe, row height ~157px)
SKILL_SCROLL_DURATION_S = 0.7  # only used by the slow-swipe fallback
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
  """Gold skills have a saturated gradient banner; white cards are near-grayscale.
  Samples the card's bottom strip relative to the buy button. Returns
  True/False, or None when the strip is cut off at the region edge."""
  rx, ry, _, _ = icon
  height, width = region_screenshot.shape[:2]
  y1, y2 = ry + 66, ry + 80
  x1, x2 = rx - 60, rx - 5
  if y2 >= height or x1 < 0 or x2 <= x1:
    return None
  strip = region_screenshot[y1:y2, x1:x2]
  saturation = cv2.cvtColor(strip, cv2.COLOR_RGB2HSV)[:, :, 1]
  return float(np.mean(saturation)) > GOLD_SAT_THRESHOLD

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

def gold_flag_reliable(icon, region_height):
  """The gold strip sits just below the buy button; for rows cut off by the
  frame edges it can sample a neighbouring row instead, so only trust it on
  rows comfortably inside the frame."""
  return 50 < icon[1] < region_height - 110

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
      world_icon = (icon[0] + x1, icon[1] + y1, icon[2], icon[3])
      name = ocr_row_name(world_icon)
      cost = ocr_row_cost(world_icon)
      gold = is_gold_row(screenshot1, icon)
      if gold is not None and not gold_flag_reliable(icon, region_height):
        gold = None
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
  """Cost-aware greedy plan that maximizes the number of skills bought.
  A gold skill auto-buys the skill succeeding it, so its effective cost is
  reduced by that skill's cost. Every skill also stays available as a single:
  if a gold bundle gets skipped (its successor was already picked separately)
  the gold can still be bought on its own."""
  items = []
  for index, entry in enumerate(entries):
    items.append({"names": [entry["name"]], "cost": entry["cost"],
                  "gold": entry["gold"], "successor": None})
    if entry["gold"] and index + 1 < len(entries):
      successor = entries[index + 1]
      effective_cost = max(0, entry["cost"] - successor["cost"])
      items.append({"names": [entry["name"], successor["name"]], "cost": effective_cost,
                    "gold": True, "successor": successor["name"]})
  # Sort by absolute cost ascending so the cheapest items are bought first.
  # This maximizes the total number of purchases (each purchase = 1 skill,
  # gold bundles = 2). Average-cost sorting was wrong: a 160 SP bundle
  # (avg 80/skill) would beat a 90 SP single, draining SP before cheaper
  # singles were considered.
  items.sort(key=lambda item: item["cost"])
  remaining = skill_points
  picks = []
  bought = set()
  for item in items:
    if item["cost"] > remaining:
      continue
    if item["names"][0] in bought:
      # Already acquired, e.g. the successor of a gold that was picked earlier.
      continue
    if item["successor"] and item["successor"] in bought:
      info(f"Plan skips gold \"{item['names'][0]}\": its required skill was already picked separately.")
      continue
    picks.append(item)
    remaining -= item["cost"]
    for name in item["names"]:
      bought.add(name)
  spent = skill_points - remaining
  info(f"Purchase plan: {sum(len(item['names']) for item in picks)} skills for {spent} SP, {remaining} SP left over.")
  for item in picks:
    chain = " (gold chain)" if item["gold"] else ""
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
  x1, y1, _, _ = constants.SCROLLING_SKILL_SCREEN_BBOX
  screenshot1 = settle_skill_scroll()
  for _ in range(pages + 2):
    for icon in match_skill_icons(screenshot1):
      world_icon = (icon[0] + x1, icon[1] + y1, icon[2], icon[3])
      name = ocr_row_name(world_icon)
      if not name:
        continue
      if buy_everything:
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
  """The in-game training takes exactly 50 minutes. Sleep in 30s chunks so the
  stop hotkey stays responsive. Raw time.sleep on purpose: SLEEP_TIME_MULTIPLIER
  must not scale a real-time wait."""
  total_seconds = minutes * 60
  info(f"Training is running, sleeping for {minutes} minutes.")
  slept = 0
  while slept < total_seconds:
    if not bot.is_bot_running:
      return
    chunk = min(30, total_seconds - slept)
    time.sleep(chunk)
    slept += chunk
    if slept % 300 == 0:
      info(f"Training wait: {slept // 60} min elapsed, {(total_seconds - slept) // 60} min remaining.")

def wait_for_training_completion(timeout_s=600):
  """The 50 minutes can drift slightly due to connection delays, so poll a bit longer."""
  deadline = time.time() + timeout_s
  while time.time() < deadline:
    if locate_grayscale("assets/ui/overview.png", min_search_time=get_secs(3)):
      info("Training overview screen detected.")
      return True
    sleep(2)
  error(f"Training overview screen did not appear within {timeout_s} seconds after the wait.")
  return False

def spend_all_skill_points(max_rounds=5):
  """On the Complete Career screen: while skill_exclamation.png shows unspent
  points, open the skill screen and buy, then continue."""
  for round_num in range(1, max_rounds + 1):
    if not locate_grayscale("assets/ui/skill_exclamation.png", min_search_time=get_secs(2)):
      debug("No unspent skill points detected.")
      return True
    info(f"Unspent skill points detected (round {round_num}), opening the skill screen.")
    if not locate_grayscale_and_click("assets/buttons/complete_career_skills_btn.png", min_search_time=get_secs(5)):
      warning("Could not find the Skills button on the Complete Career screen.")
      return False
    buy_skills_cost_aware()
    sleep(get_secs(1))
  warning("Skill points still unspent after 5 buying rounds, continuing anyway.")
  return True

def is_on_home_screen():
  """Check whether the career button is visible (home screen indicator)."""
  return device_action.locate(flow_templates["career_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()) is not None

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
  if not wait_for_and_click("assets/buttons/to_home.png", timeout_s=get_secs(20)):
    warning("to_home button not found.")

  # 7. Keep trying to reach home screen, dismissing popups along the way
  while time.time() < deadline:
    if is_on_home_screen():
      info("Home screen reached after career completion.")
      return True
    dismiss_popups(max_rounds=3)
    sleep(1)

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
  if not wait_for_training_completion():
    return False
  info("Clicking OK on the overview screen.")
  if not wait_for_and_click("assets/buttons/ok_btn.png", timeout_s=get_secs(30)):
    warning("Could not click OK on the overview screen, trying to continue from the Complete Career screen.")
  return complete_career()


# ---------------------------------------------------------------------------
# Flow steps
# ---------------------------------------------------------------------------
def step_reach_home():
  deadline = time.time() + get_secs(30)
  while time.time() < deadline:
    if device_action.locate(flow_templates["career_btn"], min_search_time=get_secs(2), region_ltrb=game_window_ltrb()):
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

def run_career_cycle():
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

  # 14. Training started
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
  cycle = 0
  try:
    while bot.is_bot_running:
      cycle += 1
      info(f"=== Training cycle {cycle} starting. ===")
      if not run_career_cycle():
        error("Independent training flow failed, see logs above.")
        break
      if not post_training():
        error("Post-training flow failed, see logs above.")
        break
  except device_action.BotStopException:
    info("Bot stopped by hotkey.")
  bot.is_bot_running = False

if __name__ == "__main__":
  main()
