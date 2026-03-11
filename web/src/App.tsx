import { useEffect, useState, useCallback } from "react";

import rawConfig from "../../config.template.json";
import { useConfigPreset } from "./hooks/useConfigPreset";
import { useConfig } from "./hooks/useConfig";
import { useImportConfig } from "./hooks/useImportConfig";
import { Pencil, CheckCircle2, AlertCircle, Sun, Moon, Plus, Copy, Trash2 } from "lucide-react";

import type { Config } from "./types";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sidebar } from "./components/ui/Sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

import SetUpSection from "./components/set-up/SetUpSection";
import EventSection from "./components/event/EventSection";
import EventListSection from "./components/event/EventListSection";
import RaceScheduleSection from "./components/race-schedule/RaceScheduleSection";
import RaceListSection from "./components/race-schedule/RaceListSection";
import SkillSection from "./components/skill/SkillSection";
import SkillListSection from "./components/skill/SkillListSection";
import TrainingSection from "./components/training/TrainingSection";
import EnergySection from "./components/training/EnergySection";
import MoodSection from "./components/training/MoodSection";
import TimelineSection from "./components/skeleton/TimelineSection";
import Tooltips from "@/components/_c/Tooltips";

interface Theme {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  dark: boolean;
}

const SETUP_KEYS = [
  "sleep_time_multiplier",
  "use_adb",
  "window_name",
  "device_id",
  "ocr_use_gpu",
  "notifications_enabled",
  "info_notification",
  "error_notification",
  "success_notification",
  "notification_volume",
] as const;

type SetupKey = (typeof SETUP_KEYS)[number];
type SetupConfig = Pick<Config, SetupKey>;

const pickSetupConfig = (config: Config): SetupConfig => ({
  sleep_time_multiplier: config.sleep_time_multiplier,
  use_adb: config.use_adb,
  window_name: config.window_name,
  device_id: config.device_id,
  ocr_use_gpu: config.ocr_use_gpu,
  notifications_enabled: config.notifications_enabled,
  info_notification: config.info_notification,
  error_notification: config.error_notification,
  success_notification: config.success_notification,
  notification_volume: config.notification_volume,
});

const stripSetupConfig = (config: Config): Config => {
  const next = { ...config } as Partial<Config>;
  for (const key of SETUP_KEYS) {
    delete next[key];
  }
  return next as Config;
};

const mergeConfigWithSetup = (config: Config, setup: SetupConfig): Config => ({
  ...stripSetupConfig(config),
  ...setup,
});

const sanitizeFileName = (value: string): string => {
  const sanitized = value.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();
  return sanitized || "config";
};

function App() {
  const [appVersion, setAppVersion] = useState<string>("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isEditing, setIsEditing] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  useEffect(() => {
    fetch("/version.txt", { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error("version fetch failed")
        return r.text()
      })
      .then(v => setAppVersion(v.trim()))
      .catch(() => setAppVersion("unknown"))
  }, []);

  const defaultConfig = rawConfig as Config;
  const [setupConfig, setSetupConfig] = useState<SetupConfig>(() =>
    pickSetupConfig(defaultConfig)
  );
  const {
    activeIndex,
    activeConfig,
    activeConfigId,
    presets,
    setActiveIndex,
    savePreset,
    updatePreset,
    createPreset,
    duplicatePreset,
    deletePreset,
  } = useConfigPreset();
  const { config, setConfig, saveConfig, toast } = useConfig(activeConfig ?? defaultConfig);
  const { fileInputRef, openFileDialog, handleImport } = useImportConfig({
    activeIndex,
    activeConfig: config,
    updatePreset,
    savePreset,
  });

  useEffect(() => {
    const getSetupConfig = async () => {
      try {
        const res = await fetch("/config/setup");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSetupConfig((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Failed to load setup config:", error);
      }
    };
    getSetupConfig();
  }, []);

  useEffect(() => {
    if (presets[activeIndex]) {
      setConfig(mergeConfigWithSetup(presets[activeIndex].config ?? defaultConfig, setupConfig));
    } else {
      setConfig(mergeConfigWithSetup(defaultConfig, setupConfig));
    }
  }, [activeIndex, defaultConfig, presets, setConfig, setupConfig]);

  const effectiveThemeId = config.theme || (themes.length > 0 ? themes[0].id : "");
  useEffect(() => {
    fetch("/themes")
      .then((res) => res.json())
      .then((data) => setThemes(data))
      .catch((err) => console.error("Failed to load themes:", err));
  }, []);

  const updateConfig = useCallback(<K extends keyof typeof config>(key: K, value: (typeof config)[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, [setConfig]);

  const exportCurrentConfig = useCallback(() => {
    const fileNameBase = sanitizeFileName(config.config_name || activeConfigId || "config");
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${fileNameBase}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [config, activeConfigId]);

  useEffect(() => {
    if (themes.length === 0) return;
    const activeTheme = themes.find((t) => t.id === effectiveThemeId) || themes[0];
    if (activeTheme) {
      document.documentElement.style.setProperty("--primary", activeTheme.primary);
      document.documentElement.style.setProperty("--secondary", activeTheme.secondary);
      if (config.theme !== activeTheme.id) {
        updateConfig("theme", activeTheme.id);
      }
    }
  }, [themes, effectiveThemeId, config.theme, updateConfig]);


  const renderContent = () => {
    const props = { config, updateConfig };
    switch (activeTab) {
      case "set-up": return <SetUpSection {...props} />;
      case "general": return <><EventSection {...props} /><RaceScheduleSection {...props} /><SkillSection {...props} /></>;
      case "training": return <><EnergySection {...props} /><MoodSection {...props} /><TrainingSection {...props} /></>;
      case "skills": return <SkillListSection {...props} />;
      case "schedule": return <RaceListSection {...props} />;
      case "events": return <EventListSection {...props} />;
      case "timeline": return <TimelineSection {...props} />;
      default: return <SetUpSection {...props} />;
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-triangles overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appVersion={appVersion}
        eventCount={config.event.event_choices.length}
        raceCount={config.race_schedule.length}
        skillCount={config.skill.skill_list.length}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="p-6 w-full py-4 self-start border-b border-border flex items-end justify-between sticky top-0 z-10 backdrop-blur-md">

          {/* Toast Notification Layer */}
          {toast.show && (
            <div className={`absolute top-11 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-300 border ${toast.isError
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-primary/10 border-primary/20 text-primary"
              }`}>
              {toast.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {toast.message}
            </div>
          )}

          <div className="flex items-end justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-xs font-thin text-muted-foreground ml-1">Configuration File</label>

                <div className="flex items-stretch shadow-sm bg-card rounded-md border border-input focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-primary transition-all">
                  <Select
                    value={activeConfigId}
                    onValueChange={(v) => {
                      const idx = presets.findIndex((preset) => preset.id === v);
                      if (idx >= 0) setActiveIndex(idx);
                      setIsEditing(false); // Auto-close edit mode when switching presets
                    }}
                  >
                    <SelectTrigger className="w-auto min-w-42 bg-card rounded-r-none shadow-none border-0 transition-colors hover:bg-accent focus:ring-0 cursor-pointer">
                      <SelectValue placeholder="Select Config" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="smallicon"
                    className="rounded-none border-l border-input bg-card hover:bg-accent h-10 w-10 transition-colors shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground"
                    onClick={() => void createPreset()}
                    title="Create new config file"
                  >
                    <Plus size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="smallicon"
                    className="rounded-none border-l border-input bg-card hover:bg-accent h-10 w-10 transition-colors shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground disabled:opacity-40"
                    disabled={!activeConfigId}
                    onClick={() => void duplicatePreset()}
                    title="Duplicate current config file"
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="smallicon"
                    className="rounded-none border-l border-input bg-card hover:bg-accent h-10 w-10 transition-colors shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground disabled:opacity-40"
                    disabled={presets.length <= 1}
                    onClick={() => {
                      if (presets.length <= 1) return;
                      const ok = window.confirm("Delete current config file?");
                      if (!ok) return;
                      void deletePreset();
                      setIsEditing(false);
                    }}
                    title="Delete current config file"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="smallicon"
                    className={`rounded-l-none border-l border-input bg-card hover:bg-accent h-10 w-10 transition-colors shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${isEditing ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Pencil size={14} className={isEditing ? "fill-current" : ""} />
                  </Button>
                </div>
              </div>

              {/* Transitioning Fields */}
              <div className={`flex w-fit gap-4 transition-all duration-300 ease-out overflow-x-hidden pb-2 -mb-2 items-end ${isEditing ? "max-w-[800px] opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-4 pointer-events-none"
                }`}>
                <div className="h-8 w-[1px] bg-border mb-1" />

                <div className="space-y-1">
                  <label className="text-xs font-thin text-muted-foreground ml-1">Name</label>
                  <Input
                    className="w-42 shadow-sm bg-card"
                    value={config.config_name}
                    onChange={(e) => updateConfig("config_name", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-thin text-muted-foreground ml-1">Uma <span className="text-[10px] text-slate-800/40">(Theme)</span></label>
                  <Select value={effectiveThemeId} onValueChange={(v) => updateConfig("theme", v)}>
                    <SelectTrigger className="min-w-42 shadow-sm bg-card">
                      <SelectValue placeholder="Loading Themes..." />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.filter(t => t && t.id).map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                            {theme.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Tooltips>{"Configs are saved as files in the bot folder under config/.\n\
              Set-up values are global (shared) and saved separately from these config files."}</Tooltips>
            </div>


            <div className="flex relative gap-3 pl-3">
              <p className="text-sm absolute top-[-1rem] end-px align-right text-muted-foreground -mt-2 w-fit whitespace-nowrap">
                Press <span className="font-bold text-primary">F1</span> to start/stop training.
              </p>
              <Button
                variant="outline"
                size="icon"
                className="uma-btn h-10 w-10"
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Button className="uma-btn" variant="outline" onClick={openFileDialog} title="If the import button is giving errors for a config, copy the config to the bot folder and run the bot with py main.py again.">
                Import
              </Button>
              <Button className="uma-btn" variant="outline" onClick={exportCurrentConfig} title="Download the currently selected config as JSON.">
                Export
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" />
              <Button className="uma-btn font-bold"
                onClick={async () => {
                  const nextSetup = pickSetupConfig(config);
                  const configWithoutSetup = stripSetupConfig(config);
                  const mergedConfig = mergeConfigWithSetup(configWithoutSetup, nextSetup);
                  try {
                    await savePreset(configWithoutSetup);
                    const setupRes = await fetch("/config/setup", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(nextSetup),
                    });
                    if (!setupRes.ok) {
                      throw new Error(`Failed to save setup config. HTTP status: ${setupRes.status}`);
                    }
                    setSetupConfig(nextSetup);
                    await saveConfig(mergedConfig);
                    setIsEditing(false);
                  } catch (error) {
                    console.error("Failed to save changes:", error);
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 flex flex-col gap-y-6 w-full min-h-[calc(100vh-6.2rem)] items-center transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}

export default App;
