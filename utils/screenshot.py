from PIL import Image, ImageEnhance
import mss
import numpy as np
import cv2
import utils.device_action_wrapper as device_actions
import core.bot as bot
from utils.log import debug_window, debug, args


def enhanced_screenshot(region=(0, 0, 1920, 1080), debug_flag=False) -> Image.Image:
  if args.device_debug:
    debug_flag = True
  pil_img = device_actions.screenshot(region_xywh=region)
  if debug_flag:
    debug_window(pil_img, save_name="enhanced_screenshot")
  pil_img = Image.fromarray(pil_img)
  pil_img = pil_img.resize((pil_img.width * 2, pil_img.height * 2), Image.BICUBIC)
  if debug_flag:
    debug_window(pil_img, save_name="enhanced_screenshot_resized")
  pil_img = pil_img.convert("L")
  if debug_flag:
    debug_window(pil_img, save_name="enhanced_screenshot_contrast")
  pil_img = ImageEnhance.Contrast(pil_img).enhance(1.5)
  if debug_flag:
    debug_window(pil_img, save_name="enhanced_screenshot_contrast_enhanced")  

  return pil_img

def enhance_image_for_ocr(image, resize_factor=3, binarize_threshold=250, debug_flag=False):
  if args.device_debug:
    debug_flag = True
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
  if debug_flag:
    debug(f"Scaled image")
    debug_window(scaled, save_name="scaled_ocr")
  if not binarize_threshold:
    return Image.fromarray(scaled)
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

def binarize_between_colors(img, min_color=[0,0,0], max_color=[255,255,255], enable_debug=False):
  if args.device_debug:
    enable_debug = True
  min_color = np.array(min_color)
  if enable_debug:
    debug(f"Binarize between colors: min_color: {min_color}, max_color: {max_color}")
  max_color = np.array(max_color)
  if enable_debug:
    debug(f"Binarize between colors: max_color: {max_color}")
  mask = cv2.inRange(img, min_color, max_color)
  if enable_debug:
    debug(f"Binarize between colors: mask: {mask}")

  # invert mask so text becomes black on white
  binary = cv2.bitwise_not(mask)
  if enable_debug:
    debug(f"Binarize between colors: binary: {binary}")
  return binary

def clean_noise(img, enable_debug=False):
  if args.device_debug:
    enable_debug = True
  kernel = np.ones((2, 2), np.uint8)
  img = cv2.dilate(img, kernel, iterations=1)
  if enable_debug:
    debug_window(img, save_name="clean_noise_dilated")
  reduced = cv2.erode(img, kernel, iterations=2)
  if enable_debug:
    debug_window(reduced, save_name="clean_noise_eroded")
  restored = cv2.dilate(reduced, kernel, iterations=1, anchor=(-1, -1))
  if enable_debug:
    debug_window(restored, save_name="clean_noise_dilated")
  clean = cv2.GaussianBlur(restored, (3,3), 0)
  if enable_debug:
    debug_window(clean, save_name="clean_noise_blurred")
  return clean

ZERO_IMAGE = np.zeros((5, 5), dtype=np.uint8)
def crop_after_plus_component(img, pad_right=5, min_width=20, plus_length=14, bar_width=1, enable_debug=False):
  global ZERO_IMAGE
  if args.device_debug:
    enable_debug = True
  if enable_debug:
    debug(f"crop_after_plus_component: Starting with image shape {img.shape}, pad_right={pad_right}, plus_length={plus_length}")
  n, labels, stats, centroids = cv2.connectedComponentsWithStats(img)
  if enable_debug:
    debug(f"crop_after_plus_component: Found {n} connected components")
  extension_width = int(plus_length // 2)
  if n > 1:
    plus_sign = None
    for i in range(1, n):
      left, top, width, height, area = stats[i]
      if enable_debug:
        component_img = img[top:top+height, left:left+width]
        debug_window(component_img, save_name=f"component_{i}")
      midpoint_x = int(centroids[i][0])
      midpoint_y = int(centroids[i][1])

      # Check 15 pixels centered on midpoint (7 left, 7 right), across 3 rows (above, at, below midpoint)
      # Check for white pixels in a 3x14 area around the midpoint
      start_x = max(0, midpoint_x - extension_width)
      end_x = min(img.shape[1], midpoint_x + extension_width)

      has_horizontal_bar = False
      for y_offset in range(-bar_width, bar_width + 1):
        check_y = midpoint_y + y_offset
        if 0 <= check_y < img.shape[0]:
          row = img[check_y, start_x:end_x]
          if np.all(row == 255):
            has_horizontal_bar = True
            break

      # Check for white pixels in a 14x3 area around the midpoint
      start_y = max(0, midpoint_y - extension_width)
      end_y = min(img.shape[0], midpoint_y + extension_width)

      has_vertical_bar = False
      for x_offset in range(-bar_width, bar_width + 1):
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
          debug(f"crop_after_plus_component: Found plus sign at component {i}, position ({left}, {top}), size {width}x{height}")

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
      if enable_debug:
        debug(f"crop_after_plus_component: Cropping from x={crop_x_start} to x={crop_x_end}, cropped shape {cropped_image.shape}")
    else:
      if enable_debug:
        debug(f"crop_after_plus_component: No plus sign found, returning zero image")
      return ZERO_IMAGE

    if cropped_image.shape[1] < 10:
      if enable_debug:
        debug(f"crop_after_plus_component: Cropped image width {cropped_image.shape[1]} < 10, returning zero image")
      return ZERO_IMAGE

  else:
    if enable_debug:
      debug(f"crop_after_plus_component: No components found (n <= 1), returning zero image")
    return ZERO_IMAGE

  if enable_debug:
    debug(f"crop_after_plus_component: Successfully returning cropped image with shape {cropped_image.shape}")
  return cropped_image

def are_screenshots_same(screenshot1: np.ndarray, screenshot2: np.ndarray, diff_threshold=10):
  diff = cv2.absdiff(screenshot1, screenshot2)
  debug(f"Diff: {np.mean(diff)}, diff_threshold: {diff_threshold}")
  if np.mean(diff) > diff_threshold:
    return False
  return True

def custom_grabcut(image, enable_debug=False):
  if args.device_debug:
    enable_debug = True
  # create a simple mask image similar
  # to the loaded image, with the 
  # shape and return type
  mask = np.zeros(image.shape[:2], np.uint8)
  
  # specify the background and foreground model
  # using numpy the array is constructed of 1 row
  # and 65 columns, and all array elements are 0
  # Data type for the array is np.float64 (default)
  backgroundModel = np.zeros((1, 65), np.float64)
  foregroundModel = np.zeros((1, 65), np.float64)
  
  # define the Region of Interest (ROI)
  # as the coordinates of the rectangle
  # where the values are entered as
  # (startingPoint_x, startingPoint_y, width, height)
  # these coordinates are according to the input image
  # it may vary for different images
  rectangle = (2, 2, image.shape[1]-4, image.shape[0]-4)
  
  # apply the grabcut algorithm with appropriate
  # values as parameters, number of iterations = 3 
  # cv2.GC_INIT_WITH_RECT is used because
  # of the rectangle mode is used 
  cv2.grabCut(image, mask, rectangle,  
              backgroundModel, foregroundModel,
              3, cv2.GC_INIT_WITH_RECT)
  
  # In the new mask image, pixels will 
  # be marked with four flags 
  # four flags denote the background / foreground 
  # mask is changed, all the 0 and 2 pixels 
  # are converted to the background
  # mask is changed, all the 1 and 3 pixels
  # are now the part of the foreground
  # the return type is also mentioned,
  # this gives us the final mask
  mask2 = np.where((mask == 2)|(mask == 0), 0, 1).astype('uint8')
  
  # The final mask is multiplied with 
  # the input image to give the segmented image.
  image_segmented = image * mask2[:, :, np.newaxis]
  
  # output segmented image with colorbar
  if enable_debug:
    debug_window(image, save_name="grabcut_original")
    debug_window(image_segmented, save_name="grabcut_segmented")
  return image_segmented
