import { APPEARANCES } from "../data/character";
import { ITEM_DB } from "../data/items";
import type { Player } from "./types";

export function getAppearanceIcon(player?: Partial<Player> | null) {
  return APPEARANCES.find((a) => a.id === player?.appearanceId)?.icon || "🧑";
}

export function getHeroAvatar(player?: Partial<Player> | null) {
  return [
    getAppearanceIcon(player),
    player?.equipment?.helm ? "⛑️" : "",
    player?.equipment?.armor ? "🥋" : "",
    player?.equipment?.cloak ? "🧥" : "",
    player?.equipment?.weapon ? ITEM_DB[player.equipment.weapon]?.icon || "🗡️" : "",
  ].filter(Boolean).join(" ");
}
