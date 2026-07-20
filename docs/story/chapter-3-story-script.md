# Liam's Game — Chapter 3 Story Script

## Chapter 3: The Hidden Root

**Status:** Canonical narrative source for the playable Chapter 3 vertical slice. The Hold Bell drama pass and first Split Hall debate are implemented in the live game.

## Chapter Promise

Westroot is a hidden Stonekin and Mossback road-community beneath the hill: a living piece of the old Lantern Road, not a forgotten tunnel. The party must earn enough trust to expose Briar Crown cargo moving through its old ways and show that safety without witnessed truth becomes isolation.

The chapter does **not** ask the player to decide whether Westroot should be completely closed or completely open. The resolution is *truthful opening*: warning, shelter, memory, and care shared with people who need them.

## Entry Contract

Start from `public/saves/chapter-2-complete.json` or an equivalent completed Chapter 2 save. The entry assumes:

- the First Westroot Gate is open;
- Lio is confirmed alive past the gate;
- Mara is travelling as a protected, non-combat guest;
- Edden's three-door drawing was meaningful;
- the Briar Crown knows or suspects that the gate has been opened;
- the party may have a cleaned Lantern mark, a Willowmark Lens, and a Bramblecross witness note, but none of those optional objects may block Chapter 3 progression.

## Story Boundaries

- Lio is **not** rescued here.
- The party confirms that Lio passed through Westroot alive and was moved west, but does not find his personal message until Chapter 4.
- The explicit Princess Elowen false-order reveal remains a Chapter 4 beat. Chapter 3 finds evidence that the Briar Crown is imitating legitimate authority without naming the royal target yet.
- Westroot's internal helper is not unmasked as a simple traitor. The evidence establishes that the gate was opened from both inside and outside; the exact responsibility can remain complicated and unresolved.

---

# Core Cast

## Bramwell Gatehand

Stonekin elder and keeper of the First Westroot Gate. Bramwell is careful, tired, and practical rather than cruel. He believes closing the gate may be the only way to keep Westroot's families safe.

**Voice:** Short sentences, concrete images, no grand speeches. He calls danger by its plain name.

> “Caution is not cowardice. But if a shield never lowers, it becomes a wall.”

## Noma Greenstill

Mossback memory-keeper of the Mossgarden and Witness Stones. Noma is gentle, observant, and firm about the old road's purpose: memory is not nostalgia when someone needs the truth to get home.

**Voice:** Patient images of roots, water, weather, and care. Never vague for its own sake.

> “Roots survive by holding fast. They also survive by sharing water.”

## Quill Pebbleturn

Young Stonekin craftsperson in Rootmarket. Quill is curious about surface inventions and irritated by people who mistake curiosity for carelessness. They offer practical help and give the player a lived-in, hopeful view of Westroot.

**Voice:** Quick, precise, occasionally funny. Notices construction details before social ones.

## Auntie Lume

Mossback cook and herbalist. Lume feeds people before deciding whether she trusts them, but does not confuse hospitality with naivete. Her Rootbread Promise side thread makes Westroot's values tangible.

**Voice:** Warm, brisk, and gently unimpressed by speeches made on an empty stomach.

## Mara Brindle

Mara remains a protected non-combat guest. Her urgency is valid: every delay may be a delay in reaching Lio. Across the chapter, she learns that helping make a road safe is not abandoning him; it is refusing to let fear choose the route for them.

---

# Playable Route and Objective Flow

```text
First Westroot Gate
  → Rootmarket / Mossgarden
  → Rootbread Promise (optional)
  → Hold Bell crisis
  → Split Hall first debate
  → Witness Stones
  → Cargo Siding
  → Split Hall resolution
  → Mossgarden closing scene
```

## Main Quest: The Hidden Root

| Step | Objective text | Completion condition |
|---|---|---|
| 1 | **Enter Westroot** — The First Westroot Gate is open, but the people beneath the hill do not yet know why you came. | Bramwell grants a limited welcome. |
| 2 | **Listen Before You Ask** — Meet the people keeping Westroot safe and learn why the gate's opening has divided them. | Hear Bramwell, Noma, and one Rootmarket voice. |
| 3 | **Answer the Hold Bell** — A Willow crate moved under a correct Westroot signal. Hear what the sudden closure protects and who it leaves outside. | Trigger the Hold Bell after hearing Quill and Noma. |
| 4 | **Hear Westroot at Split Hall** — Bramwell wants three days sealed; the outer shelter has missed its water call. | Hear at least one piece of community testimony. |
| 5 | **Restore the Witness Stones** — The old road did not begin with command. Learn what a traveler needs first. | Complete the fail-forward stone sequence. |
| 6 | **Follow the Willow Cargo** — Ada warned that Willow-sealed cargo below the hill should not be trusted. | Inspect the Cargo Siding evidence and clear the encounter. |
| 7 | **Bring the Evidence to Split Hall** — Westroot needs the full truth: the danger outside and the opening made from within. | Resolve the Split Hall scene. |
| Complete | **Chapter Complete: The Hidden Root** — Westroot will not open blindly, but it will not let lies travel unchallenged. Lio's trail leads west into the older road. | `chapterThreeClear` is set. |

## Required Chapter-End Flags

- `westrootTrustEarned`
- `witnessStoneSequenceSolved`
- `willowCargoExposed`
- `chapterThreeClear`

Optional consequence flags may record whether the first Witness Stone attempt went wrong and whether the cargo runner escaped. Neither may prevent the required end flags.

---

# Scene Script

## 1. First Westroot Gate

### Arrival scene

**Location:** First Westroot Gate

**Text**

The no-handle door closes behind you without a sound.

For several steps, the passage is only root, stone, and the small noises your boots make when they stop pretending not to be nervous. Then the hill opens.

Bridges of fitted gray stone cross a cavern broad enough to hold a village. Living roots curl around balconies and roofs. Moss-lanterns hang in clusters along the walls—some gold, some green, some covered with little shutters as if they are listening before they shine.

Below, a market is packing itself away very quickly.

Every face turns toward the gate.

A broad Stonekin in a slate-colored coat waits at the far end of the bridge. Their key ring is too heavy for decoration. One key is still warm with gate-light.

“No,” Mara says quietly.

The Stonekin hears her anyway.

“That is usually the first word,” he says. “I am Bramwell. Gatehand, until nobody needs one. Who opened my gate?”

**Choices**

- “The road opened when we told it the truth.”
- “We are looking for Lio Brindle. He came through here alive.”
- “Ask us what we brought before you decide what we are.”

### Response: truth choice

> Bramwell looks past you to the sealed stone, then to the old lantern mark warm in your pack. “Truth opens old things. It does not guarantee what walks through after.”

### Response: Lio choice

> Mara takes one step forward. Bramwell's hand lifts—not threatening, only stopping the bridge from becoming a rush. “A missing courier is a reason,” he says. “It is not yet permission.”

### Response: evidence choice

> “That is fair,” Bramwell says after a moment. “It is also the first fair thing I have heard at this gate in a long time.”

### Converged text

Bramwell studies the party again, this time as people rather than a problem.

“You may cross to the market. You may speak. You may not wander into sealed ways, touch a lantern shutter, or call this place yours because a door answered you.”

Mara folds her arms hard enough to make the blue string around her wrist pull taut.

“You can close every door in this hill if you want,” she says. “But my brother is on the other side of one of them.”

Bramwell's face changes—not into agreement, but recognition.

“Then we have a reason to be careful with one another.”

**Outcome**

- Set `chapterThreeStarted` and `westrootLimitedWelcome`.
- Objective: **Listen Before You Ask**.
- Westroot hub movement unlocks: Rootmarket, Mossgarden, Witness Stones, and Split Hall.

### Repeat interaction: Bramwell, before Cargo Siding

> “A gate is not a mouth,” Bramwell says. “It should not swallow every order placed in front of it. Find out how those crates came here. Then tell us what closing would actually protect.”

---

## 2. Rootmarket

### First entry

**Text**

Rootmarket occupies a broad shelf beneath the cavern wall. It is quieter than an aboveground market, but not solemn: jars clink, someone argues gently about turnips, and a child rolls a carved stone animal along the edge of a rain barrel.

The goods are practical and carefully mended. Rootbread. Preserved apples. Lamp oil. Buttons carved from river stone. Folded road maps whose routes have been crossed out so many times they look like quilts.

People do not stop watching you. They simply find reasons to watch while doing something useful.

Rootmarket is a location hub rather than the opening of Quill's conversation. From this shared space, the player may approach Quill, speak with Auntie Lume, listen to the surrounding market, or leave. Every character conversation returns to the Rootmarket choices instead of presenting another character as though they were one of Quill's replies.

**Location choices**

- Talk to the Stonekin repairing a shutter.
- Speak with the Mossback baker.
- Listen to the market.
- Leave Rootmarket.

### Ambient market voices

A Mossback pipe-mender knots one thin red hold-cord to a stall while arguing that every listening signal should be stopped. A tired Stonekin relay runner grips an unanswered outer-shelter tally and insists that silence could strand her father. Other Stonekin and Mossbacks quietly disagree with both of them. Nobody sounds like a faction. Everyone sounds like someone who expects the coming decision to cost a neighbor.

### Quill Pebbleturn

**Text**

A young Stonekin is repairing a cracked lantern shutter with a tool small enough to be a joke and precise enough not to be one.

“Hold that,” they say without looking up.

They point to a brass hinge. After you hold it, they look up and realize you are not from Westroot.

“Oh. You are the gate problem.”

**Choices**

- “I prefer ‘guest under review.’”
- “What does that shutter do?”
- “We are following a missing courier.”

### Response: guest under review

> Quill snorts. “Good. You understand signs. That one says: do not make my afternoon worse.”

### Response: shutter question

> “Keeps a lantern from calling through the hill when it should only light a stair. A road signal is useful. A road signal shouted at the wrong time is a map for anyone listening.”

### Response: Lio question

> Quill's hands still on the hinge. “We heard a courier passed through. We did not hear his name. There is a difference between a report and a person.”

### Converged text

Quill fits the hinge back into place.

“The old road had a rule. Every signal had to tell someone what it was for. Warning. Shelter. Water. Witness. The Briar people like their signals simple. Stop. Go. Obey. Simple is easy to fake.”

**Choices**

- “Where can I learn the old rule?”
- “Have you seen Willow-sealed cargo?”
- “I should keep moving.”

### Old-rule response

> “Witness Stones, past the Mossgarden. Noma tends them. Do not call them a puzzle while she can hear you. She will call you a puzzle back.”

### Cargo response

> Quill's expression closes. “A crate with green wax came in by the Cargo Siding. Bramwell put a hold on it. Then somebody moved it anyway. That is why nobody is enjoying the gate being open.”

**Outcome**

- Set `metQuill`.
- Quill counts as a Rootmarket voice for the listening objective.
- Optional lead: Cargo Siding becomes visible but stays locked until the Witness Stones are resolved.

### Repeat interaction

> “If somebody tells you the road needs only one voice,” Quill says, “ask who gets to be quiet. It is usually not the person giving the order.”

---

## 3. Auntie Lume and the Rootbread Promise (Optional Side Thread)

### First conversation

**Text**

Auntie Lume stands behind a low counter with flour on her sleeves and a kettle steaming at her elbow. Her mossy brow is tied back with a yellow scarf.

She slides a warm heel of rootbread toward you before anyone asks whether you deserve it.

“Eat,” she says. “Then explain why the gate is making all my soup nervous.”

**Choices**

- “Thank you. We are looking for Lio Brindle.”
- “What is the Rootbread Promise?”
- “I should not take food from people who do not trust me.”

### Lio response

> “Good. A proper answer before a dramatic one.” Lume nods toward a narrow side passage. “Someone has been leaving bread at the sealed hatch every night. Says it is for whoever the road forgets. I do not believe roads forget. People do.”

### Promise response

> “If a traveler arrives hungry, you feed them. If a traveler leaves hungry, you pack bread. If a traveler cannot leave, you do not punish them by making them invisible.”

### Refusal response

> Auntie Lume pushes the bread closer. “Then take it as evidence. I am feeding you because we do not know you. That is when food matters most.”

**Side objective:** **Follow the Rootbread Promise** — Someone has been leaving food at a sealed hatch. Find out who needs it and why.

### Sealed Hatch

**Text**

The hatch is only a door-sized seam in the stone, wrapped with an old root lattice. A small cloth bundle sits on the floor: rootbread, dried apple, and a cup of water covered with waxed leaf.

Mara kneels beside it. Under the cup, a blue thread has been tied in a tiny hooked loop.

She does not touch it at first.

“That is Lio's knot,” she says. “Not a message. A courier's way of saying this was left for somebody who might need to keep going.”

From behind the nearby barrels, a small Mossback child steps out, chin raised with the bravery of someone expecting to be scolded.

“I only put bread there,” they say. “The old door rattled. Somebody was on the other side once.”

**Choices**

- “You did the right thing.”
- “When did the hatch rattle?”
- “It can be dangerous to leave food at a sealed way.”

### Right-thing response

> The child exhales. “Auntie said food is not a question. It is an answer.”

### When response

> “Three nights ago. Before the gate opened. I heard boots. Then somebody knocked twice, waited, and knocked once.”

### Danger response

> “I know,” the child says. “That is why I did not open it.”

### Converged text

Mara finally takes the blue thread between two fingers.

“He passed close enough to leave this,” she says. “Close enough to hope someone would notice. That is not nothing.”

**Outcome**

- Set `rootbreadPromiseKept` and `lioKnotFound`.
- Receive **Rootbread Charm** or **Westroot Packed Lunch**.
- This is emotional evidence only; it does not replace the Chapter 3 closing confirmation or Chapter 4's direct Lio message.

### Auntie Lume, after completion

> “There,” Lume says, wrapping another piece of bread for Mara. “A promise kept does not solve the whole road. It gives the next person a little farther to walk.”

---

## 4. Mossgarden of Remembering

### First entry

**Text**

The Mossgarden is quieter than the market, but not still. Water runs through shallow stone channels. Pale moss curls over old name tablets, repair records, and small lantern hooks. The green light does not hide the writing. It makes room for it.

Noma Greenstill is kneeling beside a tablet with a brush in one hand and a cup of water in the other.

“Do not step on the names,” Noma says. “Most of them have already been walked over enough.”

### First conversation

**Choices**

- “What are these names?”
- “We need to find the truth about a missing courier.”
- “Bramwell says Westroot should close the gate.”

### Names response

> “Witnesses. Travelers. Bridge-menders. People who left a warning before it was fashionable to call one another frightened. The road remembers names because a missing person is never only a missing number.”

### Courier response

> Noma looks at Mara, then at the old gate-light still reflected on your gear. “Then begin with what you know, not what you fear. Fear makes a loud first draft.”

### Gate response

> “Bramwell has buried friends. I will not call his caution small. But a root that drinks only its own water eventually has nothing left to share.”

### Converged text

Noma leads you to four weathered stones set in a shallow circle. A fifth, newer mark has been nailed over the first stone: a crooked crown and a single word.

**OBEY.**

“The Witness Stones once taught every traveler the same thing,” Noma says. “Tell what is true. Name the danger. Give shelter. Leave water. Someone made the lesson into an order.”

Mara looks at the crown mark.

“Lio would have hated that,” she says. “No one can follow ‘obey’ home.”

**Choices**

- “Show me how the stones are meant to work.”
- “Can we remove the crown mark?”
- “What happens if I get it wrong?”

### Show-me response

> “The stones do not care about pride,” Noma says. “They care what the next traveler receives.”

### Remove response

> “Not yet. First we read what it is trying to replace. A lie is easier to spot when the truth is still beside it.”

### Wrong response

> “Then Westroot hears the mistake. That is not punishment. It is why testimony matters. We correct it together.”

**Outcome**

- Objective: **Restore the Witness Stones**.
- Witness Stone interaction is unlocked.

---

## 3A. Optional Split Hall Visit Before the Bell

The player may enter Split Hall before hearing both Quill and Noma. The room is only half full, but an argument is already underway between ordinary villagers: a cautious Mossback pipe-mender wants listening signals stopped, while a young Stonekin relay runner is waiting on her father's outer-shelter water tally. Other Stonekin and Mossbacks challenge both of them from across the repaired table.

This scene establishes that the disagreement predates the player's arrival and gives Westroot the same chorus-of-concern effect that Hearthhollow uses in Chapter 1. Auntie Lume leaves bread between the speakers, but even her practical humor cannot resolve the divide.

The player may validate caution, name the cost of closure, or simply listen. This is a tonal choice only. Set `splitHallVisitedBeforeBell` so ordinary walk-throughs stay quiet afterward; manual inspection preserves a shorter review. If the player saw this scene, the post-bell debate explicitly transforms its small gaps between neighbors into the packed hall's central aisle.

No dedicated art is needed for the pre-bell visit. The selected `split-hall-hold-debate-scene-v01.webp` is reserved for the later escalation so it does not appear before the bell.

---

## 4A. The Hold Bell

This crisis is mandatory after the player has heard both Quill and Noma. It must occur on a clean playthrough; the faction drama cannot depend on failing the Witness Stones.

### Incident

A single low bell rolls through the hill. Market sounds stop and lantern shutters close in sequence. A runner reports that the Willow-marked crate has moved despite Bramwell's hold, while the ledger and siding door still claim it is sealed.

Bramwell orders the First Gate and side passages closed until Westroot knows whose mark moved the cargo. Noma objects that the outer shelter has missed its water tally and will disappear from Westroot's hearing if every listening mark is hooded.

The village divides personally rather than by ancestry. A cautious Mossback pipe-mender wants the gate sealed after losing his sister to a false order. A young Stonekin relay runner argues that his father is one of six people waiting at the outer shelter. Stonekin and Mossbacks stand on both sides.

Mara recognizes the cost of both positions: opening every signal may reveal Lio's route, while sealing every route may erase the next useful mark he leaves.

**Player approaches**

- Count who will be left outside.
- A warning cannot stop at Westroot's gate.
- Who moved a crate under hold?

All three validate a different part of the crisis and converge on Bramwell and Noma taking the dispute to Split Hall.

**Outcome**

- Set `westrootHoldBellRung`.
- Objective: **Hear Westroot at Split Hall**.
- Rootmarket, the First Gate, and the Mossgarden change to their Hold Bell descriptions.

---

## 4B. Split Hall: The Hold Debate

This is the player's first dramatic visit to Split Hall. The room is already full. Its benches have pulled into two rough banks, but neither ancestry owns a side. Two untouched rootbread baskets sit at opposite ends of the repaired table.

Bramwell asks for three days sealed so every gate-account mark can be checked. Noma insists that three days may be the whole distance between the outer shelter waiting and being forgotten. Quill places the scorched lantern shutter on the table and explains that somebody knew both a private Westroot signal and the timing of the watch change.

The player may hear three independent pieces of testimony:

- **Outer shelter:** six named people have missed two water calls.
- **Gate cost:** Bramwell names the people already lost when false warnings reached Westroot homes.
- **Cargo hold:** the correct private timing suggests internal knowledge, but Noma stops the hall from inventing a traitor before evidence exists.

Each topic remains independently available until asked. Hearing any one completes the required first debate and unlocks the Witness Stones; the others remain optional review material. The final Split Hall resolution recalls whichever testimony the player heard.

**Outcome**

- Set `splitHallDebateHeard` after the first testimony.
- Persist the three testimony choices separately.
- Objective: **Restore the Witness Stones**.
- Repeated walk-throughs remain quiet until the cargo evidence is ready, but manual inspection can reopen unanswered testimony.

### Art target

Use `split-hall-hold-debate-scene-v01`: the same room and character continuity as the selected resolution scene, but with hooded lanterns, a clear empty aisle, opposing body language, untouched bread, the scorched shutter, and mixed Stonekin/Mossbacks on both sides. Do not reuse the reconciliation tableau here.

---

## 5. Witness Stones Puzzle

### Inspection text

Each stone can be inspected before being placed in the sequence.

| Stone | Inspection text |
|---|---|
| **Witness** | A hand pressed to stone beside a simple line: *I was here. This happened. Let the next traveler know.* |
| **Warning** | A lantern turned outward over a broken bridge: *The danger is named before the traveler reaches it.* |
| **Shelter** | A roofline beneath a root: *Rest is not a reward for the lucky. It is help for the tired.* |
| **Water** | A cup beside a spring mark: *Leave enough for the journey after the danger.* |
| **False Crown** | A nailed-on briar crown: *OBEY CROWN DETOUR.* No destination, danger, shelter, or reason is named. |

### Puzzle rule

The player restores four positions. The intended sequence is:

1. **Witness** — tell what is true.
2. **Warning** — name the danger.
3. **Shelter** — protect the traveler.
4. **Water** — sustain the journey.

The False Crown is not a valid road need and cannot be part of the restored sequence.

### Companion and Mara hints

**Rowan**

> “A warning comes before shelter. If people do not know the danger, they cannot receive protection wisely.”

**Tilda**

> “The crown mark is cutting in line. Rude, suspicious, and not actually carrying a cup of water.”

**Moss**

> “The stones are not asking who is in charge. They are asking what the next traveler needs.”

**Mara**

> “Lio always said you leave the warning where someone can see it before they step in the hole.”

### First incorrect attempt — fail forward

**Text**

The last stone settles into place.

For one breath, nothing happens.

Then the moss-lanterns around the garden shutter closed all at once.

The false crown mark glows red through its cracks. Somewhere in Rootmarket, a bell rings twice: not an alarm exactly, but the sound of people remembering that alarms exist.

Mara flinches toward the passage. Bramwell arrives from the bridge with two gatekeepers behind him.

“What did you wake?” he asks.

Noma does not raise their voice.

“A mistake,” they say. “Which is why the stones were built to be witnessed.”

They touch the first stone gently.

“We do not hide the wrong order. We say it was wrong, name what it caused, and leave the next person a better way through.”

Mara looks ashamed for a moment, then angry at the shame.

“Then we fix it,” she says. “Out loud.”

**Outcome**

- Set `witnessStoneFirstAttemptMissed`.
- Do **not** remove access to the puzzle, Cargo Siding, or chapter completion.
- Bramwell's initial trust is shaken, but the correction scene makes the chapter's theme explicit.
- Noma gives the player a **Witness Stone Rubbing** showing the four old symbols and their purposes.

### Correct completion

**Text**

You set Witness first.

The stone warms under your hand. Moss brightens around the carved palm.

You set Warning second. A small gold lantern appears above the broken bridge mark.

You set Shelter third. Root shadows fold into the shape of a roof.

You set Water last. The channel around the stones clears, and a thin ribbon of water runs through it without spilling.

The false crown mark loosens with a dry crack.

Underneath, the oldest line on the first stone becomes readable:

**A ROAD IS SAFEST WHEN TRUTH WALKS IT FIRST.**

Noma smiles—not because the work is easy, but because it was done.

“There,” they say. “Not a command. A promise with steps.”

Bramwell stands at the garden edge. He sees the bright water, the broken crown slat, and the people gathered nearby.

“The Cargo Siding lock answers to a witness sequence,” he says. “I thought that was old caution.”

Quill, appearing with a lantern shutter tucked under one arm, says, “It turns out old caution has better engineering than new fear.”

**Outcome**

- Set `witnessStoneSequenceSolved`.
- Unlock Cargo Siding.
- Objective: **Follow the Willow Cargo**.
- Gain the **Witness Stone Rubbing** if not already received.

---

## 6. Cargo Siding

### Arrival

**Text**

The Cargo Siding is older than the market above it. Rail grooves run through the stone, interrupted by roots that have chosen not to move aside. Crates sit in neat stacks beneath covered lamps.

The green three-leaf Willow seal is stamped on the nearest one.

Mara looks at it as if it has personally insulted her.

“Ada said not to trust those below the hill.”

Quill kneels beside a crate runner.

“This one came in through a locked door,” they say. “That is the part I keep disliking.”

### Crate inspection

**Choices**

- “Use the Willowmark Lens.” *(Available if the player has it.)*
- “Inspect the wax and crate tags closely.”
- “Check the rail marks and loading ledger.”
- “Open the crate carefully.”

### Lens result

> Ada's lens catches the nicked three-leaf mark beneath a layer of pine pitch and a thin wash of crown-red wax. The seal is genuine enough to pass a hurried eye and false enough to make Ada furious.

### Manual inspection result

> Even without the lens, the wax tells on itself. Green market wax has been warmed, pressed, covered, then made to look untouched. Someone wanted trust to arrive before questions did.

### Ledger result

> The loading ledger has no sender's name. Instead, it bears two acknowledgements: a Briar Crown route scratch and an old Westroot gate-account mark. One opened the way from outside. One confirmed it from within.

### Open-crate result

The lid gives with a reluctant scrape.

Inside are no spices.

There are blank order sheets cut to official size. Broken seal tools. Thorn-collar fittings wrapped in waxed cloth. Small scratching knives for changing route marks in the dark.

At the bottom lies a true courier pouch, empty except for a torn route tag: **WESTWARD RELAY — TRANSFERRED**.

Mara picks it up, then puts it down with both hands.

“They made a person into cargo,” she says.

### Evidence scene

**Text**

Noma reads the two acknowledgement marks without touching them.

“Westroot was opened from inside and outside,” they say.

Bramwell's jaw tightens.

“A gate account can be copied,” he says.

“Yes,” Noma replies. “And a copied mark is still evidence that someone knew which mark to copy.”

There is no accusation in Noma's voice. That makes the silence heavier.

Then, from the far end of the siding, a crate latch snaps shut.

Someone says, “You should have left the gate closed.”

### Battle setup

A hooded **Briar Cargo Runner** steps out from behind the stacked crates. A **Seal-Forged Sentry** unfolds from a bundle of order sheets, wax, route tags, and thorn cord. Its crown-stamped scraps flutter like it is trying to become official by force.

Mara backs behind a stone loading post before the fight begins.

“Still behind the line,” she says, breathless but steady. “I am very committed to this part.”

**Battle objective:** Clear the Cargo Siding. Both enemies are active simultaneously; the encounter should use the multi-enemy battle system rather than a sequential queue.

### Battle victory

**Text**

The Seal-Forged Sentry collapses into wet wax, snapped cord, and paper that has forgotten how to stand up.

The Cargo Runner looks once toward the old rail tunnel, then toward the open gate far above.

“You think truth makes people safe?” they say. “Truth makes them choose. That is worse.”

They throw a fistful of crown-red powder into a lantern shutter.

### Runner captured outcome

The powder fails to catch. Quill's repaired shutter closes with a sharp click, and Bramwell's gatekeepers step through the smoke.

> “Then you can choose to answer questions,” Bramwell says.

### Runner escape outcome

The shutter cracks. By the time the smoke clears, the runner has vanished into a service passage, leaving behind a torn transfer tag.

> “They ran west,” Mara says. “That means west is still a direction, not an answer.”

### Converged evidence

The recovered tag carries a route notation that Noma recognizes but cannot fully read in the siding's bad light.

> “Not a public road,” Noma says. “A listening route. It will need a different map.”

**Rewards**

- XP and gold appropriate to Chapter 3 progression.
- Set `willowCargoExposed`.
- Optional: **Cargo Transfer Tag** story item.
- Set either `cargoRunnerCaptured` or `cargoRunnerEscaped`; both continue to the same chapter resolution.
- Objective: **Bring the Evidence to Split Hall**.

---

## 7. Split Hall: The Community Hears the Whole Truth

### Scene opening

**Location:** Split Hall

**Text**

Split Hall is not grand. It is a wide room of fitted stone, mismatched benches, and a long table repaired so often that the repairs have become its decoration.

The two sides of the room are not marked Closed Root and Open Lantern. They do not need to be. People choose their seats the way people choose shelter in bad weather: near whoever seems likely to keep them safe.

Bramwell places the copied gate-account mark on the table.

Noma places the Witness Stone Rubbing beside it.

You place the false cargo evidence last.

For a while, nobody speaks.

### Bramwell's truth

“I asked for the gate closed because the danger was real,” Bramwell says. “Forged orders. Watchers. Cargo that looks like help until it has crossed your floor. I will not apologize for wanting families asleep behind stone.”

Mara starts to answer, but Noma lifts a hand—not to silence her, only to make space.

### Noma's truth

“And the cargo crossed because our silence became useful to the people who lied,” Noma says. “We did not invite them. But a road no one may witness is easy for a false order to claim.”

Quill sets the cracked crown slat beside the evidence.

“They did not beat the gate,” they say. “They learned which parts of us were afraid and made a key out of that.”

### Player choices

- “Bramwell was right that the danger is real.”
- “Noma was right that silence did not keep the lie out.”
- “The Witness Stones already gave us the answer.”

### Response: Bramwell right

> Bramwell nods once. “Thank you.”
>
> “But,” you continue, “a closed gate did not stop the false cargo. It made it harder for anyone outside to know it was here.”

### Response: Noma right

> Noma inclines their head. “Truth is not the same as throwing every door open.”
>
> “No,” you say. “It is warning people before they walk into a trap, then giving them shelter and water when they need it.”

### Response: stones answer

> You place the rubbing in the center of the table. “Witness. Warning. Shelter. Water. The road was not built to make people obey. It was built to make sure the next traveler had what they needed.”

### Converged resolution

Bramwell looks at the old road phrase for a long time.

“Caution is not cowardice,” he says. “But if a shield never lowers, it becomes a wall.”

Noma's expression softens.

“Roots hold fast,” they say. “They also share water.”

Bramwell turns to the hall.

“The gate stays watched. Cargo is opened with witnesses. Every warning is copied to Bramblecross, and every shelter mark is restored where we can reach it.”

There is no cheer. The decision is too new and too costly for that.

But Auntie Lume sets a basket of rootbread on the table, and people begin taking pieces. It is the closest thing Westroot has to a vote of confidence.

Mara picks up a piece, breaks it in half, and gives one half to the nearest gatekeeper.

“For the next traveler,” she says.

The gatekeeper takes it.

**Outcome**

- Set `westrootTrustEarned`.
- Set `chapterThreeClear`.
- Objective updates to **Chapter Complete: The Hidden Root**.
- Westroot becomes a trusted hub rather than a one-time hiding place.

---

## 8. Mossgarden Closing Scene

### Scene opening

**Text**

Later, when Split Hall has become a room full of lists, questions, and people making themselves useful, Noma asks you and Mara to return to the Mossgarden.

The Witness Stones are still bright.

The water channel runs past the tablet where Noma had been cleaning old names. Green moss shifts along one edge, uncovering a shallow scratch beneath it.

Not a sentence. A courier mark.

Mara kneels so quickly her knees strike stone.

Noma brushes the moss aside with two careful fingers.

**BRINDLE PASSED. BREATHING. BOUND WEST.**

Mara reads it once.

Then again.

She closes both hands around the blue string at her wrist.

“Then we keep going,” she says.

Noma looks toward the deeper dark beyond the garden.

“The transfer tag points to a listening route. It cannot be read like a road map. Edden's broken drawing may be less broken than we thought.”

Quill arrives with a folded piece of old route cloth, its lines meaningless until it is turned sideways.

“There is an Underway beyond Westroot,” they say. “And a mile where the road answers questions with questions.”

Mara looks at the mark one last time.

“Lio left truth in small places,” she says. “We will be small enough to find it.”

The gold moss-lanterns brighten one by one along the westward passage.

Not because the way is safe.

Because it has been seen.

**Chapter Complete: The Hidden Root**

### Chapter 4 handoff

**Next lead:** The Riddle Road / the Underway and Listening Mile.

The party now needs Edden's folded-map language, Westroot's route memory, and Lio's habit of leaving small useful truths to follow the westward trail.

---

# Companion Reactions

Companion reactions should be sparse and play after a meaningful choice or reveal, not after every interaction.

## At the first view of Westroot

**Rowan**

> “A hidden town is still a town. Keep your hands visible. Let them decide we are not another order walking in.”

**Tilda**

> “A whole village under a hill, and every lantern has opinions. I respect that.”

**Moss**

> “This place has been holding its breath for a long time.”

## After the Rootbread Promise

**Rowan**

> “Someone left food without opening the door. That is care with a boundary. We could use more of it.”

**Tilda**

> “The best secret message is apparently lunch. I approve.”

**Moss**

> “A promise is a path someone has already walked for another.”

## After a Witness Stone mistake

**Rowan**

> “We correct it. That is what a good warning is for.”

**Tilda**

> “Well. We rang the wrong bell. At least now everybody knows why the right order matters.”

**Moss**

> “A true memory does not vanish because we first remembered it poorly.”

## After the Cargo Siding reveal

**Rowan**

> “They turned trust into a disguise. That is why it feels worse than an ordinary theft.”

**Tilda**

> “A fake seal, a fake order, and a real person moved like a crate. I have run out of polite names for them.”

**Moss**

> “The lie used a root from both sides. We will have to heal both sides too.”

## After Westroot's resolution

**Rowan**

> “A shield with witnesses behind it is not a wall. That will do.”

**Tilda**

> “Turns out the secret village has rules for being less secret. Very advanced.”

**Moss**

> “The hill has exhaled.”

---

# Gameplay and Fail-Forward Requirements

## Witness Stones

- The player may inspect every symbol before committing.
- The correct order is clear through environment text and optional companion/Mara hints.
- An incorrect first attempt changes tone and trust but not access to the critical route.
- The player receives a clear correction path; do not make trial-and-error feel punitive.
- The False Crown's failure is that it commands without naming danger, help, destination, or witness.

## Cargo Siding

- The Willowmark Lens provides richer wording but is not mandatory.
- The fight is a true simultaneous multi-enemy encounter.
- The Cargo Runner capture/escape branch may change a later line or reward, not the chapter's completion path.
- Mara remains clearly protected and does not enter battle systems.

## Community Resolution

- Do not frame Bramwell as cowardly or Noma as naive.
- The player validates each concern, then uses the Witness Stone ethic to propose a concrete operating rule.
- Westroot's trust is earned through evidence, correction, and care—not by a charisma roll that makes the town instantly agree.

---

# Art and Presentation Notes

## Key scene images

1. **Westroot reveal:** a character-neutral first view from the gate bridge; gold-green moss lanterns, root-wrapped stone homes, people looking up from Rootmarket.
2. **Witness Stones:** four worn stone tablets in a mossgarden water channel with the false crown slat visibly nailed over an old mark.
3. **Cargo Siding:** Willow-sealed crates under covered lamps, old rail grooves, roots through fitted stone, no readable baked-in text.
4. **Closing Mossgarden:** Mara and the revealed courier mark, using soft green and gold light rather than melodrama.

## Required later portrait set

- Bramwell Gatehand
- Noma Greenstill
- Quill Pebbleturn
- Auntie Lume

Emoji/text portrait fallbacks remain valid until final art exists.

## Enemy targets

- Briar Cargo Runner
- Seal-Forged Sentry

The Sentry should read as forged authority made physical: wax, torn order sheets, tags, thin wood, and thorn cord around a readable combat silhouette. It must remain storybook-fantasy rather than horror.
