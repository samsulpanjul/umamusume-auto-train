# shared classes and functions
from utils.screenshot import enhanced_screenshot
from core.ocr import extract_text
import utils.device_action_wrapper as device_action
import numpy as np
import operator
import cv2
from utils.tools import sleep, get_secs
import utils.constants as constants
from utils.log import info, debug, error, warning

class CleanDefaultDict(dict):
  """
  A dict-like class that creates nested instances of itself on key access for chaining.
  
  Key Feature: An instance acts like the number 0 for arithmetic, comparison,
  and numeric casting (int(), float()) operations if it is 'conceptually empty' 
  (it or its entire subtree contains no numeric values).
  
  NOTE: The __repr__ method is customized to return "0" when conceptually empty
  to fix cosmetic issues in debug logging (e.g., f'base={base}' displays 'base=0'
  instead of 'base={}'.)
  """
  def __init__(self, *args, **kwargs):
    super().__init__()
    if args:
      # convert mapping or iterable of pairs
      self.update(args[0])
    if kwargs:
      self.update(kwargs)

  def update(self, *args, **kwargs):
    # behave like dict.update but convert nested dicts
    for mapping in args:
      if hasattr(mapping, "items"):
        for k, v in mapping.items():
          self.__setitem__(k, v)
      else:
        for k, v in mapping:
          self.__setitem__(k, v)
    for k, v in kwargs.items():
      self.__setitem__(k, v)

  def setdefault(self, key, default=None):
    if key in self:
      return self[key]
    self.__setitem__(key, default if default is not None else self.__class__())
    return self[key]

  def __getitem__(self, key):
    """
    If a key is missing, this method creates a new CleanDefaultDict instance
    for that key and returns it, allowing for nested chaining.
    """
    try:
      return dict.__getitem__(self, key)
    except KeyError:
      node = self.__class__()
      dict.__setitem__(self, key, node) # Key is created here for chaining
      return node

  def __setitem__(self, key, value):
    if isinstance(value, dict) and not isinstance(value, CleanDefaultDict):
      value = CleanDefaultDict(value)
    dict.__setitem__(self, key, value)

  def __repr__(self):
    """
    Custom representation: returns "0" if conceptually zero, otherwise standard dict repr.
    """
    if self.is_numeric_zero():
      return "0"
    return dict.__repr__(self)
  
  # --- Core Logic for Numeric/Comparison Behavior ---

  def is_numeric_zero(self):
    """
    Recursively checks if the current instance is 'conceptually empty' (acts as 0).
    A dict is conceptually zero if it is physically empty OR if all its
    values are also CleanDefaultDict instances that are conceptually zero.
    """
    # 1. Physically empty dict is conceptually zero.
    if not self:
        return True
    
    # 2. Check all values. If any value is non-dict OR a non-zero dict, it's not zero.
    for value in self.values():
        if isinstance(value, CleanDefaultDict):
            if not value.is_numeric_zero():
                return False # Found a non-zero-like child
        else:
            # Contains a non-dict value (e.g., int, str) -> not conceptually zero
            return False 
    
    # If we get here, the dict only contains zero-like sub-dicts.
    return True

  # --- Numeric Casting Methods (For explicit int()/float() calls) ---

  def __int__(self):
    if self.is_numeric_zero():
        return 0
    # Follow standard dict behavior for conversion failure if non-zero
    raise TypeError(f"cannot convert non-zero 'CleanDefaultDict' object to int")

  def __float__(self):
    if self.is_numeric_zero():
        return 0.0
    # Follow standard dict behavior for conversion failure if non-zero
    raise TypeError(f"cannot convert non-zero 'CleanDefaultDict' object to float")


  def _handle_numeric_op(self, other, op, op_str, reverse=False):
    """Handles standard and in-place arithmetic operations."""
    # Handle CleanDefaultDict + CleanDefaultDict
    if isinstance(other, CleanDefaultDict):
      self_val = 0 if self.is_numeric_zero() else None
      other_val = 0 if other.is_numeric_zero() else None
      
      if self_val is None or other_val is None:
        raise TypeError(f"unsupported operand type(s) for {op_str}: non-zero 'CleanDefaultDict' and 'CleanDefaultDict'")
      
      return op(self_val, other_val)
    
    if not isinstance(other, (int, float)):
      return NotImplemented
    
    # Use the new recursive check
    if self.is_numeric_zero():
      a, b = (other, 0) if reverse else (0, other)
      return op(a, b)
      
    # Non-zero dict: numeric ops are not allowed
    raise TypeError(f"unsupported operand type(s) for {op_str}: 'CleanDefaultDict' and '{type(other).__name__}'")

  def _handle_comparison_op(self, other, op, op_str, reverse=False):
    """Handles comparison operations."""
    if not isinstance(other, (int, float)):
      return NotImplemented
      
    # Use the new recursive check
    if self.is_numeric_zero():
      a, b = (other, 0) if reverse else (0, other)
      return op(a, b)
      
    # Non-zero dict: comparison ops are not allowed
    raise TypeError(f"unsupported operand type(s) for {op_str}: 'CleanDefaultDict' and '{type(other).__name__}'")

  # --- Arithmetic Operations (Return numeric value if conceptually zero) ---
  
  def __add__(self, other): return self._handle_numeric_op(other, operator.add, '+')
  def __radd__(self, other): return self._handle_numeric_op(other, operator.add, '+', reverse=True)
  
  def __sub__(self, other): return self._handle_numeric_op(other, operator.sub, '-')
  def __rsub__(self, other): return self._handle_numeric_op(other, operator.sub, '-', reverse=True)
  
  def __mul__(self, other): return self._handle_numeric_op(other, operator.mul, '*')
  def __rmul__(self, other): return self._handle_numeric_op(other, operator.mul, '*', reverse=True)

  def __truediv__(self, other): return self._handle_numeric_op(other, operator.truediv, '/')
  def __rtruediv__(self, other): return self._handle_numeric_op(other, operator.truediv, '/', reverse=True)

  def __floordiv__(self, other): return self._handle_numeric_op(other, operator.floordiv, '//')
  def __rfloordiv__(self, other): return self._handle_numeric_op(other, operator.floordiv, '//', reverse=True)

  def __mod__(self, other): return self._handle_numeric_op(other, operator.mod, '%')
  def __rmod__(self, other): return self._handle_numeric_op(other, operator.mod, '%', reverse=True)

  def __pow__(self, other): return self._handle_numeric_op(other, operator.pow, '**')
  def __rpow__(self, other): return self._handle_numeric_op(other, operator.pow, '**', reverse=True)

  def __iadd__(self, other): return self._handle_numeric_op(other, operator.add, '+')
  def __isub__(self, other): return self._handle_numeric_op(other, operator.sub, '-')
  def __itruediv__(self, other): return self._handle_numeric_op(other, operator.truediv, '/')
  def __ifloordiv__(self, other): return self._handle_numeric_op(other, operator.floordiv, '//')
  def __imod__(self, other): return self._handle_numeric_op(other, operator.mod, '%')
  def __ipow__(self, other): return self._handle_numeric_op(other, operator.pow, '**')

  # --- Comparison Operations (Return boolean value if conceptually zero) ---
  
  def __lt__(self, other): return self._handle_comparison_op(other, operator.lt, '<')
  def __le__(self, other): return self._handle_comparison_op(other, operator.le, '<=')
  def __gt__(self, other): return self._handle_comparison_op(other, operator.gt, '>')
  def __ge__(self, other): return self._handle_comparison_op(other, operator.ge, '>=')
  
  def __eq__(self, other): 
    # Must handle equality separately because it is often called first
    if isinstance(other, (int, float)) and self.is_numeric_zero():
      return 0 == other
    return dict.__eq__(self, other)

  def __ne__(self, other):
    result = self.__eq__(other)
    if result is NotImplemented:
      return NotImplemented
    return not result

def get_race_type():
  race_info_screen = enhanced_screenshot(constants.RACE_INFO_TEXT_REGION)
  race_info_text = extract_text(race_info_screen)
  debug(f"Race info text: {race_info_text}")
  return race_info_text

def check_status_effects():
  if not device_action.locate_and_click("assets/buttons/full_stats.png", min_search_time=get_secs(1), region_ltrb=constants.SCREEN_MIDDLE_BBOX):
    error("Couldn't click full stats button. Going back.")
    return [], 0
  sleep(0.5)
  status_effects_screen = enhanced_screenshot(constants.FULL_STATS_STATUS_REGION)

  screen = np.array(status_effects_screen)  # currently grayscale
  screen = cv2.cvtColor(screen, cv2.COLOR_GRAY2BGR)  # convert to 3-channel BGR for display

  status_effects_text = extract_text(status_effects_screen)
  debug(f"Status effects text: {status_effects_text}")

  normalized_text = status_effects_text.lower().replace(" ", "")

  matches = [
      k for k in constants.BAD_STATUS_EFFECTS
      if k.lower().replace(" ", "") in normalized_text
  ]

  total_severity = sum(constants.BAD_STATUS_EFFECTS[k]["Severity"] for k in matches)

  debug(f"Matches: {matches}, severity: {total_severity}")
  device_action.locate_and_click("assets/buttons/close_btn.png", min_search_time=get_secs(1), region_ltrb=constants.SCREEN_BOTTOM_BBOX)
  return matches, total_severity
