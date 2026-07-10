import type { Player } from "./types";

export const HERO_FALLBACK_ICON = "\u{1F9D1}";

export function getAppearanceIcon(_player?: Partial<Player> | null) {
  return HERO_FALLBACK_ICON;
}

export function getHeroAvatar(player?: Partial<Player> | null) {
  return getAppearanceIcon(player);
}
