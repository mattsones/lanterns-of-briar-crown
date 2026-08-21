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
  route811Cache: "chapter4.underway.route-811-cache",
  route817SignalRig: "chapter4.underway.route-817-signal-rig",
  underwayAmbush: "chapter4.underway.ambush",
  listeningMileIntro: "chapter4.listening-mile.intro",
  listeningMileStationOne: "chapter4.listening-mile.station-one",
  listeningMileStationTwo: "chapter4.listening-mile.station-two",
  listeningMileResult: "chapter4.listening-mile.result",
  lioMessageDiscovery: "chapter4.lio-message.discovery",
  lioMessageResponse: "chapter4.lio-message.response",
  lioMessageReview: "chapter4.lio-message.review",
  relayArrival: "chapter4.relay.arrival",
  royalProgressBroadside: "chapter4.relay.royal-progress",
  relayGuard: "chapter4.relay.guard",
  forgedAuthority: "chapter4.relay.forged-authority",
  briarholdReveal: "chapter4.relay.briarhold-reveal",
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
  takeWaykeeperHelm: "chapter4.underway.take-waykeeper-helm",
  studySignalRig: "chapter4.underway.study-signal-rig",
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
  inspectLioMessage: "chapter4.lio-message.inspect",
  readLioMessage: "chapter4.lio-message.read",
  finishLioMessage: "chapter4.lio-message.finish",
  enterRelayPost: "chapter4.relay.enter",
  readRoyalProgress: "chapter4.relay.read-royal-progress",
  faceRelayGuard: "chapter4.relay.face-guard",
  inspectForgedOrder: "chapter4.relay.inspect-forged-order",
  traceBriarhold: "chapter4.relay.trace-briarhold",
  finishChapterFour: "chapter4.finish",
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
      "“Tasmine Rootbrace,” Bramwell says. “She keeps the Lower Gate moving and half our hinges honest.”\n\n“The other half know what they did,” Tasmine says. She accepts the transfer tag from Bramwell, finds its stamp in the Lower Gate ledger, and traces the entry to the route notch used by the captured courier. Noma lays the Witness Stone rubbing beside it, then opens Edden's bundle to the drawings with the same broken contours.\n\nThe records agree on the Old Keeper Road. A newer Survey revision proposes a straighter shortcut, but its dates and terrain marks do not agree. Tasmine taps a fresh circular tucked into the ledger. “Princess Elowen is making her first Royal Progress without the King and Queen this year. Every road office has been told to ready its books. If she reaches Rainroot, I would rather show her an honest disagreement than a tidy lie.”\n\nTasmine sets the stitched working sheet beneath her lamp. “We can settle the route together. Before that, use the smithy. Buy, sell, compare, change your gear—whatever helps. The Underway will still be here when you are ready.”",
  },
  foldedMapBriefing: {
    name: "The Survey Cases",
    text:
      "Tasmine turns the stitched working sheet route-side up. The Great Survey revision occupies one face; an older road-crew correction was sewn behind it so workers could compare dates without carrying an archive case underground. Flat, the layers contradict each other. Folded along the charcoal handling marks, their benchmarks can meet.\n\nThe transfer tag proves which Lower Gate route was actually used. The Witness Stone rubbing authenticates the older correction. One sheet in Edden's bundle supplies the physical instruction: “The map lies flat. Two turns find the road. At the road-crew bridge, roots point beyond it.” Mara takes one steadying breath. “We follow clever,” she says. “Show me what agrees.”",
  },
  underwayArrival: {
    name: "The Riddle Road Underway",
    text:
      "Tasmine rests the corrected fold beside the Lower Gate's bronze route dial, finds the old keeper notch, and works three counterweight levers in order. Iron settles. Cold air moves through the seam.\n\nBramwell returns the transfer tag. “Right people, right evidence, right road.” Noma hugs Mara, asks the rest of you to bring one another home, and walks back with Bramwell as the gate opens.\n\nYour lantern reaches only a short way into the fitted-stone passage. The Old Keeper Road bends west beyond the light.",
  },
  listeningMileIntro: {
    name: "The Listening Mile",
    text:
      "The lantern catches a brass rim in the wall: a flared listening hood set at shoulder height. Its fired-clay throat disappears into the stone toward a bend your light cannot reach. A second mouth faces back the way you came.\n\nFresh boot scuffs continue west. Mara runs a thumb along the hood's deep rim and the old retaining pegs behind it. “Road crews used these to hear around blind stone,” she says. “If they brought Lio this way, he would know we might stop here.”",
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
  "royalProgressLearned",
  "princessNameSeen",
  "briarRelayCleared",
  "briarholdLeadFound",
  "chapterFourClear",
];

export const CHAPTER_4_OPTIONAL_FLAGS: GameFlagKey[] = [
  "gatewrightWeaponPurchased",
  "captivePorterHelped",
  "underwayAmbushRevealed",
  "underwayAmbushPrepared",
  "underway811CacheFound",
  "underway817SignalRigRead",
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
    current: [
      "underway",
      "underwayRoute811",
      "underwayRoute817",
      "underwayConvergence",
      "listeningPostOne",
      "listeningPostTwo",
      "listeningPostThree",
      "relayApproach",
      "briarRelayPost",
    ],
    planned: [],
  },
  requiredItems: ["folded_map_scrap", "lios_courier_knot"],
  optionalItems: [
    "gatewright_hookblade",
    "gatewright_passage_pike",
    "gatewright_counterweight_maul",
    "ironroot_ribplate",
    "low_arch_roothelm",
    "old_waykeeper_helm",
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
  requiredFoldCount: 2,
  mistakeConsequence:
    "Folding the east edge halfway and the north edge halfway creates a persuasive Survey Shortcut. Its failed terrain evidence is separate from the later in-world construction detour.",
  experimentRule:
    "Folding, unfolding, and turning over the flat sheet are free. Consequences occur only when the player traces a committed configuration.",
  evidenceRule:
    "With the front up, the west edge halfway and south edge three-quarters across align the dated lantern benchmark, road-crew ring, contour lines, and winding road at once. It is not identified by answer color or elimination.",
  repeatRule: "Recorded configurations remain reviewable without changing the chosen Underway route.",
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
    "The party is already following the Old Keeper Road when a legitimate-looking closure board directs traffic into a construction detour that does not appear in the Folded Map. Current safety guidance and older route evidence are both reasonable to trust.",
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
    "Flared wall hoods carry present footsteps, voices, tools, and shutters around blind bends through fired-clay conduits. Each later hood is discovered only after crossing its own separate tunnel map.",
} as const;

export const LIO_MESSAGE_CONTRACT = {
  prerequisite: "listeningMileAttempted",
  result: "lioMessageFound",
  item: "lios_courier_knot",
  message:
    "M—do not follow angry. Follow clever. Taking us west. Still me. — L",
  confirmation:
    "Lio was being taken west with at least one other prisoner and left Mara a deliberate warning about how to follow.",
  repeatRule: "The message and Mara's reading remain reviewable; the courier knot is awarded only once.",
} as const;

export const CHAPTER_4_INTERACTION_STATE_MATRIX = {
  foldedMap: {
    knowledge: "Edden wrote that the map lies flat; Westroot identifies the Survey revision and the older road-crew correction.",
    availability: "Chapter 3 is complete and the gatewright has made the Lower Gate route available.",
    attempt: "Tracing the currently folded configuration sets foldedMapAttempted.",
    result: "foldedMapDecoded",
    laterResolution: "The two-fold Old Keeper Road decode completes the interaction.",
    repeatVisit: "Review recorded alignments without changing the chosen Underway route.",
    backtracking: "Back unfolds the most recently moved edge before closing the prototype.",
    companion: "Hints may change, but the interaction never requires a conscious companion.",
    failure: "Only committing the persuasive east-half plus north-half Survey Shortcut sets the legacy foldedMapMaintenanceDetour field; ordinary experimentation is free.",
    saveCompatibility: "Decoded saves infer attempt and Chapter 4 start; retired deeper-solve saves still migrate as decoded.",
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
  lioMessage: {
    knowledge: "Lio's knot and scratch point from the final listening hood to a loose route-record plate.",
    availability: "The Listening Mile trail marker has been found.",
    attempt: "Opening the plate reveals the message without a check.",
    result: "lioMessageFound",
    laterResolution: "The message points west; the party must identify the Relay Post and later destination from separate physical records.",
    repeatVisit: "Review Lio's exact words and Mara's settled reading without awarding the knot again.",
    backtracking: "Return to the third listening post and the dark Underway.",
    companion: "Mara is the required story reader; the recruited combat companion does not gate the scene.",
    failure: "There is no failure branch after the physical trail has been found.",
    saveCompatibility: "Chapter 4 completion infers that Lio's message was found.",
  },
} as const;
