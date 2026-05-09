import { BATTLE_CONSUMABLES, ITEM_DB, SHOP_PRICES } from "../data/items";
import { SKILL_DB } from "../data/skills";
import { getSkillNotation } from "./skills";
import { formatBonuses } from "./stats";
import type { Inventory, Player } from "./types";

export function getDefaultBattlePouch(inventory: Inventory = {}) {
  const owned = ["healing_fizzpop", "trail_snack", "fizzberry_handpie", "bubbleburst_tonic"].filter(
    (id) => (inventory[id] || 0) > 0,
  );
  return { slot1: owned[0] || null, slot2: owned[1] || null };
}

export function hasItem(player: Partial<Player> | null, itemId: string, amount = 1) {
  return (player?.inventory?.[itemId] || 0) >= amount;
}

export function gainItem(setPlayer, itemId: string, amount = 1) {
  setPlayer((prev) => ({
    ...prev,
    inventory: { ...(prev.inventory || {}), [itemId]: (prev.inventory?.[itemId] || 0) + amount },
  }));
}

export function removeItem(setPlayer, itemId: string, amount = 1) {
  setPlayer((prev) => ({
    ...prev,
    inventory: { ...(prev.inventory || {}), [itemId]: Math.max(0, (prev.inventory?.[itemId] || 0) - amount) },
  }));
}

export function getEquippedCount(player: Partial<Player> | null, itemId: string) {
  return Object.values(player?.equipment || {}).filter((id) => id === itemId).length;
}

export function itemFitsSlot(item, slot: string) {
  if (!item?.slot) return false;
  if (slot.startsWith("trinket") && item.slot.startsWith("trinket")) return true;
  return item.slot === slot;
}

export function getBuyPrice(itemId: string) {
  return SHOP_PRICES[itemId] || 0;
}

export function getSellPrice(itemId: string) {
  return Math.max(1, Math.floor((getBuyPrice(itemId) || 4) / 2));
}

export function getItemHighlights(item) {
  const out: string[] = [];
  if (item?.bonuses) out.push(`Bonuses: ${formatBonuses(item.bonuses)}`);
  if (item?.skills?.length) {
    item.skills.forEach((id: string) => {
      const skill = SKILL_DB[id];
      if (skill) out.push(`Skill: ${skill.name} — ${getSkillNotation(skill)} • ${skill.description}`);
      else out.push(`Skill: ${id}`);
    });
  }
  if (item?.effectText) out.push(item.effectText);
  if (item?.rarity) out.push(`Rarity: ${item.rarity}`);
  return out;
}

export function canCraftRecipe(player: Partial<Player> | null, recipe) {
  return Object.entries(recipe.ingredients).every(([id, qty]) => hasItem(player, id, qty as number));
}

export function formatIngredients(ingredients: Record<string, number>) {
  return Object.entries(ingredients).map(([id, qty]) => `${ITEM_DB[id]?.name || id} ×${qty}`).join(" • ");
}

export function getInventorySections(player: Partial<Player> | null) {
  const sections = { equipment: [], consumables: [], other: [] };
  Object.entries(player?.inventory || {})
    .filter(([, qty]) => qty > 0)
    .forEach(([id, qty]) => {
      const item = ITEM_DB[id];
      if (item?.slot) sections.equipment.push([id, qty]);
      else if (item?.type === "consumable" || BATTLE_CONSUMABLES[id]) sections.consumables.push([id, qty]);
      else sections.other.push([id, qty]);
    });
  return sections;
}
