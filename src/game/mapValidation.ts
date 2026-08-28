import { MAPS, TILE_META } from "../data/maps";
import { getMapVisualConfig, hasNavigationGraph } from "../data/mapVisuals";

type Direction = "up" | "down" | "left" | "right";

export type MapGraphValidationIssue = {
  region: string;
  code:
    | "missing-map"
    | "missing-start-node"
    | "invalid-node-key"
    | "node-out-of-bounds"
    | "destination-out-of-bounds"
    | "destination-missing-node"
    | "one-way-link"
    | "blocked-node"
    | "orphan-node"
    | "missing-required-landmark"
    | "unreachable-required-landmark";
  message: string;
};

export type MapGraphValidationResult = {
  region: string;
  ok: boolean;
  issues: MapGraphValidationIssue[];
};

export const REQUIRED_GRAPH_LANDMARKS: Record<string, string[]> = {
  rootCellar: [
    "stairs_up",
    "sigil",
    "mural",
    "fungus",
    "cache3",
    "skulk",
    "boss",
    "exit_door",
  ],
  westrootTrail: [
    "westroot_return",
    "westroot_cut",
    "shelter_nook",
    "false_notice",
    "three_hollow",
    "roadwatcher",
    "no_handle_stone",
  ],
  westrootHub: [
    "westroot_first_gate",
    "rootmarket",
    "mossgarden",
    "witness_stones",
    "cargo_siding",
    "split_hall",
  ],
  crownDoorDen: [
    "crown_den_exit",
    "crown_vestibule",
    "wax_table",
    "slat_rack",
    "witness_ledger",
    "collar_kennel",
    "false_map",
    "den_guard",
  ],
  underway: [
    "underway_gate",
    "detour_notice",
  ],
  underwayRoute811: [
    "mapped_gallery",
    "waykeeper_cache",
    "underway_route_exit",
  ],
  underwayRoute817: [
    "maintenance_hatch",
    "construction_signal_rig",
    "underway_route_exit",
  ],
  underwayConvergence: [
    "convergence_entry",
    "ambush_approach",
    "underway_ambush",
    "convergence_exit",
  ],
  listeningPostOne: [
    "listening_post_one",
    "listening_mile_exit",
  ],
  listeningPostTwo: [
    "listening_post_two",
    "listening_mile_exit",
  ],
  listeningPostThree: [
    "listening_post_three",
    "lio_message_plate",
  ],
  relayApproach: [
    "relay_approach_entry",
    "relay_post_gate",
  ],
  briarRelayPost: [
    "relay_entry",
    "royal_progress_broadside",
    "relay_guard",
    "forged_order_desk",
    "briarhold_route_ledger",
  ],
};

export const DOCUMENTED_ONE_WAY_LINKS: Record<string, Record<string, string>> = {
  rootCellar: {
    "7,5->6,6":
      "Organic Root Cellar fork: the lower central node already uses its return-facing controls for adjacent path branches.",
    "7,5->8,6":
      "Organic Root Cellar fork: the right-hand connector is reachable through the adjacent lower path controls.",
    "4,8->3,7":
      "Organic Root Cellar lower loop: the diagonal return would overwrite the main lower path controls.",
  },
  westrootTrail: {
    "4,2->3,4":
      "Three-Sign Hollow approach: this diagonal trail step uses an organic up control without a direct reverse button.",
    "6,6->6,5":
      "First Westroot Gate approach: this shortcut returns toward the lower trail without replacing the main bend controls.",
  },
  westrootHub: {
    "4,3->5,3":
      "Central Westroot junction: Right follows the painted shortcut to the east junction, whose Left control follows the upper branch.",
    "5,4->4,3":
      "Central Westroot junction: the return-facing Right control at 4,3 is reserved for the east junction shortcut.",
    "5,3->4,2":
      "Central Westroot junction: Left climbs the upper branch instead of reversing the approach shortcut.",
    "5,3->6,1":
      "Central Westroot junction: Up reaches the Split Hall approach, whose controls continue along the hall road.",
  },
};

function parseNodeKey(key: string) {
  const [rawX, rawY] = key.split(",");
  const x = Number(rawX);
  const y = Number(rawY);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return null;
  return { x, y };
}

function addIssue(
  issues: MapGraphValidationIssue[],
  region: string,
  code: MapGraphValidationIssue["code"],
  message: string,
) {
  issues.push({ region, code, message });
}

function tileAt(region: string, key: string) {
  const point = parseNodeKey(key);
  if (!point) return undefined;
  return MAPS[region]?.tiles?.[point.y]?.[point.x];
}

function getReachableNodeKeys(region: string, startKey: string, links: Record<string, Partial<Record<Direction, string>>>) {
  const seen = new Set<string>();
  const queue = [startKey];

  while (queue.length) {
    const key = queue.shift();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    Object.values(links[key] || {}).forEach((destination) => {
      if (destination && !seen.has(destination)) queue.push(destination);
    });
  }

  return seen;
}

function findTileKeys(region: string, tileId: string) {
  const keys: string[] = [];
  MAPS[region]?.tiles?.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === tileId) keys.push(`${x},${y}`);
    });
  });
  return keys;
}

function isDocumentedOneWayLink(region: string, from: string, to: string) {
  return !!DOCUMENTED_ONE_WAY_LINKS[region]?.[`${from}->${to}`];
}

export function validateMapNavigationGraph(
  region: string,
  requiredLandmarks: string[] = REQUIRED_GRAPH_LANDMARKS[region] || [],
): MapGraphValidationResult {
  const issues: MapGraphValidationIssue[] = [];
  const map = MAPS[region];

  if (!map) {
    addIssue(issues, region, "missing-map", `No map data exists for ${region}.`);
    return { region, ok: false, issues };
  }

  if (!hasNavigationGraph(region)) return { region, ok: true, issues };

  const links = getMapVisualConfig(region).navigationLinks || {};
  const nodeKeys = Object.keys(links);
  const startKey = `${map.start.x},${map.start.y}`;

  if (!links[startKey]) {
    addIssue(
      issues,
      region,
      "missing-start-node",
      `${region} start node ${startKey} is not present in the navigation graph.`,
    );
  }

  nodeKeys.forEach((key) => {
    const point = parseNodeKey(key);
    if (!point) {
      addIssue(issues, region, "invalid-node-key", `${region} has invalid node key ${key}.`);
      return;
    }

    const tile = tileAt(region, key);
    if (!tile) {
      addIssue(issues, region, "node-out-of-bounds", `${region} node ${key} is outside map bounds.`);
      return;
    }

    if (TILE_META[tile]?.blocked) {
      addIssue(issues, region, "blocked-node", `${region} node ${key} uses blocked tile ${tile}.`);
    }

    Object.entries(links[key] || {}).forEach(([direction, destination]) => {
      if (!destination) return;
      const destinationPoint = parseNodeKey(destination);
      if (!destinationPoint || !tileAt(region, destination)) {
        addIssue(
          issues,
          region,
          "destination-out-of-bounds",
          `${region} ${key}.${direction} points outside the map: ${destination}.`,
        );
        return;
      }

      if (!links[destination]) {
        addIssue(
          issues,
          region,
          "destination-missing-node",
          `${region} ${key}.${direction} points to ${destination}, which has no graph node.`,
        );
        return;
      }

      if (
        !Object.values(links[destination] || {}).includes(key) &&
        !isDocumentedOneWayLink(region, key, destination)
      ) {
        addIssue(
          issues,
          region,
          "one-way-link",
          `${region} ${key}.${direction} points to ${destination}, but no return link exists.`,
        );
      }
    });
  });

  const reachable = links[startKey]
    ? getReachableNodeKeys(region, startKey, links)
    : new Set<string>();

  nodeKeys.forEach((key) => {
    if (!reachable.has(key)) {
      addIssue(issues, region, "orphan-node", `${region} graph node ${key} is not reachable from ${startKey}.`);
    }
  });

  requiredLandmarks.forEach((tileId) => {
    const tileKeys = findTileKeys(region, tileId);
    if (!tileKeys.length) {
      addIssue(
        issues,
        region,
        "missing-required-landmark",
        `${region} is missing required landmark tile ${tileId}.`,
      );
      return;
    }

    if (!tileKeys.some((key) => reachable.has(key))) {
      addIssue(
        issues,
        region,
        "unreachable-required-landmark",
        `${region} required landmark ${tileId} is not reachable from ${startKey}.`,
      );
    }
  });

  return { region, ok: issues.length === 0, issues };
}

export function validateAllMapNavigationGraphs() {
  return Object.keys(MAPS)
    .filter((region) => hasNavigationGraph(region))
    .map((region) => validateMapNavigationGraph(region));
}
