// ---- Types ----

export type FriendshipLevel = "" | "gray" | "blue" | "green" | "orange" | "max"

export type UnityGauge = "" | "empty" | "full" | "exploded"

export type TopRightStatus = "" | "empty" | "hint" | "unity_training" | "unity_explosion"

export type SupportSlotType =
  | ""
  | "spd"
  | "sta"
  | "pwr"
  | "guts"
  | "wit"
  | "pal"
  | "npc"

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
  type: SupportSlotType

  friendship: FriendshipLevel
  unity_training: boolean
  unity_gauge: UnityGauge
  top_right_status: TopRightStatus

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
  type: SupportSlotType = ""
): SupportState => ({
  card_index,
  type,

  friendship: "",
  unity_training: false,
  unity_gauge: "",
  top_right_status: "",

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
