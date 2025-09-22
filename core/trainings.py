# core/trainings.py
"""
'guts': {'failure': 0,
          'guts': {'friendship_levels': {'blue': 0,
                                         'gray': 0,
                                         'green': 0,
                                         'max': 0,
                                         'yellow': 0},
                   'hints': 0,
                   'supports': 0}, (imagine the same structure for each support type)
          'total_friendship_levels': {'blue': 0,
                                      'gray': 0,
                                      'green': 0,
                                      'max': 0,
                                      'yellow': 0},
          'total_hints': 0,
          'total_rainbow_friends': 0,
          'total_supports': 0,}
"""

def max_out_friendships(state=None):
  """
  Prioritize training options that maximize support/friendship gains.
  """

  return { "name": "do_training", "option": "wit" }

def most_support_cards(state=None):
  """
  Choose training with the most support cards present.
  """
  return { "name": "do_training", "option": "wit" }

def most_valuable_training(state=None):
  """
  Pick the training with the highest overall stat/benefit.
  """
  return { "name": "do_training", "option": "wit" }
