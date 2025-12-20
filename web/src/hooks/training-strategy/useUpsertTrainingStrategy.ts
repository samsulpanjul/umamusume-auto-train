import { useCallback } from "react";
import type { Config, UpdateConfigType } from "@/types";
import type { TrainingStrategy } from "@/types/training-strategy.type";

export function useUpsertTrainingStrategy<
  K extends {
    [P in keyof TrainingStrategy]: TrainingStrategy[P] extends object
      ? P
      : never;
  }[keyof TrainingStrategy]
>(config: Config, updateConfig: UpdateConfigType, field: K) {
  return useCallback(
    (key: string, value: Record<string, unknown>) => {
      const next = {
        ...config.training_strategy,
        [field]: {
          ...config.training_strategy[field],
          [key]: value,
        },
      };

      updateConfig("training_strategy", next);
    },
    [field, config.training_strategy, updateConfig]
  );
}
