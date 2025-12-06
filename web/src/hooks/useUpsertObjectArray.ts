import { useCallback } from "react";

export function useUpsertObjectArray<T extends Record<string, unknown>>(
  setState: React.Dispatch<React.SetStateAction<T[]>>
) {
  const upsert = useCallback(
    (key: string, value: unknown) => {
      const newItem = { [key]: value } as T;

      setState((prev) => {
        const exists = prev.some((item) => Object.keys(item)[0] === key);

        if (exists) {
          // replace existing
          return prev.map((item) =>
            Object.keys(item)[0] === key ? newItem : item
          );
        }

        // add new
        return [...prev, newItem];
      });
    },
    [setState]
  );

  return upsert;
}
