import easyocr
from PIL import Image
import numpy as np
import re
from utils.log import debug, warning
import core.config as config

reader = None
reader_gpu_enabled = None

def get_reader():
  global reader, reader_gpu_enabled
  wanted_gpu = bool(getattr(config, "OCR_USE_GPU", False))
  if reader is not None and reader_gpu_enabled == wanted_gpu:
    return reader

  try:
    reader = easyocr.Reader(["en"], gpu=wanted_gpu)
    reader_gpu_enabled = wanted_gpu
    debug(f"OCR reader initialized with gpu={wanted_gpu}.")
  except Exception as e:
    warning(f"Failed to initialize OCR reader with gpu={wanted_gpu}: {e}. Falling back to CPU.")
    reader = easyocr.Reader(["en"], gpu=False)
    reader_gpu_enabled = False

  return reader

def extract_text(pil_img: Image.Image, use_recognize=False, allowlist=None, threshold=None) -> str:
  reader = get_reader()
  img_np = np.array(pil_img)
  if allowlist is None:
    allowlist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-!.,'#? "
  if use_recognize:
    if threshold is not None:
      result = reader.recognize(img_np, allowlist=allowlist, text_threshold=threshold)
    else:
      result = reader.recognize(img_np, allowlist=allowlist)
  else:
    if threshold is not None:
      result = reader.readtext(img_np, allowlist=allowlist, text_threshold=threshold)
    else:
      result = reader.readtext(img_np, allowlist=allowlist)
  texts = sort_ocr_result(result)
  return texts

def extract_number(pil_img: Image.Image, allowlist="0123456789", threshold=0.8) -> int:
  reader = get_reader()
  img_np = np.array(pil_img)
  result = reader.readtext(img_np, allowlist=allowlist, text_threshold=threshold)
  texts = [item[1] for item in sorted(result, key=lambda x: x[0][0][0])]
  joined_text = "".join(texts)

  digits = re.sub(r"[^\d]", "", joined_text)

  if digits:
    return int(digits)
  return -1

def extract_allowed_text(pil_img: Image.Image, allowlist="0123456789") -> int:
  reader = get_reader()
  img_np = np.array(pil_img)
  result = reader.readtext(img_np, allowlist=allowlist)
  texts = [item[1] for item in sorted(result, key=lambda x: x[0][0][0])]
  return " ".join(texts)

def sort_ocr_result(results):
  sorted_results = sorted(results, key=lambda x: x[0][0][1])
  if len(sorted_results) == 0:
    return ""
  previous_item = sorted_results[0]

  rows = [[]]
  row_number = 0
  for item in sorted_results:
    if item == previous_item:
      rows[row_number].append(item)
      continue
    tolerance = abs(previous_item[0][0][1] - previous_item[0][2][1]) * 0.6
    if item[0][0][1] < (previous_item[0][0][1] + tolerance) and item[0][0][1] > (previous_item[0][0][1] - tolerance):
      rows[row_number].append(item)
    else:
      row_number += 1
      rows.append([])
      rows[row_number].append(item)
    previous_item = item

  final_text = ""
  for row in rows:
    sorted_row = sorted(row, key=lambda x: x[0][0][0])
    text = " ".join([item[1] for item in sorted_row])
    final_text += text + " "
  final_text = re.sub(r"\s+", " ", final_text).strip()
  return final_text.strip()
