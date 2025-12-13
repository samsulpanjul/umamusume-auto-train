import re
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
FILE = ROOT / "utils" / "log.py"

VERSION_RE = re.compile(r'^VERSION\s*=\s*["\'](.+?)["\']', re.M)

def main():
  if not FILE.exists():
    return 0

  text = FILE.read_text(encoding="utf-8")

  match = VERSION_RE.search(text)
  if not match:
    return 0

  version = match.group(1)
  try:
    major, minor, patch = map(int, version.split("."))
  except ValueError:
    print("[hook] Invalid VERSION format:", version)
    return 0

  patch += 1
  new_version = f"{major}.{minor}.{patch}"

  new_text = VERSION_RE.sub(
    f'VERSION = "{new_version}"',
    text,
    count=1
  )

  FILE.write_text(new_text, encoding="utf-8")

  # Stage the file
  subprocess.run(
    ["git", "add", str(FILE)],
    check=False
  )

  print(f"[hook] Version bumped: {version} -> {new_version}")
  return 0


if __name__ == "__main__":
  sys.exit(main())
