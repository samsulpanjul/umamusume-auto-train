export const MOOD: string[] = ["AWFUL", "BAD", "NORMAL", "GOOD", "GREAT"];
export const PRIORITY_WEIGHT: Record<string, string> = {
  HEAVY:
    "Strongly focuses on prioritized stats. A training with fewer supports can still get picked (+75%).",
  MEDIUM:
    "Moderately focuses on prioritized stats but still considers support count (+50%).",
  LIGHT:
    "Slightly focuses on prioritized stats. Usually goes for trainings with more supports (+25%).",
  NONE: "Doesn't focus on main stats at all, just picks based on support count only.",
};
export const POSITION: string[] = ["front", "pace", "late", "end"];
export const URL: string = "http://127.0.0.1:8000";
