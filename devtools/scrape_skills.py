import json

# maybe implement this later on
#import requests
#from bs4 import BeautifulSoup
#import time

#URL = "https://gametora.com/umamusume/skills"
INPUT_FILE = "data/skill_list_everything.json"
OUTPUT_FILE = "data/skills.json"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
  skills = json.load(f)

output = {}

for skill in skills:
  name = skill.get("name_en")
  if not name or skill.get("evo_cond"):
    continue
  if name == "Carnival Bonus":
    continue

  description = skill.get("desc_en") or ""

  if name in output:
    # Avoid adding the same description twice
    if description and description not in output[name]["description"].split(" / "):
      output[name]["description"] += f" / {description}"
  else:
    output[name] = {
      "iconid": skill.get("iconid"),
      "name": name,
      "description": description,
      "id": skill.get("id")
    }

result = sorted(
  output.values(),
  key=lambda x: (x["iconid"] is None, x["iconid"])
)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
  json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(result)} unique skills to {OUTPUT_FILE}")