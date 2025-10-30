from PIL import Image, ImageEnhance
import mss
import numpy as np
import cv2

def enhanced_screenshot(region=(0, 0, 1920, 1080)) -> Image.Image:
  with mss.mss() as sct:
    monitor = {
      "left": region[0],
      "top": region[1],
      "width": region[2],
      "height": region[3]
    }
    img = sct.grab(monitor)
    img_np = np.array(img)
    img_rgb = img_np[:, :, :3][:, :, ::-1]
    pil_img = Image.fromarray(img_rgb)

  pil_img = pil_img.resize((pil_img.width * 2, pil_img.height * 2), Image.BICUBIC)
  pil_img = pil_img.convert("L")
  pil_img = ImageEnhance.Contrast(pil_img).enhance(1.5)

  return pil_img

def capture_region(region=(0, 0, 1920, 1080)) -> Image.Image:
  with mss.mss() as sct:
    monitor = {
      "left": region[0],
      "top": region[1],
      "width": region[2],
      "height": region[3]
    }
    img = sct.grab(monitor)
    img_np = np.array(img)
    img_rgb = img_np[:, :, :3][:, :, ::-1]
    return Image.fromarray(img_rgb)

def enhance_image_for_ocr(image: Image.Image, scale: float = 3.0):
  img = np.array(image)
  img = np.pad(img, ((0,0), (0,2), (0,0)), mode='constant', constant_values=150)

  gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

  # Threshold: bright → black text
  _, binary = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)

  # Scale for OCR
  scaled = cv2.resize(binary, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

  # Invert: black→white, white→black
  inv = cv2.bitwise_not(scaled)

  # Minimal dilation to grow black pixels (which are now white)
  kernel = np.array([[1,1,1],
                     [1,1,1],
                     [1,1,1]], dtype=np.uint8)
  dilated = cv2.dilate(inv, kernel, iterations=1)

  # Invert back: now black text is slightly bolder
  bolded = cv2.bitwise_not(dilated)
  bolded = cv2.GaussianBlur(bolded, (5,5), 0)

  return Image.fromarray(bolded)

def enhance_image_for_ocr_2(pil_img: Image.Image, scale: float) -> np.ndarray:
  """
  Enhance the input PIL image for OCR:
  - Isolate yellow color
  - Anti-blur resizing
  - Stroke bolding
  - Noise cleanup and sharpening
  """
  # Convert PIL to OpenCV BGR
  cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

  # Convert to YCrCb to isolate yellow color
  ycrcb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2YCrCb)
  _, binary = cv2.threshold(ycrcb[:, :, 2], 140, 255, cv2.THRESH_BINARY_INV)

  # --- Anti-blur trick: shrink then upscale ---
  small = cv2.resize(binary, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
  cv_img = cv2.resize(small, None, fx=scale*2, fy=scale*2, interpolation=cv2.INTER_CUBIC)

  # Invert for morphological stroke growth
  inv = cv2.bitwise_not(cv_img)

  # --- Stroke bolding ---
  kernel = np.ones((3,3), np.uint8)
  cv_img = cv2.dilate(inv, kernel, iterations=1)

  # Invert back to text-black
  cv_img = cv2.bitwise_not(cv_img)

  # --- Cleanup noise + sharpen edges ---
  cv_img = cv2.GaussianBlur(cv_img, (5,5), 0)
  cv_img = cv2.medianBlur(cv_img, 3)

  return Image.fromarray(cv_img)
