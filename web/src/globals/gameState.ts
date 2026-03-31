export const SUPPORT_TYPES = [
  "",
  "spd",
  "sta",
  "pwr",
  "guts",
  "wit",
  "pal",
  "npc",
] as const;

export const BOTTOM_LEFT_OPTIONS = [
  "",
  "unity_gauge_empty",
  "unity_gauge_full",
  "unity_gauge_exploded",
] as const;

export const TOP_RIGHT_OPTIONS = [
  "",
  "hint",
  "unity_training",
] as const;

export const FRIENDSHIP_LEVELS = [
  "",
  "gray",
  "blue",
  "green",
  "yellow",
  "max",
] as const;

export type SupportTypes      = typeof SUPPORT_TYPES[number];
export type BottomLeftOptions = typeof BOTTOM_LEFT_OPTIONS[number];
export type TopRightOptions   = typeof TOP_RIGHT_OPTIONS[number];
export type FriendshipLevels  = typeof FRIENDSHIP_LEVELS[number];

export type StatGains = {
  spd: number
  sta: number
  pwr: number
  guts: number
  wit: number
  sp: number
}

export type SupportState = {
  card_index: number
  type: SupportTypes
  enabled: boolean

  friendship: FriendshipLevels
  bottom_left: BottomLeftOptions
  top_right: TopRightOptions

  // expandable
  [key: string]: unknown
}

export type GameStateKey = {
  failure_rate: number
  stat_gains: StatGains
  supports: SupportState[]
  training_type?: string
  use_fixed_score?: boolean
  fixed_score?: number
}

export type GameState = {
  spd: GameStateKey
  sta: GameStateKey
  pwr: GameStateKey
  guts: GameStateKey
  wit: GameStateKey
}

export const createStatGains = (): StatGains => ({
  spd: 0,
  sta: 0,
  pwr: 0,
  guts: 0,
  wit: 0,
  sp: 0,
})

export const createSupportState = (
  card_index: number,
  type: SupportTypes = ""
): SupportState => ({
  card_index,
  type,
  enabled: false,

  friendship: "",
  bottom_left: "",
  top_right: "",

})

export const createGameStateKey = (): GameStateKey => ({
  failure_rate: 0,
  stat_gains: createStatGains(),
  supports: [],
})

export const gameState: GameState = {
  spd: createGameStateKey(),
  sta: createGameStateKey(),
  pwr: createGameStateKey(),
  guts: createGameStateKey(),
  wit: createGameStateKey(),
}

export type MinScoreStates = {
  max_out_friendships: GameStateKey,
  rainbow_training: GameStateKey,
  most_support_cards: GameStateKey,
  meta_training: GameStateKey,
  most_stat_gain: GameStateKey,
}

export const minScoreStates: MinScoreStates = {
  max_out_friendships: createGameStateKey(),
  rainbow_training: createGameStateKey(),
  most_support_cards: createGameStateKey(),
  meta_training: createGameStateKey(),
  most_stat_gain: createGameStateKey(),
}
