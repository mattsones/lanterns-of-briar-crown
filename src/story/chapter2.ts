import type { Flags } from "../game/types";

export type RoadwatcherMode = "standard" | "hard";

export const CHAPTER_2_STORY = {
  title: "Chapter 2: The Westroot Trail",
  oldRoadPhrase: "A road is safest when truth walks it first.",
  lioGateMark: "Alive past this point. Do not trust the straight road.",
  completionText:
    "Lio is alive past this point. The old road opened when truth came first. Somewhere below the hill, Westroot waits.",
  mapPromptDoc: "docs/art/prompts/chapter-2-westroot-trail-map.md",
};

export type Chapter2CompanionReadId =
  | "threshold"
  | "crownDoor"
  | "lanternDoor"
  | "noHandleDoor";

type CompanionReadCopy = {
  rowan: string;
  tilda: string;
  moss: string;
  fallback: string;
};

export const CHAPTER_2_SCENE_COPY = {
  threeDoorThreshold: {
    name: "Three-Door Threshold",
    portrait: "□",
    sceneAlt:
      "The Crown Door, Lantern Door, and No-Handle Door set into the Westroot hillside.",
    text:
      "The trail pinches between roots and old stone, then opens on three doors set into the hillside.\n\nThe Crown Door stands straight and official. The Lantern Door is lower, weathered, and tucked beside a little stone cache. The third door has no handle at all.\n\nMara stops so suddenly you nearly bump into her.",
    labels: {
      crownDoor: "Approach the Crown Door.",
      lanternDoor: "Approach the Lantern Door.",
      noHandleDoor: "Approach the No-Handle Door.",
      westrootGate: "Step through the First Westroot Gate.",
      maraRead: "Ask Mara for her read.",
      companionRead: "Ask your companion for their read.",
      back: "Step back.",
    },
  },
  edden: {
    drawingReview:
      "The drawing is not a map so much as a memory that lost a fight. Three door-shapes crowd under black roots: a thorn-crowned arch, a mud-blurred lantern door, and a third slab rubbed nearly smooth where a latch should make sense.\n\nIn the margins, Edden has written half-words and crossed most of them out: BACK FIRST. OLD SIDE. LISTENS BEHIND.",
    recoveryFirst:
      "Edden Vale sits beside a narrow window with a blanket over his shoulders and charcoal on his fingers. The cracked lantern rests beside him, turned so the broken glass faces the wall.\n\nHe does not look at you at first. He looks at the corners of the room, counting them wrong.\n\n\"Crown bit the root,\" he whispers. \"Lantern blinked under mud. Third one was quiet. Not a door. Not from this side. I put my hand where the pull should be and... cold. Cold stone. Back first. Old side listens behind.\"\n\nHis fingers twitch like they are still holding charcoal. \"Don't make it shout. It lies when it shouts.\"",
    recoveryRepeat:
      "Edden rests with charcoal still smudged on his fingers. \"Back first,\" he murmurs. \"Old side listens. Crown shouts. Lantern remembers. Smooth stone waits.\"",
  },
  crownDoor: {
    name: "Crown Door",
    portrait: "♛",
    text: {
      cleared:
        "The Crown Door stands open now. The passage behind it no longer feels like a command. It feels like a workshop someone abandoned in a hurry.",
      unlocked:
        "The Crown Door is tall, straight, and marked with a polished crown seal. The split slat from the Roadwatcher fits a narrow notch under the seal, where a keyhole was pretending to be decoration.",
      tried:
        "The Crown Door is still open a crack. Cold air moves behind it, carrying the smell of wet roots and scraped wax. Something in there feels real, but the latch has not admitted you yet.",
      default:
        "The Crown Door is tall, straight, and marked with a polished crown seal. The passage behind it slopes down instead of forward, vanishing into a colder root-tunnel.",
    },
    labels: {
      inspectSign: "Inspect the Crown Sign.",
      returnDen: "Return to the Crown Door Den.",
      openWithSlat: "Open the Crown Door with the split slat.",
      tryDoor: "Try the Crown Door.",
      askMara: "Ask Mara about the Crown Door.",
      askCompanion: "Ask your companion about this door.",
      backDoor: "Back to the Crown Door.",
      backThreshold: "Back to the threshold.",
    },
    maraRead:
      "\"Lio hates signs that sound like scolding,\" Mara says. \"He would write who it helps, or what it warns about. This one just wants to be obeyed.\"",
  },
  falseCrownPassage: {
    name: "False Crown Passage",
    text:
      "The Crown Door leads into a narrow root passage, colder than the trail and much too quiet. The floor drops toward a lower chamber where seal-cloth hangs from thorns like warning flags.\n\nIt is a real way, but not Lio's way. Not the quick one. Not the one Mara is trying not to cry about.",
    labels: {
      markDanger: "Mark this as a dangerous branch.",
      returnThreshold: "Return to the threshold.",
    },
    markedToast: "The Crown Door is real, but something else holds its latch.",
  },
  crownDoorDen: {
    enterTravelText:
      "The split crown slat clicks into the false door. The passage opens into a hidden signworks. Somewhere deeper in the den, wood scratches stone in a patient rhythm.",
    returnTravelText: "You climb back to the Three-Door Threshold.",
    vestibule: {
      name: "Crown Vestibule",
      portraitAlt: "Painted token of the Crown Door Den threshold",
      text:
        "The vestibule tries very hard to look official. Blank order boards line the wall. Six handles hang from one panel, each polished by hands that were meant to pull before thinking.\n\nMara looks at them and whispers, \"That is too many handles for one lie.\"",
      moveDeeper: "Move deeper.",
    },
    waxTable: {
      name: "Wax Table",
      portraitAlt: "Painted token of wax, seal tools, and spoons",
      text: {
        active:
          "A worktable sits under a hanging root-lamp. Red crown wax, green Willow wax, pine pitch, crate tags, and little heating spoons are arranged with upsetting neatness.",
        cleared:
          "The wax table is scraped clean enough to tell its story: crown wax over pine pitch, pine pitch over green Willow wax, and old honest marks softened until they could be made to lie.",
      },
      labels: {
        useLens: "Use Ada's lens on the wax layers.",
        scrape: "Scrape the wax layers apart.",
        leave: "Leave the wax table.",
      },
      results: {
        lens:
          "Ada's lens catches the nicked Willow leaf under two false layers. You recover broken false seal wax. XP +4",
        scrape:
          "Even without Ada's lens, the scraped layers show market wax being buried under a crown order. You recover broken false seal wax. XP +4",
      },
    },
    slatRack: {
      name: "Slat Rack",
      portraitAlt: "Painted token of Crown Door Den sign slats",
      text: {
        active:
          "Wooden sign slats hang in rows: RETURN EAST, AWAIT COMMAND, STRAIGHT ROAD SAFE. Some are only half-painted. Beneath the paint, older lantern marks have been scraped nearly away.",
        cleared:
          "The half-painted signs lie cracked on the floor. Under their false directions, older lantern scratches are visible again.",
      },
      labels: {
        breakSigns: "Break the half-painted false signs.",
        leave: "Leave the slat rack.",
      },
      result: "The slats crack sharply. The den loses some of its bossy silence. XP +4",
    },
    witnessLedger: {
      name: "Witness Ledger Nook",
      portraitAlt: "Painted token of the witness ledger and notes",
      text: {
        active:
          "A small desk is tucked into a root alcove. The ledger on it is written in tidy columns: sign site, wax used, witness risk, route correction.\n\nOne line is underlined twice: LIO BRINDLE - moved past gate - witness risk unresolved.",
        copied:
          "The copied ledger page is folded safely away. Its neat columns make the whole den feel worse, because fear was being filed like inventory.",
      },
      labels: {
        copy: "Copy the witness ledger page.",
        leave: "Leave the ledger nook.",
      },
      result: "You copy the ledger page for Enna and Hollis. XP +5",
    },
    collarKennel: {
      name: "Collar Kennel",
      portraitAlt: "Painted token of thorn collars and kennel straw",
      text: {
        active:
          "The kennel is small and clean in a way that makes Mara angrier, not calmer. A thorn-collared hound stands chained beside soft bedding and water bowls. The chain is short enough to be cruel without looking cruel.\n\n\"They made scared things guard scared roads,\" she says.",
        broken:
          "The thorn collars are broken. The bedding in the corner looks less like a trap now and more like a place something frightened might recover.",
        houndFreed:
          "The thorn collars are broken. The hound has curled into the clean bedding, watching the door with tired, unenchanted eyes.",
      },
      labels: {
        easeHound: "Ease the hound and cut the collar carefully.",
        force: "Break the collar by force.",
        battle: "Break the collar in battle.",
        leave: "Leave the kennel.",
      },
      failureName: "The Collar Snaps Tight",
      failureText:
        "The hound wants to trust the quiet in your voice, but the collar burns red before it can choose. It lunges because the den taught it to lunge.",
      successResult:
        "The collar opens with a thorny click. The hound does not run. It simply stops shaking. XP +6",
    },
    guard: {
      name: "False Sign Guard",
      defeatedToast: "Only broken sign nails remain here.",
      portraitAlt: "Painted crossed sign slats for the signworks guard",
      text:
        "Two false-sign scratchers skitter down from the slat rack, dragging a thorn-collared hound on a cord of bramble. One points at the door behind you as if ordering you to leave. The other keeps scratching fresh arrows into old wood.\n\nMara backs behind a root pillar. \"Behind the line,\" she says. \"Still doing it.\"",
      labels: {
        clear: "Clear the signworks guard.",
        backAway: "Back away.",
      },
    },
    falseMap: {
      name: "False Map Room",
      portraitAlt: "Painted token of the false road map",
      text: {
        cleared:
          "The false map hangs slack now. The straight road is crossed out, the hidden old marks are visible, and one cleaned lantern mark glows softly in your pack.",
        ready:
          "The false map is made of strings, pins, crown slats, and scraped lantern marks. Now that the den's tools are broken, the map no longer looks like a plan. It looks like a confession.",
      },
      labels: {
        pull: "Pull the false road off the map.",
        returnThreshold: "Return to the Three-Door Threshold.",
        leave: "Leave the false map.",
      },
      result:
        "The false route tears loose. Beneath it, a cleaned lantern mark points back to the No-Handle Door. XP +8",
    },
  },
  lanternDoor: {
    name: "Lantern Door",
    portrait: "✶",
    text: {
      tried:
        "The Lantern Door is not really a door after all. The little stone cache beside it sits open, smelling faintly of dry herbs and waxed cloth.",
      default:
        "The Lantern Door is squat and weathered. Beside it, a small stone cache is tucked under a root lip, exactly the sort of thing a tired courier would know to check without thinking.",
      firstTry:
        "The slab does not swing open. Instead, the cache stone slides loose with a soft scrape. Inside are travel supplies wrapped in dry leaf-cloth.\n\nMara lets out a breath. \"Lio would have checked this. He would have known.\"",
      empty: "The cache is empty now. The Lantern Door stays quiet.",
    },
    labels: {
      inspectSign: "Inspect the Lantern Sign.",
      tryDoor: "Try the Lantern Door.",
      askMara: "Ask Mara about the Lantern Door.",
      askCompanion: "Ask your companion about this door.",
      backDoor: "Back to the Lantern Door.",
      backThreshold: "Back to the threshold.",
    },
    maraRead:
      "\"Lio knows these little caches,\" Mara says. \"He says the best road help is boring because boring means somebody planned for you to survive.\"",
  },
  maraThresholdRead: {
    name: "Mara at the Threshold",
    text:
      "\"Yes,\" Mara says immediately.\n\n\"You do not know what I am going to ask.\"\n\n\"Yes to that too.\"",
    labels: {
      lioMarks: "Look for Lio's smallest marks.",
      eddenDrawing: "Compare Edden's drawing to the threshold.",
      lanternSigns: "Watch the threshold from behind the line.",
      safety: "Stay where I can see you.",
    },
    results: {
      lioMarks: "Mara starts searching where official sign-makers would never kneel.",
      eddenDrawing:
        "Mara turns Edden's drawing sideways. The roots match the blank stone. XP +4",
      lanternSigns:
        "Mara watches the threshold from an extremely behind-the-line place.",
      safety: "Mara stays safe in a very visible way.",
    },
  },
  crownSign: {
    name: "Crown Sign",
    text: {
      exposed:
        "The Crown Sign still stands tall, but its seal has cracked and one edge has peeled away from older scratches underneath.",
      repair:
        "The Crown Sign is large, clean, and newly nailed. It gives an order, a direction, and a seal, but no traveler's name and no sign of who wrote it.",
      default:
        "The Crown Sign is large, clean, and official-looking. Mara gives it one impatient glance, then looks back to the places where Lio would actually write.",
    },
    labels: {
      loosen: "Loosen the nailed-on crown sign.",
      lens: "Use the Willowmark Lens.",
      testDirection: "Test the false direction anyway.",
      backDoor: "Back to the Crown Door.",
    },
    results: {
      loosen: "The sign comes loose enough to show older scratches beneath it.",
      lens: "Under the seal, the lens catches scraped wax and Ada's nicked Willow mark.",
    },
  },
  lanternSign: {
    name: "Lantern Sign",
    text: {
      cleaned:
        "The Lantern Sign is clean now. Four older marks show clearly: WARNING. SHELTER. WATER. WITNESS.\n\nBelow them, a route phrase reads: DO NOT FORCE THE CLOSED WAY. SPEAK TRUE AND WAIT.",
      repair:
        "The Lantern Sign is half-covered with mud. Beneath it, older cuts wait in a line, too practical to be decoration.",
      default:
        "The Lantern Sign is half-covered with mud beside the little cache. Mara glances at it, then at the no-handle door. \"Later,\" she says. \"Lio first.\"",
    },
    labels: {
      clean: "Clean the Lantern Sign fully.",
      compare: "Compare it with Edden's drawing.",
      askMarks: "Ask what the marks mean.",
      backDoor: "Back to the Lantern Door.",
    },
    results: {
      clean: "The old lantern marks shine through. XP +4",
      compare: "Mara turns Edden's drawing sideways. The roots match the no-handle stone.",
      askMarks:
        "Warning, shelter, water, and witness are traveler help. None of them says obey.",
    },
  },
  noHandleDoor: {
    name: "No-Handle Door",
    portrait: "□",
    baseText:
      "The stone door has no handle, no latch, and no keyhole. Roots curl around its edge like folded hands.\n\nAn inscription is scratched where a handle should be:\n\nLET THE ROAD BEHIND YOU SPEAK. I DO NOT ANSWER HANDS.",
    lioText: {
      foundConfirmed:
        `Near the base, Mara finds the tiny hook-tailed arrow again and reads the courier shorthand with a shaking breath.\n\n"Lio," she whispers. "${CHAPTER_2_STORY.lioGateMark}"`,
      found:
        "Near the base, Mara finds the tiny hook-tailed arrow and goes very still.\n\n\"It is Lio's,\" she says. \"No maybe. No probably. He marked this door.\"",
      hidden:
        "Near the base, a tiny scratch hides under a root. It is easy to miss unless someone knows exactly how small a worried courier can write.",
    },
    labels: {
      study: "Study the door inscription.",
      askMara: "Ask Mara to read the tiny scratch.",
      askCompanion: "Ask your companion about this door.",
      compareDrawing: "Compare Edden's drawing here.",
      force: "Try to force the door.",
      backThreshold: "Back to the threshold.",
      listenThreshold: "Listen to the threshold again.",
      returnThreshold: "Return to the threshold.",
      stepGate: "Step to the First Westroot Gate.",
    },
    results: {
      studyReady: "The inscription is warm now, and the roots lean inward instead of away.",
      studyWaiting: "You trace the inscription and listen for what the road behind you is still saying.",
      lioMarkMatched: "Mara matches the tiny hook-tail to Lio's shelter mark. XP +5",
      lioMarkKnown:
        "Mara knows the tiny hook-tail is Lio's. The door still seems to be listening past you.",
      drawingMatched:
        "Mara turns Edden's drawing sideways. The roots match the no-handle stone. XP +5",
      drawingAlmost:
        "The roots almost line up, but the Lantern Door has not made its older marks clear yet.",
      force: "The door does not move. Something in the thorns stirs.",
    },
    doorWaitsName: "The Door Waits",
    doorListensName: "The Door Listens Behind You",
    doorOpensName: "The No-Handle Door Opens",
    roadwatcherKeyHint:
      "Mara looks from the blank door to the false one. \"The watcher had a key for a reason.\"",
  },
  roadwatcher: {
    portrait: "👁️",
    name: "Briar Roadwatcher",
    hardName: "Briar Roadwatcher Ambush",
    hardText:
      "The Crown Sign splits with a sharp wooden crack. A hooded roadwatcher steps from the brush with a thorn-collared hound and a false-sign scratcher at their side.\n\nMara ducks behind the sheltering roots near the Lantern Sign. \"I am behind the line,\" she says quickly. \"I am extremely behind it.\"",
    standardText:
      "The Crown Sign splits with a sharp wooden crack. A hooded roadwatcher steps from the brush with a thorn-collared hound, face hidden beneath a crooked crown mark.\n\nMara steps back before anyone has to tell her, one hand wrapped around the blue string.",
    directText:
      "A thorn-wrapped watcher unfolds beside the road, wearing strips of false seal-cloth like a badge. A thorn-collared hound pads at their heel. Mara steps back behind the line before Hollis can somehow object from town.",
    quietToast: "The watched road is quiet now.",
    backAwayToast: "You back away from the watched road.",
    labels: {
      hard: "Protect Mara and hold the hollow.",
      prepared: "Meet the watcher on honest ground.",
      standard: "Drive them away from the gate.",
      breakWatcher: "Break the watcher.",
      backAway: "Back away.",
    },
  },
  westrootGate: {
    name: "First Westroot Gate",
    portrait: "□",
    closedToast: "The First Westroot Gate waits for the no-handle stone to open.",
    labels: {
      search: "Search the threshold first.",
      witnessNote: "Leave a witness note for Bramblecross.",
      stepThrough: "Step through the gate.",
      continue: "Continue",
    },
    thresholdFound: "You find a No-Handle Token tucked inside the threshold.",
    witnessNotePrepared: "You prepare a witness note for Bramblecross.",
    completeName: "Chapter 2 Complete: The Westroot Trail",
    completeText:
      "You step through into gold-green underground light.\n\nLio is alive past this point. The old road opened when truth came first. Somewhere below the hill, Westroot waits.",
  },
} as const;

export const CHAPTER_2_COMPANION_READS: Record<Chapter2CompanionReadId, CompanionReadCopy> = {
  threshold: {
    rowan:
      'Rowan studies the three doors. "One goes down. One gives supplies. One waits. I do not love that order, but I understand it."',
    tilda:
      'Tilda circles the threshold with theatrical suspicion. "Crown door: ominous basement. Lantern door: snacks. Blank rock: rude, suspicious, refusing to do normal door work."',
    moss: 'Moss stands very still before the blank stone. "No handle means it is not asking for strength."',
    fallback:
      "The threshold offers no easy answer, but Edden's drawing and Mara's attention make the pattern clearer.",
  },
  crownDoor: {
    rowan:
      'Rowan plants his shield between Mara and the straight passage. "A real order can explain who it protects. This one only explains who it expects to obey."',
    tilda:
      'Tilda peers down the straight passage. "It is trying very hard to look official. That is what I do when I am lying with props."',
    moss:
      'Moss touches the edge of the crown mark, then wipes his fingers on the grass. "This mark was placed over the road. It did not grow from it."',
    fallback: "The Crown Door sounds certain, but certainty is not the same thing as truth.",
  },
  lanternDoor: {
    rowan:
      'Rowan reads the marks slowly. "Warning, shelter, water, witness. That is a road trying to keep people alive, not a trap trying to hurry them."',
    tilda:
      'Tilda taps each mark in turn. "This one is not glamorous, which is how you know it may be doing actual work."',
    moss:
      'Moss smiles at the old cuts. "Lantern marks do not command the traveler. They remember the traveler."',
    fallback: "The Lantern Door seems less interested in opening than in helping you read the hollow.",
  },
  noHandleDoor: {
    rowan:
      'Rowan rests one hand near his sword but does not touch the stone. "If it is waiting on the road behind us, we should make sure the road has witnesses."',
    tilda:
      'Tilda squints at the blank stone. "No handle. No lock. Very rude. Also weirdly calm about being stared at."',
    moss: 'Moss kneels near the root seam. "It is listening somewhere other than its face."',
    fallback: "The no-handle door waits with uncomfortable patience.",
  },
};

export function getChapter2CompanionRead(
  readId: Chapter2CompanionReadId,
  companionId?: string | null,
) {
  const copy = CHAPTER_2_COMPANION_READS[readId];
  if (companionId === "rowan") return copy.rowan;
  if (companionId === "tilda") return copy.tilda;
  if (companionId === "moss") return copy.moss;
  return copy.fallback;
}

export function getCrownDoorText(flags: Flags = {}, canOpenDen = false) {
  const copy = CHAPTER_2_SCENE_COPY.crownDoor.text;
  if (flags.crownDoorDungeonCleared) return copy.cleared;
  if (canOpenDen) return copy.unlocked;
  if (flags.enteredFalseCrownPassage) return copy.tried;
  return copy.default;
}

export function getCrownDenFalseMapText(flags: Flags = {}, missing: string[] = []) {
  const copy = CHAPTER_2_SCENE_COPY.crownDoorDen.falseMap.text;
  if (flags.crownDoorDungeonCleared) return copy.cleared;
  if (!missing.length) return copy.ready;
  return `A distorted road map covers the far wall. It shows the straight road bold and clean, while the true route is buried under pins and red thread.\n\nThe map will not come free while the den is still working.\n\nStill holding the lie: ${missing.join(", ")}.`;
}

export function getCrownSignText(flags: Flags = {}) {
  const copy = CHAPTER_2_SCENE_COPY.crownSign.text;
  if (flags.crownSignRejected || flags.crownSignLensUsed) return copy.exposed;
  if (flags.noHandleStoneInspected) return copy.repair;
  return copy.default;
}

export function getLanternSignText(flags: Flags = {}) {
  const copy = CHAPTER_2_SCENE_COPY.lanternSign.text;
  if (flags.lanternSignCleaned) return copy.cleaned;
  if (flags.noHandleStoneInspected) return copy.repair;
  return copy.default;
}

export function getNoHandleLioText(flags: Flags = {}, repair = { lioMarkConfirmed: false }) {
  const copy = CHAPTER_2_SCENE_COPY.noHandleDoor.lioText;
  if (flags.maraAskedNoHandleMark && flags.lioHookMarkFound) {
    return repair.lioMarkConfirmed ? copy.foundConfirmed : copy.found;
  }
  return copy.hidden;
}

export function formatNoHandleDoorText(lioText: string, whisper: string) {
  return `${CHAPTER_2_SCENE_COPY.noHandleDoor.baseText}\n\n${lioText}\n\n${whisper}`;
}

export function formatDoorWaitsText(whisper: string) {
  return `You speak the old road phrase.\n\nThe roots shift, listening. Then they settle again.\n\n${whisper}`;
}

export function formatDoorNeedsCrownTruthText(whisper: string) {
  return `You speak the old road phrase.\n\nThe no-handle door warms, then stills. Its roots turn slightly toward the Crown Door.\n\n${whisper}\n\n${CHAPTER_2_SCENE_COPY.noHandleDoor.roadwatcherKeyHint}`;
}

export function formatDoorOpensText() {
  return `You speak the old road phrase.\n\nThe cleaned lantern mark warms in your pack. Behind you, the Crown Door den goes quiet. Ahead of you, the no-handle door opens inward without a sound.\n\nMara reads the tiny hook-tailed mark at the base: ${CHAPTER_2_STORY.lioGateMark}`;
}

export function formatPreparedRoadwatcherText(maraProtected: boolean) {
  return `The no-handle door opens a handspan. Then the Crown Sign cracks, and a hooded roadwatcher steps from the brush, face hidden beneath a crooked crown mark. A thorn-collared hound pads beside them, the collar glowing where the Lantern Sign points.\n\nThis time the hollow is ready: the Lantern marks are clean, Edden's drawing is aligned, and Mara is ${maraProtected ? "already behind the sheltering roots" : "moving back from the fight"} with one hand wrapped around the blue string.`;
}

export function formatWestrootGateText() {
  return `The door with no handle opens inward by itself. Gold-green light spills through root and stone. Mara reads Lio's tiny mark one more time: ${CHAPTER_2_STORY.lioGateMark.toUpperCase()}`;
}

export const CHAPTER_2_REQUIRED_END_FLAGS = [
  "chapterTwoClear",
  "westrootGateOpened",
  "lioAlivePastGate",
  "eddensDrawingValidated",
  "briarCrownWatchingWestroot",
  "crownDoorDungeonCleared",
];

export const WESTROOT_SUPPORTING_CLUE_FLAGS = [
  "shelterNoticeRemoved",
  "lioShelterMarkFound",
  "falseNoticeLensUsed",
  "falseNoticeLanternRead",
  "crownSignRejected",
  "crownSignLensUsed",
  "willowForgeryConfirmedAtHollow",
  "lanternSignCleaned",
  "lanternSignCompared",
  "understandsTrueSigns",
  "eddensDrawingRotated",
  "noHandleDoorStudied",
  "lioHookMarkFound",
  "eddenDrawingComparedAtDoor",
  "eddensDrawingValidated",
];

export const WESTROOT_MISTAKE_FLAGS = [
  "followedFalseDetour",
  "trustedCrownSignAtHollow",
  "forcedNoHandleDoor",
  "forcedNoHandleDoorTwice",
];

function mergeFlags(flags: Flags = {}, assumedFlags: Flags = {}) {
  return { ...flags, ...assumedFlags };
}

export function getWestrootClueCount(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  return WESTROOT_SUPPORTING_CLUE_FLAGS.filter((flag) => !!merged[flag]).length;
}

export function getWestrootMistakeCount(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  return WESTROOT_MISTAKE_FLAGS.filter((flag) => !!merged[flag]).length;
}

export function hasReadTrueLanternGuidance(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  return !!(
    merged.falseNoticeLanternRead ||
    merged.lanternSignCleaned ||
    merged.lanternSignCompared ||
    merged.understandsTrueSigns ||
    merged.eddensDrawingRotated
  );
}

export function getWestrootDoorRepairState(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  const falseOrdersBroken = !!(
    merged.shelterNoticeRemoved &&
    (
      merged.falseNoticeLensUsed ||
      merged.falseNoticeLanternRead ||
      merged.crownSignRejected ||
      merged.crownSignLensUsed ||
      merged.willowForgeryConfirmedAtHollow
    )
  );
  const trueLanternGuidanceRestored = !!(
    merged.lanternSignCleaned &&
    (
      merged.understandsTrueSigns ||
      merged.lanternSignCompared ||
      merged.eddensDrawingRotated ||
      merged.falseNoticeLanternRead
    )
  );
  const lioMarkConfirmed = !!(merged.lioShelterMarkFound && merged.lioHookMarkFound);
  const eddenDrawingAligned = !!(
    merged.eddensDrawingRotated ||
    merged.lanternSignCompared ||
    merged.eddensDrawingValidated ||
    (merged.eddenDrawingComparedAtDoor && merged.lanternSignCleaned)
  );
  const crownFalsehoodCleared = !!merged.crownDoorDungeonCleared;
  const roadwatcherDefeated = !!merged.roadwatcherDefeated;
  const crownDoorKeyFound = !!merged.crownDoorKeyFound;
  const doorHasAskedForTruth = !!merged.noHandleStoneInspected;
  const completedRequirements = [
    falseOrdersBroken,
    trueLanternGuidanceRestored,
    lioMarkConfirmed,
    eddenDrawingAligned,
  ].filter(Boolean).length;
  const missingRequirements = [
    !falseOrdersBroken ? "break the false road orders" : null,
    !trueLanternGuidanceRestored ? "restore the true Lantern guidance" : null,
    !lioMarkConfirmed ? "find Lio's real hook-tailed mark" : null,
    !eddenDrawingAligned ? "align Edden's drawing with the hollow" : null,
  ].filter(Boolean);

  return {
    doorHasAskedForTruth,
    falseOrdersBroken,
    trueLanternGuidanceRestored,
    lioMarkConfirmed,
    eddenDrawingAligned,
    completedRequirements,
    requiredCount: 4,
    missingRequirements,
    crownFalsehoodCleared,
    roadwatcherDefeated,
    crownDoorKeyFound,
    readyForRoadwatcher:
      doorHasAskedForTruth &&
      falseOrdersBroken &&
      trueLanternGuidanceRestored &&
      lioMarkConfirmed &&
      eddenDrawingAligned,
    readyToOpen:
      doorHasAskedForTruth &&
      falseOrdersBroken &&
      trueLanternGuidanceRestored &&
      lioMarkConfirmed &&
      eddenDrawingAligned &&
      crownFalsehoodCleared,
  };
}

export function getWestrootPuzzleOutcome(flags: Flags = {}, assumedFlags: Flags = {}) {
  const merged = mergeFlags(flags, assumedFlags);
  const repair = getWestrootDoorRepairState(merged);
  const supportingClues = repair.completedRequirements;
  const mistakeCount = getWestrootMistakeCount(merged);
  const enoughClues = repair.readyForRoadwatcher;
  const foundLioMark = repair.lioMarkConfirmed;
  const readTrueLanternGuidance = hasReadTrueLanternGuidance(merged);
  const cleanSolve = enoughClues && mistakeCount === 0;
  const seriousMistake = !!(
    merged.followedFalseDetour ||
    merged.trustedCrownSignAtHollow ||
    merged.forcedNoHandleDoorTwice ||
    (enoughClues && !readTrueLanternGuidance)
  );
  const roadwatcherMode: RoadwatcherMode =
    seriousMistake || mistakeCount >= 2 ? "hard" : "standard";

  return {
    supportingClues,
    mistakeCount,
    enoughClues,
    foundLioMark,
    readTrueLanternGuidance,
    cleanSolve,
    roadwatcherPrepared: cleanSolve,
    roadwatcherMode,
    repair,
  };
}

export function getRoadwatcherEncounterKey(flags: Flags = {}, assumedFlags: Flags = {}) {
  return getWestrootPuzzleOutcome(flags, assumedFlags).roadwatcherMode === "hard"
    ? "roadwatcherHard"
    : "roadwatcher";
}
