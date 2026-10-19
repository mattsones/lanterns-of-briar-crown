import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { abandonLedgerDistraction, buildChapter5SaveState, normalizeChapter5Save, buildChapter5BattleEnemies, chapter5MilestoneXp, distractLedgerOfficer, enterChapter5Culvert, freeLedgerClerk, leaveChapter5GuideLampClosed, restoreChapter5GuideLamp, secureLedgerOfficer, moveChapter5, rememberChapter5Scene, resolveChapter5HubPassage, transmitChapter5Signal, tryChapter5CulvertGrate } from "../src/game/chapter5Runtime";
import { enterBriarhold, getBriarholdBossProfile, getBriarholdInnerPostGuards } from "../src/game/chapter5";
import { parseDiskSaveText, serializeDiskSave } from "../src/game/save";
import type { BriarholdAlert } from "../src/story/chapter5";
import type { SkillCheckResult } from "../src/game/types";
import { getChapter5Landmark } from "../src/story/chapter5Knowledge";
import { getChapter5SceneParagraphs } from "../src/story/chapter5Narrative";

const payload = () => parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
const officerCheck = (success: boolean): SkillCheckResult => ({ stat: "Precision", dc: 12,
  roll: success ? 16 : 1, bonus: 2, total: success ? 18 : 3, success,
  label: `Precision Check: ${success ? 16 : 1} + 2 = ${success ? 18 : 3} vs 12` });

test("opening the guide lamp exposes the party to guards at the post, preserves personnel, and cannot repeat", () => {
  for (const alert of ["quiet", "suspicious", "alerted"] as const) for (const removed of ["none", "silent", "open"] as const) {
    const s = { ...buildChapter5SaveState(), started: true, node: "lanterns" as const, view: "lanterns" as const,
      goldChannelUncovered: true, briarhold: { ...enterBriarhold(buildChapter5SaveState().briarhold, "culvert"), alert, investigatorRemoved: removed } };
    const before = structuredClone(s);
    expect(getBriarholdInnerPostGuards(s.briarhold)).toBe(removed === "none" ? 2 : 1);
    const lit = restoreChapter5GuideLamp(s);
    expect(lit.briarhold).toEqual({ ...s.briarhold, lanternsRestored: true, alert: "alerted" });
    expect(lit.feedback).toContain("At the lamps!");
    expect(lit.pendingBattle).toBeNull();
    expect(getBriarholdBossProfile(lit.briarhold)).toMatchObject({ falseOrderPenalty: 0, enemyIds: ["bracken_voss", "thornroot_sentry", ...Array(removed === "silent" ? 1 : 2).fill("thornseal_guard")] });
    expect(restoreChapter5GuideLamp(lit)).toBe(lit);
    const p = payload(); p.chapter5 = lit;
    expect(parseDiskSaveText(serializeDiskSave("Lit and seen", p)).payload.chapter5.briarhold).toEqual(lit.briarhold);
    expect(s).toEqual(before);
    for (const blocked of [{ goldChannelUncovered: false }, { node: "hub" as const }, { view: null }, { pendingBattle: "investigator" as const }]) {
      const wrongPhase = { ...s, ...blocked };
      expect(restoreChapter5GuideLamp(wrongPhase)).toBe(wrongPhase);
    }
  }
});

test("leaving the lamp closed defers the choice; diversion, defeated posts, and returning guards respect its light", () => {
  const s = { ...buildChapter5SaveState(), started: true, node: "lanterns" as const, view: "lanterns" as const,
    goldChannelUncovered: true, briarhold: enterBriarhold(buildChapter5SaveState().briarhold, "culvert") };
  const dark = leaveChapter5GuideLampClosed(s);
  expect(dark).toMatchObject({ view: null, goldChannelUncovered: true, briarhold: s.briarhold });
  const diverted = transmitChapter5Signal({ ...dark, view: "lanterns", panes: ["red", "amber", "blue"] });
  expect(getBriarholdInnerPostGuards(diverted.briarhold)).toBe(0);
  const lit = restoreChapter5GuideLamp(diverted);
  expect(lit.briarhold).toEqual({ ...diverted.briarhold, lanternsRestored: true });
  expect(lit.briarhold.alert).toBe("quiet");
  for (const panes of [["green", "green", "blue"], ["red", "red", "red"]] as const) {
    const returned = transmitChapter5Signal({ ...lit, panes: [...panes] });
    expect(returned).toMatchObject({ view: "lanterns", briarhold: { alert: "alerted", lanternsRestored: true,
      guardsDistracted: false, investigatorPending: false, investigatorRemoved: "none" } });
    expect(returned.feedback).toContain("come");
    expect(returned.feedback).toContain("At the lamps!");
  }
  const defeated = restoreChapter5GuideLamp({ ...s, briarhold: { ...s.briarhold, doorDetailDefeated: true, alert: "alerted" } });
  expect(defeated.briarhold.alert).toBe("alerted");
  expect(defeated.feedback).not.toContain("At the lamps!");
  const afterBoss = restoreChapter5GuideLamp({ ...s, brackenDefeated: true });
  expect(afterBoss.briarhold.alert).toBe("quiet");
  expect(afterBoss.feedback).not.toContain("At the lamps!");
  // Existing lit checkpoints retain their earned alert; loading creates no sighting.
  expect(normalizeChapter5Save({ ...s, briarhold: { ...s.briarhold, lanternsRestored: true } }).briarhold.alert).toBe("quiet");
});

test("room knowledge follows observed landmarks, survives saves, and respects legacy earned facts", () => {
  const s = { ...buildChapter5SaveState(), started: true, node: "hub" as const, view: "hub" as const,
    briarhold: enterBriarhold(buildChapter5SaveState().briarhold, "culvert") };
  const survey = getChapter5SceneParagraphs(s).join(" ");
  expect(survey).toContain("office of some kind");
  expect(survey).toContain("turning out of sight");
  expect(survey).not.toMatch(/records room|signal platform|Crown Table|Thornseal Workshop|Bracken/);
  expect(getChapter5Landmark(s, "ledger")?.label).toBe("Upper workroom");
  expect(getChapter5Landmark(s, "lanterns")?.label).toBe("Narrow stair");
  const room = moveChapter5({ ...s, view: null }, "ledger");
  expect(getChapter5Landmark(room, "ledger")?.label).toBe("Records room");
  const p = payload(); p.chapter5 = { ...s, seenScenes: room.seenScenes };
  const restored = parseDiskSaveText(serializeDiskSave("Observed records room", p)).payload.chapter5;
  expect(getChapter5Landmark(restored, "ledger")?.label).toBe("Records room");
  expect(getChapter5SceneParagraphs(restored).join(" ")).toContain("records room");
  expect(getChapter5Landmark(restored, "lanterns")?.label).toBe("Narrow stair");
  const platform = moveChapter5({ ...restored, node: "workshop", view: null }, "lanterns");
  expect(getChapter5SceneParagraphs({ ...s, seenScenes: platform.seenScenes }).join(" ")).toContain("signal platform");
  const old = normalizeChapter5Save({ ...s, ledgerResolved: true, workshopResolved: true, briarhold: { ...s.briarhold, lanternsRestored: true } });
  for (const [node, label] of [["ledger", "Records room"], ["workshop", "Seal workshop"], ["lanterns", "Signal platform"]] as const) {
    expect(getChapter5Landmark(old, node)?.label).toBe(label);
  }
  expect(getChapter5SceneParagraphs({ ...s, briarhold: { ...s.briarhold, innerDoorOpened: true } }).join(" ")).not.toContain("inspection grille");
  const oldArrival = "You move around the end of the landing rail and settle behind the hub's stone pier. The work sounds divide here, letting you pick out the separate passages while remaining beneath the lamps.";
  const updated = normalizeChapter5Save({ ...s, feedback: oldArrival });
  expect(updated.feedback).toContain("deep shadow behind it");
  expect(updated.briarhold).toEqual(s.briarhold);
});

test("culvert access requires a saved successful Might check; failure blocks only that entrance", () => {
  const start = { ...buildChapter5SaveState(), started: true, node: "culvert" as const, view: "culvert" as const };
  expect(enterChapter5Culvert(start)).toBe(start);
  for (const success of [true, false]) {
    const roll = success ? 10 : 9;
    const check: SkillCheckResult = { stat: "Might", dc: 12, roll, bonus: 2, total: roll + 2, success,
      label: `Might Check: ${roll} + 2 = ${roll + 2} vs 12` };
    const attempted = tryChapter5CulvertGrate(start, check);
    expect(attempted).toMatchObject({ node: "culvert", view: "culvert", checks: { culvert: check } });
    expect(attempted.briarhold).toEqual(start.briarhold);
    expect(tryChapter5CulvertGrate(attempted, { ...check, success: !success })).toBe(attempted);
    const p = payload(); p.chapter5 = attempted;
    const restored = parseDiskSaveText(serializeDiskSave("Culvert attempt", p)).payload.chapter5;
    expect(restored.checks.culvert).toEqual(check);
    if (success) {
      const entered = enterChapter5Culvert(restored);
      expect(entered).toMatchObject({ node: "landing", view: "landing", briarhold: { entry: "culvert", alert: "quiet" } });
      expect(enterChapter5Culvert(entered)).toBe(entered);
    } else {
      expect(enterChapter5Culvert(restored)).toBe(restored);
      const runoff = moveChapter5({ ...restored, view: null }, "runoff");
      const ridge = moveChapter5({ ...runoff, view: null }, "ridge");
      expect(moveChapter5({ ...ridge, view: null }, "gate").node).toBe("gate");
    }
    expect(tryChapter5CulvertGrate({ ...start, node: "runoff" }, check).checks.culvert).toBeUndefined();
    expect(tryChapter5CulvertGrate({ ...start, view: null }, check).checks.culvert).toBeUndefined();
  }
});

test("culvert saves reject contradictory checks while preserving legacy parties already inside", () => {
  const start = { ...buildChapter5SaveState(), started: true, node: "culvert" as const, view: "culvert" as const };
  const check = { ...officerCheck(false), stat: "Might" };
  for (const bad of [{ started: false, checks: { culvert: check } },
    { checks: { culvert: { ...check, stat: "Heart" } } }, { checks: { culvert: { ...check, dc: 13 } } },
    { checks: { culvert: check }, briarhold: enterBriarhold(start.briarhold, "culvert") }]) {
    expect(() => normalizeChapter5Save({ ...start, ...bad })).toThrow(/Chapter 5/);
  }
  expect(normalizeChapter5Save({ ...start, node: "landing", view: "landing",
    briarhold: enterBriarhold(start.briarhold, "culvert") }).checks.culvert).toBeUndefined();
});

test("new scenes open on movement, unchanged revisits skip, and local changes reopen only affected rooms", () => {
  let s = { ...buildChapter5SaveState(), started: true, node: "hub" as const, view: null,
    briarhold: enterBriarhold(buildChapter5SaveState().briarhold, "culvert"), ledgerResolved: true, hubPassages: 3 };
  let room = moveChapter5(s, "ledger");
  expect(room.view).toBe("ledger");
  const seen = room.seenScenes.ledger;
  let hub = moveChapter5({ ...room, view: null }, "hub");
  room = moveChapter5({ ...hub, view: null }, "ledger");
  expect(room).toMatchObject({ view: null, feedback: "" });
  room = { ...room, briarhold: { ...room.briarhold, lanternsRestored: true } };
  hub = moveChapter5(room, "hub");
  room = moveChapter5({ ...hub, view: null }, "ledger");
  expect(room.view).toBeNull(); // An unrelated lamp does not change the desk.
  hub = moveChapter5(room, "hub");
  hub.briarhold = { ...hub.briarhold, shimFound: true };
  room = moveChapter5({ ...hub, view: null }, "ledger");
  expect(room.view).toBe("ledger"); // A useful tool changes a still-locked drawer opportunity.
  expect(room.seenScenes.ledger).not.toBe(seen);
  const afterOpening = rememberChapter5Scene({ ...room, briarhold: { ...room.briarhold, spareKeyFound: true } });
  hub = moveChapter5({ ...afterOpening, view: null }, "hub");
  expect(moveChapter5({ ...hub, view: null }, "ledger").view).toBeNull();

  const lantern = moveChapter5({ ...s, node: "workshop" }, "lanterns");
  const withoutChart = moveChapter5({ ...lantern, view: null }, "workshop");
  expect(moveChapter5({ ...withoutChart, view: null }, "lanterns").view).toBeNull();
  expect(moveChapter5({ ...withoutChart, view: null, chartRead: true }, "lanterns").view).toBe("lanterns");

  const moss = { ...payload().companion, id: "moss" as const, hp: 0 };
  const bench = moveChapter5({ ...s, workshopResolved: true, workshopResolution: "fought" }, "workshop", moss);
  const out = moveChapter5({ ...bench, view: null }, "hub", moss);
  expect(moveChapter5({ ...out, view: null }, "workshop", moss).view).toBeNull();
  expect(moveChapter5({ ...out, view: null }, "workshop", { ...moss, hp: moss.maxHp }).view).toBe("workshop");
});

test("scene history survives disk saves, defaults safely for older saves, and rejects malformed history", () => {
  const p = payload();
  p.chapter5 = moveChapter5({ ...buildChapter5SaveState(), started: true, view: null }, "ridge");
  const history = p.chapter5.seenScenes;
  expect(history.ridge).toMatch(/^scene-v1:[0-9a-f]{8}$/);
  expect(parseDiskSaveText(serializeDiskSave("Seen ridge", p)).payload.chapter5.seenScenes).toEqual(history);
  const { seenScenes, ...legacy } = p.chapter5;
  expect(normalizeChapter5Save(legacy).seenScenes).toEqual({});
  for (const bad of [null, [], "ridge", { ridge: true }, { ridge: "seen" }, { unknown: history.ridge }]) {
    expect(() => normalizeChapter5Save({ ...p.chapter5, seenScenes: bad })).toThrow(/Chapter 5/);
  }
});

test("hallway encounters are bounded, save their pending phase, and preserve the actual alert and guard roster", () => {
  const start = { ...buildChapter5SaveState(), started: true, node: "ledger" as const, view: null, hubPassages: 1,
    briarhold: enterBriarhold(buildChapter5SaveState().briarhold, "culvert") };
  const lamp = moveChapter5(start, "hub");
  expect(lamp).toMatchObject({ hubPassages: 2, hubInterlude: "lamp", view: "hub" });
  expect(normalizeChapter5Save({ ...lamp, view: null }).view).toBe("hub");
  expect(resolveChapter5HubPassage(lamp, "cross")).toBe(lamp);
  expect(moveChapter5({ ...lamp, view: null }, "ledger")).toMatchObject({ node: "hub", hubInterlude: "lamp" });
  const waited = resolveChapter5HubPassage(lamp, "wait");
  const corridor = moveChapter5({ ...waited, view: null }, "ledger");
  const load = moveChapter5({ ...corridor, view: null }, "hub");
  expect(load.hubInterlude).toBe("load");
  for (const response of ["wait", "cross"] as const) {
    const done = rememberChapter5Scene(resolveChapter5HubPassage(load, response));
    expect(done.briarhold).toEqual(start.briarhold);
    expect(resolveChapter5HubPassage(done, response)).toBe(done);
    const out = moveChapter5({ ...done, view: null }, "ledger");
    expect(moveChapter5({ ...out, view: null }, "hub")).toMatchObject({ view: null, hubPassages: 3, hubInterlude: null });
  }
  expect(moveChapter5({ ...start, briarhold: { ...start.briarhold, alert: "alerted" } }, "hub").hubInterlude).toBeNull();
  for (const bad of [{ hubPassages: 4 }, { hubPassages: -1 }, { hubInterlude: "load" }, { node: "ledger" }, { pendingBattle: "officer" }]) {
    expect(() => normalizeChapter5Save({ ...lamp, ...bad })).toThrow(/Chapter 5/);
  }
});
test("old save starts unearned; optional partial state retains signal, alert, personnel and resources on disk", () => {
  expect(payload().chapter5).toMatchObject({ started: false, recoveryUsed: false, carriageStage: "secure-carriage" });
  const p = payload();
  p.chapter5 = normalizeChapter5Save({ version: 1, started: true, node: "lanterns", panes: ["red", null, "amber"],
    briarhold: { entry: "culvert", alert: "suspicious", invalidSignals: 1, investigatorPending: true } });
  const loaded = parseDiskSaveText(serializeDiskSave("Partial signal", p)).payload;
  expect(loaded.chapter5).toMatchObject({ view: "investigator", panes: ["red", null, "amber"],
    briarhold: { alert: "suspicious", invalidSignals: 1, investigatorPending: true, spareKeyFound: false } });
  expect(loaded.player).toEqual(p.player);
});
test("invalid types, versions and fabricated late-phase partial state are rejected", () => {
  for (const bad of [null, { version: 2 }, { ...buildChapter5SaveState(), recoveryUsed: "yes" },
    { ...buildChapter5SaveState(), carriageStage: "rescued" }, { ...buildChapter5SaveState(), panes: ["gold", null, null] },
    { ...buildChapter5SaveState(), briarhold: { ...buildChapter5SaveState().briarhold, alert: "quiet-again" } }]) {
    expect(() => normalizeChapter5Save(bad)).toThrow(/Chapter 5/);
    expect(() => parseDiskSaveText(JSON.stringify({ ...payload(), chapter5: bad }))).toThrow(/Chapter 5/);
  }
});
test("frozen boss profile changes False Order alone and milestone keeps earned XP at every level", () => {
  const s = buildChapter5SaveState();
  s.briarhold = { ...enterBriarhold(s.briarhold, "culvert"), lanternsRestored: true };
  s.pendingBattle = "boss";
  s.bossProfile = getBriarholdBossProfile(s.briarhold);
  const enemies = buildChapter5BattleEnemies(s);
  expect(enemies[0].effectA.heroAttackPenalty).toBe(0);
  expect(enemies[0].attackA).toEqual({ count: 2, sides: 6, bonus: 3 });
  expect(enemies[1].effectA.heroAttackPenalty).toBe(2);
  const hero = payload().player;
  expect(chapter5MilestoneXp(hero)).toBe(198);
  expect(chapter5MilestoneXp({ ...hero, level: 5 })).toBe(33);
  expect(chapter5MilestoneXp({ ...hero, level: 6 })).toBe(33);
});

test("ledger access and clerk release require securing the officer; an abandoned distraction returns him", () => {
  const start = { ...buildChapter5SaveState(), started: true, node: "ledger" as const, view: "ledger" as const,
    briarhold: enterBriarhold(buildChapter5SaveState().briarhold, "culvert") };
  expect(secureLedgerOfficer(start, officerCheck(true))).toBe(start);
  expect(freeLedgerClerk(start)).toBe(start);
  const distraction = distractLedgerOfficer(start);
  expect(freeLedgerClerk(distraction)).toBe(distraction);
  const abandoned = abandonLedgerDistraction(distraction);
  expect(abandoned).toMatchObject({ ledgerResolved: false, ledgerOfficerDistracted: false, clerkFreed: false, briarhold: { alert: "suspicious" } });
  const alreadyAlerted = abandonLedgerDistraction({ ...distraction, briarhold: { ...distraction.briarhold, alert: "alerted" } });
  expect(alreadyAlerted.briarhold.alert).toBe("alerted");
  const secured = secureLedgerOfficer(distraction, officerCheck(true));
  const freed = freeLedgerClerk(secured);
  expect(abandonLedgerDistraction(freed)).toBe(freed);
  expect(freeLedgerClerk(freed)).toBe(freed);
  expect(freed).toMatchObject({ ledgerResolved: true, ledgerOfficerDistracted: false, clerkFreed: true, briarhold: { spareKeyFound: false, shimFound: false, alert: "quiet" } });
  const p = payload(); p.chapter5 = freed;
  expect(parseDiskSaveText(serializeDiskSave("Freed clerk", p)).payload.chapter5).toEqual(freed);
});

test("old secured-desk saves preserve access without inventing a clerk rescue; impossible clerk phases reject", () => {
  const legacy = normalizeChapter5Save({ version: 1, started: true, node: "ledger", view: "ledger",
    ledgerResolved: true, briarhold: { entry: "culvert" } });
  expect(legacy).toMatchObject({ ledgerResolved: true, ledgerOfficerDistracted: false, clerkFreed: false });
  expect(legacy.checks.ledgerOfficer).toBeUndefined();
  expect(normalizeChapter5Save({ version: 1, started: true, node: "landing", view: "hub", briarhold: { entry: "culvert" } }).view).toBe("landing");
  for (const extra of [{ clerkFreed: true, ledgerResolved: false }, { ledgerOfficerDistracted: true }, { clerkFreed: "yes" },
    { ledgerResolved: false, checks: { ledgerOfficer: officerCheck(true) } },
    { checks: { ledgerOfficer: officerCheck(false) } },
    { checks: { ledgerOfficer: { ...officerCheck(true), total: 99 } } }]) {
    expect(() => normalizeChapter5Save({ ...legacy, ...extra })).toThrow(/Chapter 5/);
  }
});

test("officer ambush saves its one roll, escalates a miss monotonically, and keeps desk/captive access", () => {
  const alerts: BriarholdAlert[] = ["quiet", "suspicious", "alerted"];
  for (const alert of alerts) for (const success of [true, false]) {
    const start = { ...buildChapter5SaveState(), started: true, node: "ledger" as const, view: "ledger" as const,
      briarhold: { ...enterBriarhold(buildChapter5SaveState().briarhold, "culvert"), alert, guardsDistracted: alert !== "alerted" } };
    const check = officerCheck(success);
    const secured = secureLedgerOfficer(distractLedgerOfficer(start), check);
    const expectedAlert = success || alert === "alerted" ? alert : alert === "quiet" ? "suspicious" : "alerted";
    expect(secured).toMatchObject({ ledgerResolved: true, ledgerOfficerDistracted: false, clerkFreed: false,
      checks: { ledgerOfficer: check }, briarhold: { alert: expectedAlert, spareKeyFound: false } });
    expect(secured.briarhold.guardsDistracted).toBe(expectedAlert !== "alerted");
    expect(secureLedgerOfficer(secured, officerCheck(!success))).toBe(secured);
    expect(abandonLedgerDistraction(secured)).toBe(secured);
    const freed = freeLedgerClerk(secured);
    expect(freed.clerkFreed).toBe(true);
    const p = payload(); p.chapter5 = freed;
    expect(parseDiskSaveText(serializeDiskSave("Officer check", p)).payload.chapter5).toEqual(freed);
  }
});
