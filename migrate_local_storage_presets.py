#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
from typing import Any

from server.config_store import next_config_id, save_named_config
from server.store_shared import load_default_config, without_setup_config


CONFIG_SIGNAL_KEYS = {
  "config_name",
  "priority_stat",
  "priority_weights",
  "race_schedule",
  "skill",
  "event",
  "training_strategy",
}


def parse_possible_json(value: Any, max_depth: int = 3) -> Any:
  current = value
  for _ in range(max_depth):
    if not isinstance(current, str):
      break
    raw = current.strip()
    if not raw or raw[0] not in "{[":
      break
    try:
      current = json.loads(raw)
    except json.JSONDecodeError:
      break
  return current


def deep_merge(source: Any, defaults: Any) -> Any:
  if isinstance(source, dict) and isinstance(defaults, dict):
    merged = {}
    for key, default_value in defaults.items():
      if key in source:
        merged[key] = deep_merge(source[key], default_value)
      else:
        merged[key] = default_value
    for key, value in source.items():
      if key not in merged:
        merged[key] = value
    return merged
  return source


def score_as_config(candidate: dict[str, Any]) -> int:
  return sum(1 for key in CONFIG_SIGNAL_KEYS if key in candidate)


def extract_from_obj(
  obj: Any,
  path_hint: str,
  out: list[tuple[str, dict[str, Any]]],
) -> None:
  if isinstance(obj, dict):
    parsed_obj = {k: parse_possible_json(v) for k, v in obj.items()}
    score = score_as_config(parsed_obj)
    if score >= 4:
      out.append((path_hint, parsed_obj))

    wrapped_config = parsed_obj.get("config")
    if isinstance(wrapped_config, dict) and score_as_config(wrapped_config) >= 4:
      wrapped_name = parsed_obj.get("name") or parsed_obj.get("id") or path_hint
      out.append((str(wrapped_name), wrapped_config))

    for key, value in parsed_obj.items():
      extract_from_obj(value, f"{path_hint}.{key}", out)
    return

  if isinstance(obj, list):
    for index, value in enumerate(obj):
      extract_from_obj(value, f"{path_hint}[{index}]", out)


def collect_storage_entries(raw: Any) -> list[tuple[str, Any]]:
  # Playwright storageState format
  if isinstance(raw, dict) and isinstance(raw.get("origins"), list):
    entries: list[tuple[str, Any]] = []
    for origin_item in raw["origins"]:
      origin = origin_item.get("origin", "unknown-origin")
      for kv in origin_item.get("localStorage", []):
        name = kv.get("name")
        value = kv.get("value")
        if isinstance(name, str):
          entries.append((f"{origin}:{name}", value))
    return entries

  # Array of entries: [{"key":"...","value":"..."}] or [{"name":"...","value":"..."}]
  if isinstance(raw, list):
    entries = []
    for idx, item in enumerate(raw):
      if not isinstance(item, dict):
        continue
      key = item.get("key", item.get("name", f"entry_{idx}"))
      entries.append((str(key), item.get("value")))
    return entries

  # Plain key/value object (like direct localStorage dump)
  if isinstance(raw, dict):
    return [(str(key), value) for key, value in raw.items()]

  return []


def dedupe_configs(items: list[tuple[str, dict[str, Any]]]) -> list[tuple[str, dict[str, Any]]]:
  seen: set[str] = set()
  result: list[tuple[str, dict[str, Any]]] = []
  for label, config in items:
    fingerprint = json.dumps(config, sort_keys=True, separators=(",", ":"))
    if fingerprint in seen:
      continue
    seen.add(fingerprint)
    result.append((label, config))
  return result


def main() -> None:
  parser = argparse.ArgumentParser(
    description="Extract old preset configs from exported browser localStorage JSON into config/*.json files."
  )
  parser.add_argument("input_json", help="Path to exported localStorage JSON.")
  parser.add_argument(
    "--dry-run",
    action="store_true",
    help="Only print what would be imported; do not write files.",
  )
  args = parser.parse_args()

  input_path = Path(args.input_json)
  if not input_path.exists():
    raise SystemExit(f"Input file not found: {input_path}")

  try:
    raw = json.loads(input_path.read_text(encoding="utf-8"))
  except json.JSONDecodeError as err:
    raise SystemExit(f"Invalid JSON input: {err}") from err

  entries = collect_storage_entries(raw)
  if not entries:
    raise SystemExit("No localStorage entries found in input JSON.")

  extracted: list[tuple[str, dict[str, Any]]] = []
  for key, value in entries:
    extract_from_obj(parse_possible_json(value), key, extracted)

  candidates = dedupe_configs(extracted)
  if not candidates:
    raise SystemExit(
      "No config-like objects found. Make sure your export contains the old localStorage data."
    )

  default_config = load_default_config()
  imported = 0

  for source_label, candidate in candidates:
    merged = deep_merge(candidate, default_config)
    clean_config = without_setup_config(merged)
    if not isinstance(clean_config, dict):
      continue

    if not isinstance(clean_config.get("config_name"), str) or not clean_config["config_name"].strip():
      clean_config["config_name"] = f"Migrated {imported + 1}"

    new_id = next_config_id()
    if args.dry_run:
      print(f"[DRY RUN] {new_id}.json <- {source_label} ({clean_config.get('config_name')})")
    else:
      save_named_config(new_id, clean_config)
      print(f"Imported {new_id}.json <- {source_label} ({clean_config.get('config_name')})")
    imported += 1

  if imported == 0:
    raise SystemExit("No presets were imported after filtering.")

  print(f"Done. Processed {len(entries)} storage entries, imported {imported} preset(s).")


if __name__ == "__main__":
  main()
