def convert_xyxy_to_xywh(bbox_xyxy : tuple[int, int, int, int]) -> tuple[int, int, int, int]:
  if len(bbox_xyxy) != 4:
    raise ValueError(f"Bounding box must have 4 elements. Bounding box: {bbox_xyxy}")
  return (bbox_xyxy[0], bbox_xyxy[1], bbox_xyxy[2] - bbox_xyxy[0], bbox_xyxy[3] - bbox_xyxy[1])

def convert_xywh_to_xyxy(bbox_xywh : tuple[int, int, int, int]) -> tuple[int, int, int, int]:
  if len(bbox_xywh) != 4:
    raise ValueError(f"Bounding box must have 4 elements. Bounding box: {bbox_xywh}")
  return (bbox_xywh[0], bbox_xywh[1], bbox_xywh[0] + bbox_xywh[2], bbox_xywh[1] + bbox_xywh[3])

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
GAME_WINDOW_BBOX = (155, 0, 955, 1080)
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

ENERGY_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (292, 120, -150, -920))
ENERGY_REGION = convert_xyxy_to_xywh(ENERGY_BBOX)

UNITY_ENERGY_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (287, 120, -150, -920))
UNITY_ENERGY_REGION = convert_xyxy_to_xywh(UNITY_ENERGY_BBOX)

MOOD_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (557, 125, -115, -930))
MOOD_REGION = convert_xyxy_to_xywh(MOOD_BBOX)

TURN_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (112, 82, -585, -947))
TURN_REGION = convert_xyxy_to_xywh(TURN_BBOX)

UNITY_TURN_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (110, 60, -630, -975))
UNITY_TURN_REGION = convert_xyxy_to_xywh(UNITY_TURN_BBOX)

UNITY_RACE_TURNS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (120, 114, -640, -947))
UNITY_RACE_TURNS_REGION = convert_xyxy_to_xywh(UNITY_RACE_TURNS_BBOX)

UNITY_TURN_FULL_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (110, 60, -570, -975))
UNITY_TURN_FULL_REGION = convert_xyxy_to_xywh(UNITY_TURN_FULL_BBOX)

FAILURE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (152, 790, -140, -260))
FAILURE_REGION = convert_xyxy_to_xywh(FAILURE_BBOX)

UNITY_FAILURE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (152, 780, -140, -265))
UNITY_FAILURE_REGION = convert_xyxy_to_xywh(UNITY_FAILURE_BBOX)

YEAR_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (107, 35, -530, -1020))
YEAR_REGION = convert_xyxy_to_xywh(YEAR_BBOX)

UNITY_YEAR_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (237, 35, -400, -1025))
UNITY_YEAR_REGION = convert_xyxy_to_xywh(UNITY_YEAR_BBOX)

CRITERIA_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (307, 60, -200, -965))
CRITERIA_REGION = convert_xyxy_to_xywh(CRITERIA_BBOX)

UNITY_CRITERIA_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (290, 60, -190, -965))
UNITY_CRITERIA_REGION = convert_xyxy_to_xywh(UNITY_CRITERIA_BBOX)

CURRENT_STATS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (120, 723, -122, -315))
CURRENT_STATS_REGION = convert_xyxy_to_xywh(CURRENT_STATS_BBOX)

RACE_INFO_TEXT_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (135, 335, -140, -710))
RACE_INFO_TEXT_REGION = convert_xyxy_to_xywh(RACE_INFO_TEXT_BBOX)

RACE_LIST_BOX_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (112, 580, -105, -210))
RACE_LIST_BOX_REGION = convert_xyxy_to_xywh(RACE_LIST_BOX_BBOX)

URA_STAT_GAINS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (122, 657, -110, -390))
URA_STAT_GAINS_REGION = convert_xyxy_to_xywh(URA_STAT_GAINS_BBOX)

UNITY_STAT_GAINS_2_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (122, 640, -110, -403))
UNITY_STAT_GAINS_2_REGION = convert_xyxy_to_xywh(UNITY_STAT_GAINS_2_BBOX)

UNITY_STAT_GAINS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (122, 673, -110, -378))
UNITY_STAT_GAINS_REGION = convert_xyxy_to_xywh(UNITY_STAT_GAINS_BBOX)

FULL_STATS_STATUS_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (117, 575, -105, -140))
FULL_STATS_STATUS_REGION = convert_xyxy_to_xywh(FULL_STATS_STATUS_BBOX)

FULL_STATS_APTITUDE_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (247, 340, -130, -640))
FULL_STATS_APTITUDE_REGION = convert_xyxy_to_xywh(FULL_STATS_APTITUDE_BBOX)

SUPPORT_CARD_ICON_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (695, 155, 0, -380))
SUPPORT_CARD_ICON_REGION = convert_xyxy_to_xywh(SUPPORT_CARD_ICON_BBOX)

UNITY_SUPPORT_CARD_ICON_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (665, 130, 0, -380))
UNITY_SUPPORT_CARD_ICON_REGION = convert_xyxy_to_xywh(UNITY_SUPPORT_CARD_ICON_BBOX)

UNITY_TEAM_MATCHUP_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (130, 565, -130, -475))
UNITY_TEAM_MATCHUP_REGION = convert_xyxy_to_xywh(UNITY_TEAM_MATCHUP_BBOX)

EVENT_NAME_BBOX = add_tuple_elements(GAME_WINDOW_BBOX, (96, 205, -340, -835))
EVENT_NAME_REGION = convert_xyxy_to_xywh(EVENT_NAME_BBOX)


FULL_SCREEN_LANDSCAPE = (0, 0, 1920, 1080)

SCROLLING_SELECTION_MOUSE_POS=(560, 680)
SKILL_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
RACE_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
RACE_SCROLL_TOP_MOUSE_POS=(560, RACE_SCROLL_BOTTOM_MOUSE_POS[1] - 150) # 150 is for scrolling 1 race

SPD_BUTTON_MOUSE_POS = (GAME_WINDOW_BBOX[0] + 185, 900)
STA_BUTTON_MOUSE_POS = (105 + SPD_BUTTON_MOUSE_POS[0], SPD_BUTTON_MOUSE_POS[1])
PWR_BUTTON_MOUSE_POS = (105 + STA_BUTTON_MOUSE_POS[0], STA_BUTTON_MOUSE_POS[1])
GUTS_BUTTON_MOUSE_POS = (105 + PWR_BUTTON_MOUSE_POS[0], PWR_BUTTON_MOUSE_POS[1])
WIT_BUTTON_MOUSE_POS = (105 + GUTS_BUTTON_MOUSE_POS[0], GUTS_BUTTON_MOUSE_POS[1])

TRAINING_BUTTON_POSITIONS = {
  "spd": SPD_BUTTON_MOUSE_POS,
  "sta": STA_BUTTON_MOUSE_POS,
  "pwr": PWR_BUTTON_MOUSE_POS,
  "guts": GUTS_BUTTON_MOUSE_POS,
  "wit": WIT_BUTTON_MOUSE_POS
}

def update_training_button_positions():
  global TRAINING_BUTTON_POSITIONS
  TRAINING_BUTTON_POSITIONS = {
    "spd": SPD_BUTTON_MOUSE_POS,
    "sta": STA_BUTTON_MOUSE_POS,
    "pwr": PWR_BUTTON_MOUSE_POS,
    "guts": GUTS_BUTTON_MOUSE_POS,
    "wit": WIT_BUTTON_MOUSE_POS
  }

SKIP_BTN_BIG_BBOX_LANDSCAPE = (1300, 750, 1920, 1080)
SKIP_BTN_BIG_REGION_LANDSCAPE = convert_xyxy_to_xywh(SKIP_BTN_BIG_BBOX_LANDSCAPE)
RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE=(800, 950, 1150, 1050)
RACE_BUTTON_IN_RACE_REGION_LANDSCAPE = convert_xyxy_to_xywh(RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE)
SCENARIO_NAME = ""
OFFSET_APPLIED = False
def adjust_constants_x_coords(offset=405):
  """Shift all region tuples' x-coordinates by `offset`."""

  global OFFSET_APPLIED
  if OFFSET_APPLIED:
    return

  g = globals()
  for name, value in list(g.items()):
    if (
      name.endswith("_REGION")
      and isinstance(value, tuple)
      and len(value) == 4
    ):
      new_value = (
        value[0] + offset,
        value[1],
        value[2],
        value[3],
      )
      g[name] = tuple(x for x in new_value if x is not None)

    if (
      name.endswith("_MOUSE_POS")
      and isinstance(value, tuple)
      and len(value) == 2
    ):
      new_value = (
        value[0] + offset,
        value[1],
      )
      g[name] = tuple(x for x in new_value if x is not None)

    if (
      name.endswith("_BBOX")
      and isinstance(value, tuple)
      and len(value) == 4
    ):
      new_value = (
        value[0] + offset,
        value[1],
        value[2] + offset,
        value[3],
      )
      g[name] = tuple(x for x in new_value if x is not None)

  update_training_button_positions()
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
  "a" : "assets/ui/aptitude_a.png",
  "g" : "assets/ui/aptitude_g.png",
  "b" : "assets/ui/aptitude_b.png",
  "c" : "assets/ui/aptitude_c.png",
  "d" : "assets/ui/aptitude_d.png",
  "e" : "assets/ui/aptitude_e.png",
  "f" : "assets/ui/aptitude_f.png",
  "s" : "assets/ui/aptitude_s.png"
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

    full_year_key = f"{year_category} {race_data['date']}"
    race_entry = {"name": race_name}
    race_entry.update(race_data)
    RACES[full_year_key].append(race_entry)

ALL_RACES = RACES.copy()
