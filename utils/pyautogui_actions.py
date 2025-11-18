import pyautogui
import mss

def click(x, y):
  pyautogui.click(x, y)
  return True

def swipe(x1, y1, x2, y2, duration=0.3):
  delay_to_first_move = 0.1
  move(x1, y1, duration=delay_to_first_move)
  hold()
  move(x2, y2, duration=duration-delay_to_first_move)
  release()
  return True

def move(x, y, duration=0.2):
  pyautogui.moveTo(x, y, duration=duration)
  return True

def hold():
  pyautogui.mouseDown()
  return True

def release():
  pyautogui.mouseUp()
  return True

def screenshot(region=None):
  with mss.mss() as sct:
    monitor = {
      "left": region[0],
      "top": region[1],
      "width": region[2],
      "height": region[3]
    }
    return sct.grab(monitor)
    
