import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  advanceCarriageRescue, buildBriarholdState, canOpenBriarholdInnerDoor,
  classifyLanternSignal, defeatBriarholdDoorDetail, enterBriarhold,
  getBriarholdBossProfile, getBriarholdDepartureErrors, getChapter5CompletionErrors,
  getChapter5EntryErrors, openBriarholdDrawer, raiseBriarholdAlert,
  resolveInvestigatingGuard, transmitLanternSignal, validateChapter5Contract,
  validateChapter5ReadyPayload, type Chapter5Outcome,
} from "../src/game/chapter5";
import { getChapterProgress } from "../src/game/chapterProgress";
import { buildDefaultCompanion } from "../src/game/state";
import { parseDiskSaveText, serializeDiskSave } from "../src/game/save";
import { CAPTIVE_LANTERN_PANES, CAPTIVE_LANTERN_SIGNALS, CHAPTER_5_CONTRACT, type BriarholdAlert } from "../src/story/chapter5";

const fixtureText = readFileSync(new URL("../public/saves/chapter-4-complete.json", import.meta.url), "utf8");
const ready = () => parseDiskSaveText(fixtureText).payload;
const front = CAPTIVE_LANTERN_SIGNALS[0].panes;
const recall = CAPTIVE_LANTERN_SIGNALS[1].panes;
const invalid = ["red", "red", "red"] as const;
const entered = () => enterBriarhold(buildBriarholdState(), "culvert");
const outcome = (): Chapter5Outcome => ({
  brackenDefeated: true, brackenEscaped: true, lioSeenResisting: true,
  carriageStage: "rescued", rescued: ["lio", "cellar-porter", "westroot-clerk", "road-warden"],
  evidence: ["transfer-ledger", "genuine-office-instruction", "false-seals", "examiner-transfer-record"],
  siblingsReunited: true, examinerLeadLearned: true, returnRoute: "safe-detour",
  tuskersDefeated: false, returnedToBramblecross: true, homecomingSeen: true, caseWallComplete: true,
});

test("Chapter 5 contract resolves live entry flags, evidence items, enemies, and fallbacks", () => {
  expect(validateChapter5Contract()).toEqual([]);
  expect(CHAPTER_5_CONTRACT.guestRules).toEqual({ maraFights: false, lioFights: false, guestsCanBeTargeted: false });
});

test("Chapter 4 fixture is a loadable Chapter 5 boundary with the actual ledger position", () => {
  const payload = ready();
  expect(validateChapter5ReadyPayload(payload)).toEqual([]);
  expect(getChapterProgress(payload.flags)).toMatchObject({ currentChapterId: 5, completedChapterIds: [1, 2, 3, 4] });
  const roundTrip = parseDiskSaveText(serializeDiskSave("Chapter 5 boundary", payload)).payload;
  expect(validateChapter5ReadyPayload(roundTrip)).toEqual([]);
  expect(roundTrip.player).toEqual(payload.player);
  expect(roundTrip.companion).toEqual(payload.companion);
});

test("readiness rejects each missing required fact, missing knot, started chapter, and wrong location", () => {
  for (const flag of CHAPTER_5_CONTRACT.entry.requiredFlags) {
    const payload = ready();
    payload.flags[flag] = false;
    expect(validateChapter5ReadyPayload(payload), flag).not.toEqual([]);
  }
  for (const mutate of [
    (p: ReturnType<typeof ready>) => { delete p.player.inventory.lios_courier_knot; },
    (p: ReturnType<typeof ready>) => { p.flags.chapterFiveStarted = true; },
    (p: ReturnType<typeof ready>) => { p.position.x = 0; },
    (p: ReturnType<typeof ready>) => { p.player.equipment.weapon = "missing-item"; },
  ]) {
    const payload = ready(); mutate(payload);
    expect(validateChapter5ReadyPayload(payload)).not.toEqual([]);
  }
});

test("optional Chapter 3 and 4 work and a missing or downed companion cannot block entry", () => {
  const payload = ready();
  payload.flags.rootbreadPromiseKept = false;
  payload.flags.lioKnotFound = false;
  delete payload.player.inventory.rootbread_charm;
  payload.flags.captivePorterHelped = false;
  payload.flags.gatewrightWeaponPurchased = false;
  payload.flags.underway811CacheFound = false;
  payload.flags.underway817SignalRigRead = false;
  payload.companion.hp = 0;
  expect(validateChapter5ReadyPayload(payload)).toEqual([]);
  payload.companion = buildDefaultCompanion();
  expect(validateChapter5ReadyPayload(payload)).toEqual([]);
  expect(getChapter5EntryErrors(payload.player, payload.flags)).toEqual([]);
});

test("entry is reliable or fails forward as advertised and cannot be rerolled by re-entry", () => {
  expect(enterBriarhold(buildBriarholdState(), "culvert").alert).toBe("quiet");
  expect(enterBriarhold(buildBriarholdState(), "receiving-gate", true).alert).toBe("quiet");
  expect(enterBriarhold(buildBriarholdState(), "receiving-gate", false).alert).toBe("suspicious");
  const assault = enterBriarhold(buildBriarholdState(), "assault");
  expect(assault.alert).toBe("alerted");
  expect(enterBriarhold(assault, "culvert")).toBe(assault);
  for (const current of ["quiet", "suspicious", "alerted"] as BriarholdAlert[]) {
    expect(raiseBriarholdAlert(current, "quiet")).toBe(current);
    expect(raiseBriarholdAlert(current, "alerted")).toBe("alerted");
  }
});

test("all 64 lantern arrangements have exactly four distinct operational codes", () => {
  const counts: Record<string, number> = {};
  for (const a of CAPTIVE_LANTERN_PANES) for (const b of CAPTIVE_LANTERN_PANES) for (const c of CAPTIVE_LANTERN_PANES) {
    const id = classifyLanternSignal([a.id, b.id, c.id]);
    counts[id] = (counts[id] || 0) + 1;
  }
  expect(counts).toEqual({ "front-gate-alert": 1, "command-center-recall": 1, "receiving-clear": 1, "hold-deliveries": 1, meaningless: 60 });
  expect(transmitLanternSignal(buildBriarholdState(), front).transmitted).toBe(false);
});

test("quiet entry requires the workshop tool, ledger key, and signal in any wing visitation order", () => {
  const orders = [["tool", "key", "signal"], ["tool", "signal", "key"], ["key", "tool", "signal"], ["key", "signal", "tool"], ["signal", "tool", "key"], ["signal", "key", "tool"]];
  for (const order of orders) {
    let state = entered();
    for (const visit of order) {
      if (visit === "tool") state = { ...state, shimFound: true };
      if (visit === "key") state = openBriarholdDrawer(state);
      if (visit === "signal") state = transmitLanternSignal(state, front).state;
    }
    // An early locked-drawer visit remains resolvable after the workshop.
    state = openBriarholdDrawer(state);
    expect(canOpenBriarholdInnerDoor(state), order.join(" / ")).toBe(true);
    expect(state.alert).toBe("quiet");
  }
  let state = transmitLanternSignal(entered(), front).state;
  expect(canOpenBriarholdInnerDoor(state)).toBe(false);
  expect(openBriarholdDrawer(state).spareKeyFound).toBe(false);
  state = openBriarholdDrawer({ ...entered(), shimFound: true });
  expect(canOpenBriarholdInnerDoor(state)).toBe(false);
});

test("first meaningless signal offers exactly one guard response and no free key", () => {
  const pending = transmitLanternSignal(entered(), invalid).state;
  expect(pending).toMatchObject({ alert: "suspicious", invalidSignals: 1, investigatorPending: true });
  expect(transmitLanternSignal(pending, front).transmitted).toBe(false);
  expect(openBriarholdDrawer({ ...pending, shimFound: true }).spareKeyFound).toBe(false);
  for (const response of ["hide", "assault", "silent-ambush"] as const) {
    for (const success of [false, true]) {
      const result = resolveInvestigatingGuard(pending, response, success);
      expect(result.alert).toBe(response !== "assault" && success ? "suspicious" : "alerted");
      expect(result.spareKeyFound).toBe(false);
      expect(result.investigatorPending).toBe(false);
      expect(resolveInvestigatingGuard(result, response, success)).toBe(result);
    }
  }
});

test("a second invalid signal always alerts and cannot farm lone guards", () => {
  const pending = transmitLanternSignal(entered(), invalid).state;
  const hidden = resolveInvestigatingGuard(pending, "hide", true);
  const second = transmitLanternSignal(hidden, invalid).state;
  expect(second).toMatchObject({ alert: "alerted", invalidSignals: 2, investigatorPending: false });
  expect(resolveInvestigatingGuard(second, "silent-ambush", true)).toBe(second);
  const repeated = transmitLanternSignal(second, invalid).state;
  expect(repeated.invalidSignals).toBe(2);
  expect(repeated.investigatorPending).toBe(false);
});

test("valid recall is dangerous, and alerted guards ignore the front-gate diversion", () => {
  const state = transmitLanternSignal(entered(), recall).state;
  const ignored = transmitLanternSignal({ ...state, spareKeyFound: true }, front).state;
  expect(ignored.alert).toBe("alerted");
  expect(ignored.invalidSignals).toBe(0);
  expect(ignored.guardsDistracted).toBe(false);
  expect(canOpenBriarholdInnerDoor(ignored)).toBe(false);
  expect(canOpenBriarholdInnerDoor(defeatBriarholdDoorDetail(ignored))).toBe(true);
  const openDoor = { ...ignored, innerDoorOpened: true };
  expect(canOpenBriarholdInnerDoor(openDoor)).toBe(true);
});

test("every alert state retains a direct route and the full boss support baseline", () => {
  for (const [alert, total] of [["quiet", 2], ["suspicious", 3], ["alerted", 4]] as const) {
    const state = { ...entered(), alert };
    const profile = getBriarholdBossProfile(state);
    expect(profile.enemyIds).toHaveLength(total);
    expect(profile.enemyIds).toContain("thornroot_sentry");
    const fought = defeatBriarholdDoorDetail(state);
    expect(canOpenBriarholdInnerDoor(fought)).toBe(true);
    expect(getBriarholdBossProfile(fought).enemyIds).toHaveLength(4);
  }
});

test("silent removal reduces boss guards; workshop and gold light still help an alerted party", () => {
  const pending = transmitLanternSignal(entered(), invalid).state;
  const silent = resolveInvestigatingGuard(pending, "silent-ambush", true);
  expect(getBriarholdBossProfile(silent).enemyIds).toEqual(["bracken_voss", "thornroot_sentry"]);
  const laterAlert = { ...silent, alert: "alerted" as const, lanternsRestored: true, workshopDisabled: true };
  expect(getBriarholdBossProfile(laterAlert)).toEqual({ enemyIds: ["bracken_voss", "thornroot_sentry", "thornseal_guard"], falseOrderPenalty: 0, sentryRepairAvailable: false });
  const openFight = resolveInvestigatingGuard(pending, "assault");
  expect(getBriarholdBossProfile(openFight).enemyIds).toHaveLength(4);
  expect(getBriarholdBossProfile(openFight).falseOrderPenalty).toBe(2);
});

test("carriage rescue is gated by victory, untimed, and succeeds even after an unlit failed check", () => {
  expect(advanceCarriageRescue("secure-carriage", false, false).stage).toBe("secure-carriage");
  expect(advanceCarriageRescue("secure-carriage", true, false).stage).toBe("set-brake");
  expect(advanceCarriageRescue("set-brake", true, false)).toMatchObject({ stage: "set-brake", needsCheck: true });
  expect(advanceCarriageRescue("set-brake", true, false, false)).toEqual({ stage: "free-lio", needsCheck: false, injuryRisk: true });
  expect(advanceCarriageRescue("set-brake", true, true)).toEqual({ stage: "free-lio", needsCheck: false, injuryRisk: false });
  expect(advanceCarriageRescue("free-lio", true, false).stage).toBe("rescued");
  expect(advanceCarriageRescue("rescued", true, false)).toEqual({ stage: "rescued", needsCheck: false, injuryRisk: false });
});

test("every surviving captive and every original evidence category is required before departure", () => {
  expect(getBriarholdDepartureErrors(outcome())).toEqual([]);
  for (const captive of CHAPTER_5_CONTRACT.requiredRescues) {
    const missing = outcome(); missing.rescued = missing.rescued.filter(id => id !== captive);
    expect(getBriarholdDepartureErrors(missing).join(" ")).toContain(captive);
  }
  for (const evidence of CHAPTER_5_CONTRACT.requiredEvidence) {
    const missing = outcome(); missing.evidence = missing.evidence.filter(id => id !== evidence);
    expect(getBriarholdDepartureErrors(missing).join(" ")).toContain(evidence);
  }
  expect(getBriarholdDepartureErrors({ ...outcome(), lioSeenResisting: false })).not.toEqual([]);
  expect(getBriarholdDepartureErrors({ ...outcome(), carriageStage: "free-lio" })).not.toEqual([]);
});

test("completion includes the homecoming and case wall; tusker combat remains optional", () => {
  expect(getChapter5CompletionErrors(outcome())).toEqual([]);
  for (const flag of ["brackenDefeated", "brackenEscaped", "siblingsReunited", "examinerLeadLearned", "returnedToBramblecross", "homecomingSeen", "caseWallComplete"] as const) {
    expect(getChapter5CompletionErrors({ ...outcome(), [flag]: false }), flag).not.toEqual([]);
  }
  expect(getChapter5CompletionErrors({ ...outcome(), returnRoute: "tusker-hollow" })).not.toEqual([]);
  expect(getChapter5CompletionErrors({ ...outcome(), returnRoute: "tusker-hollow", tuskersDefeated: true })).toEqual([]);
});
