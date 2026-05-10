type MapBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type MapVisualConfig = {
  aspectRatio: string;
  navBounds: MapBounds;
  fogRadius?: number;
  pointGrid?: {
    xByColumn: number[];
    yByRow: number[];
  };
  pointOverrides?: Record<string, { x: number; y: number }>;
};

export const MAP_VISUALS: Record<string, MapVisualConfig> = {
  hearthhollow: {
    aspectRatio: "1 / 1",
    navBounds: { left: 9, top: 13, width: 82, height: 76 },
  },
  lanternRoad: {
    aspectRatio: "4 / 3",
    navBounds: { left: 4, top: 8, width: 92, height: 82 },
    fogRadius: 8.5,
  },
  bramblecross: {
    aspectRatio: "4 / 3",
    navBounds: { left: 7, top: 8, width: 86, height: 78 },
    fogRadius: 7.5,
  },
  rootCellar: {
    aspectRatio: "4 / 3",
    navBounds: { left: 6, top: 6, width: 88, height: 86 },
    fogRadius: 9.5,
    pointGrid: {
      xByColumn: [12.5, 20.5, 28.5, 36.5, 44.5, 52, 60, 67.5, 75, 82.5, 89],
      yByRow: [8.5, 17.5, 28.5, 40, 51.5, 62.5, 72.5, 82, 90],
    },
    pointOverrides: {
      "0,1": { x: 12.5, y: 11.5 },
      "1,1": { x: 18, y: 16.5 },
      "2,1": { x: 24, y: 20 },
      "3,1": { x: 31, y: 24 },
      "5,1": { x: 45, y: 22 },
      "6,1": { x: 53, y: 18 },
      "7,1": { x: 60.5, y: 16 },
      "8,1": { x: 67.5, y: 18 },
      "9,1": { x: 72.5, y: 23 },
      "1,2": { x: 15.5, y: 29 },
      "3,2": { x: 31, y: 31 },
      "4,2": { x: 38, y: 30 },
      "5,2": { x: 45, y: 31 },
      "7,2": { x: 60, y: 29 },
      "8,2": { x: 66.5, y: 28.5 },
      "9,2": { x: 72.5, y: 29 },
      "1,3": { x: 15, y: 40 },
      "2,3": { x: 23, y: 39 },
      "3,3": { x: 31, y: 39 },
      "4,3": { x: 38, y: 40 },
      "5,3": { x: 45, y: 39.5 },
      "7,3": { x: 60, y: 39 },
      "1,4": { x: 16, y: 48 },
      "5,4": { x: 45, y: 48 },
      "6,4": { x: 53, y: 49 },
      "7,4": { x: 61.5, y: 49 },
      "8,4": { x: 70, y: 51 },
      "9,4": { x: 78, y: 52.5 },
      "10,4": { x: 86, y: 41.5 },
      "1,5": { x: 15, y: 58 },
      "2,5": { x: 22.5, y: 58 },
      "3,5": { x: 30, y: 57 },
      "4,5": { x: 37.5, y: 56 },
      "5,5": { x: 45, y: 55 },
      "7,5": { x: 61.5, y: 58 },
      "1,6": { x: 14.5, y: 68 },
      "2,6": { x: 24, y: 68.5 },
      "3,6": { x: 31, y: 68 },
      "5,6": { x: 45.5, y: 66 },
      "7,6": { x: 62, y: 66 },
      "8,6": { x: 68.5, y: 65 },
      "9,6": { x: 73.5, y: 63.5 },
      "1,7": { x: 15, y: 78 },
      "2,7": { x: 23.5, y: 78 },
      "3,7": { x: 32, y: 77 },
      "4,7": { x: 40.5, y: 76 },
      "5,7": { x: 48.5, y: 75.5 },
      "6,7": { x: 55.5, y: 75.5 },
      "7,7": { x: 62, y: 74 },
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
