# Liam's Game — Chapter 3 Story Script

## Chapter 3: The Hidden Root

**Status:** Canonical narrative source for the playable Chapter 3 vertical slice. The Hold Bell drama pass, first Split Hall debate, and conversation knowledge/continuity pass are implemented in the live game.

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

> “A shield must know what it covers. And when to lower.”

## Noma Greenstill

Female Mossback memory-keeper of the Mossgarden and Witness Stones. Noma is gentle, observant, and firm about the old road's purpose: memory is not nostalgia when someone needs the truth to get home. She uses she/her pronouns.

**Voice:** Patient images of roots, water, weather, and care. Never vague for its own sake.

> “Roots survive by holding fast. They also survive by sharing water.”

## Quill Pebbleturn

Young male Stonekin craftsperson in Rootmarket. Quill is curious about surface inventions and irritated by people who mistake curiosity for carelessness. He offers practical help and gives the player a lived-in, hopeful view of Westroot. He uses he/him pronouns.

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
  → Rootbread Promise at the Transfer Checkpoint (optional)
  → Hold Bell crisis
  → Split Hall first debate
  → Witness Stones
  → Cargo Siding
  → Split Hall resolution
  → Mossgarden closing scene
```

## Hub Presentation And Movement

Westroot is a village beneath the hill, not an unknown wilderness or dungeon. The complete painted hub remains visible from the moment the player enters; it does not use fog of war.

Movement nodes remain hidden in normal play. Arrow/WASD inputs therefore follow the direction the next stretch of painted road appears to travel on screen, rather than the underlying tile coordinates. Diagonal stretches may accept both plausible directions when neither key belongs to another visible branch. At the First Gate, for example, both **Down** and **Right** begin the descending bridge route. At the plaza junction in front of Rootmarket, **Up** enters the stalls, **Left** follows the rising path toward Mossgarden, and **Right** continues through the village. Later junctions preserve similarly visible choices toward Split Hall and Cargo Siding. The Rootbread return interaction reuses the First Gate landing rather than adding another landmark.

The paved plaza in front of Rootmarket and Rootmarket itself are separate nodes. Walking past the stalls does not begin a market conversation; the player deliberately steps off the public path and into the market. The Witness Stones endpoint sits on the lower edge of its painted water circle so the hero remains visible beneath the persistent update ribbon.

First meetings include the party returning the courtesy of a name without adding another dialogue step. Bramwell receives the names like entries in a gate ledger, Quill immediately trusts the named hands with work, Lume answers them with another slice of bread, and Noma treats a name as the beginning of accountable evidence. These reactions establish each person's relationship to outsiders inside the conversation the player was already having.

Outdoor character markers follow story staging:

- Bramwell waits beside the First Gate before the Hold Bell, moves to Split Hall during the crisis, and returns to the gate after the resolution.
- Noma begins in the Mossgarden, joins the Hold Bell meeting in Split Hall, and moves with Bramwell to the Witness Stones once the first debate is heard. Both return to their usual posts after the public renewal or final resolution.
- The Rootbread child appears at the First Gate's Transfer Checkpoint only after Lume gives the player that lead, and disappears when the promise is complete.
- Quill and Lume remain inside Rootmarket and do not need separate outdoor markers. The Cargo Siding threat remains hidden until the Witness Stones open that route.

## Main Quest: The Hidden Root

| Step | Objective text | Completion condition |
|---|---|---|
| 1 | **Enter Westroot** — The First Westroot Gate is open, but the people beneath the hill do not yet know why you came. | Bramwell grants a limited welcome. |
| 2 | **Listen Before You Ask** — Meet the people keeping Westroot safe and learn why the gate's opening has divided them. | Hear Bramwell, Noma, and one Rootmarket voice. |
| 3 | **Answer the Hold Bell** — A counterfeit Willow-marked crate vanished from its assigned hold bay under a correct Westroot signal. Hear what the sudden closure protects and who it leaves outside. | Trigger the Hold Bell after hearing Quill and Noma. |
| 4 | **Hear Westroot at Split Hall** — Bramwell wants three days sealed; Westroot has missed two scheduled water calls to the outer shelter. | Hear at least one piece of community testimony. |
| 5 | **Renew the Road Promises** — Join Westroot as it decides publicly how caution and care will guide the investigation. | Choose which promise Westroot acts on first; the community renews all four together. |
| 6 | **Track the Missing Willow-Marked Crate** — This counterfeit shipment is not Ada's original spice crate; wheel marks lead from its empty hold bay into the locked inner siding. | Follow the physical trail, inspect the relocated crate, and defeat the enemies still hiding there. |
| 7 | **Bring the Evidence to Split Hall** — Westroot needs the full truth: the danger outside and the opening made from within. | Resolve the Split Hall scene. |
| Complete | **Chapter Complete: The Hidden Root** — Westroot restores its first guarded surface compact with Bramblecross. Lio's trail leads west through the Underway. | `chapterThreeClear` is set. |

## Required Chapter-End Flags

- `westrootTrustEarned`
- `witnessStoneSequenceSolved`
- `willowCargoExposed`
- `chapterThreeClear`

Optional consequence flags record which Witness Stone promise the player chose first and whether the cargo runner escaped. Neither may prevent the required end flags.

---

# Scene Script

## 1. First Westroot Gate

### Arrival scene

**Location:** First Westroot Gate

**Text**

The no-handle door closes behind you without a sound. Its broad inner landing is a working **Transfer Checkpoint**: a clean water channel and wash basin, an airing rack, an inspection bench, a wooden account rail, and an ordinary tray of rootbread and cups.

For several steps, the passage is only root, stone, and the small noises your boots make when they stop pretending not to be nervous. Then the hill opens.

Bridges of fitted gray stone cross a cavern broad enough to hold a village. Living roots curl around balconies and roofs. Gold-green moss lanterns hang in clusters along the walls, some fitted with practical signal shutters.

Below, a market is packing itself away very quickly.

Every face turns toward the gate.

A broad Stonekin in a slate-colored coat blocks the bridge. His key ring is too heavy for decoration.

“No account mark. No inside confirmation. That old phrase-lock has not admitted an unscheduled surface party in living memory,” he says. “I am Bramwell. Gatehand, until nobody needs one. Who opened my gate?”

**Choices**

- “The old phrase-lock opened after we restored its marks.”
- “We are looking for Lio Brindle. He came through here alive.”
- “Ask us what we brought before you decide what we are.”

### Response: truth choice

> Bramwell looks past you to the sealed stone. “Then you repaired an old mechanism. You did not supply an account or a gatekeeper expecting you. That difference is why everyone here is afraid.”

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

Rootmarket is a location hub rather than the opening of Quill's conversation. Before introductions, its choices describe an observable person rather than supplying a name the player has not heard. Every character conversation returns to its own unanswered topics or to the shared market instead of presenting another person as though they were one of Quill's replies.

**Location choices**

- Talk to the Stonekin repairing a shutter.
- Approach the Mossback baker.
- Listen to the argument. This is a one-time action.
- Leave Rootmarket.

### Ambient market voices

A Mossback pipe-mender knots one thin red hold-cord to a stall while arguing that every listening signal should be stopped. A tired Stonekin relay runner grips an unanswered outer-shelter tally and insists that silence could strand her father. Other Stonekin and Mossbacks quietly disagree with both of them. They sound like neighbors deciding which fear gets to speak first.

### Quill Pebbleturn

**Text**

A young Stonekin is repairing a cracked lantern shutter with a tool small enough to be a joke and precise enough not to be one.

“Hold this,” he says without looking up, pressing a warm brass hinge into your palm.

Only then does he look up and realize you are not from Westroot.

“Oh. You are the gate problem. Quill Pebbleturn—shutter-mender, signal-keeper, and apparently greeter.”

The player introduces Liam, Mara, and the current companion. Quill repeats the names without hesitation and lets the player keep holding the hinge while he aligns the shutter: named hands are easier to ask for help.

**Choices**

- “Then ask us what you need to know.”
- “What does that shutter do?”
- “We are following a missing courier.”

### Response: ready to help

> Quill glances at the hinge in the player's hand. “Good. Hold it level, then. A useful introduction is better than a polished one.”

### Response: shutter question

> “Keeps a lantern from calling through the hill when it should only light a stair. A road signal is useful. A road signal shouted at the wrong time is a map for anyone listening.”

### Response: Lio question

> Quill stills his hands on the hinge. “We heard a courier passed through. We did not hear his name. There is a difference between a report and a person.”

### Converged text

Quill fits the hinge back into place.

“The old road had a rule. Every signal had to tell someone what it was for, who sent it, and what care came with it. Warning. Shelter. Water. Witness. The Briar people copy the authority and leave out the responsibility. That is what makes their signals easy to misuse.”

Quill first separates the arrivals: three nights ago, a scheduled shipment bearing a green three-leaf market seal and an unnamed westbound courier entered with correct-looking credentials; the party opened an old phrase-lock with no account or inside confirmation. Quill does not know about Ada's missing spice crate at this point. He then reaches for a work tally weighted with a chip of green sealing wax, introducing the object that the player may reasonably ask about.

**Choices**

- “How did the old road keep its signals clear?”
- “What is the green wax in that ledger?”
- Thank Quill and step back.

Each informational topic disappears only after it has been asked. Its response offers **Ask Quill about something else** while another topic remains, so the player can hear both without leaving and restarting the conversation. If Noma's explanation is already complete, the Hold Bell interrupts only when the player chooses to step back.

### Old-rule response

> “The Witness Stones are past the Mossgarden. Noma tends them,” Quill says. “Warnings, water calls, shelter marks—Westroot gives each one a sender, a witness, and someone responsible for what follows. Bramwell closed the walk when the Willow crate came under hold.”

### Cargo response

> Quill's expression closes. “Three nights ago, during second watch, a scheduled transfer arrived with a green three-leaf market seal, an unnamed westbound courier, a correct-looking outside account, and Westroot's inside confirmation. Bramwell later found that the sender record disagreed, put the crate under hold, and then somebody moved it anyway.”

**Outcome**

- Set `metQuill`.
- Quill counts as a Rootmarket voice for the listening objective.
- Optional lead: Cargo Siding becomes visible but stays locked until the Witness Stones are resolved.

### Repeat interaction

Quill asks what else the player needs to know. Any unanswered old-road or green-wax topic remains available.

---

## 3. Auntie Lume and the Rootbread Promise (Optional Side Thread)

### First conversation

**Text**

The Mossback baker stands behind a low counter with flour on her sleeves and a kettle steaming at her elbow. Her mossy brow is tied back with a yellow scarf.

She slides a warm heel of rootbread toward you before anyone asks whether you deserve it.

“Eat,” she says. “Then explain why the gate is making all my soup nervous. Lume is my name. Auntie if I feed you twice.”

The player introduces Liam, Mara, and the current companion. Lume cuts another slice: names first, questions after bread.

**Choices**

- “Thank you. We are looking for Lio Brindle.”
- “Why offer us food before you know whether to trust us?”
- “I should not take food from people who do not trust me.”

The player cannot ask about the **Rootbread Promise** yet. Lume must first use that name in her answer about Lio, hospitality, or accepting food from strangers. Once she does, **You called it the Rootbread Promise. What does it ask of Westroot?** becomes available.

### Lio response

> “Good. A proper answer before a dramatic one.” Lume nods back toward the First Gate. “My young helper carried the ordinary checkpoint tray to an unnamed hooded courier during the false Willow transfer three nights ago. Every traveler waiting at the account rail gets bread and water before Westroot decides on admission. The girl set aside a returned cup that nobody recognized.”

### Hospitality response

> “Trust decides whether I open a door. Hunger decides whether I pass bread through it. Westroot calls that the Rootbread Promise.”

### Promise response, available only after Lume names it

> “If a traveler waits hungry, you offer food before trust is settled. A guarded boundary may delay passage; it may not make a hungry person invisible. Go back to the Transfer Checkpoint. Ask my helper what happened, and do not finish the girl's story for her.”

### Refusal response

> Lume pushes the bread closer. “Then take it as evidence. I am feeding you because we do not know you. That is when food matters most. Westroot calls it the Rootbread Promise.”

Lume's topics remain available until asked. The concrete action **Follow the Rootbread clue at the Transfer Checkpoint** appears only after she has identified the child and returned cup.

**Side objective:** **Follow the Rootbread Clue** — return to the First Gate's Transfer Checkpoint and ask Lume's helper about the unnamed courier.

### Transfer Checkpoint return interaction

**Text**

Back at the Transfer Checkpoint, Lume's young helper waits beside the ordinary rootbread tray. The basin, airing rack, inspection bench, and account rail establish the same practical sequence used for every admitted traveler.

“The hooded courier waited here with the Willow crate and two handlers,” the child says. “I brought the same bread and water everybody gets. I kept the cup he returned because it had a knot I did not know.”

**Choices**

- “What did the courier look like?”
- “How did Lio manage to mark the cup?”

Both questions remain available until asked. The completion action does not appear early.

### Appearance response

> “He was young,” the child says. “Hood over his face. His hands were free so he would look like an ordinary courier, but one handler kept hold of his elbow and the other stood between him and the gate. He ate the bread. He watched everything.”

### Cup-mark response

> “He waited until one handler turned toward the account rail,” the girl says. “Then he pulled a short blue thread from his cuff and wound it around the cup before he gave it back. The tray helped him hide the message in an ordinary checkpoint routine.”

### Cup reveal

After both questions, the child brings out the set-aside cup. A short blue courier thread circles it in one tiny hooked knot.

Mara's breath catches.

“That is Lio's knot. He ate here. He returned this so somebody would know he passed through alive.”

The child looks from the cup to the half-empty tray.

“What happens to it now?”

### Converged text

The player chooses **Restock the tray for the next traveler**.

The party and child restock the ordinary tray with rootbread and water. Mara enters the cup and blue knot in Westroot's witness record.

“The Rootbread Promise reached Lio,” she says. “We did not keep him here. We can keep the promise moving.”

**Outcome**

- Set `rootbreadPromiseKept` and `lioKnotFound`.
- Receive the **Rootbread Charm**.
- The child marker disappears. Repeat inspection reviews the restocked tray and recorded cup without granting another reward.
- The interaction proves that Lio received care and remained resourceful, but the required Cargo Siding path must still establish that he walked beside the crate rather than inside it.

### Auntie Lume, after completion

> “There,” Lume says, wrapping another piece of bread for Mara. “A promise kept does not solve the whole road. It gives the next person a little farther to walk.”

---

## 4. Mossgarden of Remembering

### First entry

**Text**

The Mossgarden is quieter than the market, but not still. Water runs through shallow stone channels. Pale moss curls over old name tablets, repair records, and small lantern hooks. The green light does not hide the writing. It makes room for it.

Noma Greenstill is kneeling beside a tablet with a brush in one hand and a cup of water in the other.

“Do not step on the names,” Noma says. “Most of them have already been walked over enough.”

The party introduces itself before Noma offers any history. The first entry establishes the names and gives the player room to decide what to ask.

### First conversation

**Choices**

- “What are these names?”
- “We need to find the truth about a missing courier.”
- “Why is everyone preparing for the gate to close?”

### Names response

> “Witnesses. Travelers. Bridge-menders. Some names came from the Witness Stones after a warning, a repair, or a missed return. Westroot records names because a missing person is never only a missing number.”

### Courier response

> Noma looks at Mara, then at the old gate-light still reflected on your gear. “Then begin with what you know, not what you fear. Fear makes a loud first draft.”

### Gate response

> “About sixty years ago, Witherdeath entered Westroot through ordinary admitted traffic,” Noma says. “The old checkpoint checked names and cargo, but it had no orderly washing, airing, or observation. People died. Westroot built the sanitation you saw at the First Gate, and that was prudent. Then we ended routine surface compacts, disappeared from public maps, and made isolation the rule. Bramblecross had been our nearest active partner. In time, it remembered us as a story. We kept rare controlled transfers and the outer shelter, but fear turned a safeguard into a whole civic policy.”

### Deliberate Witness Stone tour

After any answer, the player may choose **Walk with Noma to the Witness Stones**. This moves the player and Noma to the four weathered stones rather than merely describing a change of location. The tour is offered once as a deliberate action and is not repeated automatically.

A low oak-and-brass shutter bars the approach. Its latch bears Bramwell's public Gatehand seal. Noma reads the slate aloud before explaining it:

> **HOLD ORDER — FALSE THREE-LEAF CARGO: KEEP IN ASSIGNED BAY.**
>
> **WITNESS STONE WALK AND LISTENING MARKS: CLOSED.**
>
> **REVIEW: SPLIT HALL.**

“Travelers once left route testimony here—washed bridges, safe shelters, names of those who passed,” Noma says. “Westroot still brings every warning, water call, and shelter promise here so the responsible hands can be witnessed. Bramwell's seal names him. That is why the hold carries weight.”

Mara looks toward the tally hook beside the shutter.

“And the outer shelter's water call?”

“Waiting for the witnessed mark it needs before it can leave,” Noma says. “Until it does, Westroot cannot hear their answer.”

Any unanswered names, courier, or closing-gate topic remains available before the tour. The Hold Bell waits until the player finishes looking at the stones or deliberately leaves the conversation.

**Outcome**

- Objective remains to hear Westroot at Split Hall before the hold-shutter can be removed.
- The player can inspect the shutter but cannot access the stones yet.

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

A single low bell rolls through the hill. Market sounds stop and lantern shutters close in sequence. A cargo clerk runs in from the siding and reports that the false three-leaf shipment is gone from its assigned hold bay, while the ledger and siding door still claim it has not moved. Noma arrives visibly from the Mossgarden behind a relay runner; Quill and Lume emerge from Rootmarket with the crowd.

Bramwell states the Hold Bell scope precisely: the First Gate closes to people and cargo, side passages close, and all listening marks and outward signals close until Westroot knows whose mark moved the cargo. Noma objects that the outer shelter is due its water call: closing every listening mark prevents Westroot from sending it or receiving the shelter's answer.

The village divides personally rather than by ancestry. A cautious Mossback pipe-mender names the Chapter 2 enemy that followed a copied shelter return mark: a **Briar Roadwatcher**. He names **Orra Vale** and **Pell Moss** as the people who died keeping it from the homes above. A young Stonekin relay runner argues that her father is one of six people waiting at the outer shelter. Stonekin and Mossbacks stand on both sides.

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
- Move the player to the Split Hall approach after the Hold Bell response. Rootmarket conversation is unavailable during this transition; entering it simply directs the player with the crowd toward the hall.

---

## 4B. Split Hall: The Hold Debate

This is the player's first dramatic visit to Split Hall. The room is already full. Its benches have pulled into two rough banks, but neither ancestry owns a side. Two untouched rootbread baskets sit at opposite ends of the repaired table.

Bramwell asks for three days sealed so every gate-account mark can be checked. Noma insists that three days may be the whole distance between the outer shelter waiting and being forgotten. Quill places the scorched lantern shutter on the table and explains that somebody knew both a private Westroot signal and the timing of the watch change.

The player may hear three independent pieces of testimony:

- **Outer shelter:** Westroot sends a call every second water bell and the six named people return their headcount and need; two calls have been missed.
- **Gate cost:** Bramwell names the people already lost when false warnings reached Westroot homes.
- **Cargo hold:** the correct private timing suggests internal knowledge, but Noma stops the hall from inventing a traitor before evidence exists.

Each topic remains independently available until asked. Hearing any one completes the required first debate; the others remain optional review material. Before leaving, the player explicitly volunteers to investigate what happened to the Willow crate.

Mara identifies the relationship to **Ada's original missing spice crate**: the Westroot shipment is a separate counterfeit crate made to borrow the trust of Ada's stolen Willow seal. It is **missing from its assigned hold bay**, not proven to have left Westroot. The cargo clerk who ran in from the siding reports a wheel cut leading from the empty bay toward the inner Cargo Siding before somebody brushed the dust and reset the lock. Quill does not claim to have found a siding trace while working in Rootmarket. The player offers to follow that physical trail, compare the copied seal with Ada's lesson, and return with evidence before the hall names a traitor.

Bramwell refuses to send strangers into a held route alone. Noma proposes the reconciled method: renew the road promises publicly, have Bramwell and Noma open the siding together, and let the party investigate under Westroot's witness. Bramwell agrees because it is an investigation for which responsible people have put their names on the plan.

**Outcome**

- Set `splitHallDebateHeard` after the first testimony.
- Persist the three testimony choices separately.
- Objective: **Renew the Road Promises** before entering the held siding.
- Repeated walk-throughs remain quiet until the cargo evidence is ready, but manual inspection can reopen unanswered testimony.

### Art target

Use `split-hall-hold-debate-scene-v01`: the same room and character continuity as the selected resolution scene, but with hooded lanterns, a clear empty aisle, opposing body language, untouched bread, the scorched shutter, and mixed Stonekin/Mossbacks on both sides. Do not reuse the reconciliation tableau here.

---

## 5. Witness Stones — Public Renewal

### Why the approach is closed

The low wooden barrier on the Westroot map is an oak-and-brass **hold-shutter** bearing Bramwell's public Gatehand seal. He ordered it closed when the suspicious Willow crate was placed under hold, before the party arrived. A Gatehand has limited authority to pause a route or civic signal during an emergency, provided the order names the responsible officer, its scope, and its place of review.

The shutter therefore remains in place through the first Hold Bell debate. It pauses the stone walk and its listening marks while the cargo risk is reviewed. Once the crate moves under hold and the outer shelter misses two water calls, Split Hall has new facts with which to judge whether that scope still protects Westroot.

Before Split Hall acts, inspection should make the boundary clear:

> The oak crossbar is sound Westroot work. Bramwell's public Gatehand seal sits beside a slate naming the Willow cargo hold, the closed stone walk and listening marks, and Split Hall review. Anyone who reads it knows who ordered the closure, what it covers, and where it must be questioned.

### Public opening

After the first Split Hall testimony, Bramwell, Noma, Quill, Lume, Mara, and neighbors from both sides gather at the shutter.

Bramwell places one hand on its latch.

> “I closed this walk when the Willow crate came under hold. The crate moved anyway. Westroot has missed two water calls to six people at the outer shelter. This shutter is holding the wrong thing.”

Noma takes the other latch.

> “Then we open it together and put the new order under both our names.”

They remove the hold-shutter together. This is the chapter's first visible act of reconciliation: Bramwell accepts that lawful authority must remain accountable, and Noma affirms that caution and responsible leadership are necessary.

### The player's choice

The four stones turn Westroot's road commitments into witnessed public work. The player chooses which promise Westroot should act on first in the present crisis:

| Promise | Immediate public action |
|---|---|
| **Witness** | Quill reads the held-cargo ledger aloud; no accusation is entered without named testimony. |
| **Warning** | Bramwell and Noma send an accountable warning to the outer shelters without exposing every route. |
| **Shelter** | Lume and the gatekeepers count beds, food, and every person the closure must still protect. |
| **Water** | The missed water tally is sent with two witnesses watching the signal leave and its answer return. |

The chosen promise receives the first named mark. Then Westroot's neighbors take up the work represented by the other three, with a named hand responsible for each action. A signal leaves for the outer cistern and its answer visibly returns: six people present, water needed, all accounted for.

Quill reads the new scope aloud. The Witness Stone walk and listening marks are open again. The outer shelter may answer. Bramwell and Noma authorize one witnessed Cargo Siding investigation. The First Gate, side passages, and general traffic remain under hold.

The scene's moral distinction is **trustworthy authority versus counterfeit authority**, not obedience versus independence. A good instruction comes from someone who has accepted responsibility, names the danger and the people affected, and remains answerable when circumstances change. The Briar Crown corrupts trust by copying legitimate marks and signals while refusing those responsibilities.

### Outcome

- Retain `witnessStoneSequenceSolved` temporarily for save compatibility; its story meaning is now “the road promises were publicly renewed.”
- Record which promise the player chose first.
- The cargo clerk unrolls the siding map and explains that wheel grooves run from the empty hold bay deeper into the Cargo Siding; the crate did not simply vanish.
- Show the outer-shelter signal leave and its answer return before the Cargo Siding authorization.
- Read the limited reopening scope aloud; this is not a general reopening of Westroot.
- Bramwell and Noma open the Cargo Siding under shared witness.
- Bramwell, Noma, and Quill move to the approach junction below the Cargo Siding entrance, and the player follows them there before walking the final step inside.
- Objective: **Track the Missing Willow-Marked Crate**.
- Gain the **Witness Stone Rubbing**.
- The post-renewal map uses the open Witness Stone approach without the shutter.

---

## 6. Cargo Siding

### Arrival

**Text**

Bramwell and Noma open the Cargo Siding together. Just inside, a chalk rectangle marks the empty bay where the false Willow-marked crate was supposed to remain under hold.

Fresh wheel grooves cross the older rail cuts and run behind the rearmost stacks. The party follows them to a green three-leaf crate with the same chipped runner and inventory cord Quill logged outside. Its lid has been hastily re-nailed. Scuffed bootprints continue behind the crates into the covered-lantern shadows.

Mara identifies the relationship clearly: this is not Ada's missing spice crate. It is the kind of counterfeit shipment the theft of Ada's seal made possible.

“Missing from the hold bay,” Quill says quietly. “Moved deeper while the door was made to look locked. Whoever did it may not have finished.”

### Crate inspection

**Choices**

- “Use the Willowmark Lens.” *(Available if the player has it.)*
- “Inspect the wax and crate tags closely.”
- “Check the rail marks and loading ledger.”
- “Open the crate carefully.”

### Lens result

> Ada's lens catches the nicked three-leaf mark beneath a layer of pine pitch and a thin wash of crown-red wax. The seal is genuine enough to pass a hurried eye and false enough to make Ada furious.

Show the Willowmark seal icon with its nicked left leaf in this result so the visual evidence accompanies the lens reading.

### Manual inspection result

> Even without the lens, the wax tells on itself. Green market wax has been warmed, pressed, covered, then made to look untouched. Someone wanted trust to arrive before questions did.

### Ledger result

> The loading ledger has no sender's name. Instead, it bears two acknowledgements: a Briar Crown route scratch and an old Westroot gate-account mark. One opened the way from outside. One confirmed it from within.

Fresh boot scuffs also reveal the narrow service passage behind the crates. Quill bars it with the repaired lantern shutter while Bramwell quietly stations two gatekeepers. This deliberate investigation sets `cargoAmbushPrepared`, lets the party begin combat with the initiative and 4 Guard, and makes the runner-capture choice available after victory.

The other inspection choices remain valid fail-forward routes. They reveal enough evidence to confront the enemies and finish the chapter, but the unprepared runner escapes through the service passage after the fight.

### Open-crate result

The lid gives with a reluctant scrape.

Inside are no spices.

There are blank order sheets cut to official size. Broken seal tools. Thorn-collar fittings wrapped in waxed cloth. Small scratching knives for changing route marks in the dark.

At the bottom lies Lio's confiscated courier pouch and a torn route tag. It records one guarded prisoner marched beside the Willow convoy through the Transfer Checkpoint and then sent through the Lower West Gate. The crate remained in Westroot.

Mara picks it up, then puts it down with both hands.

“They recorded him like cargo,” she says, “but this crate stayed in Westroot. Lio walked through alive.”

### Evidence scene

**Text**

Quill lays the transfer tag beside Lio's confiscated pouch.

“This record is plain,” he says. “Lio was marched beside the convoy under guard and sent through the Lower West Gate. The crate remained here.”

Noma reads the two acknowledgement marks without touching them.

“The operation borrowed trust from both sides of the checkpoint,” she says. “Ada's Willow seal outside. Westroot's account mark and second-watch timing inside.”

Bramwell's jaw tightens.

“A gate account can be copied,” he says.

“Yes,” Noma replies. “This proves procedural knowledge, not a willing traitor. We name that difference too.”

There is no accusation in Noma's voice. That makes the silence heavier.

Then, from the far end of the siding, a crate latch snaps shut.

Someone says, “You should have left the gate closed.”

### Battle setup

A hooded **Briar Cargo Runner** steps out from behind the stacked crates. A **Seal-Forged Sentry** unfolds beside him from a bundle of order sheets, wax, route tags, and thorn cord. Its crown-stamped scraps flutter like it is trying to become official by force. The runner keeps one hand near a pouch of crown-red powder and one eye on the narrow service passage behind him. He means to hold the party here, then carry warning west if he can break away.

Mara backs behind a stone loading post before the fight begins.

“Still behind the line,” she says, breathless but steady. “I am very committed to this part.”

The transition must use explicit controls:

1. **Call out whoever is hiding behind the crates.** This reveals both enemies and displays the battle setup.
2. **Fight the Briar Cargo Runner and Seal-Forged Sentry before he can escape.** This starts combat. The alternate control is **Back away before the runner and sentry attack.**

Do not use a generic action such as “Clear the Cargo Siding” to start the encounter. The player must know that the next click begins a fight.

**Battle objective:** Defeat both enemies in the Cargo Siding. Both are active simultaneously; the encounter should use the multi-enemy battle system rather than a sequential queue.

### Battle victory

**Text**

The Seal-Forged Sentry collapses into wet wax, snapped cord, and paper that has forgotten how to stand up.

The Cargo Runner is disarmed and driven to one knee. The fight is won, but he is not bound. He looks once toward the old rail tunnel, then toward the open gate far above.

“You think truth makes people safe?” he says. “Truth makes people choose. That is worse.”

He throws a fistful of crown-red powder into a lantern shutter and bolts toward the service passage.

### Runner captured outcome

Available only if the service passage was discovered and covered before combat.

The player signals Quill to close the prepared escape route. The powder fails to catch. Quill's repaired shutter closes with a sharp click, and Bramwell's gatekeepers step through the smoke to bind the runner.

> “Then you can choose to answer questions,” Bramwell says.

### Runner escape outcome

The player secured the evidence without preparing the service passage. By the time the smoke clears, the runner has vanished west through that uncovered route, leaving behind a torn transfer tag. The defeated Seal-Forged Sentry and all of the crate evidence remain behind.

> “He ran west,” Mara says. “That means west is still a direction, not an answer.”

### Converged evidence

The recovered tag carries a route notation that Noma recognizes but cannot fully read in the siding's bad light.

> “Not a public road,” Noma says. “A listening route. It will need a different map.”

**Rewards**

- XP and gold appropriate to Chapter 3 progression.
- Set `willowCargoExposed`.
- Optional: **Cargo Transfer Tag** story item.
- Set either `cargoRunnerCaptured` or `cargoRunnerEscaped`; both continue to the same chapter resolution.
- Objective: **Bring the Evidence to Split Hall**.
- Save combat checkpoints using the active region name; this encounter must report **Westroot**, not Lantern Road.

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

“The Briar Crown did not beat the gate,” he says. “Its people learned which parts of us were afraid and made a key out of that.”

### Player choices

- “Frame the compact around the danger that closure failed to stop.”
- “Frame the compact around warnings and shelter traveling together.”
- “Frame the compact around the four road promises.”

These are three framings of the same guarded Bramblecross compact, not three different success or failure endings. Every choice reaches the same concrete policy; the response changes which lesson the player names first.

### Response: Bramwell right

> Bramwell nods once. “Thank you.”
>
> “But,” you continue, “a closed gate did not stop the false cargo. It made it harder for anyone outside to know it was here.”

### Response: Noma right

> Noma inclines her head. “Truth is not the same as throwing every door open.”
>
> “No,” you say. “It is warning people before they walk into a trap, then giving them shelter and water when they need it.”

### Response: stones answer

> You place the rubbing in the center of the table. “Witness. Warning. Shelter. Water. Each promise names who is responsible and what care the next traveler can expect. That is why people can trust the road enough to follow it.”

### Converged resolution

Bramwell looks at the old road phrase for a long time.

“A shield must know what it covers,” he says. “And when to lower.”

Noma's expression softens.

“Then name what changes—and what does not,” she says.

Bramwell looks to the player instead of pretending to know a town he has not visited in sixty years.

“You know Bramblecross,” he says. “Who should receive Westroot's first warning, and whose name should we trust on the first outside account?”

The player may name Enna, Captain Hollis, Mayor Anwen, or all three. Each answer identifies why that person is trustworthy: Enna tests records, Hollis can bind the watch to the compact, and Anwen can answer for Bramblecross publicly.

Bramwell turns to the hall.

“Westroot restores one surface compact: Bramblecross.”

The room answers with a single audible gasp, then swells with murmurs and questions: the surface, after sixty years, and what may now reach the First Gate.

Bramwell raises one hand for silence. He explains that the compact does not throw Westroot open: the First Gate stays guarded; people and cargo still require named outside accounts, inside confirmation, checkpoint sanitation, and witnesses; no other former partner is readmitted. The change gives Westroot honest Bramblecross contacts who can verify seals, compare records, carry warnings, and answer shelter and water calls. Isolation let the false Willow shipment use trust from both towns while neither could compare the claim.

Bramwell then looks across the repaired table to Noma.

“Noma has argued for a witnessed surface compact longer than I have enjoyed hearing it,” he says. “She was right. Caution without an honest neighbor became a wall around our own blind side.”

Noma's smile is small and unmistakable.

“I will try not to enjoy hearing that too much.”

Quill copies the decision, folds the first warning for the contact named by the player, and shoulders a courier satchel.

“If a compact is real,” he says, “someone has to carry its first message.”

Quill leaves for the First Gate. The decision has become visible action.

Auntie Lume sets a basket of rootbread on the table, and people begin taking pieces. It is the closest thing Westroot has to a vote of confidence.

Mara picks up a piece, breaks it in half, and gives one half to the nearest gatekeeper.

“For the next traveler,” she says.

The gatekeeper takes it.

**Outcome**

- Set `westrootTrustEarned`.
- Set `chapterThreeClear`.
- Objective updates to **Chapter Complete: The Hidden Root**.
- Westroot becomes a trusted hub rather than a one-time hiding place.
- Quill physically carries the first named warning toward Bramblecross.

---

## 8. Mossgarden Closing Scene

### Scene opening

**Text**

Later, when Split Hall has become a room full of lists, questions, and people making themselves useful, Noma asks you and Mara to return to the Mossgarden.

The Witness Stones are still bright.

Noma lays the recovered transfer tag beside an older carved route index and brushes moss from the matching Lower West Gate symbol. The carving has been here for generations; the fresh evidence is the clerk's transfer record.

The tag records an unnamed courier entering alive under guard and leaving through the Lower West Gate bound west. Lume's checkpoint cup identifies that courier as Lio.

Mara reads the two records together, then closes both hands around the blue string at her wrist.

“He got one message through. Now we know which way they took him.”

Noma aligns the transfer notation with Edden's drawing.

“The Lower West Gate opens into the Underway. This notation points toward its keeper-built listening circuit—the Listening Mile. It cannot be followed like an ordinary road map.”

The westward passage is still dark, but it is no longer an unnamed direction.

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

# Gameplay and Choice Requirements

## Witness Stones

- The hold-shutter blocks access until the first Split Hall debate has named the costs on both sides.
- The shutter is visibly legitimate Westroot work, not enemy propaganda.
- Bramwell and Noma remove it together in a public scene.
- The player may inspect every promise before choosing which one Westroot acts on first.
- There is no incorrect choice and no memorized sequence.
- All four promises are renewed by different community members; no one promise or faction is declared sufficient alone.

## Cargo Siding

- The Willowmark Lens provides richer wording but is not mandatory.
- The fight is a true simultaneous multi-enemy encounter.
- Inspecting the ledger prepares the service passage, grants initiative plus 4 Guard, and unlocks capture. Skipping it fail-forwards to the escape outcome without blocking completion.
- The Cargo Runner capture/escape branch changes the witnessed ending record, not the chapter's completion path.
- Mara remains clearly protected and does not enter battle systems.

## Community Resolution

- Do not frame Bramwell as cowardly or Noma as naive.
- The player validates each concern, then uses the Witness Stone ethic to propose a concrete operating rule.
- Westroot's trust is earned through evidence, correction, and care—not by a charisma roll that makes the town instantly agree.

---

# Art and Presentation Notes

Illustrated dialogue uses the condensed responsive layout by default: art and required copy sit side by side on wider screens, while required copy precedes the shorter illustration on phones. Choices remain visible outside that scroll region. True chapter-ending tableaus are explicit exceptions: the Chapter 1 completion, Chapter 2 Westroot threshold handoff, Chapter 3 Split Hall resolution, and Chapter 3 Mossgarden closing retain full-width art, with their actions placed after the prose inside the scroll flow.

The Chapter 3 closing also includes a concise witnessed record of the first promise chosen, Cargo Siding capture/escape outcome, Rootbread result, and Split Hall testimony heard.

## Key scene images

1. **Westroot reveal:** a character-neutral first view from the gate bridge; gold-green moss lanterns, root-wrapped stone homes, people looking up from Rootmarket.
2. **Transfer Checkpoint Rootbread scene:** Mara and the young Mossback beside the basin, airing rack, inspection bench, account rail, and ordinary tray; the child presents Lio's returned cup with one short blue hooked knot.
3. **Witness Stones:** four worn stone tablets in a mossgarden water channel. The post-renewal base map shows an open approach; a stateful pre-renewal overlay or alternate background shows the legitimate oak-and-brass Westroot hold-shutter across it.
4. **Cargo Siding:** Willow-sealed crates under covered lamps, old rail grooves, roots through fitted stone, no readable baked-in text.
5. **Closing Mossgarden:** Mara and the revealed courier mark, using soft green and gold light rather than melodrama.

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
