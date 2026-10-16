import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { abandonLedgerDistraction, buildChapter5SaveState, normalizeChapter5Save, buildChapter5BattleEnemies, chapter5MilestoneXp, distractLedgerOfficer, freeLedgerClerk, secureLedgerOfficer } from "../src/game/chapter5Runtime";
import { enterBriarhold, getBriarholdBossProfile } from "../src/game/chapter5";
import { parseDiskSaveText, serializeDiskSave } from "../src/game/save";
import type { BriarholdAlert } from "../src/story/chapter5";
import type { SkillCheckResult } from "../src/game/types";

const payload = () => parseDiskSaveText(readFileSync("public/saves/chapter-4-complete.json", "utf8")).payload;
const officerCheck = (success: boolean): SkillCheckResult => ({ stat: "Precision", dc: 12,
  roll: success ? 16 : 1, bonus: 2, total: success ? 18 : 3, success,
  label: `Precision Check: ${success ? 16 : 1} + 2 = ${success ? 18 : 3} vs 12` });
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
