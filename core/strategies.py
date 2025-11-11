import core.trainings
import utils.constants as constants
import core.config as config
from core.state import check_status_effects
from core.actions import Action
from core.recognizer import match_template, compare_brightness
from utils.log import error, warning, info, debug

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

  def decide(self, state):

    training_template = self.get_training_template(state)

    action = self.get_action(state, training_template)

    if action.available_actions:
      year_index = constants.TIMELINE.index(state["year"])
      end_index = len(constants.TIMELINE)
      turns_remaining = end_index - year_index
      target_stat_gap = {}
      for stat, value in training_template["target_stat_set"].items():
        target_stat_gap[stat] = value - state["current_stats"][stat]
        target_stat_gap[stat] = max(0, target_stat_gap[stat])
      # Strategic decision based on target gaps
      total_gap = sum(target_stat_gap.values())

      if "Early Jun" in state["year"] or "Late Jun" in state["year"]:
        if state["energy_level"] < config.REST_BEFORE_SUMMER_ENERGY:
          action.func = "do_rest"
          info(f"Resting before summer: {state['energy_level']} < {config.REST_BEFORE_SUMMER_ENERGY}")
          return action

      # Dynamic action evaluation
      if action.func == "do_training":
        action = self.evaluate_training_alternatives(state, action)

      if action.func == "do_training":
        if total_gap < 100 and state.current_mood != "GREAT":
          action.func="do_recreation"
          info(f"Prioritizing recreation because we are close to targets - total gap: {total_gap}")
        else:
          action.func = "do_training"
          info(f"Training needed - total gap: {total_gap}")

      info(f"Target stat gap: {target_stat_gap}")
      info(f"Action function: {action.func}")
      info(f"Action: {action}")
      return action
    else:
      action.func = "skip_turn"
      info(f"Skipping turn because no actions are available")
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
    info(f"Using template: {template_name} for {current_year_long}")
    return self.templates[template_name]

  def get_action(self, state, training_template):
    if not training_template:
      error(f"Couldn't find training function name. Template: {training_template}")
      return self.erroneous_action
    debug(f"Using training template: {training_template}")
    action_sequence = training_template['action_sequence_set']

    training_function_name = training_template['training_function']
    info(f"Selected training: {training_function_name}")

    training_type = getattr(core.trainings, training_function_name)

    action = self.get_action_by_sequence(state, action_sequence, training_type, training_template)
    if not isinstance(action, Action):
      error(f"Training function {training_function_name} didn't return an Action")
      return self.erroneous_action
    else:
      return action

  def get_action_by_sequence(self, state, action_sequence, training_type, training_template):
    action = Action()

    if state["turn"] == "Race Day":
      action.func = "do_race"
      action.available_actions.append("do_race")
      action["is_race_day"] = True
      info(f"Race Day")
      return action
    else:
      action["is_race_day"] = False

    info(f"Evaluating action sequence: {action_sequence}")

    for name in action_sequence:
      function_name = getattr(self, f"check_{name}")
      if name == "training":
        action = function_name(state, action, training_type, training_template)
      else:
        action = function_name(state, action)

    return action

  def check_infirmary(self, state, action):
    infirmary_matches = match_template("assets/buttons/infirmary_btn.png", region=constants.SCREEN_BOTTOM_BBOX, threshold=0.85)
    if compare_brightness(img="assets/buttons/infirmary_btn.png", other=infirmary_matches):
      status_effect_names, total_severity = check_status_effects()
      if total_severity >= config.MINIMUM_CONDITION_SEVERITY:
        action.available_actions.append("do_infirmary")
        info(f"Infirmary needed due to status severity: {total_severity}")
        return action
      elif state["energy_level"] < config.NEVER_REST_ENERGY:
        action.available_actions.append("do_infirmary")
        info(f"Infirmary available. {state['energy_level']} < {config.NEVER_REST_ENERGY}")
        return action

    return action

  def check_recreation(self, state, action):
    if state["mood_difference"] < 0:
      action.available_actions.append("do_recreation")
      info(f"Recreation needed due to mood difference: {state['mood_difference']}")
    elif state["current_mood"] != "GREAT":
      info(f"Recreation available. Current mood: {state['current_mood']} != GREAT")
      action["can_mood_increase"] = True
      action.available_actions.append("do_recreation")
    return action

  def check_training(self, state, action, training_type, training_template):
    # Call the training function to select best training option
    return training_type(state, training_template, action)

  def check_race(self, state, action):
    date = state["year"]
    races_on_date = constants.RACES[date]
    scheduled_races = [k["name"] for k in config.RACE_SCHEDULE]

    if not races_on_date:
      return action

    suitable_races = {}
    aptitudes = state["aptitudes"]
    min_surface_index = self.get_aptitude_index(config.MINIMUM_APTITUDES["surface"])
    min_distance_index = self.get_aptitude_index(config.MINIMUM_APTITUDES["distance"])

    for race in races_on_date:
      if race["name"] in scheduled_races:
        suitable = self.check_race_suitability(race, aptitudes, min_surface_index, min_distance_index)
        if suitable:
          suitable_races[race["name"]] = race

    if suitable_races:
      best_race = self.get_best_race(suitable_races)
      action.available_actions.append("do_race")
      action["race_name"] = best_race["name"]
      info(f"Race found: {best_race["name"]}")
      return action

    for race in races_on_date:
      suitable = self.check_race_suitability(race, aptitudes, min_surface_index, min_distance_index)
      if suitable:
        suitable_races[race["name"]] = race

    if suitable_races:
      best_race = self.get_best_race(suitable_races)
      action.available_actions.append("do_race")
      action["race_name"] = best_race["name"]
      info(f"Race found: {best_race["name"]}")
      return action

    return action

  def get_best_race(self, suitable_races):
    suitable_races = sorted(suitable_races.items(), key=lambda x: x[1]["fans"]["gained"], reverse=True)
    return suitable_races[0]

  def get_aptitude_index(self, aptitude):
    aptitude_order = ['g', 'f', 'e', 'd', 'c', 'b', 'a', 's']
    return aptitude_order.index(aptitude)

  def check_race_suitability(self, race, aptitudes, min_surface_index, min_distance_index):
    race_surface = race["terrain"].lower()
    race_distance_type = race["distance"]["type"].lower()

    surface_key = f"surface_{race_surface}"
    distance_key = f"distance_{race_distance_type}"

    surface_apt = self.get_aptitude_index(aptitudes[surface_key])
    distance_apt = self.get_aptitude_index(aptitudes[distance_key])

    if surface_apt >= min_surface_index and distance_apt >= min_distance_index:
      return True
    else:
      return False

  def evaluate_training_alternatives(self, state, action):
    """
    Evaluate alternative actions when training score is poor.
    Priority: recreation > resting > wit training
    TODO: Add friend recreations to this evaluation
    """
    training_score = action["training_data"]["score_tuple"][0]
    current_mood = state["current_mood"]
    available_trainings = action["available_trainings"]
    current_energy = state["energy_level"]
    max_energy = state["max_energy"]

    # Energy status (absolute values only)
    energy_headroom = max_energy - current_energy  # How much more energy we can hold

    debug(f"[ENERGY_MGMT] Energy: {current_energy}/{max_energy} (headroom: {energy_headroom})")
    debug(f"[ENERGY_MGMT] Current mood: {current_mood}, Available actions: {list(action.available_actions)}")
    debug(f"[ENERGY_MGMT] Selected training '{action['training_name']}' with score {training_score:.2f}")

    # Check if we should evaluate alternatives based on wit training score ratio
    wit_score_ratio = 0.0

    if "wit" in available_trainings:
      wit_score = available_trainings["wit"]["score_tuple"][0]
      # Ensure training_score is at least 1 to prevent division by very small numbers
      effective_training_score = max(training_score, 1.0)
      wit_score_ratio = wit_score / effective_training_score
      if wit_score_ratio > config.WIT_TRAINING_SCORE_RATIO_THRESHOLD:
        # We should evaluate alternatives
        # TODO: Add friend recreations to this evaluation
        # Check if wit training offers significant energy gain (rainbow bonus)
        debug(f"[ENERGY_MGMT] Wit score ratio ({wit_score_ratio:.2f}) above threshold ({config.WIT_TRAINING_SCORE_RATIO_THRESHOLD}), evaluating alternatives...")
        wit_energy_value = 0
        rainbow_count = 0
        if "wit" in available_trainings:
        # Calculate rainbow count from friendship levels (yellow + max = rainbow)
        wit_friendship_levels = available_trainings["wit"]["friendship_levels"]
        rainbow_count = wit_friendship_levels["yellow"] + wit_friendship_levels["max"]
        wit_raw_energy = 5 + (rainbow_count * 4)  # Base 5 + 4 per rainbow

        # Effective energy value is limited by how much we can actually hold
        wit_energy_value = min(wit_raw_energy, energy_headroom)

      # 1. Try recreation first if mood can be improved
      if "do_recreation" in action.available_actions and current_mood != "GREAT":
        action.func = "do_recreation"
        info(f"[ENERGY_MGMT] → RECREATION: Training score too low ({training_score:.1f}) and mood improvable")

      # 2. Consider resting if energy is very low (gives ~40-50 energy on average)
      elif current_energy < 50 and ("Early Jun" in state["year"] or "Late Jun" in state["year"] or "Early Jul" in state["year"]):
        action.func = "do_rest"
        info(f"[ENERGY_MGMT] → RESTING: Very low energy ({current_energy}) and bad training ({training_score:.1f})")

      # 3. Use wit only if it provides significant energy gain (>= 9 effective energy)
      elif wit_energy_value >= 9:
        action["training_name"] = "wit"
        action["training_data"] = available_trainings["wit"]
        info(f"[ENERGY_MGMT] → WIT TRAINING: Energy gain ({wit_energy_value}/{wit_raw_energy}, {rainbow_count} rainbows)")

      else:
        debug(f"[ENERGY_MGMT] → STICK WITH TRAINING: No compelling alternatives (wit effective energy: {wit_energy_value:.1f})")
    else:
      debug(f"[ENERGY_MGMT] → ACTION ACCEPTED: No alternatives needed")
    # Return the action with the evaluated alternatives
    return action