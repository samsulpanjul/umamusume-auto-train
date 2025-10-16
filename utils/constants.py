# X, Y, W, H
MOOD_REGION = (705, 125, 835 - 705, 150 - 125)
TURN_REGION = (260, 82, 360 - 260, 133 - 82)
FAILURE_REGION = (295, 790, 800 - 295, 810 - 790)
YEAR_REGION = (255, 35, 420 - 255, 55 - 35)
CRITERIA_REGION = (455, 85, 700 - 455, 115 - 85)
SKILL_PTS_REGION = (760, 780, 825 - 760, 815 - 780)
EVENT_NAME_REGION = (241, 205, 365, 30)

SPD_STAT_REGION = (310, 723, 52, 20)
STA_STAT_REGION = (405, 723, 52, 20)
PWR_STAT_REGION = (500, 723, 52, 20)
GUTS_STAT_REGION = (595, 723, 52, 20)
WIT_STAT_REGION = (690, 723, 52, 20)

# Expected location for URA-style stat gains during training evaluation
SPD_GAIN_REGION = (264, 660, 100, 30)
STA_GAIN_REGION = (361, 660, 100, 30)
PWR_GAIN_REGION = (456, 660, 100, 30)
GUTS_GAIN_REGION = (551, 660, 100, 30)
WIT_GAIN_REGION = (646, 660, 100, 30)
SP_GAIN_REGION = (741, 660, 100, 30)

SPD_FAILURE_REGION = (295, 790, 75, 825 - 790)
STA_FAILURE_REGION = (405, 790, 75, 825 - 790)
PWR_FAILURE_REGION = (510, 790, 75, 825 - 790)
GUTS_FAILURE_REGION = (615, 790, 75, 825 - 790)
WIT_FAILURE_REGION = (723, 790, 75, 825 - 790)

TRAINING_ICON_COORD = {
    "spd": (180, 910),
    "sta": (290, 910),
    "pwr": (400, 910),
    "guts": (510, 910),
    "wit": (620, 910),
}

# LEFT TOP RIGHT BOTTOM
FULL_STATS_STATUS_REGION = (265, 575, 680, 940)
RACE_INFO_TEXT_REGION = (285, 335, 525, 370)

SCROLLING_SELECTION_MOUSE_POS = (560, 680)
SKILL_SCROLL_BOTTOM_MOUSE_POS = (560, 850)
RACE_SCROLL_BOTTOM_MOUSE_POS = (560, 860)

MOOD_LIST = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT", "UNKNOWN"]
# Severity -> 0 is doesn't matter / incurable, 1 is "can be ignored for a few turns", 2 is "must be cured immediately"
BAD_STATUS_EFFECTS = {
    "Migraine": {
        "Severity": 2,
        "Effect": "Mood cannot be increased",
    },
    "Night Owl": {
        "Severity": 1,
        "Effect": "Character may lose energy, and possibly mood",
    },
    "Practice Poor": {
        "Severity": 1,
        "Effect": "Increases chance of training failure by 2%",
    },
    "Skin Outbreak": {
        "Severity": 1,
        "Effect": "Character's mood may decrease by one stage.",
    },
    "Slacker": {
        "Severity": 2,
        "Effect": "Character may not show up for training.",
    },
    "Slow Metabolism": {
        "Severity": 2,
        "Effect": "Character cannot gain Speed from speed training.",
    },
    "Under the Weather": {
        "Severity": 0,
        "Effect": "Increases chance of training failure by 5%",
    },
}

GOOD_STATUS_EFFECTS = {
    "Charming": "Raises Friendship Bond gain by 2",
    "Fast Learner": "Reduces the cost of skills by 10%",
    "Hot Topic": "Raises Friendship Bond gain for NPCs by 2",
    "Practice Perfect": "Lowers chance of training failure by 2%",
    "Shining Brightly": "Lowers chance of training failure by 5%",
}

SUPPORT_CARD_ICON_BBOX = (845, 155, 945, 700)
ENERGY_BBOX = (440, 120, 800, 160)
RACE_BUTTON_IN_RACE_BBOX_LANDSCAPE = (800, 950, 1150, 1050)

OFFSET_APPLIED = False


def adjust_constants_x_coords(offset=150):
    """Shift all region tuples' x-coordinates by `offset`."""

    global OFFSET_APPLIED
    if OFFSET_APPLIED:
        return

    g = globals()

    for name, value in list(g.items()):
        if (
            name.endswith("_REGION")  # only touch REGION constants
            and isinstance(value, tuple)
            and len(value) >= 2
        ):
            # Adjust only the x-coordinates (0 and 2)
            new_value = (
                value[0] - offset,
                value[1],
                value[2],
                value[3],
            )
            # Drop None if length was originally 3
            g[name] = tuple(x for x in new_value if x is not None)

        if (
            name.endswith("_MOUSE_POS")  # only touch REGION constants
            and isinstance(value, tuple)
            and len(value) >= 2
        ):
            # Adjust only the x-coordinates (0 and 2)
            new_value = (
                value[0] - offset,
                value[1],
            )
            # Drop None if length was originally 3
            g[name] = tuple(x for x in new_value if x is not None)

        if (
            name.endswith("_BBOX")  # only touch REGION constants
            and isinstance(value, tuple)
            and len(value) >= 2
        ):
            # Adjust only the x-coordinates (0 and 2)
            new_value = (
                value[0] - offset,
                value[1],
                value[2] - offset,
                value[3],
            )
            # Drop None if length was originally 3
            g[name] = tuple(x for x in new_value if x is not None)

    OFFSET_APPLIED = True
