import { useState, useEffect, useCallback } from "react";
import type { Config } from "../types";
import defaultConfig from "../../../config.template.json";

export type ConfigEntry = {
  id: string;
  name: string;
  config: Config;
};

const cloneConfig = (config: Config): Config =>
  JSON.parse(JSON.stringify(config)) as Config;

const deepMerge = <T extends object>(target: T, source: T): T => {
  const output = {} as T;

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(
        (target[key] as object) ?? {},
        source[key] as object
      ) as T[Extract<keyof T, string>];
    } else {
      output[key] = target[key] !== undefined ? target[key] : source[key];
    }
  }

  // Preserve keys that exist in target but not in source (future-proof for new fields).
  for (const key in target) {
    if (!(key in output)) {
      output[key] = target[key];
    }
  }

  return output;
};

const normalizeConfigEntry = (entry: unknown): ConfigEntry | null => {
  if (!entry || typeof entry !== "object") return null;
  const candidate = entry as Partial<ConfigEntry>;
  if (!candidate.id || typeof candidate.id !== "string") return null;
  const mergedConfig =
    candidate.config && typeof candidate.config === "object"
      ? deepMerge(candidate.config as Config, defaultConfig as Config)
      : cloneConfig(defaultConfig as Config);

  return {
    id: candidate.id,
    name:
      typeof candidate.name === "string" && candidate.name.trim()
        ? candidate.name
        : candidate.id,
    config: mergedConfig,
  };
};

const isConfigEntry = (item: ConfigEntry | null): item is ConfigEntry =>
  item !== null;

export function useConfigPreset() {
  const [configs, setConfigs] = useState<ConfigEntry[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string>("");
  const [appliedPresetId, setAppliedPresetIdState] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchConfigs = async () => {
      try {
        const [configsRes, appliedRes] = await Promise.all([
          fetch("/configs"),
          fetch("/config/applied-preset"),
        ]);

        if (!configsRes.ok) throw new Error(`HTTP error! status: ${configsRes.status}`);
        const data = await configsRes.json();
        const normalized = Array.isArray(data?.configs)
          ? data.configs.map(normalizeConfigEntry).filter(isConfigEntry)
          : [];

        let appliedId = "";
        if (appliedRes.ok) {
          const appliedData = await appliedRes.json();
          appliedId = typeof appliedData?.preset_id === "string" ? appliedData.preset_id : "";
        }

        if (!isMounted) return;

        setConfigs(normalized);
        setAppliedPresetIdState(appliedId);
        const initialId =
          (appliedId && normalized.some((entry: ConfigEntry) => entry.id === appliedId) ? appliedId : "") ||
          normalized[0]?.id ||
          "";
        setActiveConfigId(initialId);
      } catch (error) {
        console.error("Failed to initialize configuration presets:", error);
      }
    };

    void fetchConfigs();
    return () => {
      isMounted = false;
    };
  }, []);


  const savePresetById = useCallback(async (presetId: string, config: Config) => {
    const res = await fetch(`/configs/${presetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      throw new Error(`Failed to save config. HTTP status: ${res.status}`);
    }
    setConfigs((prev) => prev.map((entry) => (
      entry.id === presetId
        ? { ...entry, name: config.config_name || entry.name, config }
        : entry
    )));
  }, []);

  const savePreset = useCallback(async (config: Config) => {
    if (!activeConfigId) return;
    await savePresetById(activeConfigId, config);
  }, [activeConfigId, savePresetById]);

  const createPreset = useCallback(async (): Promise<ConfigEntry | null> => {
    try {
      const res = await fetch("/configs", {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const created = normalizeConfigEntry(data?.config);
      if (!created) return null;
      setConfigs((prev) => [...prev, created]);
      setActiveConfigId(created.id);
      return created;
    } catch (error) {
      console.error("Failed to create config:", error);
      return null;
    }
  }, []);

  const duplicatePreset = useCallback(async () => {
    if (!activeConfigId) return;
    try {
      const res = await fetch(`/configs/${activeConfigId}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const duplicated = normalizeConfigEntry(data?.config);
      if (!duplicated) return;
      setConfigs((prev) => [...prev, duplicated]);
      setActiveConfigId(duplicated.id);
    } catch (error) {
      console.error("Failed to duplicate config:", error);
    }
  }, [activeConfigId]);

  const deletePreset = useCallback(async () => {
    if (!activeConfigId) return;
    try {
      const res = await fetch(`/configs/${activeConfigId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setConfigs((prev) => {
        const next = prev.filter((entry) => entry.id !== activeConfigId);
        const stillActive = next.some((entry) => entry.id === activeConfigId);
        if (!stillActive) {
          setActiveConfigId(next[0]?.id ?? "");
        }
        return next;
      });
    } catch (error) {
      console.error("Failed to delete config:", error);
      alert("Could not delete config. At least one config file must remain.");
    }
  }, [activeConfigId]);

  const activeIndex = configs.findIndex((entry) => entry.id === activeConfigId);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;
  const activeConfig = configs[resolvedIndex]?.config;

  const setActiveConfig = useCallback((presetId: string) => {
    setActiveConfigId(presetId);
  }, []);

  const applyPreset = useCallback(async (presetId: string) => {
    const res = await fetch(`/configs/${presetId}/apply`, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error(`Failed to apply preset. HTTP status: ${res.status}`);
    }
    setAppliedPresetIdState(presetId);
  }, []);

  return {
    activeIndex: resolvedIndex,
    activeConfig,
    activeConfigId,
    appliedPresetId,
    presets: configs,
    setActiveConfig,
    savePresetById,
    savePreset,
    createPreset,
    duplicatePreset,
    deletePreset,
    applyPreset,
  };
}
