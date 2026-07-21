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

export function normalizeRegionId(regionId?: string | null) {
  return regionId && MAPS[regionId] ? regionId : "hearthhollow";
}

export function getRegionCheckpointLabel(regionId?: string | null) {
  const region = normalizeRegionId(regionId);
  return region === "hearthhollow" ? "South Gate" : MAPS[region].name;
}

export function normalizeMapPosition(regionId: string, position?: { x?: number; y?: number } | null) {
  const region = normalizeRegionId(regionId);
  const fallback = MAPS[region].start;
  const current = {
    x: typeof position?.x === "number" ? position.x : fallback.x,
    y: typeof position?.y === "number" ? position.y : fallback.y,
  };

  if (
    region === "westrootTrail" &&
    ((current.x === 6 && current.y === 3) || (current.x === 7 && current.y === 3))
  ) {
    return { x: 6, y: 4 };
  }

  const tiles = MAPS[region].tiles;
  if (!tiles[current.y]?.[current.x]) return fallback;
  return current;
}

export function ensureVisitedIncludesPosition(
  visitedState: Record<string, Record<string, boolean>> | null | undefined,
  regionId: string,
  position: { x: number; y: number },
  radius = 1,
) {
  return {
    ...(visitedState || {}),
    [regionId]: {
      ...(visitedState?.[regionId] || {}),
      ...buildVisitedMap(regionId, position.x, position.y, radius),
    },
  };
}

export function isBlockedInteractionTile(tile: string) {
  return [
    "home_door",
    "smith_door",
    "potion_door",
    "bram_inn_door",
    "market_door",
    "watch_door",
  ].includes(tile);
}
