# core/ocr.py
import re
import numpy as np
import pytesseract


class OCR:
    def __init__(self):
        # Path to tesseract.exe
        pytesseract.pytesseract.tesseract_cmd = (
            r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        )

    def extract_text(self, img: np.ndarray) -> str:
        """Extract text"""
        config = r"--oem 3 --psm 6"
        text = pytesseract.image_to_string(img, lang="eng", config=config)
        return text.strip()

    def extract_number(self, img: np.ndarray) -> int:
        """Extract number (digit only)"""

        digit_config = r"--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789"
        text = pytesseract.image_to_string(img, lang="eng", config=digit_config)

        # Cleanup for safety
        digits = re.sub(r"[^\d]", "", text)
        return int(digits) if digits else -1

    def extract_number_discard_first(self, img: np.ndarray) -> int:
        """Extract number (digit only) - Looks for + as well, always discards first character"""

        digit_config = r"--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789+"
        text = pytesseract.image_to_string(img, lang="eng", config=digit_config)

        # Discard first character (often mistakes leading + as 4)
        text = text[1:]

        # Cleanup for safety
        digits = re.sub(r"[^\d]", "", text)
        return int(digits) if digits else -1
