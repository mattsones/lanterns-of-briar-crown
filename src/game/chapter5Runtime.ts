import { buildEnemy } from "../data/enemies";
import { buildBriarholdState, canOpenBriarholdInnerDoor, defeatBriarholdDoorDetail, enterBriarhold, getBriarholdBossProfile, getBriarholdInnerPostGuards, resolveInvestigatingGuard, transmitLanternSignal, type BriarholdState, type CarriageStage } from "./chapter5";
import { getHeroXpTarget } from "./progression";
import { isCompanionConscious } from "./companions";
import type { Companion, Player, SkillCheckResult } from "./types";
import { CHAPTER_5_CHECKS, type LanternArrangement, type LanternPane } from "../story/chapter5";
import { CHAPTER_5_ACTION_NARRATIVE, getChapter5Arrival, getChapter5BattleAftermath, getChapter5CulvertGrateNarrative, getChapter5EntryNarrative, getChapter5GuideLampOutcome, getChapter5LedgerAmbushNarrative, getChapter5LitSignalOutcome, getChapter5SceneParagraphs, getChapter5SignalNarrative } from "../story/chapter5Narrative";
import { buildChapter5Progress, isChapter5ProgressValid, isChapter5ReturnCleared, type Chapter5Progress } from "./chapter5Progress";
import { CHAPTER_5_AFTERMATH, getChapter5FullArrival } from "../story/chapter5Aftermath";
import { getChapter5HallwayOutcome } from "../story/chapter5Hallway";

export const CH5_NODES = {
  overlook: { x: 0, y: 0, label: "Overlook shelter", icon: "⛺" },
  ridge: { x: 1, y: 0, label: "Ridge path", icon: "🌙" },
  gate: { x: 2, y: 0, label: "Receiving gate", icon: "🚪" },
  runoff: { x: 1, y: 1, label: "Runoff trail", icon: "💧" },
  culvert: { x: 2, y: 1, label: "Service culvert", icon: "🕳️" },
  landing: { x: 0, y: 1, label: "Service landing", icon: "🪜" },
  hub: { x: 1, y: 1, label: "Shadowed hub", icon: "🕯️" },
  ledger: { x: 1, y: 0, label: "False Ledger Room", icon: "📖" },
  workshop: { x: 1, y: 2, label: "Thornseal Workshop", icon: "🔧" },
  lanterns: { x: 2, y: 2, label: "Captive Lantern Hall", icon: "🏮" },
  door: { x: 2, y: 1, label: "Guarded inner door", icon: "🔒" },
  grille: { x: 3, y: 1, label: "Inspection grille", icon: "👁️" },
  crown: { x: 4, y: 1, label: "Crown Table", icon: "♜" },
  carriage: { x: 4, y: 2, label: "Transfer carriage", icon: "⚙️" },
  cells: { x: 5, y: 1, label: "Adjoining cells", icon: "🗝️" },
  gathering: { x: 0, y: 2, label: "Sheltered service court", icon: "🫂" },
  dawn: { x: 0, y: 1, label: "Dawn departure", icon: "🌅" },
  returnRidge: { x: 1, y: 1, label: "Eastward ridge", icon: "🌲" },
  woodsman: { x: 2, y: 1, label: "Woodsman's clearing", icon: "🪵" },
  fork: { x: 3, y: 1, label: "Root-hollow fork", icon: "↗️" },
  detour: { x: 3, y: 0, label: "High-ground detour", icon: "🥾" },
  longTrail: { x: 4, y: 0, label: "Fern-bank crossing", icon: "🌿" },
  hollow: { x: 3, y: 2, label: "Tusker hollow", icon: "🐗" },
  hollowEdge: { x: 4, y: 2, label: "Far hollow bank", icon: "🪨" },
  eastRoad: { x: 4, y: 1, label: "Eastern trail", icon: "🛤️" },
  townGate: { x: 5, y: 1, label: "Bramblecross gate", icon: "🏘️" },
  square: { x: 4, y: 1, label: "Bramblecross square", icon: "🏮" },
  watchhouse: { x: 4, y: 0, label: "Enna's case wall", icon: "📌" },
} as const;
export type Chapter5Node = keyof typeof CH5_NODES;
export type Chapter5BattleKind = "gate" | "door" | "investigator" | "boss" | "officer" | "workshop" | "tuskers";
export type Chapter5View = Chapter5Node | "opening" | "investigator" | null;
export type Chapter5SaveState = Chapter5Progress & {
  version: 1;
  started: boolean;
  node: Chapter5Node;
  view: Chapter5View;
  briarhold: BriarholdState;
  panes: [LanternPane | null, LanternPane | null, LanternPane | null];
  feedback: string;
  seenScenes: Partial<Record<Chapter5Node, string>>;
  hubPassages: number;
  hubInterlude: "lamp" | "load" | null;
  recoveryUsed: boolean;
  ledgerResolved: boolean;
  ledgerOfficerDistracted: boolean;
  clerkFreed: boolean;
  workshopResolved: boolean;
  chartRead: boolean;
  goldChannelUncovered: boolean;
  lioSeen: boolean;
  brackenDefeated: boolean;
  carriageStage: CarriageStage;
  brakeCheck: SkillCheckResult | null;
  checks: Partial<Record<"culvert" | "receiving" | "investigator" | "ledgerOfficer", SkillCheckResult>>;
  milestoneAwarded: boolean;
  pendingBattle: Chapter5BattleKind | null;
  bossProfile: ReturnType<typeof getBriarholdBossProfile> | null;
};

export function buildChapter5SaveState(): Chapter5SaveState {
  return {
    ...buildChapter5Progress(),
    version: 1, started: false, node: "overlook", view: "opening", briarhold: buildBriarholdState(),
    panes: [null, null, null], feedback: "", seenScenes: {}, hubPassages: 0, hubInterlude: null, recoveryUsed: false, ledgerResolved: false,
    ledgerOfficerDistracted: false, clerkFreed: false,
    workshopResolved: false, chartRead: false, goldChannelUncovered: false, lioSeen: false, brackenDefeated: false,
    carriageStage: "secure-carriage", brakeCheck: null, checks: {}, milestoneAwarded: false,
    pendingBattle: null, bossProfile: null,
  };
}

// Missing optional fields in a v1 partial save take unearned defaults. Invalid
// types or contradictory progress reject the save instead of granting success.
export function normalizeChapter5Save(value: unknown): Chapter5SaveState {
  const defaults = buildChapter5SaveState();
  if (value === undefined) return defaults;
  const fail = () => { throw new Error("The Chapter 5 state in this save is invalid or unsupported."); };
  if (!value || typeof value !== "object" || Array.isArray(value)) return fail();
  const raw = value as Partial<Chapter5SaveState>;
  if (raw.version !== 1) return fail();
  const next = { ...defaults, ...raw, briarhold: { ...defaults.briarhold, ...raw.briarhold } };
  // Keep a porter already encountered/rescued in the old cell layout there.
  // Earlier checkpoints receive the new forced-work detail without a rescue grant.
  if (raw.porterAtWorkshop === undefined) next.porterAtWorkshop = !(raw.cellsOpened || raw.porterFreed || raw.node === "cells" || raw.departed);
  for (const key of Object.keys(defaults)) {
    if (typeof defaults[key] === "boolean" && typeof next[key] !== "boolean") return fail();
  }
  if (!Object.keys(CH5_NODES).includes(next.node) || ![null, "opening", "investigator", ...Object.keys(CH5_NODES)].includes(next.view)) return fail();
  if (typeof next.feedback !== "string" || !Array.isArray(next.panes) || next.panes.length !== 3 ||
    next.panes.some((pane) => ![null, "red", "blue", "green", "amber"].includes(pane))) return fail();
  if (!next.seenScenes || typeof next.seenScenes !== "object" || Array.isArray(next.seenScenes) ||
    Object.entries(next.seenScenes).some(([node, key]) => !Object.keys(CH5_NODES).includes(node) ||
      typeof key !== "string" || !/^scene-v1:[0-9a-f]{8}$/.test(key))) return fail();
  if (!Number.isInteger(next.hubPassages) || next.hubPassages < 0 || next.hubPassages > 3 ||
    ![null, "lamp", "load"].includes(next.hubInterlude)) return fail();
  if (next.hubInterlude && (!next.started || !next.briarhold.entry || next.node !== "hub" || next.brackenDefeated ||
    next.pendingBattle || next.briarhold.alert === "alerted" || next.briarhold.investigatorPending ||
    next.hubPassages !== (next.hubInterlude === "lamp" ? 2 : 3))) return fail();
  const b = next.briarhold;
  if (!raw.briarhold || typeof raw.briarhold !== "object" || Array.isArray(raw.briarhold)) return fail();
  for (const key of Object.keys(defaults.briarhold)) {
    if (typeof defaults.briarhold[key] === "boolean" && typeof b[key] !== "boolean") return fail();
  }
  if (![null, "culvert", "receiving-gate", "assault"].includes(b.entry) ||
    !["quiet", "suspicious", "alerted"].includes(b.alert) ||
    !["none", "silent", "open"].includes(b.investigatorRemoved) ||
    !Number.isInteger(b.invalidSignals) || b.invalidSignals < 0 || b.invalidSignals > 2 ||
    ![null, "gate", "door", "investigator", "boss", "officer", "workshop", "tuskers"].includes(next.pendingBattle) ||
    !["secure-carriage", "set-brake", "free-lio", "rescued"].includes(next.carriageStage)) return fail();
  const validCheck = (check: SkillCheckResult) => check && typeof check === "object" &&
    typeof check.stat === "string" && typeof check.label === "string" &&
    [check.roll, check.bonus, check.total, check.dc].every(Number.isFinite) &&
    check.roll >= 1 && check.roll <= 20 && check.total === check.roll + check.bonus &&
    typeof check.success === "boolean" && check.success === (check.total >= check.dc);
  if (next.brakeCheck !== null && !validCheck(next.brakeCheck)) return fail();
  if (!next.checks || typeof next.checks !== "object" || Array.isArray(next.checks) ||
    Object.entries(next.checks).some(([key, check]) => !["culvert", "receiving", "investigator", "ledgerOfficer"].includes(key) || !validCheck(check))) return fail();
  const grateCheck = next.checks.culvert;
  if (grateCheck && (!next.started || grateCheck.stat !== CHAPTER_5_CHECKS.culvertGrate.stat ||
    grateCheck.dc !== CHAPTER_5_CHECKS.culvertGrate.dc || b.entry === "culvert" && !grateCheck.success)) return fail();
  if (next.bossProfile !== null) {
    const p = next.bossProfile;
    if (!Array.isArray(p.enemyIds) || p.enemyIds.length < 2 || p.enemyIds.length > 4 ||
      p.enemyIds[0] !== "bracken_voss" || p.enemyIds[1] !== "thornroot_sentry" ||
      p.enemyIds.slice(2).some((id) => id !== "thornseal_guard") ||
      ![0, 2].includes(p.falseOrderPenalty) || typeof p.sentryRepairAvailable !== "boolean") return fail();
  }
  if ((!next.started && b.entry) || (!b.entry && (b.innerDoorOpened || next.lioSeen || next.brackenDefeated || next.pendingBattle)) ||
    (!b.entry && (next.ledgerOfficerDistracted || next.clerkFreed)) ||
    (next.ledgerResolved && next.ledgerOfficerDistracted) ||
    (next.clerkFreed && !next.ledgerResolved) ||
    (next.checks.ledgerOfficer && (!next.started || !b.entry || !next.ledgerResolved)) ||
    (next.checks.ledgerOfficer && !next.checks.ledgerOfficer.success && b.alert === "quiet") ||
    (next.pendingBattle === "boss" && (!next.lioSeen || !next.bossProfile)) ||
    (next.brackenDefeated && (!next.lioSeen || !b.innerDoorOpened || next.pendingBattle && next.pendingBattle !== "tuskers")) ||
    (next.carriageStage !== "secure-carriage" && !next.brackenDefeated) ||
    (next.milestoneAwarded && next.carriageStage !== "rescued")) return fail();
  if (b.investigatorPending) next.view = "investigator";
  if (next.hubInterlude) next.view = "hub";
  if (next.node === "landing" && next.view === "hub") next.view = "landing";
  if (next.brackenDefeated && next.carriageStage !== "rescued") {
    next.node = "carriage";
    next.view = "carriage";
  }
  if (next.workshopResolved && next.workshopResolution === null) next.workshopResolution = "bypassed";
  if (!isChapter5ProgressValid(next)) return fail();
  const oldHubArrival = "You move around the end of the landing rail and settle behind the hub's stone pier. The work sounds divide here, letting you pick out the separate passages while remaining beneath the lamps.";
  if (next.node === "hub" && next.feedback === oldHubArrival) next.feedback = getChapter5Arrival(next, "hub");
  return next;
}

export function tryChapter5CulvertGrate(state: Chapter5SaveState, check: SkillCheckResult): Chapter5SaveState {
  if (!state.started || state.briarhold.entry || state.node !== "culvert" || state.view !== "culvert" ||
    state.checks.culvert || check.stat !== CHAPTER_5_CHECKS.culvertGrate.stat || check.dc !== CHAPTER_5_CHECKS.culvertGrate.dc) return state;
  return { ...state, checks: { ...state.checks, culvert: check }, feedback: getChapter5CulvertGrateNarrative(check) };
}

export function enterChapter5Culvert(state: Chapter5SaveState): Chapter5SaveState {
  if (!state.started || state.briarhold.entry || state.node !== "culvert" || state.view !== "culvert" || !state.checks.culvert?.success) return state;
  return { ...state, node: "landing", view: "landing", briarhold: enterBriarhold(state.briarhold, "culvert"),
    feedback: getChapter5EntryNarrative("culvert", null) };
}

export function restoreChapter5GuideLamp(state: Chapter5SaveState, companion?: Companion): Chapter5SaveState {
  if (!state.started || !state.briarhold.entry || state.node !== "lanterns" || state.view !== "lanterns" ||
    !state.goldChannelUncovered || state.briarhold.lanternsRestored || state.pendingBattle || state.briarhold.investigatorPending) return state;
  const exposed = getBriarholdInnerPostGuards(state.briarhold, state.brackenDefeated) > 0;
  return { ...state, briarhold: { ...state.briarhold, lanternsRestored: true,
    alert: exposed ? "alerted" : state.briarhold.alert }, feedback: getChapter5GuideLampOutcome(state, companion) };
}

export function leaveChapter5GuideLampClosed(state: Chapter5SaveState): Chapter5SaveState {
  if (!state.started || !state.briarhold.entry || state.node !== "lanterns" || state.view !== "lanterns" ||
    !state.goldChannelUncovered || state.briarhold.lanternsRestored || state.pendingBattle || state.briarhold.investigatorPending) return state;
  return { ...state, view: null, feedback: "You ease your hand away from the shutter, leaving the bound stems in its hinge. Only a thin amber line escapes beneath the edge. Mara follows you back toward the stair with one hand on the rail, feeling for the next step before she trusts it with her weight. The passages remain in shadow." };
}

export function transmitChapter5Signal(state: Chapter5SaveState): Chapter5SaveState {
  if (!state.started || !state.briarhold.entry || state.node !== "lanterns" || state.view !== "lanterns" ||
    state.pendingBattle || state.panes.some(pane => !pane)) return state;
  const result = transmitLanternSignal(state.briarhold, state.panes as LanternArrangement);
  if (!result.transmitted) return state;
  const exposed = result.state.lanternsRestored && getBriarholdInnerPostGuards(result.state, state.brackenDefeated) > 0;
  const briarhold: BriarholdState = exposed
    ? { ...result.state, alert: "alerted", guardsDistracted: false, investigatorPending: false }
    : result.state;
  return { ...state, briarhold, view: briarhold.investigatorPending ? "investigator" : "lanterns",
    feedback: exposed ? getChapter5LitSignalOutcome(state, result.signal) : getChapter5SignalNarrative(result.signal, briarhold) };
}

export function distractLedgerOfficer(state: Chapter5SaveState): Chapter5SaveState {
  if (!state.started || !state.briarhold.entry || state.node !== "ledger" || state.view !== "ledger" || state.ledgerResolved || state.ledgerOfficerDistracted) return state;
  return { ...state, ledgerOfficerDistracted: true, feedback: CHAPTER_5_ACTION_NARRATIVE.distractLedger };
}

export function secureLedgerOfficer(state: Chapter5SaveState, check: SkillCheckResult): Chapter5SaveState {
  if (!state.started || !state.briarhold.entry || state.node !== "ledger" || state.view !== "ledger" || state.ledgerResolved || !state.ledgerOfficerDistracted || state.checks.ledgerOfficer) return state;
  const alert = check.success || state.briarhold.alert === "alerted" ? state.briarhold.alert
    : state.briarhold.alert === "quiet" ? "suspicious" : "alerted";
  return { ...state, ledgerResolved: true, ledgerOfficerDistracted: false,
    checks: { ...state.checks, ledgerOfficer: check },
    briarhold: { ...state.briarhold, alert,
      guardsDistracted: !check.success && alert === "alerted" ? false : state.briarhold.guardsDistracted },
    feedback: getChapter5LedgerAmbushNarrative(check, alert) };
}

export function freeLedgerClerk(state: Chapter5SaveState): Chapter5SaveState {
  if (!state.started || !state.briarhold.entry || state.node !== "ledger" || state.view !== "ledger" || !state.ledgerResolved || state.clerkFreed) return state;
  return { ...state, clerkFreed: true, feedback: state.carriageStage === "rescued" ? CHAPTER_5_AFTERMATH.freeClerkAfterRescue : CHAPTER_5_ACTION_NARRATIVE.freeClerk + (state.briarhold.spareKeyFound
    ? "\n\nShe sees the key beside Mara's wrapped shim and points to it. “That opens the inner door,” she whispers. “Watch for the guards at the post.”"
    : "\n\nShe glances at the lower drawer and whispers, “He keeps a spare inner-door key in there. I watched him lock it away.” Mara crouches beside the drawer and studies its narrow join."), };
}

export function abandonLedgerDistraction(state: Chapter5SaveState): Chapter5SaveState {
  if (state.view !== "ledger" || state.ledgerResolved || !state.ledgerOfficerDistracted) return state;
  return { ...state, ledgerOfficerDistracted: false,
    briarhold: { ...state.briarhold, alert: state.briarhold.alert === "quiet" ? "suspicious" : state.briarhold.alert },
    feedback: CHAPTER_5_ACTION_NARRATIVE.abandonLedger };
}

export function getChapter5Edges(state: Chapter5SaveState): [Chapter5Node, Chapter5Node][] {
  if (state.returnedToBramblecross) return [["townGate", "square"], ["square", "watchhouse"]];
  if (state.departed) return [["dawn", "returnRidge"], ["returnRidge", "woodsman"], ["woodsman", "fork"],
    ["fork", "detour"], ["detour", "longTrail"], ["longTrail", "eastRoad"],
    ["fork", "hollow"], ["hollow", "hollowEdge"], ["hollowEdge", "eastRoad"], ["eastRoad", "townGate"]];
  return state.briarhold.entry
    ? [["landing", "hub"], ["hub", "ledger"], ["hub", "workshop"], ["workshop", "lanterns"],
      ["lanterns", "door"], ["hub", "door"], ["door", "grille"], ["grille", "crown"], ["crown", "carriage"],
      ...(state.carriageStage === "rescued" ? [["crown", "cells"], ["landing", "gathering"]] as [Chapter5Node, Chapter5Node][] : [])]
    : [["overlook", "ridge"], ["ridge", "gate"], ["ridge", "runoff"], ["runoff", "culvert"]];
}

// Compare the actual description and locally available interactions, rather than
// reopening every visited room whenever an unrelated chapter flag changes.
export function getChapter5SceneKey(state: Chapter5SaveState, node: Chapter5Node, companion?: Companion): string {
  const b = state.briarhold;
  const opportunities: Partial<Record<Chapter5Node, unknown[]>> = {
    ledger: [state.chartRead, state.ledgerResolved && !b.spareKeyFound && b.shimFound,
      state.evidence.includes("transfer-ledger"), state.evidence.includes("genuine-office-instruction")],
    workshop: [state.porterFreed, state.evidence.includes("false-seals"), !b.workshopDisabled && companion?.id === "moss" && isCompanionConscious(companion)],
    lanterns: [state.chartRead],
    door: [canOpenBriarholdInnerDoor(b)],
    crown: [state.carriageStage === "rescued", state.evidence.includes("examiner-transfer-record")],
    gathering: [state.clerkFreed, state.porterFreed, state.wardenFreed, [...state.evidence].sort(),
      state.examinerLeadLearned, state.siblingsReunited, state.suppliesClaimed],
  };
  const content = JSON.stringify([getChapter5SceneParagraphs({ ...state, view: node }, companion), opportunities[node]]);
  let hash = 2166136261;
  for (let i = 0; i < content.length; i++) hash = Math.imul(hash ^ content.charCodeAt(i), 16777619);
  return `scene-v1:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

// Open scenes count as presented, including their updated state after an action.
// A continuation that closes the scene also acknowledges its completed phase.
export function rememberChapter5Scene(state: Chapter5SaveState, companion?: Companion, previous?: Chapter5SaveState): Chapter5SaveState {
  if (!state.started || state.pendingBattle) return state;
  const presented = state.view === state.node || state.view === null && previous?.view === state.node && previous.node === state.node;
  if (!presented) return state;
  const key = getChapter5SceneKey(state, state.node, companion);
  return state.seenScenes[state.node] === key ? state : { ...state, seenScenes: { ...state.seenScenes, [state.node]: key } };
}

export function resolveChapter5HubPassage(state: Chapter5SaveState, response: "wait" | "cross"): Chapter5SaveState {
  if (state.node !== "hub" || state.view !== "hub" || !state.hubInterlude || state.pendingBattle ||
    response === "cross" && state.hubInterlude !== "load") return state;
  return { ...state, hubInterlude: null, feedback: getChapter5HallwayOutcome(state.hubInterlude, response) };
}

export function moveChapter5(state: Chapter5SaveState, destination: Chapter5Node, companion?: Companion): Chapter5SaveState {
  if (state.view || state.pendingBattle || state.briarhold.investigatorPending || state.hubInterlude ||
    (state.brackenDefeated && state.carriageStage !== "rescued")) return state;
  if (!getChapter5Edges(state).some(([a, b]) => (a === state.node && b === destination) || (b === state.node && a === destination))) return state;
  if (destination === "fork" && !state.woodsmanHeard) return { ...state, view: "woodsman", feedback: "The woodsman points toward the two trails. Listen to his warning before choosing a way through the hollow." };
  if ((state.node === "hollow" && destination === "hollowEdge" || state.node === "eastRoad" && destination === "hollowEdge") && !state.tuskersDefeated) return { ...state, feedback: "The tuskers hold the crossing between the two banks. The high trail is back at the fork, beyond the woodsman's clearing." };
  if (destination === "eastRoad" && !isChapter5ReturnCleared(state)) return state;
  if (destination === "townGate" && !state.returnConversationHeard) return { ...state, view: "eastRoad", feedback: "Lio pauses beside the trail as the others catch up. Walk with him before the final stretch into town." };
  if (destination === "watchhouse" && !state.homecomingSeen) return { ...state, view: "square", feedback: "Hollis has come down into the square. Enna is beside him, looking toward the people arriving with you." };
  const returnRoute = destination === "detour" ? "safe-detour" : destination === "hollow" ? "tusker-hollow" : state.returnRoute;
  if (destination === "grille" && !state.briarhold.innerDoorOpened) return { ...state, feedback: "You reach the inner post, but the locked door closes off the inspection passage. Mara draws back into the pier's shadow with you; passing farther will require the key and a diversion, or defeating the guards who hold it." };
  if (destination === "carriage" && !state.brackenDefeated) return { ...state, feedback: "You look for a path along the carriage rail, but Bracken and his supports command the floor between you and Lio. Mara stays behind the console while you prepare to break their hold on the room." };
  const hubPassages = destination === "hub" ? Math.min(3, state.hubPassages + 1) : state.hubPassages;
  const hubInterlude = destination === "hub" && !state.brackenDefeated && state.briarhold.alert !== "alerted" && state.hubPassages < 3
    ? hubPassages === 2 ? "lamp" : hubPassages === 3 ? "load" : null : null;
  const next: Chapter5SaveState = { ...state, node: destination, returnRoute, hubPassages, hubInterlude,
    workshopResolved: state.node === "workshop" && state.workshopResolution === "bypassed" ? false : state.workshopResolved,
    returnedToBramblecross: state.returnedToBramblecross || destination === "townGate", view: null, feedback: "" };
  const unread = next.seenScenes[destination] !== getChapter5SceneKey(next, destination, companion);
  if (!unread && !(destination === "grille" && !state.lioSeen)) return next;
  return rememberChapter5Scene({ ...next, view: destination,
    feedback: getChapter5FullArrival(state, destination) || getChapter5Arrival(state, destination) }, companion);
}

export function buildChapter5BattleEnemies(state: Chapter5SaveState) {
  const profile = state.bossProfile;
  const ids = state.pendingBattle === "boss" ? profile.enemyIds :
    state.pendingBattle === "gate" ? ["thornseal_guard", "thornseal_guard"] :
      state.pendingBattle === "tuskers" ? ["rainroot_tusker", "rainroot_tusker"] :
        state.pendingBattle === "door" ? Array(state.briarhold.investigatorRemoved === "none" ? 2 : 1).fill("thornseal_guard") : ["thornseal_guard"];
  return ids.map((id) => {
    const enemy = buildEnemy(id);
    if (state.pendingBattle === "officer" || state.pendingBattle === "workshop") {
      const officer = state.pendingBattle === "officer";
      enemy.name = officer ? "Records Officer" : "Sealwright";
      enemy.icon = officer ? "🖋️" : "🔨";
      enemy.intentA = officer ? "Desk-side Feint" : "Braced Hammer";
      enemy.intentB = officer ? "Workknife Slash" : "Press Hammer Swing";
      enemy.effectA = { guardSelf: 4, guardNarration: officer ? "uses the desk's corner to cover his weapon arm" : "braces behind the press with her hammer held across her body" };
      enemy.intent = enemy.intentA;
      enemy.currentEffect = enemy.effectA;
    }
    if (id === "bracken_voss" && profile.falseOrderPenalty === 0) {
      enemy.effectA = { ...enemy.effectA, heroAttackPenalty: 0 };
      enemy.currentEffect = enemy.effectA;
    }
    return enemy;
  });
}

export function finishChapter5Battle(state: Chapter5SaveState): Chapter5SaveState {
  if (!state.pendingBattle) return state;
  const kind = state.pendingBattle;
  if (kind === "officer") return { ...state, pendingBattle: null, ledgerResolved: true, ledgerOfficerDistracted: false,
    view: "ledger", feedback: CHAPTER_5_AFTERMATH.officerDefeated };
  if (kind === "workshop") return { ...state, pendingBattle: null, workshopResolved: true, workshopResolution: "fought",
    view: "workshop", feedback: CHAPTER_5_AFTERMATH.workshopDefeated };
  if (kind === "tuskers") return { ...state, pendingBattle: null, tuskersDefeated: true,
    view: "hollow", feedback: CHAPTER_5_AFTERMATH.tuskersDefeated };
  return {
    ...state, pendingBattle: null,
    briarhold: kind === "door" ? { ...defeatBriarholdDoorDetail(state.briarhold), innerDoorOpened: true } :
      kind === "investigator" ? resolveInvestigatingGuard(state.briarhold, "assault") : state.briarhold,
    brackenDefeated: kind === "boss" || state.brackenDefeated,
    node: kind === "boss" ? "carriage" : kind === "gate" ? "landing" : state.node,
    view: kind === "boss" ? "carriage" : kind === "gate" ? "landing" : kind === "door" ? "door" : "lanterns",
    feedback: getChapter5BattleAftermath(kind),
  };
}

export function chapter5MilestoneXp(player: Player) {
  let required = 0;
  for (let level = player.level; level < 5; level++) required += getHeroXpTarget(level) || 0;
  return player.xp + required; // Preserve earned XP; growth uses the normal choice UI.
}

export type Chapter5Resources = { player?: Player; companion?: Companion };

export function getChapter5AreaName(state: Chapter5SaveState) {
  return state.returnedToBramblecross ? "Bramblecross" : state.departed ? "Rainroot Return" : "Briarhold Waystation";
}
