import { z } from "zod";

const MinimumAcceptableScoreSchema = z.object({
  use_user_defined_minimum_score:z.boolean(),
  use_static_score:z.boolean(),
  user_defined_score: z.number(),
  minimum_acceptable_training: z.object({
    training_type: z.string(),
    failure: z.number(),
    total_supports: z.number(),
    stat_gains: z.object({
      spd: z.number(),
      sta: z.number(),
      pwr: z.number(),
      guts: z.number(),
      wit: z.number(),
      sp: z.number(),
    }),
    friendship_levels: z.object({
      gray: z.number(),
      blue: z.number(),
      green: z.number(),
      yellow: z.number(),
      max: z.number(),
    }),
    total_rainbow_friends: z.number(),
    total_friendship_increases: z.number(),
    unity_gauge_fills: z.number(),
    unity_trainings: z.number(),
    unity_spirit_explosions: z.number(),
  }),
});

export const MinimumAcceptableScoresSchema = z.object({
  max_out_friendships: MinimumAcceptableScoreSchema,
  rainbow_training: MinimumAcceptableScoreSchema,
  most_support_cards: MinimumAcceptableScoreSchema,
  meta_training: MinimumAcceptableScoreSchema,
  most_stat_gain: MinimumAcceptableScoreSchema,
});

export type MinimumAcceptableScores = z.infer<typeof MinimumAcceptableScoresSchema>;
