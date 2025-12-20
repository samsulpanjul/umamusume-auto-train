import subprocess
import sys

def main():
  subprocess.run(
    ["git", "config", "core.hooksPath", ".githooks"],
    check=True
  )

  print("Git hooks installed.")
  print("Hooks path set to .githooks/")
  return 0


if __name__ == "__main__":
  sys.exit(main())
