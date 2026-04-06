import json
import re

# Note by Ivan, currently seems to do nothing. Needs some iterative stuff.
#Open the TypeScript File
with open("./web/src/types/index.ts") as g:
  content = g.read()

overrides = {
  "theme": 'z.string().default("Default")',
  "stat_caps": 'StatSchema',
  "hint_hunting_weights": "StatSchema",
  "race_schedule": 'z.array(RaceScheduleSchema)',
  'skill': 'SkillSchema',
  'event': 'EventSchema',
  'training_strategy': 'TrainingStrategySchema',
  'minimum_acceptable_scores': 'MinimumAcceptableScoresSchema'
}

def json_2_zod(value, indent=0, key=None):
  pad = " " * indent

  if key in overrides:
    return overrides[key]

  if value is None:
    return "z.null()"

  if isinstance(value, bool):
    return "z.boolean()"
  elif isinstance(value, str):
    return "z.string()"
  elif isinstance(value, (int, float)):
    return "z.number()"
  elif isinstance(value, list):
    if len(value) > 0:
      item_type = json_2_zod(value[0], indent)
    else:
      item_type = "z.unknown()"
    return f"z.array({item_type})"
  elif isinstance(value, dict):
    lines = []
    for k, v in value.items():
      lines.append(f"{pad}  {k}: {json_2_zod(v, indent + 2, key=k)}")
    fields = ",\n".join(lines)
    return f"z.object({{\n{fields}\n{pad}}})"
  else:
    return "z.unknown()"

with open("./config.template.json", "r") as f:
  data = json.load(f)

schema =json_2_zod(data) + ";"

# This is using regex to find 'n replace it
updated = re.sub(r'SchemaGoesHere', schema, content)

with open("sample.ts", 'w') as f:
  f.write(updated)
