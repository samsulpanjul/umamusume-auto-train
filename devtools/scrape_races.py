import json
import requests
from bs4 import BeautifulSoup
import time
URL = "https://gametora.com/umamusume/races?tokyo-daishoten"

# use beautifulsoup to get the details page of a race (gives all races as json)
# and copy paste the race list there if necessary and replace it with data/race_list_everything.json
# res = requests.get(URL, timeout=30)
# res.raise_for_status()
# soup = BeautifulSoup(res.text, "html.parser")
# print(soup)

def has_class_prefix(tag, prefix):
  return any(c.startswith(prefix) for c in tag.get("class", []))

def clean(text):
  return text.replace("\xa0", " ").strip()

GRADE_INDEX = {
  100 : "G1",
  200 : "G2",
  300 : "G3",
  400 : "OP",
  800 : "Maiden",
  900 : "Debut"
}

YEAR_INDEX = {
  1 : "Junior Year",
  2 : "Classic Year",
  3 : "Senior Year"
}

MONTH_INDEX = {
  1 : "Jan",
  2 : "Feb",
  3 : "Mar",
  4 : "Apr",
  5 : "May",
  6 : "Jun",
  7 : "Jul",
  8 : "Aug",
  9 : "Sep",
  10 : "Oct",
  11 : "Nov",
  12 : "Dec"
}

HALF_MONTH_INDEX = {
  1: "Early",
  2: "Late"
}

TERRAIN_INDEX  = {
  1: "Turf",
  2: "Dirt"
}

FAN_GAIN_INDEX = {
  5: 3100,
  6: 1800,
  8: 1900,
  9: 2200,
  10: 2300,
  11: 2400,
  12: 2900,
  13: 3100,
  14: 3300,
  15: 3500,
  16: 3600,
  17: 3800,
  18: 3900,
  19: 4000,
  20: 4100,
  21: 5200,
  22: 5400,
  23: 5500,
  24: 5700,
  25: 5900,
  26: 6200,
  27: 6500,
  28: 6700,
  29: 7000,
  30: 10000,
  31: 10500,
  32: 11000,
  33: 12000,
  34: 15000,
  35: 20000,
  36: 30000,
  37: 7000,
  41: 6000,
  42: 4500,
  43: 8000,
  44: 1000,
  45: 1700,
  46: 13000,
  47: 13500,
  48: 2000,
  49: 2500,
  50: 2600,
}

RACETRACK_INDEX = {
  10001: "Sapporo",
  10002: "Hakodate",
  10003: "Niigata",
  10004: "Fukushima",
  10005: "Nakayama",
  10006: "Tokyo",
  10007: "Chukyo",
  10008: "Kyoto",
  10009: "Hanshin",
  10010: "Kokura",
  10101: "Ooi",
  99999: "Varies"
}

SPARK_INDEX = {
  "power":"Power",
  "stamina":"Stamina",
  "speed":"Speed",
  "guts":"Guts",
  "int":"Wit",
  "大井レース場○":"Oi Racecourse ○",
  "中山レース場○":"Nakayama Racecourse ○",
  "中京レース場○":"Chukyo Racecourse ○",
  "東京レース場○":"Tokyo Racecourse ○",
  "東京レー ス場○":"Tokyo Racecourse ○",
  "京都レース場○":"Kyoto Racecourse ○",
  "阪神レース場○":"Hanshin Racecourse ○",
  "根幹 距離○":"Standard Distance ○",
  "根幹距離○":"Standard Distance ○",
  "非根幹距離○":"Non-Standard Distance ○",
  "秋ウマ娘○":"Fall Runner ○",
  "夏ウマ娘○":"Summer Runner ○",
  "冬ウマ娘○":"Winter Runner ○",
  "春ウマ娘○":"Spring Runner ○",
}

with open("races.txt", "r", encoding="utf-8") as file:
  racelist=[]
  line = file.readline()
  while line:
    link = line.strip()
    racelist.append(link)
    line=file.readline()

races_list_everything=None
with open("../data/race_list_everything.json", "r", encoding="utf-8") as f:
  races_list_everything = json.load(f)

final_race_list = {
  "Junior Year":{},
  "Classic Year":{},
  "Senior Year":{}
}

for race_details in races_list_everything["raceUra"]:
  for race_name in racelist:
    if race_details["details"]["name_en"] == race_name:
      race = {}
      race["grade"] = GRADE_INDEX[race_details["details"]["grade"]]
      race["date"] = HALF_MONTH_INDEX[race_details["half"]] + " " + MONTH_INDEX[race_details["month"]]
      race["racetrack"] = RACETRACK_INDEX[race_details["details"]["track"]]
      race["terrain"] = TERRAIN_INDEX[race_details["details"]["terrain"]]
      race_meters = race_details["details"]["distance"]
      if race_meters <= 1400:
        race_distance_type = "Sprint"
      elif race_meters <= 1800:
        race_distance_type = "Mile"
      elif race_meters <= 2400:
        race_distance_type = "Medium"
      else:
        race_distance_type = "Long"
      race["distance"] = {
        "type": race_distance_type,
        "meters": race_meters
      }
      race_sparks = race_details["details"].get("factor", None)
      if race_sparks:
        race["sparks"] = []
        for _, spark in race_sparks.items():
          race["sparks"].append(SPARK_INDEX[spark])
      else:
        race["sparks"] = ["-"]
      race["fans"] = {
        "required": race_details["fans_needed"],
        "gained": FAN_GAIN_INDEX[race_details["fans_gain"]]
      }
      final_race_list[YEAR_INDEX[race_details["year"]]][race_name.replace("(","").replace(")","").replace("’","'").replace(".","")] = race

with open("../data/races.json", "w", encoding="utf-8") as f:
  json.dump(final_race_list, f, ensure_ascii=False, indent=2)

'''
    "Hakodate Junior Stakes": {
      "grade": "G3",
      "date": "Late Jul",
      "racetrack": "Hakodate",
      "terrain": "Turf",
      "distance": {
        "type": "Sprint",
        "meters": 1200
      },
      "sparks": [
        "-"
      ],
      "fans": {
        "required": 350,
        "gained": 3100
      }
    },
'''