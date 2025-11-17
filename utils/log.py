# logging tools
import logging
import os
import base64
import zlib
import re
from logging.handlers import RotatingFileHandler


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
