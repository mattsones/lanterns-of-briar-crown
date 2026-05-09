import type { RollSpec, SkillCheckResult, StatBlock } from "./types";

export function resolveRoll({ count, sides, bonus = 0 }: RollSpec) {
  const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides));
  return {
    rolls,
    total: rolls.reduce((a, b) => a + b, 0) + bonus,
    notation: `${count}d${sides}${bonus > 0 ? `+${bonus}` : bonus < 0 ? bonus : ""}`,
  };
}

export function resolveSkillCheck(stats: StatBlock, stat: string, dc: number): SkillCheckResult {
  const roll = Math.ceil(Math.random() * 20);
  const bonus = Math.floor((stats?.[stat] || 0) / 2);
  const total = roll + bonus;
  return {
    stat,
    dc,
    roll,
    bonus,
    total,
    success: total >= dc,
    label: `${stat} Check: ${roll}${bonus ? ` + ${bonus}` : ""} = ${total} vs ${dc}`,
  };
}

export function checkSummary(check: SkillCheckResult) {
  return `${check.success ? "Success" : "Complication"} — ${check.label}`;
}
