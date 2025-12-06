import { Cog } from "lucide-react";
import WindowName from "./WindowName";
import Mood from "./Mood";
import EnergySection from "../energy/EnergySection";
import SleepMultiplier from "./SleepMultiplier";
import type { Config, UpdateConfigType } from "@/types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function GeneralSection({ config, updateConfig }: Props) {
  const {
    window_name,
    minimum_mood,
    minimum_mood_junior_year,
    sleep_time_multiplier,
    minimum_condition_severity,
    use_adb,
    device_id,
  } = config;

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Cog className="text-primary" />
        General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WindowName
          windowName={window_name}
          setWindowName={(val) => updateConfig("window_name", val)}
        />
        <Mood
          minimumMood={minimum_mood}
          setMood={(val) => updateConfig("minimum_mood", val)}
          minimumMoodJunior={minimum_mood_junior_year}
          setMoodJunior={(val) => updateConfig("minimum_mood_junior_year", val)}
        />
        <EnergySection config={config} updateConfig={updateConfig} />
        <SleepMultiplier
          sleepMultiplier={sleep_time_multiplier}
          setSleepMultiplier={(val) =>
            updateConfig("sleep_time_multiplier", val)
          }
        />
        <label>
          <span>minimum_condition_severity</span>
          <Input
            type="number"
            step={1}
            value={minimum_condition_severity}
            onChange={(e) =>
              updateConfig("minimum_condition_severity", e.target.valueAsNumber)
            }
          />
        </label>
        <label>
          <Checkbox
            checked={use_adb}
            onCheckedChange={() => updateConfig("use_adb", !use_adb)}
          />
          <span>use_adb</span>
        </label>
        <label>
          <span>device_id</span>
          <Input
            type="text"
            value={device_id}
            onChange={(e) => updateConfig("device_id", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
