import { MAPS } from "../data/maps";

export function getVisitedKey(x: number, y: number) {
  return `${x},${y}`;
}

export function buildVisitedMap(regionId: string, centerX: number, centerY: number, radius = 1) {
  const map = MAPS[regionId].tiles;
  const next: Record<string, boolean> = {};

  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
        next[getVisitedKey(x, y)] = true;
      }
    }
  }

  return next;
}

export function buildDefaultVisited() {
  return Object.fromEntries(
    Object.keys(MAPS).map((id) => [
      id,
      id === "hearthhollow" ? buildVisitedMap(id, MAPS[id].start.x, MAPS[id].start.y) : {},
    ]),
  );
}

export function isBlockedInteractionTile(tile: string) {
  return ["home_door", "smith_door", "potion_door", "bram_inn_door", "market_door", "watch_door", "pond"].includes(tile);
}
