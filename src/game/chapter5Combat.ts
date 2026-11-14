import { resolveEnemyIntentEffects, type BattleEnemy } from "./battle";
import { isCompanionConscious } from "./companions";
import type { Companion } from "./types";

// Briarhold's formation protects the next exchange, not every later exchange.
// Older chapters retain their existing Guard-pool behavior.
export function resolveBriarholdBossIntentEffects(enemies: BattleEnemy[]) {
  const result = resolveEnemyIntentEffects(enemies.map(enemy => ({ ...enemy, guard: 0 })));
  const exposed = enemies.filter(enemy => enemy.hp > 0 && (enemy.guard || 0) > 0 &&
    !result.enemies.find(next => next.battleId === enemy.battleId)?.guard);
  if (exposed.length) result.logs.unshift(`The previous Guard falls away from ${exposed.map(enemy => enemy.name).join(" and ")}.`);
  return result;
}

export function getBriarholdCompanionGuard(
  companion: Companion | undefined, heroGuard: number, bossFight: boolean,
) {
  return bossFight && isCompanionConscious(companion) && companion?.id === "rowan" &&
    companion.command === "Defend Me" && heroGuard >= 4 ? 4 : 0;
}
