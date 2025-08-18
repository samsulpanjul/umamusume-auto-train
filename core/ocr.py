import easyocr
from PIL import Image, ImageOps, ImageFilter
import numpy as np
import re

reader = easyocr.Reader(["en"], gpu=False)

def preprocess_image(pil_img: Image.Image) -> Image.Image:
  img = pil_img.convert("L")
  img = ImageOps.autocontrast(img)
  img = img.filter(ImageFilter.MedianFilter(size=3))
  return img

def extract_text(pil_img: Image.Image, min_confidence: float = 0.3) -> str:
  img_np = np.array(preprocess_image(pil_img))
  result = reader.readtext(img_np, detail=1)
  texts = [text[1] for text in result if text[2] >= min_confidence]
  raw_text = " ".join(texts)
  cleaned_text = raw_text.strip().replace("\n", "").replace("\r", "")
  return cleaned_text

def extract_number(pil_img: Image.Image, min_confidence: float = 0.5) -> int:
  img_np = np.array(preprocess_image(pil_img))
  result = reader.readtext(img_np, allowlist="0123456789", detail=1)
  texts = [text[1] for text in result if text[2] >= min_confidence]
  joined_text = "".join(texts)
  digits = re.sub(r"[^\d]", "", joined_text)
  if digits:
    return int(digits)
  return -1
