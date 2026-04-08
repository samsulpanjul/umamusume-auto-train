import { z } from "zod";

const FunctionFallbackSchema = (enabled: boolean, method: string) => {
  const base = z.object({
    fallback_enabled: z.boolean().default(enabled),
    fallback_method: z.string().default(method),
  });

  return base.default(base.parse({}));
};

const FunctionFallbacksBase = z.object({
  max_out_friendships: FunctionFallbackSchema(true, "rainbow_training"),
  rainbow_training: FunctionFallbackSchema(true, "most_support_cards"),
  most_support_cards: FunctionFallbackSchema(true, "action_queue"),
  meta_training: FunctionFallbackSchema(false, "action_queue"),
  most_stat_gain: FunctionFallbackSchema(false, "action_queue"),
});

export const FunctionFallbacksSchema = FunctionFallbacksBase.default(
  FunctionFallbacksBase.parse({})
);

export type FunctionFallbacks = z.infer<typeof FunctionFallbacksSchema>;