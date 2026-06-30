import type { Flags, GuestNpc, GuestNpcId } from "./types";

export const GUEST_NPC_DEFINITIONS: Record<GuestNpcId, Omit<GuestNpc, "present">> = {
  mara: {
    id: "mara",
    name: "Mara Brindle",
    role: "Non-combat guest and Lio clue-reader",
    mapTokenIcon: "M",
    statusText: "Watching for Lio's smallest marks.",
    participatesInBattle: false,
    canTakeDamage: false,
  },
};

export function buildGuestNpc(id: GuestNpcId, present = true): GuestNpc {
  return { ...GUEST_NPC_DEFINITIONS[id], present };
}

export function getActiveGuestNpc(flags: Flags = {}): GuestNpc | null {
  if (flags.maraJoined && !flags.chapterFiveClear) return buildGuestNpc("mara");
  return null;
}

export function guestCanEnterBattle(guest: GuestNpc | null) {
  return !!guest && guest.participatesInBattle;
}

export function guestCanTakeDamage(guest: GuestNpc | null) {
  return !!guest && guest.canTakeDamage;
}
