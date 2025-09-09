"""
- Centralizes screen-locate behavior via utils.screen.safe_locate_center and safe_locate_all
- Uses utils.log for structured logging (setup in main.py)
- Adds defensive checks to avoid exceptions when templates are missing
- Unifies and deduplicates race-skip logic into skip_race_flow()
- Keeps original behavior but makes timeouts, thresholds and retries configurable (via state/config)
"""

import time
import re
from typing import Optional, Tuple, List, Dict, Any

import pyautogui
from PIL import ImageGrab

# Keep original behavior for image-not-found handling consistent with repo history
try:
    pyautogui.useImageNotFoundException(False)
except Exception:
    # older/newer pyautogui might not support this; ignore if unavailable
    pass

# Core project imports
import core.state as state
from core.state import (
    check_support_card,
    check_failure,
    check_turn,
    check_mood,
    check_current_year,
    check_criteria,
    check_skill_pts,
    check_energy_level,
    get_race_type,
)
from core.logic import do_something
from core.recognizer import is_btn_active, match_template, multi_match_templates
from core.skill import buy_skill
from utils.constants import (
    MOOD_LIST,
    SCREEN_BOTTOM_REGION,
    SCREEN_MIDDLE_REGION,
    SKIP_BTN_BIG_REGION,
    SCREEN_TOP_REGION,
)
from utils.screen import safe_locate_center, safe_locate_all
from utils.log import info, debug, warning, error

# Scenario and skill helpers
from utils.scenario import ura

# --- Static template dictionaries ------------------------------------------------
templates = {
    "event": "assets/icons/event_choice_1.png",
    "inspiration": "assets/buttons/inspiration_btn.png",
    "next": "assets/buttons/next_btn.png",
    "cancel": "assets/buttons/cancel_btn.png",
    "tazuna": "assets/ui/tazuna_hint.png",
    "infirmary": "assets/buttons/infirmary_btn.png",
    "retry": "assets/buttons/retry_btn.png",
}

training_types = {
    "spd": "assets/icons/train_spd.png",
    "sta": "assets/icons/train_sta.png",
    "pwr": "assets/icons/train_pwr.png",
    "guts": "assets/icons/train_guts.png",
    "wit": "assets/icons/train_wit.png",
}

# --- Helper: unified click wrapper ------------------------------------------------
def click(
    img: Optional[str] = None,
    confidence: float = 0.85,
    minSearch: float = 1.0,
    click_count: int = 1,
    text: str = "",
    boxes: Optional[List[Tuple[int, int, int, int]]] = None,
    region: Optional[Tuple[int, int, int, int]] = None,
    retries: int = 2,
) -> bool:
    """
    Robust click helper.
    - If `boxes` is provided and non-empty, click the first box center.
    - Otherwise try to locate `img` using safe_locate_center (retries).
    - Returns True on success (click performed), False otherwise.
    """
    if not state.is_bot_running:
        debug("click: bot not running, skipping click for %s", img or boxes)
        return False

    try:
        # boxes path (from multi_match_templates)
        if boxes is not None:
            if isinstance(boxes, list):
                if len(boxes) == 0:
                    debug("click: boxes provided but empty")
                    return False
                box = boxes[0]
            else:
                # support a single box tuple/object
                box = boxes

            # normalize box => (x,y,w,h)
            try:
                x, y, w, h = box
            except Exception:
                # If the match format is (centerX, centerY) or other, handle gracefully
                if isinstance(box, tuple) and len(box) == 2:
                    center_x, center_y = box
                    pyautogui.moveTo(center_x, center_y, duration=0.18)
                    pyautogui.click(clicks=click_count)
                    if text:
                        info(text)
                    return True
                debug("click: unknown box format: %s", box)
                return False

            cx = x + (w // 2)
            cy = y + (h // 2)
            pyautogui.moveTo(cx, cy, duration=0.18)
            pyautogui.click(clicks=click_count)
            if text:
                info(text)
            return True

        # no boxes, must have an image
        if img is None:
            debug("click: no img and no boxes provided")
            return False

        found = safe_locate_center(img, confidence=confidence, region=region, retries=retries, min_search_time=minSearch)
        if found:
            # safe_locate_center returns center or None
            pyautogui.moveTo(found[0], found[1], duration=0.18)
            pyautogui.click(clicks=click_count)
            if text:
                info(text)
            return True

        debug("click: image not found: %s", img)
        return False

    except Exception as exc:
        warning("click: exception while clicking %s: %s", img or boxes, exc)
        return False


# --- Short wrappers for common buttons ------------------------------------------
def go_to_training() -> bool:
    return click("assets/buttons/training_btn.png", minSearch=2, retries=3)


def do_train(train: str) -> None:
    """Triple-click the training icon in the bottom region if present."""
    img = f"assets/icons/train_{train}.png"
    if safe_locate_center(img, confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=2, min_search_time=0.5):
        # use tripleClick at the center returned
        center = safe_locate_center(img, confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=1)
        if center:
            try:
                pyautogui.tripleClick(center, interval=0.12, duration=0.2)
            except Exception as exc:
                warning("do_train: tripleClick failed for %s: %s", img, exc)


def do_rest(energy_level: int) -> None:
    """Click rest button unless NEVER_REST_ENERGY policy prohibits it."""
    try:
        if state.NEVER_REST_ENERGY and energy_level > state.NEVER_REST_ENERGY:
            info("[INFO] Wanted to rest but energy above NEVER_REST_ENERGY (%s). Skipping rest.", state.NEVER_REST_ENERGY)
            return

        rest_btn = safe_locate_center("assets/buttons/rest_btn.png", confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=2)
        rest_summer_btn = safe_locate_center("assets/buttons/rest_summer_btn.png", confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=2)

        if rest_btn:
            pyautogui.moveTo(rest_btn[0], rest_btn[1], duration=0.15)
            pyautogui.click()
        elif rest_summer_btn:
            pyautogui.moveTo(rest_summer_btn[0], rest_summer_btn[1], duration=0.15)
            pyautogui.click()
    except Exception as exc:
        warning("do_rest: exception: %s", exc)


def do_recreation() -> None:
    try:
        recreation_btn = safe_locate_center("assets/buttons/recreation_btn.png", confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=2)
        recreation_summer_btn = safe_locate_center("assets/buttons/rest_summer_btn.png", confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=2)

        if recreation_btn:
            pyautogui.moveTo(recreation_btn[0], recreation_btn[1], duration=0.15)
            pyautogui.click()
        elif recreation_summer_btn:
            pyautogui.moveTo(recreation_summer_btn[0], recreation_summer_btn[1], duration=0.15)
            pyautogui.click()
    except Exception as exc:
        warning("do_recreation: exception: %s", exc)


# --- Unified race skip flow (refactored) ---------------------------------------
def _triple_click_at_center(center: Tuple[int, int]) -> None:
    """Helper to triple-click a (x,y) center safely."""
    try:
        pyautogui.tripleClick(center, interval=0.18)
    except Exception as exc:
        warning("_triple_click_at_center: failed triple click at %s: %s", center, exc)


def _try_skip_buttons() -> bool:
    """Try the common skip button variants and return True if any skip action was taken."""
    # normal skip button
    skip_btn = safe_locate_center("assets/buttons/skip_btn.png", confidence=0.9, region=SCREEN_BOTTOM_REGION, retries=3)
    if skip_btn:
        _triple_click_at_center(skip_btn)
        time.sleep(0.45)
        return True

    # big skip button (landscape/emulator)
    skip_btn_big = safe_locate_center("assets/buttons/skip_btn_big.png", confidence=0.9, region=SKIP_BTN_BIG_REGION, retries=2)
    if skip_btn_big:
        _triple_click_at_center(skip_btn_big)
        time.sleep(0.45)
        return True

    return False


def skip_race_flow() -> bool:
    """
    Unified skip flow used by race_prep.
    Returns True if skip flow succeeded or advanced the UI; False otherwise.
    """
    info("skip_race_flow: starting")
    try:
        if _try_skip_buttons():
            info("skip_race_flow: skip button used")
            return True

        # Fallback: click race button to open race UI, click exclamation, then re-try skip buttons
        race_btn = safe_locate_center("assets/buttons/race_btn.png", confidence=0.85, retries=2, min_search_time=0.7, region=SCREEN_BOTTOM_REGION)
        if race_btn:
            info("skip_race_flow: clicked race button to open race UI")
            pyautogui.click(race_btn[0], race_btn[1])
            time.sleep(6)  # give UI time to load

            ex_btn = safe_locate_center("assets/buttons/race_exclamation_btn.png", confidence=0.9, retries=2, min_search_time=0.5)
            if not ex_btn:
                ex_btn = safe_locate_center("assets/buttons/race_exclamation_btn_portrait.png", confidence=0.9, retries=1, min_search_time=0.5)
            if ex_btn:
                pyautogui.click(ex_btn[0], ex_btn[1])
                time.sleep(0.4)
                # try skip again
                if _try_skip_buttons():
                    info("skip_race_flow: skip after exclamation succeeded")
                    return True

        info("skip_race_flow: could not find skip flow")
        return False

    except Exception as exc:
        warning("skip_race_flow: exception: %s", exc)
        return False


# --- Race selection and prep ----------------------------------------------------
def race_select(prioritize_g1: bool = False) -> bool:
    """
    Look for a race to run. This function tries to be robust across scrolls and
    multiple pages. Returns True if a race was selected and race button clicked.
    """
    try:
        # quick mouse nudges to avoid overlays messing with locate
        pyautogui.moveTo(560, 680)
        time.sleep(0.18)

        if prioritize_g1:
            info("race_select: prioritizing G1 race")
            # attempt 2 passes to find G1 race card
            for _ in range(2):
                g1_cards = match_template("assets/ui/g1_race.png", threshold=0.9) or []
                if g1_cards:
                    for x, y, w, h in g1_cards:
                        region = (x, y, 310, 90)
                        match_aptitude = safe_locate_center("assets/ui/match_track.png", confidence=0.85, min_search_time=0.6, region=region, retries=2)
                        if match_aptitude:
                            info("race_select: found G1 race; selecting")
                            pyautogui.click(match_aptitude[0], match_aptitude[1])
                            # click race button twice to confirm
                            for _ in range(2):
                                click(img="assets/buttons/race_btn.png", minSearch=1)
                                time.sleep(0.5)
                            return True
                # scroll some and retry
                for _ in range(4):
                    pyautogui.scroll(-300)
                    time.sleep(0.12)
            return False

        # non-G1 search: look for match_track on-screen and click
        info("race_select: looking for matching race")
        for _ in range(4):
            match_aptitude = safe_locate_center("assets/ui/match_track.png", confidence=0.85, min_search_time=0.6, retries=2)
            if match_aptitude:
                info("race_select: race found; selecting")
                pyautogui.click(match_aptitude[0], match_aptitude[1])
                for _ in range(2):
                    click(img="assets/buttons/race_btn.png", minSearch=1)
                    time.sleep(0.45)
                return True
            for _ in range(4):
                pyautogui.scroll(-300)
                time.sleep(0.12)
        return False

    except Exception as exc:
        warning("race_select: exception: %s", exc)
        return False


def race_prep() -> None:
    """
    Prepare for race: position selection, skip flow, and handle race result screens.
    This function attempts to be defensive and tolerant of missing assets.
    """
    global PREFERRED_POSITION_SET

    try:
        if state.POSITION_SELECTION_ENABLED:
            # if positions by race are enabled, prefer that first
            if state.ENABLE_POSITIONS_BY_RACE:
                # open info panel (if present) and parse race type
                click(img="assets/buttons/info_btn.png", minSearch=2, region=SCREEN_TOP_REGION)
                time.sleep(0.45)
                race_info_text = get_race_type() or ""
                # parse text like "Race name (Mile)" and get the part in parentheses
                match_race_type = re.search(r"\(([^)]+)\)", race_info_text)
                race_type = match_race_type.group(1).strip().lower() if match_race_type else None
                # close info panel if it's open
                click(img="assets/buttons/close_btn.png", minSearch=1, region=SCREEN_BOTTOM_REGION)
                if race_type:
                    # ensure mapping exists with fallbacks
                    position_for_race = state.POSITIONS_BY_RACE.get(race_type, state.PREFERRED_POSITION)
                    info("race_prep: selecting %s position for race type %s", position_for_race, race_type)
                    click(img="assets/buttons/change_btn.png", minSearch=2, region=SCREEN_MIDDLE_REGION)
                    click(img=f"assets/buttons/positions/{position_for_race}_position_btn.png", minSearch=1, region=SCREEN_MIDDLE_REGION)
                    click(img="assets/buttons/confirm_btn.png", minSearch=1, region=SCREEN_MIDDLE_REGION)
            elif not PREFERRED_POSITION_SET:
                # use global preferred position if not already set
                click(img="assets/buttons/change_btn.png", minSearch=2, region=SCREEN_MIDDLE_REGION)
                click(img=f"assets/buttons/positions/{state.PREFERRED_POSITION}_position_btn.png", minSearch=1, region=SCREEN_MIDDLE_REGION)
                click(img="assets/buttons/confirm_btn.png", minSearch=1, region=SCREEN_MIDDLE_REGION)
                PREFERRED_POSITION_SET = True

        # Handle view results -> skip screens
        view_result_btn = safe_locate_center("assets/buttons/view_results.png", confidence=0.88, min_search_time=2, region=SCREEN_BOTTOM_REGION, retries=3)
        if view_result_btn:
            # click through result screens
            pyautogui.click(view_result_btn[0], view_result_btn[1])
            time.sleep(0.45)
            # some screens require triple click to advance quickly
            try:
                for _ in range(2):
                    pyautogui.tripleClick(interval=0.2)
                    time.sleep(0.4)
                pyautogui.click()  # final click to ensure focus
            except Exception:
                # if tripleClick isn't available, fall back to single clicks
                pyautogui.click()
                time.sleep(0.25)

        # If "Next" button is available normally, simply proceed; otherwise enter skip flow
        next_button = safe_locate_center("assets/buttons/next_btn.png", confidence=0.9, min_search_time=1.5, region=SCREEN_BOTTOM_REGION, retries=2)
        if not next_button:
            info("race_prep: next button not found, attempting skip flow")
            # Try a robust skip flow
            if skip_race_flow():
                info("race_prep: skip flow succeeded")
            else:
                # final attempt: try to find skip btn with longer search times
                skip_btn = safe_locate_center("assets/buttons/skip_btn.png", confidence=0.8, region=SCREEN_BOTTOM_REGION, retries=2, min_search_time=4)
                skip_btn_big = safe_locate_center("assets/buttons/skip_btn_big.png", confidence=0.8, region=SKIP_BTN_BIG_REGION, retries=2, min_search_time=4)
                if skip_btn:
                    _triple_click_at_center(skip_btn)
                if skip_btn_big:
                    _triple_click_at_center(skip_btn_big)
                # attempt to close trophy/close dialogs if present
                time.sleep(1.2)
                close_btn = safe_locate_center("assets/buttons/close_btn.png", confidence=0.85, retries=2, min_search_time=1)
                if close_btn:
                    try:
                        pyautogui.tripleClick(close_btn, interval=0.2)
                    except Exception:
                        pyautogui.click(close_btn[0], close_btn[1])
        else:
            info("race_prep: next button found, proceeding normally")
            # click next button to advance
            pyautogui.click(next_button[0], next_button[1])
            time.sleep(0.25)

    except Exception as exc:
        warning("race_prep: exception encountered: %s", exc)


def after_race() -> None:
    """Advance through after-race screens safely."""
    try:
        click(img="assets/buttons/next_btn.png", minSearch=1)
        time.sleep(0.25)
        pyautogui.click()  # sometimes needed for focus
        click(img="assets/buttons/next2_btn.png", minSearch=1)
    except Exception as exc:
        warning("after_race: exception: %s", exc)


# --- Skill buying ---------------------------------------------------------------
def auto_buy_skill() -> None:
    """
    Attempts to buy a skill when there are enough skill points and config allows.
    Uses buy_skill() to perform selection logic and then confirms via UI clicks.
    """
    try:
        if check_skill_pts() < state.SKILL_PTS_CHECK:
            return

        click(img="assets/buttons/skills_btn.png", minSearch=1)
        info("[INFO] Buying skills")
        time.sleep(0.5)

        if buy_skill():
            # confirm & learn sequence
            click(img="assets/buttons/confirm_btn.png", minSearch=1, region=SCREEN_BOTTOM_REGION)
            time.sleep(0.4)
            click(img="assets/buttons/learn_btn.png", minSearch=1, region=SCREEN_BOTTOM_REGION)
            time.sleep(0.4)
            click(img="assets/buttons/close_btn.png", minSearch=1, region=SCREEN_MIDDLE_REGION)
            time.sleep(0.3)
            click(img="assets/buttons/back_btn.png", minSearch=1)
        else:
            info("[INFO] No matching skills found. Going back.")
            click(img="assets/buttons/back_btn.png", minSearch=1)

    except Exception as exc:
        warning("auto_buy_skill: exception: %s", exc)


# --- Training check -------------------------------------------------------------
def check_training() -> Dict[str, Any]:
    """
    Scan each training icon at the bottom region, hold/drag to reveal support cards,
    compute support-card hints & failure chance, and return a result map.
    """
    results: Dict[str, Any] = {}
    margin = getattr(state, "FAILURE_MARGIN", 5)  # fallback margin

    # We'll attempt to locate each training icon in the bottom region using safe_locate_center.
    try:
        # Press-and-hold approach: we'll click and hold if icon present to show support cards
        for key, icon_path in training_types.items():
            pos = safe_locate_center(icon_path, confidence=0.85, region=SCREEN_BOTTOM_REGION, retries=2, min_search_time=0.5)
            if not pos:
                continue

            # move and hold to reveal support details
            pyautogui.moveTo(pos[0], pos[1], duration=0.12)
            pyautogui.mouseDown()
            time.sleep(0.12)  # allow UI to open
            # gather matches of support cards using recognizer if available (multi_match_templates)
            # we attempt to find support-card templates (this recognizer returns rectangles)
            # If multi_match_templates is not available or returns nothing, fallback to an empty list
            try:
                support_matches = multi_match_templates("assets/ui/support_card.png", threshold=0.8) or []
            except Exception:
                support_matches = []

            # perform failure-chance logic similar to original, but defensive
            # original logic used a state machine failcheck variable; we emulate simplified behavior:
            failure_chance = 0
            if key != "wit":
                failure_chance = check_failure() or 0
                # clamp or adjust by margin
                if failure_chance > (state.MAX_FAILURE + margin):
                    info("[%s] Failure rate high (%s), skipping further train checks for some types", key.upper(), failure_chance)
                    failure_chance = min(failure_chance, state.MAX_FAILURE + margin)
                elif failure_chance < (state.MAX_FAILURE - margin):
                    # treat as safe to train
                    failure_chance = 0
            else:
                # for wit, follow existing logic: prefer to do it if safe
                failure_chance = check_failure() or 0

            # Ask state-level helper to compute support-card results; if API expects screen or matches,
            # pass matches in (it will limit its search region).
            try:
                support_card_results = check_support_card(support_matches)
            except Exception as exc:
                warning("check_training: check_support_card raised: %s", exc)
                support_card_results = {"total_supports": 0, "total_friendship_levels": 0, "total_hints": 0}

            support_card_results["failure"] = failure_chance
            results[key] = support_card_results

            info("[%s] → Total Supports %s, Levels:%s , Fail: %s%%",
                 key.upper(),
                 support_card_results.get("total_supports", 0),
                 support_card_results.get("total_friendship_levels", 0),
                 failure_chance)

            time.sleep(0.1)
            pyautogui.mouseUp()

    except Exception as exc:
        warning("check_training: exception scanning trainings: %s", exc)
        # ensure mouseUp in case of early return
        try:
            pyautogui.mouseUp()
        except Exception:
            pass

    # ensure we exit with mouseUp and return results
    try:
        click(img="assets/buttons/back_btn.png", minSearch=1)
    except Exception:
        pass

    return results


# --- Career lobby main loop -----------------------------------------------------
PREFERRED_POSITION_SET = False


def career_lobby() -> None:
    """
    Main loop for career flow. Keeps running while state.is_bot_running is True.
    Read-only detection is optimized by using a screenshot and multi_match_templates for faster batch detection.
    """
    global PREFERRED_POSITION_SET
    PREFERRED_POSITION_SET = False

    info("career_lobby: starting main loop")
    while state.is_bot_running:
        # Grab a screenshot for batch recognition to reduce repeated screen reads.
        try:
            screen = ImageGrab.grab()
        except Exception as exc:
            warning("career_lobby: ImageGrab failed: %s", exc)
            # fallback: continue and let safe_locate_center operate directly on screen
            screen = None

        # Attempt to run a bulk template matcher if available. multi_match_templates in repo expects a dict.
        matches = {}
        try:
            matches = multi_match_templates(templates, screen=screen) or {}
        except Exception as exc:
            # If recognizer fails, continue with empty matches and rely on safe_locate_center where needed.
            warning("career_lobby: multi_match_templates failed: %s", exc)
            matches = {}

        # helper lambda to check existence safely
        def has_match(key_name: str) -> bool:
            try:
                return bool(matches.get(key_name))
            except Exception:
                return False

        # Quick responses to modal-like screens (use boxes if provided)
        if has_match("event") and click(boxes=matches.get("event"), text="[INFO] Event found, selecting top choice."):
            time.sleep(0.2)
            continue
        if has_match("inspiration") and click(boxes=matches.get("inspiration"), text="[INFO] Inspiration found."):
            time.sleep(0.2)
            continue
        if has_match("next") and click(boxes=matches.get("next")):
            time.sleep(0.2)
            continue
        if has_match("cancel") and click(boxes=matches.get("cancel")):
            time.sleep(0.2)
            continue
        if has_match("retry") and click(boxes=matches.get("retry")):
            time.sleep(0.2)
            continue

        # If tazuna hint isn't present, we are likely not in the lobby; print a dot and loop
        if not has_match("tazuna"):
            print(".", end="", flush=True)
            time.sleep(0.45)
            continue

        # check energy/mood/turn/year/criteria
        try:
            energy_level, max_energy = check_energy_level()
        except Exception as exc:
            warning("career_lobby: check_energy_level failed: %s", exc)
            energy_level, max_energy = 0, 0

        # infirmary handling
        try:
            if (max_energy - energy_level) > getattr(state, "SKIP_INFIRMARY_UNLESS_MISSING_ENERGY", 0):
                if has_match("infirmary"):
                    # check button active first (some matches include the button image even when disabled)
                    try:
                        if is_btn_active(matches["infirmary"][0]):
                            click(boxes=matches["infirmary"][0], text="[INFO] Character debuffed, going to infirmary.")
                            time.sleep(0.4)
                            continue
                    except Exception as exc:
                        debug("career_lobby: is_btn_active check failed: %s", exc)
        except Exception as exc:
            debug("career_lobby: infirmary check exception: %s", exc)

        # mood / state
        try:
            mood = check_mood()
            mood_index = MOOD_LIST.index(mood) if mood in MOOD_LIST else 0
            minimum_mood = MOOD_LIST.index(state.MINIMUM_MOOD) if state.MINIMUM_MOOD in MOOD_LIST else 0
            minimum_mood_junior_year = MOOD_LIST.index(state.MINIMUM_MOOD_JUNIOR_YEAR) if state.MINIMUM_MOOD_JUNIOR_YEAR in MOOD_LIST else 0
        except Exception as exc:
            warning("career_lobby: check_mood failed: %s", exc)
            mood = MOOD_LIST[0]
            mood_index = 0
            minimum_mood = 0
            minimum_mood_junior_year = 0

        try:
            turn = check_turn() or ""
            year = check_current_year() or ""
            criteria = check_criteria() or ""
            year_parts = year.split(" ")
        except Exception as exc:
            warning("career_lobby: failed to read turn/year/criteria: %s", exc)
            turn, year, criteria, year_parts = "", "", "", []

        # Logging header
        print("\n" + "=" * 95 + "\n")
        print(f"Year: {year}")
        print(f"Mood: {mood}")
        print(f"Turn: {turn}\n")

        # URA scenario (Finale)
        if year == "Finale Season" and turn == "Race Day":
            info("[INFO] URA Finale")
            if getattr(state, "IS_AUTO_BUY_SKILL", False):
                auto_buy_skill()
            try:
                ura()  # scenario function may perform clicks; let it run
            except Exception as exc:
                warning("career_lobby: ura() failed: %s", exc)

            # try to click race button twice if present
            for _ in range(2):
                if click(img="assets/buttons/race_btn.png", minSearch=1):
                    time.sleep(0.4)
            race_prep()
            time.sleep(0.8)
            after_race()
            continue

        # Race day (not finale)
        if turn == "Race Day" and year != "Finale Season":
            info("[INFO] Race Day.")
            if getattr(state, "IS_AUTO_BUY_SKILL", False) and (not year.startswith("Junior")):
                auto_buy_skill()
            race_day()
            continue

        # Mood check and recreation
        if year_parts and year_parts[0] == "Junior":
            if mood_index < minimum_mood_junior_year:
                info("[INFO] Mood is low, trying recreation to increase mood")
                do_recreation()
                time.sleep(0.6)
                continue
        else:
            if mood_index < minimum_mood:
                info("[INFO] Mood is low, trying recreation to increase mood")
                do_recreation()
                time.sleep(0.6)
                continue

        # Criteria/race decision logic (defensive)
        try:
            criteria_token = criteria.split(" ")[0] if criteria else ""
            if criteria_token != "criteria" and year != "Junior Year Pre-Debut" and (isinstance(turn, int) and turn < 10 or (isinstance(turn, str) and turn.isdigit() and int(turn) < 10)) and criteria != "Goal Achievedl":
                race_found = do_race()
                if race_found:
                    continue
                else:
                    click(img="assets/buttons/back_btn.png", minSearch=1, text="[INFO] Race not found. Proceeding to training.")
                    time.sleep(0.5)
        except Exception as exc:
            debug("career_lobby: criteria/race branch exception: %s", exc)

        # Prioritize G1 logic (defensive)
        try:
            if getattr(state, "PRIORITIZE_G1_RACE", False) and year_parts and year_parts[0] != "Junior" and len(year_parts) > 3 and year_parts[3] not in ["Jul", "Aug"]:
                g1_race_found = do_race(state.PRIORITIZE_G1_RACE)
                if g1_race_found:
                    continue
                else:
                    click(img="assets/buttons/back_btn.png", minSearch=1, text="[INFO] G1 race not found. Proceeding to training.")
                    time.sleep(0.5)
        except Exception as exc:
            debug("career_lobby: G1 branch exception: %s", exc)

        # Check training button and perform training if possible
        if not go_to_training():
            info("[INFO] Training button is not found.")
            time.sleep(0.8)
            continue

        time.sleep(0.45)
        results_training = check_training()
        best_training = do_something(results_training)
        if best_training:
            go_to_training()
            time.sleep(0.35)
            do_train(best_training)
        else:
            # determine energy level again to decide rest
            try:
                energy_level, _ = check_energy_level()
            except Exception:
                energy_level = 0
            do_rest(energy_level)

        # small sleep to avoid tight loop and reduce CPU
        time.sleep(0.9)


# --- Minimal race_day implementation (kept close to original behavior) ----------
def race_day() -> None:
    """
    Quick helper that navigates the minimal race day flow used in original script.
    It tries to click race_day -> ok -> race buttons and then goes into race_prep/after_race.
    """
    try:
        click(img="assets/buttons/race_day_btn.png", minSearch=2)
        click(img="assets/buttons/ok_btn.png", minSearch=1)
        time.sleep(0.4)

        for _ in range(2):
            click(img="assets/buttons/race_btn.png", minSearch=1)
            time.sleep(0.4)

        race_prep()
        time.sleep(0.8)
        after_race()
    except Exception as exc:
        warning("race_day: exception: %s", exc)
