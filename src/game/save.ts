import type { SaveSlot } from "./types";

export const STORAGE_KEY = "liams-game-prototype-v2";
export const SAVE_SLOTS_KEY = "liams-game-prototype-slots-v1";
export const SAVE_SLOT_COUNT = 10;

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
    return raw ? JSON.parse(raw) : null;
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
