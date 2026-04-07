import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import rawConfig from "../../config.template.json";
import { useConfigPreset } from "./hooks/useConfigPreset";
import { useConfig } from "./hooks/useConfig";
import { useImportConfig } from "./hooks/useImportConfig";
import { Pencil, CheckCircle2, AlertCircle, Sun, Moon, Plus, Copy, Trash2, ChevronDown, FolderUp, FolderDown, Settings2 } from "lucide-react";

import type { Config } from "./types";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sidebar } from "./components/ui/Sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";

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
import FunctionModsSection from "./components/function-mods/FunctionModsSection";
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
  "preset_id"
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
  preset_id: config.preset_id,
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
  const sanitized = Array.from(value, (char) => {
    const code = char.charCodeAt(0);
    if (code <= 31) return "_";
    return '<>:"/\\|?*'.includes(char) ? "_" : char;
  }).join("").trim();
  return sanitized || "config";
};

function exportOldConfigs() {
  const data = Object.fromEntries(
    Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])
  );

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "old_configs.json"; // suggested filename (.json enforced)
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function App() {
  const [appVersion, setAppVersion] = useState<string>("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isEditing, setIsEditing] = useState(false);
  const [isPresetActionsOpen, setIsPresetActionsOpen] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [pendingConfigSwitchId, setPendingConfigSwitchId] = useState<string | null>(null);
  const presetActionsRef = useRef<HTMLDivElement>(null);
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
    savePresetById,
    savePreset,
    createPreset,
    duplicatePreset,
    deletePreset,
    appliedPresetId,
    setAppliedPresetId,
  } = useConfigPreset();
  const { config, setConfig, saveConfig, toast } = useConfig(activeConfig?.config ?? defaultConfig);
  const { fileInputRef, openFileDialog, handleImport } = useImportConfig({
    activeConfig: config,
    createPreset,
    savePresetById,
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
      setConfig(mergeConfigWithSetup(activeConfig?.config ?? defaultConfig, setupConfig));
    } else {
      setConfig(mergeConfigWithSetup(defaultConfig, setupConfig));
    }
  }, [activeIndex, defaultConfig, presets, setConfig, setupConfig]);

  const baselineConfig = useMemo(
    () => mergeConfigWithSetup(activeConfig?.config ?? defaultConfig, setupConfig),
    [activeIndex, defaultConfig, presets, setupConfig]
  );
  const isDirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(baselineConfig),
    [baselineConfig, config]
  );
/*  const appliedPresetName = useMemo(() => {
    if (!appliedPresetId) return "None";
    return presets.find((preset) => preset.id === appliedPresetId)?.name ?? appliedPresetId;
  }, [appliedPresetId, presets]);*/

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

  const switchToPresetById = useCallback((presetId: string) => {
    const idx = presets.findIndex((preset) => preset.id === presetId);
    if (idx < 0) return;
    setActiveIndex(idx);
    setIsEditing(false);
  }, [presets, setActiveIndex]);

  const requestPresetSwitch = useCallback((presetId: string) => {
    if (presetId === activeConfigId) return;
    if (!isDirty) {
      switchToPresetById(presetId);
      return;
    }
    setPendingConfigSwitchId(presetId);
    setIsDiscardDialogOpen(true);
  }, [activeConfigId, isDirty, switchToPresetById]);

  const persistPresetAndSetup = useCallback(async (): Promise<Config> => {
    config.preset_id = activeConfigId
    const nextSetup = pickSetupConfig(config);
    const configWithoutSetup = stripSetupConfig(config);

    const mergedConfig = mergeConfigWithSetup(configWithoutSetup, nextSetup);
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
    return mergedConfig;
  }, [config, savePreset]);

  const handleSaveChanges = useCallback(async () => {
    try {
      await persistPresetAndSetup();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  }, [persistPresetAndSetup]);

  const handleApplyPreset = useCallback(async () => {
    try {
      const mergedConfig = await persistPresetAndSetup();
      await saveConfig(mergedConfig);
      if (activeConfigId) {
        await setAppliedPresetId(activeConfigId);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to apply preset:", error);
    }
  }, [activeConfigId, persistPresetAndSetup, saveConfig, setAppliedPresetId]);

  useEffect(() => {
    if (!isPresetActionsOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!presetActionsRef.current?.contains(event.target as Node)) {
        setIsPresetActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPresetActionsOpen]);

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


  if (!config?.event?.event_choices) {
    return <div>Loading...</div>; // or loading UI
  };
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
      case "function-mods": return <><FunctionModsSection {...props} /></>;
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
        <header className="p-6 w-full py-4 self-start border-b border-border flex items-end justify-between sticky top-0 z-100 backdrop-blur-md">

          {/* Toast Notification Layer */}
          {isDirty && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium border bg-card/95 backdrop-blur-md shadow-md z-20">
              <span className="text-muted-foreground">You have unsaved changes</span>
              <Button size="sm" className="h-8" onClick={() => void handleSaveChanges()}>
                Save Changes
              </Button>
            </div>
          )}
          {toast.show && (
            <div className={`absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-300 border ${toast.isError
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-primary/10 border-primary/20 text-primary"
              }`}>
              {toast.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {toast.message}
            </div>
          )}

          <div className="flex items-end justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="space-y-1 relative" ref={presetActionsRef}>
                <label className="text-xs font-thin text-muted-foreground ml-1 mr-2">Configuration File</label>
                <Tooltips size="xs">{"Configs are saved as files in the bot folder under config/.\n\
                Set-up values are global (shared) and saved separately from these config files."}</Tooltips>
                <div className="flex items-stretch shadow-sm bg-card rounded-md border border-input focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-primary transition-all">
                <Button
                    variant="ghost"
                    size="smallicon"
                    className={`rounded-r-none border-l border-input bg-card hover:bg-accent h-10 w-10 transition-colors shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${isEditing ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Pencil size={14} className={isEditing ? "fill-current" : ""} />
                  </Button>
                  <Select
                    value={activeConfigId}
                    onValueChange={requestPresetSwitch}
                  >
                    <SelectTrigger className="w-auto min-w-32 bg-card rounded-none shadow-none border-0 transition-colors hover:bg-accent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
                      <SelectValue placeholder="Select Config" />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{preset.name}</span>
                            {preset.id === appliedPresetId && (
                              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Active
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-l-none border-0 border-l border-input px-3 bg-card shadow-none transition-colors hover:bg-accent focus:ring-0 cursor-pointer font-normal"
                      onClick={() => setIsPresetActionsOpen((prev) => !prev)}
                      title="Manage preset files"
                    >
                      <Settings2 size={14} />
                      Manage
                      <ChevronDown size={14} className={isPresetActionsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                    </Button>
                    {isPresetActionsOpen && (
                      <div className="absolute translate-y-1 w-64 rounded-lg border border-border bg-popover text-foreground shadow-2xl p-2 z-100">
                        <div className="px-2 pt-1 pb-2">
                          <p className="text-sm font-medium">Manage Preset Files</p>
                          <p className="text-xs text-muted-foreground">Create, duplicate, delete, import, or export presets.</p>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9 font-normal"
                          onClick={() => {
                            setIsPresetActionsOpen(false);
                            void createPreset();
                          }}
                        >
                          <Plus size={14} />
                          Create Preset
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9 font-normal"
                          disabled={!activeConfigId}
                          onClick={() => {
                            setIsPresetActionsOpen(false);
                            void duplicatePreset();
                          }}
                        >
                          <Copy size={14} />
                          Duplicate Preset
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9"
                          disabled={presets.length <= 1}
                          onClick={() => {
                            setIsPresetActionsOpen(false);
                            if (presets.length <= 1) return;
                            const ok = window.confirm("Delete current config file?");
                            if (!ok) return;
                            void deletePreset();
                            setIsEditing(false);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete Preset
                        </Button>
                        <div className="my-1 border-t border-border" />
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9"
                          onClick={() => {
                            setIsPresetActionsOpen(false);
                            openFileDialog();
                          }}
                        >
                          <FolderUp size={14} />
                          Import Preset JSON
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9"
                          onClick={() => {
                            setIsPresetActionsOpen(false);
                            exportCurrentConfig();
                          }}
                        >
                          <FolderDown size={14} />
                          Export Preset JSON
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-9"
                          onClick={() => {
                            setIsPresetActionsOpen(false);
                            exportOldConfigs();
                          }}
                        >
                          <FolderDown size={14} />
                          Export Old Configs
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" />
              </div>

              {/* Transitioning Fields */}
              <div className={`flex w-fit gap-4 transition-all duration-300 ease-out overflow-x-hidden pb-2 -mb-2 items-end ${isEditing ? "max-w-200 opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-4 pointer-events-none"
                }`}>
                <div className="h-8 w-px bg-border mb-1" />

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
              <p className="text-sm absolute -top-4 end-px align-right text-muted-foreground -mt-2 w-fit whitespace-nowrap">
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
              <Button className="uma-btn font-bold" onClick={() => void handleApplyPreset()}>
                Save &amp; Apply Preset
              </Button>
              {/* <p className="text-sm text-muted-foreground self-center whitespace-nowrap">
                Currently applied: <span className="font-medium text-foreground">{appliedPresetName}</span>
              </p> */}
            </div>
          </div>
        </header>
        <Dialog
          open={isDiscardDialogOpen}
          onOpenChange={(open) => {
            setIsDiscardDialogOpen(open);
            if (!open) {
              setPendingConfigSwitchId(null);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Discard unsaved changes?</DialogTitle>
              <DialogDescription>
                Saved changes will be discarded if you don&apos;t save.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDiscardDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (pendingConfigSwitchId) {
                    switchToPresetById(pendingConfigSwitchId);
                  }
                  setPendingConfigSwitchId(null);
                  setIsDiscardDialogOpen(false);
                }}
              >
                Discard and Switch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="p-6 flex flex-col gap-y-6 w-full min-h-[calc(100vh-6.2rem)] items-center transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}

export default App;
