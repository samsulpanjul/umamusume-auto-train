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

def enhance_numbers_for_ocr(image=None):
  if image == None:
    return False
  img = np.array(image)
  img = np.pad(img, ((0,0), (0,2), (0,0)), mode='constant', constant_values=150)

  gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

  # Threshold: bright → black text
  _, binary = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)

  # Scale for OCR
  height, width = binary.shape
  scaled = cv2.resize(binary, (width*3, height*3), interpolation=cv2.INTER_CUBIC)
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

  final_img = Image.fromarray(bolded)

  return final_img

def binarize_between_colors(img, min_color=[0,0,0], max_color=[255,255,255]):
  min_color = np.array(min_color)
  max_color = np.array(max_color)
  mask = cv2.inRange(img, min_color, max_color)

  # invert mask so text becomes black on white
  binary = cv2.bitwise_not(mask)

  # clean small noise
  kernel = np.ones((1, 1), np.uint8)
  clean = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

  return clean
