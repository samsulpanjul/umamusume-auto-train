import cv2
import numpy as np
from PIL import ImageGrab, ImageStat

from utils.log import info, warning, error, debug
from utils.screenshot import capture_region
import pickle
import os

template_cache_path = 'templates_cache.pkl'
if os.path.exists(template_cache_path):
  with open(template_cache_path, 'rb') as file:
    templates_cache = pickle.load(file)
else:
  templates_cache = {}

DEFAULT_BBOX = (0, 0, 963, 1080)

def match_template(template_path, region=None, threshold=0.85, use_cache = True, screen = None, abort_condition = False):
  # Get screenshot
  if screen is None:
    if region:
      screen = np.array(ImageGrab.grab(bbox=region))  # (left, top, right, bottom)
    else:
      screen = np.array(ImageGrab.grab(bbox = DEFAULT_BBOX))

#  cv2.namedWindow("image")
#  cv2.moveWindow("image", -900, 0)
#  cv2.imshow("image", screen)
#  cv2.waitKey(5)

  # Load template
  template = cv2.imread(template_path, cv2.IMREAD_COLOR)  # safe default
  if template.shape[2] == 4:
    template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)
  h, w = template.shape[:2]
  boxes = []
  if use_cache and template_path in templates_cache and templates_cache[template_path] :
    for x0, y0 in templates_cache[template_path]:
      left = max(0, x0 - w)
      top = max(0, y0 - h)
      right = min(screen.shape[1], x0 + w)
      bottom = min(screen.shape[0], y0 + h)
      cv2screen = cv2.cvtColor(screen[top:bottom, left:right, :], cv2.COLOR_RGB2BGR)
      result = cv2.matchTemplate(cv2screen, template, cv2.TM_CCOEFF_NORMED)
      loc = np.where(result >= threshold)
      boxes += [(x + left, y + top, w, h) for (x, y) in zip(*loc[::-1])]
    dedup_boxes = deduplicate_boxes(boxes)
    if abort_condition:
      return dedup_boxes
  if use_cache and not (template_path in templates_cache and templates_cache[template_path]):
    info(f"{template_path} not found!")
    templates_cache[template_path] = []
  if not boxes:
    cv2screen = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)
    result = cv2.matchTemplate(cv2screen, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(result >= threshold)
    boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]
    dedup_boxes = deduplicate_boxes(boxes)
    if use_cache:
      templates_cache[template_path] += [(x, y) for (x, y, w, h) in dedup_boxes]
      if abort_condition and templates_cache[template_path]:
        save_template_cache()
  return dedup_boxes

def multi_match_templates(templates, screen=None, threshold=0.85):
  if screen is None:
    screen = ImageGrab.grab(bbox = DEFAULT_BBOX)
  screen = np.array(screen)

  results = {}
  for name, path in templates.items():
    template = cv2.imread(path, cv2.IMREAD_COLOR)
    if template is None:
      results[name] = []
      continue
    if template.shape[2] == 4:
      template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)
    h, w = template.shape[:2]
    if path in templates_cache:
      boxes = []
      for x0, y0 in templates_cache[path]:
        left = max(0, x0 - w)
        top = max(0, y0 - h)
        right = min(screen.shape[1], x0 + w)
        bottom = min(screen.shape[0], y0 + h)
        cv2screen = cv2.cvtColor(screen[top:bottom, left:right, :], cv2.COLOR_RGB2BGR)
        result = cv2.matchTemplate(cv2screen, template, cv2.TM_CCOEFF_NORMED)
        loc = np.where(result >= threshold)
        boxes += [(x + left, y + top, w, h) for (x, y) in zip(*loc[::-1])] 
      '''
      if name == "event" and not boxes:
        for x0, y0 in templates_cache[path]:
          left = max(0, x0 - 5 * w)
          top = 0
          right = min(screen.shape[1], x0 + 5 * w)
          bottom = screen.shape[0] 
          cv2screen = cv2.cvtColor(screen[top:bottom, left:right, :], cv2.COLOR_RGB2BGR)
          result = cv2.matchTemplate(cv2screen, template, cv2.TM_CCOEFF_NORMED)
          loc = np.where(result >= threshold)
          boxes += [(x + left, y + top, w, h) for (x, y) in zip(*loc[::-1])] 
        templates_cache[path] += [(x, y) for (x, y, w, h) in deduplicate_boxes(boxes)]
        if boxes:
          save_template_cache()
      '''
      results[name] = deduplicate_boxes(boxes)
    else:
      cv2screen = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)
      result = cv2.matchTemplate(cv2screen, template, cv2.TM_CCOEFF_NORMED)
      loc = np.where(result >= threshold)
      h, w = template.shape[:2]
      boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]
      results[name] = boxes
      if boxes:
        templates_cache[path] = [(x, y) for (x, y, w, h) in deduplicate_boxes(boxes)]
      else:
        info(f"No matches found for {path}")
    if name != "tazuna" and results[name] and len(results["event"]) != 1:
      if name != "retry":
        results["retry"] = []
      return results

  return results

def save_template_cache():
  info("Dumping cache")
  with open(template_cache_path, 'wb') as file:
    pickle.dump(templates_cache, file)

def deduplicate_boxes(boxes, min_dist=5):
  filtered = []
  for x, y, w, h in boxes:
    cx, cy = x + w // 2, y + h // 2
    if all(abs(cx - (fx + fw // 2)) > min_dist or abs(cy - (fy + fh // 2)) > min_dist
        for fx, fy, fw, fh in filtered):
      filtered.append((x, y, w, h))
  return filtered

def is_btn_active(region, treshold = 150):
  screenshot = capture_region(region)
  grayscale = screenshot.convert("L")
  stat = ImageStat.Stat(grayscale)
  avg_brightness = stat.mean[0]

  # Treshold btn
  return avg_brightness > treshold

def count_pixels_of_color(color_rgb=[117,117,117], region=None, tolerance=2):
    # [117,117,117] is gray for missing energy, we go 2 below and 2 above so that it's more stable in recognition
    if region:
        screen = np.array(ImageGrab.grab(bbox=region))  # (left, top, right, bottom)
    else:
        return -1

    color = np.array(color_rgb, np.uint8)

    # define min/max range ±2
    color_min = np.clip(color - tolerance, 0, 255)
    color_max = np.clip(color + tolerance, 0, 255)

    dst = cv2.inRange(screen, color_min, color_max)
    pixel_count = cv2.countNonZero(dst)
    return pixel_count

def find_color_of_pixel(region=None):
  if region:
    #we can only return one pixel's color here, so we take the x, y and add 1 to them
    region = (region[0], region[1], region[0]+1, region[1]+1)
    screen = np.array(ImageGrab.grab(bbox=region))  # (left, top, right, bottom)
    return screen[0]
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
