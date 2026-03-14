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
        const res = await fetch("/configs");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const normalized = Array.isArray(data?.configs)
          ? data.configs.map(normalizeConfigEntry).filter(isConfigEntry)
          : [];
        if (!isMounted) return;
        setConfigs(normalized);
        if (normalized.length > 0) {
          setActiveConfigId((prev) => prev || normalized[0].id);
        } else {
          setActiveConfigId("");
        }
      } catch (error) {
        console.error("Failed to load configs:", error);
      }
    };

    fetchConfigs();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAppliedPreset = async () => {
      try {
        const res = await fetch("/config/applied-preset");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;
        setAppliedPresetIdState(typeof data?.preset_id === "string" ? data.preset_id : "");
      } catch (error) {
        console.error("Failed to load applied preset:", error);
      }
    };

    void fetchAppliedPreset();
    return () => {
      isMounted = false;
    };
  }, []);

  const updatePreset = (index: number, newConfig: Config) => {
    setConfigs((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      next[index] = {
        ...next[index],
        name: newConfig.config_name || next[index].name,
        config: newConfig,
      };
      return next;
    });
  };

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

  const setAppliedPresetId = useCallback(async (presetId: string) => {
    const res = await fetch("/config/applied-preset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset_id: presetId }),
    });
    if (!res.ok) {
      throw new Error(`Failed to save applied preset id. HTTP status: ${res.status}`);
    }
    setAppliedPresetIdState(presetId);
  }, []);

  const activeIndex = configs.findIndex((entry) => entry.id === activeConfigId);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;
  const activeConfig = configs[resolvedIndex]?.config;

  return {
    activeIndex: resolvedIndex,
    activeConfig,
    activeConfigId,
    appliedPresetId,
    presets: configs,
    setActiveIndex: (index: number) => {
      if (index < 0 || index >= configs.length) return;
      setActiveConfigId(configs[index].id);
    },
    updatePreset,
    savePresetById,
    savePreset,
    createPreset,
    duplicatePreset,
    deletePreset,
    setAppliedPresetId,
  };
}
