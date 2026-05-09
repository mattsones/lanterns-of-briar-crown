export type StatBlock = Record<string, number>;
export type Inventory = Record<string, number>;

export type Equipment = {
  weapon: string | null;
  helm: string | null;
  cloak: string | null;
  trinket1: string | null;
  trinket2: string | null;
  armor: string | null;
  [slot: string]: string | null;
};

export type BattlePouch = {
  slot1: string | null;
  slot2: string | null;
  [slot: string]: string | null;
};

export type Position = {
  x: number;
  y: number;
};

export type Player = {
  name: string;
  gender: string;
  raceId: string;
  appearanceId: string;
  level: number;
  xp: number;
  gold: number;
  maxHp: number;
  hp: number;
  baseStats: StatBlock;
  inventory: Inventory;
  equipment: Equipment;
  battlePouch: BattlePouch;
  checkpointLabel: string;
  [key: string]: unknown;
};

export type Companion = {
  recruited: boolean;
  id: string | null;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  command: string;
  buffed: boolean;
  style: string | null;
  icon: string | null;
  role: string | null;
  futurePath: string | null;
  futurePathOptions: unknown[] | null;
  [key: string]: unknown;
};

export type Flags = Record<string, unknown>;

export type SavePayload = {
  screen: string;
  player: Player;
  region: string;
  position: Position;
  visited: Record<string, Record<string, boolean>>;
  companion: Companion;
  flags: Flags;
  quest: unknown;
  toast: string;
};

export type SaveSlot = {
  id: number;
  name: string;
  updatedAt: number | null;
  payload: SavePayload | null;
};

export type RollSpec = {
  count: number;
  sides: number;
  bonus?: number;
};

export type RollResult = {
  rolls: number[];
  total: number;
  notation: string;
};

export type SkillCheckResult = {
  stat: string;
  dc: number;
  roll: number;
  bonus: number;
  total: number;
  success: boolean;
  label: string;
};

export type Enemy = {
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  intentA: string;
  intentB: string;
  intent: string;
  currentAttackSpec: RollSpec;
  attackA: RollSpec;
  attackB: RollSpec;
  guardBroken: boolean;
  weakened: boolean;
};

export type Battle = {
  enemy: Enemy;
  queue: Enemy[];
  totalEnemies: number;
  rewardKey: string;
  turn: string;
  heroGuard: number;
  cooldowns: Record<string, number>;
  finished: boolean;
  log: string[];
};
