import { useState, useEffect } from "react";
import type { Config } from "../types";
import defaultConfig from "../../../config.json";

const STORAGE_KEY = "uma-config";
const MAX_PRESET = 10;

type Preset = {
  name: string;
  config: Config;
};

type PresetStorage = {
  index: number;
  presets: Preset[];
};

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

export function useConfigPreset() {
  const [presetStorage, setPresetStorage] = useState<PresetStorage>({
    index: 0,
    presets: [],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: PresetStorage = JSON.parse(saved);

      const upgradedPresets = parsed.presets.map((preset) => ({
        ...preset,
        config: deepMerge(preset.config, defaultConfig),
      }));

      const upgraded = { ...parsed, presets: upgradedPresets };
      setPresetStorage(upgraded);
      setActiveIndex(parsed.index);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
    } else {
      const defaultPresets = Array.from({ length: MAX_PRESET }, (_, i) => ({
        name: `Preset ${i + 1}`,
        config: defaultConfig,
      }));
      const init = { index: 0, presets: defaultPresets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      setPresetStorage(init);
      setActiveIndex(0);
    }
  }, []);

  const updatePreset = (index: number, newConfig: Config) => {
    setPresetStorage((prev) => {
      const newPresets = [...prev.presets];
      newPresets[index] = {
        name: newConfig.config_name || `Preset ${index + 1}`,
        config: newConfig,
      };

      const next = { ...prev, presets: newPresets };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  };

  const savePreset = (config: Config) => {
    setPresetStorage((prev) => {
      const newPresets = [...prev.presets];
      newPresets[activeIndex] = {
        name: config.config_name || `Preset ${activeIndex + 1}`,
        config,
      };
      const next = { ...prev, index: activeIndex, presets: newPresets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return {
    activeIndex,
    activeConfig: presetStorage.presets[activeIndex]?.config,
    presets: presetStorage.presets,
    setActiveIndex,
    updatePreset,
    savePreset,
  };
}
