import easyocr
from PIL import Image
import numpy as np
import re

reader = easyocr.Reader(["en"], gpu=False)

def extract_text(pil_img: Image.Image, use_recognize=False, allowlist=None) -> str:
  img_np = np.array(pil_img)
  if allowlist is None:
    allowlist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- "
  if use_recognize:
    result = reader.readtext(img_np, allowlist=allowlist)
  else:
    result = reader.readtext(img_np, allowlist=allowlist)
  texts = [text[1] for text in result]
  return " ".join(texts)

def extract_number(pil_img: Image.Image, allowlist="0123456789", threshold=0.7) -> int:
  img_np = np.array(pil_img)
  result = reader.readtext(img_np, allowlist=allowlist, text_threshold=threshold)
  texts = [text[1] for text in result]
  joined_text = "".join(texts)

  digits = re.sub(r"[^\d]", "", joined_text)

  if digits:
    return int(digits)
  return -1

def extract_allowed_text(pil_img: Image.Image, allowlist="0123456789") -> int:
  img_np = np.array(pil_img)
  result = reader.readtext(img_np, allowlist=allowlist)
  texts = [text[1] for text in result]
  return " ".join(texts)
