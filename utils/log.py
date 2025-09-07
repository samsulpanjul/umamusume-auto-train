# logging tools
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="[%(levelname)s] %(message)s"
)

info = logging.info
warning = logging.warning
error = logging.error
debug = logging.debug
