import core.trainings
import utils.constants as constants
from utils.log import error

class Strategy:
  def __init__(self, strategy_set):
    """
    :param name: Name of the strategy (for logging or future use)
    :param config: Dict mapping calendar keys to function names (as strings)
                   e.g. { "Junior Year": "max_out_friendships" }
    """
    self.name = strategy_set["name"]
    self.config = strategy_set["config"]
    self.last_training = None
    self.first_decision_done = False
    self.erroneous_training_type = { "name": "error", "option": "no_training_type" }

  def decide(self, state):
    """
    Decide what action to take based on the current state.
    Returns an action dict:
      { "name": "<action_name>", "option": "<option>" }
    """
    if not self.first_decision_done:
      current_year = state.get("year")
      for year_slot in constants.TIMELINE:
        if year_slot in self.config:
          self.last_training = self.config[year_slot]
        if year_slot == current_year:
          break
      self.first_decision_done = True

    current_year_long = state.get("year")
    training_function_name = self.config.get(current_year_long)

    if not training_function_name:
      error(f"Couldn't find training function name. Current year: {current_year_long}")
      return self.erroneous_training_type

    self.last_training = training_function_name
    training_type = getattr(core.trainings, training_function_name)
    result = training_type(state)

    if not isinstance(result, Action):
      error(f"Training function {training_function_name} didn't return an Action")
      return self.erroneous_training_type

    return result
