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
  revealAll?: boolean;
  localLantern?: boolean;
  fogColor?: string;
  fogRadius?: number;
  fogPathWidth?: number;
  fogRevealAreas?: Array<{
    id: string;
    nodeKeys: string[];
    minVisitedNodes?: number;
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    rotation?: number;
  }>;
  completedFogOpacity?: number;
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

function buildRightwardRoute(nodeKeys: string[]): NavConnection[] {
  return nodeKeys.slice(1).map((to, index) => ({
    from: nodeKeys[index],
    to,
    direction: "right" as const,
  }));
}

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
  { from: "3,4", to: "1,4", direction: "left" },
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

const WESTROOT_TRAIL_NAVIGATION_LINKS: Record<string, Partial<Record<Direction, string>>> = {
  "0,3": { up: "0,5", right: "0,5" },
  "0,5": { down: "0,3", left: "0,3", up: "1,5", right: "1,5" },
  "1,5": { down: "0,5", left: "0,5", up: "0,4", right: "0,4" },
  "0,4": { down: "1,5", left: "1,3", up: "1,3", right: "1,4" },
  "1,3": { down: "0,4", right: "0,4" },
  "1,4": { down: "0,4", left: "0,4", up: "2,6", right: "2,6" },
  "2,6": { down: "1,4", left: "1,4", up: "2,5", right: "2,5" },
  "2,5": { down: "2,6", left: "2,6", up: "2,4", right: "2,4" },
  "2,4": { down: "2,5", left: "2,5", up: "3,5", right: "3,5" },
  "3,5": { down: "2,4", left: "2,4", up: "2,3" },
  "2,3": { down: "3,5", up: "3,3", right: "3,3" },
  "2,2": { down: "3,3", right: "3,3", up: "2,1", left: "2,1" },
  "2,1": { down: "2,2", right: "2,2" },
  "3,3": { down: "2,3", left: "2,3", up: "2,2", right: "3,2" },
  "3,2": { down: "3,3", left: "3,3", up: "3,4", right: "3,1" },
  "3,1": { left: "3,2", down: "3,2", up: "3,4", right: "4,2" },
  "4,2": { left: "3,1", up: "3,4", right: "5,1", down: "5,1" },
  "3,4": { down: "3,2", right: "3,1", up: "4,1", left: "4,1" },
  "4,1": { down: "3,4", right: "3,4" },
  "5,1": { left: "4,2", up: "5,0", right: "5,0" },
  "5,0": { down: "5,1", left: "5,1", up: "5,2", right: "5,2" },
  "5,2": { down: "5,0", left: "5,0", up: "6,2", right: "6,2" },
  "6,2": { left: "5,2", right: "7,1" },
  "7,1": { left: "6,2", up: "4,3", right: "7,0", down: "7,0" },
  "4,3": { down: "7,1", right: "7,1" },
  "5,3": { left: "7,0", down: "7,2" },
  "7,0": { left: "7,1", down: "7,2", right: "5,3" },
  "7,2": { up: "5,3", left: "7,0", down: "6,0", right: "6,0" },
  "6,0": { up: "7,2", left: "7,2", down: "8,0", right: "8,0" },
  "8,0": { left: "6,0", up: "8,2", right: "8,3", down: "8,3" },
  "8,2": { left: "8,0", up: "6,1", right: "6,1", down: "8,0" },
  "6,1": { down: "8,2", left: "8,2" },
  "8,3": { up: "8,0", left: "8,0", down: "7,6", right: "7,6" },
  "7,6": { up: "8,3", left: "8,3", down: "8,4", right: "8,4" },
  "8,4": { up: "7,6", left: "7,6", down: "8,6" },
  "8,6": { up: "8,4", down: "8,5" },
  "8,5": { up: "8,6", down: "7,5", left: "7,5" },
  "7,5": { up: "8,5", right: "8,5", down: "7,4", left: "7,4" },
  "7,4": { up: "7,5", right: "7,5", left: "6,5" },
  "6,5": { right: "7,4", left: "5,6" },
  "5,6": { right: "6,5", left: "5,5", up: "6,6" },
  "6,6": { right: "6,5", down: "5,6", up: "6,4", left: "5,5" },
  "6,4": { down: "6,6" },
  "5,5": { right: "5,6", up: "6,6", left: "4,6" },
  "4,6": { down: "5,5", right: "5,5", left: "3,6", up: "3,6" },
  "3,6": { down: "4,6", right: "4,6", up: "4,5" },
  "4,5": { down: "3,6", left: "3,6" },
};

const CROWN_DOOR_DEN_NAV_CONNECTIONS: NavConnection[] = [
  { from: "1,0", to: "1,1", direction: "down" },
  { from: "1,1", to: "2,1", direction: "right" },
  { from: "2,1", to: "3,1", direction: "right" },
  { from: "3,1", to: "4,1", direction: "right" },
  { from: "4,1", to: "5,1", direction: "right" },
  { from: "5,1", to: "5,0", direction: "up" },
  { from: "5,1", to: "4,2", direction: "down" },
  { from: "4,2", to: "5,2", direction: "right" },
  { from: "4,2", to: "4,3", direction: "down" },
  { from: "5,2", to: "5,3", direction: "down" },
  { from: "5,3", to: "4,3", direction: "left" },
  { from: "4,3", to: "3,3", direction: "left" },
  { from: "3,3", to: "2,3", direction: "left" },
  { from: "2,3", to: "1,3", direction: "left" },
  { from: "1,3", to: "1,2", direction: "up" },
  { from: "1,2", to: "1,1", direction: "up" },
  { from: "1,3", to: "1,4", direction: "down" },
  { from: "1,4", to: "2,4", direction: "right" },
  { from: "2,4", to: "2,3", direction: "up" },
  { from: "3,1", to: "3,0", direction: "up" },
  { from: "3,1", to: "3,2", direction: "down" },
  { from: "3,2", to: "2,2", direction: "down" },
  { from: "2,2", to: "2,3", direction: "down" },
];

const WESTROOT_HUB_NAV_CONNECTIONS: NavConnection[] = [
  // The hub is a painted plaza rather than a square grid. Extra path nodes
  // keep each step on the visible stone road instead of hopping between
  // distant landmarks. Primary directions reserve clear junction choices;
  // aliases below make diagonal stretches respond to either plausible key.
  { from: "1,3", to: "1,4", direction: "down" },
  { from: "1,4", to: "2,4", direction: "right" },
  { from: "2,4", to: "2,5", direction: "right" },
  { from: "2,5", to: "2,3", direction: "right" },
  { from: "2,3", to: "3,4", direction: "right" },
  { from: "3,4", to: "3,3", direction: "right" },
  { from: "3,3", to: "3,6", direction: "up" },
  { from: "3,3", to: "4,3", direction: "right" },
  { from: "3,3", to: "8,4", direction: "down" },
  { from: "4,3", to: "5,4", direction: "right" },
  { from: "5,4", to: "4,4", direction: "right" },
  { from: "4,4", to: "5,3", direction: "right" },
  { from: "5,3", to: "6,3", direction: "right" },
  { from: "6,3", to: "6,4", direction: "right" },
  { from: "6,4", to: "7,3", direction: "right" },
  { from: "7,3", to: "7,2", direction: "up" },
  { from: "7,2", to: "6,2", direction: "up" },
  { from: "6,2", to: "7,1", direction: "up" },
  { from: "3,4", to: "2,2", direction: "up" },
  { from: "2,2", to: "3,2", direction: "left" },
  { from: "3,2", to: "3,1", direction: "up" },
  { from: "3,1", to: "2,1", direction: "up" },
  { from: "2,1", to: "1,1", direction: "up" },
  { from: "1,1", to: "1,2", direction: "up" },
  { from: "1,2", to: "1,0", direction: "left" },
  { from: "1,0", to: "3,0", direction: "up" },
  { from: "1,2", to: "4,0", direction: "up" },
  { from: "4,0", to: "2,0", direction: "right" },
  { from: "2,0", to: "5,0", direction: "right" },
  { from: "4,1", to: "6,0", direction: "down" },
  { from: "6,0", to: "5,0", direction: "down" },
  { from: "5,0", to: "5,1", direction: "down" },
  { from: "5,1", to: "4,2", direction: "right" },
  { from: "4,2", to: "6,1", direction: "up" },
  { from: "6,1", to: "5,2", direction: "up" },
  { from: "4,2", to: "4,4", direction: "down" },
  { from: "4,4", to: "8,0", direction: "down" },
  { from: "8,0", to: "8,1", direction: "right" },
  { from: "8,1", to: "8,2", direction: "right" },
  { from: "8,2", to: "8,3", direction: "right" },
  { from: "8,3", to: "6,5", direction: "right" },
  { from: "8,4", to: "8,5", direction: "down" },
  { from: "8,5", to: "8,6", direction: "down" },
  { from: "8,6", to: "7,6", direction: "right" },
  { from: "7,6", to: "6,6", direction: "right" },
  { from: "6,6", to: "5,6", direction: "up" },
  { from: "5,6", to: "8,3", direction: "up" },
  { from: "7,3", to: "7,4", direction: "down" },
  { from: "7,4", to: "6,5", direction: "down" },
  { from: "6,5", to: "5,5", direction: "down" },
  { from: "5,5", to: "7,5", direction: "down" },
];

const WESTROOT_HUB_NAVIGATION_ALIASES: NavConnection[] = [
  { from: "1,3", to: "1,4", direction: "right" },
  { from: "1,0", to: "3,0", direction: "left" },
  { from: "7,2", to: "6,2", direction: "right" },
  { from: "6,2", to: "7,1", direction: "right" },
  { from: "2,2", to: "3,2", direction: "up" },
  { from: "8,0", to: "8,1", direction: "down" },
  { from: "8,1", to: "8,2", direction: "down" },
  { from: "8,2", to: "8,3", direction: "down" },
];

const UNDERWAY_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,2", "2,2", "3,1", "4,1", "5,2", "6,2", "7,2",
]);

const UNDERWAY_ROUTE_811_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,2", "2,1", "3,1", "4,2", "5,3", "6,3", "7,2", "8,1", "9,2",
]);

const UNDERWAY_ROUTE_817_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,3", "2,3", "3,2", "4,1", "5,1", "6,2", "7,3", "8,2", "9,2",
]);

const UNDERWAY_CONVERGENCE_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,1", "2,1", "3,2", "4,3", "5,2", "6,2", "7,1", "8,1", "9,2",
]);

const LISTENING_POST_ONE_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,2", "2,1", "3,1", "4,2", "5,2", "6,1", "7,2", "8,1", "9,2",
]);

const LISTENING_POST_TWO_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,1", "2,1", "3,2", "4,2", "5,3", "6,3", "7,2", "8,1", "9,2",
]);

const LISTENING_POST_THREE_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,2", "2,1", "3,1", "4,2", "5,2", "6,1", "7,2", "8,2",
]);

const RELAY_APPROACH_NAV_CONNECTIONS = buildRightwardRoute([
  "0,2", "1,1", "2,1", "3,2", "4,2", "5,3", "6,2", "7,1", "8,1", "9,2",
]);

const BRIAR_RELAY_POST_NAV_CONNECTIONS: NavConnection[] = [
  { from: "0,1", to: "1,1", direction: "right" },
  { from: "1,1", to: "2,1", direction: "right" },
  { from: "2,1", to: "3,1", direction: "right" },
  { from: "3,1", to: "4,1", direction: "right" },
];

function buildNavigationLinks(
  connections: NavConnection[],
  directedConnections: NavConnection[] = [],
) {
  const links: Record<string, Partial<Record<Direction, string>>> = {};

  connections.forEach(({ from, to, direction }) => {
    links[from] = { ...(links[from] || {}), [direction]: to };
    links[to] = {
      ...(links[to] || {}),
      [OPPOSITE_DIRECTION[direction]]: from,
    };
  });

  directedConnections.forEach(({ from, to, direction }) => {
    links[from] = { ...(links[from] || {}), [direction]: to };
  });

  return links;
}

export const MAP_VISUALS: Record<string, MapVisualConfig> = {
  hearthhollow: {
    aspectRatio: "1 / 1",
    navBounds: { left: 9, top: 13, width: 82, height: 76 },
    revealAll: true,
    pointOverrides: {
      "3,2": { x: 31, y: 31 },
      "10,3": { x: 76.5, y: 36 },
      "1,6": { x: 18.5, y: 58.5 },
    },
  },
  lanternRoad: {
    aspectRatio: "4 / 3",
    navBounds: { left: 4, top: 8, width: 92, height: 82 },
    fogRadius: 7.8,
  },
  bramblecross: {
    aspectRatio: "4 / 3",
    navBounds: { left: 7, top: 8, width: 86, height: 78 },
    revealAll: true,
    fogRadius: 7,
    pointOverrides: {
      "3,5": { x: 25.2, y: 49.7 },
      "7,5": { x: 54.8, y: 47.5 },
    },
  },
  westrootTrail: {
    aspectRatio: "16 / 9",
    navBounds: { left: 5, top: 8, width: 90, height: 82 },
    fogRadius: 10,
    fogPathWidth: 13,
    nodeHitboxSize: "clamp(1.35rem, 4.5%, 2.35rem)",
    navigationLinks: WESTROOT_TRAIL_NAVIGATION_LINKS,
    pointOverrides: {
      "0,3": { x: 6.34, y: 92.88 },
      "0,5": { x: 8.8, y: 89.5 },
      "1,5": { x: 11.48, y: 87.04 },
      "0,4": { x: 13.5, y: 85 },
      "1,4": { x: 14.95, y: 83.1 },
      "1,3": { x: 8.76, y: 78.85 },
      "2,1": { x: 25.3, y: 35.39 },
      "2,2": { x: 26.4, y: 40.1 },
      "2,6": { x: 17.8, y: 76.3 },
      "2,5": { x: 21.9, y: 68 },
      "2,4": { x: 25.8, y: 65 },
      "3,5": { x: 29.47, y: 60.67 },
      "2,3": { x: 28.9, y: 52.9 },
      "3,3": { x: 28.6, y: 46.5 },
      "3,2": { x: 35, y: 42.8 },
      "3,1": { x: 39, y: 39.2 },
      "4,2": { x: 42, y: 40.9 },
      "3,4": { x: 36.33, y: 32.67 },
      "4,1": { x: 41, y: 29.7 },
      "5,1": { x: 48, y: 42 },
      "5,0": { x: 52.07, y: 39.42 },
      "5,2": { x: 54.4, y: 34.6 },
      "6,2": { x: 59.8, y: 32.3 },
      "7,1": { x: 65.8, y: 31.8 },
      "4,3": { x: 66.45, y: 22.48 },
      "5,3": { x: 76.1, y: 30 },
      "7,0": { x: 70.07, y: 35.62 },
      "7,2": { x: 72.7, y: 39.5 },
      "6,0": { x: 75.72, y: 48.43 },
      "8,0": { x: 80.04, y: 51.4 },
      "6,1": { x: 86, y: 40.28 },
      "8,2": { x: 83.9, y: 45.4 },
      "8,3": { x: 86.54, y: 59.19 },
      "7,6": { x: 89.5, y: 62.5 },
      "8,4": { x: 92.7, y: 65.46 },
      "8,6": { x: 93.6, y: 70.5 },
      "8,5": { x: 93.78, y: 74.5 },
      "7,5": { x: 91, y: 82 },
      "7,4": { x: 85.05, y: 86.18 },
      "6,5": { x: 78, y: 88.63 },
      "5,6": { x: 72, y: 88.4 },
      "6,6": { x: 72, y: 84.5 },
      "5,5": { x: 63.5, y: 90 },
      "4,6": { x: 55.3, y: 83.5 },
      "3,6": { x: 50.5, y: 73.5 },
      "4,5": { x: 53.2, y: 66.2 },
      "6,4": { x: 72.1, y: 80.9 },
    },
  },
  westrootHub: {
    aspectRatio: "16 / 9",
    navBounds: { left: 0, top: 0, width: 100, height: 100 },
    revealAll: true,
    nodeHitboxSize: "clamp(1.3rem, 3.8%, 2.2rem)",
    navigationLinks: buildNavigationLinks([
      ...WESTROOT_HUB_NAV_CONNECTIONS,
      ...WESTROOT_HUB_NAVIGATION_ALIASES,
    ], [
      // The Rootmarket spur forms a tight triangle with the main road. Its
      // diagonal return uses a different cardinal button so neither road exit
      // is overwritten.
      { from: "3,6", to: "4,3", direction: "right" },
      { from: "4,3", to: "3,6", direction: "up" },
      // These organic curves keep the same arrow useful until a real fork or
      // turn. Their return links already exist under the primary directions.
      { from: "5,1", to: "4,2", direction: "down" },
      { from: "8,0", to: "4,4", direction: "left" },
      // The central east-west junction follows the painted stairs and bridge
      // rather than the surrounding array coordinates.
      { from: "4,3", to: "5,3", direction: "right" },
      { from: "5,3", to: "4,4", direction: "down" },
      { from: "5,3", to: "4,2", direction: "left" },
      { from: "5,3", to: "6,3", direction: "right" },
      { from: "5,3", to: "6,1", direction: "up" },
    ]),
    pointOverrides: {
      "1,3": { x: 21.1, y: 90.6 },
      "1,4": { x: 24, y: 94 },
      "2,4": { x: 27, y: 91 },
      "2,5": { x: 30.5, y: 84 },
      "2,3": { x: 34, y: 77 },
      "3,4": { x: 38, y: 72 },
      "3,3": { x: 44.13, y: 68.42 },
      "3,6": { x: 40.6, y: 52.7 },
      "4,3": { x: 47.39, y: 64.54 },
      "5,4": { x: 50.94, y: 60.97 },
      "4,4": { x: 55.24, y: 55.46 },
      "5,3": { x: 60, y: 48 },
      "6,3": { x: 68, y: 50 },
      "6,4": { x: 75, y: 55 },
      "7,3": { x: 80, y: 52 },
      "2,2": { x: 34, y: 66 },
      "3,2": { x: 29, y: 62 },
      "3,1": { x: 25, y: 59 },
      "2,1": { x: 23, y: 54 },
      "1,1": { x: 24, y: 47 },
      "1,2": { x: 28, y: 40 },
      "1,0": { x: 24.5, y: 34.5 },
      "3,0": { x: 21.25, y: 29 },
      "4,0": { x: 31.5, y: 32 },
      "2,0": { x: 39, y: 31 },
      "5,0": { x: 46.8, y: 29.5 },
      "4,1": { x: 41.4, y: 15 },
      "6,0": { x: 44, y: 22 },
      "5,1": { x: 52, y: 37 },
      "4,2": { x: 57, y: 44 },
      "6,1": { x: 59.5, y: 36.5 },
      "5,2": { x: 61.7, y: 29.2 },
      "7,2": { x: 84, y: 46 },
      "6,2": { x: 88, y: 42 },
      "7,1": { x: 91.7, y: 35.4 },
      "7,4": { x: 78, y: 62 },
      "6,5": { x: 80, y: 72.5 },
      "5,5": { x: 83.3, y: 79 },
      "7,5": { x: 86.6, y: 84.7 },
      "8,0": { x: 58.51, y: 58.83 },
      "8,1": { x: 63.77, y: 63.01 },
      "8,2": { x: 70.13, y: 68.32 },
      "8,3": { x: 75.06, y: 73.21 },
      "8,4": { x: 48.65, y: 74.14 },
      "8,5": { x: 51.92, y: 80.26 },
      "8,6": { x: 56.44, y: 84.64 },
      "7,6": { x: 62.4, y: 87.19 },
      "6,6": { x: 68.99, y: 83.52 },
      "5,6": { x: 72.07, y: 78.32 },
    },
  },
  rootCellar: {
    aspectRatio: "4 / 3",
    navBounds: { left: 6, top: 6, width: 88, height: 86 },
    fogRadius: 5.8,
    fogPathWidth: 10.5,
    fogRevealAreas: [
      {
        id: "entrance-alcove",
        nodeKeys: ["0,1", "1,1"],
        minVisitedNodes: 2,
        x: 15,
        y: 15,
        radiusX: 10,
        radiusY: 11,
        rotation: -20,
      },
      {
        id: "root-sigil-chamber",
        nodeKeys: ["2,1", "3,1", "4,1", "5,1", "6,1", "3,2", "3,3"],
        minVisitedNodes: 2,
        x: 38,
        y: 25,
        radiusX: 24,
        radiusY: 14,
      },
      {
        id: "upper-store-room",
        nodeKeys: ["7,1", "8,1", "7,2"],
        minVisitedNodes: 2,
        x: 64,
        y: 16,
        radiusX: 13,
        radiusY: 11,
        rotation: -12,
      },
      {
        id: "route-mural-room",
        nodeKeys: ["1,4", "1,5", "1,6"],
        minVisitedNodes: 2,
        x: 16,
        y: 43,
        radiusX: 12,
        radiusY: 14,
      },
      {
        id: "glowcap-chamber",
        nodeKeys: ["3,4", "3,5", "4,5", "5,5", "4,6", "5,6"],
        minVisitedNodes: 2,
        x: 41,
        y: 50,
        radiusX: 15,
        radiusY: 14,
        rotation: -8,
      },
      {
        id: "cellar-cache-room",
        nodeKeys: ["1,6", "2,6", "1,7", "2,7", "3,7"],
        minVisitedNodes: 2,
        x: 22,
        y: 69,
        radiusX: 15,
        radiusY: 14,
      },
      {
        id: "lower-root-chamber",
        nodeKeys: ["4,6", "5,6", "6,6", "4,7", "5,7", "6,7", "4,8", "5,8", "6,8"],
        minVisitedNodes: 2,
        x: 48,
        y: 71,
        radiusX: 21,
        radiusY: 15,
      },
      {
        id: "guardian-vault",
        nodeKeys: ["7,4", "7,5", "7,6", "8,5", "8,6", "9,4", "9,5", "9,6", "10,4"],
        minVisitedNodes: 2,
        x: 78,
        y: 50,
        radiusX: 20,
        radiusY: 21,
        rotation: -8,
      },
    ],
    completedFogOpacity: 0.52,
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
  crownDoorDen: {
    aspectRatio: "16 / 9",
    navBounds: { left: 6, top: 11, width: 88, height: 78 },
    fogRadius: 7.4,
    fogPathWidth: 10.5,
    completedFogOpacity: 0.18,
    nodeHitboxSize: "clamp(1.35rem, 5.2%, 2.45rem)",
    navigationLinks: buildNavigationLinks(CROWN_DOOR_DEN_NAV_CONNECTIONS),
    pointOverrides: {
      "1,0": { x: 16.5, y: 25 },
      "3,0": { x: 46, y: 24 },
      "5,0": { x: 77.5, y: 24 },
      "1,1": { x: 17, y: 35 },
      "2,1": { x: 32.5, y: 36 },
      "3,1": { x: 45.5, y: 30 },
      "4,1": { x: 61.5, y: 31 },
      "5,1": { x: 78, y: 31 },
      "1,2": { x: 17, y: 53 },
      "2,2": { x: 42.7, y: 65.5 },
      "3,2": { x: 43, y: 49 },
      "4,2": { x: 77.9, y: 47.6 },
      "5,2": { x: 89, y: 53 },
      "1,3": { x: 18, y: 61 },
      "2,3": { x: 34, y: 63 },
      "3,3": { x: 61.5, y: 67 },
      "4,3": { x: 74, y: 66 },
      "5,3": { x: 86, y: 65 },
      "1,4": { x: 17.5, y: 80 },
      "2,4": { x: 34, y: 78 },
    },
  },
  underway: {
    aspectRatio: "16 / 9",
    navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true,
    fogColor: "#000000",
    fogRadius: 7,
    fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(UNDERWAY_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 58 },
      "1,2": { x: 16, y: 70 },
      "2,2": { x: 29, y: 60 },
      "3,1": { x: 41, y: 35 },
      "4,1": { x: 53, y: 27 },
      "5,2": { x: 65, y: 45 },
      "6,2": { x: 77, y: 68 },
      "7,2": { x: 95, y: 50 },
    },
  },
  underwayRoute811: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(UNDERWAY_ROUTE_811_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 47 }, "1,2": { x: 15, y: 44 }, "2,1": { x: 25, y: 24 },
      "3,1": { x: 35, y: 29 }, "4,2": { x: 45, y: 47 }, "5,3": { x: 55, y: 63 },
      "6,3": { x: 65, y: 55 }, "7,2": { x: 75, y: 47 }, "8,1": { x: 85, y: 55 },
      "9,2": { x: 95, y: 44 },
    },
  },
  underwayRoute817: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(UNDERWAY_ROUTE_817_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 54 }, "1,3": { x: 15, y: 53 }, "2,3": { x: 25, y: 52 },
      "3,2": { x: 35, y: 51 }, "4,1": { x: 45, y: 50 }, "5,1": { x: 55, y: 49 },
      "6,2": { x: 65, y: 50 }, "7,3": { x: 75, y: 51 }, "8,2": { x: 85, y: 52 },
      "9,2": { x: 95, y: 53 },
    },
  },
  underwayConvergence: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(UNDERWAY_CONVERGENCE_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 43 }, "1,1": { x: 15, y: 33 }, "2,1": { x: 25, y: 36 },
      "3,2": { x: 35, y: 49 }, "4,3": { x: 45, y: 56 }, "5,2": { x: 57, y: 62 },
      "6,2": { x: 68, y: 57 }, "7,1": { x: 79, y: 53 }, "8,1": { x: 89, y: 55 },
      "9,2": { x: 96, y: 43 },
    },
  },
  listeningPostOne: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(LISTENING_POST_ONE_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 55 }, "1,2": { x: 15, y: 52 }, "2,1": { x: 25, y: 43 },
      "3,1": { x: 35, y: 40 }, "4,2": { x: 45, y: 45 }, "5,2": { x: 55, y: 51 },
      "6,1": { x: 65, y: 46 }, "7,2": { x: 75, y: 56 }, "8,1": { x: 85, y: 61 },
      "9,2": { x: 95, y: 63 },
    },
  },
  listeningPostTwo: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(LISTENING_POST_TWO_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 52 }, "1,1": { x: 15, y: 43 }, "2,1": { x: 25, y: 33 },
      "3,2": { x: 35, y: 38 }, "4,2": { x: 45, y: 51 }, "5,3": { x: 55, y: 59 },
      "6,3": { x: 65, y: 61 }, "7,2": { x: 75, y: 54 }, "8,1": { x: 85, y: 42 },
      "9,2": { x: 95, y: 36 },
    },
  },
  listeningPostThree: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(LISTENING_POST_THREE_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 52 }, "1,2": { x: 16, y: 51 }, "2,1": { x: 27, y: 36 },
      "3,1": { x: 38, y: 40 }, "4,2": { x: 49, y: 49 }, "5,2": { x: 60, y: 50 },
      "6,1": { x: 71, y: 41 }, "7,2": { x: 83, y: 56 }, "8,2": { x: 95, y: 58 },
    },
  },
  relayApproach: {
    aspectRatio: "16 / 9", navBounds: { left: 4, top: 8, width: 92, height: 84 },
    localLantern: true, fogColor: "#000000", fogRadius: 7, fogPathWidth: 9,
    nodeHitboxSize: "clamp(1.4rem, 4.2%, 2.35rem)",
    navigationLinks: buildNavigationLinks(RELAY_APPROACH_NAV_CONNECTIONS),
    pointOverrides: {
      "0,2": { x: 5, y: 48 }, "1,1": { x: 15, y: 41 }, "2,1": { x: 25, y: 52 },
      "3,2": { x: 35, y: 46 }, "4,2": { x: 45, y: 36 }, "5,3": { x: 55, y: 44 },
      "6,2": { x: 65, y: 49 }, "7,1": { x: 75, y: 48 }, "8,1": { x: 85, y: 48 },
      "9,2": { x: 95, y: 48 },
    },
  },
  briarRelayPost: {
    aspectRatio: "16 / 9",
    navBounds: { left: 5, top: 12, width: 90, height: 76 },
    revealAll: true,
    nodeHitboxSize: "clamp(1.6rem, 4.5%, 2.5rem)",
    navigationLinks: buildNavigationLinks(BRIAR_RELAY_POST_NAV_CONNECTIONS),
    pointOverrides: {
      "0,1": { x: 8, y: 55 },
      "1,1": { x: 25, y: 54 },
      "2,1": { x: 50, y: 52 },
      "3,1": { x: 72, y: 53 },
      "4,1": { x: 91, y: 54 },
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
