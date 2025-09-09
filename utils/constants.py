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

SCROLLING_SELECTION_MOUSE_POS=(560, 680)
SKILL_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
SKILL_SCROLL_TOP_MOUSE_POS=(560, 400)
RACE_SCROLL_BOTTOM_MOUSE_POS=(560, 850)
RACE_SCROLL_TOP_MOUSE_POS=(560, 580)

SPD_STAT_REGION = (310, 723, 55, 20)
STA_STAT_REGION = (405, 723, 55, 20)
PWR_STAT_REGION = (500, 723, 55, 20)
GUTS_STAT_REGION = (595, 723, 55, 20)
WIT_STAT_REGION = (690, 723, 55, 20)

MOOD_LIST = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT", "UNKNOWN"]

SUPPORT_CARD_ICON_BBOX=(845, 155, 945, 700)
ENERGY_BBOX=(440, 120, 800, 160)
RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE=(800, 950, 1150, 1050)

def adjust_constants_x_coords(offset=405):
    """Shift all region tuples' x-coordinates by `offset`."""
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
