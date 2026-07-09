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

output = []

for skill in skills:
  if not skill.get("name_en"):
    continue
  output.append({
    "iconid": skill.get("iconid"),
    "name": skill.get("name_en"),
    "description": skill.get("desc_en"),
    "id": skill.get("id")
  })

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
  json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(output)} skills to {OUTPUT_FILE}")