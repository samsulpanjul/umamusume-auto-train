# logging tools
import logging
import os
import base64
import zlib
import re
from logging.handlers import RotatingFileHandler

import cv2
import numpy as np
import glob


logging.basicConfig(
    level=logging.DEBUG,
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

# Clean up old debug images
for png_file in glob.glob("logs/*.png"):
    try:
        os.remove(png_file)
    except OSError:
        pass

debug_image_counter = 0
def debug_window(screen, wait_timer=0, x=-1400, y=-100, save_name=None, show_on_screen=False):
  screen = np.array(screen)

  if save_name:
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
