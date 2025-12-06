import { useCallback } from "react";

export function useHandleValueChange<T>(
  setValue: React.Dispatch<React.SetStateAction<T>>
) {
  return useCallback(
    (key: string, value: any) => {
      setValue((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setValue]
  );
}
