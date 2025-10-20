import core.trainings
import utils.constants as constants
import core.config as config
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
    action = Action()

    training_function_name = training_template['training_function']
    info(f"Selected training: {training_function_name}")

    training_type = getattr(core.trainings, training_function_name)

    action = decide_action_by_sequence(action_sequence)

    if not isinstance(action, Action):
      error(f"Training function {training_function_name} didn't return an Action")
      return self.erroneous_action
    else:
      info(f"Doing training using {training_function_name}.")
      return action

  def decide_action_by_sequence(action_sequence):
    for name in action_sequence:
      function_name = getattr(self, f"check_{name}")

    if state["energy_level"] > config.NEVER_REST_ENERGY:
      action = training_type(state, training_template)
    else:
      debug(f"Returning action: {action}")
      return action

  def check_infirmary():

  def check_recreation():

  def check_training():

  def check_race():