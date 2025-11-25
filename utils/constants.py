def convert_xyxy_to_xywh(bbox_xyxy : tuple[int, int, int, int]) -> tuple[int, int, int, int]:
  if len(bbox_xyxy) != 4:
    raise ValueError(f"Bounding box must have 4 elements. Bounding box: {bbox_xyxy}")
  return (bbox_xyxy[0], bbox_xyxy[1], bbox_xyxy[2] - bbox_xyxy[0], bbox_xyxy[3] - bbox_xyxy[1])

def add_tuple_elements(bbox, tuple_to_add):
  if len(bbox) != len(tuple_to_add) or len(tuple_to_add) != 4:
    raise ValueError(f"Bounding boxes must have the same length. Bounding box: {bbox}, Tuple to add: {tuple_to_add}")
  return (bbox[0] + tuple_to_add[0], bbox[1] + tuple_to_add[1], bbox[2] + tuple_to_add[2], bbox[3] + tuple_to_add[3])

def debug_bbox(bbox):
  print(f"Bbox: {bbox}")
  print(f"GAME_WINDOW_BBOX: {GAME_WINDOW_BBOX}")
  value_to_add = (
  bbox[0] - GAME_WINDOW_BBOX[0],
  bbox[1] - GAME_WINDOW_BBOX[1],
  (bbox[0] + bbox[2]) - GAME_WINDOW_BBOX[2],
  (bbox[1] + bbox[3]) - GAME_WINDOW_BBOX[3]
  )
  print(f"Value to add: {value_to_add}")
  result = add_tuple_elements(GAME_WINDOW_BBOX, value_to_add)
  print(f"Result: {result}")
  print(f"Result: {bbox}")

# Top left x, top left y, bottom right x, bottom right y
GAME_WINDOW_BBOX = (148, 0, 958, 1080)
# Left, top, width, height
GAME_WINDOW_REGION = convert_xyxy_to_xywh(GAME_WINDOW_BBOX)

SCREEN_TOP_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (0, 0, 0, -780))
SCREEN_TOP_REGION = convert_xyxy_to_xywh(SCREEN_TOP_BBOX)

SCREEN_MIDDLE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (0, 300, 0, -280))
SCREEN_MIDDLE_REGION = convert_xyxy_to_xywh(SCREEN_MIDDLE_BBOX)

SCREEN_BOTTOM_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (0, 800, 0, 0))
SCREEN_BOTTOM_REGION = convert_xyxy_to_xywh(SCREEN_BOTTOM_BBOX)

SCROLLING_SKILL_SCREEN_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (0, 390, 0, -200))
SCROLLING_SKILL_SCREEN_REGION = convert_xyxy_to_xywh(SCROLLING_SKILL_SCREEN_BBOX)

ENERGY_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (292, 120, -158, -920))
ENERGY_REGION = convert_xyxy_to_xywh(ENERGY_BBOX)

MOOD_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (557, 125, -123, -930))
MOOD_REGION = convert_xyxy_to_xywh(MOOD_BBOX)

TURN_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (112, 82, -593, -947))
TURN_REGION = convert_xyxy_to_xywh(TURN_BBOX)

FAILURE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (152, 790, -148, -260))
FAILURE_REGION = convert_xyxy_to_xywh(FAILURE_BBOX)

YEAR_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (107, 35, -538, -1020))
YEAR_REGION = convert_xyxy_to_xywh(YEAR_BBOX)

CRITERIA_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (307, 60, -208, -965))
CRITERIA_REGION = convert_xyxy_to_xywh(CRITERIA_BBOX)

CURRENT_STATS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (127, 723, -133, -315))
CURRENT_STATS_REGION = convert_xyxy_to_xywh(CURRENT_STATS_BBOX)

SKIP_BTN_BIG_LANDSCAPE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (1352, 750, 962, 0))
SKIP_BTN_BIG_LANDSCAPE_REGION = convert_xyxy_to_xywh(SKIP_BTN_BIG_LANDSCAPE_BBOX)

RACE_INFO_TEXT_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (137, 335, -148, -710))
RACE_INFO_TEXT_REGION = convert_xyxy_to_xywh(RACE_INFO_TEXT_BBOX)

RACE_LIST_BOX_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (112, 580, -113, -210))
RACE_LIST_BOX_REGION = convert_xyxy_to_xywh(RACE_LIST_BOX_BBOX)

URA_STAT_GAINS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (122, 657, -118, -390))
URA_STAT_GAINS_REGION = convert_xyxy_to_xywh(URA_STAT_GAINS_BBOX)

UNITY_STAT_GAINS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (122, 642, -118, -405))
UNITY_STAT_GAINS_REGION = convert_xyxy_to_xywh(UNITY_STAT_GAINS_BBOX)

UNITY_STAT_GAINS_2_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (122, 675, -118, -372))
UNITY_STAT_GAINS_2_REGION = convert_xyxy_to_xywh(UNITY_STAT_GAINS_2_BBOX)

FULL_STATS_STATUS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (117, 575, -113, -140))
FULL_STATS_STATUS_REGION = convert_xyxy_to_xywh(FULL_STATS_STATUS_BBOX)

FULL_STATS_APTITUDE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (247, 340, -138, -640))
FULL_STATS_APTITUDE_REGION = convert_xyxy_to_xywh(FULL_STATS_APTITUDE_BBOX)

SUPPORT_CARD_ICON_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (697, 155, -13, -380))
SUPPORT_CARD_ICON_REGION = convert_xyxy_to_xywh(SUPPORT_CARD_ICON_BBOX)

SCROLLING_SELECTION_MOUSE_POS=(560, 680)
SKILL_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
RACE_SCROLL_BOTTOM_MOUSE_POS=(560, 850)

RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE=(800, 950, 1150, 1050)

OFFSET_APPLIED = False
def adjust_constants_x_coords(offset=405):
  """Shift all region tuples' x-coordinates by `offset`."""

  global OFFSET_APPLIED
  if OFFSET_APPLIED:
    return

  g = globals()
  for name, value in list(g.items()):
    if (
      name.endswith("_REGION")   # only touch REGION constants
      and isinstance(value, tuple)
      and len(value) == 4
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
      and len(value) == 2
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
      and len(value) == 4
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

TIMELINE = [
  "Junior Year Pre-Debut",
  "Junior Year Early Jun",
  "Junior Year Late Jun",
  "Junior Year Early Jul",
  "Junior Year Late Jul",
  "Junior Year Early Aug",
  "Junior Year Late Aug",
  "Junior Year Early Sep",
  "Junior Year Late Sep",
  "Junior Year Early Oct",
  "Junior Year Late Oct",
  "Junior Year Early Nov",
  "Junior Year Late Nov",
  "Junior Year Early Dec",
  "Junior Year Late Dec",
  "Classic Year Early Jan",
  "Classic Year Late Jan",
  "Classic Year Early Feb",
  "Classic Year Late Feb",
  "Classic Year Early Mar",
  "Classic Year Late Mar",
  "Classic Year Early Apr",
  "Classic Year Late Apr",
  "Classic Year Early May",
  "Classic Year Late May",
  "Classic Year Early Jun",
  "Classic Year Late Jun",
  "Classic Year Early Jul",
  "Classic Year Late Jul",
  "Classic Year Early Aug",
  "Classic Year Late Aug",
  "Classic Year Early Sep",
  "Classic Year Late Sep",
  "Classic Year Early Oct",
  "Classic Year Late Oct",
  "Classic Year Early Nov",
  "Classic Year Late Nov",
  "Classic Year Early Dec",
  "Classic Year Late Dec",
  "Senior Year Early Jan",
  "Senior Year Late Jan",
  "Senior Year Early Feb",
  "Senior Year Late Feb",
  "Senior Year Early Mar",
  "Senior Year Late Mar",
  "Senior Year Early Apr",
  "Senior Year Late Apr",
  "Senior Year Early May",
  "Senior Year Late May",
  "Senior Year Early Jun",
  "Senior Year Late Jun",
  "Senior Year Early Jul",
  "Senior Year Late Jul",
  "Senior Year Early Aug",
  "Senior Year Late Aug",
  "Senior Year Early Sep",
  "Senior Year Late Sep",
  "Senior Year Early Oct",
  "Senior Year Late Oct",
  "Senior Year Early Nov",
  "Senior Year Late Nov",
  "Senior Year Early Dec",
  "Senior Year Late Dec",
  "Finale Underway",
]

TRAINING_IMAGES = {
  "spd": "assets/icons/train_spd.png",
  "sta": "assets/icons/train_sta.png",
  "pwr": "assets/icons/train_pwr.png",
  "guts": "assets/icons/train_guts.png",
  "wit": "assets/icons/train_wit.png"
}

SUPPORT_ICONS = {
  "spd": "assets/icons/support_card_type_spd.png",
  "sta": "assets/icons/support_card_type_sta.png",
  "pwr": "assets/icons/support_card_type_pwr.png",
  "guts": "assets/icons/support_card_type_guts.png",
  "wit": "assets/icons/support_card_type_wit.png",
  "friend": "assets/icons/support_card_type_friend.png"
}

SUPPORT_FRIEND_LEVELS = {
  "gray": [110,108,120],
  "blue": [42,192,255],
  "green": [162,230,30],
  "yellow": [255,173,30],
  "max": [255,235,120],
}

APTITUDE_IMAGES = {
  "s" : "assets/ui/aptitude_s.png",
  "a" : "assets/ui/aptitude_a.png",
  "b" : "assets/ui/aptitude_b.png",
  "c" : "assets/ui/aptitude_c.png",
  "d" : "assets/ui/aptitude_d.png",
  "e" : "assets/ui/aptitude_e.png",
  "f" : "assets/ui/aptitude_f.png",
  "g" : "assets/ui/aptitude_g.png"
}

MOOD_IMAGES = {
  "GREAT" : "assets/icons/mood_great.png",
  "GOOD" : "assets/icons/mood_good.png",
  "NORMAL" : "assets/icons/mood_normal.png",
  "BAD" : "assets/icons/mood_bad.png",
  "AWFUL" : "assets/icons/mood_awful.png"
}

MOOD_LIST = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT", "UNKNOWN"]

# Load races data
import json
import os

_races_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "races.json")
with open(_races_path, 'r', encoding='utf-8') as f:
  _races_raw = json.load(f)

# Transform races to match state year format (e.g., "Junior Year Early Dec")
RACES = {}
for full_year_key in TIMELINE:
  RACES[full_year_key] = []

for year_category, races in _races_raw.items():
  for race_name, race_data in races.items():

    full_year_key = f"{year_category} {race_data["date"]}"
    race_entry = {"name": race_name}
    race_entry.update(race_data)
    RACES[full_year_key].append(race_entry)

ALL_RACES = RACES.copy()
