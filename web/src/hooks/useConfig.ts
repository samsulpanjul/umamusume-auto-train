import { useEffect, useState } from "react";
import type { Config } from "../types";

export function useConfig(defaultConfig: Config) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [toast, setToast] = useState<{ show: boolean; message: string; isError?: boolean }>({
    show: false,
    message: "",
  });

  useEffect(() => {
    const getConfig = async () => {
      try {
        const res = await fetch("/config");
        const data = await res.json();
        setConfig(data);
      } catch (error) {
        console.error(error);
      }
    };
    getConfig();
  }, []);

  const triggerToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  const saveConfig = async () => {
    try {
      const res = await fetch("config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("Saved config:", data);
      triggerToast("Configuration saved successfully!");
    } catch (error) {
      console.error(error);
      triggerToast("Failed to save configuration.", true);
    }
  };

  return { config, setConfig, saveConfig, toast };
}