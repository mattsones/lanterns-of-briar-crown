import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { buildChapter5SaveState, finishChapter5Battle, freeLedgerClerk, getChapter5Edges, moveChapter5, normalizeChapter5Save, type Chapter5SaveState } from "../src/game/chapter5Runtime";
import * as progress from "../src/game/chapter5Progress";
import { parseDiskSaveText, serializeDiskSave } from "../src/game/save";
import { getBriarholdDepartureErrors } from "../src/game/chapter5";
import { getChapter5FullOutcome } from "../src/story/chapter5Aftermath";

const fixture = () => parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
const rescued = (): Chapter5SaveState => ({ ...buildChapter5SaveState(), started: true, node: "carriage", view: "carriage",
  briarhold: { ...buildChapter5SaveState().briarhold, entry: "culvert", innerDoorOpened: true },
  lioSeen: true, brackenDefeated: true, carriageStage: "rescued", milestoneAwarded: true });
const at = (s: Chapter5SaveState, node: Chapter5SaveState["node"]): Chapter5SaveState => ({ ...s, node, view: node });
function gather() {
  let s = progress.acceptOfficerSurrender(at(rescued(), "ledger"));
  s = freeLedgerClerk(s);
  s = progress.collectChapter5Evidence(s, "transfer-ledger");
  s = progress.collectChapter5Evidence(s, "genuine-office-instruction");
  s = progress.resolveChapter5Workshop(at(s, "workshop"), "surrendered");
  s = progress.collectChapter5Evidence(s, "false-seals");
  s = progress.collectChapter5Evidence(at(s, "crown"), "examiner-transfer-record");
  s = progress.openChapter5Cells(at(s, "cells"));
  s = progress.freeChapter5CellCaptive(s, "porter");
  return at(progress.freeChapter5CellCaptive(s, "warden"), "gathering");
}
function depart() {
  const companion = fixture().companion;
  return progress.departChapter5Briarhold(progress.reuniteChapter5Siblings(progress.hearChapter5Examiner(gather()), companion), companion);
}
test("legacy carriage checkpoints continue with unearned cleanup and cannot skip safe reunion", () => {
  const raw = rescued();
  for (const key of Object.keys(progress.buildChapter5Progress())) delete raw[key];
  let s = normalizeChapter5Save(raw);
  expect(s).toMatchObject({ evidence: [], porterFreed: false, wardenFreed: false, examinerLeadLearned: false, caseWallComplete: false });
  expect(progress.isChapter5Complete(s)).toBe(false);
  expect(getChapter5Edges(s)).toContainEqual(["crown", "cells"]);
  s = at(s, "gathering");
  expect(progress.hearChapter5Examiner(s)).toBe(s);
  expect(progress.departChapter5Briarhold(s, fixture().companion)).toBe(s);
  const gathered = gather();
  expect(progress.isChapter5CleanupReady(gathered)).toBe(true);
  expect(progress.reuniteChapter5Siblings(gathered, fixture().companion)).toBe(gathered);
  expect(depart().departed).toBe(true);
});
test("each prisoner and original matters independently to the departure gate", () => {
  const complete = progress.reuniteChapter5Siblings(progress.hearChapter5Examiner(gather()), fixture().companion);
  expect(getBriarholdDepartureErrors(progress.getChapter5Outcome(complete))).toEqual([]);
  for (const flag of ["clerkFreed", "porterFreed", "wardenFreed", "siblingsReunited", "examinerLeadLearned"] as const) {
    const missing = { ...complete, [flag]: false };
    expect(progress.departChapter5Briarhold(missing, fixture().companion)).toBe(missing);
  }
  for (const id of complete.evidence) {
    const missing = { ...complete, evidence: complete.evidence.filter(item => item !== id) };
    expect(progress.departChapter5Briarhold(missing, fixture().companion)).toBe(missing);
  }
});
test("originals require physical access, remain distinct inventory items, and rewards apply once", () => {
  const start = at(rescued(), "ledger");
  expect(progress.collectChapter5Evidence(start, "transfer-ledger")).toBe(start);
  expect(progress.collectChapter5Evidence(start, "false-seals")).toBe(start);
  const gathered = gather();
  const supplied = progress.packChapter5Supplies(gathered);
  const hero = fixture().player;
  const rewarded = progress.applyChapter5ProgressRewards(rescued(), supplied, hero);
  expect(rewarded.gold).toBe(hero.gold + 12);
  expect(rewarded.inventory.healing_fizzpop).toBe((hero.inventory.healing_fizzpop || 0) + 2);
  for (const item of [...Object.values(progress.CHAPTER_5_EVIDENCE_ITEMS), "true_seal_fragment", "briar_chain_link"]) expect(rewarded.inventory[item]).toBe(1);
  expect(progress.applyChapter5ProgressRewards(supplied, supplied, rewarded)).toEqual(rewarded);
  expect(progress.packChapter5Supplies(supplied)).toBe(supplied);
  expect(progress.collectChapter5Evidence(at(supplied, "ledger"), "transfer-ledger").evidence).toHaveLength(4);
});
test("conscious companion interventions are optional, once-only, and never grant feed access from cover", () => {
  const before: Chapter5SaveState = { ...rescued(), brackenDefeated: false, carriageStage: "secure-carriage", milestoneAwarded: false, node: "workshop", view: "workshop" };
  const rowan = fixture().companion;
  expect(progress.resolveChapter5Workshop(before, "contained", { ...rowan, hp: 0 })).toBe(before);
  expect(progress.resolveChapter5Workshop(before, "contained", { ...rowan, recruited: false })).toBe(before);
  const contained = progress.resolveChapter5Workshop(before, "contained", rowan);
  expect(contained).toMatchObject({ workshopResolved: true, workshopResolution: "contained", rowanContainmentUsed: true });
  expect(progress.resolveChapter5Workshop(contained, "contained", rowan)).toBe(contained);
  const moss = { ...rowan, id: "moss" as const };
  expect(progress.bypassChapter5Feed(before, moss)).toBe(before);
  expect(progress.bypassChapter5Feed(contained, { ...moss, hp: 0 })).toBe(contained);
  const bypassed = progress.bypassChapter5Feed(contained, moss);
  expect(bypassed.briarhold.workshopDisabled).toBe(true);
  expect(progress.bypassChapter5Feed(bypassed, moss)).toBe(bypassed);
  expect(normalizeChapter5Save(bypassed)).toEqual(bypassed);
});
test("woodsman warning gates both routes; a player may retreat from the hollow and keep all story", () => {
  let s = { ...depart(), node: "woodsman" as const, view: null };
  expect(moveChapter5(s, "fork").node).toBe("woodsman");
  s = progress.hearChapter5Woodsman(at(s, "woodsman"), fixture().companion) as typeof s;
  let route = moveChapter5(s, "fork");
  route = moveChapter5({ ...route, view: null }, "hollow");
  expect(moveChapter5(route, "hollowEdge").node).toBe("hollow");
  route = moveChapter5(route, "fork");
  route = moveChapter5({ ...route, view: null }, "detour");
  route = moveChapter5(route, "longTrail");
  route = moveChapter5(route, "eastRoad");
  expect(route).toMatchObject({ node: "eastRoad", view: "eastRoad", returnRoute: "safe-detour", tuskersDefeated: false });
  expect(moveChapter5({ ...route, view: null }, "townGate").node).toBe("eastRoad");
  route = progress.hearChapter5ReturnTalk(route, fixture().companion);
  const town = moveChapter5(route, "townGate");
  expect(town.returnedToBramblecross).toBe(true);
  expect(normalizeChapter5Save(town)).toEqual(town);
});
test("tusker battle and victory round-trip without changing station awareness or duplicating experience", () => {
  const s: Chapter5SaveState = { ...depart(), node: "hollow", view: null, woodsmanHeard: true, returnRoute: "tusker-hollow", pendingBattle: "tuskers" };
  const p = fixture(); p.chapter5 = s;
  expect(parseDiskSaveText(serializeDiskSave("Tusker retry", p)).payload.chapter5).toEqual(s);
  const won = finishChapter5Battle(s);
  expect(won.briarhold).toEqual(s.briarhold);
  const hero = progress.applyChapter5ProgressRewards(s, won, p.player);
  expect(hero.xp).toBe(p.player.xp + 8);
  expect(hero.gold).toBe(p.player.gold);
  expect(finishChapter5Battle(won)).toBe(won);
  expect(progress.applyChapter5ProgressRewards(won, won, hero)).toEqual(hero);
  expect(moveChapter5({ ...won, view: null }, "hollowEdge").node).toBe("hollowEdge");
});
test("public welcome, private evidence reading, and closing are separate persisted gates", () => {
  let s: Chapter5SaveState = { ...depart(), woodsmanHeard: true, returnRoute: "safe-detour", returnConversationHeard: true, returnedToBramblecross: true, node: "square", view: "square" };
  expect(progress.isChapter5Complete(s)).toBe(false);
  expect(progress.readChapter5CaseWall(at(s, "watchhouse"))).toMatchObject({ caseWallEvidenceRead: false });
  expect(moveChapter5({ ...s, view: null }, "watchhouse").node).toBe("square");
  s = progress.seeChapter5Homecoming(s, fixture().companion);
  s = at(s, "watchhouse");
  expect(progress.finishChapter5CaseWall(s, fixture().companion)).toBe(s);
  s = progress.readChapter5CaseWall(s);
  expect(progress.isChapter5Complete(s)).toBe(false);
  s = progress.finishChapter5CaseWall(s, fixture().companion);
  expect(progress.isChapter5Complete(s)).toBe(true);
  expect(normalizeChapter5Save(s)).toEqual(s);
  expect(s.feedback).toContain("He is still out there.");
  expect(s.feedback).toContain("So are we.");
  expect(progress.finishChapter5CaseWall(s, fixture().companion)).toBe(s);
});
test("contradictory aftermath saves reject instead of manufacturing rescues or completion", () => {
  for (const bad of [{ ...rescued(), evidence: ["false-seals"] }, { ...rescued(), evidence: ["fake"] },
    { ...rescued(), porterFreed: true }, { ...rescued(), departed: true }, { ...rescued(), caseWallComplete: true },
    { ...rescued(), woodsmanHeard: true }, { ...gather(), evidence: ["false-seals", "false-seals"] },
    { ...depart(), returnRoute: "safe-detour" }, { ...depart(), returnedToBramblecross: true }]) {
    expect(() => normalizeChapter5Save(bad)).toThrow(/Chapter 5/);
  }
  const companion = fixture().companion;
  expect(getChapter5FullOutcome("reunion", { ...companion, hp: 0 })).not.toContain("Rowan");
});
