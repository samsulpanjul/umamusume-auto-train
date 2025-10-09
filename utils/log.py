# logging tools
import logging
import os
import base64
import zlib
from logging.handlers import RotatingFileHandler


logging.basicConfig(
    level=logging.DEBUG,
    format="[%(levelname)s] %(message)s"
)

info = logging.info
warning = logging.warning
error = logging.error
debug = logging.debug

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
