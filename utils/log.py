# logging tools
import logging
import os
from logging.handlers import RotatingFileHandler

logging.basicConfig(
    level=logging.DEBUG,
    format="[%(levelname)s] %(message)s"
)

info = logging.info
warning = logging.warning
error = logging.error
debug = logging.debug

log_dir = os.path.join("..", "logs")
os.makedirs(log_dir, exist_ok=True)

handler = RotatingFileHandler(
    os.path.join(log_dir, "log.txt"),
    maxBytes=1_000_000,
    backupCount=10,
    encoding="utf-8"
)

logging.getLogger().addHandler(handler)
