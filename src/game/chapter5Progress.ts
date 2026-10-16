import { isCompanionConscious } from "./companions";
import { getBriarholdDepartureErrors, getChapter5CompletionErrors, type Chapter5Outcome } from "./chapter5";
import { CHAPTER_5_CONTRACT, type Chapter5Evidence } from "../story/chapter5";
import { CHAPTER_5_AFTERMATH, getChapter5FullOutcome } from "../story/chapter5Aftermath";
import { CHAPTER_5_ACTION_NARRATIVE } from "../story/chapter5Narrative";
import type { Chapter5SaveState } from "./chapter5Runtime";
import type { Companion, Player } from "./types";

export type WorkshopResolution = "bypassed" | "contained" | "fought" | "surrendered" | null;
export type Chapter5Progress = {
  workshopResolution: WorkshopResolution;
  rowanContainmentUsed: boolean;
  mossBypassUsed: boolean;
  cellsOpened: boolean;
  porterFreed: boolean;
  wardenFreed: boolean;
  evidence: Chapter5Evidence[];
  examinerLeadLearned: boolean;
  siblingsReunited: boolean;
  suppliesClaimed: boolean;
  departed: boolean;
  woodsmanHeard: boolean;
  returnRoute: "safe-detour" | "tusker-hollow" | null;
  tuskersDefeated: boolean;
  returnConversationHeard: boolean;
  returnedToBramblecross: boolean;
  homecomingSeen: boolean;
  caseWallEvidenceRead: boolean;
  caseWallComplete: boolean;
};

export function buildChapter5Progress(): Chapter5Progress {
  return { workshopResolution: null, rowanContainmentUsed: false, mossBypassUsed: false,
    cellsOpened: false, porterFreed: false, wardenFreed: false, evidence: [],
    examinerLeadLearned: false, siblingsReunited: false, suppliesClaimed: false,
    departed: false, woodsmanHeard: false, returnRoute: null, tuskersDefeated: false,
    returnConversationHeard: false, returnedToBramblecross: false, homecomingSeen: false,
    caseWallEvidenceRead: false, caseWallComplete: false };
}

export function getChapter5Outcome(s: Chapter5SaveState): Chapter5Outcome {
  return { brackenDefeated: s.brackenDefeated, brackenEscaped: s.brackenDefeated,
    lioSeenResisting: s.lioSeen, carriageStage: s.carriageStage,
    rescued: [...(s.carriageStage === "rescued" ? ["lio" as const] : []),
      ...(s.clerkFreed ? ["westroot-clerk" as const] : []), ...(s.porterFreed ? ["cellar-porter" as const] : []),
      ...(s.wardenFreed ? ["road-warden" as const] : [])], evidence: [...s.evidence],
    siblingsReunited: s.siblingsReunited, examinerLeadLearned: s.examinerLeadLearned,
    returnRoute: s.returnRoute, tuskersDefeated: s.tuskersDefeated,
    returnedToBramblecross: s.returnedToBramblecross, homecomingSeen: s.homecomingSeen,
    caseWallComplete: s.caseWallComplete };
}
export function isChapter5CleanupReady(s: Chapter5SaveState) {
  return getChapter5Outcome(s).rescued.length === 4 && CHAPTER_5_CONTRACT.requiredEvidence.every(id => s.evidence.includes(id));
}
export function isChapter5Complete(s: Chapter5SaveState) { return getChapter5CompletionErrors(getChapter5Outcome(s)).length === 0; }
export function isChapter5ReturnCleared(s: Chapter5SaveState) {
  return s.woodsmanHeard && (s.returnRoute === "safe-detour" || s.returnRoute === "tusker-hollow" && s.tuskersDefeated);
}
const at = (s: Chapter5SaveState, node: Chapter5SaveState["node"]) => s.started && !!s.briarhold.entry && s.node === node && s.view === node && !s.pendingBattle;

export function resolveChapter5Workshop(s: Chapter5SaveState, method: Exclude<WorkshopResolution, "fought" | null>, companion?: Companion): Chapter5SaveState {
  if (!at(s, "workshop") || s.workshopResolved) return s;
  if (method === "contained" && (!isCompanionConscious(companion) || companion.id !== "rowan" || s.rowanContainmentUsed)) return s;
  if (method === "surrendered" && s.carriageStage !== "rescued") return s;
  if (s.brackenDefeated && method !== "surrendered") return s;
  return { ...s, workshopResolved: true, workshopResolution: method,
    rowanContainmentUsed: method === "contained" || s.rowanContainmentUsed,
    feedback: method === "contained" ? CHAPTER_5_AFTERMATH.containDessa : method === "surrendered" ? CHAPTER_5_AFTERMATH.workshopSurrender : CHAPTER_5_ACTION_NARRATIVE.resolveWorkshop };
}
export function bypassChapter5Feed(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  if (!at(s, "workshop") || !s.workshopResolved || s.briarhold.workshopDisabled || s.mossBypassUsed || !isCompanionConscious(companion) || companion.id !== "moss") return s;
  return { ...s, mossBypassUsed: true, briarhold: { ...s.briarhold, workshopDisabled: true }, feedback: CHAPTER_5_AFTERMATH.mossFeed };
}
export function acceptOfficerSurrender(s: Chapter5SaveState): Chapter5SaveState {
  if (!at(s, "ledger") || s.ledgerResolved || s.carriageStage !== "rescued") return s;
  return { ...s, ledgerResolved: true, ledgerOfficerDistracted: false, feedback: CHAPTER_5_AFTERMATH.officerSurrender };
}
export function collectChapter5Evidence(s: Chapter5SaveState, id: Chapter5Evidence): Chapter5SaveState {
  if (s.evidence.includes(id) || s.departed) return s;
  const accessible = id === "false-seals" ? at(s, "workshop") && s.workshopResolved
    : id === "examiner-transfer-record" ? at(s, "crown") && s.carriageStage === "rescued"
      : at(s, "ledger") && s.ledgerResolved;
  if (!accessible) return s;
  return { ...s, evidence: [...s.evidence, id], feedback: CHAPTER_5_AFTERMATH[id] };
}
export function openChapter5Cells(s: Chapter5SaveState): Chapter5SaveState {
  return !at(s, "cells") || s.carriageStage !== "rescued" || s.cellsOpened ? s
    : { ...s, cellsOpened: true, feedback: CHAPTER_5_AFTERMATH.openCells };
}
export function freeChapter5CellCaptive(s: Chapter5SaveState, captive: "porter" | "warden"): Chapter5SaveState {
  const field = captive === "porter" ? "porterFreed" : "wardenFreed";
  return !at(s, "cells") || !s.cellsOpened || s[field] ? s
    : { ...s, [field]: true, feedback: CHAPTER_5_AFTERMATH[captive] };
}
export function hearChapter5Examiner(s: Chapter5SaveState): Chapter5SaveState {
  return !at(s, "gathering") || !isChapter5CleanupReady(s) || s.examinerLeadLearned ? s
    : { ...s, examinerLeadLearned: true, feedback: CHAPTER_5_AFTERMATH.examiner };
}
export function reuniteChapter5Siblings(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  return !at(s, "gathering") || !isChapter5CleanupReady(s) || !s.examinerLeadLearned || s.siblingsReunited ? s
    : { ...s, siblingsReunited: true, feedback: getChapter5FullOutcome("reunion", companion) };
}
export function packChapter5Supplies(s: Chapter5SaveState): Chapter5SaveState {
  return !at(s, "gathering") || !isChapter5CleanupReady(s) || s.suppliesClaimed ? s
    : { ...s, suppliesClaimed: true, feedback: CHAPTER_5_AFTERMATH.supplies };
}
export function departChapter5Briarhold(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  return !at(s, "gathering") || s.departed || getBriarholdDepartureErrors(getChapter5Outcome(s)).length ? s
    : { ...s, departed: true, node: "dawn", view: "dawn", feedback: getChapter5FullOutcome("depart", companion) };
}
export function hearChapter5Woodsman(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  return !at(s, "woodsman") || !s.departed || s.woodsmanHeard ? s
    : { ...s, woodsmanHeard: true, view: null, feedback: getChapter5FullOutcome("woodsman", companion) };
}
export function hearChapter5ReturnTalk(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  return !at(s, "eastRoad") || !isChapter5ReturnCleared(s) || s.returnConversationHeard ? s
    : { ...s, returnConversationHeard: true, view: null, feedback: getChapter5FullOutcome("return-talk", companion) };
}
export function seeChapter5Homecoming(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  return !at(s, "square") || !s.returnedToBramblecross || s.homecomingSeen ? s
    : { ...s, homecomingSeen: true, feedback: getChapter5FullOutcome("homecoming", companion) };
}
export function readChapter5CaseWall(s: Chapter5SaveState): Chapter5SaveState {
  return !at(s, "watchhouse") || !s.homecomingSeen || s.caseWallEvidenceRead ? s
    : { ...s, caseWallEvidenceRead: true, feedback: CHAPTER_5_AFTERMATH.caseReading };
}
export function finishChapter5CaseWall(s: Chapter5SaveState, companion: Companion): Chapter5SaveState {
  if (!at(s, "watchhouse") || !s.caseWallEvidenceRead || s.caseWallComplete) return s;
  const next = { ...s, caseWallComplete: true };
  return isChapter5Complete(next) ? { ...next, feedback: getChapter5FullOutcome("closing", companion) } : s;
}

export const CHAPTER_5_EVIDENCE_ITEMS = {
  "transfer-ledger": "briarhold_transfer_ledger", "genuine-office-instruction": "briarhold_office_instruction",
  "false-seals": "briarhold_seal_evidence", "examiner-transfer-record": "examiner_transfer_record",
} as const;
export function applyChapter5ProgressRewards(previous: Chapter5SaveState, next: Chapter5SaveState, player: Player): Player {
  const inventory = { ...player.inventory };
  for (const id of next.evidence) inventory[CHAPTER_5_EVIDENCE_ITEMS[id]] = Math.max(1, inventory[CHAPTER_5_EVIDENCE_ITEMS[id]] || 0);
  if (next.evidence.includes("false-seals")) inventory.true_seal_fragment = Math.max(1, inventory.true_seal_fragment || 0);
  if (next.carriageStage === "rescued") inventory.briar_chain_link = Math.max(1, inventory.briar_chain_link || 0);
  const supplies = next.suppliesClaimed && !previous.suppliesClaimed;
  if (supplies) {
    inventory.healing_fizzpop = (inventory.healing_fizzpop || 0) + 2;
    inventory.trail_snack = (inventory.trail_snack || 0) + 2;
  }
  return { ...player, inventory, gold: player.gold + (supplies ? 12 : 0),
    xp: player.xp + (next.tuskersDefeated && !previous.tuskersDefeated ? 8 : 0) };
}

export function isChapter5ProgressValid(s: Chapter5SaveState) {
  if (![null, "bypassed", "contained", "fought", "surrendered"].includes(s.workshopResolution) ||
    ![null, "safe-detour", "tusker-hollow"].includes(s.returnRoute) || !Array.isArray(s.evidence) ||
    new Set(s.evidence).size !== s.evidence.length || s.evidence.some(id => !CHAPTER_5_CONTRACT.requiredEvidence.includes(id))) return false;
  if (!!s.workshopResolution !== s.workshopResolved || s.rowanContainmentUsed !== (s.workshopResolution === "contained") ||
    s.mossBypassUsed && (!s.workshopResolved || !s.briarhold.workshopDisabled) ||
    s.evidence.some(id => id === "false-seals" ? !s.workshopResolved : id === "examiner-transfer-record" ? s.carriageStage !== "rescued" : !s.ledgerResolved) ||
    s.cellsOpened && s.carriageStage !== "rescued" || (s.porterFreed || s.wardenFreed) && !s.cellsOpened ||
    (s.examinerLeadLearned || s.suppliesClaimed) && !isChapter5CleanupReady(s) ||
    s.siblingsReunited && (!s.examinerLeadLearned || !isChapter5CleanupReady(s)) ||
    s.departed && getBriarholdDepartureErrors(getChapter5Outcome(s)).length ||
    !s.departed && (s.woodsmanHeard || s.returnRoute || s.tuskersDefeated || s.returnConversationHeard || s.returnedToBramblecross) ||
    s.returnRoute && !s.woodsmanHeard || s.tuskersDefeated && !s.returnRoute ||
    s.returnConversationHeard && !isChapter5ReturnCleared(s) || s.returnedToBramblecross && !s.returnConversationHeard ||
    s.homecomingSeen && !s.returnedToBramblecross || s.caseWallEvidenceRead && !s.homecomingSeen ||
    s.caseWallComplete && (!s.caseWallEvidenceRead || !isChapter5Complete(s))) return false;
  const wilderness = ["dawn", "returnRidge", "woodsman", "fork", "detour", "longTrail", "hollow", "hollowEdge", "eastRoad"];
  const town = ["townGate", "square", "watchhouse"];
  if ((s.node === "cells" || s.node === "gathering") && s.carriageStage !== "rescued" ||
    wilderness.includes(s.node) && (!s.departed || s.returnedToBramblecross) ||
    town.includes(s.node) && !s.returnedToBramblecross ||
    s.returnedToBramblecross && !town.includes(s.node) ||
    s.departed && !s.returnedToBramblecross && !wilderness.includes(s.node)) return false;
  if (s.pendingBattle === "tuskers" && (s.node !== "hollow" || !s.departed || s.returnRoute !== "tusker-hollow" || s.tuskersDefeated) ||
    s.pendingBattle === "officer" && (s.node !== "ledger" || s.ledgerResolved || s.brackenDefeated) ||
    s.pendingBattle === "workshop" && (s.node !== "workshop" || s.workshopResolved || s.brackenDefeated)) return false;
  return true;
}
