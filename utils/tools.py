# tools
import pyautogui
import time
import core.state as state

def sleep(seconds=1):
  time.sleep(seconds * state.SLEEP_TIME_MULTIPLIER)

def get_secs(seconds=1):
  return seconds * state.SLEEP_TIME_MULTIPLIER

def drag_scroll(mousePos, to):
  '''to: negative to scroll down, positive to scroll up'''
  if not to or not mousePos:
    error("drag_scroll correct variables not supplied.")
  pyautogui.moveTo(mousePos, duration=0.1)
  pyautogui.mouseDown()
  pyautogui.moveRel(0, to, duration=0.25)
  pyautogui.mouseUp()
  pyautogui.click()
