export type RaceType = {
  grade: "G1" | "G2" | "G3";
  date: string;
  racetrack: string;
  terrain: "Turf" | "Dirt";
  distance: {
    type: "Sprint" | "Mile" | "Medium" | "Long";
    meters: number;
  };
  sparks: string[];
  fans: {
    required: number;
    gained: number;
  };
};

export type RaceScheduleDataType = {
  "Junior Year": Record<string, RaceType>;
  "Classic Year": Record<string, RaceType>;
  "Senior Year": Record<string, RaceType>;
};
