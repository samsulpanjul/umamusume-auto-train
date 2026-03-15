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

  friendship: FriendshipLevels
  bottom_left: BottomLeftOptions
  top_right: TopRightOptions

  stat_gains: StatGains

  // expandable
  [key: string]: unknown
}

export type GameStateKey = {
  failure_rate: number
  supports: SupportState[]
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

  friendship: "",
  bottom_left: "",
  top_right: "",

  stat_gains: createStatGains(),
})

export const createGameStateKey = (): GameStateKey => ({
  failure_rate: 0,
  supports: [],
})

export const gameState: GameState = {
  spd: createGameStateKey(),
  sta: createGameStateKey(),
  pwr: createGameStateKey(),
  guts: createGameStateKey(),
  wit: createGameStateKey(),
}
