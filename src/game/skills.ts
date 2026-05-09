import { BASE_STATS } from "../data/character";
import { ITEM_DB } from "../data/items";
import { SKILL_DB } from "../data/skills";
import type { Player, StatBlock } from "./types";

export function getSkillBonus(stats: StatBlock, skill) {
  const statTotal = (skill.stats || []).reduce((sum: number, stat: string) => sum + (stats?.[stat] || 0), 0);
  return (skill.baseBonus || 0) + Math.floor(statTotal / (skill.divisor || 2));
}

export function getSkillNotation(skill, stats: StatBlock = BASE_STATS) {
  if (!skill) return "";
  const cooldownText = skill.cooldown ? ` • Cooldown ${skill.cooldown}` : "";
  if (skill.kind === "guardHeal") {
    const bonus = getSkillBonus(stats, skill);
    return `Heal ${skill.baseHeal + bonus} • Guard ${skill.baseGuard + bonus}${cooldownText}`;
  }
  return `${skill.count || 1}d${skill.sides || 6}+${getSkillBonus(stats, skill)}${cooldownText}`;
}

export function buildCombatSkill(skillId: string, stats: StatBlock = BASE_STATS) {
  const skill = SKILL_DB[skillId];
  if (!skill) return null;
  const computedBonus = getSkillBonus(stats, skill);
  return {
    ...skill,
    computedBonus,
    spec: skill.kind === "attack" ? { count: skill.count || 1, sides: skill.sides || 6, bonus: computedBonus } : null,
    description: `${getSkillNotation(skill, stats)} • ${skill.description}`,
  };
}

export function getEquippedSkillIds(player?: Partial<Player> | null) {
  return [
    ...new Set(
      Object.values(player?.equipment || {}).flatMap((itemId) => (itemId ? ITEM_DB[itemId]?.skills || [] : [])),
    ),
  ];
}
