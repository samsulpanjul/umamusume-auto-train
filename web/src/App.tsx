import { useEffect } from "react";

import rawConfig from "../../config.json";
import { useConfigPreset } from "./hooks/useConfigPreset";
import { useConfig } from "./hooks/useConfig";
import { useImportConfig } from "./hooks/useImportConfig";

import type { Config } from "./types";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import EventSection from "./components/event/EventSection";
import RaceScheduleSection from "./components/race-schedule/RaceScheduleSection";
import SkillSection from "./components/skill/SkillSection";
import RaceStyleSection from "./components/race-style/RaceStyleSection";
import TrainingSection from "./components/training/TrainingSection";
import GeneralSection from "./components/general/GeneralSection";

function App() {
  const defaultConfig = rawConfig as Config;
  const {
    activeIndex,
    activeConfig,
    presets,
    setActiveIndex,
    savePreset,
    updatePreset,
  } = useConfigPreset();
  const { config, setConfig, saveConfig } = useConfig(
    activeConfig ?? defaultConfig
  );
  const { fileInputRef, openFileDialog, handleImport } = useImportConfig({
    activeIndex,
    updatePreset,
    savePreset,
  });

  useEffect(() => {
    if (presets[activeIndex]) {
      setConfig(presets[activeIndex].config ?? defaultConfig);
    } else {
      setConfig(defaultConfig);
    }
  }, [activeIndex, presets, setConfig]);

  const { config_name } = config;

  const updateConfig = <K extends keyof typeof config>(
    key: K,
    value: (typeof config)[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="p-5 flex items-center justify-between sticky top-0 bg-background z-10">
          <div>
            <h1 className="text-5xl font-bold text-primary tracking-tight">
              Uma Auto Train
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Configure your auto-training settings below.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4">
              <div>
                <Button
                  onClick={openFileDialog}
                  size={"lg"}
                  variant={"outline"}
                >
                  Import Config
                </Button>
                <input
                  type="file"
                  accept=".json,application/json"
                  ref={fileInputRef}
                  onChange={handleImport}
                  className="hidden"
                />
              </div>
              <Button
                size={"lg"}
                className="font-semibold text-lg shadow-lg shadow-primary/20"
                onClick={() => {
                  savePreset(config);
                  saveConfig();
                }}
              >
                Save Configuration
              </Button>
            </div>
            <p className="text-muted-foreground">
              Press <span className="font-bold text-primary">F1</span> to
              start/stop the bot.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          {presets.map((_, i) => (
            <Button
              key={_.name + i}
              variant={i === activeIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveIndex(i)}
            >
              Preset {i + 1}
            </Button>
          ))}
        </div>

        <div className="mb-8">
          <Input
            className="w-full sm:w-72 bg-card border-2 border-primary/20 focus:border-primary/50"
            placeholder="Preset Name"
            value={config_name}
            onChange={(e) => updateConfig("config_name", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-2">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <TrainingSection config={config} updateConfig={updateConfig} />

            <GeneralSection config={config} updateConfig={updateConfig} />

            <RaceStyleSection config={config} updateConfig={updateConfig} />
          </div>

          <div className="flex flex-col gap-8">
            <SkillSection config={config} updateConfig={updateConfig} />
            <RaceScheduleSection config={config} updateConfig={updateConfig} />
            <EventSection config={config} updateConfig={updateConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
