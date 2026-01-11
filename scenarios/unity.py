import utils.constants as constants
import utils.device_action_wrapper as device_action
import core.config as config
from core.state import CleanDefaultDict
from utils.log import error, info, warning, debug, debug_window
from utils.tools import get_secs, sleep

TEAM_MATCHUP_TEMPLATES = {
  "affinity_0": "assets/unity/unity_affinity_0.png",
  "affinity_1": "assets/unity/unity_affinity_1.png",
  "affinity_2": "assets/unity/unity_affinity_2.png",
  "affinity_3": "assets/unity/unity_affinity_3.png",
}

if not hasattr(config, "UNITY_MINIMUM_MATCHUP_SCORE"):
  config.UNITY_MINIMUM_MATCHUP_SCORE = 11

def find_best_match(matchups):
  best_match = matchups[0]
  best_match_score = best_match["score"]
  for matchup in matchups:
    if matchup["score"] > config.UNITY_MINIMUM_MATCHUP_SCORE:
      return matchup
    elif matchup["score"] > best_match_score:
      best_match = matchup
      best_match_score = matchup["score"]
  return best_match

def unity_cup_function():
  tries = 0
  while True:
    device_action.flush_screenshot_cache()
    screenshot = device_action.screenshot()
    select_opponent_btn = device_action.locate("assets/unity/select_opponent_btn.png")
    s_rank_opponent = device_action.locate("assets/unity/s_rank_opponent.png", region_ltrb=constants.SCREEN_MIDDLE_BBOX)
    sleep(0.25)
    if select_opponent_btn:
      break
    elif s_rank_opponent:
      break
    tries += 1
    if tries > 20:
      raise ValueError("Select opponent button not found, please report this.")
  rank_matches = device_action.match_template("assets/unity/team_rank.png", screenshot)
  if not select_opponent_btn and not s_rank_opponent:
    raise ValueError("Select opponent and zenith race button not found, please report this.")
  elif select_opponent_btn:
    select_opponent_mouse_pos = (select_opponent_btn[0], select_opponent_btn[1])
  elif s_rank_opponent:
    sleep(1)
    device_action.click(target=(constants.SKILL_SCROLL_BOTTOM_MOUSE_POS))
    sleep(1)
    device_action.locate_and_click("assets/unity/start_unity_match.png", min_search_time=get_secs(2))
    sleep(1)
    device_action.locate_and_click("assets/unity/see_results.png", min_search_time=get_secs(15), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    sleep(2)
    device_action.locate_and_click("assets/buttons/skip_btn.png", min_search_time=get_secs(5), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    return True
  if len(rank_matches) == 0:
    raise ValueError("Team rank not found, please report this.")
  matchups = []
  # sort matchups by Y coords
  rank_matches.sort(key=lambda x: x[1])
  # for every opponent team
  for rank_match in rank_matches:
    count = CleanDefaultDict()
    x, y, w, h = rank_match
    offset_x = constants.GAME_WINDOW_BBOX[0]
    offset_y = constants.GAME_WINDOW_BBOX[1]
    x = x + offset_x + w // 2
    y = y + offset_y + h // 2
    device_action.click(target=(x, y))
    count["mouse_pos"] = (x, y)
    device_action.click(select_opponent_mouse_pos)
    tries = 0
    while tries < 10:
      if device_action.locate("assets/unity/unity_tazuna.png"):
        break
      tries += 1
      if tries > 10:
        raise ValueError("Affinity screen not found, please report this.")
      device_action.flush_screenshot_cache()
    
    screenshot = device_action.screenshot(region_xywh=constants.UNITY_TEAM_MATCHUP_REGION)
    debug_window(screenshot, save_name="unity_team_matchup")
    
    # find all affinity vs opponent team
    for name, path in TEAM_MATCHUP_TEMPLATES.items():
      matches = device_action.match_template(path, screenshot)
      # if affinity found, count it
      for match in matches:
        count["score"] += int(name.split("_")[1])
        count[name] += 1
    matchups.append(count)
    device_action.locate_and_click("assets/buttons/cancel_btn.png")
    # max of 5 matches, if all is double circle, stop looking at the others since they're the same
    if count["affinity_3"] > 4:
      break
  debug(f"Unity matchups: {matchups}")
  best_match = find_best_match(matchups)
  device_action.click(target=(best_match["mouse_pos"][0], best_match["mouse_pos"][1]))
  device_action.click(select_opponent_mouse_pos)
  sleep(0.5)
  device_action.locate_and_click("assets/unity/start_unity_match.png", min_search_time=get_secs(2))
  sleep(1)
  device_action.locate_and_click("assets/unity/see_results.png", min_search_time=get_secs(15), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  sleep(2)
  device_action.locate_and_click("assets/buttons/skip_btn.png", min_search_time=get_secs(5), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  return True
