[Back to main readme](../README.md)

## How training functions combine score formulas

This section describes how each training decision function combines the previously defined score formulas into a single training score.
Only the weighting and combination logic is shown here.

---

### rainbow_training

Main score:
- rainbow training score
- scenario gimmick score is added on top of rainbow training score

Supporting score:
- max out friendships score
- multiplied by NON_MAX_SUPPORT_WEIGHT

Final rainbow training score:
- final score = rainbow training score
              + scenario gimmick score
              + (max out friendships score × NON_MAX_SUPPORT_WEIGHT)

Fallback rule:
- if the best training score is lower than the minimum acceptable rainbow score:
  fall back to most_support_cards

---

### max_out_friendships

Main score:
- max out friendships score
- scenario gimmick score is added on top of it

Supporting score:
- rainbow training score
- multiplied by 0.25
- multiplied again by RAINBOW_SUPPORT_WEIGHT_ADDITION

Final friendship-focused score:
- final score = max out friendships score
              + scenario gimmick score
              + (rainbow training score × 0.25 × RAINBOW_SUPPORT_WEIGHT_ADDITION)

Fallback rule:
- if the best training score is lower than the minimum acceptable friendship score:
  fall back to rainbow_training

---

### most_support_cards

Main score:
- most support cards score
- scenario gimmick score is added on top of it

Supporting score:
- max out friendships score
- multiplied by NON_MAX_SUPPORT_WEIGHT

Final support-heavy score:
- final score = most support cards score
              + scenario gimmick score
              + (max out friendships score × NON_MAX_SUPPORT_WEIGHT)

No fallback is forced if the score is too low, but a warning is logged.

---

### most_stat_gain

Main score only:
- most stat gain score

No supporting scores are added.
No fallback logic is applied.

Final stat gain score:
- final score = most stat gain score

---

### meta_training

Scores calculated separately:
- most stat gain score
- max out friendships score
- rainbow training score
- scenario gimmick score is applied only to rainbow training score

Normalization step:
- stat gain score is divided by 10

Final meta score:
- final score = (most stat gain score ÷ 10)
              + max out friendships score
              + rainbow training score
              + scenario gimmick score

All trainings are compared using this combined score.

---
---

## Score Functions Used by Training Decisions

This section explains how each score function calculates its value.
These scores are later combined by training decision functions.

---

### most_support_score

Purpose:
- Prefer trainings with more support cards present.
- Slightly prefer trainings with hints.
- Adjust score based on stat priority.

Base value:
- base value = total number of support cards
- if there is at least one hint icon:
  base value += 0.5

Priority adjustment:
- priority adjustment = priority effect of this stat × global priority weight

Final score calculation:
- if priority adjustment is positive or zero:
  final score = base value × (1 + priority adjustment)
- if priority adjustment is negative:
  final score = base value ÷ (1 + absolute value of priority adjustment)

Tiebreaker:
- higher stat priority wins ties

---

### most_stat_score

Purpose:
- Maximize immediate stat gains from training.
- Respect stat caps.
- Apply stat-specific weights.

Stat contribution calculation:
- for each stat gained by the training:
  - if the stat is already at its cap:
    ignore this stat
  - otherwise:
    - get the stat’s weight from the training template
    - if the stat weight is positive or zero:
      add (stat gain × (1 + stat weight)) to total
    - if the stat weight is negative:
      add (stat gain ÷ (1 + absolute value of stat weight)) to total

Final score:
- final score = sum of all weighted stat gains

Tiebreaker:
- higher stat priority wins ties

---

### max_out_friendships_score

Purpose:
- Maximize future friendship growth potential.
- Value lower friendship levels more than higher ones.
- Prefer trainings that give hints to low-friendship supports.

Base friendship value:
- base value =
    number of green friends
  + (number of blue friends × 1.05)
  + (number of gray friends × 1.10)
  + (number of max friends × 0.2)
  + (number of yellow friends × 0.2)

Hint bonus:
- if there is at least one hint icon:
  - check friendship levels in this order:
    gray → blue → green → max → yellow
  - add the first matching bonus:
    gray hint adds 0.612
    blue hint adds 0.606
    green hint adds 0.6
    max or yellow hint adds 0.1
  - only one hint bonus is applied

Priority scaling:
- priority scaling factor = 1 + ((5 − priority index) × 0.025)
- final friendship score = base friendship value × priority scaling factor

Tiebreaker:
- higher stat priority wins ties

---

### rainbow_increase_formula

Purpose:
- Increase the value of having multiple rainbow friends.
- Reward stacking rainbows more than linearly.

Formula behavior:
- if the number of rainbow friends is less than 1:
  return it unchanged
- otherwise:
  increased value =
    rainbow friends
    + (multiplier × rainbow friends × (rainbow friends − 1))

This causes each additional rainbow friend to be worth more than the previous one.

---

### rainbow_training_score

Purpose:
- Strongly favor trainings with rainbow (yellow or max) supports.
- Slightly reward total support count.
- Prefer trainings with hints.
- Apply stat priority and optional hint-hunting behavior.

Rainbow count:
- total rainbow friends =
  number of yellow friends + number of max friends

Rainbow scaling:
- total rainbow friends is passed through the rainbow increase formula
- multiplier used is 0.15

Base rainbow points:
- rainbow points =
    (scaled rainbow friends × RAINBOW_SUPPORT_WEIGHT_ADDITION)
  + (total number of supports × 0.20)

Flat bonuses:
- if there is at least one rainbow friend:
  rainbow points += 0.5
- if there is at least one hint icon:
  rainbow points += 0.5

Hint hunting (if enabled):
- check support types in order of configured hint weights
- add the weight of the first support type that has a hint

Priority adjustment:
- priority adjustment = priority effect × global priority weight
- if priority adjustment is positive or zero:
  rainbow points = rainbow points × (1 + priority adjustment)
- if priority adjustment is negative:
  rainbow points = rainbow points ÷ (1 + absolute value of priority adjustment)

Final score:
- final score = adjusted rainbow points

Tiebreaker:
- higher stat priority wins ties

---

### add_scenario_gimmick_score

Purpose:
- Add scenario-specific bonus scores on top of existing scores.

Behavior:
- if the current scenario is "unity":
  - calculate unity training score
  - multiply it by SCENARIO_GIMMICK_WEIGHT
  - add it to the existing score

No other scenarios modify scores here.

---

### unity_training_score

Purpose:
- Evaluate unity mechanics such as gauge fills and spirit explosions.
- Adjust importance based on training year.

Year adjustment:
- Junior year: year adjustment = −0.35  
  - increases the value of unity gauge fills  
  - decreases the value of unity spirit explosions
- Classic year: year adjustment = 0  
  - unity gauge fills and spirit explosions are treated equally
- Senior or Finale year: year adjustment = +0.35  
  - decreases the value of unity gauge fills  
  - increases the value of unity spirit explosions

Base score components:
- unity gauge fills × (1 − year adjustment)
- unity trainings that are not gauge fills × 0.1

Spirit explosion score:
- if priority adjustment is positive or zero:
  add (spirit explosions × (1 + year adjustment) × (1 + priority adjustment))
- if priority adjustment is negative:
  add (spirit explosions × (1 + year adjustment)) ÷ (1 + absolute value of priority adjustment)

Final score:
- sum of all unity-related components

Returned value:
- unity score only (added later by scenario gimmick logic)
