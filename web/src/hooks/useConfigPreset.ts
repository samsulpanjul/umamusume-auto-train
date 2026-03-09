import { useState, useEffect, useCallback } from "react";
import type { Config } from "../types";
import defaultConfig from "../../../config.template.json";

const MAX_PRESET = 10;

type Preset = {
  name: string;
  config: Config;
};

type PresetStorage = {
  index: number;
  presets: Preset[];
};

const cloneConfig = (config: Config): Config =>
  JSON.parse(JSON.stringify(config)) as Config;

const clampIndex = (index: number) =>
  Math.min(Math.max(index, 0), MAX_PRESET - 1);

const buildDefaultPresetStorage = (baseConfig: Config): PresetStorage => ({
  index: 0,
  presets: Array.from({ length: MAX_PRESET }, (_, i) => ({
    name: `Preset ${i + 1}`,
    config: cloneConfig(baseConfig),
  })),
});

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

  return output;
};

const normalizePresetStorage = (raw: unknown): PresetStorage => {
  const defaults = buildDefaultPresetStorage(defaultConfig as Config);
  if (!raw || typeof raw !== "object") return defaults;

  const maybeStorage = raw as Partial<PresetStorage>;
  const rawPresets = Array.isArray(maybeStorage.presets)
    ? maybeStorage.presets
    : [];

  const presets: Preset[] = Array.from({ length: MAX_PRESET }, (_, idx) => {
    const fallback = defaults.presets[idx];
    const rawPreset = rawPresets[idx];
    if (!rawPreset || typeof rawPreset !== "object") return fallback;

    const candidate = rawPreset as Partial<Preset>;
    const mergedConfig =
      candidate.config && typeof candidate.config === "object"
        ? deepMerge(candidate.config as Config, defaultConfig as Config)
        : fallback.config;

    return {
      name:
        typeof candidate.name === "string" && candidate.name.trim()
          ? candidate.name
          : fallback.name,
      config: mergedConfig,
    };
  });

  return {
    index: clampIndex(
      typeof maybeStorage.index === "number" ? maybeStorage.index : 0
    ),
    presets,
  };
};

export function useConfigPreset() {
  const [presetStorage, setPresetStorage] = useState<PresetStorage>(() =>
    buildDefaultPresetStorage(defaultConfig as Config)
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const persistPresetStorage = useCallback(async (next: PresetStorage) => {
    try {
      await fetch("/config/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch (error) {
      console.error("Failed to save presets:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPresets = async () => {
      try {
        const res = await fetch("/config/presets");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const normalized = normalizePresetStorage(data);
        if (!isMounted) return;
        setPresetStorage(normalized);
        setActiveIndex(normalized.index);
      } catch (error) {
        console.error("Failed to load presets:", error);
      }
    };

    fetchPresets();
    return () => {
      isMounted = false;
    };
  }, []);

  const setActivePresetIndex = (index: number) => {
    const nextIndex = clampIndex(index);
    setActiveIndex(nextIndex);
    setPresetStorage((prev: PresetStorage) => {
      const next = { ...prev, index: nextIndex };
      void persistPresetStorage(next);
      return next;
    });
  };

  const updatePreset = (index: number, newConfig: Config) => {
    const nextIndex = clampIndex(index);
    setPresetStorage((prev: PresetStorage) => {
      const newPresets = [...prev.presets];
      newPresets[nextIndex] = {
        name: newConfig.config_name || `Preset ${nextIndex + 1}`,
        config: newConfig,
      };

      const next = { ...prev, presets: newPresets };
      void persistPresetStorage(next);
      return next;
    });
  };

  const savePreset = (config: Config) => {
    setPresetStorage((prev: PresetStorage) => {
      const newPresets = [...prev.presets];
      newPresets[activeIndex] = {
        name: config.config_name || `Preset ${activeIndex + 1}`,
        config,
      };
      const next = { ...prev, index: activeIndex, presets: newPresets };
      void persistPresetStorage(next);
      return next;
    });
  };

  return {
    activeIndex,
    activeConfig: presetStorage.presets[activeIndex]?.config,
    presets: presetStorage.presets,
    setActiveIndex: setActivePresetIndex,
    updatePreset,
    savePreset,
  };
}
