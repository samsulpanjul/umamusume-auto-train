import core.trainings
import utils.constants as constants
import core.config as config
from core.state import check_status_effects
from core.actions import Action
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
      current_year = state.get("year")
      for year_slot in constants.TIMELINE:
        if year_slot in self.timeline:
          self.last_template = self.timeline[year_slot]
        if year_slot == current_year:
          break
      self.first_decision_done = True

    current_year_long = state.get("year")
    info(f"{current_year_long}")
    template_name = self.timeline.get(current_year_long)
    if not template_name:
      template_name = self.last_template
      info(f"Using last known template: {template_name}")

    return self.templates.get(template_name)
'''{'training_function': 'most_support_cards', 
'action_sequence_set': ['infirmary', 'recreation', 'training', 'race'], 
'risk_taking_set': {'rainbow_increase': 5, 'normal_increase': 2}, 
'stat_weight_set': {'spd': 2, 'sta': 1, 'pwr': 1, 'guts': 0.5, 'wit': 0.75, 'sp': 1}}'''
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
    else:
      status_effect_names, total_severity = check_status_effects()
      if total_severity >= config.MINIMUM_CONDITION_SEVERITY:
        action.func = "do_infirmary"

    return action

  def check_recreation(self, state, action):
    if state["mood_difference"] < 0:
      action.func = "do_recreation"
    elif state["current_mood"] != "GREAT":
      action["can_mood_increase"] = True
    return action

  def check_training(self, state, action, training_type, training_template):
    # Call the training function to select best training option
    action = training_type(state, training_template, action)
    return action

  def check_race(self, state, action):
    # Aptitude ranking order for comparison (worst to best)
    aptitude_order = ['g', 'f', 'e', 'd', 'c', 'b', 'a', 's']
    min_surface_index = aptitude_order.index(config.MINIMUM_APTITUDES["surface"])
    min_distance_index = aptitude_order.index(config.MINIMUM_APTITUDES["distance"])
    min_style_index = aptitude_order.index(config.MINIMUM_APTITUDES["style"])
    
    # Get races available on this day
    year = state.get("year")
    races_today = constants.RACES.get(year, [])
    
    if not races_today:
      return action
    
    aptitudes = state.get("aptitudes", {})
    
    # Check each race to see if uma can compete
    for race in races_today:
      terrain = race.get("terrain", "").lower()  # "Turf" or "Dirt"
      distance_type = race.get("distance", {}).get("type", "").lower()  # "Sprint", "Mile", etc.
      
      # Map race properties to aptitude keys
      surface_key = f"surface_{terrain}"
      distance_key = f"distance_{distance_type}"
      
      # Get uma's aptitudes for this race
      surface_apt = aptitudes.get(surface_key, 'g').lower()
      distance_apt = aptitudes.get(distance_key, 'g').lower()
      
      # Check if both aptitudes meet minimum requirements
      surface_good = aptitude_order.index(surface_apt) >= min_surface_index
      distance_good = aptitude_order.index(distance_apt) >= min_distance_index
      
      if surface_good and distance_good:
        # Uma can compete in this race
        action.func = "do_race"
        action["race_name"] = race.get("name")
        action["is_race_day"] = True
        info(f"Entering race: {race.get('name')} (Surface: {surface_apt.upper()}, Distance: {distance_apt.upper()})")
        break
    
    return action

