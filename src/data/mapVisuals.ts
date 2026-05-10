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
    navBounds: { left: 3, top: 6, width: 90, height: 80 },
    fogRadius: 9.5,
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
  const { left, top, width, height } = visual.navBounds;
  return {
    x: left + ((x + 0.5) / columns) * width,
    y: top + ((y + 0.5) / rows) * height,
  };
}
