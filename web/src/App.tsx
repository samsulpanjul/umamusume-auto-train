import { useEffect, useState } from "react";
import rawConfig from "../../config.json";
import { useConfigPreset } from "./hooks/useConfigPreset";
import { useConfig } from "./hooks/useConfig";
import type { Config } from "./types";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import SkillList from "./components/skill/SkillList";
import PriorityStat from "./components/training/PriorityStat";
import StatCaps from "./components/training/StatCaps";
import Mood from "./components/Mood";
import FailChance from "./components/FailChance";
import PrioritizeG1 from "./components/race/PrioritizeG1";
import CancelConsecutive from "./components/race/CancelConsecutive";
import PriorityWeight from "./components/training/PriorityWeight";
import PriorityWeights from "./components/training/PriorityWeights";
import EnergyInput from "./components/energy/EnergyInput";
import IsAutoBuy from "./components/skill/IsAutoBuy";
import SkillPtsCheck from "./components/skill/SkillPtsCheck";
import IsPositionSelectionEnabled from "./components/race/IsPositionSelectionEnabled";
import PreferredPosition from "./components/race/PreferredPosition";
import IsPositionByRace from "./components/race/IsPositionByRace";
import PositionByRace from "./components/race/PositionByRace";
import WindowName from "./components/WindowName";
import SleepMultiplier from "./components/SleepMultiplier";
import RaceSchedule from "./components/race/RaceSchedule";

function App() {
  const defaultConfig = rawConfig as Config;
  const { activeIndex, activeConfig, presets, setActiveIndex, setNamePreset, savePreset } = useConfigPreset();
  const { config, setConfig, saveConfig } = useConfig(activeConfig ?? defaultConfig);
  const [presetName, setPresetName] = useState<string>("");

  useEffect(() => {
    if (presets[activeIndex]) {
      setPresetName(presets[activeIndex].name);
      setConfig(presets[activeIndex].config ?? defaultConfig);
    } else {
      setPresetName("");
      setConfig(defaultConfig);
    }
  }, [activeIndex, presets, setConfig]);

  const {
    priority_stat,
    priority_weights,
    sleep_time_multiplier,
    skip_training_energy,
    never_rest_energy,
    skip_infirmary_unless_missing_energy,
    minimum_mood,
    priority_weight,
    minimum_mood_junior_year,
    maximum_failure,
    prioritize_g1_race,
    cancel_consecutive_race,
    position_selection_enabled,
    enable_positions_by_race,
    preferred_position,
    positions_by_race,
    race_schedule,
    stat_caps,
    skill,
    window_name,
  } = config;
  const { is_auto_buy_skill, skill_pts_check, skill_list } = skill;

  const updateConfig = <K extends keyof typeof config>(key: K, value: (typeof config)[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full flex justify-center">
      <div className="my-12 w-11/12 2xl:w-3/4">
        <h1 className="text-4xl font-bold">Uma Auto Train</h1>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            {presets.map((_, i) => (
              <Button className="w-8 font-medium cursor-pointer" key={_.name} variant={i === activeIndex ? "default" : "outline"} size="sm" onClick={() => setActiveIndex(i)}>
                {i + 1}
              </Button>
            ))}
          </div>
          <Input
            className="mt-2 w-52"
            value={presetName}
            onChange={(e) => {
              const val = e.target.value;
              setPresetName(val);
              updateConfig("config_name", val);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-fit px-4">
          <WindowName windowName={window_name} setWindowName={(val) => updateConfig("window_name", val)} />

          {/* TRAINING */}
          <div className="flex flex-col mt-2 gap-2">
            <p className="text-2xl font-semibold">Training</p>
            <div className="flex divide-x-2">
              {/* PRIORITY STAT */}
              <PriorityStat priorityStat={priority_stat} setPriorityStat={(val) => updateConfig("priority_stat", val)} />

              {/* PRIORITY WEIGHTS */}
              <PriorityWeights
                priorityWeights={priority_weights}
                setPriorityWeights={(val, i) => {
                  const newWeights = [...config.priority_weights];
                  newWeights[i] = isNaN(val) ? 0 : val;
                  updateConfig("priority_weights", newWeights);
                }}
              />

              {/* PRIORITY WEIGHT */}
              <PriorityWeight priorityWeight={priority_weight} setPriorityWeight={(val) => updateConfig("priority_weight", val)} />

              {/* STAT CAPS */}
              <StatCaps statCaps={stat_caps} setStatCaps={(key, val) => updateConfig("stat_caps", { ...stat_caps, [key]: isNaN(val) ? 0 : val })} />

              {/* MAX FAIL CHANCE */}
              <FailChance maximumFailure={maximum_failure} setFail={(val) => updateConfig("maximum_failure", isNaN(val) ? 0 : val)} />
            </div>
          </div>

          <div className="flex divide-x-2 my-4">
            {/* SKILL */}
            <div className="flex flex-col gap-2 px-4">
              <p className="text-2xl font-semibold">Skill</p>
              <IsAutoBuy isAutoBuySkill={is_auto_buy_skill} setAutoBuySkill={(val) => updateConfig("skill", { ...skill, is_auto_buy_skill: val })} />
              <SkillPtsCheck skillPtsCheck={skill_pts_check} setSkillPtsCheck={(val) => updateConfig("skill", { ...skill, skill_pts_check: val })} />
              <SkillList
                list={skill_list}
                addSkillList={(val) => updateConfig("skill", { ...skill, skill_list: [val, ...skill_list] })}
                deleteSkillList={(val) => updateConfig("skill", { ...skill, skill_list: skill_list.filter((s) => s !== val) })}
              />
            </div>

            {/* ENERGY */}
            <div className="flex flex-col gap-2 px-4">
              <p className="text-2xl font-semibold">Energy</p>

              {/* SKIP TRAINING ENERGY */}
              <EnergyInput name="skip-training-energy" value={skip_training_energy} setValue={(val) => updateConfig("skip_training_energy", val)}>
                Skip Training Energy
              </EnergyInput>

              {/* NEVER REST ENERGY */}
              <EnergyInput name="never-rest-energy" value={never_rest_energy} setValue={(val) => updateConfig("never_rest_energy", val)}>
                Never Rest Energy
              </EnergyInput>

              {/* SKIP INFIRMARY UNLESS MISSING ENERGY */}
              <EnergyInput name="skip-infirmary-unless_missing-energy" value={skip_infirmary_unless_missing_energy} setValue={(val) => updateConfig("skip_infirmary_unless_missing_energy", val)}>
                Skip Infirmary Unless Missing Energy
              </EnergyInput>
            </div>

            {/* MINIMUM MOOD */}
            <Mood minimumMood={minimum_mood} setMood={(val) => updateConfig("minimum_mood", val)} minimumMoodJunior={minimum_mood_junior_year} setMoodJunior={(val) => updateConfig("minimum_mood_junior_year", val)} />
          </div>

          <p className="text-2xl font-semibold">Race</p>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {/* PRIORITIZE G1 */}
              <PrioritizeG1 prioritizeG1Race={prioritize_g1_race} setPrioritizeG1={(val) => updateConfig("prioritize_g1_race", val)} />

              {/* CANCEL CONSECUTIVE RACE */}
              <CancelConsecutive cancelConsecutive={cancel_consecutive_race} setCancelConsecutive={(val) => updateConfig("cancel_consecutive_race", val)} />

              <RaceSchedule
                raceSchedule={race_schedule}
                addRaceSchedule={(val) => updateConfig("race_schedule", [...race_schedule, val])}
                deleteRaceSchedule={(name, year) =>
                  updateConfig(
                    "race_schedule",
                    race_schedule.filter((race) => race.name !== name || race.year !== year)
                  )
                }
                clearRaceSchedule={() => updateConfig("race_schedule", [])}
              />
            </div>

            <div className="flex flex-col gap-2 ml-8">
              {/* ENABLE POSITIONS BY RACE */}
              <IsPositionSelectionEnabled positionSelectionEnabled={position_selection_enabled} setPositionSelectionEnabled={(val) => updateConfig("position_selection_enabled", val)} />

              {/* PREFERRED POSITION */}
              <PreferredPosition
                preferredPosition={preferred_position}
                setPreferredPosition={(val) => updateConfig("preferred_position", val)}
                enablePositionsByRace={enable_positions_by_race}
                positionSelectionEnabled={position_selection_enabled}
              />
            </div>

            <div className="flex flex-col gap-2">
              {/* IS POSITION BY RACE ENABLED */}
              <IsPositionByRace enablePositionsByRace={enable_positions_by_race} setPositionByRace={(val) => updateConfig("enable_positions_by_race", val)} positionSelectionEnabled={position_selection_enabled} />

              {/* POSITION BY RACE */}
              <PositionByRace
                positionByRace={positions_by_race}
                setPositionByRace={(key, val) => updateConfig("positions_by_race", { ...positions_by_race, [key]: val })}
                enablePositionsByRace={enable_positions_by_race}
                positionSelectionEnabled={position_selection_enabled}
              />
            </div>
          </div>

          <SleepMultiplier sleepMultiplier={sleep_time_multiplier} setSleepMultiplier={(val) => updateConfig("sleep_time_multiplier", val)} />
        </div>
        <p className="mt-4">
          Press <span className="font-bold">f1</span> to start/stop the bot.
        </p>
        <Button
          type="button"
          size={"lg"}
          className="px-3 py-1 font-semibold text-lg cursor-pointer mt-6"
          onClick={() => {
            setNamePreset(activeIndex, presetName);
            savePreset(config);
            saveConfig();
          }}
        >
          Save Config
        </Button>
      </div>
    </div>
  );
}

export default App;
