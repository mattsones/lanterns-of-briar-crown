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

export const CHAPTER_3_SCENE_COPY = {
  firstGate: {
    name: "First Westroot Gate",
    text:
      "The no-handle door closes behind you without a sound. Then the hill opens: bridges of fitted stone, root-wrapped homes, and gold-green moss lanterns above a market that is packing itself away very quickly. Every face turns toward the gate.\n\nA broad Stonekin in a slate-colored coat waits at the bridge. \"No,\" Mara says quietly.\n\n\"That is usually the first word,\" he says. \"I am Bramwell. Gatehand, until nobody needs one. Who opened my gate?\"",
    repeat:
      "Bramwell watches the gate and the town at once. \"Find out how the false cargo reached us. Then tell us what closing would actually protect.\"",
  },
  rootmarket: {
    name: "Rootmarket",
    text:
      "Rootmarket is quieter than an aboveground market, but not solemn: jars clink, someone argues gently about turnips, and carved stone animals roll along a rain barrel. A young Stonekin is repairing a lantern shutter with a tool too small to trust and too precise to doubt.\n\n\"Hold that,\" they say. Then they look up. \"Oh. You are the gate problem. I am Quill.\"",
    repeat:
      "Quill adjusts a lantern shutter. \"If somebody tells you the road needs only one voice, ask who gets to be quiet. It is usually not the person giving the order.\"",
  },
  mossgarden: {
    name: "Mossgarden of Remembering",
    text:
      "Water runs through shallow stone channels beneath pale moss. Old name tablets and lantern hooks sit among the roots. A Mossback caretaker brushes dirt from a stone without hurrying.\n\n\"Do not step on the names,\" they say. \"Most of them have already been walked over enough. I am Noma Greenstill.\"",
    repeat:
      "Noma cups water over an old route mark. \"Fear makes a loud first draft. Begin with what you know.\"",
  },
  witnessStones: {
    name: "The Witness Stones",
    introduction:
      "Four worn stones sit in a shallow circle. A fifth, newer plaque has been nailed over the first: a crooked crown with one command. OBEY.\n\nNoma touches the oldest stone. \"The road did not begin with command. It began with what the next traveler needed: tell what is true, name the danger, give shelter, leave water.\"",
    prompt: "Choose the next road promise.",
    success:
      "Witness warms beneath your hand. Warning kindles a small gold lantern above a broken-bridge mark. Shelter folds root shadows into the shape of a roof. Water clears the channel without spilling.\n\nThe false crown plaque cracks loose. Underneath, the old road phrase shines through: A ROAD IS SAFEST WHEN TRUTH WALKS IT FIRST.",
    failure:
      "The stones turn cold. Moss-lantern shutters close all around the garden, and a bell rings twice in Rootmarket.\n\nNoma does not raise their voice. \"A mistake,\" they say. \"That is why the stones were built to be witnessed. We name what went wrong, then leave the next traveler a better way through.\"",
  },
  rootbread: {
    name: "The Rootbread Promise",
    text:
      "At a sealed hatch, someone has left rootbread, dried apple, and a cup of water under waxed leaf. Beneath the cup, Mara finds a blue thread tied in a tiny hooked loop.\n\n\"That is Lio's knot,\" she says. \"Not a message. A courier's way of saying this was left for someone who might need to keep going.\"",
    complete:
      "A small Mossback child peers out from behind a barrel. \"I only put bread there. Somebody knocked once, waited, then knocked twice.\"\n\nMara takes the blue thread carefully. \"He passed close enough to hope someone would notice. That is not nothing.\"",
  },
  cargoSiding: {
    name: "Cargo Siding",
    locked:
      "The Cargo Siding lock bears the same four old road needs as the Witness Stones. Westroot will not open another way until the stones remember their purpose.",
    text:
      "Old rail grooves run through the stone beneath covered lamps. The nearest crate bears Ada Willowmarket's green three-leaf seal.\n\nQuill kneels by its runner. \"This came through a locked door,\" they say. \"That is the part I keep disliking.\"",
    evidence:
      "Under the green wax lies pine pitch and a thin wash of crown-red. The crate contains blank order sheets, seal tools, thorn-collar fittings, and a true courier pouch stamped WESTWARD RELAY — TRANSFERRED.\n\nA loading ledger bears two acknowledgements: a Briar Crown route scratch and an old Westroot gate-account mark. Westroot was opened from inside and outside.",
    battle:
      "A hooded Briar Cargo Runner steps from the stacked crates. Beside them, a Seal-Forged Sentry unfolds from wax, order sheets, route tags, and thorn cord.\n\nMara backs behind a loading post. \"Still behind the line,\" she says. \"I am very committed to this part.\"",
  },
  splitHall: {
    name: "Split Hall",
    introduction:
      "Split Hall is a long room of fitted stone, mismatched benches, and repairs that have become their own decoration. Bramwell speaks for those who want the gate sealed. Noma speaks for those who remember why the road existed. Neither side is speaking from nothing.",
    resolution:
      "You lay the false cargo evidence beside the Witness Stone Rubbing.\n\nBramwell says, \"I asked for the gate closed because the danger was real.\"\n\n\"And our silence became useful to the people who lied,\" Noma answers.\n\nThe old road phrase gives the hall a practical answer: witnessed truth, clear warning, shelter, and water. The gate will stay watched, but cargo will be opened with witnesses and every warning will be copied outward.\n\nAuntie Lume sets rootbread on the table. It is the closest thing Westroot has to a vote of confidence.",
  },
  closing: {
    name: "Westroot Remembers",
    text:
      "In the Mossgarden, the restored water channel clears moss from a shallow courier mark. Noma brushes it clean.\n\nBRINDLE PASSED. BREATHING. BOUND WEST.\n\nMara reads it twice, then closes both hands around the blue string at her wrist. \"Then we keep going.\"\n\nNoma studies the cargo transfer tag. \"This points to a listening route. It cannot be read like a road map. Edden's drawing may be less broken than we thought.\"\n\nThe gold moss-lanterns brighten along the westward passage. Not because the way is safe. Because it has been seen.",
  },
} as const;

export const WITNESS_STONE_SEQUENCE = ["witness", "warning", "shelter", "water"] as const;

export const WITNESS_STONE_LABELS = {
  witness: "Witness — tell what is true.",
  warning: "Warning — name the danger.",
  shelter: "Shelter — protect the traveler.",
  water: "Water — sustain the journey.",
  crown: "False Crown — obey without guidance.",
} as const;

export function canStartChapter3(flags: Flags = {}) {
  return CHAPTER_3_STORY.entryRequirements.every((flag) => !!flags[flag]);
}

export function isChapter3Complete(flags: Flags = {}) {
  return CHAPTER_3_STORY.requiredEndFlags.every((flag) => !!flags[flag]);
}
