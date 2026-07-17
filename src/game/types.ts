export type StatBlock = Record<string, number>;
export type Inventory = Record<string, number>;

export type ChapterId = 1 | 2 | 3 | 4 | 5;

export type CompanionId = "rowan" | "tilda" | "moss";
export type CompanionStatus = "recruited" | "declined" | null;
export type MaraJob = "lioMarks" | "eddenDrawing" | "lanternSigns" | "safety" | null;

export type GameFlags = {
  metElder: boolean;
  elderGavePurse: boolean;
  smithStarterDiscountUsed: boolean;
  gotSmithGift: boolean;
  homeStashClaimed: boolean;
  openedChest: boolean;
  craftedPotion: boolean;
  gotPibbleTip: boolean;
  beatGateBattle: boolean;
  reportedSatchelToElder: boolean;
  metNix: boolean;
  foundRuinNote: boolean;
  clearedWildBattle: boolean;
  reachedBramblecross: boolean;
  enteredBramblecross: boolean;
  metMayor: boolean;
  readBoard: boolean;
  boardQuestAccepted: boolean;
  boardQuestCompleted: boolean;
  marketDiscount: boolean;
  ennaBriefed: boolean;
  watchEvidenceRead: boolean;
  watchLedgerRead: boolean;
  watchMapRead: boolean;
  watchOrdersRead: boolean;
  heardAboutEdden: boolean;
  askedHollisAboutEdden: boolean;
  gotDungeonLead: boolean;
  enteredRootCellar: boolean;
  openedCellarCache: boolean;
  readCellarSigil: boolean;
  readCellarMural: boolean;
  harvestedCellarFungus: boolean;
  beatCellarSkulk: boolean;
  beatCellarBoss: boolean;
  chapterOneClear: boolean;
  cellarEndChoice: string | null;
  chapterReported: boolean;
  studiedBriarCrown: boolean;
  rowanStatus: CompanionStatus;
  tildaStatus: CompanionStatus;
  mossStatus: CompanionStatus;
  companionChosen: boolean;
  companionChoice: CompanionId | null;
  helpedTraveler: boolean;
  searchedCart: boolean;
  cartRecoveredForAda: boolean;
  openedWildChest: boolean;
  wellVisited: boolean;
  pondVisited: boolean;
  pondForaged: boolean;
  usedShrine: boolean;
  sawShrine: boolean;
  foundShrineSecret: boolean;
  sawRoadCamp: boolean;
  chapterTwoStarted: boolean;
  chapterTwoBriefed: boolean;
  maraJoined: boolean;
  eddenVisited: boolean;
  eddenDrawingReceived: boolean;
  eddensDrawingValidated: boolean;
  adaSealLessonComplete: boolean;
  maraJob: MaraJob;
  westrootCutStudied: boolean;
  brokenSealWaxFound: boolean;
  shelterNoticeRemoved: boolean;
  shelterRested: boolean;
  lioShelterMarkFound: boolean;
  falseNoticeInspected: boolean;
  falseNoticeLensUsed: boolean;
  falseNoticeLanternRead: boolean;
  trustedLanternBeforeHollow: boolean;
  followedFalseDetour: boolean;
  crownSignRejected: boolean;
  crownSignLensUsed: boolean;
  crownDoorTried: boolean;
  enteredFalseCrownPassage: boolean;
  crownDoorKeyFound: boolean;
  crownDoorUnlocked: boolean;
  crownDoorDungeonEntered: boolean;
  crownDoorWaxTableCleared: boolean;
  crownDoorSlatsBroken: boolean;
  crownDoorWitnessLedgerFound: boolean;
  crownDoorCollarsBroken: boolean;
  crownDoorFalseMapRead: boolean;
  crownDoorDungeonCleared: boolean;
  cleanedLanternMarkFound: boolean;
  beatCrownDenGuard: boolean;
  crownDoorGuardDefeated: boolean;
  crownDenAlertLevel: number;
  crownDenPatrolDefeated: boolean;
  crownDenPatrolEscaped: boolean;
  crownDenHoundFreed: boolean;
  crownDenHoundDefeated: boolean;
  maraQuestionedCrownDoor: boolean;
  willowForgeryConfirmedAtHollow: boolean;
  lanternSignCleaned: boolean;
  lanternSignCompared: boolean;
  understandsTrueSigns: boolean;
  lanternDoorTried: boolean;
  maraQuestionedLanternDoor: boolean;
  eddensDrawingRotated: boolean;
  maraWatchedLantern: boolean;
  maraConsultedAtThreshold: boolean;
  companionReadThreshold: boolean;
  noHandleStoneInspected: boolean;
  lioHookMarkFound: boolean;
  maraAskedNoHandleMark: boolean;
  companionReadNoHandleDoor: boolean;
  noHandleDoorStudied: boolean;
  eddenDrawingComparedAtDoor: boolean;
  incompleteTruthPhraseSpoken: boolean;
  trustedCrownSignAtHollow: boolean;
  forcedNoHandleDoor: boolean;
  forcedNoHandleDoorTwice: boolean;
  westrootGateOpened: boolean;
  westrootGateOpeningPending: boolean;
  cleanWestrootSolve: boolean;
  messyWestrootSolve: boolean;
  beatRoadwatcher: boolean;
  roadwatcherSummoned: boolean;
  roadwatcherPrepared: boolean;
  maraProtectedAtHollow: boolean;
  roadwatcherEncounterAvoided: boolean;
  roadwatcherDefeated: boolean;
  roadwatcherHardCleared: boolean;
  roadwatcherEvidenceFound: boolean;
  briarCrownWatchingWestroot: boolean;
  lioAlivePastGate: boolean;
  searchedWestrootThreshold: boolean;
  witnessNoteSent: boolean;
  chapterTwoClear: boolean;
  chapterThreeStarted: boolean;
  metBramwell: boolean;
  metNoma: boolean;
  metQuill: boolean;
  metAuntieLume: boolean;
  metRootbreadChild: boolean;
  rootbreadPromiseKept: boolean;
  lioKnotFound: boolean;
  witnessStoneFirstAttemptMissed: boolean;
  westrootTrustEarned: boolean;
  witnessStoneSequenceSolved: boolean;
  willowCargoExposed: boolean;
  cargoRunnerCaptured: boolean;
  cargoRunnerEscaped: boolean;
  chapterThreeClear: boolean;
  chapterFourStarted: boolean;
  foldedMapDecoded: boolean;
  captivePorterHelped: boolean;
  lioMessageFound: boolean;
  princessNameSeen: boolean;
  briarholdLeadFound: boolean;
  chapterFourClear: boolean;
  chapterFiveStarted: boolean;
  captiveLanternsRestored: boolean;
  lioRescued: boolean;
  brackenEscaped: boolean;
  briarCrownFactionRevealed: boolean;
  livingBriarMarkSeen: boolean;
  chapterFiveClear: boolean;
};

export type GameFlagKey = keyof GameFlags;
export type Flags = Partial<GameFlags>;

export type Equipment = {
  weapon: string | null;
  helm: string | null;
  cloak: string | null;
  trinket1: string | null;
  trinket2: string | null;
  armor: string | null;
  [slot: string]: string | null;
};

export type BattlePouch = {
  slot1: string | null;
  slot2: string | null;
  [slot: string]: string | null;
};

export type Position = {
  x: number;
  y: number;
};

export type Player = {
  name: string;
  gender: string;
  raceId: string;
  humanHeritageId: string;
  appearanceId: string;
  level: number;
  xp: number;
  gold: number;
  maxHp: number;
  hp: number;
  baseStats: StatBlock;
  inventory: Inventory;
  equipment: Equipment;
  battlePouch: BattlePouch;
  checkpointLabel: string;
  [key: string]: unknown;
};

export type Companion = {
  recruited: boolean;
  id: string | null;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  command: string;
  buffed: boolean;
  style: string | null;
  icon: string | null;
  role: string | null;
  futurePath: string | null;
  futurePathOptions: unknown[] | null;
  [key: string]: unknown;
};

export type GuestNpcId = "mara";

export type GuestNpc = {
  id: GuestNpcId;
  name: string;
  role: string;
  present: boolean;
  mapTokenIcon: string;
  statusText: string;
  participatesInBattle: false;
  canTakeDamage: false;
};

export type SavePayload = {
  screen: string;
  chapterId?: ChapterId;
  player: Player;
  region: string;
  position: Position;
  visited: Record<string, Record<string, boolean>>;
  companion: Companion;
  guestNpc?: GuestNpc | null;
  flags: Flags;
  quest: unknown;
  toast: string;
};

export type SaveSlot = {
  id: number;
  name: string;
  updatedAt: number | null;
  payload: SavePayload | null;
};

export type RollSpec = {
  count: number;
  sides: number;
  bonus?: number;
};

export type RollResult = {
  rolls: number[];
  total: number;
  notation: string;
};

export type SkillCheckResult = {
  stat: string;
  dc: number;
  roll: number;
  bonus: number;
  total: number;
  success: boolean;
  label: string;
};

export type Enemy = {
  name: string;
  icon: string;
  artwork?: {
    src: string;
    alt: string;
  };
  hp: number;
  maxHp: number;
  intentA: string;
  intentB: string;
  intent: string;
  currentAttackSpec: RollSpec;
  attackA: RollSpec;
  attackB: RollSpec;
  guardBroken: boolean;
  weakened: boolean;
};

export type Battle = {
  enemy: Enemy;
  queue: Enemy[];
  totalEnemies: number;
  rewardKey: string;
  turn: string;
  heroGuard: number;
  cooldowns: Record<string, number>;
  finished: boolean;
  log: string[];
};
