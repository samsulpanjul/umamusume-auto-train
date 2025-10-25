import core.trainings
import utils.constants as constants
import core.config as config
from core.state import check_status_effects
from core.actions import Action
from core.recognizer import match_template
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

    action = self.decide_action(state, training_template)

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
    info(f"{current_year_long}")
    template_name = self.timeline[current_year_long]
    if not template_name:
      template_name = self.last_template
      info(f"Using last known template: {template_name}")

    return self.templates[template_name]

  def decide_action(self, state, training_template):
    if not training_template:
      error(f"Couldn't find training function name. Template: {training_template}")
      return self.erroneous_action
    debug(f"Using training template: {training_template}")
    action_sequence = training_template['action_sequence_set']

    training_function_name = training_template['training_function']
    info(f"Selected training: {training_function_name}")

    training_type = getattr(core.trainings, training_function_name)

    action = self.decide_action_by_sequence(state, action_sequence, training_type, training_template)

    if not isinstance(action, Action):
      error(f"Training function {training_function_name} didn't return an Action")
      return self.erroneous_action
    else:
      info(f"Doing training using {training_function_name}.")
      return action

  def decide_action_by_sequence(self, state, action_sequence, training_type, training_template):
    action = Action()
    info(f"Evaluating action sequence: {action_sequence}")
    
    for name in action_sequence:
      function_name = getattr(self, f"check_{name}")
      if name == "training":
        action = function_name(state, action, training_type, training_template)
      else:
        action = function_name(state, action)
      if action.func:
        break

    return action

  def check_infirmary(self, state, action):
    if state["energy_level"] < config.NEVER_REST_ENERGY:
      action.func = "do_infirmary"
      info(f"→ Infirmary (energy: {state['energy_level']})")
      return action
    
    # Check if infirmary button is active/highlighted (template matches when active)
    # If button matches the active template, it means there's a debuff
    infirmary_matches = match_template("assets/buttons/infirmary_btn.png", region=constants.SCREEN_BOTTOM_BBOX, threshold=0.85)
    if infirmary_matches:
      # Button is highlighted, check status effects to confirm severity
      status_effect_names, total_severity = check_status_effects()
      if total_severity >= config.MINIMUM_CONDITION_SEVERITY:
        action.func = "do_infirmary"
        info(f"→ Infirmary (status severity: {total_severity})")

    return action

  def check_recreation(self, state, action):
    if state["mood_difference"] < 0:
      action.func = "do_recreation"
      info(f"→ Recreation (mood diff: {state['mood_difference']})")
    elif state["current_mood"] != "GREAT":
      action["can_mood_increase"] = True
    return action

  def check_training(self, state, action, training_type, training_template):
    # Call the training function to select best training option
    action = training_type(state, training_template, action)
    if action.func:
      info(f"→ Training: {action.options['training_name']}")
    return action

  def check_race(self, state, action):
    # Aptitude ranking order for comparison (worst to best)
    date = state["year"] # Don't modify
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
      action.func = "do_race"
      action["race_name"] = best_race["name"]
      info(f"Entering race: {best_race["name"]}")
      return action

    for race in races_on_date:
      suitable = self.check_race_suitability(race, aptitudes, min_surface_index, min_distance_index)
      if suitable:
        suitable_races[race["name"]] = race
    
    if suitable_races:
      best_race = self.get_best_race(suitable_races)
      action.func = "do_race"
      action["race_name"] = best_race["name"]
      info(f"Entering race: {best_race["name"]}")
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
