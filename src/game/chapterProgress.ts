import type { ChapterId, Flags, GameFlagKey } from "./types";

export type ChapterDefinition = {
  id: ChapterId;
  title: string;
  startFlag: GameFlagKey | null;
  completeFlag: GameFlagKey;
};

export const CHAPTER_DEFINITIONS: Record<ChapterId, ChapterDefinition> = {
  1: {
    id: 1,
    title: "The Road That Lied",
    startFlag: null,
    completeFlag: "chapterReported",
  },
  2: {
    id: 2,
    title: "The Westroot Trail",
    startFlag: "chapterTwoStarted",
    completeFlag: "chapterTwoClear",
  },
  3: {
    id: 3,
    title: "The Hidden Root",
    startFlag: "chapterThreeStarted",
    completeFlag: "chapterThreeClear",
  },
  4: {
    id: 4,
    title: "The Riddle Road",
    startFlag: "chapterFourStarted",
    completeFlag: "chapterFourClear",
  },
  5: {
    id: 5,
    title: "Briarhold Waystation",
    startFlag: "chapterFiveStarted",
    completeFlag: "chapterFiveClear",
  },
};

export const CHAPTER_FLAG_DEFAULTS: Flags = {
  chapterTwoStarted: false,
  chapterTwoBriefed: false,
  maraJoined: false,
  eddenVisited: false,
  eddenDrawingReceived: false,
  eddensDrawingValidated: false,
  adaSealLessonComplete: false,
  lioAlivePastGate: false,
  briarCrownWatchingWestroot: false,
  westrootCutStudied: false,
  brokenSealWaxFound: false,
  shelterNoticeRemoved: false,
  shelterRested: false,
  lioShelterMarkFound: false,
  falseNoticeInspected: false,
  falseNoticeLensUsed: false,
  falseNoticeLanternRead: false,
  trustedLanternBeforeHollow: false,
  followedFalseDetour: false,
  crownSignRejected: false,
  crownSignLensUsed: false,
  crownDoorTried: false,
  enteredFalseCrownPassage: false,
  crownDoorKeyFound: false,
  crownDoorUnlocked: false,
  crownDoorDungeonEntered: false,
  crownDoorWaxTableCleared: false,
  crownDoorSlatsBroken: false,
  crownDoorWitnessLedgerFound: false,
  crownDoorCollarsBroken: false,
  crownDoorFalseMapRead: false,
  crownDoorDungeonCleared: false,
  cleanedLanternMarkFound: false,
  beatCrownDenGuard: false,
  crownDoorGuardDefeated: false,
  maraQuestionedCrownDoor: false,
  willowForgeryConfirmedAtHollow: false,
  lanternSignCleaned: false,
  lanternSignCompared: false,
  understandsTrueSigns: false,
  lanternDoorTried: false,
  maraQuestionedLanternDoor: false,
  eddensDrawingRotated: false,
  noHandleStoneInspected: false,
  lioHookMarkFound: false,
  maraAskedNoHandleMark: false,
  noHandleDoorStudied: false,
  eddenDrawingComparedAtDoor: false,
  incompleteTruthPhraseSpoken: false,
  trustedCrownSignAtHollow: false,
  forcedNoHandleDoor: false,
  forcedNoHandleDoorTwice: false,
  westrootGateOpened: false,
  westrootGateOpeningPending: false,
  cleanWestrootSolve: false,
  messyWestrootSolve: false,
  roadwatcherSummoned: false,
  roadwatcherPrepared: false,
  maraProtectedAtHollow: false,
  roadwatcherEncounterAvoided: false,
  roadwatcherDefeated: false,
  roadwatcherEvidenceFound: false,
  chapterTwoClear: false,
  chapterThreeStarted: false,
  metBramwell: false,
  metNoma: false,
  metQuill: false,
  metAuntieLume: false,
  metRootbreadChild: false,
  rootbreadPromiseKept: false,
  lioKnotFound: false,
  witnessStoneFirstAttemptMissed: false,
  westrootTrustEarned: false,
  witnessStoneSequenceSolved: false,
  willowCargoExposed: false,
  cargoRunnerCaptured: false,
  cargoRunnerEscaped: false,
  chapterThreeClear: false,
  chapterFourStarted: false,
  foldedMapDecoded: false,
  captivePorterHelped: false,
  lioMessageFound: false,
  princessNameSeen: false,
  briarholdLeadFound: false,
  chapterFourClear: false,
  chapterFiveStarted: false,
  captiveLanternsRestored: false,
  lioRescued: false,
  brackenEscaped: false,
  briarCrownFactionRevealed: false,
  livingBriarMarkSeen: false,
  chapterFiveClear: false,
};

export function normalizeChapterFlags(flags: Flags = {}) {
  return { ...CHAPTER_FLAG_DEFAULTS, ...flags };
}

export function getChapterIdForFlags(flags: Flags = {}): ChapterId {
  const normalized = normalizeChapterFlags(flags);
  if (normalized.chapterFourClear || normalized.chapterFiveStarted || normalized.chapterFiveClear) return 5;
  if (normalized.chapterThreeClear || normalized.chapterFourStarted) return 4;
  if (normalized.chapterTwoClear || normalized.chapterThreeStarted) return 3;
  if (normalized.chapterReported || normalized.chapterTwoStarted) return 2;
  return 1;
}

export function getCompletedChapterIds(flags: Flags = {}): ChapterId[] {
  const normalized = normalizeChapterFlags(flags);
  const highestCompleted: ChapterId | 0 = normalized.chapterFiveClear
    ? 5
    : normalized.chapterFourClear
      ? 4
      : normalized.chapterThreeClear
        ? 3
        : normalized.chapterTwoClear
          ? 2
          : normalized.chapterReported
            ? 1
            : 0;
  return (Object.values(CHAPTER_DEFINITIONS) as ChapterDefinition[])
    .filter((chapter) => chapter.id <= highestCompleted)
    .map((chapter) => chapter.id);
}

export function getChapterProgress(flags: Flags = {}) {
  const normalized = normalizeChapterFlags(flags);
  const currentChapterId = getChapterIdForFlags(normalized);
  const completedChapterIds = getCompletedChapterIds(normalized);
  const currentChapter = CHAPTER_DEFINITIONS[currentChapterId];

  return {
    currentChapterId,
    currentChapter,
    currentTitle: currentChapter.title,
    completedChapterIds,
    allChaptersComplete: !!normalized.chapterFiveClear,
  };
}
