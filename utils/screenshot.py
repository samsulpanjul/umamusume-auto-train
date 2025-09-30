from PIL import Image, ImageEnhance
import mss
import numpy as np

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
