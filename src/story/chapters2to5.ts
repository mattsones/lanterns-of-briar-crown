import type { ChapterId } from "../game/types";
import { CHAPTER_5_CONTRACT } from "./chapter5";

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
      "A shield must know what it covers. And when to lower.",
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
      "Use Lio's twice-folded clue and the Survey Station shutters to follow the old way deeper, find his message, and identify Briarhold Waystation as the rescue target.",
    requiredEndFlags: [
      "chapterFourClear",
      "foldedMapDecoded",
      "rootwaterBridgeCrossed",
      "underwayWildlifeCleared",
      "lioMessageFound",
      "royalProgressLearned",
      "briarRelayCleared",
      "princessNameSeen",
      "briarholdLeadFound",
    ],
    coreBeats: [
      "Find Lio's twice-folded scratch at the abandoned Survey Station",
      "Open the captors' Old Keeper Road shutter and cross Rootwater Bridge",
      "Cross the later Underway detour and Listening Mile",
      "Help the captive porter side thread",
      "Find Lio's message: do not follow angry, follow clever",
      "Discover a Briar relay post and cell roles",
      "See Princess Elowen's name on a suspicious order",
      "Learn Lio is being moved toward Briarhold Waystation",
    ],
    keyLines: [
      "M—do not follow angry. Follow clever. Taking us west. Still me. — L",
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
    promise: CHAPTER_5_CONTRACT.promise,
    requiredEndFlags: [...CHAPTER_5_CONTRACT.requiredEndFlags],
    coreBeats: [
      "Infiltrate Briarhold Waystation",
      "Investigate false ledgers and thornseal workshop",
      "Use the workshop shim, ledger key, and lantern signal for quieter entry, or fight through",
      "Find Lio resisting before rescue",
      "Fight Bracken Voss and cell guards",
      "Stop Lio's transfer carriage while the wounded Bracken escapes with his routing cipher",
      "Rescue all four remaining captives and preserve the original evidence",
      "Let Lio and Mara reunite and hear the transferred examiner's account",
      "Return east overland, with an optional territorial tusker encounter",
      "Celebrate the Bramblecross homecoming before Enna's private case-wall reading",
      "Prove genuine office access and follow the examiner's transfer toward Elowen's Lanthorne hearing",
    ],
    keyLines: [
      "Fear can move people, but it cannot guide them home.",
      "You told me not to follow angry.",
      "He is still out there.",
      "So are we.",
    ],
    artTargets: {
      maps: CHAPTER_5_CONTRACT.maps.map((map) => map.id),
      portraits: ["lio-brindle", "bracken-voss", "westroot-clerk", "cellar-porter", "rainroot-road-warden", "rainroot-woodsman", "briar-sealwright"],
      enemies: ["bracken-voss", "thornseal-guard", "thornroot-sentry"],
      items: ["true-seal-fragment", "briar-chain-link", "lios-courier-knot"],
      symbols: ["fixed-signal-chart", "signal-pane-marks", "genuine-office-handling-marks", "true-brake-markings"],
    },
  },
};

export function getChapterStoryPlan(chapterId: Exclude<ChapterId, 1>) {
  return CHAPTER_STORY_PLANS[chapterId];
}
