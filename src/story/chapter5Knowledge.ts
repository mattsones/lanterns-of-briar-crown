import type { Chapter5Node, Chapter5SaveState } from "../game/chapter5Runtime";

// Existing scene history and earned facts also cover checkpoints made before
// scene history was added. Knowledge does not depend on an unchanged text hash.
export function hasChapter5Visited(s: Chapter5SaveState, node: Chapter5Node): boolean {
  if (s.node === node || s.seenScenes[node]) return true;
  switch (node) {
    case "ledger": return s.ledgerResolved || s.ledgerOfficerDistracted || s.chartRead || s.clerkFreed;
    case "workshop": return !!s.workshopResolution || s.workshopResolved || s.briarhold.shimFound || s.briarhold.workshopDisabled;
    case "lanterns": return s.goldChannelUncovered || s.briarhold.lanternsRestored || s.panes.some(Boolean) || s.briarhold.invalidSignals > 0 || s.briarhold.guardsDistracted;
    case "grille": return s.lioSeen;
    case "crown": case "carriage": return s.lioSeen || s.brackenDefeated;
    case "cells": return s.cellsOpened || !s.porterAtWorkshop && s.porterFreed || s.wardenFreed;
    case "woodsman": return s.woodsmanHeard;
    default: return false;
  }
}

export function getChapter5Landmark(s: Chapter5SaveState, node: Chapter5Node): { label: string; icon: string } | undefined {
  const rooms: Partial<Record<Chapter5Node, [string, string, string]>> = {
    culvert: ["Drainage stones", "Service culvert", "🕳️"],
    ledger: ["Upper workroom", "Records room", "📖"],
    workshop: ["Lower workroom", "Seal workshop", "🔧"],
    lanterns: ["Narrow stair", "Signal platform", "🏮"],
    grille: ["Inner passage", "Inspection grille", "👁️"],
    crown: ["Inner chamber", "Route-table chamber", "♜"],
    carriage: ["Rail passage", "Transfer carriage", "⚙️"],
    cells: ["Side passage", "Adjoining cells", "🗝️"],
    woodsman: ["Timber clearing", "Woodsman's clearing", "🪵"],
    hollow: ["Lower trail", "Tusker hollow", "🐗"],
    watchhouse: ["Watchhouse", "Watchhouse meeting", "📌"],
  };
  const room = rooms[node];
  if (!room) return undefined;
  const known = hasChapter5Visited(s, node) || node === "hollow" && s.woodsmanHeard || node === "watchhouse" && s.homecomingSeen;
  const unknownIcon = node === "lanterns" ? "🪜" : node === "woodsman" || node === "hollow" ? "🌲" : node === "watchhouse" ? "🏘️" : "🚪";
  return { label: room[known ? 1 : 0], icon: known ? room[2] : unknownIcon };
}
