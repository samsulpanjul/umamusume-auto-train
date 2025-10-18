import { BarChart3 } from "lucide-react";
import PriorityStat from "./PriorityStat";
import PriorityWeights from "./PriorityWeights";
import PriorityWeight from "./PriorityWeight";
import FailChance from "./FailChance";
import StatCaps from "./StatCaps";
import type { Config, UpdateConfigType } from "@/types";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function TrainingSection({ config, updateConfig }: Props) {
  const {
    priority_stat,
    priority_weight,
    priority_weights,
    maximum_failure,
    stat_caps,
  } = config;

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <BarChart3 className="text-primary" />
        Training
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PriorityStat
          priorityStat={priority_stat}
          setPriorityStat={(val) => updateConfig("priority_stat", val)}
        />
        <PriorityWeights
          priorityWeights={priority_weights}
          setPriorityWeights={(val, i) => {
            const newWeights = [...priority_weights];
            newWeights[i] = isNaN(val) ? 0 : val;
            updateConfig("priority_weights", newWeights);
          }}
        />
        <PriorityWeight
          priorityWeight={priority_weight}
          setPriorityWeight={(val) => updateConfig("priority_weight", val)}
        />
        <FailChance
          maximumFailure={maximum_failure}
          setFail={(val) =>
            updateConfig("maximum_failure", isNaN(val) ? 0 : val)
          }
        />
      </div>
      <div className="mt-8">
        <StatCaps
          statCaps={stat_caps}
          setStatCaps={(key, val) =>
            updateConfig("stat_caps", {
              ...stat_caps,
              [key]: isNaN(val) ? 0 : val,
            })
          }
        />
      </div>
    </div>
  );
}
