from rapidfuzz import fuzz
import re
import utils.device_action_wrapper as device_action

import core.config as config
import utils.constants as constants
from core.ocr import extract_text
from utils.log import debug, info, warning, error
from utils.screenshot import enhanced_screenshot
from utils.tools import sleep, get_secs

try:
  from weighted_levenshtein import lev, osa, dam_lev
  import numpy as np
  HAS_WEIGHTED_LEVENSHTEIN = True
except ImportError:
  HAS_WEIGHTED_LEVENSHTEIN = False

if HAS_WEIGHTED_LEVENSHTEIN:
  SUB_COSTS = np.ones((128, 128), dtype=np.float64)

  INS_COSTS = np.ones(128, dtype=np.float64)
  DEL_COSTS = np.ones(128, dtype=np.float64)
  # --- DELETION GROUP (Punctuation characters that can be removed when needed) ---
  # Low‑cost deletions for OCR‑prone ASCII symbols (using a simple list)

  deletable_symbols = [
      ';', ':', '.', ',', '-', '_', '(', ')', '[', ']', '/', '\\', '|',
      "'", '"', '`', '~', '%', '@', '#', '$', '*', '+', '=', '<', '>',
      '?', '!', '^', '&'
  ]

  for ch in deletable_symbols:
      DEL_COSTS[ord(ch)] = 0.1

  # --- END DELETION GROUP ---

  # --- VERTICALS GROUP (I-like characters: vertical stroke confusion) ---

  VERTICALS = ['l', 'I', 'i', '|', '!', '1']
  # all vertical characters → '1'
  for a in VERTICALS:
    for b in VERTICALS:
      if a != b:
        SUB_COSTS[ord(a), ord(b)] = 0.15
        SUB_COSTS[ord(b), ord(a)] = 0.15

  # --- END VERTICALS GROUP ---


  # --- ZEROS GROUP (O-like characters: circular confusion) ---
  SUB_COSTS[ord('O'), ord('0')] = 0.15
  SUB_COSTS[ord('0'), ord('O')] = 0.15
  # --- END ZEROS GROUP ---


  # --- S-FIVES GROUP ---
  SUB_COSTS[ord('S'), ord('5')] = 0.2
  SUB_COSTS[ord('5'), ord('S')] = 0.2
  # --- END S-FIVES GROUP ---


  # --- B-EIGHTS GROUP ---
  SUB_COSTS[ord('B'), ord('8')] = 0.2
  SUB_COSTS[ord('8'), ord('B')] = 0.2
  # --- END B-EIGHTS GROUP ---


  # --- Z-TWOS GROUP ---
  SUB_COSTS[ord('Z'), ord('2')] = 0.2
  SUB_COSTS[ord('2'), ord('Z')] = 0.2
  # --- END Z-TWOS GROUP ---


  # --- G-SIXES GROUP ---
  SUB_COSTS[ord('G'), ord('6')] = 0.2
  SUB_COSTS[ord('6'), ord('G')] = 0.2
  # --- END G-SIXES GROUP ---

def event_choice(event_name):
  threshold = 0.8
  choice = 0

  if not event_name:
    return choice

  default_choice = {
    "character_name": "Unknown",
    "event_name": "Unknown Event",
    "chosen": 1
  }

  best_event_name, similarity = find_best_match(event_name, config.EVENT_CHOICES)

  debug(f"Best event name match: {best_event_name}, similarity: {similarity}")

  if similarity >= threshold:
    event = next(
      (e for e in config.EVENT_CHOICES if e["event_name"] == best_event_name),
      None,  # fallback
    )
    debug(
      f"Event found: {event_name} has {similarity * 100:.2f}% similarity with {event['event_name']}"
    )
    debug(f"event name: {event['event_name']}, chosen: {event['chosen']}")
    return event
  else:
    debug(
      f"No event found, {event_name} has {similarity * 100:.2f}% similarity with {best_event_name}"
    )
    return default_choice

def get_event_name():
  img = enhanced_screenshot(constants.EVENT_NAME_REGION)
  text = extract_text(img)
  debug(f"Event name: {text}")
  return text

def find_best_match(text: str, event_list: list[dict]) -> tuple[str, float]:
  """Find the best matching skill and similarity score"""
  if not text or not event_list:
    return "", 0.0

  best_match = ""
  best_similarity = 0.0

  for event in event_list:
    event_name = event["event_name"]
    clean_text = re.sub(
      r"\s*\((?!Year 2\))[^\)]*\)", "", event_name
    ).strip()  # remove parentheses
    clean_text = re.sub(r"[^\x00-\x7F]", "", clean_text)  # remove non-ASCII
    if HAS_WEIGHTED_LEVENSHTEIN:
      dist = lev(
        clean_text,
        text,
        substitute_costs=SUB_COSTS,
        insert_costs=INS_COSTS,
        delete_costs=DEL_COSTS
      )

      max_len = max(len(clean_text), len(text)) or 1
      similarity = 1.0 - (dist / max_len)
    else:
      similarity = fuzz.token_sort_ratio(clean_text, text) / 100
    if similarity > best_similarity:
      best_similarity = similarity
      best_match = event_name

  return best_match, best_similarity

# needs a rework can be more optimized
def select_event():
  event_choices_icon = device_action.locate("assets/icons/event_choice_1.png")
  choice_vertical_gap = 112

  if not event_choices_icon:
    return False

  if not config.USE_OPTIMAL_EVENT_CHOICE:
    device_action.click(target=event_choices_icon, text=f"Event found, selecting top choice.")
    # click(boxes=event_choices_icon, text="Event found, selecting top choice.")
    return True

  event_name = get_event_name()
  if not event_name or event_name == "":
    debug(f"No event name found, returning False")
    return False
  debug(f"Event Name: {event_name}")

  # happy meek workaround
  hm_similarity = 0
  hm_text = "Happy Meek's Challenge!"
  if HAS_WEIGHTED_LEVENSHTEIN:
    dist = lev(
      hm_text,
      event_name,
      substitute_costs=SUB_COSTS,
      insert_costs=INS_COSTS,
      delete_costs=DEL_COSTS
    )

    max_len = max(len(hm_text), len(event_name)) or 1
    hm_similarity = 1.0 - (dist / max_len)
  else:
    hm_similarity = fuzz.token_sort_ratio(hm_text, event_name) / 100
  if hm_similarity > 0.9:
    debug(f"Happy Meek event similarity: {hm_similarity}")
    resolve_happy_meek_event()
    return True
  # happy meek workaround end
  event = event_choice(event_name)
  chosen = event["chosen"]
  debug(f"Event Choice: {chosen}")
  if chosen == 0:
    device_action.click(target=event_choices_icon, text=f"Event found, selecting top choice.")
    # click(boxes=event_choices_icon, text=f"Event found, selecting top choice.")
    return True

  if event["event_name"] == "A Team at Last":
    debug(f"Team selection event entered")
    current_coords = event_choices_icon
    choice_texts = ["Hoppers", "Runners", "Pudding", "Bloom", "Carrot"]
    test_against = choice_texts[chosen - 1]
    debug(f"test against: {test_against}")
    debug(f"Outside while, coord compare: {current_coords[1]} < {constants.SCREEN_MIDDLE_BBOX[3]}")
    while current_coords[1] < constants.SCREEN_MIDDLE_BBOX[3]:
      debug(f"Coord compare: {current_coords[1]} < {constants.SCREEN_MIDDLE_BBOX[3]}")

      region_xywh = (
        current_coords[0] + 90,
        current_coords[1] - 25,
        500,
        35)
      screenshot = enhanced_screenshot(region_xywh)
      text = extract_text(screenshot)
      debug(f"Text: {text}")
      if test_against == "Carrot":
        debug(f"test against: {test_against} in text: {text}")
        if "Pudding" not in text and "Carrot" in text:
          debug(f"Clicking: {current_coords}")
          device_action.click(target=current_coords, text=f"Selecting optimal choice: {event_name}")
          break
      elif test_against in text:
        debug(f"test against: {test_against} in text: {text}")
        debug(f"Clicking: {current_coords}")
        device_action.click(target=current_coords, text=f"Selecting optimal choice: {event_name}")
        break
      current_coords = (current_coords[0], current_coords[1] + choice_vertical_gap)
  else:
    x = event_choices_icon[0]
    y = event_choices_icon[1] + ((chosen - 1) * choice_vertical_gap)
    debug(f"Event choices coordinates: {event_choices_icon}")
    debug(f"Clicking: {x}, {y}")
    device_action.click(target=(x, y), text=f"Selecting optimal choice: {event_name}, target {(x, y)}")
    sleep(0.5)
    if "Acupuncturist" in event_name:
      sleep(1)
      confirm_acupuncturist_y = event_choices_icon[1] + ((4 - 1) * choice_vertical_gap)
      device_action.click(target=(x, confirm_acupuncturist_y), text=f"Confirm Acupuncturist, target {(x, y)}")

  info(f"Found event: {event_name} || Selected option: {chosen}")
  return True


HAPPY_MEEK_AFFINITY_TEMPLATES = {
  "affinity_0": "assets/ura/ura_affinity_0.png",
  "affinity_1": "assets/ura/ura_affinity_1.png",
  "affinity_2": "assets/ura/ura_affinity_2.png",
  "affinity_3": "assets/ura/ura_affinity_3.png",
}

#can't care enough to make an elegant solution so this is what we got
CHECK_ORDER=[ "affinity_3", "affinity_2", "affinity_1", "affinity_0",]

def resolve_happy_meek_event():
  debug(f"Happy Meek challenge event found.")

  device_action.flush_screenshot_cache()

  screenshot = device_action.screenshot(region_xywh=constants.GAME_WINDOW_REGION)

  matches = {}
  # find all affinity vs opponent team
  for name, path in HAPPY_MEEK_AFFINITY_TEMPLATES.items():
    matches[name] = device_action.match_template(path, screenshot)
  debug(f"Happy Meek matches: {matches}")
  for name in CHECK_ORDER:
    if matches.get(name):
      debug(f"Happy Meek found: {name}")
      x, y, w, h = matches[name][0]
      cx = constants.GAME_WINDOW_REGION[0] + x + w // 2
      cy = y + h // 2
      debug(f"Coords: {cx}, {cy}")
      return device_action.click(target=(cx, cy), text=f"Clicked match: {matches[name][0]}")
  return True