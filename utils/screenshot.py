from PIL import Image, ImageEnhance
import mss
import numpy as np
import cv2
import utils.device_action_wrapper as device_actions
import core.bot as bot
from utils.log import debug_window, debug


def enhanced_screenshot(region=(0, 0, 1920, 1080)) -> Image.Image:
  pil_img = device_actions.screenshot(region_xywh=region)
  pil_img = Image.fromarray(pil_img)
  pil_img = pil_img.resize((pil_img.width * 2, pil_img.height * 2), Image.BICUBIC)
  pil_img = pil_img.convert("L")
  pil_img = ImageEnhance.Contrast(pil_img).enhance(1.5)

  return pil_img

def enhance_image_for_ocr(image, resize_factor=3, binarize_threshold=250, debug_flag=False):
  img = np.array(image)
  #img = np.pad(img, ((0,0), (0,2), (0,0)), mode='constant', constant_values=150)
  if debug_flag:
    debug(f"Enhance image for OCR")
    debug_window(img, save_name="input_ocr")
  gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
  if debug_flag:
    debug(f"Gray image")
    debug_window(gray, save_name="gray_ocr")
  if binarize_threshold:
    _, binary = cv2.threshold(gray, binarize_threshold, 255, cv2.THRESH_BINARY_INV)
  else:
    binary = gray
  if debug_flag:
    debug(f"Binary image")
    debug_window(binary, save_name="binary_ocr")
  height, width = binary.shape
  scaled = cv2.resize(binary, (width*resize_factor, height*resize_factor), interpolation=cv2.INTER_CUBIC)
  if not binarize_threshold:
    return Image.fromarray(scaled)
  if debug_flag:
    debug(f"Scaled image")
    debug_window(scaled, save_name="scaled_ocr")
  inv = cv2.bitwise_not(scaled)
  if debug_flag:
    debug(f"Inverted image")
    debug_window(inv, save_name="inverted_ocr")
  kernel = np.array([[1,1,1],
                     [1,1,1],
                     [1,1,1]], dtype=np.uint8)
  dilated = cv2.dilate(inv, kernel, iterations=1)
  if debug_flag:
    debug(f"Dilated image")
    debug_window(dilated, save_name="dilated_ocr")
  bolded = cv2.bitwise_not(dilated)
  bolded = cv2.GaussianBlur(bolded, (5,5), 0)
  if debug_flag:
    debug(f"Bolded image")
    debug_window(bolded, save_name="bolded_ocr")
  final_img = Image.fromarray(bolded)

  return final_img

def binarize_between_colors(img, min_color=[0,0,0], max_color=[255,255,255]):
  min_color = np.array(min_color)
  max_color = np.array(max_color)
  mask = cv2.inRange(img, min_color, max_color)

  # invert mask so text becomes black on white
  binary = cv2.bitwise_not(mask)

  return binary

def clean_noise(img, enable_debug=True):
  kernel = np.ones((2, 2), np.uint8)
  img = cv2.dilate(img, kernel, iterations=1)
  if enable_debug:
    debug_window(img, save_name="clean_noise_dilated")
  reduced = cv2.erode(img, kernel, iterations=2)
  if enable_debug:
    debug_window(reduced, save_name="clean_noise_eroded")
  restored = cv2.dilate(reduced, kernel, iterations=1)
  if enable_debug:
    debug_window(restored, save_name="clean_noise_dilated")
  clean = cv2.GaussianBlur(restored, (3,3), 0)
  if enable_debug:
    debug_window(clean, save_name="clean_noise_blurred")
  return clean

ZERO_IMAGE = np.zeros((5, 5), dtype=np.uint8)
def crop_after_plus_component(img, pad_right=5, min_width=20, enable_debug=False):
  global ZERO_IMAGE

  n, labels, stats, _ = cv2.connectedComponentsWithStats(img)
  if n > 1:
    plus_sign = None
    for i in range(1, n):
      left, top, width, height, area = stats[i]
      midpoint_x = left + width // 2
      midpoint_y = top + height // 2

      # Check 15 pixels centered on midpoint (7 left, 7 right), across 3 rows (above, at, below midpoint)
      start_x = max(0, midpoint_x - 7)
      end_x = min(img.shape[1], midpoint_x + 8)

      has_horizontal_bar = False
      # Check for white pixels in a 3x15 area around the midpoint
      for y_offset in [-1, 0, 1]:
        check_y = midpoint_y + y_offset
        if 0 <= check_y < img.shape[0]:
          row = img[check_y, start_x:end_x]
          if np.all(row == 255):
            has_horizontal_bar = True
            break

      # Check for white pixels in a 15x3 area around the midpoint
      start_y = max(0, midpoint_y - 7)
      end_y = min(img.shape[0], midpoint_y + 8)

      has_vertical_bar = False
      for x_offset in [-1, 0, 1]:
        check_x = midpoint_x + x_offset
        if 0 <= check_x < img.shape[1]:
          col = img[start_y:end_y, check_x]
          if np.all(col == 255):
            has_vertical_bar = True
            break

      # If component has both horizontal and vertical bars, it's a plus sign!
      if has_horizontal_bar and has_vertical_bar:
        plus_sign = i
        left, top, width, height, area = stats[i]

    if enable_debug:
      for i, row in enumerate(img):
        processed_row = ''.join('1' if val == 255 else '0' for val in row)
        print(f"  {processed_row}")

    if plus_sign is not None:
      left, top, width, height, area = stats[plus_sign]
      crop_x_start = left + width + pad_right
      # Find the rightmost component by sorting components by right edge (left + width)
      component_right_edges = [(i, stats[i][0] + stats[i][2]) for i in range(1, n)]
      component_right_edges.sort(key=lambda x: x[1])
      rightmost_component_idx = component_right_edges[-1][0]
      rightmost_left, rightmost_top, rightmost_width, rightmost_height, rightmost_area = stats[rightmost_component_idx]
      crop_x_end = rightmost_left + rightmost_width + 2
      if crop_x_end > img.shape[1]:
        crop_x_end = img.shape[1]
      cropped_image = img[:, crop_x_start:crop_x_end]
    else:
      return ZERO_IMAGE

    if cropped_image.shape[1] < 10:
      return ZERO_IMAGE

    if enable_debug:
      for i, row in enumerate(cropped_image):
        processed_row = ''.join('1' if val == 255 else '0' for val in row)
        print(f"  {processed_row}")

  else:
    return ZERO_IMAGE

  return cropped_image
