import { ChevronsRight } from "lucide-react";
import PrioritizeG1 from "./PrioritizeG1";
import CancelConsecutive from "./CancelConsecutive";
import RaceSchedule from "./RaceSchedule";
import type { Config, UpdateConfigType } from "@/types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function RaceScheduleSection({ config, updateConfig }: Props) {
  const {
    use_race_schedule,
    cancel_consecutive_race,
    race_schedule,
    race_turn_threshold,
    do_mission_races_if_possible,
    prioritize_missions_over_g1,
  } = config;

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <ChevronsRight className="text-primary" />
        Race Schedule
      </h2>
      <div className="flex flex-col gap-4">
        <PrioritizeG1
          prioritizeG1Race={use_race_schedule}
          setPrioritizeG1={(val) => updateConfig("use_race_schedule", val)}
        />
        <CancelConsecutive
          cancelConsecutive={cancel_consecutive_race}
          setCancelConsecutive={(val) =>
            updateConfig("cancel_consecutive_race", val)
          }
        />
        <label htmlFor="">
          <span>race_turn_threshold</span>
          <Input
            type="number"
            step={1}
            value={race_turn_threshold}
            onChange={(e) =>
              updateConfig("race_turn_threshold", e.target.valueAsNumber)
            }
          />
        </label>
        <label htmlFor="do_mission_races_if_possible">
          <Checkbox
            id="do_mission_races_if_possible"
            checked={do_mission_races_if_possible}
            onCheckedChange={() =>
              updateConfig(
                "do_mission_races_if_possible",
                !do_mission_races_if_possible
              )
            }
          />
          <span>do_mission_races_if_possible</span>
        </label>
        <label htmlFor="prioritize_missions_over_g1">
          <Checkbox
            id="prioritize_missions_over_g1"
            checked={prioritize_missions_over_g1}
            onCheckedChange={() =>
              updateConfig(
                "prioritize_missions_over_g1",
                !prioritize_missions_over_g1
              )
            }
          />
          <span>prioritize_missions_over_g1</span>
        </label>
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
    </div>
  );
}
