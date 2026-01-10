import cv2
import numpy as np
from PIL import ImageGrab, ImageStat

from utils.log import info, warning, error, debug
from utils.screenshot import capture_region

import utils.constants as constants

def match_template(template_path, region=None, threshold=0.85):
  # Get screenshot
  if region:
    # region is expected to be (left, top, right, bottom)
    screen = np.array(ImageGrab.grab(bbox=region))
  else:
    screen = np.array(ImageGrab.grab())
  
  # Convert to BGR
  screen = cv2.cvtColor(screen, cv2.COLOR_RGB2BGR)

  # Resize screen to 1080p basis for matching
  scale = constants.get_screen_scale()
  if scale != 1.0:
    h, w = screen.shape[:2]
    # We want to emulate 1920x1080 environment.
    # Current width w corresponds to 'scale' * 1920 (roughly)
    # So we strictly resize by 1/scale
    new_w = int(w / scale)
    new_h = int(h / scale)
    if new_w > 0 and new_h > 0:
      screen = cv2.resize(screen, (new_w, new_h), interpolation=cv2.INTER_AREA)
    else:
      # Found empty/too small region? fallback
      pass

  # Load template
  template = cv2.imread(template_path, cv2.IMREAD_COLOR)  # safe default
  if template is None:
      return []
      
  if template.shape[2] == 4:
    template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)
  
  result = cv2.matchTemplate(screen, template, cv2.TM_CCOEFF_NORMED)
  loc = np.where(result >= threshold)

  h, w = template.shape[:2]
  
  # Logic: The match was found in the RESIZED (1080p) image.
  # We need to return coordinates in the ORIGINAL (e.g. 2K) image.
  # So we multiply x, y, w, h by scale.
  
  boxes = []
  for (x, y) in zip(*loc[::-1]):
      boxes.append((
          int(x * scale), 
          int(y * scale), 
          int(w * scale), 
          int(h * scale)
      ))

  # If we had a region offset, we theoretically should add it back if the region was 
  # handled externally. But here ImageGrab took a crop. 
  # The coordinates returned are LOCAL to the crop.
  # The callers of match_template usually expect LOCAL coordinates if they passed a region, 
  # OR global coordinates if they passed region? 
  # Looking at execute.py, multi_match_templates expects global coords usually, 
  # but here match_template takes region.
  # Standard behavior: If I search IN a region, I usually want coordinates relative to the detected region 
  # or I want absolute coordinates. 
  # Pillow ImageGrab with bbox returns an image. matchTemplate finds coords in that image.
  # If we want absolute coordinates, we must add region[0], region[1] (left, top). 
  # BUT the original code didn't do that:
  #   boxes = [(x, y, w, h) for (x, y) in zip(*loc[::-1])]
  # So it returned LOCAL coordinates relative to the crop. 
  # I will preserve that behavior. The scale multiplication accounts for the resizing of the crop.
  
  return deduplicate_boxes(boxes)

def multi_match_templates(templates, screen=None, threshold=0.85):
  if screen is None:
    screen = ImageGrab.grab()
    
  screen_np = np.array(screen)
  screen_bgr = cv2.cvtColor(screen_np, cv2.COLOR_RGB2BGR)
  
  # Resize logic
  scale = constants.get_screen_scale()
  original_h, original_w = screen_bgr.shape[:2]
  
  if scale != 1.0:
      new_w = int(original_w / scale)
      new_h = int(original_h / scale)
      screen_for_match = cv2.resize(screen_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)
  else:
      screen_for_match = screen_bgr

  results = {}
  for name, path in templates.items():
    template = cv2.imread(path, cv2.IMREAD_COLOR)
    if template is None:
      results[name] = []
      continue
    if template.shape[2] == 4:
      template = cv2.cvtColor(template, cv2.COLOR_BGRA2BGR)

    result = cv2.matchTemplate(screen_for_match, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(result >= threshold)
    h_tpl, w_tpl = template.shape[:2]
    
    # Scale back to original screen size
    boxes = []
    for (x, y) in zip(*loc[::-1]):
        boxes.append((
            int(x * scale),
            int(y * scale),
            int(w_tpl * scale),
            int(h_tpl * scale)
        ))
        
    results[name] = boxes
  return results

def deduplicate_boxes(boxes, min_dist=5):
  # Scale min_dist too? Maybe not critical, 5px is small.
  # But if we upscale, 5px becomes 5*scale px.
  # Actually min_dist is in the return coordinate space (High Res), so 5 might be too small for 4K.
  # But let's leave it for now.
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
