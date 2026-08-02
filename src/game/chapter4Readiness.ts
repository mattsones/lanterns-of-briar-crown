import { ITEM_DB } from "../data/items";
import type { GameFlagKey, SavePayload } from "./types";

export const CHAPTER_4_READY_REQUIRED_FLAGS: GameFlagKey[] = [
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

export const CHAPTER_4_READY_REQUIRED_ITEMS = [
  "eddens_three_door_drawing",
  "witness_stone_rubbing",
  "cargo_transfer_tag",
] as const;

export function validateChapter4ReadyPayload(payload: SavePayload) {
  const errors: string[] = [];

  if (payload.screen !== "play") errors.push("Save must open on the play screen.");
  if (payload.chapterId !== 4) errors.push("Save must identify Chapter 4 as current.");
  if (payload.region !== "westrootHub") errors.push("Save must begin in the Westroot hub.");
  if (payload.flags.chapterFourStarted) errors.push("Chapter 4 must not already be started.");

  CHAPTER_4_READY_REQUIRED_FLAGS.forEach((flag) => {
    if (!payload.flags[flag]) errors.push(`Required story flag is missing: ${flag}.`);
  });

  CHAPTER_4_READY_REQUIRED_ITEMS.forEach((itemId) => {
    if (!payload.player.inventory[itemId]) errors.push(`Required story item is missing: ${itemId}.`);
  });

  Object.values(payload.player.equipment).forEach((itemId) => {
    if (itemId && (!ITEM_DB[itemId] || !payload.player.inventory[itemId])) {
      errors.push(`Equipped item is unavailable: ${itemId}.`);
    }
  });

  // Rootbread is canonical in the checked-in fixture, but it is an optional
  // Chapter 3 promise. Chapter 4 readiness never requires it.
  if (payload.flags.rootbreadPromiseKept) {
    if (!payload.flags.lioKnotFound) errors.push("A kept Rootbread promise must include Lio's knot.");
    if (!payload.player.inventory.rootbread_charm) {
      errors.push("A kept Rootbread promise must award the Rootbread Charm.");
    }
  }

  return errors;
}

export function isChapter4ReadyPayload(payload: SavePayload) {
  return validateChapter4ReadyPayload(payload).length === 0;
}
