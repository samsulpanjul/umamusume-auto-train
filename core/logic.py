import json

from core.state import check_current_year, stat_state

with open("config.json", "r", encoding="utf-8") as file:
  config = json.load(file)

PRIORITY_STAT = config["priority_stat"]
MAX_FAILURE = config["maximum_failure"]
STAT_CAPS = config["stat_caps"]

# Get priority stat from config
def get_stat_priority(stat_key: str) -> int:
  return PRIORITY_STAT.index(stat_key) if stat_key in PRIORITY_STAT else 999

# Will do train with the most support card
# Used in the first year (aim for rainbow)
def most_support_card(results):
  # Seperate wit
  wit_data = results.get("wit")

  # Get all training but wit
  non_wit_results = {
    k: v for k, v in results.items()
    if k != "wit" and int(v["failure"]) <= MAX_FAILURE
  }

  # Check if train is bad
  all_others_bad = len(non_wit_results) == 0

  if all_others_bad and wit_data and int(wit_data["failure"]) <= MAX_FAILURE and wit_data["total_support"] >= 2:
    print("\n[INFO] All trainings are unsafe, but WIT is safe and has enough support cards.")
    return "wit"

  filtered_results = {
    k: v for k, v in results.items() if int(v["failure"]) <= MAX_FAILURE
  }

  if not filtered_results:
    print("\n[INFO] No safe training found. All failure chances are too high.")
    return None

  # Best training
  best_training = max(
    filtered_results.items(),
    key=lambda x: (
      x[1]["total_support"],
      -get_stat_priority(x[0])  # priority decides when supports are equal
    )
  )

  best_key, best_data = best_training

  if best_data["total_support"] <= 1:
    if int(best_data["failure"]) == 0:
      # WIT must be at least 2 support cards
      if best_key == "wit":
        print(f"\n[INFO] Only 1 support and it's WIT. Skipping.")
        return None
      print(f"\n[INFO] Only 1 support but 0% failure. Prioritizing based on priority list: {best_key.upper()}")
      return best_key
    else:
      print("\n[INFO] Low value training (only 1 support). Choosing to rest.")
      return None

  print(f"\nBest training: {best_key.upper()} with {best_data['total_support']} support cards and {best_data['failure']}% fail chance")
  return best_key

# Do rainbow training
def rainbow_training(results):
  # Get rainbow training
  rainbow_candidates = {
    stat: data for stat, data in results.items()
    if int(data["failure"]) <= MAX_FAILURE and data["support"].get(stat, 0) > 0
  }

  if not rainbow_candidates:
    print("\n[INFO] No rainbow training found under failure threshold.")
    return None

  # Find support card rainbow in training
  best_rainbow = max(
    rainbow_candidates.items(),
    key=lambda x: (
      x[1]["support"].get(x[0], 0),
      -get_stat_priority(x[0])
    )
  )

  best_key, best_data = best_rainbow
  print(f"\n[INFO] Rainbow training selected: {best_key.upper()} with {best_data['support'][best_key]} rainbow supports and {best_data['failure']}% fail chance")
  return best_key

def filter_by_stat_caps(results, current_stats):
  return {
    stat: data for stat, data in results.items()
    if current_stats.get(stat, 0) < STAT_CAPS.get(stat, 1200)
  }
  
# Decide training
def do_something(results):
  year = check_current_year()
  current_stats = stat_state()
  print(f"Current stats: {current_stats}")

  filtered = filter_by_stat_caps(results, current_stats)

  if not filtered:
    print("[INFO] All stats capped or no valid training.")
    return None

  if "Junior Year" in year:
    return most_support_card(filtered)
  else:
    result = rainbow_training(filtered)
    if result is None:
      print("[INFO] Falling back to most_support_card because rainbow not available.")
      return most_support_card(filtered)
  return result
