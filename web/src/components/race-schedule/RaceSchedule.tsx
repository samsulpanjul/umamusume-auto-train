import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import RaceScheduleDialog from "./race-schedule/RaceList";
import type { RaceScheduleDataType, RaceScheduleType } from "@/types/race.type";

type Props = {
  raceSchedule: RaceScheduleType[];
  addRaceSchedule: (newList: RaceScheduleType) => void;
  deleteRaceSchedule: (name: string, year: string) => void;
  clearRaceSchedule: () => void;
};

export default function RaceSchedule({
  raceSchedule,
  addRaceSchedule,
  deleteRaceSchedule,
  clearRaceSchedule,
}: Props) {
  const [search, setSearch] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState<"All" | "G1" | "G2" | "G3">(
    "All"
  );
  const [terrainFilter, setTerrainFilter] = useState<"All" | "Turf" | "Dirt">(
    "All"
  );
  const [distanceFilter, setDistanceFilter] = useState<
    "All" | "Sprint" | "Mile" | "Medium" | "Long"
  >("All");
  const [sparksFilter, setSparksFilter] = useState<
    { label: string; value: string }[]
  >([]);

  const getRaceData = async () => {
    try {
      const res = await fetch("/data/races.json");
      if (!res.ok) throw new Error("Failed to fetch races");
      return res.json();
    } catch (error) {
      console.error("Failed to fetch races:", error);
    }
  };

  const { data } = useQuery<RaceScheduleDataType>({
    queryKey: ["races"],
    queryFn: getRaceData,
  });

  const filteredRaceData = useMemo(() => {
    if (!data) {
      return {
        "Junior Year": {},
        "Classic Year": {},
        "Senior Year": {},
      };
    }

    const filterRace = (races: Record<string, any>) =>
      Object.fromEntries(
        Object.entries(races).filter(([name, race]) => {
          const matchSearch =
            search.trim() === "" ||
            name.toLowerCase().includes(search.toLowerCase());
          const matchGrade =
            gradeFilter === "All" || race.grade === gradeFilter;
          const matchTerrain =
            terrainFilter === "All" || race.terrain === terrainFilter;
          const matchDistance =
            distanceFilter === "All" || race.distance.type === distanceFilter;
          const matchSparks =
            !sparksFilter?.length ||
            sparksFilter.every((spark) => race.sparks.includes(spark.value));

          return (
            matchSearch &&
            matchGrade &&
            matchTerrain &&
            matchDistance &&
            matchSparks
          );
        })
      );

    return {
      "Junior Year": filterRace(data["Junior Year"] || {}),
      "Classic Year": filterRace(data["Classic Year"] || {}),
      "Senior Year": filterRace(data["Senior Year"] || {}),
    };
  }, [data, search, gradeFilter, terrainFilter, distanceFilter, sparksFilter]);

  const filterState = {
    search,
    gradeFilter,
    terrainFilter,
    distanceFilter,
    sparksFilter,
    setSearch,
    setGradeFilter,
    setTerrainFilter,
    setDistanceFilter,
    setSparksFilter,
  };

  return (
    <div>
        <RaceScheduleDialog
          raceSchedule={raceSchedule}
          filteredRaceData={filteredRaceData}
          filterState={filterState}
          addRaceSchedule={addRaceSchedule}
          deleteRaceSchedule={deleteRaceSchedule}
          clearRaceSchedule={clearRaceSchedule}
        />

    </div>
  );
}
