from schema import Schema, And, Or, Optional

config_schema = Schema({
    "config_name": And(str, len),
    "priority_stat": [And(str, lambda s: s in ["spd", "sta", "pwr", "wit", "guts"])],
    "priority_weights": [Or(int, float)],
    "sleep_time_multiplier": Or(int, float),
    "skip_training_energy": And(int, lambda n: 0 <= n <= 100),
    "never_rest_energy": And(int, lambda n: 0 <= n <= 100),
    "skip_infirmary_unless_missing_energy": And(int, lambda n: 0 <= n <= 100),
    "minimum_mood": And(str, lambda s: s in ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT"]),
    "priority_weight": And(str, lambda s: s in ["HEAVY", "MEDIUM", "LIGHT", "NONE"]),
    "minimum_mood_junior_year": And(str, lambda s: s in ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT"]),
    "maximum_failure": And(int, lambda n: 0 <= n <= 100),
    "prioritize_g1_race": bool,
    "cancel_consecutive_race": bool,
    "position_selection_enabled": bool,
    "enable_positions_by_race": bool,
    "preferred_position": And(str, lambda s: s in ["front", "late", "end"]),
    "positions_by_race": {
        "sprint": And(str, lambda s: s in ["front", "late", "end"]),
        "mile": And(str, lambda s: s in ["front", "late", "end"]),
        "medium": And(str, lambda s: s in ["front", "late", "end"]),
        "long": And(str, lambda s: s in ["front", "late", "end"])
    },
    "race_schedule": [{
        "name": And(str, len),
        "year": And(str, len),
        "date": And(str, len)
    }],
    "stat_caps": {
        "spd": int,
        "sta": int,
        "pwr": int,
        "guts": int,
        "wit": int
    },
    "skill": {
        "is_auto_buy_skill": bool,
        "skill_pts_check": int,
        "skill_list": [str]
    },
    "window_name": And(str, len),
    "resolution": {
        "width": int,
        "height": int
    },
    "dry_run": bool,
    "remote_config": {
        "url": str,
        "branch": And(str, lambda s: s in ["main", "dev"]),
        "auto_update": bool
    }
})
