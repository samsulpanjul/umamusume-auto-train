import json
import os
import pyautogui

_screen_scale = None
_resolution_data = None

def get_screen_scale():
  global _screen_scale
  if _screen_scale is None:
    res = pyautogui.resolution()
    _screen_scale = res.width / 1920.0
  return _screen_scale

def load_resolution_data():
  global _resolution_data
  if _resolution_data is None:
    try:
      with open("data/resolution_constraints.json", "r") as f:
        _resolution_data = json.load(f)
    except Exception:
      _resolution_data = {}
  return _resolution_data

def get_constant(name, default_val):
  res = pyautogui.resolution()
  res_key = f"{res.width}x{res.height}"
  data = load_resolution_data()
  
  if res_key in data and name in data[res_key]:
    return tuple(data[res_key][name]) if isinstance(data[res_key][name], list) else data[res_key][name]
  
  # Fallback to scaling
  if isinstance(default_val, (int, float)):
     return int(default_val * get_screen_scale())
  return tuple(int(x * get_screen_scale()) for x in default_val)

def scale_coords(*coords):
  # Legacy helper for ad-hoc scaling if needed, but preferred to be used via get_constant logic internally
  scale = get_screen_scale()
  return tuple(int(c * scale) for c in coords)

MOOD_REGION=get_constant("MOOD_REGION", (705, 125, 835 - 705, 150 - 125))
TURN_REGION=get_constant("TURN_REGION", (260, 81, 370 - 260, 140 - 87))
FAILURE_REGION=get_constant("FAILURE_REGION", (250, 770, 855 - 295, 835 - 770))
YEAR_REGION=get_constant("YEAR_REGION", (255, 35, 420 - 255, 60 - 35))
CRITERIA_REGION=get_constant("CRITERIA_REGION", (455, 55, 765 - 455, 115 - 55))
EVENT_NAME_REGION=get_constant("EVENT_NAME_REGION", (241, 205, 365, 30))
SKILL_PTS_REGION=get_constant("SKILL_PTS_REGION", (760, 780, 825 - 760, 815 - 780))
SKIP_BTN_BIG_REGION_LANDSCAPE=get_constant("SKIP_BTN_BIG_REGION_LANDSCAPE", (1500, 750, 1920-1500, 1080-750))
SCREEN_BOTTOM_REGION=get_constant("SCREEN_BOTTOM_REGION", (125, 800, 1000-125, 1080-800))
SCREEN_MIDDLE_REGION=get_constant("SCREEN_MIDDLE_REGION", (125, 300, 1000-125, 800-300))
SCREEN_TOP_REGION=get_constant("SCREEN_TOP_REGION", (125, 0, 1000-125, 300))
RACE_INFO_TEXT_REGION=get_constant("RACE_INFO_TEXT_REGION", (285, 335, 810-285, 370-335))
RACE_LIST_BOX_REGION=get_constant("RACE_LIST_BOX_REGION", (260, 580, 850-265, 870-580))

FULL_STATS_STATUS_REGION=get_constant("FULL_STATS_STATUS_REGION", (265, 575, 845-265, 940-575))
FULL_STATS_APTITUDE_REGION=get_constant("FULL_STATS_APTITUDE_REGION", (395, 340, 820-395, 440-340))

SCROLLING_SELECTION_MOUSE_POS=get_constant("SCROLLING_SELECTION_MOUSE_POS", (560, 680))
SKILL_SCROLL_BOTTOM_MOUSE_POS=get_constant("SKILL_SCROLL_BOTTOM_MOUSE_POS", (560, 850))
RACE_SCROLL_BOTTOM_MOUSE_POS=get_constant("RACE_SCROLL_BOTTOM_MOUSE_POS", (560, 850))
DATE_COMPLETE_MOUSE_POS=get_constant("DATE_COMPLETE_MOUSE_POS", (410, 500))

SPD_STAT_REGION = get_constant("SPD_STAT_REGION", (310, 723, 55, 20))
STA_STAT_REGION = get_constant("STA_STAT_REGION", (405, 723, 55, 20))
PWR_STAT_REGION = get_constant("PWR_STAT_REGION", (500, 723, 55, 20))
GUTS_STAT_REGION = get_constant("GUTS_STAT_REGION", (595, 723, 55, 20))
WIT_STAT_REGION = get_constant("WIT_STAT_REGION", (690, 723, 55, 20))

MOOD_LIST = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT", "UNKNOWN"]

SUPPORT_CARD_ICON_BBOX=get_constant("SUPPORT_CARD_ICON_BBOX", (845, 140, 945, 700))
ENERGY_BBOX=get_constant("ENERGY_BBOX", (440, 120, 800, 160))
RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE=get_constant("RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE", (800, 950, 1150, 1050))

GAME_SCREEN_REGION = get_constant("GAME_SCREEN_REGION", (150, 0, 800, 1080))
CHOICE_VERTICAL_GAP = get_constant("CHOICE_VERTICAL_GAP", 112)

OFFSET_APPLIED = False
def adjust_constants_x_coords(offset=405):
  """Shift all region tuples' x-coordinates by `offset`."""
  
  offset = int(offset * get_screen_scale())

  global OFFSET_APPLIED
  if OFFSET_APPLIED:
    return

  g = globals()
  for name, value in list(g.items()):
    if (
      name.endswith("_REGION")   # only touch REGION constants
      and isinstance(value, tuple)
      and len(value) >= 2
    ):
      # Adjust only the x-coordinates (0 and 2)
      new_value = (
        value[0] + offset,
        value[1],
        value[2],
        value[3],
      )
      # Drop None if length was originally 3
      g[name] = tuple(x for x in new_value if x is not None)

    if (
      name.endswith("_MOUSE_POS")   # only touch REGION constants
      and isinstance(value, tuple)
      and len(value) >= 2
    ):
      # Adjust only the x-coordinates (0 and 2)
      new_value = (
        value[0] + offset,
        value[1],
      )
      # Drop None if length was originally 3
      g[name] = tuple(x for x in new_value if x is not None)

    if (
      name.endswith("_BBOX")   # only touch REGION constants
      and isinstance(value, tuple)
      and len(value) >= 2
    ):
      # Adjust only the x-coordinates (0 and 2)
      new_value = (
        value[0] + offset,
        value[1],
        value[2] + offset,
        value[3],
      )
      # Drop None if length was originally 3
      g[name] = tuple(x for x in new_value if x is not None)
  OFFSET_APPLIED = True

# Load all races once to be used when selecting them
RACES = ""
with open("data/races.json", "r", encoding="utf-8") as file:
  RACES = json.load(file)

# Build a lookup dict for fast (year, date) searches
RACE_LOOKUP = {}
for year, races in RACES.items():
  for name, data in races.items():
    key = f"{year} {data['date']}"
    race_entry = {"name": name, **data}
    RACE_LOOKUP.setdefault(key, []).append(race_entry)
