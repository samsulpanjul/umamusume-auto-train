import { useCallback } from "react";
import type { Config, UpdateConfigType } from "@/types";
import type { TrainingStrategy } from "@/types/training-strategy.type";

export function useModifyTrainingStrategy<
  K extends {
    [P in keyof TrainingStrategy]: TrainingStrategy[P] extends object
      ? P
      : never;
  }[keyof TrainingStrategy]
>(config: Config, updateConfig: UpdateConfigType, field: K) {
  return useCallback(
    (key: string, value?: any) => {
      const current = config.training_strategy[field];

      const nextObject = { ...current };

      if (value === null) {
        // delete mode
        delete nextObject[key];
      } else {
        // upsert mode
        nextObject[key] = value;
      }

      updateConfig("training_strategy", {
        ...config.training_strategy,
        [field]: nextObject,
      });
    },
    [config.training_strategy, updateConfig, field]
  );
}
