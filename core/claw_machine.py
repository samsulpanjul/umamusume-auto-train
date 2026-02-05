import cv2
import utils.device_action_wrapper as device_action
import utils.constants as constants

from utils.log import info, warning, error, debug, debug_window

from utils.screenshot import custom_grabcut, binarize_between_colors, foreground_centroid, enhance_image_for_ocr
from core.ocr import extract_allowed_text
import core.bot as bot

def play_claw_machine(claw_btn_match):
  # decide difficulty:
  difficulty = get_claw_machine_difficulty()
  if bot.use_adb:
    speed_array = [140, 280, 450]
  else:
    speed_array = [140, 300, 500]
  claw_speed = speed_array[difficulty]
  screenshot = device_action.screenshot(region_ltrb = constants.CLAW_MACHINE_PLUSHIE_BBOX)
  debug_window(screenshot, save_name="crop")

  # do grabcut 3 times to remove randomization of cv2 seeds
  image_array = []
  for i in range(3):
    image_array.append(custom_grabcut(screenshot, mask_area=30))
    debug_window(screenshot, save_name="image_array")

  diff = image_array[0]
  for i in range(1, len(image_array)):
    diff = diff & image_array[i]
  debug_window(diff, save_name="grabtest")

  # remove last remaining background element by colors
  min_color=[180,200,150]
  max_color=[240,250,210]
  binarized = binarize_between_colors(diff, min_color=min_color, max_color=max_color)
  debug_window(binarized, save_name="binarized")
  diff = diff &  cv2.cvtColor(binarized, cv2.COLOR_GRAY2BGR)
  debug_window(diff, save_name="grabtest")

  # get center of plushie coords
  bbox = (cx, cy) = foreground_centroid(diff)
  plushie_coords = (constants.CLAW_MACHINE_PLUSHIE_BBOX[0] + cx, constants.CLAW_MACHINE_PLUSHIE_BBOX[1] + cy)
  claw_coords = (constants.GAME_WINDOW_BBOX[0] + 314, constants.GAME_WINDOW_BBOX[1] + 164)
  # distance between plushie and claw
  coord_x_diff = plushie_coords[0] - claw_coords[0]
  seconds = coord_x_diff / claw_speed

  # coords to hold btn on
  x, y, w, h = claw_btn_match
  cx = x + w // 2
  cy = y + h // 2

  info(f"Claw machine press duration: {seconds}, coord_x_diff: {coord_x_diff}, claw_speed {claw_speed}")
  device_action.long_press(mouse_x_y=(cx, cy), duration=seconds)

def get_claw_machine_difficulty():
  difficulty_levels = ["NORMAL", "FAST", "SUPER"]
  image = device_action.screenshot(region_ltrb = constants.CLAW_MACHINE_SPEED_BBOX)
  enhanced = enhance_image_for_ocr(image, resize_factor=4, binarize_threshold=None)
  speed_text = extract_allowed_text(enhanced, allowlist="NORMALFSTUPE") #NORMAL, FAST, SUPER
  difficulty_index = difficulty_levels.index(speed_text)
  return difficulty_index
