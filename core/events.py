import Levenshtein

# "event_name": (total_choices, selected_choice)
EVENT_DATABASE = {
  # [SUPPORT CARDS]
  # Special Week
  "Just a Little Closer": (3, 1),       # Speed +15
  "Watch Where You're Going!": (2, 2),  # Guts +15 (useless stat, but you will never buy Extra Tank as a skill so...)
  "So Many Options!": (2, 1),           # Situational, will keep 1 until implementing conditional logic
  
  # Sweep Tosho
  "Some Very Green Friends": (2, 1),  # The skill of the second choice is not worth losing 1 Mood
  "Premeditated Mischief": (2, 2),    # Lone Wolf skill
  "Wonderful Escape!": (2, 1),        # Energy +10, Speed +5 (better than second choice imo)
  "Wonderful Mistake!": (2, 2),       # Charming Status

  # Kitasan Black
  "Paying It Forward": (2, 2),    # Speed +5/+10, Straightaway Adept hint +1/+3, Kita Bond +5
  "Ah, Friendship": (2, 1),       # Situational, best option if Mood is not maxed
  "Ah, Home Sweet Home": (2, 2),  # Situational, best if you don't have Practice Perfect status yet

  # Daiwa Scarlet
  "I'm Going to Win Tomorrow!": (2, 2),  # Situational, best option if Mood is not maxed
  "This Is Nothing!": (2, 2),            # Energy +20, Mood +1, Daiwa Bond +5

  # Super Creek
  "Leave it to Me to Help Out!": (2, 1),        # Energy +15
  "Leave it to Me to Be Considerate!": (2, 2),  # Energy +10, Stamina +5

  # Aoi Kiryuin
  "The Search for a Hobby": (2, 1),                     # Starts dating event
  "Trainer Tip: Always Improve Your Coaching": (2, 1),  # Energy +15, Skill points +19
  "How I Play at the Park": (2, 1),                     # Energy (depends on level)

  # [TRAINEES]
  # Oguri Cap 
  "Pinned Hopes": (2, 1),
  "Oguri the Forest Guide?": (2, 1),
  "Better Than a Plushie": (2, 2),
  "Lost Umamusume": (2, 2),
  "Field Workout": (2, 2),
  "Running on Full": (2, 1),
  "Oguri's Gluttony Championship": (2, 1),  # WE LOVE GAMBLING
  "Bottomless Pit": (2, 2),                 # WE LOVE GAMBLING
  "Oguri Makes a Resolution": (2, 1),
  "Oguri Perseveres": (2, 2),
  "Oguri Matures": (2, 2),
  "Something Smells Good!": (2, 1),
  "High-Level Rival": (2, 1),
  "Extra Training": (2, 1),
  "At Summer (Year 2) Camp": (2, 1),
  "Dance Lesson": (2, 2),
  "New Year's Resolutions": (2, 2),
  "New Year's Shrine Visit": (2, 1),
  "Just an Acupuncturist, No Worries!": (5, 3), 
  
  # [SCENARIOS]
  # URA Finals
  "Exhilarating! What a Scoop!": (2, 1),
  "A Trainer's Knowledge": (2, 2),
  "Best Foot Forward!": (2, 2),

  # [RACE RESULTS]
  "Victory!": (2, 1),       # -15 Energy guaranteed
  "Solid Showing": (2, 1),  # -20 Energy guaranteed
  "Defeat": (2, 1),         # -25 Energy guaranteed
}

def get_optimal_choice(event_name):
  if not event_name:
    return (False, 1)

  cleaned_name = clean_event_name(event_name)
  
  if cleaned_name in EVENT_DATABASE:
    print(f"[INFO] Exact match found: '{cleaned_name}'.")
    return EVENT_DATABASE[cleaned_name]

  # Fuzzy match using Levenshtein distance
  best_match = find_closest_event(cleaned_name)
  
  if best_match:
    choice = EVENT_DATABASE[best_match]
    print(f"[INFO] Fuzzy match found: '{cleaned_name}' -> '{best_match}' (choice {choice[1]}).")
    return choice
  else:
    print(f"[WARNING] No suitable match found for '{cleaned_name}', using default choice 1.")
    return (False, 1)

def find_closest_event(event_name, max_distance=8):
  if not event_name:
    return None
  best_match = None
  best_distance = 99
  for db_event_name in EVENT_DATABASE.keys():
    distance = Levenshtein.distance(
      s1=event_name.lower(),
      s2=db_event_name.lower(),
      weights=(1, 1, 1)  # insertion, deletion, substitution
    )
    if distance < best_distance:
      best_distance = distance
      best_match = db_event_name
  return best_match if best_distance <= max_distance else None
    
def clean_event_name(event_name):
  cleaned = event_name.replace("`", "'")  # apostrophe variations
  cleaned = " ".join(cleaned.split())  # multiple spaces
  return cleaned
