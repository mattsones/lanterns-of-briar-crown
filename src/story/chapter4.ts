import type { GameFlagKey } from "../game/types";

export const CHAPTER_4_SCENE_IDS = {
  lowerGateArrival: "chapter4.lower-gate.arrival",
  foldedMapGraybox: "chapter4.folded-map.graybox",
  foldedMapReview: "chapter4.folded-map.review",
  gatewrightOffer: "chapter4.gatewright.offer",
  gatewrightPurchase: "chapter4.gatewright.purchase",
  foldedMapBriefing: "chapter4.folded-map.briefing",
  underwayArrival: "chapter4.underway.arrival",
  underwayRoute: "chapter4.underway.route",
  underwayDetour: "chapter4.underway.detour",
  underwayAmbush: "chapter4.underway.ambush",
  listeningMileIntro: "chapter4.listening-mile.intro",
  listeningMileStationOne: "chapter4.listening-mile.station-one",
  listeningMileStationTwo: "chapter4.listening-mile.station-two",
  listeningMileResult: "chapter4.listening-mile.result",
} as const;

export const CHAPTER_4_CHOICE_IDS = {
  beginChapter: "chapter4.begin",
  meetGatewright: "chapter4.lower-gate.meet-gatewright",
  leaveLowerGate: "chapter4.lower-gate.leave",
  openSmithy: "chapter4.gatewright.open-smithy",
  buyHookblade: "chapter4.gatewright.buy-hookblade",
  buyPassagePike: "chapter4.gatewright.buy-passage-pike",
  buyCounterweightMaul: "chapter4.gatewright.buy-counterweight-maul",
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
  enterUnderway: "chapter4.underway.enter",
  inspectDetour: "chapter4.underway.inspect-detour",
  followMappedRoute: "chapter4.underway.follow-mapped-route",
  followPostedDetour: "chapter4.underway.follow-posted-detour",
  followKeeperRoute: "chapter4.underway.follow-keeper-route",
  followMaintenanceRoute: "chapter4.underway.follow-maintenance-route",
  prepareAmbush: "chapter4.underway.prepare-ambush",
  faceAmbush: "chapter4.underway.face-ambush",
  beginListeningMile: "chapter4.listening-mile.begin",
  listenForSignal: "chapter4.listening-mile.listen-for-signal",
  isolateSignal: "chapter4.listening-mile.isolate-signal",
  traceSignal: "chapter4.listening-mile.trace-signal",
  answerShelter: "chapter4.listening-mile.answer-shelter",
  answerSpeed: "chapter4.listening-mile.answer-speed",
  answerWarn: "chapter4.listening-mile.answer-warn",
  answerCommand: "chapter4.listening-mile.answer-command",
  answerRemember: "chapter4.listening-mile.answer-remember",
  answerConceal: "chapter4.listening-mile.answer-conceal",
  finishListeningMile: "chapter4.listening-mile.finish",
} as const;

export const CHAPTER_4_GATEWRIGHT = {
  name: "Tasmine Rootbrace",
  role: "Westroot smith and gatewright",
  pronouns: { subject: "she", object: "her", possessive: "her" },
} as const;

export const CHAPTER_4_ENTRY_COPY = {
  lowerGate: {
    name: "Westroot Lower Gate",
    text:
      "Bramwell and Noma walk with you from the Mossgarden to Westroot's Lower Gate. Bramwell carries the recovered transfer tag; Noma carries Edden's bundle of route drawings beside the Witness Stone rubbing. Their argument in Split Hall has softened into the practical rhythm of two people doing the same job from different sides.\n\nBelow the public gate, fitted stone narrows around an iron leaf that has not opened in years. A smithy occupies the last dry chamber before it: racks of road gear, an anvil sunk into the floor, and two old map cases laid open beneath a work lamp. A Stonekin woman looks up from the gate's counterweight housing as Bramwell raises a hand in greeting.",
  },
  gatewrightOffer: {
    name: "Tasmine Rootbrace",
    text:
      "“Tasmine Rootbrace,” Bramwell says. “She keeps the Lower Gate moving and half our hinges honest.”\n\n“The other half know what they did,” Tasmine says. She accepts the transfer tag from Bramwell, finds its stamp in the Lower Gate ledger, and traces the entry to the route notch used by the captured courier. Noma lays the Witness Stone rubbing beside it, then opens Edden's bundle to the drawings with the same broken contours.\n\nThe records agree on old route 811. A newer Survey revision draws 817 as a straighter line, but its dates and terrain marks do not agree. Tasmine sets the stitched working sheet beneath her lamp. “We can settle the route together. Before that, use the smithy. Buy, sell, compare, change your gear—whatever helps. The Underway will still be here when you are ready.”",
  },
  foldedMapBriefing: {
    name: "The Survey Cases",
    text:
      "Tasmine turns the stitched working sheet route-side up. The Great Survey revision occupies one face; an older road-crew correction was sewn behind it so workers could compare dates without carrying an archive case underground. Flat, the layers contradict each other. Folded along the charcoal handling marks, their benchmarks can meet.\n\nThe transfer tag proves which Lower Gate route was actually used. The Witness Stone rubbing authenticates the older correction. One sheet in Edden's bundle supplies the physical instruction: “The map lies flat. Two turns find the road. At the road-crew bridge, roots point beyond it.” Mara takes one steadying breath. “We follow clever,” she says. “Show me what agrees.”",
  },
  underwayArrival: {
    name: "The Riddle Road Underway",
    text:
      "Tasmine rests the corrected fold beside the Lower Gate's bronze route dial, finds the 811 notch, and works three counterweight levers in order. Iron settles. Cold air moves through the seam.\n\nBramwell returns the transfer tag. “Right people, right evidence, right road.” Noma hugs Mara, asks the rest of you to bring one another home, and walks back with Bramwell as the gate opens.\n\nYour lantern reaches only a short way into the fitted-stone passage. Route 811 bends west beyond the light.",
  },
  listeningMileIntro: {
    name: "The Listening Mile",
    text:
      "The lantern catches a brass rim in the wall: the first of three flared listening hoods. Fired-clay throats disappear into the stone toward distant bends, carrying the small sounds of the road to anyone who stops here.\n\nFresh boot scuffs continue west. Mara runs a thumb along the hood's deep rim and the old retaining pegs behind it. “If they brought Lio this way, he would know we might stop to listen.”",
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
  "underwayAmbushRevealed",
  "underwayAmbushPrepared",
];

export const CHAPTER_4_CONTRACT = {
  id: 4,
  title: "The Riddle Road",
  promise:
    "Follow corroborated route evidence instead of counterfeit speed, find Lio's message, and identify Briarhold Waystation as the rescue target.",
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
    "Bramwell and Noma's Lower Gate sendoff",
    "Tasmine's smithy and route records",
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
    current: ["underway"],
    planned: ["briarRelayPost"],
  },
  requiredItems: ["folded_map_scrap", "lios_courier_knot"],
  optionalItems: [
    "lanternwell_drop",
    "gatewright_hookblade",
    "gatewright_passage_pike",
    "gatewright_counterweight_maul",
    "ironroot_ribplate",
    "low_arch_roothelm",
  ],
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
    "Folding the east edge halfway and the north edge halfway creates a persuasive 817 straight road. Tracing it records why the later posted detour looks plausible, but it does not choose the party's route.",
  deeperReward: "lanternwell_drop",
  experimentRule:
    "Folding, unfolding, and turning over the flat sheet are free. Consequences occur only when the player traces a committed configuration.",
  evidenceRule:
    "With the front up, the west edge halfway and south edge three-quarters across align the dated lantern benchmark, road-crew ring, contour lines, and winding road at once. It is not identified by answer color or elimination.",
  repeatRule: "Recorded configurations remain reviewable and never grant the cache reward twice.",
} as const;

export const GATEWRIGHT_WEAPON_CONTRACTS = [
  {
    itemId: "gatewright_hookblade",
    price: 32,
    role: "control",
    summary: "Might +2, Precision +2, Craft +1; guard-breaking Passage Gatehook",
  },
  {
    itemId: "gatewright_passage_pike",
    price: 30,
    role: "precision",
    summary: "Precision +2, Instinct +2, Guard +1; piercing Sightline Thrust",
  },
  {
    itemId: "gatewright_counterweight_maul",
    price: 34,
    role: "force",
    summary: "Might +3, Grit +2; guard-breaking Counterweight Drop",
  },
] as const;

export type GatewrightWeaponId = (typeof GATEWRIGHT_WEAPON_CONTRACTS)[number]["itemId"];

export const GATEWRIGHT_WEAPON_CONTRACT = {
  npcRole: `${CHAPTER_4_GATEWRIGHT.name}, ${CHAPTER_4_GATEWRIGHT.role}`,
  itemId: GATEWRIGHT_WEAPON_CONTRACTS[0].itemId,
  price: GATEWRIGHT_WEAPON_CONTRACTS[0].price,
  inventory: GATEWRIGHT_WEAPON_CONTRACTS,
  availableBeforeRegion: "underway",
  purchaseRequired: false,
  accessRequired: true,
  durability: false,
  comparisonBaseline: "pebbleknock_hammer",
  rationale:
    "The canonical Chapter 3 fixture carries 78 gold, so every individual pattern is immediately affordable and two can be bought if the player values the tradeoff. The hammer remains usable; no critical path checks a purchase.",
} as const;

export const UNDERWAY_CONTRACT = {
  region: "underway",
  topology: "one mapped approach, a later posted detour choice, and two branches that converge before the Listening Mile",
  trueRoute: "mapped-gallery",
  pressuredRoute: "maintenance-gallery",
  decision:
    "The party is already following mapped route 811 when a legitimate-looking closure board directs traffic into maintenance route 817. Current safety guidance and older route evidence are both reasonable to trust.",
  ambush: {
    hiddenCheck: "Instinct DC 16",
    normalEncounter: "underwayAmbush",
    pressuredEncounter: "underwayAmbushHard",
    revealBenefit: "The enemy marker appears and the party may prepare, start first, and gain 4 guard.",
    failureRule: "A normal miss exposes no marker or failure message before the ambush triggers.",
  },
  convergence: "Both approaches and both ambush states reach the Listening Mile.",
} as const;

export const LISTENING_MILE_CONTRACT = {
  outcomes: ["marker-found"],
  failForward: "The acoustic investigation can be retried and always reaches Lio's quickly hidden trail marker.",
  mechanism:
    "Flared wall hoods carry footsteps, tools, and shutters around blind bends through fired-clay conduits. Three separate map posts make the player travel between each listening beat.",
} as const;

export const CHAPTER_4_INTERACTION_STATE_MATRIX = {
  foldedMap: {
    knowledge: "Edden wrote that the map lies flat; Westroot identifies the Survey revision and the older road-crew correction.",
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
    knowledge: "The party learns that passive listening hoods carry present sounds around blind bends, then finds Lio's familiar blue courier knot hidden behind one hood.",
    availability: "The Folded Map has been decoded and the blind-junction ambush has been cleared.",
    attempt: "listeningMileAttempted",
    result: "listeningMileOutcome",
    laterResolution: "The courier knot and a tiny scratch point to the hiding place of Lio's written message.",
    repeatVisit: "Review the hidden knot and current road sounds without repeating the investigation.",
    backtracking: "Return to the first listening post before inspecting the final hood.",
    companion: "Companions provide hints only.",
    failure: "No route or moral answer can fail; the party follows present road sounds and inspects the hood where Lio's captors had to stop.",
    saveCompatibility: "Chapter 4 completion infers that the circuit was attempted.",
  },
} as const;
