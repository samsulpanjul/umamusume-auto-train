import { useEffect, useState, useCallback } from "react";

import rawConfig from "../../config.json";
import { useConfigPreset } from "./hooks/useConfigPreset";
import { useConfig } from "./hooks/useConfig";
import { useImportConfig } from "./hooks/useImportConfig";
import { Pencil, CheckCircle2, AlertCircle, Sun, Moon } from "lucide-react";

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

interface Theme {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  dark: boolean;
}

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
  const { activeIndex, activeConfig, presets, setActiveIndex, savePreset, updatePreset } = useConfigPreset();
  const { config, setConfig, saveConfig, toast } = useConfig(activeConfig ?? defaultConfig);
  const { fileInputRef, openFileDialog, handleImport } = useImportConfig({ activeIndex, updatePreset, savePreset });

  useEffect(() => {
    if (presets[activeIndex]) {
      setConfig(presets[activeIndex].config ?? defaultConfig);
    } else {
      setConfig(defaultConfig);
    }
  }, [activeIndex, defaultConfig, presets, setConfig]);

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
                <label className="text-xs font-thin text-muted-foreground ml-1">Configuration Preset</label>

                <div className="flex items-stretch shadow-sm bg-card rounded-md border border-input focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-primary transition-all">
                  <Select
                    value={activeIndex.toString()}
                    onValueChange={(v) => {
                      setActiveIndex(parseInt(v));
                      setIsEditing(false); // Auto-close edit mode when switching presets
                    }}
                  >
                    <SelectTrigger className="w-auto min-w-42 bg-card rounded-r-none shadow-none border-0 transition-colors hover:bg-accent focus:ring-0 cursor-pointer">
                      <SelectValue placeholder="Select Preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {preset.name || `Preset ${i + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button className="uma-btn" variant="outline" onClick={openFileDialog} >
                Import
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" />
              <Button className="uma-btn font-bold"
                onClick={() => {
                  savePreset(config);
                  saveConfig();
                  setIsEditing(false);
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
