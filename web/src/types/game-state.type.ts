import { z } from "zod";

export const FriendshipLevelSchema = z.object({
  blue: z.number().default(0),
  green: z.number().default(0),
  gray: z.number().default(0),
  max: z.number().default(0),
  yellow: z.number().default(0),
})

export const SupportTypeSchema = z.object({
  supports: z.number().default(0),
  hints: z.number().default(0),
  friendship_levels: FriendshipLevelSchema
})

export const GameStateKeySchema = z.object({
  failure: z.number().default(0),
  unity_gauge_fills: z.number().default(0),
  unity_trainings: z.number().default(0),
  unity_spirit_explosions: z.number().default(0),
  total_rainbow_friends: z.number().default(0),
  total_hints: z.number().default(0),
  total_supports: z.number().default(0),
  stat_gains: z.object({
    spd: z.number().default(0),
    sta: z.number().default(0),
    pwr: z.number().default(0),
    guts: z.number().default(0),
    wit: z.number().default(0),
    sp: z.number().default(0),
  }),
  total_friendship_levels: FriendshipLevelSchema,
  hints_per_friend_level: FriendshipLevelSchema,
  spd: SupportTypeSchema,
  sta: SupportTypeSchema,
  pwr: SupportTypeSchema,
  guts: SupportTypeSchema,
  wit: SupportTypeSchema,
});

export const GameStateSchema = z.object({
  spd : GameStateKeySchema,
  sta : GameStateKeySchema,
  pwr : GameStateKeySchema,
  guts : GameStateKeySchema,
  wit : GameStateKeySchema,
});

export type GameState = z.infer<typeof GameStateSchema>;

export type UpdateGameState = <K extends keyof GameState>(
  key: K,
  value: GameState[K]
) => void;
