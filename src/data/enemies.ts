const DEFAULT_ATTACK_A = { count: 1, sides: 6, bonus: 1 };
const DEFAULT_ATTACK_B = { count: 1, sides: 6, bonus: 2 };

export const ENEMY_DB = {
  bramble_boar: {
    name: "Bramble Boar",
    icon: "🐗",
    hp: 24,
    intentA: "Wild Charge",
    intentB: "Briar Burst",
  },
  thorncoat_ruffian: {
    name: "Thorncoat Ruffian",
    icon: "🦊",
    hp: 22,
    intentA: "Knife Rush",
    intentB: "Dirty Trick",
  },
  thorny_hound: {
    name: "Thorny Hound",
    icon: "🐕",
    hp: 14,
    intentA: "Snap Lunge",
    intentB: "Briar Bark",
    attackA: { count: 1, sides: 4, bonus: 1 },
    attackB: { count: 1, sides: 6, bonus: 1 },
  },
  rustroot_skulk: {
    name: "Rustroot Skulk",
    icon: "🦂",
    hp: 30,
    intentA: "Claw Flurry",
    intentB: "Root Snap",
    attackA: { count: 2, sides: 4, bonus: 1 },
    attackB: { count: 1, sides: 8, bonus: 2 },
  },
  briar_knot_warden: {
    name: "Briar Knot Warden",
    icon: "👹",
    hp: 38,
    intentA: "Chain Slam",
    intentB: "Root Surge",
    attackA: { count: 1, sides: 8, bonus: 3 },
    attackB: { count: 2, sides: 6, bonus: 2 },
  },
  briar_roadwatcher: {
    name: "Briar Roadwatcher",
    icon: "👁️",
    hp: 28,
    intentA: "False Command",
    intentB: "Thorn Lash",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 2 },
  },
  false_sign_scratcher: {
    name: "False Sign Scratcher",
    icon: "🪧",
    hp: 18,
    intentA: "Scrape Mark",
    intentB: "Pocket Sand",
    attackA: { count: 1, sides: 6, bonus: 1 },
    attackB: { count: 1, sides: 4, bonus: 2 },
  },
  thorn_collared_hound: {
    name: "Thorn-Collared Hound",
    icon: "🐕",
    hp: 18,
    intentA: "Collar-Snap",
    intentB: "Forced Lunge",
    attackA: { count: 1, sides: 6, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 1 },
  },
  briar_relay_guard: {
    name: "Briar Relay Guard",
    icon: "🛡️",
    hp: 30,
    intentA: "Bar the Route",
    intentB: "Seal-Cloth Strike",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 2 },
  },
  seal_forged_sentry: {
    name: "Seal-Forged Sentry",
    icon: "📜",
    hp: 26,
    intentA: "Stamp Command",
    intentB: "Waxen Guard",
    attackA: { count: 1, sides: 6, bonus: 3 },
    attackB: { count: 1, sides: 8, bonus: 1 },
  },
  crown_whisperer: {
    name: "Crown Whisperer",
    icon: "♛",
    hp: 24,
    intentA: "Frighten the Road",
    intentB: "Wrong-Way Murmur",
    attackA: { count: 2, sides: 4, bonus: 2 },
    attackB: { count: 1, sides: 10, bonus: 0 },
  },
  bracken_voss: {
    name: "Bracken Voss",
    icon: "♜",
    hp: 44,
    intentA: "False Order",
    intentB: "Commanding Seal",
    attackA: { count: 2, sides: 6, bonus: 3 },
    attackB: { count: 1, sides: 10, bonus: 3 },
  },
  thornseal_guard: {
    name: "Thornseal Guard",
    icon: "🛡️",
    hp: 28,
    intentA: "Guard the Ledger",
    intentB: "Thornseal Bash",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 4, bonus: 2 },
  },
  thornroot_sentry: {
    name: "Thornroot Sentry",
    icon: "🌿",
    hp: 32,
    intentA: "Root Snare",
    intentB: "Briar Sweep",
    attackA: { count: 1, sides: 8, bonus: 2 },
    attackB: { count: 2, sides: 6, bonus: 1 },
  },
};

export const ENCOUNTERS = {
  boar: ["bramble_boar"],
  wilds: ["thorncoat_ruffian", "thorny_hound"],
  cellarSkulk: ["rustroot_skulk"],
  cellarBoss: ["briar_knot_warden"],
  roadwatcher: ["briar_roadwatcher"],
  roadwatcherHard: ["briar_roadwatcher", "thorn_collared_hound", "false_sign_scratcher"],
  briarRelay: ["briar_relay_guard", "seal_forged_sentry"],
  briarholdBoss: ["bracken_voss", "thornseal_guard", "thornroot_sentry"],
};

export function buildEnemy(enemyId) {
  const enemy = ENEMY_DB[enemyId];
  if (!enemy) throw new Error(`Unknown enemy: ${enemyId}`);

  const attackA = { ...(enemy.attackA || DEFAULT_ATTACK_A) };
  const attackB = { ...(enemy.attackB || DEFAULT_ATTACK_B) };

  return {
    name: enemy.name,
    icon: enemy.icon,
    hp: enemy.hp,
    maxHp: enemy.hp,
    intentA: enemy.intentA,
    intentB: enemy.intentB,
    intent: enemy.intentA,
    currentAttackSpec: attackA,
    attackA,
    attackB,
    guardBroken: false,
    weakened: false,
  };
}

export function buildEncounterEnemies(encounterId) {
  const enemyIds = ENCOUNTERS[encounterId] || ENCOUNTERS.boar;
  return enemyIds.map((enemyId) => buildEnemy(enemyId));
}
