import type { GameFlagKey } from "../game/types";

export const CHAPTER_4_SCENE_IDS = {
  foldedMapGraybox: "chapter4.folded-map.graybox",
  foldedMapReview: "chapter4.folded-map.review",
  gatewrightOffer: "chapter4.gatewright.offer",
} as const;

export const CHAPTER_4_CHOICE_IDS = {
  surveyLantern: "folded-map.survey-lantern",
  keeperLantern: "folded-map.keeper-lantern",
  crownShortcut: "folded-map.crown-shortcut",
  rootArrow: "folded-map.root-arrow",
  brokenBridge: "folded-map.broken-bridge",
  back: "folded-map.back",
  close: "folded-map.close",
} as const;

export const FOLDED_MAP_MARKS = [
  {
    id: "survey_lantern",
    label: "Great Survey Lantern",
    symbol: "◈",
    description: "An official benchmark lantern beside a dated measurement line.",
    phase: "route",
  },
  {
    id: "keeper_lantern",
    label: "Keeper Lantern",
    symbol: "◇",
    description: "An older operational lantern on a local correction leaf.",
    phase: "route",
  },
  {
    id: "crown_shortcut",
    label: "Crown Shortcut",
    symbol: "♛",
    description: "A fast, straight route added in newer red ink.",
    phase: "route",
  },
  {
    id: "root_arrow",
    label: "Root Arrow",
    symbol: "↝",
    description: "A winding keeper arrow cut off by the flat page edge.",
    phase: "cache",
  },
  {
    id: "broken_bridge",
    label: "Broken Bridge Notch",
    symbol: "⌁",
    description: "A bridge notch that becomes continuous only across a second fold.",
    phase: "cache",
  },
] as const;

export type FoldedMapMarkId = (typeof FOLDED_MAP_MARKS)[number]["id"];

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
  trueRoutePair: ["survey_lantern", "keeper_lantern"],
  deeperPair: ["root_arrow", "broken_bridge"],
  decoyMark: "crown_shortcut",
  mistakeConsequence:
    "The crown alignment exposes a false straight route. The party corrects it, but the Listening Mile begins through a harder maintenance approach.",
  deeperReward: "lanternwell_drop",
  repeatRule: "Completed alignments remain reviewable and never grant the cache reward twice.",
} as const;

export const GATEWRIGHT_WEAPON_CONTRACT = {
  npcRole: "Westroot gatewright (name to be chosen with Chapter 4 dialogue)",
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
    attempt: "foldedMapAttempted",
    result: "foldedMapDecoded",
    laterResolution: "foldedMapDeeperSolved",
    repeatVisit: "Review both alignments; never repeat the cache reward.",
    backtracking: "Back clears one selected mark before closing the graybox.",
    companion: "Hints may change, but the interaction never requires a conscious companion.",
    failure: "The crown shortcut creates foldedMapMaintenanceDetour and remains fail-forward.",
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
