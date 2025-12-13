from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT / "version.txt"

def main():
  if not VERSION_FILE.exists():
    print("[hook] version.txt not found, skipping")
    return 0

  raw = VERSION_FILE.read_text(encoding="utf-8").strip()

  try:
    major, minor, patch = map(int, raw.split("."))
  except ValueError:
    print("[hook] Invalid version format:", raw)
    return 0

  patch += 1
  new_version = f"{major}.{minor}.{patch}"

  VERSION_FILE.write_text(new_version + "\n", encoding="utf-8")

  subprocess.run(
    ["git", "add", str(VERSION_FILE)],
    check=False
  )

  print(f"[hook] Version bumped: {raw} -> {new_version}")
  return 0


if __name__ == "__main__":
  sys.exit(main())
