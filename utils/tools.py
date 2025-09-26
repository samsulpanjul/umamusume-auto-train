# tools
import pyautogui
import time
import core.state as state
from .log import error, info
import requests
import json

def sleep(seconds=1):
  time.sleep(seconds * state.SLEEP_TIME_MULTIPLIER)

def get_secs(seconds=1):
  return seconds * state.SLEEP_TIME_MULTIPLIER

def drag_scroll(mousePos, to):
  '''to: negative to scroll down, positive to scroll up'''
  if not state.stop_event:
    return
  if not to or not mousePos:
    error("drag_scroll correct variables not supplied.")
  pyautogui.moveTo(mousePos, duration=0.1)
  pyautogui.mouseDown()
  pyautogui.moveRel(0, to, duration=0.25)
  pyautogui.mouseUp()
  pyautogui.click()

def fetch_remote_config(url, branch):
  if not url:
    return None
  full_url = f"{url}{branch}/config.json"
  try:
    response = requests.get(full_url)
    response.raise_for_status()  # Raise an exception for HTTP errors
    info(f"Successfully fetched remote config from {full_url}")
    return response.json()
  except requests.exceptions.RequestException as e:
    error(f"Error fetching remote config from {full_url}: {e}")
    return None
