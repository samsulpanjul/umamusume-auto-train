import { Cog } from "lucide-react";
import WindowName from "./WindowName";
import Mood from "./Mood";
import EnergySection from "../energy/EnergySection";
import SleepMultiplier from "./SleepMultiplier";
import type { Config, UpdateConfigType } from "@/types";

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
      </div>
    </div>
  );
}
