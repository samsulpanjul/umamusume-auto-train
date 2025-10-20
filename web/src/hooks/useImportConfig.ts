import { useRef } from "react";
import { validateConfig } from "../utils/validateConfig";
import { URL } from "../constants";
import type { Config } from "../types";

type Props = {
  activeIndex: number;
  updatePreset: (i: number, config: Config) => void;
  savePreset: (config: Config) => void;
};

export function useImportConfig({
  activeIndex,
  updatePreset,
  savePreset,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const result = validateConfig(json);

      if (!result.success) {
        console.error("Invalid config:", result.errors);
        alert(JSON.stringify(result.errors, null, 2));
        return;
      }

      const config = result.data!;
      updatePreset(activeIndex, config);
      savePreset(config);

      try {
        await fetch(`${URL}/config`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        });
      } catch (err) {
        console.warn("Failed to sync with server:", err);
      }

      alert(`Config imported to preset ${activeIndex + 1}!`);
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import config");
    } finally {
      e.target.value = "";
    }
  };

  return {
    fileInputRef,
    openFileDialog,
    handleImport,
  };
}
