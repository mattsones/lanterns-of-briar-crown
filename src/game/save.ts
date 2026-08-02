import { MAPS } from "../data/maps";
import { DEFAULT_APPEARANCE_ID } from "../data/character";
import { getChapterProgress } from "./chapterProgress";
import {
  buildDefaultCompanion,
  buildDefaultFlags,
  buildDefaultVisited,
  normalizeCompanionData,
  normalizePlayerData,
} from "./state";
import {
  ensureVisitedIncludesPosition,
  normalizeMapPosition,
  normalizeRegionId,
} from "./map";
import type { CompanionId, CompanionRoster, Flags, GameFlagKey, GameFlags, Player, SavePayload, SaveSlot } from "./types";

export const STORAGE_KEY = "liams-game-prototype-v2";
export const SAVE_SLOTS_KEY = "liams-game-prototype-slots-v1";
export const SAVE_SLOT_COUNT = 10;
export const SAVE_FILE_FORMAT = "liams-game-save";
export const SAVE_FILE_VERSION = 2;
export const CHAPTER_2_PLAYTEST_SAVE_PATH = "/saves/chapter-2-playtest.json";
export const CHAPTER_2_COMPLETE_SAVE_PATH = "/saves/chapter-2-complete.json";
export const CHAPTER_3_COMPLETE_SAVE_PATH = "/saves/chapter-3-complete.json";

export type DiskSaveFile = {
  format: typeof SAVE_FILE_FORMAT;
  version: number;
  name: string;
  savedAt: string;
  payload: SavePayload;
};

const RENAMED_FLAG_KEYS: Partial<Record<string, GameFlagKey>> = {
  reportedSatchelToMira: "reportedSatchelToElder",
  westrootGateClear: "westrootGateOpened",
  crownDenCleared: "crownDoorDungeonCleared",
  roadwatcherCleared: "roadwatcherDefeated",
};

function buildEmptySaveSlots(): SaveSlot[] {
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => ({
    id: i + 1,
    name: "",
    updatedAt: null,
    payload: null,
  }));
}

export function parseCheckpointPayload(storage: Storage = localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? getSavePayload(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function parseSaveSlotRecords(storage: Storage = localStorage): SaveSlot[] {
  try {
    const parsed = JSON.parse(storage.getItem(SAVE_SLOTS_KEY) || "[]");
    return buildEmptySaveSlots().map((emptySlot) => {
      const slot = parsed.find((candidate) => candidate.id === emptySlot.id);
      if (!slot) return emptySlot;
      return {
        ...emptySlot,
        ...slot,
        payload: slot.payload ? getSavePayload(slot.payload) : null,
      };
    });
  } catch {
    return buildEmptySaveSlots();
  }
}

export function writeSaveSlotRecords(slots: SaveSlot[], storage: Storage = localStorage) {
  storage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
}

export function formatSaveTimestamp(ts: number | null) {
  return ts ? new Date(ts).toLocaleString() : "Empty";
}

export function isSavePayload(value: unknown): value is SavePayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SavePayload>;
  return (
    !!candidate.player &&
    typeof candidate.player === "object" &&
    typeof candidate.region === "string" &&
    !!candidate.position &&
    typeof candidate.position === "object" &&
    typeof candidate.position.x === "number" &&
    typeof candidate.position.y === "number"
  );
}

function getWrappedSaveVersion(value: unknown) {
  if (!value || typeof value !== "object") return 0;
  const candidate = value as Partial<DiskSaveFile>;
  return typeof candidate.version === "number" ? candidate.version : 0;
}

export function migrateFlags(flags: Flags | Record<string, unknown> = {}): GameFlags {
  const source = flags as Record<string, unknown>;
  const migrated = { ...buildDefaultFlags(), ...flags } as GameFlags;

  Object.entries(RENAMED_FLAG_KEYS).forEach(([oldKey, newKey]) => {
    if (source[oldKey] !== undefined && !migrated[newKey]) {
      (migrated as Record<string, unknown>)[newKey] = source[oldKey];
    }
  });

  if (migrated.chapterTwoClear) {
    migrated.chapterTwoStarted = true;
    migrated.chapterTwoBriefed = true;
    migrated.westrootGateOpened = true;
    migrated.lioAlivePastGate = true;
    migrated.eddensDrawingValidated = true;
    migrated.briarCrownWatchingWestroot = true;
    migrated.crownDoorDungeonCleared = true;
  }

  if (migrated.roadwatcherHardCleared) {
    migrated.beatRoadwatcher = true;
    migrated.roadwatcherDefeated = true;
  }

  if (migrated.gatewrightWeaponPurchased) migrated.gatewrightMet = true;
  if (migrated.foldedMapDecoded) {
    migrated.chapterFourStarted = true;
    migrated.foldedMapAttempted = true;
  }
  if (migrated.foldedMapDeeperSolved) {
    migrated.chapterFourStarted = true;
    migrated.foldedMapAttempted = true;
    migrated.foldedMapDecoded = true;
  }
  if (migrated.chapterFourClear) {
    migrated.chapterFourStarted = true;
    migrated.foldedMapAttempted = true;
    migrated.foldedMapDecoded = true;
    migrated.lioMessageFound = true;
    migrated.princessNameSeen = true;
    migrated.briarRelayCleared = true;
    migrated.briarholdLeadFound = true;
  }

  // Chapter 3 saves created before the Hold Bell drama pass have already
  // crossed these story gates if they reached the Witness Stones or beyond.
  if (
    source.westrootHoldBellRung === undefined &&
    (migrated.witnessStoneSequenceSolved || migrated.willowCargoExposed || migrated.chapterThreeClear)
  ) {
    migrated.westrootHoldBellRung = true;
  }
  if (
    source.splitHallDebateHeard === undefined &&
    (migrated.witnessStoneSequenceSolved || migrated.willowCargoExposed || migrated.chapterThreeClear)
  ) {
    migrated.splitHallDebateHeard = true;
  }
  if (
    source.nomaIntroducedWitnessStones === undefined &&
    (migrated.westrootHoldBellRung || migrated.witnessStoneSequenceSolved || migrated.chapterThreeClear)
  ) {
    migrated.nomaIntroducedWitnessStones = true;
  }
  if (
    source.rootbreadLeadLearned === undefined &&
    (migrated.metAuntieLume || migrated.rootbreadPromiseKept)
  ) {
    migrated.lumeMentionedRootbread = true;
    migrated.rootbreadLeadLearned = true;
  }

  return migrated;
}

export function migrateSavePayload(payload: SavePayload, sourceVersion = SAVE_FILE_VERSION): SavePayload {
  const sourceFlags = (payload.flags || {}) as Record<string, unknown>;
  const flags = migrateFlags(payload.flags || {});
  const region = normalizeRegionId(payload.region);
  if (
    sourceFlags.reportedSatchelToElder === undefined &&
    sourceFlags.reportedSatchelToMira === undefined &&
    ((flags.beatGateBattle && region !== "hearthhollow") ||
      flags.metNix ||
      flags.foundRuinNote ||
      flags.clearedWildBattle ||
      flags.reachedBramblecross ||
      flags.chapterReported ||
      flags.chapterTwoStarted ||
      flags.chapterTwoClear)
  ) {
    flags.reportedSatchelToElder = true;
  }
  const position = normalizeMapPosition(region, payload.position || MAPS[region].start);
  const player = normalizePlayerData({
    ...payload.player,
    appearanceId: (payload.player as Partial<Player>).appearanceId || DEFAULT_APPEARANCE_ID,
  } as Player) as Player;
  const companion = normalizeCompanionData(payload.companion || buildDefaultCompanion());
  const companionRoster = Object.fromEntries(
    Object.entries(payload.companionRoster || {}).map(([id, savedCompanion]) => [
      id,
      normalizeCompanionData(savedCompanion),
    ]),
  ) as CompanionRoster;
  if (companion.id) companionRoster[companion.id as CompanionId] = companion;
  const visited = ensureVisitedIncludesPosition(
    payload.visited || buildDefaultVisited(),
    region,
    position,
  );
  const chapterId = payload.chapterId || getChapterProgress(flags).currentChapterId;

  return {
    ...payload,
    screen: payload.screen || "play",
    chapterId,
    player,
    region,
    position,
    visited,
    companion,
    companionRoster,
    guestNpc: payload.guestNpc || null,
    flags,
    quest:
      payload.quest || {
        title: sourceVersion < SAVE_FILE_VERSION ? "Migrated Save" : "Adventure in progress",
        description: "Continue exploring.",
      },
    toast: payload.toast || "Save loaded.",
  };
}

export function getSavePayload(value: unknown, sourceVersion = getWrappedSaveVersion(value)): SavePayload | null {
  if (isSavePayload(value)) return migrateSavePayload(value, sourceVersion);
  if (!value || typeof value !== "object") return null;
  const wrapped = value as Partial<DiskSaveFile>;
  return isSavePayload(wrapped.payload)
    ? migrateSavePayload(wrapped.payload, getWrappedSaveVersion(wrapped) || sourceVersion)
    : null;
}

export function getDiskSaveName(value: unknown, fallback = "Save") {
  if (value && typeof value === "object" && typeof (value as Partial<DiskSaveFile>).name === "string") {
    const name = (value as Partial<DiskSaveFile>).name?.trim();
    if (name) return name;
  }
  const payload = getSavePayload(value);
  return payload?.player?.name ? `${payload.player.name} Save` : fallback;
}

export function parseDiskSaveText(text: string) {
  const parsed = JSON.parse(text);
  const payload = getSavePayload(parsed);
  if (!payload) throw new Error("Invalid Liam's Game save file.");
  return {
    name: getDiskSaveName(parsed),
    payload,
  };
}

export function buildDiskSaveFile(name: string, payload: SavePayload): DiskSaveFile {
  return {
    format: SAVE_FILE_FORMAT,
    version: SAVE_FILE_VERSION,
    name,
    savedAt: new Date().toISOString(),
    payload,
  };
}

export function serializeDiskSave(name: string, payload: SavePayload) {
  return `${JSON.stringify(buildDiskSaveFile(name, payload), null, 2)}\n`;
}

export function formatDiskSaveFilename(name: string) {
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "liams-game-save";
  return `${slug}.json`;
}
