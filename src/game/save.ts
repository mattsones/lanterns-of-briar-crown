import type { SavePayload, SaveSlot } from "./types";

export const STORAGE_KEY = "liams-game-prototype-v2";
export const SAVE_SLOTS_KEY = "liams-game-prototype-slots-v1";
export const SAVE_SLOT_COUNT = 10;
export const SAVE_FILE_FORMAT = "liams-game-save";
export const SAVE_FILE_VERSION = 1;
export const CHAPTER_2_PLAYTEST_SAVE_PATH = "/saves/chapter-2-playtest.json";

export type DiskSaveFile = {
  format: typeof SAVE_FILE_FORMAT;
  version: typeof SAVE_FILE_VERSION;
  name: string;
  savedAt: string;
  payload: SavePayload;
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
    return buildEmptySaveSlots().map((emptySlot) => parsed.find((slot) => slot.id === emptySlot.id) || emptySlot);
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

export function getSavePayload(value: unknown): SavePayload | null {
  if (isSavePayload(value)) return value;
  if (!value || typeof value !== "object") return null;
  const wrapped = value as Partial<DiskSaveFile>;
  return isSavePayload(wrapped.payload) ? wrapped.payload : null;
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
