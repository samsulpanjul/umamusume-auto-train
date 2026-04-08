import { z } from "zod";

// 1. Define the "Base" shape
const StatGainsBase = z.object({
  spd: z.number().default(0),
  sta: z.number().default(0),
  pwr: z.number().default(0),
  guts: z.number().default(0),
  wit: z.number().default(0),
  sp: z.number().default(0),
});
// 2. Create the exported schema by parsing an empty object to get the full default
export const StatGainsSchema = StatGainsBase.default(StatGainsBase.parse({}));

const FriendshipLevelsBase = z.object({
  gray: z.number().default(0),
  blue: z.number().default(0),
  green: z.number().default(0),
  yellow: z.number().default(0),
  max: z.number().default(0),
});
export const FriendshipLevelsSchema = FriendshipLevelsBase.default(FriendshipLevelsBase.parse({}));

const MinimumAcceptableTrainingBase = z.object({
  training_type: z.string().default("spd"),
  failure: z.number().default(0),
  total_supports: z.number().default(0),
  stat_gains: StatGainsSchema,
  friendship_levels: FriendshipLevelsSchema,
  total_rainbow_friends: z.number().default(0),
  total_friendship_increases: z.number().default(0),
  unity_gauge_fills: z.number().default(0),
  unity_trainings: z.number().default(0),
  unity_spirit_explosions: z.number().default(0),
});
export const MinimumAcceptableTrainingSchema = MinimumAcceptableTrainingBase.default(
  MinimumAcceptableTrainingBase.parse({})
);

const MinimumAcceptableScoreBase = z.object({
  use_user_defined_minimum_score: z.boolean().default(false),
  use_static_score: z.boolean().default(false),
  user_defined_score: z.number().default(0),
  minimum_acceptable_training: MinimumAcceptableTrainingSchema,
});
export const MinimumAcceptableScoreSchema = MinimumAcceptableScoreBase.default(
  MinimumAcceptableScoreBase.parse({})
);

export const MinimumAcceptableScoresSchema = z.object({
  max_out_friendships: MinimumAcceptableScoreSchema,
  rainbow_training: MinimumAcceptableScoreSchema,
  most_support_cards: MinimumAcceptableScoreSchema,
  meta_training: MinimumAcceptableScoreSchema,
  most_stat_gain: MinimumAcceptableScoreSchema,
});

export type MinimumAcceptableScores = z.infer<typeof MinimumAcceptableScoresSchema>;