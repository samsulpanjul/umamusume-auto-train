import { z } from "zod";

export const StringNumberSetSchema = z.record(z.string(), z.number());

export const TemplateSchema = z.object({
  training_function: z.string(),
  action_sequence_set: z.string(),
  risk_taking_set: z.string(),
  target_stat_set: z.string(),
  stat_weight_set: z.string(),
});

export const TrainingStrategySchema = z.object({
  name: z.string(),
  timeline: z.record(z.string(), z.string()),
  stat_weight_sets: z.record(z.string(), StringNumberSetSchema),
  risk_taking_sets: z.record(z.string(), StringNumberSetSchema),
  action_sequence_sets: z.record(z.string(), z.array(z.string())),
  target_stat_sets: z.record(z.string(), StringNumberSetSchema),
  templates: z.record(z.string(), TemplateSchema),
});

export type StringNumberSet = z.infer<typeof StringNumberSetSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type TrainingStrategy = z.infer<typeof TrainingStrategySchema>;
