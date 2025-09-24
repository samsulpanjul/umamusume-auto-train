MOOD_REGION=(705, 125, 835 - 705, 150 - 125)
TURN_REGION=(260, 65, 370 - 260, 140 - 65)
FAILURE_REGION=(250, 770, 855 - 295, 835 - 770)
YEAR_REGION=(255, 35, 420 - 255, 60 - 35)
CRITERIA_REGION=(455, 85, 625 - 455, 115 - 85)
SKILL_PTS_REGION=(760, 780, 825 - 760, 815 - 780)
SKIP_BTN_BIG_REGION_LANDSCAPE=(1500, 750, 1920-1500, 1080-750)
SCREEN_BOTTOM_REGION=(125, 800, 1000-125, 1080-800)
SCREEN_MIDDLE_REGION=(125, 300, 1000-125, 800-300)
SCREEN_TOP_REGION=(125, 0, 1000-125, 300)
RACE_INFO_TEXT_REGION=(285, 335, 810-285, 370-335)
FULL_STATS_STATUS_REGION=(265, 575, 845-265, 940-575)
RACE_LIST_BOX_REGION=(260, 580, 850-265, 870-580)

SCROLLING_SELECTION_MOUSE_POS=(560, 680)
SKILL_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
RACE_SCROLL_BOTTOM_MOUSE_POS=(560, 850)

SPD_STAT_REGION = (310, 723, 55, 20)
STA_STAT_REGION = (405, 723, 55, 20)
PWR_STAT_REGION = (500, 723, 55, 20)
GUTS_STAT_REGION = (595, 723, 55, 20)
WIT_STAT_REGION = (690, 723, 55, 20)

MOOD_LIST = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT", "UNKNOWN"]

SUPPORT_CARD_ICON_BBOX=(845, 155, 945, 700)
ENERGY_BBOX=(440, 120, 800, 160)
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

TIMELINE = {
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
}

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

STAT_REGIONS = {
  "spd": constants.SPD_STAT_REGION,
  "sta": constants.STA_STAT_REGION,
  "pwr": constants.PWR_STAT_REGION,
  "guts": constants.GUTS_STAT_REGION,
  "wit": constants.WIT_STAT_REGION
}
