import { CALENDAR } from "@/constants/raceConstant";
import type { RaceType } from "@/types/raceType";
import RaceDateCard from "./RaceDateCard";
import type { RaceScheduleType } from "@/types";

type Props = {
  races: Record<string, RaceType>;
  year: string;
  raceSchedule: RaceScheduleType[];
  addRaceSchedule: (race: RaceScheduleType) => void;
  deleteRaceSchedule: (name: string, year: string) => void;
};

export default function RaceCalendar({
  races,
  year,
  raceSchedule,
  addRaceSchedule,
  deleteRaceSchedule,
}: Props) {
  return (
    <>
      {CALENDAR.map((date) => (
        <RaceDateCard
          key={date}
          date={date}
          year={year}
          races={races}
          raceSchedule={raceSchedule}
          addRaceSchedule={addRaceSchedule}
          deleteRaceSchedule={deleteRaceSchedule}
        />
      ))}
    </>
  );
}
