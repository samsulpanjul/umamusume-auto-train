import cv2
import numpy as np
from PIL import ImageGrab, ImageStat, Image

from utils.log import info, warning, error, debug
import utils.device_action_wrapper as device_action
from utils.log import debug_window

'''def match_template(template_path, region=None, threshold=0.85):
  # Get screenshot
  if region:
    screen = np.array(ImageGrab.grab(bbox=region))  # (left, top, right, bottom)
  else:
    screen = np.array(ImageGrab.grab())

  # Load template
  template = cv2.imread(template_path, cv2.IMREAD_COLOR)  # safe default
  if template.shape[2] == 4:
    template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)
  template = cv2.cvtColor(template, cv2.COLOR_RGB2BGR)
  result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
  loc = np.where(result >= threshold)

  h, w = template.shape[:2]
  boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]

  return deduplicate_boxes(boxes)

def multi_match_templates(templates, screen=None, threshold=0.85):
  if screen is None:
    screen = np.array(ImageGrab.grab())
  elif isinstance(screen, Image.Image):
    screen = np.array(screen)

  results = {}
  for name, path in templates.items():
    template = cv2.imread(path, cv2.IMREAD_COLOR)
    if template is None:
      results[name] = []
      continue
    if template.shape[2] == 4:
      template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)
    template = cv2.cvtColor(template, cv2.COLOR_RGB2BGR)

    result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(result >= threshold)
    h, w = template.shape[:2]
    boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]
    results[name] = boxes
  return results
'''
def deduplicate_boxes(boxes, min_dist=5):
  filtered = []
  for x, y, w, h in boxes:
    cx, cy = x + w // 2, y + h // 2
    if all(abs(cx - (fx + fw // 2)) > min_dist or abs(cy - (fy + fh // 2)) > min_dist
        for fx, fy, fw, fh in filtered):
      filtered.append((x, y, w, h))
  return filtered

def is_btn_active(region, treshold = 150):
  screenshot = device_action.screenshot(region_xywh=region)
  grayscale = screenshot.convert("L")
  stat = ImageStat.Stat(grayscale)
  avg_brightness = stat.mean[0]

  # Treshold btn
  return avg_brightness > treshold

def count_pixels_of_color(color_rgb=[117,117,117], region=None, tolerance=2):
  # [117,117,117] is gray for missing energy, we go 2 below and 2 above so that it's more stable in recognition
  screenshot = None
  if region:
    screenshot = device_action.screenshot(region_ltrb=region)
  else:
    return -1

  color = np.array(color_rgb, np.uint8)

  # define min/max range ±2
  color_min = np.clip(color - tolerance, 0, 255)
  color_max = np.clip(color + tolerance, 0, 255)

  dst = cv2.inRange(screenshot, color_min, color_max)
  pixel_count = cv2.countNonZero(dst)
  debug(f"Pixel count: {pixel_count}")
  return pixel_count

def find_color_of_pixel(region=None):
  if region:
    #we can only return one pixel's color here, so we take the x, y and add 1 to them
    region = (region[0], region[1], region[0]+1, region[1]+1)
    screenshot = device_action.screenshot(region_ltrb=region)
    return screenshot[0]
  else:
    return -1

def closest_color(color_dict, target_color):
  closest_name = None
  min_dist = float('inf')
  target_color = np.array(target_color)
  for name, col in color_dict.items():
    col = np.array(col)
    dist = np.linalg.norm(target_color - col)  # Euclidean distance
    if dist < min_dist:
      min_dist = dist
      closest_name = name
  return closest_name

def compare_brightness(template_path: str, other: np.ndarray, brightness_diff_threshold=0.025):
  reference_img = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)
  reference_brightness = np.mean(reference_img)
  other_gray = cv2.cvtColor(other, cv2.COLOR_BGR2GRAY)
  region_brightness = np.mean(other_gray)
  brightness_diff = abs(region_brightness - reference_brightness) / reference_brightness
  debug(f"Brightness diff: {brightness_diff:.3f}, threshold: {brightness_diff_threshold}")
  if brightness_diff <= brightness_diff_threshold:
    return True
  return False
