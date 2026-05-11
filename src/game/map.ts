import { MAPS } from "../data/maps";
import { getNavigationDestination, hasNavigationGraph } from "../data/mapVisuals";

const DIRECTIONS = ["up", "down", "left", "right"] as const;

export function getVisitedKey(x: number, y: number) {
  return `${x},${y}`;
}

export function buildVisitedMap(
  regionId: string,
  centerX: number,
  centerY: number,
  radius = 1,
) {
  const map = MAPS[regionId].tiles;
  const next: Record<string, boolean> = {};
  if (hasNavigationGraph(regionId)) {
    const seen = new Set<string>();
    const queue = [{ x: centerX, y: centerY, distance: 0 }];

    while (queue.length) {
      const current = queue.shift();
      if (!current) continue;
      const key = getVisitedKey(current.x, current.y);
      if (seen.has(key)) continue;
      seen.add(key);
      next[key] = true;
      if (current.distance >= radius) continue;

      DIRECTIONS.forEach((direction) => {
        const destination = getNavigationDestination(
          regionId,
          current.x,
          current.y,
          direction,
        );
        if (!destination) return;
        queue.push({
          ...destination,
          distance: current.distance + 1,
        });
      });
    }

    return next;
  }

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
  return [
    "home_door",
    "smith_door",
    "potion_door",
    "bram_inn_door",
    "market_door",
    "watch_door",
    "pond",
    "well",
  ].includes(tile);
}
