import { useRef } from "react";
import { validateConfig } from "../utils/validateConfig";
import type { Config } from "../types";
import { SETUP_KEYS } from "../constants/setupKeys";

type Props = {
  activeConfig: Config;
  createPreset: () => Promise<{ id: string } | null>;
  savePresetById: (presetId: string, config: Config) => void | Promise<void>;
};

export function useImportConfig({
  activeConfig,
  createPreset,
  savePresetById,
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

      const normalizedImport =
        json && typeof json === "object"
          ? { ...(json as Record<string, unknown>) }
          : {};

      for (const key of SETUP_KEYS) {
        if (!(key in normalizedImport)) {
          normalizedImport[key] = activeConfig[key];
        }
      }

      const result = validateConfig(normalizedImport);

      if (!result.success) {
        console.error("Invalid config:", result.errors);
        alert(JSON.stringify(result.errors, null, 2));
        return;
      }

      const config = result.data!;
      const createdPreset = await createPreset();
      if (!createdPreset?.id) {
        alert("Failed to create a new preset for import");
        return;
      }
      await savePresetById(createdPreset.id, config);

      alert("Config imported into a new preset!");
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
