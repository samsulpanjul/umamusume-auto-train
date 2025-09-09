# utils/screen.py
from time import sleep
from utils.log import debug, warning
from typing import Optional, List, Tuple
import pyautogui

def safe_locate(img, confidence=0.8, region=None, retries=3, min_search_time=0.5, retry_delay=0.6):
    """
    Wrapper around pyautogui.locateCenterOnScreen that retries and logs.
    Returns None if not found.
    """
    for i in range(retries):
        try:
            pos = pyautogui.locateCenterOnScreen(img, confidence=confidence, minSearchTime=min_search_time, region=region)
            if pos:
                debug(f"safe_locate: found {img} on attempt {i+1}")
                return pos
        except Exception as e:
            warning(f"safe_locate: error locating {img}: {e}")
        sleep(retry_delay)
    debug(f"safe_locate: {img} not found after {retries} attempts")
    return None

def safe_multi_locate(match_fn, *args, **kwargs):
    """If you have a wrapper that returns many matches, call it via this helper (keeps interface consistent)."""
    try:
        matches = match_fn(*args, **kwargs)
        return matches or []
    except Exception as e:
        warning(f"safe_multi_locate: error: {e}")
        return []

def safe_locate_center(image_path: str, confidence: float = 0.9) -> Optional[Tuple[int, int]]:
    """Locate the center of an image on the screen safely."""
    try:
        pos = pyautogui.locateCenterOnScreen(image_path, confidence=confidence)
        return pos
    except Exception as e:
        print(f"[ERROR] safe_locate_center failed: {e}")
        return None

def safe_locate_all(image_path: str, confidence: float = 0.9) -> List[Tuple[int, int]]:
    """Locate all occurrences of an image on the screen safely."""
    positions = []
    try:
        matches = pyautogui.locateAllOnScreen(image_path, confidence=confidence)
        for match in matches:
            positions.append((match.left + match.width // 2, match.top + match.height // 2))
    except Exception as e:
        print(f"[ERROR] safe_locate_all failed: {e}")
    return positions
