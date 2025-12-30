
def compare_training_samples(training_samples):
  """
  training_samples: list of dicts, each containing 'stat_gains' (guaranteed)

  Returns:
    all_equal (bool)
    debug_info (dict)
  """

  if not training_samples:
    return True, {"note": "no samples provided"}

  reference = training_samples[0]["stat_gains"]

  mismatches = []

  for idx, sample in enumerate(training_samples[1:], start=1):
    equal, info = compare_stat_gains(reference, sample["stat_gains"])

    if not equal:
      mismatches.append({
        "sample_index": idx,
        "comparison": info,
        "reference": reference,
        "sample": sample["stat_gains"],
      })

  all_equal = len(mismatches) == 0

  debug_info = {
    "sample_count": len(training_samples),
    "all_equal": all_equal,
    "mismatch_count": len(mismatches),
    "mismatches": mismatches,
  }

  return all_equal, debug_info

def compare_stat_gains(a, b):
  """
  Compare two stat_gains dicts.
  Returns (is_equal, debug_info_dict)
  """

  a_keys = set(a.keys())
  b_keys = set(b.keys())

  missing_in_a = b_keys - a_keys
  missing_in_b = a_keys - b_keys

  value_mismatches = {}

  for key in a_keys & b_keys:
    if a[key] != b[key]:
      value_mismatches[key] = {
        "a": a[key],
        "b": b[key],
      }

  is_equal = (
    not missing_in_a
    and not missing_in_b
    and not value_mismatches
  )

  debug_info = {
    "equal": is_equal,
    "missing_in_a": missing_in_a,
    "missing_in_b": missing_in_b,
    "value_mismatches": value_mismatches,
  }

  return is_equal, debug_info
