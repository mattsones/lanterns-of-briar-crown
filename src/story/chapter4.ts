import type { GameFlagKey } from "../game/types";

export const CHAPTER_4_SCENE_IDS = {
  lowerGateArrival: "chapter4.lower-gate.arrival",
  foldedMapGraybox: "chapter4.folded-map.graybox",
  foldedMapReview: "chapter4.folded-map.review",
  gatewrightOffer: "chapter4.gatewright.offer",
  gatewrightPurchase: "chapter4.gatewright.purchase",
  foldedMapBriefing: "chapter4.folded-map.briefing",
} as const;

export const CHAPTER_4_CHOICE_IDS = {
  beginChapter: "chapter4.begin",
  meetGatewright: "chapter4.lower-gate.meet-gatewright",
  leaveLowerGate: "chapter4.lower-gate.leave",
  buyHookblade: "chapter4.gatewright.buy-hookblade",
  declineHookblade: "chapter4.gatewright.decline-hookblade",
  returnToWestroot: "chapter4.gatewright.return-westroot",
  continueToMap: "chapter4.gatewright.continue-to-map",
  openFoldedMap: "chapter4.folded-map.open",
  backToGatewright: "chapter4.folded-map.back-to-gatewright",
  leftEdge: "folded-map.edge-left",
  rightEdge: "folded-map.edge-right",
  topEdge: "folded-map.edge-top",
  bottomEdge: "folded-map.edge-bottom",
  flipMap: "folded-map.flip-map",
  traceRoute: "folded-map.trace-route",
  resetFolds: "folded-map.reset-folds",
  back: "folded-map.back",
  close: "folded-map.close",
} as const;

export const CHAPTER_4_GATEWRIGHT = {
  name: "Tamsin Rootbrace",
  role: "Westroot gatewright",
  pronouns: { subject: "she", object: "her", possessive: "her" },
} as const;

export const CHAPTER_4_ENTRY_COPY = {
  lowerGate: {
    name: "Westroot Lower Gate",
    text:
      "Below the public gate, Westroot's fitted stone narrows around an iron leaf that has not opened in years. Fresh chalk now marks the old hinge checks. Beyond it, the Underway slopes west beneath Rainroot—not toward the border, but toward keeper roads erased from newer Survey copies.\n\nA Stonekin gatewright waits beside a workbench and two map cases. Mara reaches for the latch. The gatewright reaches it first.",
  },
  gatewrightOffer: {
    name: "Tamsin Rootbrace",
    text:
      "“Tamsin Rootbrace,” the gatewright says. “I open old roads after I know what will come back through them.” She compares your cargo transfer tag with a witnessed Lower Gate ledger, then sets two records side by side: the Great Survey's revised route face and an older keeper correction leaf.\n\n“The newer sheet promises route 817—straight, official, quick. The keeper leaf still marks 811 and a winding approach. Compare both before you trust either.”\n\nTamsin also lays out a short hooked blade built for roots, shield rims, and narrow stonework. The Rare Gatewright Hookblade costs 32 gold. It improves on the Pebbleknock Hammer, but buying it is optional and it will remain in your inventory until you choose to equip it.",
  },
  foldedMapBriefing: {
    name: "The Survey Cases",
    text:
      "Tamsin opens both cases under the same lamp. The Great Survey records a clean revision. The keeper correction records the older operating marks Westroot actually used: an 811 lantern ring, broken contour strokes, and a road that reaches the Underway only when the sheet is folded.\n\nEdden's note supplies the missing instruction: “The map lies flat. Two turns find the road. The bridge breaks twice.” Mara takes one steadying breath. “We follow clever,” she says. “Show me what agrees.”",
  },
} as const;

export const FOLDED_MAP_EDGES = [
  { id: "left", label: "west edge" },
  { id: "right", label: "east edge" },
  { id: "top", label: "north edge" },
  { id: "bottom", label: "south edge" },
] as const;

export const FOLDED_MAP_LANDINGS = [
  { id: "quarter", depth: 0.25, label: "one-quarter across" },
  { id: "half", depth: 0.5, label: "halfway across" },
  { id: "three-quarter", depth: 0.75, label: "three-quarters across" },
] as const;

export type FoldedMapEdge = (typeof FOLDED_MAP_EDGES)[number]["id"];
export type FoldedMapLanding = (typeof FOLDED_MAP_LANDINGS)[number]["id"];
export type FoldedMapSide = "front" | "back";

export const CHAPTER_4_REQUIRED_ENTRY_FLAGS: GameFlagKey[] = [
  "chapterReported",
  "chapterTwoClear",
  "maraJoined",
  "westrootGateOpened",
  "lioAlivePastGate",
  "eddensDrawingValidated",
  "briarCrownWatchingWestroot",
  "chapterThreeStarted",
  "westrootTrustEarned",
  "witnessStoneSequenceSolved",
  "willowCargoExposed",
  "chapterThreeClear",
];

export const CHAPTER_4_REQUIRED_END_FLAGS: GameFlagKey[] = [
  "chapterFourStarted",
  "gatewrightMet",
  "foldedMapDecoded",
  "listeningMileAttempted",
  "lioMessageFound",
  "princessNameSeen",
  "briarRelayCleared",
  "briarholdLeadFound",
  "chapterFourClear",
];

export const CHAPTER_4_OPTIONAL_FLAGS: GameFlagKey[] = [
  "gatewrightWeaponPurchased",
  "foldedMapDeeperSolved",
  "foldedMapCacheClaimed",
  "captivePorterHelped",
];

export const CHAPTER_4_CONTRACT = {
  id: 4,
  title: "The Riddle Road",
  promise:
    "Follow keeper evidence instead of counterfeit speed, find Lio's message, and identify Briarhold Waystation as the rescue target.",
  nonGoals: [
    "Do not rescue Lio before Chapter 5.",
    "Do not require the optional Rootbread Promise or captive porter thread.",
    "Do not introduce weapon durability or force a return to Hearthhollow.",
    "Do not reveal the entire Briar Crown hierarchy.",
  ],
  entry: {
    fixture: "/saves/chapter-3-complete.json",
    region: "westrootHub",
    requiredFlags: CHAPTER_4_REQUIRED_ENTRY_FLAGS,
    requiredItems: [
      "eddens_three_door_drawing",
      "witness_stone_rubbing",
      "cargo_transfer_tag",
    ],
  },
  route: [
    "Westroot Lower Gate and gatewright",
    "Survey Correction Room / Folded Map",
    "Underway",
    "Listening Mile",
    "optional captive porter",
    "Lio's message",
    "Briar Relay Post",
    "Briarhold lead and Chapter 5 handoff",
  ],
  regions: {
    existingEntry: "westrootHub",
    planned: ["underway", "listeningMile", "briarRelayPost"],
  },
  requiredItems: ["folded_map_scrap", "lios_courier_knot"],
  optionalItems: ["lanternwell_drop", "gatewright_hookblade"],
  enemies: ["briar_relay_guard", "seal_forged_sentry", "crown_whisperer"],
  encounter: "briarRelay",
  requiredEndFlags: CHAPTER_4_REQUIRED_END_FLAGS,
  optionalFlags: CHAPTER_4_OPTIONAL_FLAGS,
  endpoint:
    "The party has Lio's own message and a witnessed route to Briarhold Waystation; Chapter 5 is named but not entered automatically.",
} as const;

export const FOLDED_MAP_CONTRACT = {
  sheet: "one opaque two-sided rectangle",
  edges: FOLDED_MAP_EDGES,
  landings: FOLDED_MAP_LANDINGS,
  twoFoldConfigurationCount: 54,
  trueRouteConfiguration: {
    side: "front",
    folds: { left: "half", right: null, top: null, bottom: "three-quarter" },
  },
  temptingFalseConfiguration: {
    side: "front",
    folds: { left: null, right: "half", top: "half", bottom: null },
  },
  deeperConfiguration: {
    side: "front",
    folds: { left: "half", right: null, top: "quarter", bottom: "three-quarter" },
  },
  requiredFoldCount: 2,
  deeperFoldCount: 3,
  mistakeConsequence:
    "Folding the east edge halfway and the north edge halfway creates a persuasive 817 straight road. Committing to it exposes a sealed maintenance approach and adds later pressure without blocking progress.",
  deeperReward: "lanternwell_drop",
  experimentRule:
    "Folding, unfolding, and turning over the flat sheet are free. Consequences occur only when the player traces a committed configuration.",
  evidenceRule:
    "With the front up, the west edge halfway and south edge three-quarters across align the dated lantern benchmark, keeper ring, contour lines, and winding road at once. It is not identified by answer color or elimination.",
  repeatRule: "Recorded configurations remain reviewable and never grant the cache reward twice.",
} as const;

export const GATEWRIGHT_WEAPON_CONTRACT = {
  npcRole: `${CHAPTER_4_GATEWRIGHT.name}, ${CHAPTER_4_GATEWRIGHT.role}`,
  itemId: "gatewright_hookblade",
  price: 32,
  availableBeforeRegion: "underway",
  purchaseRequired: false,
  accessRequired: true,
  durability: false,
  comparisonBaseline: "pebbleknock_hammer",
  rationale:
    "The canonical Chapter 3 fixture carries 78 gold, so the upgrade is immediately affordable while leaving room for supplies. The hammer remains usable; no critical path checks the purchase.",
} as const;

export const LISTENING_MILE_CONTRACT = {
  outcomes: ["guidance", "maintenance"],
  failForward:
    "Fear-driven or command-first answers use a keeper-designed maintenance passage with greater encounter pressure; both outcomes reach Lio's message.",
  mechanism:
    "Choice plates, echo tubes, and signal shutters record and repeat selections. The road does not judge thoughts or detect lies.",
} as const;

export const CHAPTER_4_INTERACTION_STATE_MATRIX = {
  foldedMap: {
    knowledge: "Edden wrote that the map lies flat; Westroot identifies Survey and keeper layers.",
    availability: "Chapter 3 is complete and the gatewright has made the Lower Gate route available.",
    attempt: "Tracing the currently folded configuration sets foldedMapAttempted.",
    result: "foldedMapDecoded",
    laterResolution: "foldedMapDeeperSolved",
    repeatVisit: "Review recorded alignments; never repeat the cache reward.",
    backtracking: "Back unfolds the most recently moved edge before closing the prototype.",
    companion: "Hints may change, but the interaction never requires a conscious companion.",
    failure: "Only committing the persuasive east-half plus north-half configuration creates foldedMapMaintenanceDetour; ordinary experimentation is free.",
    saveCompatibility: "Decoded or deeper-solved saves infer attempt and Chapter 4 start.",
  },
  listeningMile: {
    knowledge: "The party is told that the circuit records route practice, not moral truth.",
    availability: "The Folded Map has been decoded.",
    attempt: "listeningMileAttempted",
    result: "listeningMileOutcome",
    laterResolution: "Both outcomes converge before Lio's message.",
    repeatVisit: "Review recorded answers without rerolling the route consequence.",
    backtracking: "Return to the circuit entrance before committing the final answer.",
    companion: "Companions provide hints only.",
    failure: "Maintenance outcome increases route pressure without blocking progress.",
    saveCompatibility: "Chapter 4 completion infers that the circuit was attempted.",
  },
} as const;
