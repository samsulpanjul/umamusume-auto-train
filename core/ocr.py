import re
import numpy as np
from PIL import Image
import easyocr
from typing import List, Optional, Union
from utils.log import info, debug, warning, error

# Global EasyOCR reader instance
try:
    reader = easyocr.Reader(["en"], gpu=False)
    info("[OCR] EasyOCR reader initialized successfully (CPU mode).")
except Exception as e:
    reader = None
    error(f"[OCR] Failed to initialize EasyOCR: {e}")


def extract_text(pil_img: Image.Image, detail: bool = False) -> Union[str, List[str]]:
    """
    Extract text from a PIL image using EasyOCR.

    Args:
        pil_img (Image.Image): Input PIL image.
        detail (bool): If True, return list of individual text segments.
                       If False, return a single concatenated string.

    Returns:
        str | List[str]: Extracted text or list of segments.
    """
    if reader is None:
        error("[OCR] Reader not initialized. Cannot perform OCR.")
        return [] if detail else ""

    try:
        img_np = np.array(pil_img)
        result = reader.readtext(img_np)
        texts = [text[1] for text in result]

        debug(f"[OCR] Extracted texts: {texts}")

        return texts if detail else " ".join(texts)

    except Exception as e:
        error(f"[OCR] Error during text extraction: {e}")
        return [] if detail else ""


def extract_number(
    pil_img: Image.Image,
    fallback: int = -1,
    max_digits: Optional[int] = None
) -> int:
    """
    Extract the first integer found in a PIL image.

    Args:
        pil_img (Image.Image): Input PIL image.
        fallback (int): Value to return if no number is found.
        max_digits (int | None): If provided, truncate number to this length.

    Returns:
        int: Extracted integer, or fallback if none found.
    """
    if reader is None:
        error("[OCR] Reader not initialized. Cannot extract numbers.")
        return fallback

    try:
        img_np = np.array(pil_img)
        result = reader.readtext(img_np, allowlist="0123456789")
        texts = [text[1] for text in result]
        joined_text = "".join(texts)

        digits = re.sub(r"[^\d]", "", joined_text)

        if digits:
            if max_digits and len(digits) > max_digits:
                digits = digits[:max_digits]
                warning(f"[OCR] Truncated extracted number to {max_digits} digits: {digits}")

            number = int(digits)
            debug(f"[OCR] Extracted number: {number}")
            return number

        warning("[OCR] No digits found in image.")
        return fallback

    except Exception as e:
        error(f"[OCR] Error during number extraction: {e}")
        return fallback
