import core.state as state
from core.state import check_current_year, stat_state, check_energy_level
from utils.log import info, debug, warning
from typing import Dict, Any, Optional


def get_stat_priority(stat_key: str) -> int:
    """Return index of stat in PRIORITY_STAT list, or 999 if not found."""
    return state.PRIORITY_STAT.index(stat_key) if stat_key in state.PRIORITY_STAT else 999


def all_values_equal(d: Dict[str, Any]) -> bool:
    """Check if all values in a dict are equal."""
    values = list(d.values())
    return all(value == values[0] for value in values[1:]) if values else True


def most_support_card(results: Dict[str, Dict[str, Any]]) -> Optional[str]:
    """
    Choose the best training option in early game (Junior Year),
    prioritizing trainings with the most support cards.
    Returns the chosen stat key or None (rest).
    """
    wit_data = results.get("wit")

    # Get all training but wit
    non_wit_results = {
        k: v for k, v in results.items()
        if k != "wit" and int(v["failure"]) <= state.MAX_FAILURE
    }

    all_others_bad = len(non_wit_results) == 0
    energy_level, _ = check_energy_level()
    if energy_level < state.SKIP_TRAINING_ENERGY:
        info("[INFO] All trainings are unsafe and WIT training won't help restore energy. Resting instead.")
        return None

    if all_others_bad and wit_data and int(wit_data["failure"]) <= state.MAX_FAILURE and wit_data["total_supports"] >= 2:
        info("[INFO] All trainings unsafe, but WIT is safe and has enough support cards.")
        return "wit"

    filtered_results = {
        k: v for k, v in results.items() if int(v["failure"]) <= state.MAX_FAILURE
    }

    if not filtered_results:
        info("[INFO] No safe training found. All failure chances too high.")
        return None

    priority_weights = {
        "HEAVY": 0.75,
        "MEDIUM": 0.5,
        "LIGHT": 0.25,
        "NONE": 0,
    }

    priority_weight = priority_weights.get(state.PRIORITY_WEIGHT, 0)

    # Select best training
    best_training = max(
        filtered_results.items(),
        key=lambda x: (
            x[1]["total_supports"]
            * (1 + state.PRIORITY_EFFECTS_LIST[get_stat_priority(x[0])] * priority_weight),
            -get_stat_priority(x[0])
        )
    )

    best_key, best_data = best_training

    if best_data["total_supports"] <= 1:
        if int(best_data["failure"]) == 0:
            if best_key == "wit":
                if energy_level > state.NEVER_REST_ENERGY:
                    info("[INFO] Only 1 support (WIT) but energy too high to rest. Training WIT anyway.")
                    return "wit"
                else:
                    info("[INFO] Only 1 support and it's WIT. Skipping.")
                    return None
            info(f"[INFO] Only 1 support but 0% failure. Prioritizing {best_key.upper()}")
            return best_key
        else:
            info("[INFO] Low value training (only 1 support). Choosing to rest.")
            return None

    info(f"[INFO] Best training: {best_key.upper()} with {best_data['total_supports']} supports and {best_data['failure']}% fail chance")
    return best_key


def rainbow_training(results: Dict[str, Dict[str, Any]]) -> Optional[str]:
    """
    Choose training with rainbow supports.
    Adds extra weight for rainbow friends.
    Returns the chosen stat key or None.
    """
    rainbow_candidates = results.copy()

    for stat_name, data in rainbow_candidates.items():
        total_rainbow_friends = (
            data[stat_name]["friendship_levels"]["yellow"]
            + data[stat_name]["friendship_levels"]["max"]
        )
        rainbow_points = total_rainbow_friends + data["total_supports"]
        if total_rainbow_friends > 0:
            rainbow_points += 0.5
        rainbow_candidates[stat_name]["rainbow_points"] = rainbow_points
        rainbow_candidates[stat_name]["total_rainbow_friends"] = total_rainbow_friends

    # Filter by failure and rainbow value
    rainbow_candidates = {
        stat: data for stat, data in rainbow_candidates.items()
        if int(data["failure"]) <= state.MAX_FAILURE
        and data["rainbow_points"] >= 2
        and not (stat == "wit" and data["total_rainbow_friends"] < 1)
    }

    if not rainbow_candidates:
        info("[INFO] No rainbow training found under failure threshold.")
        return None

    best_rainbow = max(
        rainbow_candidates.items(),
        key=lambda x: (
            x[1]["rainbow_points"],
            -get_stat_priority(x[0])
        )
    )

    best_key, best_data = best_rainbow

    if best_key == "wit" and best_data["total_rainbow_friends"] < 1:
        info("[INFO] Wit training had rainbow points but no rainbow friends. Skipping.")
        return None

    info(f"[INFO] Rainbow training: {best_key.upper()} with {best_data['rainbow_points']} rainbow points and {best_data['failure']}% fail chance")
    return best_key


def filter_by_stat_caps(results: Dict[str, Dict[str, Any]], current_stats: Dict[str, int]) -> Dict[str, Dict[str, Any]]:
    """Filter out trainings for stats already at or above cap."""
    return {
        stat: data for stat, data in results.items()
        if current_stats.get(stat, 0) < state.STAT_CAPS.get(stat, 1200)
    }


def do_something(results: Dict[str, Dict[str, Any]]) -> Optional[str]:
    """
    Decide which training to perform:
    - Junior Year → most_support_card
    - Otherwise → rainbow_training (fallback to most_support_card)
    """
    year = check_current_year()
    current_stats = stat_state()
    debug(f"Current stats: {current_stats}")

    filtered = filter_by_stat_caps(results, current_stats)

    if not filtered:
        info("[INFO] All stats capped or no valid training.")
        return None

    if "Junior Year" in year:
        return most_support_card(filtered)
    else:
        result = rainbow_training(filtered)
        if result is None:
            info("[INFO] Falling back to most_support_card because rainbow not available.")
            return most_support_card(filtered)
    return result
