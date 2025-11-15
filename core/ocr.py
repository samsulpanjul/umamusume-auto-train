import easyocr
from PIL import Image
import numpy as np
import re
from typing import List, Tuple
from utils.screenshot import enhance_image_for_ocr_2, enhance_image_for_ocr

reader = easyocr.Reader(["en"], gpu=True)

def extract_text(pil_img: Image.Image) -> str:
  img_np = np.array(pil_img)
  result = reader.readtext(img_np)
  texts = [text[1] for text in result]
  return " ".join(texts)

def extract_number(pil_img: Image.Image) -> int:
  img_np = np.array(pil_img)
  result = reader.readtext(img_np, allowlist="0123456789")
  texts = [text[1] for text in result]
  joined_text = "".join(texts)

  digits = re.sub(r"[^\d]", "", joined_text)

  if digits:
    return int(digits)
  
  return -1

def get_text_results(processed_img):
  img_np = np.array(processed_img)
  results = reader.readtext(img_np)
  # Fallback to recognize if readtext returns nothing
  if not results:
    try:
      raw_results = reader.recognize(img_np)
      # Normalize to (bbox, text, confidence)
      return [(r[0], r[1], float(r[2])) for r in raw_results]
    except AttributeError:
      return []
  return results

def extract_text_improved(pil_img: Image.Image) -> str:
  """
    Heavier than other extract text but more accurate
  """
  scale_try = [1.0, 2.0, 3.0]
  all_results: List[List[Tuple[List[List[float]], str, float]]] = []

  # try raw image first
  results = get_text_results(pil_img)
  if results:
      all_results.append(results)
  
  for scale in scale_try:
    proc_img = enhance_image_for_ocr(pil_img, scale)
    results = get_text_results(proc_img)
    if results:
      all_results.append(results)

    # user different enhancer
    proc_img = enhance_image_for_ocr_2(pil_img, scale)
    results = get_text_results(proc_img)
    if results:
      all_results.append(results)

  # Pick the result array with the highest total confidence
  if all_results:
    best_result_array = max(all_results, key=lambda arr: sum(r[2] for r in arr))
    final_text = " ".join(r[1] for r in best_result_array)

    # Normalize spaces and strip extra whitespace
    final_text = " ".join(final_text.split())
    return final_text

  return ""