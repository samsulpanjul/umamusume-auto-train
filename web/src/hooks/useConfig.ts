import { useState } from "react";
import type { Config } from "../types";

export function useConfig(defaultConfig: Config) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [toast, setToast] = useState<{ show: boolean; message: string; isError?: boolean }>({
    show: false,
    message: "",
  });

  const triggerToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
  };

  const saveConfig = async (nextConfig: Config) => {
    try {
      const res = await fetch("config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextConfig),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      await res.json();
      triggerToast("Configuration changed successfully!");
    } catch (error) {
      console.error(error);
      triggerToast("Failed to save configuration.", true);
    }
  };

  return { config, setConfig, saveConfig, toast };
}