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
import { Calendar } from "lucide-react";

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
    ([_, data]) => data.date === date
  );
  const selectedRace = raceSchedule.find(
    (race) => race.date === date && race.year === year
  );

  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger
          disabled={filtered.length === 0}
          className={`
            group relative min-h-22 h-max rounded-xl border text-sm font-medium
            transition-all duration-200
            ${
              filtered.length === 0
                ? "border-muted-foreground/20 text-muted-foreground/40 cursor-not-allowed bg-muted/30"
                : selectedRace
                ? "border-primary bg-primary/10 text-foreground shadow-sm"
                : "border-border hover:border-primary/40 hover:bg-primary/5 text-foreground"
            }
          `}
        >
          <div className="flex flex-col items-center justify-center h-full p-2">
            <span className="text-base font-semibold">{date}</span>
            {filtered.length > 0 && (
              <>
                <span className="text-xs mt-1 truncate max-w-full px-2">
                  {selectedRace?.name ||
                    `${filtered.length} Race${filtered.length > 1 ? "s" : ""}`}
                </span>
                {selectedRace && (
                  <Badge variant="secondary" className="mt-1 text-xs">
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
                isSelected={selectedRace?.name === title}
                onSelect={() =>
                  addRaceSchedule({ name: title, year, date: race.date })
                }
                onDeselect={() => deleteRaceSchedule(title, year)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
