import { ChevronsRight } from "lucide-react";
import PrioritizeG1 from "./PrioritizeG1";
import CancelConsecutive from "./CancelConsecutive";
import RaceSchedule from "./RaceSchedule";
import type { Config, UpdateConfigType } from "@/types";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function RaceScheduleSection({ config, updateConfig }: Props) {
  const { prioritize_g1_race, cancel_consecutive_race, race_schedule } = config;

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <ChevronsRight className="text-primary" />
        Race Schedule
      </h2>
      <div className="flex flex-col gap-4">
        <PrioritizeG1
          prioritizeG1Race={prioritize_g1_race}
          setPrioritizeG1={(val) => updateConfig("prioritize_g1_race", val)}
        />
        <CancelConsecutive
          cancelConsecutive={cancel_consecutive_race}
          setCancelConsecutive={(val) =>
            updateConfig("cancel_consecutive_race", val)
          }
        />
        <RaceSchedule
          raceSchedule={race_schedule}
          addRaceSchedule={(val) =>
            updateConfig("race_schedule", [...race_schedule, val])
          }
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
    </div>
  );
}
