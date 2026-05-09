import { BASE_STATS } from "../data/character";
import { ITEM_DB } from "../data/items";
import type { Player, StatBlock } from "./types";

export function addBonuses(base: StatBlock, bonuses: Partial<StatBlock> = {}) {
  const next = { ...base };
  Object.entries(bonuses).forEach(([stat, value]) => {
    next[stat] = (next[stat] || 0) + (value || 0);
  });
  return next;
}

export function getDerivedStats(player?: Partial<Player> | null) {
  let stats = { ...((player?.baseStats as StatBlock) || BASE_STATS) };
  Object.values(player?.equipment || {}).forEach((itemId) => {
    if (itemId && ITEM_DB[itemId]?.bonuses) stats = addBonuses(stats, ITEM_DB[itemId].bonuses);
  });
  return stats;
}

export function formatBonuses(bonuses: Partial<StatBlock> = {}) {
  return Object.entries(bonuses).map(([stat, value]) => `${stat} +${value}`).join(" • ");
}
