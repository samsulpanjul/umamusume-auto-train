# tools
import pyautogui
import time
import core.state as state

def sleep(seconds=1):
  time.sleep(seconds * state.SLEEP_TIME_MULTIPLIER)

def get_secs(seconds=1):
  return seconds * state.SLEEP_TIME_MULTIPLIER

def drag_scroll(bottomMousePos, to):
  '''to: negative to scroll down, positive to scroll up'''
  if not to or not bottomMousePos:
    error("drag_scroll correct variables not supplied.")
  pyautogui.moveTo(bottomMousePos, duration=0.1)
  pyautogui.mouseDown()
  pyautogui.moveRel(0, to, duration=0.25)
  pyautogui.mouseUp()
  pyautogui.click()

'''
def drag_scroll(bottomMousePos, topMousePos):
  if not topMousePos or not bottomMousePos:
    error("drag_scroll correct variables not supplied.")
  pyautogui.moveTo(bottomMousePos, duration=0.1)
  pyautogui.mouseDown()
  pyautogui.moveTo(topMousePos, duration=0.4)
  pyautogui.moveTo((topMousePos[0], topMousePos[1]+20), duration=0.1)
  pyautogui.moveTo((topMousePos[0], topMousePos[1]+10), duration=0.1)
  pyautogui.moveTo((topMousePos[0], topMousePos[1]+15), duration=0.1)
  pyautogui.mouseUp()
'''