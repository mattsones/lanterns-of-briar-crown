import type { Flags } from "../game/types";

export const CHAPTER_3_STORY = {
  id: 3,
  title: "Chapter 3: The Hidden Root",
  shortTitle: "The Hidden Root",
  promise:
    "Enter Westroot, earn the trust of a divided hidden community, and prove that the old road was opened from both sides.",
  entryRequirements: [
    "chapterTwoClear",
    "westrootGateOpened",
    "lioAlivePastGate",
    "eddensDrawingValidated",
    "briarCrownWatchingWestroot",
  ],
  requiredEndFlags: [
    "chapterThreeClear",
    "westrootTrustEarned",
    "witnessStoneSequenceSolved",
    "willowCargoExposed",
  ],
} as const;

export const CHAPTER_3_HUB_NODES = [
  { id: "first_gate", label: "First Westroot Gate", purpose: "Chapter entry and return threshold" },
  { id: "rootmarket", label: "Rootmarket", purpose: "Community voices and hospitality thread" },
  { id: "witness_stones", label: "Witness Stones", purpose: "Fail-forward truth-order puzzle" },
  { id: "mossgarden", label: "Mossgarden", purpose: "Mossback history and community care" },
  { id: "split_hall", label: "Split Hall", purpose: "Westroot's open-or-close conflict" },
  { id: "cargo_siding", label: "Cargo Siding", purpose: "Willow-sealed cargo investigation and combat" },
] as const;

export const CHAPTER_3_VERTICAL_SLICE = {
  entryScene: {
    name: "Westroot, Beneath the Hill",
    text:
      "The passage widens slowly, as though the hill is deciding whether to trust you. Moss-lanterns wake one by one ahead. Beyond them, bridges of root and fitted stone cross a cavern large enough to hold a town—and quiet enough that everyone in it has heard the gate open.",
    companionPrompt:
      "Mara keeps Lio's hook-tailed mark in sight. Your companion watches the people watching you.",
    firstChoice: "Enter with your hands where Westroot can see them.",
  },
  firstConflict: {
    question: "Should Westroot close itself again, or let witnessed truth travel outward?",
    positions: {
      close: "The outside road brought forged orders, armed watchers, and danger to hidden families.",
      open: "Silence protected the forgery network by leaving honest settlements unable to compare what they knew.",
    },
  },
  firstPlayableLoop: [
    "Enter from the Chapter 2 complete fixture",
    "Walk the placeholder Westroot hub graph",
    "Meet one voice from each side of the community conflict",
    "Solve or fail forward through the Witness Stones",
    "Inspect Willow-sealed cargo",
    "Resolve one true multi-enemy encounter",
    "Return evidence to Split Hall and set the four Chapter 3 completion flags",
  ],
} as const;

export function canStartChapter3(flags: Flags = {}) {
  return CHAPTER_3_STORY.entryRequirements.every((flag) => !!flags[flag]);
}

export function isChapter3Complete(flags: Flags = {}) {
  return CHAPTER_3_STORY.requiredEndFlags.every((flag) => !!flags[flag]);
}
