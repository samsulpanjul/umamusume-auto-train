# core/recognizer.py
import cv2
import numpy as np
import time

from utils.log import debug, error
from utils.adb_helper import ADB
from utils import helper


class Recognizer:
    def __init__(self, threshold=0.8, adb: ADB = None):
        self.adb = adb
        self.threshold = threshold

    def deduplicate_boxes(self, boxes, min_dist=5):
        """
        Remove overlapping or very close bounding boxes by checking center distances.
        """
        filtered = []
        for x, y, w, h in boxes:
            cx, cy = x + w // 2, y + h // 2
            if all(
                abs(cx - (fx + fw // 2)) > min_dist
                or abs(cy - (fy + fh // 2)) > min_dist
                for fx, fy, fw, fh in filtered
            ):
                filtered.append((x, y, w, h))
        return filtered

    def match_template(self, region=None, template_path: str = None, screen=None):
        """
        Perform template matching on the given screen.

        Returns:
            list of (x, y, w, h) bounding boxes
        Args:
            region: optional crop region (x, y, w, h)
            template_path: path to template image
            screen: screenshot image as np.array
        """
        if screen is None:
            raise ValueError("No screen value provided.")

        if region:
            screen = helper.crop_screen(screen, region)

        # Load template
        template = cv2.imread(template_path, cv2.IMREAD_COLOR)
        if template.shape[2] == 4:
            template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

        result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
        loc = np.where(result >= self.threshold)

        h, w = template.shape[:2]
        boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]

        boxes = self.deduplicate_boxes(boxes)

        return boxes

    def multi_match_templates(self, templates, screen=None):
        """
        Match multiple templates at once.

        Returns:
            dict[name] = list of (x, y, w, h) matches
        Args:
            templates: dict[name] = template_path
            screen: screenshot image as np.array
        """
        if screen is None:
            raise ValueError("No screen value provided.")

        results = {}
        sh, sw = screen.shape[:2]

        for name, path in templates.items():
            template = cv2.imread(path, cv2.IMREAD_UNCHANGED)
            if template is None or template.size == 0:
                error(f"[{name}] Failed to load template from {path}")
                results[name] = []
                continue

            # Convert template if it has an alpha channel
            if template.shape[2] == 4:
                template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

            th, tw = template.shape[:2]
            if th > sh or tw > sw:
                results[name] = []
                continue

            # Perform color-based template matching
            result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

            if max_val >= self.threshold:
                x, y = max_loc
                results[name] = [(x, y, tw, th)]
            else:
                results[name] = []

        return results

    def locate_on_screen(self, template_path, region=None, max_search_time=5.0):
        """
        Continuously search for a template within a time limit.

        Returns:
            (x, y, w, h) or None
        Args:
            template_path: str, path to template
            region: optional crop (left, top, right, bottom)
            max_search_time: float, timeout in seconds
        """
        start = time.time()

        while True:
            screen = self.adb.screenshot(crop=region)

            if screen is None or screen.size == 0:
                raise ValueError("No screen value provided")

            screen_bgr = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)

            # Load template
            template = cv2.imread(template_path, cv2.IMREAD_COLOR)
            if template is None:
                return None
            if template.shape[2] == 4:
                template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

            h, w = template.shape[:2]
            screen_gray = cv2.cvtColor(screen, cv2.COLOR_RGB2GRAY)
            template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
            result = cv2.matchTemplate(screen_gray, template_gray, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)

            if max_val >= self.threshold:
                found = (max_loc[0], max_loc[1], w, h)
                debug(f"{template_path} with confidence={max_val:.2f}")
                return found
            else:
                debug(f"Searching {template_path}... confidence={max_val:.2f}")

            if time.time() - start >= max_search_time:
                return None

            time.sleep(0.05)

    def is_btn_active(self, region=None, threshold=150, screen=None):
        """
        Determine if a button is active by analyzing its brightness.

        Returns:
            bool
        Args:
            region: (x, y, w, h)
            threshold: brightness threshold
            screen: screenshot np.array
        """
        if screen is None or screen.size == 0:
            screen = self.adb.screenshot()

        img = helper.crop_screen(screen, region)

        if img.size == 0:
            error("is_btn_active: Cropped region is empty")
            return False

        grayscale = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        avg_brightness = np.mean(grayscale)

        debug(f"Button brightness: {avg_brightness:.2f}, threshold: {threshold}")
        return avg_brightness > threshold

    def count_pixels_of_color(
        self, color_rgb=[117, 117, 117], region=None, tolerance=2, screen=None
    ):
        """
        Count pixels within a region that match a given color (with tolerance).

        Returns:
            int, number of pixels matching
        Args:
            color_rgb: reference color in RGB
            region: (x, y, w, h)
            tolerance: range around the reference color
            screen: screenshot np.array
        """
        if region:
            cropped = helper.crop_screen(screen, region)
        else:
            return -1

        color = np.array(color_rgb, np.uint8)

        # Define min/max range ± tolerance
        color_min = np.clip(color - tolerance, 0, 255)
        color_max = np.clip(color + tolerance, 0, 255)

        dst = cv2.inRange(cropped, color_min, color_max)
        pixel_count = cv2.countNonZero(dst)
        return pixel_count

    def find_color_of_pixel(self, region=None, screen=None):
        """
        Find the color of the central pixel within a cropped region.

        Args:
            region: (x, y, w, h)
            screen: screenshot np.array
        Returns:
            [R, G, B] list
        """
        if region:
            cropped = helper.crop_screen(screen, region)
            cx = cropped.shape[1] // 2
            cy = cropped.shape[0] // 2
            b, g, r = cropped[cy, cx]
            return [r, g, b]
        else:
            return -1

    @staticmethod
    def closest_color(color_dict, target_color):
        """
        Find the closest color name from a dictionary based on Euclidean distance.

        Args:
            color_dict: dict[name] = [R, G, B]
            target_color: [R, G, B]
        Returns:
            str, closest color name
        """
        closest_name = None
        min_dist = float("inf")
        target_color = np.array(target_color)
        for name, col in color_dict.items():
            col = np.array(col)
            dist = np.linalg.norm(target_color - col)
            if dist < min_dist:
                min_dist = dist
                closest_name = name
        return closest_name
