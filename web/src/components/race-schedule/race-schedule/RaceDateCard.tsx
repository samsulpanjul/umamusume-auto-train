import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { RaceScheduleType, RaceType } from "@/types/race.type";
import RaceCard from "./RaceCard";
import { Calendar, ThermometerSun } from "lucide-react";

type Props = {
  date: string;
  year: string;
  races: Record<string, RaceType>;
  raceSchedule: RaceScheduleType[];
  addRaceSchedule: (race: RaceScheduleType) => void;
  deleteRaceSchedule: (name: string, year: string) => void;
};

export default function RaceDateCard({
  date,
  year,
  races,
  raceSchedule,
  addRaceSchedule,
  deleteRaceSchedule,
}: Props) {
  const filtered = Object.entries(races).filter(
    ([, data]) => data.date === date
  );
  const selectedRaces = raceSchedule.filter(
    (race) => race.date === date && race.year === year
  );

  return (
    <Dialog>
      <DialogTrigger
        disabled={filtered.length === 0}
          className={`
            group relative min-h-22 rounded-xl border text-sm font-medium transition-all duration-200
            ${
              filtered.length === 0
                ? "border-muted-foreground/20 text-muted-foreground/40 cursor-not-allowed bg-muted/30"
                : selectedRaces.length > 0
                ? "border-primary bg-primary/10 text-foreground shadow-sm cursor-pointer"
                : "border-border hover:border-primary/40 hover:bg-primary/5 text-foreground cursor-pointer"
            }
          `}
        >
          <div className="flex flex-col items-center justify-center h-full p-2">
            {["Early Jul", "Late Jul", "Early Aug", "Late Aug"].includes(date) && !year.includes("Junior Year") && (
              <ThermometerSun className="absolute right-2 top-2" size={16} />
            )}
            <span className="text-base font-semibold">{date}</span>
            {filtered.length > 0 && (
              <>
                <span className="text-xs mt-1 truncate max-w-full px-2 block">
                  {selectedRaces.length > 0 ? (
                    selectedRaces.map((r, i) => (
                      <span key={r.name + i}>
                        {r.name}
                        {i < selectedRaces.length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    `${filtered.length} Race${filtered.length > 1 ? "s" : ""} Available`
                  )}
                </span>
                {selectedRaces.length > 0 && (
                  <Badge className="mt-1 text-xs">
                    Selected
                  </Badge>
                )}
              </>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {date} - {year}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>Race date card dialog</DialogDescription>

          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pb-4">
            {filtered.map(([title, race]) => (
              <RaceCard
                key={title}
                title={title}
                race={race}
                year={year}
                isSelected={selectedRaces.some(r => r.name === title)}
                onSelect={() =>
                  addRaceSchedule({ name: title, year, date: race.date })
                }
                onDeselect={() => deleteRaceSchedule(title, year)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
  );
}
