import type { Companion } from "./types";

export function getCompanionCommandHint(companion?: Partial<Companion> | null) {
  if (!companion?.recruited) return "";
  const hints: Record<string, string> = {
    guardian: "Rowan protects the party and steadies longer fights.",
    skirmisher: "Tilda disrupts enemies and creates openings.",
    sage: "Moss heals, wards, and quietly keeps everyone standing.",
  };
  return hints[String(companion.style)] || "Your companion is ready to help.";
}

export function getCompanionAbilityCards(companion?: Partial<Companion> | null) {
  const cards: Record<string, string[]> = {
    guardian: ["Shielding Step", "Linebreaker", "Steadying Support"],
    skirmisher: ["Quick Feint", "Spoil the Timing", "Pocket Tricks"],
    sage: ["Quiet Ward", "Field Mending", "Subtle Pressure"],
  };
  return (cards[String(companion?.style)] || []).map((name) => ({
    name,
    description: `${companion?.name} uses this role ability based on the current companion command.`,
  }));
}
