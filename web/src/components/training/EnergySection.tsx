import { Zap } from "lucide-react";
import { Input } from "../ui/input";
import type { Config, UpdateConfigType } from "@/types";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function TrainingSection({ config, updateConfig }: Props) {
  const {
    maximum_failure,
    minimum_condition_severity,
    skip_training_energy,
    never_rest_energy,
    skip_infirmary_unless_missing_energy,
    rest_before_summer_energy,
  } = config;

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Zap className="text-primary" />
        Energy
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="flex flex-col gap-2">
          <label className="flex flex-row gap-2 w-fit items-center cursor-pointer">
            Skip Training Energy
            <Input
              className="w-20 text-center"
              type="number"
              min={0}
              value={skip_training_energy}
              onChange={(e) => updateConfig("skip_training_energy", e.target.valueAsNumber)} />
          </label>
          <label className="flex flex-row gap-2 w-fit items-center cursor-pointer">
            Never Rest Energy
            <Input
              className="w-20 text-center"
              type="number"
              min={0}
              value={never_rest_energy}
              onChange={(e) => updateConfig("never_rest_energy", e.target.valueAsNumber)} />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex flex-row gap-2 w-fit items-center cursor-pointer">
            Rest Before Summer Energy
            <Input
              className="w-20 text-center"
              type="number"
              min={0}
              value={rest_before_summer_energy}
              onChange={(e) =>
                updateConfig("rest_before_summer_energy", e.target.valueAsNumber)
              }
            />
          </label>
          <label className="flex flex-row gap-2 w-fit items-center cursor-pointer">
            Skip Infirmary Threshold
            <Input
              className="w-20 text-center"
              type="number"
              min={0}
              value={skip_infirmary_unless_missing_energy}
              onChange={(e) =>
                updateConfig(
                  "skip_infirmary_unless_missing_energy",
                  e.target.valueAsNumber
                )
              }
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex flex-row gap-2 w-fit items-center cursor-pointer">
            Max Failure Chance (%)
            <div className="flex items-center gap-2">
              <Input
                className="w-20 text-center"
                type="number"
                min={0}
                value={maximum_failure}
                onChange={(e) =>
                  updateConfig(
                    "maximum_failure",
                    isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber
                  )
                }
              />
            </div>
          </label>
          <label className="flex flex-row gap-2 w-fit items-center cursor-pointer">
            Min Condition Severity
            <Input
              className="w-20 text-center"
              type="number"
              step={1}
              value={minimum_condition_severity}
              onChange={(e) =>
                updateConfig(
                  "minimum_condition_severity",
                  e.target.valueAsNumber
                )
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
