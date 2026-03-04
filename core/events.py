from rapidfuzz import fuzz
import re
import utils.device_action_wrapper as device_action

import core.config as config
import utils.constants as constants
from core.ocr import extract_text
from utils.log import debug, info, warning, error
from utils.screenshot import enhanced_screenshot
from utils.tools import sleep, get_secs

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
    similarity = fuzz.token_sort_ratio(clean_text.lower(), text.lower()) / 100
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
    # debug(f"Event choices coordinates: {event_choices_icon}")
    debug(f"Event choices coordinates: {event_choices_icon}")
    # debug(f"Clicking: {x}, {y}")
    debug(f"Clicking: {x}, {y}")
    device_action.click(target=(x, y), text=f"Selecting optimal choice: {event_name}")
    # click(boxes=(x, y, 1, 1), text=f"Selecting optimal choice: {event_name}")
    sleep(0.5)
    if "Acupuncturist" in event_name:
      confirm_acupuncturist_y = event_choices_icon[1] + ((4 - 1) * choice_vertical_gap)
      device_action.click(target=(x, confirm_acupuncturist_y), text=f"Selecting optimal choice: {event_name}")
      # click(boxes=(x, confirm_acupuncturist_y, 1, 1), text="Confirm acupuncturist.")
  info(f"Found event: {event_name} || Selected option: {chosen}")
  return True
