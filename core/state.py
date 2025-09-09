import re
import json
from math import floor
from typing import Any, Dict, Tuple, Union

from utils.screenshot import capture_region, enhanced_screenshot
from core.ocr import extract_text, extract_number
from core.recognizer import (
    match_template,
    count_pixels_of_color,
    find_color_of_pixel,
    closest_color,
)
from utils.constants import (
    SUPPORT_CARD_ICON_REGION,
    MOOD_REGION,
    TURN_REGION,
    FAILURE_REGION,
    YEAR_REGION,
    MOOD_LIST,
    CRITERIA_REGION,
    SKILL_PTS_REGION,
    ENERGY_REGION,
    RACE_INFO_TEXT_REGION,
)

# Global state variables
is_bot_running = False
MINIMUM_MOOD = None
PRIORITIZE_G1_RACE = None
IS_AUTO_BUY_SKILL = None
SKILL_PTS_CHECK = None
PRIORITY_STAT = None
MAX_FAILURE = None
STAT_CAPS = None
SKILL_LIST = None

# Internal previous match cache
_previous_right_bar_match = None


def load_config(path: str = "config.json") -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def reload_config() -> None:
    """Reload configuration from JSON and set global variables."""
    global PRIORITY_STAT, PRIORITY_WEIGHT, MINIMUM_MOOD, MINIMUM_MOOD_JUNIOR_YEAR, MAX_FAILURE
    global PRIORITIZE_G1_RACE, CANCEL_CONSECUTIVE_RACE, STAT_CAPS, IS_AUTO_BUY_SKILL, SKILL_PTS_CHECK, SKILL_LIST
    global PRIORITY_EFFECTS_LIST, SKIP_TRAINING_ENERGY, NEVER_REST_ENERGY, SKIP_INFIRMARY_UNLESS_MISSING_ENERGY
    global PREFERRED_POSITION, ENABLE_POSITIONS_BY_RACE, POSITIONS_BY_RACE, POSITION_SELECTION_ENABLED

    config = load_config()

    PRIORITY_STAT = config["priority_stat"]
    PRIORITY_WEIGHT = config["priority_weight"]
    MINIMUM_MOOD = config["minimum_mood"]
    MINIMUM_MOOD_JUNIOR_YEAR = config.get("minimum_mood_junior_year", MINIMUM_MOOD)
    MAX_FAILURE = config["maximum_failure"]
    PRIORITIZE_G1_RACE = config["prioritize_g1_race"]
    CANCEL_CONSECUTIVE_RACE = config["cancel_consecutive_race"]
    STAT_CAPS = config["stat_caps"]
    IS_AUTO_BUY_SKILL = config["skill"]["is_auto_buy_skill"]
    SKILL_PTS_CHECK = config["skill"]["skill_pts_check"]
    SKILL_LIST = config["skill"]["skill_list"]
    PRIORITY_EFFECTS_LIST = {i: v for i, v in enumerate(config["priority_weights"])}
    SKIP_TRAINING_ENERGY = config["skip_training_energy"]
    NEVER_REST_ENERGY = config["never_rest_energy"]
    SKIP_INFIRMARY_UNLESS_MISSING_ENERGY = config["skip_infirmary_unless_missing_energy"]
    PREFERRED_POSITION = config["preferred_position"]
    ENABLE_POSITIONS_BY_RACE = config["enable_positions_by_race"]
    POSITIONS_BY_RACE = config["positions_by_race"]
    POSITION_SELECTION_ENABLED = config["position_selection_enabled"]


def stat_state() -> Dict[str, int]:
    """Get current stats for the character."""
    stat_regions = {
        "spd": (310, 723, 55, 20),
        "sta": (405, 723, 55, 20),
        "pwr": (500, 723, 55, 20),
        "guts": (595, 723, 55, 20),
        "wit": (690, 723, 55, 20),
    }

    result = {}
    for stat, region in stat_regions.items():
        try:
            img = enhanced_screenshot(region)
            result[stat] = extract_number(img)
        except Exception:
            result[stat] = -1
    return result


def check_support_card(threshold: float = 0.8) -> Dict[str, Any]:
    """Check support cards and friendship levels in the current training screen."""
    SUPPORT_ICONS = {
        "spd": "assets/icons/support_card_type_spd.png",
        "sta": "assets/icons/support_card_type_sta.png",
        "pwr": "assets/icons/support_card_type_pwr.png",
        "guts": "assets/icons/support_card_type_guts.png",
        "wit": "assets/icons/support_card_type_wit.png",
        "friend": "assets/icons/support_card_type_friend.png",
    }

    SUPPORT_FRIEND_LEVELS = {
        "gray": [110, 108, 120],
        "blue": [42, 192, 255],
        "green": [162, 230, 30],
        "yellow": [255, 173, 30],
        "max": [255, 235, 120],
    }

    count_result = {"total_supports": 0, "total_friendship_levels": {lvl: 0 for lvl in SUPPORT_FRIEND_LEVELS}}

    for key, icon_path in SUPPORT_ICONS.items():
        count_result[key] = {"supports": 0, "friendship_levels": {lvl: 0 for lvl in SUPPORT_FRIEND_LEVELS}}
        matches = match_template(icon_path, SUPPORT_CARD_ICON_REGION, threshold)

        for match in matches:
            x, y, w, h = match
            count_result[key]["supports"] += 1
            count_result["total_supports"] += 1

            mid_x = floor((2 * x + w) / 2)
            mid_y = floor((2 * y + h) / 2)
            icon_to_friend_distance = 66
            pixel_region = (mid_x + SUPPORT_CARD_ICON_REGION[0],
                            mid_y + SUPPORT_CARD_ICON_REGION[1] + icon_to_friend_distance,
                            mid_x + SUPPORT_CARD_ICON_REGION[0] + 1,
                            mid_y + SUPPORT_CARD_ICON_REGION[1] + icon_to_friend_distance + 1)

            try:
                color = find_color_of_pixel(pixel_region)
                friend_level = closest_color(SUPPORT_FRIEND_LEVELS, color)
                count_result[key]["friendship_levels"][friend_level] += 1
                count_result["total_friendship_levels"][friend_level] += 1
            except Exception:
                continue

    return count_result


def check_failure() -> int:
    """Check failure percentage from the failure region."""
    failure_img = enhanced_screenshot(FAILURE_REGION)
    failure_text = extract_text(failure_img).lower()

    if not failure_text.startswith("failure"):
        return -1

    percent_match = re.search(r"failure\s+(\d{1,3})%", failure_text)
    if percent_match:
        return int(percent_match.group(1))

    number_match = re.search(r"failure\s+(\d+)", failure_text)
    if number_match:
        digits = number_match.group(1)
        idx = digits.find("9")
        if idx > 0:
            return int(digits[:idx])
        elif digits.isdigit():
            return int(digits)

    return -1


def check_mood() -> str:
    """Check current mood from the mood region."""
    mood_img = capture_region(MOOD_REGION)
    mood_text = extract_text(mood_img).upper()

    for known_mood in MOOD_LIST:
        if known_mood in mood_text:
            return known_mood

    print(f"[WARNING] Mood not recognized: {mood_text}")
    return "UNKNOWN"


def check_turn() -> Union[int, str]:
    """Check current turn or 'Race Day'."""
    turn_img = enhanced_screenshot(TURN_REGION)
    text = extract_text(turn_img)

    if "Race Day" in text:
        return "Race Day"

    cleaned = text.replace("T", "1").replace("I", "1").replace("O", "0").replace("S", "5")
    digits = re.sub(r"[^\d]", "", cleaned)
    return int(digits) if digits else -1


def check_current_year() -> str:
    """Check current in-game year."""
    year_img = enhanced_screenshot(YEAR_REGION)
    return extract_text(year_img)


def check_criteria() -> str:
    """Check current criteria text."""
    criteria_img = enhanced_screenshot(CRITERIA_REGION)
    return extract_text(criteria_img)


def check_skill_pts() -> int:
    """Check current skill points."""
    skill_img = enhanced_screenshot(SKILL_PTS_REGION)
    return extract_number(skill_img)


def check_energy_level(threshold: float = 0.85) -> Tuple[float, float]:
    """Estimate remaining energy percentage and max energy."""
    global _previous_right_bar_match
    right_bar_match = match_template("assets/ui/energy_bar_right_end_part.png", ENERGY_REGION, threshold)

    if not right_bar_match:
        print("[WARNING] Energy bar not found")
        return -1, -1

    x, y, w, h = right_bar_match[0]
    energy_length = x

    ex, ey, ew, eh = ENERGY_REGION
    mid_y = round((ey + eh) / 2)
    max_energy_region = (ex, mid_y, ex + energy_length, mid_y + 1)

    empty_pixels = count_pixels_of_color([118, 117, 118], max_energy_region)
    total_length = energy_length - 1
    energy_level = ((total_length - empty_pixels) / 236) * 100
    max_energy = (total_length / 236) * 100

    print(f"[INFO] Energy level: {energy_level:.2f}% / Max: {max_energy:.2f}%")
    _previous_right_bar_match = right_bar_match

    return energy_level, max_energy


def get_race_type() -> str:
    """Get race type info text."""
    race_img = enhanced_screenshot(RACE_INFO_TEXT_REGION)
    text = extract_text(race_img)
    print(f"[INFO] Race info text: {text}")
    return text
