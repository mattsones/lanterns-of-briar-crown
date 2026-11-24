import type { Chapter5Node, Chapter5SaveState } from "../game/chapter5Runtime";

// Registered from the accepted revision-4 metre-space masters, not CH5_NODES'
// schematic grid. Keep source paintings and the full model under assets/reference.
export const CH5_MAP_WAYPOINTS = ["a01", "a02", "a03", "a04", "a05", "r00", "r01", "r02", "r03", "r04", "r05", "r06", "l00", "l01", "w00", "w01", "w02", "w03"] as const;
export type Chapter5MapWaypoint = typeof CH5_MAP_WAYPOINTS[number];
export type Chapter5MapPoint = Chapter5Node | Chapter5MapWaypoint;
export type Chapter5MapDirection = "up" | "down" | "left" | "right";
export type Chapter5PaintedLayout = {
  id: "briarholdApproach" | "briarholdCrownTable" | "briarholdLedger" | "briarholdWorkshop";
  bounds: readonly [number, number, number, number];
  aspectRatio: string;
  background: string;
  openBackground?: string;
  nodes: Partial<Record<Chapter5MapPoint, { point: readonly [number, number]; label?: string; portal?: boolean }>>;
  edges: { from: Chapter5MapPoint; to: Chapter5MapPoint; direction: Chapter5MapDirection; gate?: "first-sight" | "boss" | "rescued" | "workshop-visited" }[];
};
export const CH5_CART_ART = new URL("../../assets/icons/map-tokens/briarhold-rescue-cart-v01.webp", import.meta.url).href;

export const CH5_APPROACH_MAP: Chapter5PaintedLayout = {
  id: "briarholdApproach", bounds: [0, 7.8, 46, 25.875], aspectRatio: "16 / 9",
  background: new URL("../../assets/maps/briarhold-approach-v05.webp", import.meta.url).href,
  nodes: {
    overlook: { point: [5.3, 12.9] }, a01: { point: [5.2, 17.7], label: "Unmarked uphill scramble" },
    a02: { point: [13, 20], label: "Fern bend" }, ridge: { point: [17, 16.5] },
    a03: { point: [21.3, 15.4], label: "Gate-side cover" }, gate: { point: [26, 16.9] },
    a04: { point: [17.6, 19.5], label: "Lower root bank" }, runoff: { point: [18.4, 22.3] },
    a05: { point: [19.3, 28.3], label: "Wet streambed below the retaining wall" }, culvert: { point: [26, 28.3] },
  },
  edges: [
    { from: "overlook", to: "a01", direction: "down" }, { from: "a01", to: "a02", direction: "right" },
    { from: "a02", to: "ridge", direction: "right" }, { from: "ridge", to: "a03", direction: "right" },
    { from: "a03", to: "gate", direction: "right" }, { from: "ridge", to: "a04", direction: "down" },
    { from: "a04", to: "runoff", direction: "down" }, { from: "runoff", to: "a05", direction: "down" },
    { from: "a05", to: "culvert", direction: "right" },
  ],
};
export const CH5_RESCUE_MAP: Chapter5PaintedLayout = {
  id: "briarholdCrownTable", bounds: [42, 10.5, 20, 15], aspectRatio: "4 / 3",
  background: new URL("../../assets/maps/briarhold-rescue-closed-v02.webp", import.meta.url).href,
  openBackground: new URL("../../assets/maps/briarhold-rescue-open-v02.webp", import.meta.url).href,
  nodes: {
    door: { point: [42.2, 17.3], portal: true }, r00: { point: [43.9, 17.3], label: "Gallery entry" },
    r01: { point: [43.9, 19.65], label: "Gallery bend" }, grille: { point: [43.9, 14] },
    r02: { point: [47.8, 19.65], label: "Entrance below the console" }, r03: { point: [49.3, 19.65], label: "South aisle" },
    r04: { point: [51.3, 19.65], label: "Far end of the south aisle" }, r05: { point: [53, 18.4], label: "East bend" },
    crown: { point: [54, 16.8] }, carriage: { point: [52.85, 19.1] },
    r06: { point: [57.8, 16.8], label: "East aisle" }, cells: { point: [57.8, 21.9] },
  },
  edges: [
    { from: "r00", to: "grille", direction: "up" },
    { from: "r00", to: "door", direction: "left" },
    { from: "r00", to: "r01", direction: "down", gate: "first-sight" },
    { from: "r01", to: "r02", direction: "right", gate: "first-sight" },
    { from: "r02", to: "r03", direction: "right" }, { from: "r03", to: "r04", direction: "right" },
    { from: "r04", to: "r05", direction: "right" }, { from: "r05", to: "crown", direction: "up" },
    { from: "r05", to: "carriage", direction: "down", gate: "boss" },
    { from: "crown", to: "r06", direction: "right", gate: "rescued" },
    { from: "r06", to: "cells", direction: "down", gate: "rescued" },
  ],
};

export const CH5_RECORDS_MAP: Chapter5PaintedLayout = {
  id: "briarholdLedger", bounds: [34.5, 5.5, 10, 10], aspectRatio: "1 / 1",
  background: new URL("../../assets/maps/briarhold-records-v06.webp", import.meta.url).href,
  nodes: {
    hub: { point: [37.7, 14.5], portal: true },
    l00: { point: [37.7, 13.6], label: "Upper stair" },
    l01: { point: [37.7, 11.73], label: "Workroom threshold" },
    ledger: { point: [36.06, 11.73] },
  },
  edges: [
    { from: "hub", to: "l00", direction: "up" },
    { from: "l00", to: "l01", direction: "up" },
    { from: "l01", to: "ledger", direction: "left" },
  ],
};

export const CH5_WORKSHOP_MAP: Chapter5PaintedLayout = {
  id: "briarholdWorkshop", bounds: [28, 21, 12, 12], aspectRatio: "1 / 1",
  background: new URL("../../assets/maps/briarhold-workshop-v02.webp", import.meta.url).href,
  nodes: {
    hub: { point: [35.18, 21.2], portal: true },
    w00: { point: [35.18, 22.4], label: "Lower stair" },
    w01: { point: [34.7, 24.8], label: "Foot of the stair" },
    w02: { point: [34.68, 27], label: "Lamplit aisle" },
    workshop: { point: [34.55, 29.65] },
    w03: { point: [37, 27], label: "Stair foot" },
    lanterns: { point: [39.1, 27], portal: true },
  },
  edges: [
    { from: "hub", to: "w00", direction: "down" },
    { from: "w00", to: "w01", direction: "down" },
    { from: "w01", to: "w02", direction: "down" },
    { from: "w02", to: "workshop", direction: "down" },
    { from: "w02", to: "w03", direction: "right", gate: "workshop-visited" },
    { from: "w03", to: "lanterns", direction: "right" },
  ],
};

export function getChapter5PaintedLayout(state: Chapter5SaveState) {
  if (!state.started || state.departed || state.returnedToBramblecross) return null;
  if (!state.briarhold.entry) return CH5_APPROACH_MAP.nodes[state.node] ? CH5_APPROACH_MAP : null;
  if (state.node === "ledger" || state.node === "hub" && (state.mapWaypoint === "l00" || state.mapWaypoint === "l01")) return CH5_RECORDS_MAP;
  if (state.node === "workshop" || state.node === "hub" && (state.mapWaypoint === "w00" || state.mapWaypoint === "w01" || state.mapWaypoint === "w02")) return CH5_WORKSHOP_MAP;
  return ["grille", "crown", "carriage", "cells"].includes(state.node) ? CH5_RESCUE_MAP : null;
}
export function getChapter5MapPosition(state: Chapter5SaveState): Chapter5MapPoint { return state.mapWaypoint || state.node; }
export function isChapter5MapWaypoint(value: unknown): value is Chapter5MapWaypoint { return CH5_MAP_WAYPOINTS.includes(value as Chapter5MapWaypoint); }
export function isChapter5MapPositionValid(state: Chapter5SaveState) {
  if (state.mapWaypoint === null) return true;
  const layout = getChapter5PaintedLayout(state);
  return isChapter5MapWaypoint(state.mapWaypoint) && !!layout?.nodes[state.mapWaypoint] &&
    !state.view && !state.pendingBattle && !state.briarhold.investigatorPending && !state.hubInterlude &&
    (layout.id === "briarholdLedger" ? !state.ledgerOfficerDistracted :
      layout.id !== "briarholdCrownTable" || state.briarhold.innerDoorOpened && state.lioSeen) &&
    !(state.brackenDefeated && state.carriageStage !== "rescued");
}
