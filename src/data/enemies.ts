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
};

export const ENCOUNTERS = {
  boar: ["bramble_boar"],
  wilds: ["thorncoat_ruffian", "thorny_hound"],
  cellarSkulk: ["rustroot_skulk"],
  cellarBoss: ["briar_knot_warden"],
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
