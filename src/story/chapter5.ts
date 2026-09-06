import type { GameFlagKey } from "../game/types";
import { CHAPTER_4_REQUIRED_END_FLAGS } from "./chapter4";

// Contract data for the next graybox; these planned rooms are not live map IDs yet.
export const CHAPTER_5_CONTRACT = {
  id: 5,
  title: "Briarhold Waystation",
  promise: "Rescue Lio and every captive still at Briarhold, break Bracken's cell, and carry proof of institutional access to Bramblecross.",
  entry: {
    fixture: "/saves/chapter-4-complete.json",
    region: "briarRelayPost",
    position: { x: 4, y: 1 },
    requiredFlags: ["chapterReported", "chapterTwoClear", "chapterThreeClear", "maraJoined", ...CHAPTER_4_REQUIRED_END_FLAGS] satisfies GameFlagKey[],
    requiredItems: ["lios_courier_knot"],
  },
  maps: [
    { id: "briarholdApproach", landmarks: ["ridge", "overlook shelter", "receiving gate", "service culvert"] },
    { id: "briarholdHub", landmarks: ["service landing", "three wing entrances", "guarded inner door"] },
    { id: "briarholdLedger", landmarks: ["supervised clerk", "fixed signal chart", "locked desk drawer"] },
    { id: "briarholdWorkshop", landmarks: ["sealwright", "laborer", "lock shim", "Sentry repair linkage"] },
    { id: "briarholdLanternHall", landmarks: ["three signal lanterns", "pane racks", "transmission lever", "gold-light channel", "concealment"] },
    { id: "briarholdCrownTable", landmarks: ["inspection grille", "Mara's cover", "Crown Table", "transfer carriage and brake", "cells", "personnel escape"] },
    { id: "rainrootReturn", landmarks: ["dawn departure", "distance waypoint", "woodsman", "tusker hollow", "safe detour", "reconvergence"] },
  ],
  endpoint: { region: "bramblecross", scene: "ch5-case-wall", nextDestination: "Lanthorne" },
  requiredEndFlags: ["lioRescued", "brackenEscaped", "briarCrownFactionRevealed", "chapterFiveClear"] satisfies GameFlagKey[],
  requiredRescues: ["lio", "cellar-porter", "westroot-clerk", "road-warden"],
  requiredEvidence: ["transfer-ledger", "genuine-office-instruction", "false-seals", "examiner-transfer-record"],
  requiredItems: ["true_seal_fragment", "briar_chain_link"],
  enemies: ["bracken_voss", "thornseal_guard", "thornroot_sentry"],
  optionalOutcomes: ["quiet-entry", "lantern-restoration", "workshop-intervention", "silent-ambush", "tusker-victory"],
  guestRules: { maraFights: false, lioFights: false, guestsCanBeTargeted: false },
} as const;

export type BriarholdAlert = "quiet" | "suspicious" | "alerted";
export type BriarholdEntry = "culvert" | "receiving-gate" | "assault";
export type Chapter5Captive = typeof CHAPTER_5_CONTRACT.requiredRescues[number];
export type Chapter5Evidence = typeof CHAPTER_5_CONTRACT.requiredEvidence[number];

// Implementation defaults to evaluate in the interaction spike, not final painted symbols.
// Each lantern has its own set of panes: duplicates are legal, giving 4^3 arrangements.
export const CAPTIVE_LANTERN_PANES = [
  { id: "red", label: "Red", mark: "triangle" },
  { id: "blue", label: "Blue", mark: "circle" },
  { id: "green", label: "Green", mark: "square" },
  { id: "amber", label: "Amber", mark: "star" },
] as const;
export type LanternPane = typeof CAPTIVE_LANTERN_PANES[number]["id"];
export type LanternArrangement = readonly [LanternPane, LanternPane, LanternPane];
export const CAPTIVE_LANTERN_SIGNALS = [
  { id: "front-gate-alert", label: "Front Gate Alert", panes: ["red", "amber", "blue"] },
  { id: "command-center-recall", label: "Command Center Recall", panes: ["red", "blue", "amber"] },
  { id: "receiving-clear", label: "Receiving Clear", panes: ["green", "green", "blue"] },
  { id: "hold-deliveries", label: "Hold Deliveries", panes: ["amber", "red", "red"] },
] as const satisfies readonly { id: string; label: string; panes: LanternArrangement }[];
export type LanternSignal = typeof CAPTIVE_LANTERN_SIGNALS[number]["id"] | "meaningless";

export const CHAPTER_5_CHECKS = {
  receivingPrecision: { stat: "Precision", dc: 12 },
  receivingHeart: { stat: "Heart", dc: 12 },
  hide: { stat: "Instinct", dc: 12 },
  silentAmbush: { stat: "Precision", dc: 15 },
  unlitBrake: { stat: "Instinct", dc: 12 },
} as const;

export const CHAPTER_5_SCENE_IDS = {
  opening: "ch5-relay-departure",
  overlook: "ch5-overlook-shelter",
  hub: "ch5-briarhold-hub",
  ledger: "ch5-false-ledger",
  workshop: "ch5-thornseal-workshop",
  lanterns: "ch5-captive-lanterns",
  investigation: "ch5-investigating-guard",
  firstLio: "ch5-inspection-grille",
  boss: "ch5-crown-table",
  rescue: "ch5-carriage-rescue",
  captives: "ch5-captive-release",
  reunion: "ch5-sibling-reunion",
  woodsman: "ch5-woodsman",
  returnChoice: "ch5-tusker-hollow",
  homecoming: "ch5-bramblecross-homecoming",
  caseWall: "ch5-case-wall",
} as const;
