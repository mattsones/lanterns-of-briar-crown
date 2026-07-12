export function tickCooldowns(cooldowns: Record<string, number> = {}) {
  return Object.fromEntries(
    Object.entries(cooldowns)
      .map(([id, value]) => [id, Math.max(0, (value || 0) - 1)] as const)
      .filter(([, value]) => value > 0),
  );
}

export type AttackSpec = { count: number; sides: number; bonus?: number };

export type BattleEnemy = {
  battleId: string;
  name: string;
  icon?: string;
  artwork?: { src: string; alt: string };
  hp: number;
  maxHp: number;
  intent: string;
  intentA: string;
  intentB: string;
  currentAttackSpec: AttackSpec;
  attackA: AttackSpec;
  attackB: AttackSpec;
  guardBroken?: boolean;
  weakened?: boolean;
};

export function prepareBattleEnemies(enemies: Omit<BattleEnemy, "battleId">[]): BattleEnemy[] {
  return enemies.map((enemy, index) => ({
    ...enemy,
    battleId: `enemy-${index + 1}`,
  }));
}

export function getLivingEnemies(enemies: BattleEnemy[] = []) {
  return enemies.filter((enemy) => enemy.hp > 0);
}

export function getSelectedBattleEnemy(
  enemies: BattleEnemy[] = [],
  selectedTargetId?: string | null,
) {
  return (
    enemies.find((enemy) => enemy.battleId === selectedTargetId && enemy.hp > 0) ||
    getLivingEnemies(enemies)[0] ||
    null
  );
}

export function damageBattleEnemy(
  enemies: BattleEnemy[],
  battleId: string,
  damage: number,
  effects: { weaken?: boolean; guardBreak?: boolean } = {},
) {
  return enemies.map((enemy) =>
    enemy.battleId === battleId
      ? {
          ...enemy,
          hp: Math.max(0, enemy.hp - damage),
          weakened: !!effects.weaken || enemy.weakened,
          guardBroken: !!effects.guardBreak || enemy.guardBroken,
        }
      : enemy,
  );
}

export function rotateEnemyIntent(enemy: BattleEnemy): BattleEnemy {
  const usedIntentA = enemy.intent === enemy.intentA;
  return {
    ...enemy,
    intent: usedIntentA ? enemy.intentB : enemy.intentA,
    currentAttackSpec: usedIntentA ? enemy.attackB : enemy.attackA,
    weakened: false,
    guardBroken: false,
  };
}
