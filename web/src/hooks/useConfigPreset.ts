import { useState, useEffect, useCallback } from "react";
import type { Config } from "../types";

export type ConfigEntry = {
  id: string;
  name: string;
  config: Config;
};

function getConfigFromServer(configId: string): ConfigEntry | null {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/configs/${configId}`, false); // ❗ sync request

  try {
    xhr.send(null);

    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      return data.config;
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

export function useConfigPreset() {
  const [configs, setConfigs] = useState<ConfigEntry[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string>("");
  const [appliedPresetId, setAppliedPresetIdState] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const [configsRes] = await Promise.all([
          fetch("/configs")
        ]);
        const [presetIdRes] = await Promise.all([
          fetch("/config/applied-preset")
        ]);
        if (!configsRes.ok) {
          throw new Error("Failed to fetch initial configuration data");
        }

        const [configsData] = await Promise.all([
          configsRes.json(),
        ]);
        const [appliedIdData] = await Promise.all([
          presetIdRes.json()
        ]);
        const appliedId = appliedIdData.preset_id

        if (!isMounted) return;

        const normalized = Array.isArray(configsData?.configs)
          ? configsData.configs
          : [];

        setConfigs(normalized);
        setAppliedPresetIdState(appliedId);

        if (normalized.length > 0) {
          const initialId = (appliedId && normalized.some((c: ConfigEntry) => c.id === appliedId))
            ? appliedId
            : normalized[0].id;

          setActiveConfigId((prev) => prev || initialId);
        } else {
          setActiveConfigId("");
        }
      } catch (error) {
        console.error("Failed to initialize configuration presets:", error);
      }
    };

    void initialize();
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
      const created = data?.config;
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
      const duplicated = data?.config;
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
    const res = await fetch("/config/applied-preset");
    if (!res.ok) {
      throw new Error(`Failed to save applied preset id. HTTP status: ${res.status}`);
    }
    setAppliedPresetIdState(presetId);
  }, []);

  const activeIndex = configs.findIndex((entry) => entry.id === activeConfigId);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  const activeConfig = getConfigFromServer(activeConfigId);

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
