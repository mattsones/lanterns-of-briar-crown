import { ENEMY_DB } from "../data/enemies";
import { ITEM_DB } from "../data/items";
import {
  CAPTIVE_LANTERN_PANES, CAPTIVE_LANTERN_SIGNALS, CHAPTER_5_CONTRACT,
  type BriarholdAlert, type BriarholdEntry, type Chapter5Captive, type Chapter5Evidence,
  type LanternArrangement, type LanternSignal,
} from "../story/chapter5";
import { buildDefaultFlags } from "./state";
import type { Flags, Player, SavePayload } from "./types";

export function getChapter5EntryErrors(player: Player, flags: Flags) {
  const errors: string[] = [];
  for (const flag of CHAPTER_5_CONTRACT.entry.requiredFlags) {
    if (!flags[flag]) errors.push(`Missing Chapter 5 entry flag: ${flag}.`);
  }
  for (const id of CHAPTER_5_CONTRACT.entry.requiredItems) {
    if (!(player.inventory[id] > 0)) errors.push(`Missing Chapter 5 entry item: ${id}.`);
  }
  return errors;
}

// This validates the canonical start fixture, not every legal mid-chapter save.
export function validateChapter5ReadyPayload(payload: SavePayload) {
  const errors = getChapter5EntryErrors(payload.player, payload.flags);
  const entry = CHAPTER_5_CONTRACT.entry;
  if (payload.screen !== "play" || payload.chapterId !== 5) errors.push("Save must open at the Chapter 5 play boundary.");
  if (payload.region !== entry.region || payload.position.x !== entry.position.x || payload.position.y !== entry.position.y) {
    errors.push("Save must begin at the captured Briar Relay ledger.");
  }
  if (payload.flags.chapterFiveStarted || payload.flags.chapterFiveClear || payload.flags.lioRescued) {
    errors.push("The rescue chapter must not already have begun.");
  }
  for (const id of Object.values(payload.player.equipment)) {
    if (id && (!ITEM_DB[id] || !(payload.player.inventory[id] > 0))) errors.push(`Equipped item is unavailable: ${id}.`);
  }
  return errors;
}

// A pure contract model for the spike. Runtime persistence is added with the UI;
// do not pretend this object is already part of SavePayload or GameFlags.
export type BriarholdState = {
  entry: BriarholdEntry | null;
  alert: BriarholdAlert;
  shimFound: boolean;
  spareKeyFound: boolean;
  doorDetailDefeated: boolean;
  guardsDistracted: boolean;
  innerDoorOpened: boolean;
  lanternsRestored: boolean;
  workshopDisabled: boolean;
  invalidSignals: number;
  investigatorPending: boolean;
  investigatorRemoved: "none" | "silent" | "open";
};

export function buildBriarholdState(): BriarholdState {
  return {
    entry: null, alert: "quiet", shimFound: false, spareKeyFound: false,
    doorDetailDefeated: false, guardsDistracted: false, innerDoorOpened: false,
    lanternsRestored: false, workshopDisabled: false, invalidSignals: 0,
    investigatorPending: false, investigatorRemoved: "none",
  };
}

export function raiseBriarholdAlert(current: BriarholdAlert, requested: BriarholdAlert): BriarholdAlert {
  const order: BriarholdAlert[] = ["quiet", "suspicious", "alerted"];
  return order[Math.max(order.indexOf(current), order.indexOf(requested))];
}

export function enterBriarhold(state: BriarholdState, route: BriarholdEntry, checkSucceeded = false): BriarholdState {
  if (state.entry) return state;
  const entryAlert = route === "assault" ? "alerted" : route === "receiving-gate" && !checkSucceeded ? "suspicious" : "quiet";
  return { ...state, entry: route, alert: raiseBriarholdAlert(state.alert, entryAlert) };
}

export function openBriarholdDrawer(state: BriarholdState): BriarholdState {
  if (!state.entry || !state.shimFound || state.investigatorPending) return state;
  return state.spareKeyFound ? state : { ...state, spareKeyFound: true };
}

export function classifyLanternSignal(panes: LanternArrangement): LanternSignal {
  return CAPTIVE_LANTERN_SIGNALS.find((signal) => signal.panes.every((pane, i) => pane === panes[i]))?.id ?? "meaningless";
}

// Call only when the player deliberately pulls the shutters; editing panes is free.
export function transmitLanternSignal(state: BriarholdState, panes: LanternArrangement) {
  const signal = classifyLanternSignal(panes);
  if (!state.entry || state.investigatorPending) return { state, signal, transmitted: false };
  let next: BriarholdState = { ...state };
  if (signal === "front-gate-alert") {
    next.guardsDistracted = state.alert !== "alerted";
  } else if (signal === "command-center-recall") {
    next.alert = "alerted";
    next.guardsDistracted = false;
  } else if (signal === "meaningless") {
    next.invalidSignals = Math.min(2, state.invalidSignals + 1);
    next.guardsDistracted = false;
    if (state.alert === "alerted" || next.invalidSignals >= 2) {
      next.alert = "alerted";
    } else {
      next.alert = raiseBriarholdAlert(state.alert, "suspicious");
      next.investigatorPending = true;
    }
  } else {
    // Another legitimate work signal supersedes the diversion, without an alarm.
    next.guardsDistracted = false;
  }
  return { state: next, signal, transmitted: true };
}

// Commit the stored check outcome, or call after winning the chosen open fight.
export function resolveInvestigatingGuard(
  state: BriarholdState,
  response: "hide" | "assault" | "silent-ambush",
  checkSucceeded = false,
): BriarholdState {
  if (!state.investigatorPending) return state;
  const quietSuccess = response !== "assault" && checkSucceeded;
  return {
    ...state,
    investigatorPending: false,
    alert: raiseBriarholdAlert(state.alert, quietSuccess ? "suspicious" : "alerted"),
    investigatorRemoved: response === "assault" ? "open" : response === "silent-ambush" && checkSucceeded ? "silent" : "none",
  };
}

// Commit only after the direct door fight is won; choosing it raises Alerted in UI
// before combat. The original detail's defeat never clears that alarm.
export function defeatBriarholdDoorDetail(state: BriarholdState): BriarholdState {
  if (!state.entry || state.investigatorPending) return state;
  return { ...state, alert: "alerted", guardsDistracted: false, doorDetailDefeated: true };
}

export function canOpenBriarholdInnerDoor(state: BriarholdState) {
  if (!state.entry || state.investigatorPending) return false;
  return state.innerDoorOpened || state.doorDetailDefeated ||
    (state.spareKeyFound && state.guardsDistracted && state.alert !== "alerted");
}

export function getBriarholdBossProfile(state: BriarholdState) {
  const baseline = { quiet: 0, suspicious: 1, alerted: 2 }[state.alert];
  const guards = Math.max(0, baseline - (state.investigatorRemoved === "silent" ? 1 : 0));
  return {
    enemyIds: ["bracken_voss", "thornroot_sentry", ...Array<string>(guards).fill("thornseal_guard")],
    // Initial spike: gold light counters False Order's Shaken penalty, not its damage.
    falseOrderPenalty: state.lanternsRestored ? 0 : ENEMY_DB.bracken_voss.effectA.heroAttackPenalty,
    sentryRepairAvailable: !state.workshopDisabled,
  };
}

export type CarriageStage = "secure-carriage" | "set-brake" | "free-lio" | "rescued";
export function advanceCarriageRescue(
  stage: CarriageStage,
  brackenDefeated: boolean,
  lanternsRestored: boolean,
  brakeCheckSucceeded?: boolean,
) {
  if (!brackenDefeated || stage === "rescued") return { stage, needsCheck: false, injuryRisk: false };
  if (stage === "set-brake" && !lanternsRestored && brakeCheckSucceeded === undefined) {
    return { stage, needsCheck: true, injuryRisk: false };
  }
  const next: Record<Exclude<CarriageStage, "rescued">, CarriageStage> = {
    "secure-carriage": "set-brake", "set-brake": "free-lio", "free-lio": "rescued",
  };
  return {
    stage: next[stage], needsCheck: false,
    injuryRisk: stage === "set-brake" && !lanternsRestored && brakeCheckSucceeded === false,
  };
}

export type Chapter5Outcome = {
  brackenDefeated: boolean;
  brackenEscaped: boolean;
  lioSeenResisting: boolean;
  carriageStage: CarriageStage;
  rescued: Chapter5Captive[];
  evidence: Chapter5Evidence[];
  siblingsReunited: boolean;
  examinerLeadLearned: boolean;
  returnRoute: "safe-detour" | "tusker-hollow" | null;
  tuskersDefeated: boolean;
  returnedToBramblecross: boolean;
  homecomingSeen: boolean;
  caseWallComplete: boolean;
};

export function getBriarholdDepartureErrors(outcome: Chapter5Outcome) {
  const errors: string[] = [];
  if (!outcome.lioSeenResisting) errors.push("The inspection-grille scene is required on every route.");
  if (!outcome.brackenDefeated || !outcome.brackenEscaped || outcome.carriageStage !== "rescued") {
    errors.push("Defeat Bracken and finish Lio's carriage rescue before departure.");
  }
  for (const captive of CHAPTER_5_CONTRACT.requiredRescues) {
    if (!outcome.rescued.includes(captive)) errors.push(`Captive still needs rescue: ${captive}.`);
  }
  for (const evidence of CHAPTER_5_CONTRACT.requiredEvidence) {
    if (!outcome.evidence.includes(evidence)) errors.push(`Evidence not yet secured: ${evidence}.`);
  }
  if (!outcome.siblingsReunited || !outcome.examinerLeadLearned) errors.push("Complete the safe reunion and examiner's account before leaving.");
  return errors;
}

export function getChapter5CompletionErrors(outcome: Chapter5Outcome) {
  const errors = getBriarholdDepartureErrors(outcome);
  if (!outcome.returnRoute || (outcome.returnRoute === "tusker-hollow" && !outcome.tuskersDefeated)) {
    errors.push("Finish the chosen overland return route.");
  }
  if (!outcome.returnedToBramblecross || !outcome.homecomingSeen || !outcome.caseWallComplete) {
    errors.push("Complete the Bramblecross homecoming and private case-wall meeting.");
  }
  return errors;
}

export function validateChapter5Contract() {
  const errors: string[] = [];
  const defaults = buildDefaultFlags();
  for (const flag of [...CHAPTER_5_CONTRACT.entry.requiredFlags, ...CHAPTER_5_CONTRACT.requiredEndFlags]) {
    if (!(flag in defaults)) errors.push(`Chapter 5 flag has no default: ${flag}.`);
  }
  for (const id of [...CHAPTER_5_CONTRACT.entry.requiredItems, ...CHAPTER_5_CONTRACT.requiredItems]) {
    if (!ITEM_DB[id]?.icon) errors.push(`Chapter 5 item is missing or has no fallback: ${id}.`);
  }
  for (const id of CHAPTER_5_CONTRACT.enemies) {
    if (!ENEMY_DB[id]?.icon) errors.push(`Chapter 5 enemy is missing or has no fallback: ${id}.`);
  }
  const codes = CAPTIVE_LANTERN_SIGNALS.map((signal) => signal.panes.join("/"));
  if (new Set(codes).size !== codes.length) errors.push("Signal meanings must use distinct arrangements.");
  if (new Set(CAPTIVE_LANTERN_PANES.map((pane) => pane.mark)).size !== CAPTIVE_LANTERN_PANES.length) {
    errors.push("Every pane must have a distinct non-color mark.");
  }
  return errors;
}
