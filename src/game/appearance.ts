import { APPEARANCES } from "../data/character";
import type { Player } from "./types";

export function getAppearanceIcon(player?: Partial<Player> | null) {
  return APPEARANCES.find((a) => a.id === player?.appearanceId)?.icon || "🧑";
}

export function getHeroAvatar(player?: Partial<Player> | null) {
  return getAppearanceIcon(player);
}
