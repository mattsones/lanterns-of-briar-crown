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
  { id: "first_gate", label: "First Westroot Gate", purpose: "Chapter entry, Transfer Checkpoint, and return threshold" },
  { id: "rootmarket", label: "Rootmarket", purpose: "Community voices and hospitality thread" },
  { id: "witness_stones", label: "Witness Stones", purpose: "Public renewal of Westroot's shared road promises" },
  { id: "mossgarden", label: "Mossgarden", purpose: "Mossback history and community care" },
  { id: "split_hall", label: "Split Hall", purpose: "First Hold Bell debate and final community resolution" },
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
    "Hear the Hold Bell crisis and first Split Hall debate",
    "Renew Westroot's shared promises at the Witness Stones",
    "Inspect Willow-sealed cargo",
    "Resolve one true multi-enemy encounter",
    "Return evidence to Split Hall and set the four Chapter 3 completion flags",
  ],
} as const;

export const CHAPTER_3_SCENE_COPY = {
  firstGate: {
    name: "First Westroot Gate",
    text:
      "The no-handle door closes behind you without a sound. Its broad inner landing is a working Transfer Checkpoint: a clean water channel and wash basin, an airing rack, an inspection bench, a wooden account rail, and an ordinary tray of rootbread and cups. Beyond it, bridges of fitted stone and root-wrapped homes cross a lantern-lit cavern. Every face turns toward the gate.\n\nA broad Stonekin in a slate-colored coat blocks the bridge. \"No account mark. No inside confirmation. That old phrase-lock has not admitted an unscheduled surface party in living memory.\" His eyes settle on you. \"I am Bramwell. Gatehand, until nobody needs one. Who opened my gate?\"",
    repeat:
      "Bramwell watches the guarded First Gate and the Transfer Checkpoint at once. The basin is clean, the airing rack is full, and every name at the account rail has a confirming mark. \"Start with the people who keep this place working,\" he says. \"A hidden village still has more than one truth in it.\"",
  },
  rootmarket: {
    name: "Rootmarket",
    text:
      "Rootmarket is quieter than an aboveground market, but not solemn: jars clink, someone argues gently about turnips, and carved stone animals roll along a rain barrel. A young Stonekin is repairing a lantern shutter with a tool too small to trust and too precise to doubt.\n\n\"Hold this,\" he says, pressing a warm brass hinge into your palm. Then he looks up. \"Oh. You are the gate problem. I am Quill.\"",
    repeat:
      "Quill adjusts a lantern shutter. \"If somebody tells you the road needs only one voice, ask who gets to be quiet. It is usually not the person giving the order.\"",
  },
  mossgarden: {
    name: "Mossgarden of Remembering",
    text:
      "Water runs through shallow stone channels beneath pale moss. Old name tablets and lantern hooks sit among the roots. A Mossback caretaker brushes dirt from a stone without hurrying.\n\n\"Do not step on the names,\" she says. \"Most of them have already been walked over enough. I am Noma Greenstill.\"",
    repeat:
      "Noma rinses her brush in the channel. \"The water can wait. What else would you like to know?\"",
  },
  witnessStones: {
    name: "The Witness Stones",
    introduction:
      "Westroot gathers at the low oak-and-brass shutter across the Witness Stone walk. Bramwell rests one stone-dusted hand on its latch.\n\n\"I closed this walk when the Willow crate came under hold,\" he says. \"The crate moved anyway. Westroot has missed two water calls to six people at the outer shelter. This shutter is holding the wrong thing.\"\n\nNoma takes the other latch. \"Then we open it together and put the new order under both our names.\"\n\nQuill opens the hold ledger while Bramwell and Noma lift the shutter between them. Four worn stones stand in the running water beyond: witness, warning, shelter, and water. Beside them wait the held-cargo ledger, the unanswered water tally, a shelter list, and a warning slate.",
    prompt: "Which promise should Westroot act on first?",
    success:
      "The promise you chose receives the first named mark. Around the circle, the other work begins.\n\nBramwell calls a gatekeeper to Warning. Noma invites the outer-shelter runner to Water. Auntie Lume brings a frightened neighbor to Shelter. Quill reads the cargo hold aloud at Witness. A signal lantern opens toward the outer cistern; moments later, its answer returns: six people present, water needed, all accounted for.\n\nQuill reads the new order aloud. The Witness Stone walk and listening marks are open again. The outer shelter may answer. Bramwell and Noma authorize one witnessed investigation of Cargo Siding. The First Gate, side passages, and general traffic remain under hold.\n\nThe cargo clerk unrolls a charcoal copy of the siding floor. \"The false Willow-marked crate is missing from its assigned bay,\" she says. \"Not necessarily from Westroot. Its wheel grooves run deeper into the siding, then somebody brushed the dust and reset the lock.\"\n\nBramwell turns the Cargo Siding key over to Noma, and Noma closes both her hands around it before offering one back to him. She and Bramwell will open the siding together—and your party will follow them to the junction below the held entrance.",
  },
  rootbread: {
    name: "Transfer Checkpoint — The Rootbread Promise",
    text:
      "At the Transfer Checkpoint, a young Mossback helper brings out the cup set aside after the false Willow transfer. A short blue thread is tied around it in Lio's hooked knot.\n\n\"That is his,\" Mara says. \"He ate here. He returned this so somebody would know he passed through alive.\"",
    complete:
      "The child helps refill the ordinary tray with rootbread and water for whoever waits at the checkpoint next.\n\nMara enters the cup and its blue knot in Westroot's witness record. \"The Rootbread Promise reached Lio,\" she says. \"We keep it moving.\"",
  },
  cargoSiding: {
    name: "Cargo Siding",
    locked:
      "The Cargo Siding remains under a lawful Westroot hold. Bramwell will not open it alone, and Noma will not ask him to ignore the danger. The town must decide how to investigate it together.",
    text:
      "Bramwell and Noma open the Cargo Siding together. Just inside, a chalk rectangle marks the empty bay where the false Willow-marked crate was supposed to remain under hold.\n\nFresh wheel grooves cross the older rail cuts and run behind the rearmost stacks. You follow them to a green three-leaf crate with the same chipped runner and inventory cord Quill logged outside. Its lid has been hastily re-nailed. Scuffed bootprints continue behind the crates into the covered-lantern shadows.\n\nMara touches the Willowmark Lens at your belt. \"Not Ada's missing spice crate,\" she says. \"This is what stealing her seal let them make.\"\n\n\"Missing from the hold bay,\" Quill says quietly. \"Moved deeper while the door was made to look locked. Whoever did it may not have finished.\"",
    evidence:
      "Under the green wax lies pine pitch and a thin wash of crown-red. The crate contains blank order sheets, seal tools, thorn-collar fittings, route-scratching tools, Lio's confiscated pouch, and the transfer tag that recorded him like freight.\n\nThe tag records Lio as a guarded prisoner marched beside the convoy through the checkpoint and sent through the Lower West Gate. The crate remained in Westroot.\n\nA loading ledger bears two acknowledgements: a Briar Crown route scratch and a copied Westroot gate-account mark. The operation borrowed trust from outside and private procedure from within.",
    battle:
      "A hooded Briar Cargo Runner steps from the stacked crates. Beside him, a Seal-Forged Sentry unfolds from wax, order sheets, route tags, and thorn cord.\n\nMara backs behind a loading post. \"Still behind the line,\" she says. \"I am very committed to this part.\"",
  },
  splitHall: {
    name: "Split Hall",
    introduction:
      "Split Hall is a long room of fitted stone, mismatched benches, and repairs that have become their own decoration. Bramwell speaks for those who want the gate sealed. Noma speaks for those who remember why the road existed. Neither side is speaking from nothing.",
    resolution:
      "You lay the false cargo evidence beside the Witness Stone Rubbing.\n\nBramwell says, \"I asked for the gate closed because the danger was real.\"\n\n\"And our silence became useful to the people who lied,\" Noma answers.\n\nThe player names Enna, Captain Hollis, Mayor Anwen, or all three as Bramblecross's first trusted contact. Split Hall establishes Westroot's first restored surface compact in sixty years. The First Gate remains guarded. People and cargo require names, confirmation, sanitation, and witnesses. Warnings and shelter signals travel outward again.\n\nThe hall gasps at the decision. Bramwell explains how record-sharing makes both towns harder to deceive and publicly credits Noma for arguing that a witnessed compact could make caution stronger. Quill carries the first written warning to the named contact while the Rootmarket baker sets bread on the table. The decision has become an action.",
  },
  closing: {
    name: "The Westward Record",
    text:
      "In the Mossgarden, Noma lays the recovered transfer tag beside an older carved gate index and brushes moss from the matching Lower Gate symbol. The carving has been here for generations; the fresh evidence is the clerk's transfer record.\n\nIt records the unnamed courier entering alive under guard, then leaving through the Lower Gate during second watch. Lume's checkpoint cup identifies that courier as Lio.\n\nMara reads the two records together, then closes both hands around the blue string at her wrist. \"He got one message through. Now we know which gate they used. Not yet which road.\"\n\nNoma taps the index beyond the gate mark. \"The Underway has an old survey station below the entrance. Whatever route they chose, they chose it out of sight down there.\"\n\nThe westward passage is still dark, but it is no longer an unnamed direction.",
  },
} as const;

export const WITNESS_STONE_LABELS = {
  witness: "Begin with Witness — investigate in the open.",
  warning: "Begin with Warning — alert the outer shelters.",
  shelter: "Begin with Shelter — protect those caught outside.",
  water: "Begin with Water — keep essential aid moving.",
} as const;

export const WITNESS_STONE_RESPONSES = {
  witness:
    "\"Then we begin by saying exactly what happened,\" you say. Quill brings the held-cargo ledger into the circle and reads every mark aloud. No accusation is entered without a name beside the testimony.",
  warning:
    "\"Then we begin by warning the people who cannot hear this bell,\" you say. Bramwell names the safe listening marks; Noma sends the message with the danger, the sender, and the reason all attached.",
  shelter:
    "\"Then we begin with the people our closed routes left outside,\" you say. Auntie Lume opens the hall pantry while gatekeepers count blankets, beds, and every person the hold must still protect.",
  water:
    "\"Then we begin by keeping necessary help in motion,\" you say. The relay runner sends the missed water tally while Bramwell assigns two witnesses to watch the signal leave and its answer return.",
} as const;

// The vertical slice keeps its callbacks in App.tsx, but the complete Chapter 3
// prose lives here so the playable flow does not silently collapse into summaries.
export const CHAPTER_3_FULL_SCENE_COPY = {
  firstGate: {
    nameReaction: "Bramwell repeats each name once, not warmly and not dismissively, as though placing it at the account rail. \"Names are not permission,\" he says. \"They are where questions begin. A scheduled arrival also carries an outside account and an inside confirmation. You brought neither.\"",
  },
  rootmarket: {
    arrival: "Rootmarket is trying to continue around the fact that the First Gate opened. A Mossback pipe-mender knots a red hold-cord across his stall while telling a Stonekin relay runner that no outer message is worth leading a watcher home. The runner answers that her father is at the outer cistern and cannot drink caution. Two stalls away, someone wraps jars for storage; across the aisle, someone else pointedly unwraps them.\n\nAt a low food counter, an older Mossback baker keeps serving warm bread as though hospitality were a job that becomes more important during an argument. Near the market lantern, a young Stonekin works on a cracked shutter and pretends not to hear anyone raising their voice.",
    ambientVoices: "You listen without approaching a counter.\n\n\"Three sealed nights,\" the pipe-mender says. \"Long enough to learn whether the gate brought a watcher.\"\n\n\"One water call overdue,\" the relay runner answers. \"Long enough for an outer shelter to learn we stopped listening.\"\n\nA vendor packing jars mutters that Bramwell has buried friends. Another, unpacking the same kind of jars, replies that the Mossgarden keeps names of people buried because help arrived at a closed door.\n\nThey sound like neighbors deciding which fear gets to speak first.",
    quillIntro: "At the center of Rootmarket's quiet disagreement, a young Stonekin is repairing a cracked lantern shutter with a tool small enough to be a joke and precise enough not to be one.\n\n\"Hold this,\" he says without looking up, pressing a warm brass hinge into your palm. Only then does he look up and realize you are not from Westroot.\n\n\"Oh. You are the gate problem. Quill Pebbleturn—shutter-mender, signal-keeper, and apparently greeter.\"",
    quillNameReaction: "Quill repeats the names without hesitation, then lets you keep holding the hinge while he aligns the shutter. \"Good. Named hands are easier to ask for help. Three nights ago, a scheduled shipment with a green three-leaf market seal and an unnamed westbound courier arrived with correct-looking credentials. Your party opened an old phrase-lock with no account and nobody inside expecting you. Those are two different arrivals, and both are now our problem.\"",
    guestResponse: "Quill nods toward the hinge in your hand. \"Start with that. Hold it level while you ask.\"",
    shutterResponse: "\"Keeps a lantern from calling through the hill when it should only light a stair. A road signal is useful. A road signal shouted at the wrong time is a map for anyone listening.\"",
    lioResponse: "Quill stills his hands on the hinge. \"We heard a courier passed through. We did not hear his name. There is a difference between a report and a person.\"",
    converged: "Quill takes the brass hinge from your palm and fits it back into place.\n\n\"The old road had a rule. Every signal had to tell someone what it was for, who sent it, and what care came with it. Warning. Shelter. Water. Witness. The Briar people copy the authority and leave out the responsibility. That is what makes their signals easy to misuse.\"\n\nHe reaches for a work tally weighted with a chip of green sealing wax, then stops with his hand above it.",
    oldRule: "\"The Witness Stones are past the Mossgarden. Noma tends them,\" Quill says. \"Warnings, water calls, shelter marks—Westroot gives each one a sender, a witness, and someone responsible for what follows. Bramwell closed the walk when the Willow crate came under hold.\"",
    cargo: "Quill's expression closes. \"Three nights ago, during second watch, a scheduled transfer arrived with a green three-leaf market seal, an unnamed westbound courier, a correct-looking outside account, and Westroot's inside confirmation. Bramwell later found that the sender record disagreed, put the crate under hold, and then somebody moved it anyway. Your party did not arrive that way. You opened an old phrase-lock with no account waiting for you. That is why nobody is enjoying the gate being open.\"",
    topicPrompt: "Quill turns the repaired shutter under the market light. \"All right. What else do you need to know?\"",
    repeat: "The market argument has broken into quieter pieces. The lantern-mender keeps working at one counter while the baker serves bread at the other. Both glance up when footsteps approach, then return to their work.",
    holdBellRepeat: "Half of Rootmarket has vanished behind shutters. The other half is carrying bundles toward the hall. A cautious Mossback pipe-mender ties a red hold-cord across his own stall while a young Stonekin relay runner argues that an outer shelter is still waiting for its water tally. Neither of them looks like they chose the easier side.\n\nQuill holds the repaired lantern shutter against his chest. \"Someone used my work to signal the cargo move. I would like to be furious without also being useful, but apparently today has standards.\"",
    debateRepeat: "Rootmarket is open only in pieces. Red hold-cords cross two stalls; a third has set bread and water outside the cord for anyone caught by the closure. Conversations stop when a gatekeeper passes and begin again before his footsteps fade.\n\nQuill is fitting a second catch to every lantern shutter. \"Open or closed was always the lazy version of the argument. The difficult version has hinges.\"",
    restoredRepeat: "Rootmarket sounds like work again: jars clink, bread knives scrape boards, and two people disagree about turnips without treating the disagreement as treason. Red hold-cords have been rewoven into witness tags beside the reopened stalls.",
  },
  holdBell: {
    introduction: "A single low bell rolls through the hill.\n\nEvery market sound stops. Lantern shutters snap closed along the bridges—one after another, quick as blinking eyes. Somewhere below, iron wheels strike rail and then go abruptly quiet.\n\nA Stonekin cargo clerk runs into the central junction from the siding. Noma arrives from the Mossgarden behind a relay runner, while Quill and Lume come out of Rootmarket with the rest of the crowd.\n\n\"Gatehand!\" the clerk calls. \"The false three-leaf crate is gone from its hold bay. The ledger still says sealed. The siding door still says locked.\"\n\nBramwell arrives with two gatekeepers. People are already drawing red cords across the market stalls. \"Hold Bell order: the First Gate closes to people and cargo. Side passages close. Listening marks and outward signals close. Nobody enters, leaves, or sends until we know whose mark moved that cargo.\"\n\n\"The outer shelter is due its water call,\" Noma says. \"Close the listening marks and we cannot send it or receive their answer.\"\n\nA Mossback pipe-mender knots a hold-cord with shaking hands. \"Last winter a Briar Roadwatcher copied our shelter return mark and followed my sister's crew to the east listening stair. Orra Vale and Pell Moss died keeping it from the homes above. Close it. Close all of it.\"\n\nA Stonekin relay runner answers from across the junction, \"My father is in that shelter. If you close all of it, close your mouth before you call him protected.\"\n\nThe village does not divide cleanly. It divides personally.",
    boundaryResponse: "\"Then count them before the stone closes,\" you say. \"A boundary that cannot name who it leaves outside is only hiding the cost.\"\n\nBramwell's expression hardens, but he turns to a gatekeeper. \"Get the outer-route tally. Names, not numbers.\"",
    warningResponse: "\"A warning that stops at Westroot's gate is not protecting the road,\" you say. \"It is protecting only the people close enough to hear this bell.\"\n\nNoma inclines her head. Bramwell does not, but he listens.",
    cargoResponse: "\"Who could move a held crate through a locked siding?\" you ask.\n\nQuill looks at the shutter in his hands. \"Someone who knew our signal.\"\n\nBramwell looks toward the sealed rail tunnel. \"Or someone who knew which signal my watch was duty-bound to follow.\"",
    converged: "Mara watches the red cords go up across the market. \"If you seal every route, we lose Lio. If you leave every signal calling, whoever took him hears us coming.\"\n\nFor once, her urgency offers no easy side.\n\nBramwell points toward Split Hall. \"Nobody settles this in a passage with one hand on a door. The hall hears it now.\"\n\nNoma turns toward the same room. \"Good. Let Westroot hear what its safety costs while the cost still has names.\"",
  },
  auntieLume: {
    introduction: "The Mossback baker stands behind a low counter with flour on her sleeves and a kettle steaming at her elbow. Her mossy brow is tied back with a yellow scarf.\n\nShe slides a warm heel of bread toward you before anyone asks whether you deserve it.\n\n\"Eat,\" she says. \"Then explain why the gate is making all my soup nervous. Lume is my name. Auntie if I feed you twice.\"",
    nameReaction: "Lume cuts another slice without asking whether the names are true. \"Names first, questions after bread. Better.\"",
    lioResponse: "\"Good. A proper answer before a dramatic one.\" Lume nods back toward the First Gate. \"My young helper carried the ordinary checkpoint tray to an unnamed hooded courier during the false Willow transfer three nights ago. Every traveler waiting at the account rail gets bread and water before Westroot decides on admission. The girl set aside a returned cup that nobody recognized.\"",
    hospitalityResponse: "Lume rests both floury hands on the counter. \"Trust decides whether I open a door. Hunger decides whether I pass bread through it. Westroot calls that the Rootbread Promise.\"",
    promiseResponse: "\"If a traveler waits hungry, you offer food before trust is settled. A guarded boundary may delay passage; it may not make a hungry person invisible. Go back to the Transfer Checkpoint. Ask my helper what happened, and do not finish the girl's story for her.\"",
    refusalResponse: "Lume pushes the bread closer. \"Then take it as evidence. I am feeding you because we do not know you. That is when food matters most. Westroot calls it the Rootbread Promise.\"",
    topicPrompt: "Lume wraps another heel of bread while she waits for your next question.",
    repeat: "\"There,\" Lume says, wrapping another piece of bread for Mara. \"A promise kept does not solve the whole road. It gives the next person a little farther to walk.\"",
  },
  rootbread: {
    unavailable: "The Transfer Checkpoint's basin, airing rack, inspection bench, account rail, and ordinary rootbread tray stand ready at the First Gate. Nothing here is a puzzle. Auntie Lume in Rootmarket may know why one returned cup was set aside.",
    introduction: "Back at the Transfer Checkpoint, Lume's young helper waits beside the ordinary rootbread tray. The girl points to the wash basin, airing rack, inspection bench, and account rail in the order every admitted traveler uses them.\n\n\"The hooded courier waited here with the Willow crate and two handlers,\" she says. \"I brought the same bread and water everybody gets. I kept the cup he returned because it had a knot I did not know.\"",
    appearanceResponse: "\"He was young,\" the child says. \"Hood over his face. His hands were free so he would look like an ordinary courier, but one handler kept hold of his elbow and the other stood between him and the gate. He ate the bread. He watched everything.\"",
    routineResponse: "\"He waited until one handler turned toward the account rail,\" the girl says. \"Then he pulled a short blue thread from his cuff and wound it around the cup before he gave it back. The tray helped him hide the message in an ordinary checkpoint routine.\"",
    childPrompt: "The Mossback child waits beside the Transfer Checkpoint tray. Mara lets the child finish the account before asking to see the returned cup.",
    cupReveal: "The child brings out the set-aside cup. A short blue courier thread circles it in one tiny hooked knot.\n\nMara's breath catches. \"That is Lio's knot. He ate here. He returned this so somebody would know he passed through alive.\"\n\nThe child looks from the cup to the half-empty tray. \"What happens to it now?\"",
    converged: "You and the child restock the ordinary tray with rootbread and water for the next traveler. Mara enters the returned cup and its blue knot in Westroot's witness record.\n\n\"The Rootbread Promise reached Lio,\" she says. \"We did not keep him here. We can keep the promise moving.\"",
    repeat: "The Transfer Checkpoint tray is restocked for the next traveler. Lio's returned cup and blue knot now sit in Westroot's witness record, not as a reward to take again but as proof that the Rootbread Promise reached him.",
  },
  mossgarden: {
    nameReaction: "Noma touches two fingers to a blank name tablet beside the water. \"Names tell us who a question belongs to,\" she says. \"Proof tells us what happened.\"",
    namesResponse: "\"Witnesses. Travelers. Bridge-menders. Some names came from the Witness Stones after a warning, a repair, or a missed return. Westroot records names because a missing person is never only a missing number.\"",
    courierResponse: "Noma looks at Mara, then at the old gate-light still reflected on your gear. \"Then begin with what you know, not what you fear. Fear makes a loud first draft.\"",
    gateResponse: "\"About sixty years ago, Witherdeath entered Westroot through ordinary admitted traffic,\" Noma says. \"The old checkpoint checked names and cargo, but it had no orderly washing, airing, or observation. People died. Westroot built the sanitation you saw at the First Gate, and that was prudent. Then we ended routine surface compacts, disappeared from public maps, and made isolation the rule. Bramblecross had been our nearest active partner. In time, it remembered us as a story. We kept rare controlled transfers and the outer shelter, but fear turned a safeguard into a whole civic policy.\"",
    converged: "Noma walks with you to four weathered stones set in a shallow water circle. A low oak-and-brass shutter bars the approach. Its latch bears Bramwell's public Gatehand seal.\n\nThe slate beside it says:\n\nHOLD ORDER — FALSE THREE-LEAF CARGO: KEEP IN ASSIGNED BAY.\nWITNESS STONE WALK AND LISTENING MARKS: CLOSED.\nREVIEW: SPLIT HALL.\n\n\"The first line is the suspicious cargo Bramwell stopped three nights ago; Quill keeps its ledger,\" Noma says. \"The next closes this walk and the signal stations it governs. The last tells every reader where the order can be challenged. Bramwell's seal makes him answerable for all three.\"\n\nNoma gestures toward the shutter rather than opening it. \"Travelers once left route testimony here—washed bridges, safe shelters, names of those who passed. Westroot still brings every warning, water call, and shelter promise here so the responsible hands can be witnessed.\"\n\nMara looks toward the tally hook beside the shutter. \"And the outer shelter's water call?\"\n\n\"Waiting for the witnessed mark it needs before it can leave,\" Noma says. \"Until it does, Westroot cannot hear their answer.\"",
    showResponse: "\"Four promises, four kinds of work,\" Noma says. \"The question is which Westroot must begin today.\"",
    removeResponse: "\"Bramwell placed this seal as Gatehand,\" Noma says. \"He should stand here when Westroot changes the order.\"",
    wrongResponse: "\"Bramwell's public seal makes him answerable for this hold,\" Noma says. \"Split Hall decides when its cost exceeds its protection.\"",
    holdBellRepeat: "The water still runs, but every listening lantern above the Mossgarden has been hooded. Noma has laid blank name tablets beside the channel for anyone the sudden closure leaves uncounted. \"Bramwell is making a shield,\" she says. \"Split Hall must decide who is standing outside it.\"",
    debateRepeat: "The Mossgarden is quiet enough to hear Rootmarket arguing through the water channels. Noma has not uncovered the Witness Stones yet. \"An old promise becomes an answer when frightened people can still choose it together,\" she says.",
  },
  witnessStones: {
    inspections: {
      witness: "A hand pressed to stone beside a simple line: I was here. This happened. Let the next traveler know.",
      warning: "A lantern turned outward over a broken bridge: The danger is named before the traveler reaches it.",
      shelter: "A roofline beneath a root: The tired traveler receives help before the road asks more.",
      water: "A cup beside a spring mark: Leave enough for the journey after the danger.",
    },
    shutterInspection: "The oak crossbar is sound Westroot work. Bramwell's public Gatehand seal sits beside a slate naming the Willow cargo hold, the closed stone walk and listening marks, and Split Hall review. Anyone who reads it knows who ordered the closure, what it covers, and where it must be questioned.",
  },
  cargoSiding: {
    lensResult: "Ada's lens catches the nicked three-leaf mark beneath a layer of pine pitch and a thin wash of crown-red wax. The seal is genuine enough to pass a hurried eye and false enough to make Ada furious.",
    manualResult: "Even without the lens, the wax tells on itself. Green market wax has been warmed, pressed, covered, then made to look untouched. Someone wanted trust to arrive before questions did.",
    ledgerResult: "The loading ledger has no sender's name. Instead, it bears two acknowledgements: a Briar Crown route scratch and an old Westroot gate-account mark. One opened the way from outside. One confirmed it from within.",
    preparedResult: "Fresh boot scuffs cross the ledger stand and vanish into a narrow service passage behind the crates. You quietly show Quill. He angles the repaired lantern shutter across that exact route while Bramwell stations two gatekeepers beyond it. If the Cargo Runner bolts after the fight, Quill can close the shutter and the gatekeepers can take him alive.",
    crateResult: "The lid gives with a reluctant scrape.\n\nInside are no spices. There are blank order sheets cut to official size. Broken seal tools. Thorn-collar fittings wrapped in waxed cloth. Small scratching knives for changing route marks in the dark.\n\nAt the bottom lies Lio's confiscated courier pouch and a torn transfer tag. It records one guarded prisoner marched beside the Willow convoy through the checkpoint and then sent through the Lower West Gate.\n\nMara reads it twice. \"They recorded him like cargo,\" she says, \"but this crate stayed in Westroot. Lio walked through alive.\"",
    evidence: "Quill lays the transfer tag beside Lio's confiscated pouch. \"This record is plain,\" he says. \"Lio was marched beside the convoy under guard and sent through the Lower West Gate. The crate remained here.\"\n\nNoma reads the two acknowledgement marks without touching them.\n\n\"The operation borrowed trust from both sides of the checkpoint,\" she says. \"Ada's Willow seal outside. Westroot's account mark and second-watch timing inside.\"\n\nBramwell's jaw tightens. \"A gate account can be copied.\"\n\n\"Yes,\" Noma replies. \"This proves procedural knowledge, not a willing traitor. We name that difference too.\"\n\nThere is no accusation in Noma's voice. That makes the silence heavier.\n\nThen, from the far end of the siding, a crate latch snaps shut.\n\nSomeone says, \"You should have left the gate closed.\"",
    battle: "A hooded Briar Cargo Runner steps out from behind the stacked crates. A Seal-Forged Sentry unfolds beside him from a bundle of order sheets, wax, route tags, and thorn cord. The runner keeps one hand near a pouch of crown-red powder and one eye on the narrow service passage behind him. He means to hold you here, then carry warning west if he can break away.\n\nMara backs behind a stone loading post before the fight begins. \"Still behind the line,\" she says, breathless but steady. \"I am very committed to this part.\"",
    captured: "The runner flings his crown-red powder and bolts, but the service passage is the route you prepared. Quill snaps the repaired shutter closed. Bramwell's gatekeepers step through the harmless smoke and bind the runner before he reaches the west tunnel.\n\n\"The fight is over,\" Bramwell says. \"Running was your last choice. Answering questions is the next one.\"",
    escaped: "You beat the Cargo Runner and disarm him, but winning the fight does not bind his feet. He flings crown-red powder into the lantern and dives into the narrow service passage before Bramwell's gatekeepers can cross the smoke. The passage was not covered, and by the time the air clears he is gone west. The defeated Seal-Forged Sentry and all of the crate evidence remain behind.\n\n\"He ran west,\" Mara says. \"That means west is still a direction, not an answer.\"",
    converged: "The recovered tag carries a route notation that Noma recognizes but cannot fully read in the siding's bad light.\n\n\"Not a public road,\" Noma says. \"A listening route. It will need a different map.\"",
  },
  splitHall: {
    preBellIntroduction: "Split Hall is only half full, which somehow makes the argument carry farther. Nobody sits in formal sides yet. They have simply left small spaces between themselves and the neighbors they do not want to answer.\n\nA Mossback pipe-mender winds a red hold-cord around one wrist. \"Bramwell stopped the Willow crate. Stop the listening signals too, before somebody follows one home.\"\n\nAcross the repaired table, a young Stonekin relay runner grips an outer-shelter tally. \"My father is at the cistern post. Westroot's water call is late. It leaves under a witnessed mark at the stones, and Bramwell's shutter keeps that mark from leaving.\"\n\nAn older Stonekin gatekeeper tells the runner not to mistake worry for wisdom. A Mossback market clerk tells the gatekeeper not to mistake stone for a plan.\n\nThe baker from Rootmarket leaves a small basket of bread in the middle of the table. \"If you are going to sharpen every sentence, eat first. I will not have this hall fainting dramatically.\"\n\nNobody laughs, but the pipe-mender takes one piece and breaks it without eating.",
    preBellCloseResponse: "\"A closed gate can still leave someone outside,\" you say.\n\nThe relay runner nods too quickly. The pipe-mender answers more slowly. \"And an open signal can tell danger which door is yours. That is the part people keep stepping around.\"",
    preBellHoldResponse: "\"Holding suspicious cargo is not the same as abandoning the road,\" you say.\n\nThe pipe-mender's shoulders lower a fraction. The relay runner lays the unanswered tally flat on the table. \"Then the hold needs witnesses—and somebody still needs to answer this.\"",
    preBellListenResponse: "You stay quiet long enough to hear the spaces between the arguments: names people almost say, routes they are afraid to admit are still used, and the scrape of benches shifting away from old friends.\n\nMara whispers, \"They were fighting about the gate before we became the gate problem.\"",
    preBellRepeat: "The early argument has dispersed into smaller conversations. The red hold-cord, the unanswered outer-shelter tally, and the Rootmarket baker's half-finished bread remain on the repaired table. Split Hall is waiting for a disagreement large enough to fill it.",
    earlyReturnIntroduction: "When the Hold Bell calls you back, Split Hall is no longer half full. The small spaces you noticed between neighbors have widened into a central aisle. Benches scrape into two rough banks as the last market workers arrive. Stonekin and Mossbacks sit on both sides.\n\nThe same Mossback pipe-mender now wears the red hold-cord around his wrist. The young Stonekin relay runner still clutches the unanswered outer-shelter tally. The Rootmarket baker has added a second bread basket at the far end of the table. Nobody reaches for either one.\n\nBramwell plants both hands on the repaired table. \"Three days sealed. Long enough to inspect every account mark and learn who moved the Willow crate. I have buried people because danger was given the benefit of the doubt.\"\n\nNoma does not soften the answer. \"And Westroot has missed two water calls to the outer shelter. Three days may be the whole distance between waiting and being forgotten.\"\n\nQuill places his lantern shutter on the table. A fresh Crown-red scorch stains the inner hinge. \"Someone used a Westroot signal to move the crate. Closing the gate does not remove the person who knew that signal. It locks us in with the question.\"",
    earlyIntroduction: "Split Hall is already full when you arrive. Nobody has called the meeting. The Hold Bell did that.\n\nThe benches have pulled into two rough banks with an aisle between them. Stonekin and Mossbacks sit on both sides. A Mossback pipe-mender with a red hold-cord around one wrist sits behind Bramwell. The young Stonekin relay runner stands nearer Noma, clutching an unanswered outer-shelter tally.\n\nBramwell plants both hands on the repaired table. \"Three days sealed. Long enough to inspect every account mark and learn who moved the Willow crate. I have buried people because danger was given the benefit of the doubt.\"\n\nNoma does not soften the answer. \"And Westroot has missed two water calls to the outer shelter. Three days may be the whole distance between waiting and being forgotten.\"\n\nQuill places his lantern shutter on the table. A fresh Crown-red scorch stains the inner hinge. \"Someone used a Westroot signal to move the crate. Closing the gate does not remove the person who knew that signal. It locks us in with the question.\"\n\nThe Rootmarket baker sets two bread baskets at opposite ends of the table. Nobody reaches for either one.",
    earlyRepeat: "The Hold Bell argument has become quieter, not smaller. Bramwell's side is comparing gate accounts. Noma's side is copying names from the outer-shelter list. Between them, Quill's scorched shutter waits on the table like a question nobody can lock away.",
    outerShelterResponse: "The Stonekin relay runner unfolds the unanswered tally. \"Six people maintain the outer cistern and the listening post. My father is one. At every second water bell, Westroot sends the call and they return their headcount and need. We have missed two.\"\n\nThe Mossback pipe-mender looks away first. \"My sister used to carry that tally,\" he says. \"Before a false order brought her home on a door. I still want the gate closed. I also want those six names said aloud.\"\n\nThe disagreement survives the truth, but it can no longer pretend the people outside are an abstraction.",
    gateCostResponse: "Bramwell looks toward the families nearest his bench. \"Last winter, a Briar Roadwatcher copied an outer-shelter return mark and followed it to the east listening stair. Orra Vale and Pell Moss died keeping it from the homes above. Children sleep above those roots. That is what closing protects.\"\n\nNoma answers, \"Then keep saying Orra and Pell. Caution becomes cruelty only when it stops counting who pays for it.\"\n\nBramwell does not thank them. He repeats both names before he continues.",
    cargoHoldResponse: "Quill turns the scorched shutter over. \"The hold signal was correct. The timing was correct. The private hinge-mark was correct. Someone outside could copy the paint. He could not guess when Bramwell's second watch changed.\"\n\nA gatekeeper protests. A market clerk protests louder. Suspicion crosses the aisle faster than either of them.\n\nNoma strikes the table once with the flat of her hand. \"No traitors invented before evidence. That is how fear writes its first false order.\"",
    earlyConverged: "Mara looks from the sealed-gate benches to the outer-shelter list. \"Opening everything could tell the Crown where Lio went. Closing everything could erase the next mark he leaves. I hate both of those truths.\"\n\nBramwell studies her for a moment. \"Good. Hate them honestly.\"\n\nNoma slides the old Witness Stone rubbing frame into the center of the table, still empty. \"At the stones, every road action receives a named sender, a witness, and someone responsible for what follows. We can change this hold without opening blindly.\"\n\nBramwell looks at the unanswered water tally, then at his own seal on the hold order. \"I closed the stone walk,\" he says. \"I will stand there when we decide whether to open it.\"",
    investigationOffer: "You point to the empty hold mark on Quill's ledger. \"Then let us find the false Willow-marked crate before this hall decides who moved it. It did not walk through a locked door. We can follow the wheel marks, compare the copied seal with Ada Willowmarket's lesson, and bring back evidence before anyone names a traitor.\"\n\nThe cargo clerk who raised the alarm steps forward. \"Missing from its assigned bay,\" she says. \"Not proven gone from Westroot. I found a wheel cut leading toward the inner siding before somebody brushed dust across it.\"\n\nBramwell shakes his head once. \"You will not enter a held route on a stranger's promise—or alone.\"\n\n\"Then do not send them alone,\" Noma says. \"We renew the road promises in public. You and I open the siding together. They follow the physical trail, and Westroot witnesses what comes back.\"\n\nBramwell looks across the aisle before answering. \"That is an investigation I can put my name to.\"",
    earlyMemories: {
      outerShelter: "You remember the six names at the outer cistern and the two water bells they have missed.",
      gateCost: "You remember Bramwell naming the people lost after false warnings reached their doors.",
      cargoHold: "You remember the private watch timing burned into Quill's shutter—and how quickly suspicion crossed the aisle.",
    },
    fullIntroduction: "Split Hall is not grand. It is a wide room of fitted stone, mismatched benches, and a long table repaired so often that the repairs have become its decoration.\n\nThe two sides of the room are not marked Closed Root and Open Lantern. They do not need to be. People choose their seats the way people choose shelter in bad weather: near whoever seems likely to keep them safe.\n\nBramwell places the copied gate-account mark on the table. Noma places the Witness Stone Rubbing beside it. You place the false cargo evidence last.\n\nFor a while, nobody speaks.\n\n\"I asked for the gate closed because the danger was real,\" Bramwell says. \"Forged orders. Roadwatchers. Cargo that looks like help until it has crossed your floor. I will not apologize for wanting families asleep behind stone.\"\n\n\"And the cargo crossed because our silence became useful to the people who lied,\" Noma says. \"We did not invite them. But a road no one may witness is easy for a false order to claim.\"\n\nQuill sets the cracked crown slat beside the evidence. \"The Briar Crown did not beat the gate,\" he says. \"Its people learned which parts of us were afraid and made a key out of that.\"\n\nBoth sides are ready to authorize the same guarded compact with Bramblecross. They wait for you to name the lesson that should guide it.",
    bramwellResponse: "Bramwell nods once. \"Thank you.\"\n\n\"But,\" you continue, \"a closed gate did not stop the false cargo. It made it harder for anyone outside to know it was here.\"",
    nomaResponse: "Noma inclines her head. \"Truth is not the same as throwing every door open.\"\n\n\"No,\" you say. \"It is warning people before they walk into a trap, then giving them shelter and water when they need it.\"",
    stonesResponse: "You place the rubbing in the center of the table. \"Witness. Warning. Shelter. Water. Each promise names who is responsible and what care the next traveler can expect. That is why people can trust the road enough to follow it.\"",
    contactPrompt: "Bramwell looks at the old road phrase for a long time.\n\n\"A shield must know what it covers,\" he says. \"And when to lower.\"\n\nNoma's expression softens. \"Then name what changes—and what does not.\"\n\nBramwell looks to you instead of pretending he knows a town he has not visited in sixty years. \"You know Bramblecross. Who should receive Westroot's first warning, and whose name should we trust on the first outside account?\"",
  },
} as const;

export const BRAMBLECROSS_CONTACT_CHOICES = {
  enna: {
    label: "Name Enna, the watch clerk who built the road case.",
    playerResponse: "\"Enna,\" you say. \"She compares records before she trusts a claim, and she built the case that led us here.\"",
    recipient: "Enna",
  },
  hollis: {
    label: "Name Captain Hollis, who can bind the watch to the compact.",
    playerResponse: "\"Captain Hollis,\" you say. \"He can put Bramblecross's watch behind the compact and answer for the people carrying its warnings.\"",
    recipient: "Captain Hollis",
  },
  anwen: {
    label: "Name Mayor Anwen, who can answer for Bramblecross publicly.",
    playerResponse: "\"Mayor Anwen,\" you say. \"She can answer for Bramblecross in public and make sure the compact belongs to the town, not only its watch.\"",
    recipient: "Mayor Anwen",
  },
  all: {
    label: "Name Enna, Captain Hollis, and Mayor Anwen together.",
    playerResponse: "\"All three,\" you say. \"Enna can test the records. Captain Hollis can answer for the watch. Mayor Anwen can answer for Bramblecross in public. No one person should carry the whole compact.\"",
    recipient: "Enna, Captain Hollis, and Mayor Anwen",
  },
} as const;

export type BramblecrossContactChoice = keyof typeof BRAMBLECROSS_CONTACT_CHOICES;

export function getSplitHallResolution(contactChoice: BramblecrossContactChoice) {
  const contact = BRAMBLECROSS_CONTACT_CHOICES[contactChoice];
  return `${contact.playerResponse}

Bramwell turns to the hall. "Westroot restores one surface compact: Bramblecross."

The room answers with a single audible gasp. Then the benches erupt in murmurs.

"The surface?" someone says.

"After sixty years?"

"What reaches the First Gate now?"

Bramwell raises one hand and waits until the questions settle.

"This does not throw Westroot open," he says. "The First Gate stays guarded. People and cargo still require a named outside account, inside confirmation, checkpoint sanitation, and witnesses. No other former partner is readmitted by this order."

He places one hand beside the false Willow seal. "But isolation kept us from asking Bramblecross whether this mark was honest. It let a false shipment use trust from both towns while neither town compared its records. A guarded compact gives us people who can verify a seal, carry a warning, answer a shelter call, and tell us when a familiar name is being used as a disguise. That makes both communities harder to fool."

Bramwell looks across the repaired table to Noma. "Noma has argued for a witnessed surface compact longer than I have enjoyed hearing it. She was right. Caution without an honest neighbor became a wall around our own blind side."

Noma's smile is small and unmistakable. "I will try not to enjoy hearing that too much."

Bramwell names ${contact.recipient} as the first Bramblecross contact. Warning, shelter, and water signals may travel outward again under witnessed marks.

Quill copies the decision, folds the first warning for ${contact.recipient}, and shoulders a courier satchel. "If a compact is real," he says, "someone has to carry its first message."

Quill leaves for the First Gate while the Rootmarket baker sets bread on the table. The decision is already in motion.

Mara picks up a piece, breaks it in half, and gives one half to the nearest gatekeeper. "For the next traveler," she says.`;
}

type Chapter3CompanionBeat = "firstView" | "holdBell" | "rootbread" | "witnessRenewal" | "cargo" | "resolution";

const CHAPTER_3_COMPANION_REACTIONS = {
  firstView: { rowan: "A hidden town is still a town. Keep your hands visible. Let the people here decide we are not another order walking in.", tilda: "A whole village under a hill, and every lantern has opinions. I respect that.", moss: "This place has been holding its breath for a long time." },
  holdBell: { rowan: "A shield has to know who stands behind it. Make the hall count the outer shelter before anyone closes another route.", tilda: "That bell did not split Stonekin from Mossbacks. It split every family from the person each is afraid of losing.", moss: "The hill is holding its breath again. This time everyone can hear who runs out of air first." },
  rootbread: { rowan: "They fed him before deciding whether the account was trustworthy. That is care with a boundary. We could use more of it.", tilda: "The best secret message is apparently a returned lunch cup. I approve.", moss: "A promise is a path someone has already walked for another." },
  witnessRenewal: { rowan: "A good order names the danger and the hand responsible. I can stand behind that.", tilda: "Two latches, four promises, and nobody pretending one person can carry the whole road. Sensible.", moss: "The answer came back because somebody opened the signal and waited for it." },
  cargo: { rowan: "They turned trust into a disguise. That is why it feels worse than an ordinary theft.", tilda: "A fake seal, a fake order, and a real person moved like a crate. I have run out of polite names for them.", moss: "The lie used a root from both sides. We will have to heal both sides too." },
  resolution: { rowan: "A shield with witnesses behind it can still be lowered. That will do.", tilda: "Turns out the secret village has rules for being less secret. Very advanced.", moss: "The hill has exhaled." },
} as const;

export function appendChapter3CompanionReaction(text: string, companionId: string | null | undefined, beat: Chapter3CompanionBeat) {
  if (!companionId) return text;
  const reactions = CHAPTER_3_COMPANION_REACTIONS[beat] as Record<string, string>;
  return reactions[companionId] ? `${text}\n\n${reactions[companionId]}` : text;
}

export function canStartChapter3(flags: Flags = {}) {
  return CHAPTER_3_STORY.entryRequirements.every((flag) => !!flags[flag]);
}

export function isChapter3Complete(flags: Flags = {}) {
  return CHAPTER_3_STORY.requiredEndFlags.every((flag) => !!flags[flag]);
}
