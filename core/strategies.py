import core.trainings
import utils.constants as constants
import core.config as config
from utils.shared import check_status_effects
from core.actions import Action
from core.recognizer import compare_brightness
from utils.log import error, warning, info, debug
from utils.tools import remove_if_exists, sleep, get_secs, click
import utils.device_action_wrapper as device_action

class Strategy:

  def __init__(self):
    """
    :param name: Name of the strategy (for logging or future use)
    :param config: Dict mapping calendar keys to function names (as strings)
                   e.g. { "Junior Year": "max_out_friendships" }
    """
    self.name = config.TRAINING_STRATEGY["name"]
    self.timeline = config.TRAINING_STRATEGY["timeline"]
    self.templates = config.TRAINING_STRATEGY["templates"]
    self.last_template = None
    self.first_decision_done = False
    self.erroneous_action = { "name": "error", "option": "no_action" }
    first_filter_done = False 

  def decide(self, state, action):
    #TODO: add support for last 3 turns not being wasted by resting
    debug(f"Starting decision for turn {state.get('turn', 'unknown')} in {state['year']}")
    #check if state is valid otherwise return no_action

    if not self.validate_state(state):
      action.func = "no_action"
      return action

    training_template = self.get_training_template(state)

    action = self.get_action(state, training_template, action)

    action["energy_level"] = state["energy_level"]
    action["training_function"] = training_template["training_function"]

    if action.available_actions:
      debug(f"Available actions: {action.available_actions}")
      year_index = constants.TIMELINE.index(state["year"])
      end_index = len(constants.TIMELINE)
      turns_remaining = end_index - year_index
      target_stat_gap = {}
      for stat, value in training_template["target_stat_set"].items():
        target_stat_gap[stat] = value - state["current_stats"][stat]
        target_stat_gap[stat] = max(0, target_stat_gap[stat])
      # Strategic decision based on target gaps
      total_gap = sum(target_stat_gap.values())

      if "status_effect_names" in action.options and "Slow Metabolism" in action["status_effect_names"]:
        if action["training_function"] in ["meta_training", "most_stat_gain"]:
          action["available_trainings"].pop("spd", None)
      if state["energy_level"] < 50:
        if state["date_event_available"]:
          action.available_actions.append("do_recreation")
        else:
          action.available_actions.append("do_rest")

      if action.func != "do_race":
        if "Early Jun" in state["year"] or "Late Jun" in state["year"]:
          if state["turn"] != "Race Day" and state["energy_level"] < config.REST_BEFORE_SUMMER_ENERGY:
            action.func = "do_rest"
            info(f"Resting before summer: {state['energy_level']} < {config.REST_BEFORE_SUMMER_ENERGY}")
            return action

      debug(f"Initial action choice: {action.func}")

      # Dynamic action evaluation
      if action.func == "do_training":
        debug("Evaluating training alternatives...")
        action = self.evaluate_training_alternatives(state, action)

      if action.func == "do_training":
        if total_gap < 100 and action["can_mood_increase"]:
          action.func = "do_recreation"
          info(f"Prioritizing recreation because we are close to targets and mood can be increased - total gap: {total_gap}")
        else:
          info(f"Training needed - total gap: {total_gap}")

      info(f"Target stat gap: {target_stat_gap}")
      info(f"Action function: {action.func}")
      info(f"Action: {action}")
      return action
    else:
      action.func = "skip_turn"
      warning(f"Skipping turn because no actions are available, this should not happen.")
      info(f"Action function: {action.func}")
      info(f"Action: {action}")
      return action

  def get_training_template(self, state):
    if not self.first_decision_done:
      current_year = state["year"]
      for year_slot in constants.TIMELINE:
        if year_slot in self.timeline:
          self.last_template = self.timeline[year_slot]
        if year_slot == current_year:
          break
      self.first_decision_done = True

    current_year_long = state["year"]
    template_name = self.timeline.get(current_year_long, self.last_template)
    if template_name != self.last_template:
      self.last_template = template_name
    info(f"Using template: {template_name} for {current_year_long}")
    return self.templates[template_name]

  def get_action(self, state, training_template, action):
    if not training_template:
      error(f"Couldn't find training function name. Template: {training_template}")
      return self.erroneous_action
    debug(f"Using training template: {training_template}")
    action_sequence = training_template['action_sequence_set']

    training_function_name = training_template['training_function']
    info(f"Selected training: {training_function_name}")

    training_type = getattr(core.trainings, training_function_name)

    action = self.get_action_by_sequence(state, action_sequence, training_type, training_template, action)
    if not isinstance(action, Action):
      error(f"Training function {training_function_name} didn't return an Action")
      return self.erroneous_action
    else:
      return action

  def get_action_by_sequence(self, state, action_sequence, training_type, training_template, action):
    info(f"Evaluating action sequence: {action_sequence}")

    for name in action_sequence:
      if name == "rest":
        action.available_actions.append("do_rest")
        continue
      function_name = getattr(self, f"check_{name}")
      if name == "training":
        action = function_name(state, action, training_type, training_template)
      else:
        action = function_name(state, action)

    if not action.func:
      debug("No action selected, using priority fallback")
      current_energy = state["energy_level"]
      if current_energy > config.NEVER_REST_ENERGY:
        remove_if_exists(action.available_actions, ["do_recreation", "do_infirmary", "do_rest"])
        if len(action.available_actions) == 0:
          action.func = "no_action"
        else:
          action.func = action.available_actions[0]
        debug(f"High energy fallback: {action.func}")
      elif current_energy < config.SKIP_TRAINING_ENERGY:
        if state["date_event_available"]:
          action.func = "do_recreation"
          action.available_actions.append("do_recreation")
        else:
          action.func = "do_rest"
          action.available_actions.append("do_rest")
        
        debug("Low energy: forcing rest")
      elif current_energy < 50:
        action.available_actions.append("do_rest")
        if len(action.available_actions) == 0:
          action.func = "do_rest"
        else:
          action.func = action.available_actions[0]
      else:
        if len(action.available_actions) == 0:
          action.func = "no_action"
        else:
          action.func = action.available_actions[0]
        debug(f"Normal energy fallback: {action.func}")

    return action

  def check_infirmary(self, state, action):
    screenshot = device_action.screenshot(region_ltrb=constants.SCREEN_BOTTOM_BBOX)
    infirmary_matches = device_action.match_template("assets/buttons/infirmary_btn.png", screenshot, threshold=0.85)
    if len(infirmary_matches) == 0:
      info("No infirmary button found.")
      return action
    # add screen bottom bbox x, y to match x, y so that we can take the image of it below
    infirmary_screen_image = device_action.screenshot_match(match=infirmary_matches[0], region=constants.SCREEN_BOTTOM_BBOX)
    if compare_brightness(template_path="assets/buttons/infirmary_btn.png", other=infirmary_screen_image):
      status_effect_names, total_severity = check_status_effects()
      state["status_effect_names"] = status_effect_names
      missing_energy = state["max_energy"] - state["energy_level"]
      if total_severity >= config.MINIMUM_CONDITION_SEVERITY:
        if not action.func:
          action.func = "do_infirmary"
        action.available_actions.append("do_infirmary")
        info(f"Infirmary needed due to status severity: {total_severity}")
        return action
      elif total_severity > 0 and missing_energy > config.SKIP_INFIRMARY_UNLESS_MISSING_ENERGY:
        action.available_actions.append("do_infirmary")
        info(f"Infirmary available. {state['energy_level']} < {config.NEVER_REST_ENERGY}")
        return action

    return action

  def check_recreation(self, state, action):
    action["can_mood_increase"] = False
    if "Junior Year" in state["year"]:
      mood_difference = state["mood_difference_junior_year"]
    else:
      mood_difference = state["mood_difference"]
    if mood_difference < 0:
      action.available_actions.append("do_recreation")
      action["can_mood_increase"] = True
      # mood increase required setting the function to do_recreation
      if not action.func:
        action.func = "do_recreation"
      info(f"Recreation needed due to mood difference: {state['mood_difference']}")
    elif state["current_mood"] != "GREAT" and state["current_mood"] != "UNKNOWN":
      info(f"Recreation available. Current mood: {state['current_mood']} != GREAT and UNKNOWN")
      action["can_mood_increase"] = True
      action.available_actions.append("do_recreation")
    return action

  def check_training(self, state, action, training_type, training_template):
    # Call the training function to select best training option
    return training_type(state, training_template, action)

  # Check only unscheduled races
  def check_race(self, state, action, grades: list[str] = None):
    date = state["year"]
    if grades is not None:
      races_on_date = [r for r in constants.RACES[date] if r.get("grade") in grades]
    else:
      races_on_date = constants.RACES[date]

    if not races_on_date:
      return action

    debug(f"Races on date: {races_on_date}")

    debug(f"Looking for races on date.")
    best_race_name=None
    # if there's no best race, search unscheduled races for the best race
    for race in races_on_date:
      if best_race_name is None:
        best_race_name = race["name"]
        best_fans_gained = race["fans"]["gained"]
      else:
        fans_gained = race["fans"]["gained"]
        if fans_gained > best_fans_gained:
          best_race_name = race["name"]
          best_fans_gained = fans_gained

    if best_race_name:
      action.available_actions.append("do_race")
      action["race_name"] = best_race_name
      info(f"Unscheduled race found: {best_race_name}")
      return action

  def check_scheduled_races(self, state, action):
    date = state["year"]

    races_on_date = constants.RACES[date]

    if not races_on_date:
      return action
    if config.USE_RACE_SCHEDULE and date in config.RACE_SCHEDULE:
      scheduled_races_on_date = config.RACE_SCHEDULE[date]
    else:
      scheduled_races_on_date = []
    debug(f"Races on date: {races_on_date}, Scheduled races on date: {scheduled_races_on_date}")

    best_race_name = None
    # search scheduled races for the best race
    for race in scheduled_races_on_date:
      if best_race_name is None:
        best_race_name = race["name"]
        best_fans_gained = race["fans_gained"]
      else:
        fans_gained = race["fans_gained"]
        if fans_gained > best_fans_gained:
          best_race_name = race["name"]
          best_fans_gained = fans_gained

    # if there's a best race, do it
    if best_race_name:
      if best_race_name != action.get("race_name", ""):
        debug(f"Scheduled race logic in check_race: {action.available_actions}")
        action.available_actions.insert(0, "do_race")
      action["race_name"] = best_race_name
      action["scheduled_race"] = True
      info(f"Scheduled race found: {best_race_name}")

    return action

  def evaluate_training_alternatives(self, state, action):
    """
    Evaluate alternative actions when training score is poor.
    Priority: recreation > resting > wit training
    TODO: Add friend recreations to this evaluation
    """
    if (
      action.get("scheduled_race", False) or 
      action.get("race_mission_available", False) and config.DO_MISSION_RACES_IF_POSSIBLE
      ):
      action.func = "do_race"
      info(f"[ENERGY_MGMT] → SCHEDULED RACE: {action['race_name']} found, skipping training alternatives")
      return action
    debug(f"Evaluating training alternatives: {action}")
    training_score = action["training_data"]["score_tuple"][0]
    current_mood = state["current_mood"]
    available_trainings = action["available_trainings"]
    current_energy = state["energy_level"]
    max_energy = state["max_energy"]

    # Energy status (absolute values only)
    energy_headroom = max_energy - current_energy  # How much more energy we can hold

    debug(f"[ENERGY_MGMT] Energy: {current_energy}/{max_energy} (headroom: {energy_headroom})")
    debug(f"[ENERGY_MGMT] Current mood: {current_mood}, Available actions: {list(action.available_actions)}")
    debug(f"[ENERGY_MGMT] Selected training '{action['training_name']}' with score {training_score}")

    # Check if we should evaluate alternatives based on wit training score ratio
    wit_score_ratio = 0.0

    if "wit" in available_trainings:
      wit_score = available_trainings["wit"]["score_tuple"][0]
      min_score = 1
      if action.get("min_scores"):
        min_score = action["min_scores"][0][0]
      # Ensure training_score is at least 1 to prevent division by very small numbers
      effective_training_score = max(training_score, 1)
      effective_wit_score = max(wit_score, 1)
      wit_score_ratio = effective_training_score / effective_wit_score
      rainbow_count = available_trainings["wit"]["total_rainbow_friends"]
      wit_raw_energy = 5
      if available_trainings["wit"].get("unity_spirit_explosions"):
        wit_raw_energy += available_trainings["wit"]["unity_spirit_explosions"] * 5
      wit_raw_energy += (rainbow_count * 4)  # Base 5 + 4 per rainbow


      # Effective energy value is limited by how much we can actually hold
      wit_energy_value = min(wit_raw_energy, energy_headroom)
      
      dates_near_energy_gain = [
        "Junior Year Early Dec",
        "Junior Year Late Dec",
        "Classic Year Early Dec",
        "Classic Year Late Dec",
        "Senior Year Early Jan"
      ]

      if state["year"] in dates_near_energy_gain and energy_headroom < 25:

        skip_wit_for_other_training = True
        if "Early Dec" in state["year"] and state["turn"] != 1:
          skip_wit_for_other_training = False
          debug(f"Early Dec but turn is not 1, accept action.")
        if skip_wit_for_other_training:
          action.func = "do_training"
          for training_name, training_data in available_trainings.items():
            # training is not defined, would crash in niche cases
            if training_name == "wit":
              continue
            else:
              action["training_name"] = training_name
              action["training_data"] = training_data
              break
          info(f"[ENERGY_MGMT] → {state['year']}: Using training {action['training_name']} because we can gain energy soon.")
      # Use recreation if mood can be improved
      elif "do_recreation" in action.available_actions and current_mood != "GREAT" and training_score <= min_score:
        action.func = "do_recreation"
        info(f"[ENERGY_MGMT] → RECREATION: Training score too low ({training_score}) and mood improvable")
      # Rest if energy is very low and it's Early Jun, Late Jun, or Early Jul
      elif current_energy < config.REST_BEFORE_SUMMER_ENERGY and "Junior" not in state["year"] and ("Early Jun" in state["year"] or "Late Jun" in state["year"]):
        if state["date_event_available"]:
          action.func = "do_recreation"
        else:
          action.func = "do_rest"
        info(f"[ENERGY_MGMT] → Resting before summer for energy. Energy: ({current_energy})")
      # Use wit if it provides significant energy gain
      elif wit_energy_value >= 9 and energy_headroom > wit_energy_value and wit_score_ratio < config.WIT_TRAINING_SCORE_RATIO_THRESHOLD:
        action["training_name"] = "wit"
        action["training_data"] = available_trainings["wit"]
        info(f"[ENERGY_MGMT] → WIT TRAINING: Energy gain ({wit_energy_value}/{wit_raw_energy}, {rainbow_count} rainbows)")
      # Rest if energy is very low
      elif ((current_energy < 50 and training_score <= min_score) or
        (current_energy < 50 and action["training_name"] == "wit")):
        if state["date_event_available"]:
          action.func = "do_recreation"
        else:
          action.func = "do_rest"
        info(f"[ENERGY_MGMT] → RESTING: Very low energy ({current_energy}) and score ({training_score}) is below minimum ({min_score})")
      else:
        debug(f"[ENERGY_MGMT] → STICK WITH TRAINING: No compelling alternatives (wit effective energy: {wit_energy_value})")
    elif current_energy < config.SKIP_TRAINING_ENERGY:
      if state["date_event_available"]:
        action.func = "do_recreation"
      else:
        action.func = "do_rest"
      info(f"[ENERGY_MGMT] → Failsafe for failure chance not being read correctly. Resting because energy is too low. Please report this if it happens to you.")
    elif len(available_trainings) == 0:
      if state["date_event_available"]:
        action.func = "do_recreation"
      else:
        action.func = "do_rest"
    else:
      debug(f"[ENERGY_MGMT] → ACTION ACCEPTED: No alternatives needed")
    return action

  # helper functions
  def decide_race_for_goal(self, state, action):
    year = state["year"]
    turn = state["turn"]
    if isinstance(turn, str):
      turn = 0
    criteria = state["criteria"]
    keywords = ("fan", "Maiden", "Progress")

    if ((year == "Junior Year Pre-Debut") or
       (turn > config.RACE_TURN_THRESHOLD and "Maiden" not in criteria)):
      info("No race needed. Returning no race.")
      return action
    if any(word in criteria for word in keywords):
      debug(action)
      if "Progress" in criteria:
        info("Word \"Progress\" is in criteria text.")
        # check specialized goal
        if "G1" in criteria or "GI" in criteria:
          info("Word \"G1\" is in criteria text.")
          action = self.check_race(state, action, grades=["G1"])
          if "do_race" in action.available_actions:
            debug(f"G1 race found. Returning do_race. Available actions: {action.available_actions}")
            action.func = "do_race"
          else:
            info("No G1 race found.")
        elif "G3" in criteria:
          info("Word \"G3\" is in criteria text.")
          action = self.check_race(state, action, grades=["G3","G2"])
          if "do_race" in action.available_actions:
            debug(f"G3 or G2 race found. Returning do_race. Available actions: {action.available_actions}")
            action.func = "do_race"
          else:
            info("No G3 or G2 race found.")
        else:
          info(f"Progress in criteria but not G1 or G3. Returning any race. Available actions: {action.available_actions}")
          action.func = "do_race"
      else:
        info(f"Progress not in criteria. Returning any race. Available actions: {action.available_actions}")
        # if there's no specialized goal, just do any race
        action.func = "do_race"
    info(f"Criteria: {criteria} ---- Keywords: {keywords}")

    return action

  def validate_state(self, state):
    if state["year"] == "":
      return False
    if state["turn"] == -1:
      return False
    if all(value == -1 for value in state["current_stats"].values()):
      return False
    if state["criteria"] == "":
      return False
    return True
