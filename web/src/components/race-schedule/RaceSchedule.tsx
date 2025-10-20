import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { RaceScheduleType } from "@/types";

type RaceType = {
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

type RaceScheduleDataType = {
  "Junior Year": Record<string, RaceType>;
  "Classic Year": Record<string, RaceType>;
  "Senior Year": Record<string, RaceType>;
};

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
  const [data, setData] = useState<RaceScheduleDataType | null>(null);

  useEffect(() => {
    const getRaceData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/samsulpanjul/umamusume-auto-train/refs/heads/dev/data/races.json"
        );
        const races: RaceScheduleDataType = await res.json();
        setData(races);
      } catch (error) {
        console.error("Failed to fetch races:", error);
      }
    };

    getRaceData();
  }, []);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="font-semibold">Select Race</Button>
        </DialogTrigger>
        <DialogContent className="min-h-[512px] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Race Schedule</DialogTitle>
          </DialogHeader>
          <div className="flex gap-6 min-h-[400px]">
            <div className="w-9/12 flex flex-col gap-4 max-h-[420px] overflow-auto">
              {/* <Input placeholder="Search..." type="search" value={search} onChange={handleSearch} /> */}
              {data &&
                Object.entries(data).map(([year, raceList]) => (
                  <div key={year} className="flex flex-col gap-2 relative">
                    <p className="text-xl font-semibold sticky top-0 bg-card pb-2">
                      {year}
                    </p>
                    <div className="flex flex-col gap-2 px-4">
                      {Object.entries(raceList).map(([name, detail]) => (
                        <div
                          key={name}
                          className={`border-2 ${
                            raceSchedule.some(
                              (race) => race.name === name && race.year === year
                            )
                              ? "border-primary bg-primary/10"
                              : "border-border cursor-pointer"
                          } rounded-md px-4 py-2 flex justify-between hover:border-primary/50 transition`}
                          onClick={() => {
                            addRaceSchedule({
                              name: name,
                              date: detail.date,
                              year: year,
                            });
                            if (
                              raceSchedule.some(
                                (race) =>
                                  race.name === name && race.year === year
                              )
                            )
                              deleteRaceSchedule(name, year);
                          }}
                        >
                          <div>
                            <p className="font-semibold mb-2">
                              {name} - {detail.racetrack}
                            </p>
                            <p>Sparks: {detail.sparks.join(", ")}</p>
                            <p>
                              Fans required:{" "}
                              {detail.fans.required.toLocaleString()}
                            </p>
                            <p>
                              Fans gained: {detail.fans.gained.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="mb-2">{detail.date}</p>
                            <p>{detail.distance.type}</p>
                            <p>{detail.distance.meters}</p>
                            <p>{detail.terrain}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-3/12 flex flex-col">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Race to schedule</p>
                <Button
                  size={"sm"}
                  className="cursor-pointer"
                  onClick={() => clearRaceSchedule()}
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-col gap-2 overflow-auto pr-2 max-h-[395px] mt-2">
                {raceSchedule.map((race) => (
                  <div
                    key={race.name}
                    className="px-4 py-2 border-2 border-border rounded-md hover:border-primary/50 transition cursor-pointer"
                    onClick={() => deleteRaceSchedule(race.name, race.year)}
                  >
                    <p className="font-semibold">{race.name}</p>
                    <p>
                      {race.year} {race.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
