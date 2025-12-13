# logging tools
import logging
import os
import base64
import zlib
import re
import argparse
import sys
from logging.handlers import RotatingFileHandler

import cv2
import numpy as np
import glob

# read web/version.txt
with open("version.txt", "r") as f:
  VERSION = f.read().strip()
print(f"[DEBUG] Bot version: {VERSION}")

parser = argparse.ArgumentParser()   
parser.add_argument('--debug', nargs='?', const=0, type=int, default=None, 
                    help='Enable debug logging with optional level (default: 1)')
parser.add_argument('--save-images', action='store_true', help='Enable saving debug images')
parser.add_argument('--limit-turns', type=int, help='Limit the number of turns to run')
parser.add_argument('--dry-run-turn', action='store_true', help='Dry run a single turn')
parser.add_argument('--device-debug', action='store_true', help='Enable device debug logging')
parser.add_argument('--use-adb', type=str, help='Specify ADB device string')
args, unknown = parser.parse_known_args()

if args.debug is not None:
  log_level = logging.DEBUG
  print(f"[DEBUG] Setting log level to DEBUG")
  if args.debug > 0:
    if not args.save_images:
      print(f"[DEBUG] Setting save images to True")
      args.save_images = True
  if args.debug > 1:
    if not args.device_debug:
      print(f"[DEBUG] Setting device debug to True")
      args.device_debug = True
  if args.debug > 2:
    if not args.limit_turns:
      print(f"[DEBUG] Setting limit turns to {12 - args.debug}")
      args.limit_turns = 12 - args.debug # level 3 means 9 turns, level 10 means 2 turns, level 11 is dry run (no action)
  if args.debug > 10:
    if not args.dry_run_turn:
      print(f"[DEBUG] Setting dry run turn to True")
      args.dry_run_turn = True
else:
  log_level = logging.INFO
  print(f"[DEBUG] Setting log level to INFO")

# Store save-images flag globally for debug_window function
SAVE_DEBUG_IMAGES = args.save_images

logging.basicConfig(
  level=log_level,
  format="[%(levelname)s] %(message)s"
)

def _format_floats_in_string(s):
  """Format floats in string to 2 decimal places using pure regex."""
  if not isinstance(s, str):
    s = str(s)
  # Match: digits, dot, 1-2 digits, then any additional digits, comma
  return re.sub(r'(\d+\.\d{1,2})\d*,', r'\1,', s)

# Wrap logging functions to format floats
def info(message, *args, **kwargs):
  logging.info(_format_floats_in_string(message), *args, **kwargs)

def warning(message, *args, **kwargs):
  logging.warning(_format_floats_in_string(message), *args, **kwargs)

def error(message, *args, **kwargs):
  logging.error(_format_floats_in_string(message), *args, **kwargs)

def debug(message, *args, **kwargs):
  logging.debug(_format_floats_in_string(message), *args, **kwargs)

def string_to_zlib_base64(input_string):
  compressed_data = zlib.compress(input_string.encode('utf-8'))
  return base64.b64encode(compressed_data).decode('utf-8')

def zlib_base64_to_string(encoded_string):
  compressed_data = base64.b64decode(encoded_string)
  return zlib.decompress(compressed_data).decode('utf-8')

def log_encoded(string_to_encode, unencoded_prefix="Encoded: "):
  base64 = string_to_zlib_base64(string_to_encode)
  debug(f"{unencoded_prefix}{base64}")

log_dir = os.path.join(os.getcwd(), "logs")
os.makedirs(log_dir, exist_ok=True)

handler = RotatingFileHandler(
  os.path.join(log_dir, "log.txt"),
  maxBytes=1_000_000,
  backupCount=10,
  encoding="utf-8"
)

logging.getLogger().addHandler(handler)

# Suppress PIL/Pillow debug messages (PNG chunk logging)
logging.getLogger('PIL').setLevel(logging.WARNING)

# Clean up old debug images
for png_file in glob.glob("logs/*.png"):
  try:
    os.remove(png_file)
  except OSError:
    pass

debug_image_counter = 0
def debug_window(screen, wait_timer=0, x=-1400, y=-100, save_name=None, show_on_screen=False):
  screen = np.array(screen)

  if save_name and SAVE_DEBUG_IMAGES:
  # Save with global counter to avoid overwriting
    global debug_image_counter
    base_name = save_name.rsplit('.', 1)[0]  # Remove extension if present
    cv2.imwrite(f"logs/{debug_image_counter}_{base_name}.png", screen)
    debug_image_counter += 1

  if show_on_screen:
    cv2.namedWindow("image")
    cv2.moveWindow("image", x, y)
    cv2.imshow("image", screen)
    cv2.waitKey(wait_timer)
