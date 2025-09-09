import cv2
import numpy as np
from PIL import ImageGrab, ImageStat, Image
from typing import List, Tuple, Dict, Optional
from utils.log import info, debug, warning, error
from utils.screenshot import capture_region


def match_template(template_path: str, region: Optional[Tuple[int, int, int, int]] = None, threshold: float = 0.85) -> List[Tuple[int, int, int, int]]:
    """
    Match a single template in the screen or a specified region.

    Args:
        template_path: Path to the template image.
        region: Optional screen region to search in (left, top, right, bottom).
        threshold: Matching confidence threshold (0-1).

    Returns:
        List of bounding boxes (x, y, w, h) for matched regions.
    """
    try:
        # Capture screen
        screen = np.array(ImageGrab.grab(bbox=region)) if region else np.array(ImageGrab.grab())
        screen = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)

        # Load template
        template = cv2.imread(template_path, cv2.IMREAD_UNCHANGED)
        if template is None:
            warning(f"[TEMPLATE] Template not found: {template_path}")
            return []

        # Convert BGRA -> BGR if necessary
        if template.shape[2] == 4:
            template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

        result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
        loc = np.where(result >= threshold)
        h, w = template.shape[:2]

        boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]
        return deduplicate_boxes(boxes)

    except Exception as e:
        error(f"[TEMPLATE] Error matching template '{template_path}': {e}")
        return []


def multi_match_templates(templates: Dict[str, str], screen: Optional[Image.Image] = None, threshold: float = 0.85) -> Dict[str, List[Tuple[int, int, int, int]]]:
    """
    Match multiple templates on the same screenshot.

    Args:
        templates: Dict of {template_name: template_path}.
        screen: Optional PIL.Image screen to reuse.
        threshold: Matching threshold.

    Returns:
        Dict of template_name -> list of matched boxes.
    """
    results: Dict[str, List[Tuple[int, int, int, int]]] = {}
    try:
        if screen is None:
            screen = ImageGrab.grab()
        screen_bgr = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2BGR)

        for name, path in templates.items():
            template = cv2.imread(path, cv2.IMREAD_UNCHANGED)
            if template is None:
                warning(f"[TEMPLATE] Template not found: {path}")
                results[name] = []
                continue

            if template.shape[2] == 4:
                template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

            match_result = cv2.matchTemplate(screen_bgr, template, cv2.TM_CCOEFF_NORMED)
            loc = np.where(match_result >= threshold)
            h, w = template.shape[:2]
            boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]
            results[name] = deduplicate_boxes(boxes)

        return results

    except Exception as e:
        error(f"[TEMPLATE] Error in multi_match_templates: {e}")
        return {k: [] for k in templates.keys()}


def deduplicate_boxes(boxes: List[Tuple[int, int, int, int]], min_dist: int = 5) -> List[Tuple[int, int, int, int]]:
    """
    Remove overlapping or too-close bounding boxes.

    Args:
        boxes: List of boxes (x, y, w, h).
        min_dist: Minimum distance between box centers to consider them unique.

    Returns:
        Filtered list of boxes.
    """
    filtered: List[Tuple[int, int, int, int]] = []
    for x, y, w, h in boxes:
        cx, cy = x + w // 2, y + h // 2
        if all(abs(cx - (fx + fw // 2)) > min_dist or abs(cy - (fy + fh // 2)) > min_dist for fx, fy, fw, fh in filtered):
            filtered.append((x, y, w, h))
    debug(f"[TEMPLATE] Deduplicated boxes: {filtered}")
    return filtered


def is_btn_active(region: Tuple[int, int, int, int], threshold: int = 150) -> bool:
    """
    Determine if a button is active based on average brightness.

    Args:
        region: Button region (left, top, right, bottom).
        threshold: Minimum average brightness to consider active.

    Returns:
        True if active, False otherwise.
    """
    try:
        screenshot = capture_region(region)
        grayscale = screenshot.convert("L")
        avg_brightness = ImageStat.Stat(grayscale).mean[0]
        debug(f"[BTN] Avg brightness: {avg_brightness}")
        return avg_brightness > threshold
    except Exception as e:
        error(f"[BTN] Error checking button activity: {e}")
        return False


def count_pixels_of_color(color_rgb: List[int] = [118, 117, 118], region: Optional[Tuple[int, int, int, int]] = None) -> int:
    """
    Count pixels of a specific color in a region.

    Args:
        color_rgb: RGB color to count.
        region: Optional screen region.

    Returns:
        Number of pixels matching the color.
    """
    if not region:
        return -1
    try:
        screen = np.array(ImageGrab.grab(bbox=region))
        color = np.array(color_rgb, np.uint8)
        mask = cv2.inRange(screen, color, color)
        count = cv2.countNonZero(mask)
        debug(f"[COLOR] Pixel count for {color_rgb}: {count}")
        return count
    except Exception as e:
        error(f"[COLOR] Error counting pixels: {e}")
        return -1


def find_color_of_pixel(region: Optional[Tuple[int, int, int, int]] = None) -> Union[np.ndarray, int]:
    """
    Get the color of a single pixel.

    Args:
        region: Pixel region (left, top, right, bottom), usually 1x1.

    Returns:
        RGB value as numpy array or -1 if failed.
    """
    if not region:
        return -1
    try:
        region_bbox = (region[0], region[1], region[0] + 1, region[1] + 1)
        screen = np.array(ImageGrab.grab(bbox=region_bbox))
        return screen[0, 0]
    except Exception as e:
        error(f"[COLOR] Error finding pixel color: {e}")
        return -1


def closest_color(color_dict: Dict[str, List[int]], target_color: List[int]) -> Optional[str]:
    """
    Find the closest color name in a dictionary to a target color using Euclidean distance.

    Args:
        color_dict: Dict of name -> RGB color.
        target_color: Target RGB color.

    Returns:
        Name of the closest color.
    """
    closest_name = None
    min_dist = float('inf')
    target_color_np = np.array(target_color)

    for name, col in color_dict.items():
        col_np = np.array(col)
        dist = np.linalg.norm(target_color_np - col_np)
        if dist < min_dist:
            min_dist = dist
            closest_name = name

    debug(f"[COLOR] Closest color to {target_color}: {closest_name} (distance {min_dist})")
    return closest_name
