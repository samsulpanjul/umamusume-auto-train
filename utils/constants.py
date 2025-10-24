MOOD_REGION=(705, 125, 835 - 705, 150 - 125)
TURN_REGION=(260, 65, 370 - 260, 140 - 65)
FAILURE_REGION=(300, 790, 810 - 300, 820 - 790)
YEAR_REGION=(255, 35, 420 - 255, 60 - 35)
CRITERIA_REGION=(455, 60, 750 - 455, 115 - 60)
CURRENT_STATS_REGION=(275, 723, 825 - 275, 765 - 723)
SKIP_BTN_BIG_REGION_LANDSCAPE=(1500, 750, 1920-1500, 1080-750)
SCREEN_BOTTOM_REGION=(125, 800, 1000-125, 1080-800)
SCREEN_MIDDLE_REGION=(125, 300, 1000-125, 800-300)
SCREEN_TOP_REGION=(125, 0, 1000-125, 300)
RACE_INFO_TEXT_REGION=(285, 335, 810-285, 370-335)
RACE_LIST_BOX_REGION=(260, 580, 850-265, 870-580)
STAT_GAINS_REGION = (270, 650, 840-270, 700-650)

FULL_STATS_STATUS_REGION=(265, 575, 845-265, 940-575)
FULL_STATS_APTITUDE_REGION=(395, 340, 820-395, 440-340)

SCROLLING_SELECTION_MOUSE_POS=(560, 680)
SKILL_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
RACE_SCROLL_BOTTOM_MOUSE_POS=(560, 850)

SUPPORT_CARD_ICON_BBOX=(845, 155, 945, 700)
ENERGY_BBOX=(440, 120, 800, 160)
RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE=(800, 950, 1150, 1050)
SCREEN_BOTTOM_BBOX=(125, 800, 1000, 1080)

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
for year_category, races in _races_raw.items():
  for race_name, race_data in races.items():
    race_data["year"] = year_category
    date = race_data.get("date")
    if date:
      full_year_key = f"{year_category} {date}"
      if full_year_key not in RACES:
        RACES[full_year_key] = []
      race_entry = {"name": race_name}
      race_entry.update(race_data)
      RACES[full_year_key].append(race_entry)
