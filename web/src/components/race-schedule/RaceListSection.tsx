import { AlertCircle, Trophy } from "lucide-react";
import RaceSchedule from "./RaceSchedule";
import { Button } from "@/components/ui/button";
import type { Config, UpdateConfigType } from "@/types";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function RaceScheduleSection({ config, updateConfig }: Props) {
  const {
    race_schedule,
    use_race_schedule,
  } = config;

  return (
    <div className="section-card relative">
      <div className="flex flex-row">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Trophy className="text-primary" />
        Race Schedule
      </h2>
      {!use_race_schedule && ( 
          <div className="flex flex-1 h-fit items-center justify-center">
            <div className="flex items-center h-fit gap-2 px-4 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-300 border bg-secondary/10 border-secondary/20 text-secondary -mt-1">
              <AlertCircle size={22} />
              Notice: You haven't enabled race schedule.{" "}
              <Button
                className="rounded-full p-2"
                variant="ghost"
                onClick={() => updateConfig("use_race_schedule", true)}
              >
                Enable?
              </Button>
            </div>
          </div>
        )}
        </div>
        <RaceSchedule
          raceSchedule={race_schedule}
          addRaceSchedule={(val) => {
            const updated = (() => {
              const exists = race_schedule.some(
                (r) => r.year === val.year && r.date === val.date
              );

              if (exists) {
                return race_schedule.map((r) =>
                  r.year === val.year && r.date === val.date ? val : r
                );
              }

              return [...race_schedule, val];
            })();

            updateConfig("race_schedule", updated);
          }}
          deleteRaceSchedule={(name, year) =>
            updateConfig(
              "race_schedule",
              race_schedule.filter(
                (race) => race.name !== name || race.year !== year
              )
            )
          }
          clearRaceSchedule={() => updateConfig("race_schedule", [])}
        />
    </div>
  );
}
