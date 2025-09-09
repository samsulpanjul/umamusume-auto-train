import time
from typing import List, Tuple
import pyautogui
import Levenshtein

from utils.screenshot import enhanced_screenshot
from core.ocr import extract_text
from core.recognizer import match_template, is_btn_active
import core.state as state
from utils.log import info, debug, warning, error


def buy_skill() -> bool:
    """
    Attempts to buy a skill from the skill list using on-screen recognition and OCR.

    Returns:
        True if a skill was successfully bought, False otherwise.
    """
    pyautogui.moveTo(x=560, y=680)  # Move cursor to skill area
    found_skill = False

    for attempt in range(10):
        # Slight pause at the bottom of scrolling to allow animations to finish
        if attempt > 8:
            time.sleep(0.5)

        try:
            buy_skill_icons = match_template("assets/icons/buy_skill.png", threshold=0.9)
            if not buy_skill_icons:
                debug(f"[SKILL] No buy_skill icons found in attempt {attempt + 1}.")
                continue

            for x, y, w, h in buy_skill_icons:
                region = (x - 420, y - 40, w + 275, h + 5)
                screenshot = enhanced_screenshot(region)
                text = extract_text(screenshot)

                if is_skill_match(text, state.SKILL_LIST):
                    button_region = (x, y, w, h)
                    if is_btn_active(button_region):
                        info(f"[SKILL] Buying skill: {text}")
                        pyautogui.click(x=x + 5, y=y + 5, duration=0.15)
                        found_skill = True
                    else:
                        warning(f"[SKILL] {text} found but not enough skill points.")
        except Exception as e:
            error(f"[SKILL] Error during skill detection/buying: {e}")

        # Scroll down to reveal more skills
        for _ in range(7):
            pyautogui.scroll(-300)
            time.sleep(0.05)  # Small delay for scrolling animation

        if found_skill:
            break

    return found_skill


def is_skill_match(text: str, skill_list: List[str], threshold: float = 0.8) -> bool:
    """
    Checks if an OCR-extracted text matches any skill in the skill list.

    Args:
        text: OCR-extracted skill name.
        skill_list: List of desired skills.
        threshold: Similarity ratio threshold for match (0-1).

    Returns:
        True if a match is found, False otherwise.
    """
    text_lower = text.lower().strip()
    for skill in skill_list:
        similarity = Levenshtein.ratio(text_lower, skill.lower())
        debug(f"[SKILL] Comparing '{text_lower}' to '{skill.lower()}' -> similarity {similarity:.2f}")
        if similarity >= threshold:
            return True
    return False
