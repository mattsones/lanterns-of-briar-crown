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
      "The no-handle door closes behind you without a sound. Then the hill opens: bridges of fitted stone, root-wrapped homes, and gold-green moss lanterns above a market that is packing itself away very quickly. Every face turns toward the gate.\n\nA broad Stonekin in a slate-colored coat waits at the bridge. \"No,\" Mara says quietly.\n\n\"That is usually the first word,\" he says. \"I am Bramwell. Gatehand, until nobody needs one. Who opened my gate?\"",
    repeat:
      "Bramwell watches the gate and the town at once. \"Start with the people who keep this place working. A hidden village still has more than one truth in it.\"",
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
      "Westroot gathers at the low oak-and-brass shutter across the Witness Stone walk. Bramwell rests one stone-dusted hand on its latch.\n\n\"I closed this walk when the Willow crate came under hold,\" he says. \"The crate moved anyway. Westroot has missed two water calls to six people at the outer shelter. This shutter is holding the wrong thing.\"\n\nNoma takes the other latch. \"Then we open it together and put the new order under both our names.\"\n\nQuill opens the hold ledger while Bramwell and Noma lift the shutter between them. Four worn stones stand in the running water beyond: witness, warning, shelter, and water. Beside them wait the held-cargo ledger, the unanswered water tally, a shelter list, and a warning slate.",
    prompt: "Which promise should Westroot act on first?",
    success:
      "The promise you chose warms beneath your hand. Around the circle, the other work begins.\n\nBramwell calls a gatekeeper to Warning. Noma invites the outer-shelter runner to Water. Auntie Lume brings a frightened neighbor to Shelter. Quill reads the cargo hold aloud at Witness. Gold-green light passes between all four stones until the water circle runs clear.\n\nQuill unrolls a charcoal copy of the Cargo Siding floor. \"The false Willow-marked crate is missing from its assigned hold bay,\" they say. \"Not necessarily from Westroot. Its wheel grooves run deeper into the siding, then somebody brushed the dust and reset the lock.\"\n\nBramwell turns the Cargo Siding key over to Noma, and Noma closes both their hands around it before offering one back to him. They will open the siding together—and your party will follow the physical trail to the relocated crate.",
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
      "The Cargo Siding remains under a lawful Westroot hold. Bramwell will not open it alone, and Noma will not ask him to ignore the danger. The town must decide how to investigate it together.",
    text:
      "Bramwell and Noma open the Cargo Siding together. Just inside, a chalk rectangle marks the empty bay where the false Willow-marked crate was supposed to remain under hold.\n\nFresh wheel grooves cross the older rail cuts and run behind the rearmost stacks. You follow them to a green three-leaf crate with the same chipped runner and inventory cord Quill logged outside. Its lid has been hastily re-nailed. Scuffed bootprints continue behind the crates into the covered-lantern shadows.\n\nMara touches the Willowmark Lens at your belt. \"Not Ada's missing spice crate,\" she says. \"This is what stealing her seal let them make.\"\n\n\"Missing from the hold bay,\" Quill says quietly. \"Moved deeper while the door was made to look locked. Whoever did it may not have finished.\"",
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
      "You lay the false cargo evidence beside the Witness Stone Rubbing.\n\nBramwell says, \"I asked for the gate closed because the danger was real.\"\n\n\"And our silence became useful to the people who lied,\" Noma answers.\n\nThe old road phrase gives the hall a practical answer: witnessed truth, clear warning, shelter, and water. The gate will stay watched, but cargo will be opened with witnesses and every warning will be copied outward.\n\nThe Rootmarket baker sets bread on the table. It is the closest thing Westroot has to a vote of confidence.",
  },
  closing: {
    name: "Westroot Remembers",
    text:
      "In the Mossgarden, the restored water channel clears moss from a shallow courier mark. Noma brushes it clean.\n\nBRINDLE PASSED. BREATHING. BOUND WEST.\n\nMara reads it twice, then closes both hands around the blue string at her wrist. \"Then we keep going.\"\n\nNoma studies the cargo transfer tag. \"This points to a listening route. It cannot be read like a road map. Edden's drawing may be less broken than we thought.\"\n\nThe gold moss-lanterns brighten along the westward passage. Not because the way is safe. Because it has been seen.",
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
    nameReaction: "Bramwell repeats each name once, not warmly and not dismissively, as though placing it in a gate ledger. \"Names are not permission,\" he says. \"They are where questions begin.\"",
  },
  rootmarket: {
    arrival: "Rootmarket is trying to continue around the fact that the First Gate opened. A Mossback pipe-mender knots a red hold-cord across his stall while telling a Stonekin relay runner that no outer message is worth leading a watcher home. The runner answers that her father is at the outer cistern and cannot drink caution. Two stalls away, someone wraps jars for storage; across the aisle, someone else pointedly unwraps them.\n\nAt a low food counter, an older Mossback baker keeps serving warm bread as though hospitality were a job that becomes more important during an argument. Near the market lantern, a young Stonekin works on a cracked shutter and pretends not to hear anyone raising their voice.",
    ambientVoices: "You listen without approaching a counter.\n\n\"Three sealed nights,\" the pipe-mender says. \"Long enough to learn whether the gate brought a watcher.\"\n\n\"One water call overdue,\" the relay runner answers. \"Long enough for an outer shelter to learn we stopped listening.\"\n\nA vendor packing jars mutters that Bramwell has buried friends. Another, unpacking the same kind of jars, replies that the Mossgarden keeps names of people buried because help arrived at a closed door.\n\nThey sound like neighbors deciding which fear gets to speak first.",
    quillIntro: "At the center of Rootmarket's quiet disagreement, a young Stonekin is repairing a cracked lantern shutter with a tool small enough to be a joke and precise enough not to be one.\n\n\"Hold that,\" they say without looking up. They point to a brass hinge. After you hold it, they look up and realize you are not from Westroot.\n\n\"Oh. You are the gate problem. Quill Pebbleturn—shutter-mender, signal-keeper, and apparently greeter.\"",
    quillNameReaction: "Quill repeats the names without hesitation, then points back at the hinge. \"Good. Named hands are easier to ask for help.\"",
    guestResponse: "Quill snorts. \"Good. You understand signs. That one says: do not make my afternoon worse.\"",
    shutterResponse: "\"Keeps a lantern from calling through the hill when it should only light a stair. A road signal is useful. A road signal shouted at the wrong time is a map for anyone listening.\"",
    lioResponse: "Quill stills their hands on the hinge. \"We heard a courier passed through. We did not hear his name. There is a difference between a report and a person.\"",
    converged: "Quill fits the hinge back into place.\n\n\"The old road had a rule. Every signal had to tell someone what it was for, who sent it, and what care came with it. Warning. Shelter. Water. Witness. The Briar people copy the authority and leave out the responsibility. That is what makes their signals easy to misuse.\"\n\nThey reach for a work tally weighted with a chip of green sealing wax, then stop with their hand above it.",
    oldRule: "\"The Witness Stones are past the Mossgarden. Noma tends them,\" Quill says. \"Warnings, water calls, shelter marks—Westroot gives each one a sender, a witness, and someone responsible for what follows. Bramwell closed the walk when the Willow crate came under hold.\"",
    cargo: "Quill's expression closes. \"A crate wearing a green Willow seal came in by the Cargo Siding—not Ada's lost spice crate, but something made to borrow its trust. Bramwell put a hold on it. Then somebody moved it anyway. That is why nobody is enjoying the gate being open.\"",
    topicPrompt: "Quill turns the repaired shutter under the market light. \"All right. What else do you need to know?\"",
    repeat: "The market argument has broken into quieter pieces. The lantern-mender keeps working at one counter while the baker serves bread at the other. Both glance up when footsteps approach, then return to their work.",
    holdBellRepeat: "Half of Rootmarket has vanished behind shutters. The other half is carrying bundles toward the hall. A cautious Mossback pipe-mender ties a red hold-cord across his own stall while a young Stonekin relay runner argues that an outer shelter is still waiting for its water tally. Neither of them looks like they chose the easier side.\n\nQuill holds the repaired lantern shutter against their chest. \"Someone used my work to signal the cargo move. I would like to be furious without also being useful, but apparently today has standards.\"",
    debateRepeat: "Rootmarket is open only in pieces. Red hold-cords cross two stalls; a third has set bread and water outside the cord for anyone caught by the closure. Conversations stop when a gatekeeper passes and begin again before his footsteps fade.\n\nQuill is fitting a second catch to every lantern shutter. \"Open or closed was always the lazy version of the argument. The difficult version has hinges.\"",
    restoredRepeat: "Rootmarket sounds like work again: jars clink, bread knives scrape boards, and two people disagree about turnips without treating the disagreement as treason. Red hold-cords have been rewoven into witness tags beside the reopened stalls.",
  },
  holdBell: {
    introduction: "A single low bell rolls through the hill.\n\nEvery market sound stops. Lantern shutters snap closed along the bridges—one after another, quick as blinking eyes. Somewhere below, iron wheels strike rail and then go abruptly quiet.\n\nA Stonekin runner reaches the garden out of breath. \"Gatehand! The false Willow-marked crate is gone from its hold bay. The ledger still says sealed. The siding door still says locked.\"\n\nBramwell arrives with two gatekeepers. Behind him, people are already drawing red cords across Rootmarket stalls. \"First Gate closes. Side passages close. Nobody enters or leaves until we know whose mark moved that cargo.\"\n\n\"The outer shelter is due its water call,\" Noma says. \"The call leaves under a witnessed mark at the stones. Close the listening marks and we cannot send it or receive their answer.\"\n\nA Mossback pipe-mender near the bridge knots a hold-cord with shaking hands. \"My sister was on the last crew the Crown took. Close it. Close all of it.\"\n\nA Stonekin relay runner answers from across the market, \"My father is in that shelter. If you close all of it, close your mouth before you call him protected.\"\n\nThe village does not divide cleanly. It divides personally.",
    boundaryResponse: "\"Then count them before the stone closes,\" you say. \"A boundary that cannot name who it leaves outside is only hiding the cost.\"\n\nBramwell's expression hardens, but he turns to a gatekeeper. \"Get the outer-route tally. Names, not numbers.\"",
    warningResponse: "\"A warning that stops at Westroot's gate is not protecting the road,\" you say. \"It is protecting only the people close enough to hear this bell.\"\n\nNoma inclines their head. Bramwell does not, but he listens.",
    cargoResponse: "\"Who could move a held crate through a locked siding?\" you ask.\n\nQuill looks at the shutter in their hands. \"Someone who knew our signal.\"\n\nBramwell looks toward the sealed rail tunnel. \"Or someone who knew which signal my watch was duty-bound to follow.\"",
    converged: "Mara watches the red cords go up across the market. \"If you seal every route, we lose Lio. If you leave every signal calling, whoever took him hears us coming.\"\n\nFor once, her urgency offers no easy side.\n\nBramwell points toward Split Hall. \"Nobody settles this in a passage with one hand on a door. The hall hears it now.\"\n\nNoma turns toward the same room. \"Good. Let Westroot hear what its safety costs while the cost still has names.\"",
  },
  auntieLume: {
    introduction: "The Mossback baker stands behind a low counter with flour on her sleeves and a kettle steaming at her elbow. Her mossy brow is tied back with a yellow scarf.\n\nShe slides a warm heel of bread toward you before anyone asks whether you deserve it.\n\n\"Eat,\" she says. \"Then explain why the gate is making all my soup nervous. Lume is my name. Auntie if I feed you twice.\"",
    nameReaction: "Lume cuts another slice without asking whether the names are true. \"Names first, questions after bread. Better.\"",
    lioResponse: "\"Good. A proper answer before a dramatic one.\" Lume nods toward a narrow side passage. \"Someone has been leaving bread at the sealed hatch every night. The old Rootbread Promise: food and water for whoever the road forgets. I do not believe roads forget. People do.\"",
    hospitalityResponse: "Lume rests both floury hands on the counter. \"Trust decides whether I open a door. Hunger decides whether I pass bread through it. Westroot calls that the Rootbread Promise.\"",
    promiseResponse: "\"If a traveler arrives hungry, you feed them. If a traveler leaves hungry, you pack bread. If a traveler cannot leave, you do not punish them by making them invisible.\"",
    refusalResponse: "Lume pushes the bread closer. \"Then take it as evidence. I am feeding you because we do not know you. That is when food matters most. Westroot calls it the Rootbread Promise.\"",
    topicPrompt: "Lume wraps another heel of bread while she waits for your next question.",
    repeat: "\"There,\" Lume says, wrapping another piece of bread for Mara. \"A promise kept does not solve the whole road. It gives the next person a little farther to walk.\"",
  },
  rootbread: {
    unavailable: "The hatch is only a door-sized seam in the stone, wrapped with an old root lattice. A small bundle has been left outside, but you do not yet know who placed it here or whether touching it would violate Westroot's trust. The baker in Rootmarket may know.",
    introduction: "The hatch is only a door-sized seam in the stone, wrapped with an old root lattice. A small cloth bundle sits on the floor: rootbread, dried apple, and a cup of water covered with waxed leaf.\n\nMara kneels beside it. Under the cup, a blue thread has been tied in a tiny hooked loop.\n\nShe does not touch it at first.\n\n\"That is Lio's knot,\" she says. \"Not a message. A courier's way of saying this was left for somebody who might need to keep going.\"\n\nFrom behind the nearby barrels, a small Mossback child steps out, chin raised with the bravery of someone expecting to be scolded.\n\n\"I only put bread there,\" they say. \"The old door rattled. Somebody was on the other side once.\"",
    rightThingResponse: "The child exhales. \"Auntie said food is not a question. It is an answer.\"",
    whenResponse: "\"Three nights ago. Before the gate opened. I heard boots. Then somebody knocked twice, waited, and knocked once.\"",
    dangerResponse: "\"I know,\" the child says. \"That is why I did not open it.\"",
    childPrompt: "The Mossback child waits beside the still-sealed hatch. Mara keeps her hands away from the blue knot until the child has finished explaining.",
    converged: "Mara finally takes the blue thread between two fingers.\n\n\"He passed close enough to leave this,\" she says. \"Close enough to hope someone would notice. That is not nothing.\"",
    repeat: "A fresh bundle of bread and water waits by the sealed hatch. The promise is being kept, and the door remains safely closed.",
  },
  mossgarden: {
    nameReaction: "Noma touches two fingers to a blank name tablet beside the water. \"Names tell us who a question belongs to,\" they say. \"Proof tells us what happened.\"",
    namesResponse: "\"Witnesses. Travelers. Bridge-menders. Some names came from the Witness Stones after a warning, a repair, or a missed return. The road remembers names because a missing person is never only a missing number.\"",
    courierResponse: "Noma looks at Mara, then at the old gate-light still reflected on your gear. \"Then begin with what you know, not what you fear. Fear makes a loud first draft.\"",
    gateResponse: "\"Bramwell has buried friends. His caution carries their names. But a root that drinks only its own water eventually has nothing left to share.\"",
    converged: "Noma leads you to four weathered stones set in a shallow water circle. A low oak-and-brass shutter bars the approach. Its latch bears Bramwell's public Gatehand seal. The slate beside it names the Willow cargo hold, closes the stone walk and listening marks, and names Split Hall as the place of review.\n\n\"Travelers once left route testimony here—washed bridges, safe shelters, names of those who passed,\" Noma says. \"Westroot still brings every warning, water call, and shelter promise here so the responsible hands can be witnessed. Bramwell's seal names him. That is why the hold carries weight.\"\n\nMara looks toward the tally hook beside the shutter. \"And the outer shelter's water call?\"\n\n\"Waiting for the witnessed mark it needs before it can leave,\" Noma says. \"Until it does, Westroot cannot hear their answer.\"",
    showResponse: "\"Four promises, four kinds of work,\" Noma says. \"The question is which Westroot must begin today.\"",
    removeResponse: "\"Bramwell placed this seal as Gatehand,\" Noma says. \"He should stand here when Westroot changes the order.\"",
    wrongResponse: "\"Bramwell's public seal makes him answerable for this hold,\" Noma says. \"Split Hall decides when its cost exceeds its protection.\"",
    holdBellRepeat: "The water still runs, but every listening lantern above the Mossgarden has been hooded. Noma has laid blank name tablets beside the channel for anyone the sudden closure leaves uncounted. \"Bramwell is making a shield,\" they say. \"Split Hall must decide who is standing outside it.\"",
    debateRepeat: "The Mossgarden is quiet enough to hear Rootmarket arguing through the water channels. Noma has not uncovered the Witness Stones yet. \"An old promise becomes an answer when frightened people can still choose it together,\" they say.",
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
    preparedResult: "Fresh boot scuffs cross the ledger stand and vanish into a narrow service passage behind the crates. You quietly show Quill, who angles the repaired lantern shutter across that route while Bramwell signals two gatekeepers to cover it. If someone runs, Westroot will be ready.",
    crateResult: "The lid gives with a reluctant scrape.\n\nInside are no spices. There are blank order sheets cut to official size. Broken seal tools. Thorn-collar fittings wrapped in waxed cloth. Small scratching knives for changing route marks in the dark.\n\nAt the bottom lies a true courier pouch, empty except for a torn route tag: WESTWARD RELAY - TRANSFERRED.\n\nMara picks it up, then puts it down with both hands. \"They made a person into cargo,\" she says.",
    evidence: "Noma reads the two acknowledgement marks without touching them.\n\n\"Westroot was opened from inside and outside,\" they say.\n\nBramwell's jaw tightens. \"A gate account can be copied.\"\n\n\"Yes,\" Noma replies. \"And a copied mark is still evidence that someone knew which mark to copy.\"\n\nThere is no accusation in Noma's voice. That makes the silence heavier.\n\nThen, from the far end of the siding, a crate latch snaps shut.\n\nSomeone says, \"You should have left the gate closed.\"",
    battle: "A hooded Briar Cargo Runner steps out from behind the stacked crates. A Seal-Forged Sentry unfolds from a bundle of order sheets, wax, route tags, and thorn cord. Its crown-stamped scraps flutter like it is trying to become official by force.\n\nMara backs behind a stone loading post before the fight begins. \"Still behind the line,\" she says, breathless but steady. \"I am very committed to this part.\"",
    captured: "The powder fails to catch. Quill's repaired shutter closes with a sharp click, and Bramwell's gatekeepers step through the smoke.\n\n\"Then you can choose to answer questions,\" Bramwell says.",
    escaped: "The shutter cracks. By the time the smoke clears, the runner has vanished into a service passage, leaving behind a torn transfer tag.\n\n\"They ran west,\" Mara says. \"That means west is still a direction, not an answer.\"",
    converged: "The recovered tag carries a route notation that Noma recognizes but cannot fully read in the siding's bad light.\n\n\"Not a public road,\" Noma says. \"A listening route. It will need a different map.\"",
  },
  splitHall: {
    preBellIntroduction: "Split Hall is only half full, which somehow makes the argument carry farther. Nobody sits in formal sides yet. They have simply left small spaces between themselves and the neighbors they do not want to answer.\n\nA Mossback pipe-mender winds a red hold-cord around one wrist. \"Bramwell stopped the Willow crate. Stop the listening signals too, before somebody follows one home.\"\n\nAcross the repaired table, a young Stonekin relay runner grips an outer-shelter tally. \"My father is at the cistern post. Westroot's water call is late. It leaves under a witnessed mark at the stones, and Bramwell's shutter keeps that mark from leaving.\"\n\nAn older Stonekin gatekeeper tells the runner not to mistake worry for wisdom. A Mossback market clerk tells the gatekeeper not to mistake stone for a plan.\n\nThe baker from Rootmarket leaves a small basket of bread in the middle of the table. \"If you are going to sharpen every sentence, eat first. I will not have this hall fainting dramatically.\"\n\nNobody laughs, but the pipe-mender takes one piece and breaks it without eating.",
    preBellCloseResponse: "\"A closed gate can still leave someone outside,\" you say.\n\nThe relay runner nods too quickly. The pipe-mender answers more slowly. \"And an open signal can tell danger which door is yours. That is the part people keep stepping around.\"",
    preBellHoldResponse: "\"Holding suspicious cargo is not the same as abandoning the road,\" you say.\n\nThe pipe-mender's shoulders lower a fraction. The relay runner lays the unanswered tally flat on the table. \"Then the hold needs witnesses—and somebody still needs to answer this.\"",
    preBellListenResponse: "You stay quiet long enough to hear the spaces between the arguments: names people almost say, routes they are afraid to admit are still used, and the scrape of benches shifting away from old friends.\n\nMara whispers, \"They were fighting about the gate before we became the gate problem.\"",
    preBellRepeat: "The early argument has dispersed into smaller conversations. The red hold-cord, the unanswered outer-shelter tally, and the Rootmarket baker's half-finished bread remain on the repaired table. Split Hall is waiting for a disagreement large enough to fill it.",
    earlyReturnIntroduction: "When the Hold Bell calls you back, Split Hall is no longer half full. The small spaces you noticed between neighbors have widened into a central aisle. Benches scrape into two rough banks as the last market workers arrive. Stonekin and Mossbacks sit on both sides.\n\nThe same Mossback pipe-mender now wears the red hold-cord around his wrist. The young Stonekin relay runner still clutches the unanswered outer-shelter tally. The Rootmarket baker has added a second bread basket at the far end of the table. Nobody reaches for either one.\n\nBramwell plants both hands on the repaired table. \"Three days sealed. Long enough to inspect every account mark and learn who moved the Willow crate. I have buried people because danger was given the benefit of the doubt.\"\n\nNoma does not soften the answer. \"And Westroot has missed two water calls to the outer shelter. Three days may be the whole distance between waiting and being forgotten.\"\n\nQuill places their lantern shutter on the table. A fresh Crown-red scorch stains the inner hinge. \"Someone used a Westroot signal to move the crate. Closing the gate does not remove the person who knew that signal. It locks us in with the question.\"",
    earlyIntroduction: "Split Hall is already full when you arrive. Nobody has called the meeting. The Hold Bell did that.\n\nThe benches have pulled into two rough banks with an aisle between them. Stonekin and Mossbacks sit on both sides. A Mossback pipe-mender with a red hold-cord around one wrist sits behind Bramwell. The young Stonekin relay runner stands nearer Noma, clutching an unanswered outer-shelter tally.\n\nBramwell plants both hands on the repaired table. \"Three days sealed. Long enough to inspect every account mark and learn who moved the Willow crate. I have buried people because danger was given the benefit of the doubt.\"\n\nNoma does not soften the answer. \"And Westroot has missed two water calls to the outer shelter. Three days may be the whole distance between waiting and being forgotten.\"\n\nQuill places their lantern shutter on the table. A fresh Crown-red scorch stains the inner hinge. \"Someone used a Westroot signal to move the crate. Closing the gate does not remove the person who knew that signal. It locks us in with the question.\"\n\nThe Rootmarket baker sets two bread baskets at opposite ends of the table. Nobody reaches for either one.",
    earlyRepeat: "The Hold Bell argument has become quieter, not smaller. Bramwell's side is comparing gate accounts. Noma's side is copying names from the outer-shelter list. Between them, Quill's scorched shutter waits on the table like a question nobody can lock away.",
    outerShelterResponse: "The Stonekin relay runner unfolds the unanswered tally. \"Six people maintain the outer cistern and the listening post. My father is one. At every second water bell, Westroot sends the call and they return their headcount and need. We have missed two.\"\n\nThe Mossback pipe-mender looks away first. \"My sister used to carry that tally,\" he says. \"Before a false order brought her home on a door. I still want the gate closed. I also want those six names said aloud.\"\n\nThe disagreement survives the truth, but it can no longer pretend the people outside are an abstraction.",
    gateCostResponse: "Bramwell looks toward the families nearest his bench. \"Forged orders took two gatekeepers at the east listening stair. A watcher followed a shelter mark home last winter. Children sleep above those roots. That is what closing protects.\"\n\nNoma answers, \"Then say their names too. Caution becomes cruelty only when it stops counting who pays for it.\"\n\nBramwell does not thank them. He does begin naming the dead.",
    cargoHoldResponse: "Quill turns the scorched shutter over. \"The hold signal was correct. The timing was correct. The private hinge-mark was correct. Someone outside could copy the paint. They could not guess when Bramwell's second watch changed.\"\n\nA gatekeeper protests. A market clerk protests louder. Suspicion crosses the aisle faster than either of them.\n\nNoma strikes the table once with the flat of their hand. \"No traitors invented before evidence. That is how fear writes its first false order.\"",
    earlyConverged: "Mara looks from the sealed-gate benches to the outer-shelter list. \"Opening everything could tell the Crown where Lio went. Closing everything could erase the next mark he leaves. I hate both of those truths.\"\n\nBramwell studies her for a moment. \"Good. Hate them honestly.\"\n\nNoma slides the old Witness Stone rubbing frame into the center of the table, still empty. \"At the stones, every road action receives a named sender, a witness, and someone responsible for what follows. We can change this hold without opening blindly.\"\n\nBramwell looks at the unanswered water tally, then at his own seal on the hold order. \"I closed the stone walk,\" he says. \"I will stand there when we decide whether to open it.\"",
    investigationOffer: "You point to the empty hold mark on Quill's ledger. \"Then let us find the false Willow-marked crate before this hall decides who moved it. It did not walk through a locked door. We can follow the wheel marks, compare the copied seal with Ada Willowmarket's lesson, and bring back evidence before anyone names a traitor.\"\n\nQuill taps the ledger with a charcoal-stained finger. \"Missing from its assigned bay,\" they clarify. \"Not proven gone from Westroot. I found a wheel cut leading toward the inner siding before somebody brushed dust across it.\"\n\nBramwell shakes his head once. \"You will not enter a held route on a stranger's promise—or alone.\"\n\n\"Then do not send them alone,\" Noma says. \"We renew the road promises in public. You and I open the siding together. They follow the physical trail, and Westroot witnesses what comes back.\"\n\nBramwell looks across the aisle before answering. \"That is an investigation I can put my name to.\"",
    earlyMemories: {
      outerShelter: "You remember the six names at the outer cistern and the two water bells they have missed.",
      gateCost: "You remember Bramwell naming the people lost after false warnings reached their doors.",
      cargoHold: "You remember the private watch timing burned into Quill's shutter—and how quickly suspicion crossed the aisle.",
    },
    fullIntroduction: "Split Hall is not grand. It is a wide room of fitted stone, mismatched benches, and a long table repaired so often that the repairs have become its decoration.\n\nThe two sides of the room are not marked Closed Root and Open Lantern. They do not need to be. People choose their seats the way people choose shelter in bad weather: near whoever seems likely to keep them safe.\n\nBramwell places the copied gate-account mark on the table. Noma places the Witness Stone Rubbing beside it. You place the false cargo evidence last.\n\nFor a while, nobody speaks.\n\n\"I asked for the gate closed because the danger was real,\" Bramwell says. \"Forged orders. Watchers. Cargo that looks like help until it has crossed your floor. I will not apologize for wanting families asleep behind stone.\"\n\n\"And the cargo crossed because our silence became useful to the people who lied,\" Noma says. \"We did not invite them. But a road no one may witness is easy for a false order to claim.\"\n\nQuill sets the cracked crown slat beside the evidence. \"They did not beat the gate,\" they say. \"They learned which parts of us were afraid and made a key out of that.\"",
    bramwellResponse: "Bramwell nods once. \"Thank you.\"\n\n\"But,\" you continue, \"a closed gate did not stop the false cargo. It made it harder for anyone outside to know it was here.\"",
    nomaResponse: "Noma inclines their head. \"Truth is not the same as throwing every door open.\"\n\n\"No,\" you say. \"It is warning people before they walk into a trap, then giving them shelter and water when they need it.\"",
    stonesResponse: "You place the rubbing in the center of the table. \"Witness. Warning. Shelter. Water. Each promise names who is responsible and what care the next traveler can expect. That is why people can trust the road enough to follow it.\"",
    fullResolution: "Bramwell looks at the old road phrase for a long time.\n\n\"A shield must know what it covers,\" he says. \"And when to lower.\"\n\nNoma's expression softens. \"Roots hold fast,\" they say. \"They also share water.\"\n\nBramwell turns to the hall. \"The gate stays watched. Cargo is opened with witnesses. Every warning is copied to Bramblecross, and every shelter mark is restored where we can reach it.\"\n\nThere is no cheer. The decision is too new and too costly for that.\n\nThe Rootmarket baker sets a basket of bread on the table, and people begin taking pieces. It is the closest thing Westroot has to a vote of confidence.\n\nMara picks up a piece, breaks it in half, and gives one half to the nearest gatekeeper.\n\n\"For the next traveler,\" she says.\n\nThe gatekeeper takes it.",
  },
} as const;

type Chapter3CompanionBeat = "firstView" | "holdBell" | "rootbread" | "witnessRenewal" | "cargo" | "resolution";

const CHAPTER_3_COMPANION_REACTIONS = {
  firstView: { rowan: "A hidden town is still a town. Keep your hands visible. Let them decide we are not another order walking in.", tilda: "A whole village under a hill, and every lantern has opinions. I respect that.", moss: "This place has been holding its breath for a long time." },
  holdBell: { rowan: "A shield has to know who stands behind it. Make them count the outer shelter before they close anything.", tilda: "That bell did not split Stonekin from Mossbacks. It split every family from the person they are afraid of losing.", moss: "The hill is holding its breath again. This time everyone can hear who runs out of air first." },
  rootbread: { rowan: "Someone left food without opening the door. That is care with a boundary. We could use more of it.", tilda: "The best secret message is apparently lunch. I approve.", moss: "A promise is a path someone has already walked for another." },
  witnessRenewal: { rowan: "A good order names the danger and the hand responsible. I can stand behind that.", tilda: "Two latches, four promises, and nobody pretending one person can carry the whole road. Sensible.", moss: "The stones are listening to one another now." },
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

export function buildChapterThreeRecap(flags: Partial<Flags> = {}) {
  const firstPromise = flags.witnessPromiseWitnessChosen
    ? "Witness — investigate in the open"
    : flags.witnessPromiseWarningChosen
      ? "Warning — alert the outer shelters"
      : flags.witnessPromiseShelterChosen
        ? "Shelter — protect those caught outside"
        : flags.witnessPromiseWaterChosen
          ? "Water — keep essential aid moving"
          : "the four promises were renewed together";
  const cargoOutcome = flags.cargoRunnerCaptured
    ? "the prepared service passage held, and the runner was captured"
    : flags.cargoRunnerEscaped
      ? "the evidence was secured while the runner escaped west"
      : "the false Willow cargo was exposed";
  const rootbreadOutcome = flags.rootbreadPromiseKept
    ? "Lio's blue courier knot was found, and the Rootbread Promise was kept"
    : flags.rootbreadLeadLearned
      ? "the Rootbread Promise remains an open lead"
      : "the Rootbread Promise was not uncovered";
  const testimonyCount = [
    flags.splitHallAskedOuterShelter,
    flags.splitHallAskedGateCost,
    flags.splitHallAskedCargoHold,
  ].filter(Boolean).length;
  const testimony = testimonyCount
    ? `${testimonyCount} ${testimonyCount === 1 ? "cost" : "costs"} of Westroot's choice were named in Split Hall`
    : "the final evidence carried the argument in Split Hall";

  return `Westroot's witnessed record:\n• First promise: ${firstPromise}.\n• Cargo Siding: ${cargoOutcome}.\n• Rootbread: ${rootbreadOutcome}.\n• Split Hall: ${testimony}.`;
}
