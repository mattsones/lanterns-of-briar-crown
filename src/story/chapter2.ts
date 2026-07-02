import type { Flags } from "../game/types";

export type RoadwatcherMode = "avoided" | "standard" | "hard";

export const CHAPTER_2_STORY = {
  title: "Chapter 2: The Westroot Trail",
  oldRoadPhrase: "A road is safest when truth walks it first.",
  lioGateMark: "Alive past this point. Do not trust the straight road.",
  completionText:
    "Lio is alive past this point. The old road opened when truth came first. Somewhere below the hill, Westroot waits.",
  mapPromptDoc: "docs/art/prompts/chapter-2-westroot-trail-map.md",
};

export const CHAPTER_2_REQUIRED_END_FLAGS = [
  "chapterTwoClear",
  "westrootGateOpened",
  "lioAlivePastGate",
  "eddensDrawingValidated",
  "briarCrownWatchingWestroot",
];

export const WESTROOT_SUPPORTING_CLUE_FLAGS = [
  "shelterNoticeRemoved",
  "lioShelterMarkFound",
  "falseNoticeLensUsed",
  "falseNoticeLanternRead",
  "crownSignRejected",
  "crownSignLensUsed",
  "willowForgeryConfirmedAtHollow",
  "lanternSignCleaned",
  "lanternSignCompared",
  "understandsTrueSigns",
  "eddensDrawingRotated",
  "noHandleDoorStudied",
  "lioHookMarkFound",
  "eddenDrawingComparedAtDoor",
  "eddensDrawingValidated",
];

export const WESTROOT_MISTAKE_FLAGS = [
  "followedFalseDetour",
  "trustedCrownSignAtHollow",
  "forcedNoHandleDoor",
  "forcedNoHandleDoorTwice",
];

function mergeFlags(flags: Flags = {}, assumedFlags: Flags = {}) {
  return { ...flags, ...assumedFlags };
}

export function getWestrootClueCount(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  return WESTROOT_SUPPORTING_CLUE_FLAGS.filter((flag) => !!merged[flag]).length;
}

export function getWestrootMistakeCount(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  return WESTROOT_MISTAKE_FLAGS.filter((flag) => !!merged[flag]).length;
}

export function hasReadTrueLanternGuidance(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  return !!(
    merged.falseNoticeLanternRead ||
    merged.lanternSignCleaned ||
    merged.lanternSignCompared ||
    merged.understandsTrueSigns ||
    merged.eddensDrawingRotated
  );
}

export function getWestrootDoorRepairState(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  const falseOrdersBroken = !!(
    merged.shelterNoticeRemoved &&
    (
      merged.falseNoticeLensUsed ||
      merged.falseNoticeLanternRead ||
      merged.crownSignRejected ||
      merged.crownSignLensUsed ||
      merged.willowForgeryConfirmedAtHollow
    )
  );
  const trueLanternGuidanceRestored = !!(
    merged.lanternSignCleaned &&
    (
      merged.understandsTrueSigns ||
      merged.lanternSignCompared ||
      merged.eddensDrawingRotated ||
      merged.falseNoticeLanternRead
    )
  );
  const lioMarkConfirmed = !!(merged.lioShelterMarkFound && merged.lioHookMarkFound);
  const eddenDrawingAligned = !!(
    merged.eddensDrawingRotated ||
    merged.lanternSignCompared ||
    merged.eddensDrawingValidated ||
    (merged.eddenDrawingComparedAtDoor && merged.lanternSignCleaned)
  );
  const doorHasAskedForTruth = !!merged.noHandleStoneInspected;
  const completedRequirements = [
    falseOrdersBroken,
    trueLanternGuidanceRestored,
    lioMarkConfirmed,
    eddenDrawingAligned,
  ].filter(Boolean).length;
  const missingRequirements = [
    !falseOrdersBroken ? "break the false road orders" : null,
    !trueLanternGuidanceRestored ? "restore the true Lantern guidance" : null,
    !lioMarkConfirmed ? "find Lio's real hook-tailed mark" : null,
    !eddenDrawingAligned ? "align Edden's drawing with the hollow" : null,
  ].filter(Boolean);

  return {
    doorHasAskedForTruth,
    falseOrdersBroken,
    trueLanternGuidanceRestored,
    lioMarkConfirmed,
    eddenDrawingAligned,
    completedRequirements,
    requiredCount: 4,
    missingRequirements,
    readyToOpen:
      doorHasAskedForTruth &&
      falseOrdersBroken &&
      trueLanternGuidanceRestored &&
      lioMarkConfirmed &&
      eddenDrawingAligned,
  };
}

export function getWestrootPuzzleOutcome(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  const repair = getWestrootDoorRepairState(merged);
  const supportingClues = repair.completedRequirements;
  const mistakeCount = getWestrootMistakeCount(merged);
  const enoughClues = repair.readyToOpen;
  const foundLioMark = repair.lioMarkConfirmed;
  const readTrueLanternGuidance = hasReadTrueLanternGuidance(merged);
  const cleanSolve = enoughClues && mistakeCount === 0;
  const seriousMistake = !!(
    merged.followedFalseDetour ||
    merged.trustedCrownSignAtHollow ||
    merged.forcedNoHandleDoorTwice ||
    (enoughClues && !readTrueLanternGuidance)
  );
  const roadwatcherMode: RoadwatcherMode = cleanSolve
    ? "avoided"
    : seriousMistake || mistakeCount >= 2
      ? "hard"
      : "standard";

  return {
    supportingClues,
    mistakeCount,
    enoughClues,
    foundLioMark,
    readTrueLanternGuidance,
    cleanSolve,
    roadwatcherMode,
    repair,
  };
}

export function getRoadwatcherEncounterKey(flags: Flags = {}, assumedFlags: Flags = {}) {
  return getWestrootPuzzleOutcome(flags, assumedFlags).roadwatcherMode === "hard"
    ? "roadwatcherHard"
    : "roadwatcher";
}
