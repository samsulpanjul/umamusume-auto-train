import { ConfigSchema } from "../types";
import { z } from "zod";

export function validateConfig(data: unknown) {
  const parsed = ConfigSchema.safeParse(data);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);
    return { success: false, errors };
  }

  return { success: true, data: parsed.data };
}
