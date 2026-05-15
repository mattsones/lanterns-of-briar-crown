export type Chapter1CompanionId = "rowan" | "tilda" | "moss";

export type Chapter1CompanionBeat =
  | "caseWall"
  | "briarCrown"
  | "sealedDoor"
  | "reportBack";

export type DialogueMessage = {
  speaker: string;
  side: "left" | "right";
  text: string;
};

export const CHAPTER_1_STORY = {
  battleRewards: {
    boar: {
      name: "Courier Satchel",
      text: `The boar collapses in a storm of dust and snapping brambles. When it finally lies still, the square does not cheer right away. Everyone is looking at the satchel.

The leather is scuffed, but the courier badge is still readable: Lio Brindle, South Lantern Route.

Inside, you find a folded order bearing a crown seal that looks right until you stare at it too long. The crown points are uneven. The wax smells faintly of pine pitch instead of royal resin.

The order reads:

DELAY ROADS. STIR PANIC. HOLD ALL MESSENGERS.

Beneath it is something worse than the order: a small lunch packet, still tied with blue string. Someone has tucked a note under the knot in a careful hand:

Lio - back before noon, or I'm eating your pear roll. - Mara

Whoever carried this satchel expected to reach Hearthhollow today. Whoever cut it loose did not want him arriving at all.`,
    },
  },
  rootCellar: {
    sealedDoorBeforeWarden: `The iron door is chained from the inside.

That is the first wrong thing.

The chain is not there to keep travelers out. It is wrapped through the inner rings, pulled tight from the far side, and fastened with a lock so old its keyhole has gone green at the edges.

Something has been assigned to remain beyond this door, or to make sure no one reaches what lies past it.

Near the bottom hinge, someone has scratched three words into the rust with a shaking hand:

THE OLD WAY LISTENS`,
    sealedDoorAfterWarden: `Behind the fallen warden, the sealed iron door waits.

The chain that animated the Briar Knot Warden lies cracked across the floor. Between two broken links, you notice something that does not belong to the monster: a strip of blue watch-runner cloth, torn and dirty, tied around a lantern hook.

Edden Vale was here.

Maybe he dropped it while running. Maybe he tied it here so someone would know he had reached the door. Either way, Hollis was right: the cellar was not speaking nonsense. It was remembering a route.

The door itself bears layers of marks. The newest is the false crown motif from the planted orders. Beneath that are older lantern route scratches, courier signs, cargo tally marks, and something stranger: a crown shape made not of gold points, but of curling briars.

Under the briar crown, someone has carved a short route command:

WESTROOT OPENED. LANTERN ROAD CONFUSED. WILLOW SEAL RECOVERED. COURIER UNACCOUNTED FOR.

The words do not explain everything. They explain enough.

The forged orders were not the whole plan. They were cover. The stolen Willow seal was not a side theft. It was access. And Lio Brindle may not be dead on the road. He may have been moved through the old ways beneath it.`,
    repeatAfterDiscovery:
      "The sealed door waits in the dark. The Briar Crown mark still curls over older lantern lines, but now you know what it is trying to hide: the old roads are not gone. They are buried, interrupted, and still listening.",
    briarCrownStudySuccess:
      "You brush dirt from the carved briar crown and the mark resolves into something uglier than a symbol. It is not royal, though it wants to be mistaken for royalty at a glance. It twists the idea of a crown into a thorned thing: authority without care, command without responsibility, fear dressed up as order. Beside it, the lantern route marks look older and humbler. They were made by people who needed roads to be trustworthy: couriers, traders, porters, pilgrims, children tracing the marks with curious fingers. The Briar Crown mark has been carved over those older signs, but it has not erased them. Not yet.",
    briarCrownStudyFallback:
      "You brush dirt from the carved briar crown. The mark is not royal, though it wants to be mistaken for something royal at a glance. Beside it, the lantern route marks look older and humbler. They were made to guide; this was carved to control. The Briar Crown mark has been carved over those older signs, but it has not erased them. Not yet.",
    takeProofLabel: "Take the Warden Chain and Edden's cloth.",
    discoveryCompleteToast:
      "Chapter 1 discovery complete. Report back to Hollis and Enna.",
  },
  reportBack: {
    opening:
      "The watchhouse is quieter when you return.\n\nNot peaceful. Just quiet in the way a room becomes quiet when everyone inside realizes the bad news has finally found the door.\n\nCaptain Hollis stands beside the case wall with Enna at his shoulder. Neither of them asks whether you found trouble. Your clothes answer first. Then the Warden Chain does. Then the strip of blue watch cloth in your hand.\n\nHollis sees the cloth and forgets, for half a breath, how captains stand.\n\n\"Edden's,\" he says.\n\nNo one else speaks.\n\nYou place the cloth on the desk beside the cracked lantern.",
    playerReportMessages: (heroName: string): DialogueMessage[] => [
      {
        speaker: heroName,
        side: "right",
        text: "Below Bramblecross, I found the root sigil, the old route mural, the Briar Knot Warden, and a sealed iron door.",
      },
      {
        speaker: heroName,
        side: "right",
        text: "The door said: WESTROOT OPENED. LANTERN ROAD CONFUSED. WILLOW SEAL RECOVERED. COURIER UNACCOUNTED FOR.",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "Enna writes each phrase on a clean strip of paper and pins them in a line across the board. For a moment, the whole case changes shape.",
      },
    ],
    hollisReceivesClothMessages: [
      {
        speaker: "Hollis",
        side: "left",
        text: "He said the old way still listens. I thought he was repeating fear back to himself. I thought...",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "You thought he was hurt enough to be wrong.",
      },
      {
        speaker: "Hollis",
        side: "left",
        text: "He was hurt enough to be right.",
      },
      {
        speaker: "Hollis",
        side: "left",
        text: "You brought back truth. That matters more than clean victory. Thank you.",
      },
    ] satisfies DialogueMessage[],
    threadMessages: [
      {
        speaker: "Enna",
        side: "left",
        text: "Four phrases. Four pieces of machinery.",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "Westroot opened. That is not a person. That is a route, storehouse, gate, tunnel, or all of them. Something west of here is active.",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "Lantern Road confused. That matches the false orders, the planted notices, the staged panic, and the shrine defacement. They did not close the road. They made people stop trusting it.",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "Willow seal recovered. Ada was right to be angry. Her missing crate was not a side theft. Her seal is access. With it, false cargo can move as ordinary cargo.",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "Courier unaccounted for. Not confirmed dead. Not confirmed alive. Accounted for would mean they knew where he ended. Unaccounted for means someone lost track of him, or someone moved him and did not report it cleanly.",
      },
      {
        speaker: "Hollis",
        side: "left",
        text: "Lio Brindle carried truth toward Hearthhollow. Someone stopped him before it arrived.",
      },
      {
        speaker: "Enna",
        side: "left",
        text: "Then our next question is not only who forged the order. It is where the courier went after the satchel was cut loose.",
      },
    ] satisfies DialogueMessage[],
    briarCrownInterpretation:
      "Enna draws the symbol slowly, leaving the lines unfinished at the tips. \"Not a proper royal seal,\" she says. \"Not a noble house mark that I know. Too deliberate to be random. Too repeated to be decoration.\"\n\nHollis studies the sketch.\n\n\"A faction?\"\n\n\"Maybe,\" Enna says. \"Or a promise. Or a threat wearing a crown's shape. I do not want to name it too soon. Names can make guesses feel finished.\"\n\nShe pins the sketch above the other notes.\n\n\"For now, we call it what it shows us: false authority growing over true roads.\"\n\nA silence follows that phrase.\n\nThen Enna adds, almost to herself:\n\n\"The shrine had the better saying. A road is safest when truth walks it first.\"",
    westrootLead:
      "Enna pulls a regional route map from a lower shelf and spreads it over the desk.\n\n\"Westroot is not on the public posting maps anymore,\" she says. \"Too old, too unreliable, too many cellars and storehouses built over the early paths. But couriers still use fragments of the old route language when roads fail.\"\n\nShe traces a line from Hearthhollow to Lantern Road, then to Bramblecross, then west into a faded cluster of marks near the edge of the parchment.\n\n\"If the command says Westroot opened, and if Willow-sealed cargo is being used as cover, then something moved west after the road was confused. Maybe cargo. Maybe prisoners. Maybe Lio.\"\n\nHollis sets the cracked lantern beside the map.\n\n\"Bramblecross cannot chase every shadow. But we can give you what Edden found, what Ada knows, and what the old roads still remember.\"\n\nEnna looks up.\n\n\"Follow Westroot. Look for Willow-sealed cargo that should not be there. Look for true lantern marks hidden beneath false crowns. And if you find Lio Brindle...\"\n\nShe does not finish the sentence.\n\nShe does not need to.",
    closingNarration:
      "That night, Bramblecross does not sleep easily.\n\nBut it sleeps with one more truth than it had before.\n\nThe road was not simply dangerous. It was being lied about.\n\nThe cellar was not merely haunted. It was part of an older way.\n\nThe missing courier was not forgotten. He was a question still burning.\n\nAnd somewhere beyond the sealed door, beneath root and stone and false command, a gold lantern had flickered once.\n\nSmall, but not gone.",
    closingChoices: [
      "I'll follow Westroot.",
      "If Lio is alive, I'll find him.",
      "The Briar Crown won't get to bury this.",
    ],
  },
  companionReactions: {
    caseWall: {
      rowan:
        "Rowan studies the pins and strings without touching them. \"That is not bandit work,\" he says. \"Bandits take what is loose. This is someone deciding where fear should stand. I do not like fighting plans, but I like leaving them alone even less.\"",
      tilda:
        "Tilda leans close to the board, then whistles softly. \"Oh, that is ugly. Clever ugly, but ugly. Fake orders here, missing cargo there, frightened travelers in between. Someone made a maze and convinced people to call it a road.\"",
      moss: "\"A road remembers how it was treated,\" Moss says. \"This one has been taught to flinch. That can be untaught, but not by force alone.\"",
    },
    briarCrown: {
      rowan:
        "Rowan tightens his grip on his shield. \"That mark wants obedience before trust. I know the shape of that. Whoever uses it expects people to kneel first and ask questions later.\"",
      tilda:
        "Tilda crouches beside the mark and wrinkles her nose. \"Not royal. Not honest. Not even stylish. If you are going to impersonate authority, at least have the decency to draw straight lines.\" Then her grin fades. \"Still. People believed it from a distance. That is what worries me.\"",
      moss: "Moss does not touch the mark. \"Briars protect living things when they grow where they belong,\" they say. \"This was carved to choke something older. That is not growth. That is conquest pretending to be nature.\"",
    },
    sealedDoor: {
      rowan:
        "Rowan lowers his voice. \"Edden reached this far and still left proof. That is courage. Quiet courage counts.\"",
      tilda:
        "Tilda turns the phrase over in her mouth: \"Willow seal recovered. Courier unaccounted for.\" Her grin is gone. \"That is not a report. That is inventory. I hate people who inventory people.\"",
      moss: "Moss rests a hand near the sealed door, not touching it. \"There is still lantern-light under the roots,\" they say. \"Buried, but not gone. That matters.\"",
    },
    reportBack: {
      rowan:
        "\"They are using roads like weapons,\" Rowan says. \"Then we answer by making roads safe again. One route at a time.\"",
      tilda:
        "\"Westroot opened,\" Tilda repeats. \"That sounds like a door someone forgot to tell us was a door. I love finding those. I hate what they probably moved through it.\"",
      moss: "Moss watches the gold lanternlight reflected in the cracked glass on Hollis's desk. \"Truth walked first once,\" they say. \"It can again. But roads remember every footstep. We should choose ours carefully.\"",
    },
  },
} as const;

export function getChapter1CompanionReaction(
  companionId: string | null | undefined,
  beat: Chapter1CompanionBeat,
) {
  if (!companionId) return "";
  const reactions = CHAPTER_1_STORY.companionReactions[beat];
  return reactions[companionId as Chapter1CompanionId] || "";
}

export function appendChapter1CompanionReaction(
  text: string,
  companionId: string | null | undefined,
  beat: Chapter1CompanionBeat,
) {
  const reaction = getChapter1CompanionReaction(companionId, beat);
  return reaction ? `${text}\n\n${reaction}` : text;
}
