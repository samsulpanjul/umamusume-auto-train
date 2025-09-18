import core.trainings

class Strategy:
  def __init__(self, name, config):
    """
    :param name: Name of the strategy (for logging or future use)
    :param config: Dict mapping calendar keys to function names (as strings)
                   e.g. { "Junior Year": "max_out_friendships" }
    """
    self.name = name
    self.config = config

  def decide(self, state_obj):
    """
    Decide what action to take based on the current state.
    Returns an action dict:
      { "name": "<action_name>", "option": "<option>" }
    """
    current_year_long = state_obj.get("year")
    training_function_name = self.config.get(current_year_long)
    if not training_function_name:
      current_year = current_year_long.split()
      current_year = f"{current_year[0]} {current_year[1]}"
      training_function_name = self.config.get(current_year)
      if not training_function_name:
        error(f"Couldn't find training function name. Current year: {current_year}")

    training_type = getattr(core.trainings, training_function_name)
    result = training_type()
    action_func = action_map.get(func_name)
    if not action_func:
      return { "name": "error", "option": f"Unknown action function: {func_name}" }

    return action_func(state_obj)
