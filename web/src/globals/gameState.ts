// ---- Types ----

export type FriendshipLevel = {
  blue: number
  green: number
  gray: number
  max: number
  yellow: number
}

export type SupportType = {
  supports: number
  hints: number
  friendship_levels: FriendshipLevel
}

export type StatGains = {
  spd: number
  sta: number
  pwr: number
  guts: number
  wit: number
  sp: number
}

export type GameStateKey = {
  failure: number
  unity_gauge_fills: number
  unity_trainings: number
  unity_spirit_explosions: number
  total_rainbow_friends: number
  total_hints: number
  total_supports: number

  stat_gains: StatGains

  total_friendship_levels: FriendshipLevel
  hints_per_friend_level: FriendshipLevel

  spd: SupportType
  sta: SupportType
  pwr: SupportType
  guts: SupportType
  wit: SupportType
  pal: SupportType
  npc: SupportType
}

export type GameState = {
  spd: GameStateKey
  sta: GameStateKey
  pwr: GameStateKey
  guts: GameStateKey
  wit: GameStateKey
}

// ---- Default factories ----

const createFriendshipLevel = (): FriendshipLevel => ({
  blue: 0,
  green: 0,
  gray: 0,
  max: 0,
  yellow: 0,
})

const createSupportType = (): SupportType => ({
  supports: 0,
  hints: 0,
  friendship_levels: createFriendshipLevel(),
})

const createStatGains = (): StatGains => ({
  spd: 0,
  sta: 0,
  pwr: 0,
  guts: 0,
  wit: 0,
  sp: 0,
})

const createGameStateKey = (): GameStateKey => ({
  failure: 0,
  unity_gauge_fills: 0,
  unity_trainings: 0,
  unity_spirit_explosions: 0,
  total_rainbow_friends: 0,
  total_hints: 0,
  total_supports: 0,

  stat_gains: createStatGains(),

  total_friendship_levels: createFriendshipLevel(),
  hints_per_friend_level: createFriendshipLevel(),

  spd: createSupportType(),
  sta: createSupportType(),
  pwr: createSupportType(),
  guts: createSupportType(),
  wit: createSupportType(),
  pal: createSupportType(),
  npc: createSupportType(),
})

export const gameState: GameState = {
  spd: createGameStateKey(),
  sta: createGameStateKey(),
  pwr: createGameStateKey(),
  guts: createGameStateKey(),
  wit: createGameStateKey(),
}
