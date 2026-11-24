import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { CH5_APPROACH_MAP, CH5_RESCUE_MAP, getChapter5PaintedLayout } from "../src/data/chapter5Maps";
import { getChapter5MapNeighbors, moveChapter5OnMap, walkChapter5MapTo } from "../src/game/chapter5Map";
import { buildChapter5SaveState, canLeaveChapter5Scene, leaveChapter5Scene, normalizeChapter5Save, type Chapter5SaveState } from "../src/game/chapter5Runtime";
import { parseDiskSaveText, serializeDiskSave } from "../src/game/save";

const payload = () => parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
const approach = (): Chapter5SaveState => ({ ...buildChapter5SaveState(), started: true, view: null });
const grille = (): Chapter5SaveState => ({ ...approach(), node: "grille", lioSeen: true,
  briarhold: { ...approach().briarhold, entry: "culvert", innerDoorOpened: true } });
function roundTrip(s: Chapter5SaveState) { const p = payload(); p.chapter5 = s; return parseDiskSaveText(serializeDiskSave("Map position", p)).payload.chapter5; }

test("registered painting coordinates and reciprocal arrow aliases match the accepted masters", () => {
  const master = JSON.parse(readFileSync("assets/reference/concept/environments/chapter-5-masters-v01/layout.json", "utf8"));
  for (const [layout, source] of [[CH5_APPROACH_MAP, master.approach], [CH5_RESCUE_MAP, master.rescue]] as const) {
    expect(layout.id).toBe(source.id);
    expect(layout.bounds).toEqual(source.bounds);
    for (const node of source.nodes) expect(layout.nodes[node.id].point).toEqual(node.point);
    for (const edge of source.edges) expect(layout.edges).toContainEqual(expect.objectContaining({ from: edge.from, to: edge.to, direction: edge.direction }));
    const s = layout === CH5_APPROACH_MAP ? approach() : { ...grille(), brackenDefeated: true, carriageStage: "rescued" as const };
    for (const id of Object.keys(layout.nodes)) {
      const neighbors = getChapter5MapNeighbors(s, id as any);
      expect(new Set(neighbors.map(n => n.direction)).size).toBe(neighbors.length);
      for (const neighbor of neighbors) expect(getChapter5MapNeighbors(s, neighbor.id).some(n => n.id === id)).toBe(true);
    }
  }
});

test("approach arrows save intermediate footsteps without inventing scenes, rolls or entry", () => {
  const original = approach();
  let s = moveChapter5OnMap(original, "down");
  expect(s).toMatchObject({ node: "overlook", mapWaypoint: "a01", view: null, checks: {} });
  expect(roundTrip(s)).toEqual(s);
  expect(moveChapter5OnMap(s, "up")).toMatchObject({ node: "overlook", mapWaypoint: null, view: null });
  s = moveChapter5OnMap(s, "right");
  expect(s.mapWaypoint).toBe("a02");
  s = moveChapter5OnMap(s, "right");
  expect(s).toMatchObject({ node: "ridge", mapWaypoint: null, view: "ridge" });
  expect(s.briarhold).toEqual(original.briarhold);
  expect(walkChapter5MapTo(original, "culvert")).toBe(original);
  const clicked = walkChapter5MapTo(original, "ridge");
  expect(clicked).toEqual(s);
  expect(moveChapter5OnMap(clicked, "down")).toMatchObject({ node: "ridge", mapWaypoint: "a04", view: null });
  expect(moveChapter5OnMap(clicked, "down").seenScenes.ridge).toBe(clicked.seenScenes.ridge);
});

test("the painted workshop retains the hub and signal connections through its cover stop", () => {
  const hub = { ...grille(), node: "hub" as const, hubPassages: 3 };
  const stair = walkChapter5MapTo(hub, "w00");
  expect(roundTrip(stair)).toEqual(stair);
  expect(moveChapter5OnMap(stair, "up")).toEqual(hub);
  const crossing = moveChapter5OnMap(moveChapter5OnMap(stair, "down"), "down");
  expect(crossing.mapWaypoint).toBe("w02");
  expect(moveChapter5OnMap(crossing, "right")).toBe(crossing);
  const workshop = moveChapter5OnMap(crossing, "down");
  expect(workshop).toMatchObject({ node: "workshop", view: "workshop", mapWaypoint: null });
  expect(walkChapter5MapTo(workshop, "hub").node).toBe("hub");
  expect(walkChapter5MapTo(workshop, "lanterns").node).toBe("lanterns");
  expect(() => normalizeChapter5Save({ ...hub, mapWaypoint: "w03" })).toThrow();
});

test("records footsteps preserve pre-entry knowledge and return through the same stair", () => {
  const hub = { ...grille(), node: "hub" as const, lioSeen: false, hubPassages: 3,
    briarhold: { ...grille().briarhold, innerDoorOpened: false } };
  const ready = walkChapter5MapTo(hub, "l00");
  expect(ready).toMatchObject({ node: "hub", mapWaypoint: "l00", view: null });
  expect(roundTrip(ready)).toEqual(ready);
  expect(moveChapter5OnMap(ready, "down")).toEqual(hub);
  const threshold = moveChapter5OnMap(ready, "up");
  expect(threshold).toMatchObject({ node: "hub", mapWaypoint: "l01", view: null });
  expect(threshold.seenScenes.ledger).toBeUndefined();
  const cover = moveChapter5OnMap(threshold, "left");
  expect(cover).toMatchObject({ node: "ledger", mapWaypoint: null, view: "ledger" });
  expect(walkChapter5MapTo(hub, "ledger")).toEqual(cover);
  expect(walkChapter5MapTo(cover, "hub").node).toBe("hub");
  expect(() => normalizeChapter5Save({ ...hub, node: "workshop", mapWaypoint: "l00" })).toThrow();
});

test("rescue arrows observe the north grille, return through E, and respect boss and captive gates", () => {
  const unseen = { ...grille(), lioSeen: false };
  expect(moveChapter5OnMap(unseen, "down")).toBe(unseen);
  expect(walkChapter5MapTo(unseen, "crown")).toBe(unseen);
  let s = moveChapter5OnMap(grille(), "down");
  expect(s.mapWaypoint).toBe("r00");
  expect(roundTrip(s)).toEqual(s);
  s = moveChapter5OnMap(s, "down");
  for (let i = 0; i < 4; i++) s = moveChapter5OnMap(s, "right");
  expect(s.mapWaypoint).toBe("r05");
  expect(moveChapter5OnMap(s, "down")).toBe(s);
  s = moveChapter5OnMap(s, "up");
  expect(s).toMatchObject({ node: "crown", mapWaypoint: null, view: "crown" });
  expect(walkChapter5MapTo({ ...s, view: null }, "cells")).toEqual({ ...s, view: null });
  const back = walkChapter5MapTo({ ...s, view: null }, "door");
  expect(back).toMatchObject({ node: "door", mapWaypoint: null });
  expect(getChapter5PaintedLayout(back)).toBeNull();
  expect(back.lioSeen).toBe(true);
  const locked = { ...grille(), node: "door" as const, briarhold: { ...grille().briarhold, innerDoorOpened: false } };
  expect(walkChapter5MapTo(locked, "grille").node).toBe("door");
});

test("the rescue emergency blocks every painted route; freed-party cleanup stays traversable", () => {
  const emergency = { ...grille(), node: "carriage" as const, brackenDefeated: true };
  expect(walkChapter5MapTo(emergency, "crown")).toBe(emergency);
  for (const direction of ["up", "down", "left", "right"] as const) expect(moveChapter5OnMap(emergency, direction)).toBe(emergency);
  const rescued = { ...emergency, carriageStage: "rescued" as const };
  const crown = walkChapter5MapTo(rescued, "crown");
  expect(crown.node).toBe("crown");
  const cells = walkChapter5MapTo({ ...crown, view: null }, "cells");
  expect(cells).toMatchObject({ node: "cells", mapWaypoint: null, view: "cells", cellsOpened: false, brackenLootClaimed: false });
  expect(cells.carriageStage).toBe("rescued");
});

test("legacy map locations resume at their named anchors and inconsistent waypoint saves reject", () => {
  const old = { ...grille() }; delete old.mapWaypoint;
  expect(normalizeChapter5Save(old)).toMatchObject({ node: "grille", mapWaypoint: null });
  for (const invalid of [{ ...approach(), mapWaypoint: "r00" }, { ...grille(), mapWaypoint: "a01" },
    { ...approach(), mapWaypoint: "a01", view: "overlook" }, { ...grille(), mapWaypoint: "r00", lioSeen: false },
    { ...approach(), mapWaypoint: 3 }, { ...approach(), mapWaypoint: "unknown" }]) expect(() => normalizeChapter5Save(invalid)).toThrow();
  expect(getChapter5PaintedLayout({ ...grille(), node: "hub" })).toBeNull();
  expect(getChapter5PaintedLayout({ ...grille(), departed: true })).toBeNull();
});

test("walking out of ordinary scenes acknowledges them and applies abandonment once", () => {
  const distracted = { ...grille(), node: "ledger" as const, view: "ledger" as const, ledgerOfficerDistracted: true };
  expect(canLeaveChapter5Scene(distracted)).toBe(true);
  expect(walkChapter5MapTo(distracted, "carriage")).toBe(distracted); // An invalid direction cannot dismiss the scene.
  const left = walkChapter5MapTo(distracted, "hub");
  expect(left).toMatchObject({ node: "hub", ledgerOfficerDistracted: false, ledgerResolved: false, briarhold: { alert: "suspicious" } });
  expect(left.seenScenes.ledger).toMatch(/^scene-v1:/);
  const returned = walkChapter5MapTo(left, "ledger");
  expect(returned).toMatchObject({ node: "ledger", ledgerOfficerDistracted: false, briarhold: { alert: "suspicious" } });
  expect(leaveChapter5Scene(leaveChapter5Scene(returned)).briarhold.alert).toBe("suspicious");
});

test("routine dismissal cannot bypass the opening, first sight, stealth choice, battle or rescue", () => {
  const base = grille();
  const locked = [
    { ...approach(), view: "opening" as const },
    { ...base, view: "grille" as const, lioSeen: false },
    { ...base, node: "hub" as const, view: "hub" as const, hubInterlude: "lamp" as const, hubPassages: 2 },
    { ...base, view: "investigator" as const, briarhold: { ...base.briarhold, investigatorPending: true } },
    { ...base, pendingBattle: "boss" as const },
    { ...base, node: "carriage" as const, view: "carriage" as const, brackenDefeated: true },
  ];
  for (const s of locked) {
    expect(canLeaveChapter5Scene(s)).toBe(false);
    expect(leaveChapter5Scene(s)).toBe(s);
    for (const direction of ["up", "down", "left", "right"] as const) expect(moveChapter5OnMap(s, direction)).toBe(s);
  }
});
