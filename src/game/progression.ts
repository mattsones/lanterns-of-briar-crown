import { HERO_XP_CURVE } from "../data/character";
import { COMPANION_PROGRESSION } from "../data/companions";

export function getHeroXpTarget(level = 1) {
  return HERO_XP_CURVE[level] ?? null;
}

export function getCompanionXpTarget(companionId: string | null, level = 1) {
  return companionId ? COMPANION_PROGRESSION[companionId]?.xpCurve?.[level] ?? null : null;
}

export function getCompanionGrowthPreview(companionId: string | null) {
  return companionId ? COMPANION_PROGRESSION[companionId]?.futurePaths || [] : [];
}
