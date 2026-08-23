export function tickCooldowns(cooldowns: Record<string, number> = {}) {
  return Object.fromEntries(
    Object.entries(cooldowns)
      .map(([id, value]) => [id, Math.max(0, (value || 0) - 1)] as const)
      .filter(([, value]) => value > 0),
  );
}

export type AttackSpec = { count: number; sides: number; bonus?: number };

export type EnemyIntentEffect = {
  guardSelf?: number;
  guardAlly?: number;
  heroAttackPenalty?: number;
  heroGuardBypass?: number;
};

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
  currentEffect?: EnemyIntentEffect;
  effectA?: EnemyIntentEffect;
  effectB?: EnemyIntentEffect;
  guard?: number;
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
      ? (() => {
          const availableGuard = effects.guardBreak ? 0 : (enemy.guard || 0);
          const absorbed = Math.min(availableGuard, Math.max(0, damage));
          return {
            ...enemy,
            hp: Math.max(0, enemy.hp - Math.max(0, damage - absorbed)),
            guard: effects.guardBreak ? 0 : availableGuard - absorbed,
            weakened: !!effects.weaken || enemy.weakened,
            guardBroken: !!effects.guardBreak || enemy.guardBroken,
          };
        })()
      : enemy,
  );
}

export function resolveEnemyIntentEffects(enemies: BattleEnemy[]) {
  let nextEnemies = enemies.map((enemy) => ({ ...enemy }));
  let heroAttackPenalty = 0;
  const logs: string[] = [];

  getLivingEnemies(enemies).forEach((actingEnemy) => {
    const effect = actingEnemy.currentEffect;
    if (!effect) return;
    const guardedNames: string[] = [];

    if (effect.guardSelf) {
      nextEnemies = nextEnemies.map((enemy) =>
        enemy.battleId === actingEnemy.battleId
          ? { ...enemy, guard: Math.max(enemy.guard || 0, effect.guardSelf || 0) }
          : enemy,
      );
      guardedNames.push(actingEnemy.name);
    }

    if (effect.guardAlly) {
      const ally = getLivingEnemies(nextEnemies).find(
        (enemy) => enemy.battleId !== actingEnemy.battleId,
      );
      if (ally) {
        nextEnemies = nextEnemies.map((enemy) =>
          enemy.battleId === ally.battleId
            ? { ...enemy, guard: Math.max(enemy.guard || 0, effect.guardAlly || 0) }
            : enemy,
        );
        guardedNames.push(ally.name);
      }
    }

    if (guardedNames.length) {
      logs.push(`${actingEnemy.name} bars the route, granting ${effect.guardSelf || effect.guardAlly} Guard to ${guardedNames.join(" and ")}.`);
    }

    if (effect.heroAttackPenalty) {
      heroAttackPenalty = Math.max(heroAttackPenalty, effect.heroAttackPenalty);
      logs.push(`${actingEnemy.name}'s words leave the hero Shaken: -${effect.heroAttackPenalty} damage on the next attack.`);
    }
  });

  return { enemies: nextEnemies, heroAttackPenalty, logs };
}

export function describeEnemyIntentEffect(enemy: BattleEnemy) {
  const effect = enemy.currentEffect;
  if (!effect) return null;
  const parts = [
    effect.guardSelf
      ? `${effect.guardSelf} Guard${effect.guardAlly ? " to self + ally" : ""}`
      : null,
    effect.heroAttackPenalty
      ? `Shaken: -${effect.heroAttackPenalty} next attack`
      : null,
    effect.heroGuardBypass
      ? `bypasses ${effect.heroGuardBypass} party Guard`
      : null,
  ].filter(Boolean);
  return parts.join(" • ") || null;
}

export function rotateEnemyIntent(enemy: BattleEnemy): BattleEnemy {
  const usedIntentA = enemy.intent === enemy.intentA;
  return {
    ...enemy,
    intent: usedIntentA ? enemy.intentB : enemy.intentA,
    currentAttackSpec: usedIntentA ? enemy.attackB : enemy.attackA,
    currentEffect: usedIntentA ? enemy.effectB : enemy.effectA,
    weakened: false,
    guardBroken: false,
  };
}
