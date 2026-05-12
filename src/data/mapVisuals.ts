type MapBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Direction = "up" | "down" | "left" | "right";

type MapVisualConfig = {
  aspectRatio: string;
  navBounds: MapBounds;
  fogRadius?: number;
  nodeHitboxSize?: string;
  pointGrid?: {
    xByColumn: number[];
    yByRow: number[];
  };
  pointOverrides?: Record<string, { x: number; y: number }>;
  navigationLinks?: Record<string, Partial<Record<Direction, string>>>;
};

type NavConnection = {
  from: string;
  to: string;
  direction: Direction;
};

// Root Cellar is intentionally graph-driven. The painted corridors do not fit
// an even grid, so only these connected tile keys render as movement nodes.
const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const ROOT_CELLAR_NAV_CONNECTIONS: NavConnection[] = [
  { from: "0,1", to: "1,1", direction: "right" },
  { from: "1,1", to: "2,1", direction: "right" },
  { from: "2,1", to: "3,1", direction: "right" },
  { from: "3,1", to: "4,1", direction: "right" },
  { from: "4,1", to: "5,1", direction: "right" },
  { from: "5,1", to: "6,1", direction: "right" },
  { from: "6,1", to: "7,1", direction: "right" },
  { from: "7,1", to: "8,1", direction: "right" },
  { from: "7,1", to: "7,2", direction: "down" },
  { from: "3,1", to: "3,2", direction: "down" },
  { from: "3,2", to: "3,3", direction: "down" },
  { from: "3,3", to: "3,4", direction: "down" },
  { from: "3,4", to: "3,5", direction: "down" },
  { from: "3,5", to: "4,5", direction: "right" },
  { from: "4,5", to: "5,5", direction: "right" },
  { from: "5,5", to: "5,6", direction: "down" },
  { from: "5,6", to: "5,7", direction: "down" },
  { from: "5,6", to: "6,6", direction: "right" },
  { from: "6,6", to: "6,7", direction: "down" },
  { from: "6,6", to: "7,5", direction: "right" },
  { from: "7,5", to: "8,6", direction: "right" },
  { from: "6,6", to: "7,6", direction: "right" },
  { from: "7,6", to: "8,6", direction: "right" },
  { from: "8,6", to: "8,5", direction: "right" },
  { from: "8,5", to: "9,6", direction: "right" },
  { from: "9,6", to: "9,5", direction: "up" },
  { from: "9,5", to: "9,4", direction: "up" },
  { from: "9,4", to: "10,4", direction: "right" },
  { from: "7,2", to: "7,3", direction: "down" },
  { from: "7,3", to: "7,4", direction: "down" },
  { from: "7,4", to: "7,5", direction: "down" },
  { from: "7,5", to: "7,6", direction: "down" },
  { from: "1,4", to: "1,5", direction: "down" },
  { from: "1,5", to: "1,6", direction: "down" },
  { from: "1,6", to: "1,7", direction: "down" },
  { from: "1,5", to: "2,5", direction: "right" },
  { from: "2,5", to: "3,5", direction: "right" },
  { from: "4,5", to: "4,6", direction: "down" },
  { from: "4,6", to: "5,6", direction: "right" },
  { from: "4,6", to: "4,7", direction: "down" },
  { from: "4,7", to: "4,8", direction: "down" },
  { from: "4,8", to: "5,8", direction: "right" },
  { from: "5,8", to: "5,7", direction: "up" },
  { from: "5,8", to: "6,8", direction: "right" },
  { from: "6,8", to: "6,7", direction: "up" },
  { from: "2,6", to: "2,7", direction: "down" },
  { from: "4,8", to: "3,7", direction: "left" },
  { from: "1,7", to: "2,7", direction: "right" },
  { from: "2,7", to: "3,7", direction: "right" },
  { from: "3,7", to: "4,7", direction: "right" },
  { from: "4,7", to: "5,7", direction: "right" },
  { from: "5,7", to: "6,7", direction: "right" },
];

function buildNavigationLinks(connections: NavConnection[]) {
  const links: Record<string, Partial<Record<Direction, string>>> = {};

  connections.forEach(({ from, to, direction }) => {
    links[from] = { ...(links[from] || {}), [direction]: to };
    links[to] = {
      ...(links[to] || {}),
      [OPPOSITE_DIRECTION[direction]]: from,
    };
  });

  return links;
}

export const MAP_VISUALS: Record<string, MapVisualConfig> = {
  hearthhollow: {
    aspectRatio: "1 / 1",
    navBounds: { left: 9, top: 13, width: 82, height: 76 },
  },
  lanternRoad: {
    aspectRatio: "4 / 3",
    navBounds: { left: 4, top: 8, width: 92, height: 82 },
    fogRadius: 7.8,
  },
  bramblecross: {
    aspectRatio: "4 / 3",
    navBounds: { left: 7, top: 8, width: 86, height: 78 },
    fogRadius: 7,
  },
  rootCellar: {
    aspectRatio: "4 / 3",
    navBounds: { left: 6, top: 6, width: 88, height: 86 },
    fogRadius: 5.8,
    nodeHitboxSize: "clamp(1.25rem, 3.8%, 2.15rem)",
    navigationLinks: buildNavigationLinks(ROOT_CELLAR_NAV_CONNECTIONS),
    pointGrid: {
      xByColumn: [12.5, 20.5, 28.5, 36.5, 44.5, 52, 60, 67.5, 75, 82.5, 89],
      yByRow: [8.5, 17.5, 28.5, 40, 51.5, 62.5, 72.5, 82, 90],
    },
    pointOverrides: {
      "0,1": { x: 12.5, y: 11.5 },
      "1,1": { x: 17.4, y: 18.8 },
      "2,1": { x: 23.3, y: 22.8 },
      "3,1": { x: 30.6, y: 25.5 },
      "4,1": { x: 36.3, y: 28.4 },
      "5,1": { x: 43.5, y: 29 },
      "6,1": { x: 51, y: 28 },
      "7,1": { x: 58.2, y: 24.8 },
      "8,1": { x: 65.3, y: 23.2 },
      "3,2": { x: 30.3, y: 33.3 },
      "7,2": { x: 55.5, y: 37.5 },
      "3,3": { x: 29.4, y: 44.5 },
      "7,3": { x: 56, y: 45 },
      "1,4": { x: 15.2, y: 49.5 },
      "3,4": { x: 27.7, y: 51.5 },
      "7,4": { x: 56.7, y: 54 },
      "9,4": { x: 78.5, y: 54 },
      "10,4": { x: 86, y: 41.5 },
      "1,5": { x: 13, y: 59.3 },
      "2,5": { x: 22, y: 55.7 },
      "3,5": { x: 29.4, y: 56.6 },
      "4,5": { x: 36.5, y: 60.2 },
      "5,5": { x: 45.7, y: 57 },
      "7,5": { x: 57.7, y: 62 },
      "8,5": { x: 71.4, y: 66.6 },
      "9,5": { x: 77, y: 60 },
      "1,6": { x: 11.7, y: 69 },
      "2,6": { x: 23.5, y: 68.2 },
      "4,6": { x: 40.2, y: 64.3 },
      "5,6": { x: 45.3, y: 67 },
      "6,6": { x: 53, y: 67 },
      "7,6": { x: 58.5, y: 69 },
      "8,6": { x: 66.8, y: 67 },
      "9,6": { x: 75.7, y: 66 },
      "1,7": { x: 13.2, y: 77.8 },
      "2,7": { x: 23.2, y: 79.5 },
      "3,7": { x: 31.5, y: 77.2 },
      "4,7": { x: 38.5, y: 76 },
      "5,7": { x: 46.7, y: 74.6 },
      "6,7": { x: 54.5, y: 75.2 },
      "4,8": { x: 36.8, y: 81.5 },
      "5,8": { x: 45, y: 82 },
      "6,8": { x: 53.5, y: 81.2 },
    },
  },
};

export function getMapVisualConfig(region: string) {
  return MAP_VISUALS[region] || MAP_VISUALS.hearthhollow;
}

export function getMapNodePoint(
  region: string,
  x: number,
  y: number,
  columns: number,
  rows: number,
) {
  const visual = getMapVisualConfig(region);
  const override = visual.pointOverrides?.[`${x},${y}`];
  if (override) return override;
  if (visual.pointGrid) {
    const gridX = visual.pointGrid.xByColumn[x];
    const gridY = visual.pointGrid.yByRow[y];
    if (typeof gridX === "number" && typeof gridY === "number") {
      return { x: gridX, y: gridY };
    }
  }
  const { left, top, width, height } = visual.navBounds;
  return {
    x: left + ((x + 0.5) / columns) * width,
    y: top + ((y + 0.5) / rows) * height,
  };
}

export function getNavigationDestination(
  region: string,
  x: number,
  y: number,
  direction: Direction,
) {
  const destination = getMapVisualConfig(region).navigationLinks?.[`${x},${y}`]?.[
    direction
  ];
  if (!destination) return null;
  const [nextX, nextY] = destination.split(",").map(Number);
  return { x: nextX, y: nextY };
}

export function hasNavigationGraph(region: string) {
  return !!getMapVisualConfig(region).navigationLinks;
}

export function getNavigationNodeKeys(region: string) {
  return Object.keys(getMapVisualConfig(region).navigationLinks || {});
}

export function isMapNavigationNode(region: string, x: number, y: number) {
  const links = getMapVisualConfig(region).navigationLinks;
  if (!links) return true;
  return !!links[`${x},${y}`];
}

export function areMapNodesConnected(
  region: string,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const links = getMapVisualConfig(region).navigationLinks;
  if (!links) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) === 1;
  }
  return Object.values(links[`${from.x},${from.y}`] || {}).includes(
    `${to.x},${to.y}`,
  );
}
