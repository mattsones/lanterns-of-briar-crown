import type { ChapterId } from "../game/types";

export type ChapterStoryPlan = {
  id: Exclude<ChapterId, 1>;
  title: string;
  promise: string;
  requiredEndFlags: string[];
  coreBeats: string[];
  keyLines: string[];
  artTargets: {
    maps: string[];
    portraits: string[];
    enemies: string[];
    items: string[];
    symbols: string[];
  };
};

export const CHAPTER_STORY_PLANS: Record<Exclude<ChapterId, 1>, ChapterStoryPlan> = {
  2: {
    id: 2,
    title: "The Westroot Trail",
    promise:
      "Follow the Westroot lead, make Mara central to the search for Lio, turn Edden's riddle into useful road language, and confirm Lio survived past the First Westroot Gate.",
    requiredEndFlags: [
      "chapterTwoClear",
      "westrootGateOpened",
      "lioAlivePastGate",
      "eddensDrawingValidated",
      "briarCrownWatchingWestroot",
    ],
    coreBeats: [
      "Bramblecross morning-after briefing with Enna and Hollis",
      "Mara Brindle joins as a protected non-combat guest",
      "Edden gives the three-door drawing",
      "Ada teaches Willowmark Lens seal reading",
      "Old Westward Cut and Shelter Nook introduce the hidden road",
      "Three-Sign Hollow tests accountable guidance against counterfeit authority",
      "Roadwatcher consequence confirms the Briar Crown is watching",
      "Crown Door den reveals how false signs are manufactured",
      "First Westroot Gate opens and Lio is confirmed alive past it",
    ],
    keyLines: [
      "If you are making a plan about my brother without me, it is probably a worse plan than it needs to be.",
      "Back first. Old side listens behind.",
      "When the sign is loud, listen smaller.",
      "A trustworthy order names who sent it, what danger it answers, and who it protects.",
      "Alive past this point. Do not trust the straight road.",
      "A road is safest when truth walks it first.",
    ],
    artTargets: {
      maps: ["westroot-trail", "crown-door-den"],
      portraits: ["mara-brindle", "edden-vale", "ada-willowmarket"],
      enemies: ["briar-roadwatcher", "thorn-collared-hound", "false-sign-scratcher"],
      items: ["eddens-three-door-drawing", "willowmark-lens", "pine-pitch-wax", "split-crown-slat", "briar-signmaker-ledger", "cleaned-lantern-mark", "no-handle-token"],
      symbols: ["lantern-road-signs", "briar-crown-signs", "willow-seal-reference"],
    },
  },
  3: {
    id: 3,
    title: "The Hidden Root",
    promise:
      "Reveal Westroot as a hidden Lantern Road community divided between closing itself and letting truth travel again.",
    requiredEndFlags: [
      "chapterThreeClear",
      "westrootTrustEarned",
      "witnessStoneSequenceSolved",
      "willowCargoExposed",
    ],
    coreBeats: [
      "Enter Westroot beneath the hill",
      "Meet Stonekin and Mossback community voices",
      "Navigate Rootmarket, Witness Stones, Mossgarden, and Split Hall",
      "Renew the four road promises in a public reconciliation scene",
      "Investigate Willow-sealed cargo that should not be trusted",
      "Help an optional hospitality side thread",
      "Reveal Westroot was opened from both inside and outside",
    ],
    keyLines: [
      "Caution is not cowardice. But if a shield never lowers, it becomes a wall.",
      "Roots survive by holding fast. They also survive by sharing water.",
      "Westroot was opened from inside and outside.",
    ],
    artTargets: {
      maps: ["westroot-hub"],
      portraits: ["bramwell-gatehand", "noma-greenstill", "quill-pebbleturn", "auntie-lume"],
      enemies: ["briar-cargo-runner", "seal-forged-sentry"],
      items: ["rootbread-charm", "witness-stone-rubbing"],
      symbols: ["witness-stones", "westroot-gate-marks"],
    },
  },
  4: {
    id: 4,
    title: "The Riddle Road",
    promise:
      "Use Edden's folded-map language to follow the old way deeper, find Lio's message, and identify Briarhold Waystation as the rescue target.",
    requiredEndFlags: [
      "chapterFourClear",
      "foldedMapDecoded",
      "captivePorterHelped",
      "lioMessageFound",
      "princessNameSeen",
      "briarholdLeadFound",
    ],
    coreBeats: [
      "Receive or recover Edden's folded-map clue",
      "Cross the Underway and Listening Mile",
      "Help the captive porter side thread",
      "Find Lio's message: do not follow angry, follow clever",
      "Discover a Briar relay post and cell roles",
      "See Princess Elowen's name on a suspicious order",
      "Learn Lio is being moved toward Briarhold Waystation",
    ],
    keyLines: [
      "Do not follow angry. Follow clever. I am west of the relay. Still breathing. Still me.",
      "He is leaving truth in small places. That is how roads begin healing.",
      "I am following clever. But I am still going.",
    ],
    artTargets: {
      maps: ["riddle-road-underway"],
      portraits: ["captive-porter", "briar-relay-captain"],
      enemies: ["briar-relay-guard", "seal-forged-sentry", "crown-whisperer"],
      items: ["folded-map-scrap", "lanternwell-drop"],
      symbols: ["folded-map-route", "princess-order-seal"],
    },
  },
  5: {
    id: 5,
    title: "Briarhold Waystation",
    promise:
      "Rescue Lio, break the local Briar Crown cell, reveal the faction's method, and hint that the mark itself may be older than the people using it.",
    requiredEndFlags: [
      "chapterFiveClear",
      "captiveLanternsRestored",
      "lioRescued",
      "brackenEscaped",
      "briarCrownFactionRevealed",
      "livingBriarMarkSeen",
    ],
    coreBeats: [
      "Infiltrate Briarhold Waystation",
      "Investigate false ledgers and thornseal workshop",
      "Solve the captive lanterns puzzle",
      "Find Lio resisting before rescue",
      "Fight Bracken Voss and cell guards",
      "Let Lio and Mara reunite",
      "Reveal the Briar Crown faction structure",
      "Show Bracken escaping and the Briar Crown mark moving by itself",
    ],
    keyLines: [
      "Fear can move people, but it cannot guide them home.",
      "You told me not to follow angry.",
      "Tell my father the road did not betray him. Someone taught it to speak with my name.",
      "It was not supposed to wake yet.",
    ],
    artTargets: {
      maps: ["briarhold-waystation"],
      portraits: ["lio-brindle", "bracken-voss", "briar-thornbinder"],
      enemies: ["bracken-voss", "thornseal-guard", "thornroot-sentry"],
      items: ["true-seal-fragment", "briar-chain-link", "lios-courier-knot"],
      symbols: ["captive-lantern-order", "living-briar-crown-mark"],
    },
  },
};

export function getChapterStoryPlan(chapterId: Exclude<ChapterId, 1>) {
  return CHAPTER_STORY_PLANS[chapterId];
}
