# Liam’s Game — Chapter 2 Story Script

**Chapter Title:** The Westroot Trail

This document drafts the story-facing text for Chapter 2 in the same general format as the Chapter 1 script. It is written with the current gameplay constraint in mind:

- The hero travels with **one active combat companion** at a time.
- Rowan, Tilda, and Moss remain at the Bramblecross Inn when not active.
- The player may switch companions by returning to the inn.
- Mara may travel with the group as a **non-combat guest** during specific story sections, but she does not replace the active companion and does not participate in battle.

---

# Chapter 2 Overview

## Core Promise

The hero follows the Westroot lead from Chapter 1, meets Mara Brindle properly, receives Edden’s broken riddle-clues, learns how to spot altered cargo marks from Ada, and follows the old road west through a puzzle of true and false signs.

The chapter ends at the First Westroot Gate, where Mara recognizes a tiny courier mark from Lio:

**ALIVE PAST THIS POINT. DO NOT TRUST THE STRAIGHT ROAD.**

The gate opens into gold-green underground light.

## Story Purpose

Chapter 2 should do five things:

1. Make Mara emotionally central to the search for Lio.
2. Turn Edden’s strange testimony into useful puzzle language.
3. Teach the player that false signs command while true signs guide, warn, shelter, and remember.
4. Establish that the road west is being watched by the Briar Crown.
5. Confirm that Lio survived past the Westroot gate.

## Gameplay Notes

### Active Companion Handling

Only the active companion should speak during travel scenes, puzzle scenes, and combat-adjacent moments.

Use conditional dialogue based on `activeCompanionId`:

- `rowan`
- `tilda`
- `moss`
- `none` if the player has no active companion

Inactive companions can receive updated inn dialogue before and after the chapter, but they should not comment on road events they did not witness.

### Mara Handling

Mara is a story guest, not a combat unit.

She can:

- comment during investigation scenes
- notice Lio-specific clues
- provide puzzle hints
- create emotional pressure
- appear in map scenes as an escorted/protected NPC

She should not:

- enter the combat turn order
- take damage
- require healing
- replace the active companion
- become a liability the player resents

During combat, Mara should move to a clearly safe place before the fight begins.

---

# Opening / Chapter Start

## Bramblecross, Morning After the Report

**Text**

Bramblecross does not wake easily.

The market opens, but quietly. The inn serves breakfast, but travelers keep one eye on the windows. The watchhouse door has not stopped creaking since dawn: messengers in, runners out, townsfolk bringing rumors wrapped in worry.

Inside the watchhouse, Enna has spread three maps across the table.

One is a public road map.

One is a courier map.

One is not really a map at all, but a charcoal drawing made by Edden Vale in the middle of the night: three doors, tangled roots, and a lantern pointing downward.

They do not agree.

That is the problem.

Westroot was opened.

Lio Brindle is still unaccounted for.

And somewhere beneath the old roads, a gold lantern flickered once.

**Choice**

- Return to the watchhouse

---

# Bramblecross Watchhouse

## Enna and Hollis — First Chapter 2 Briefing

### Scene purpose

This scene should orient the player after Chapter 1 and establish that Westroot is now the main lead. It should also account for the active companion system without implying the whole companion group is present.

### If player has no active companion

**Text**

Enna looks up from the maps, then at the space beside you.

“You can follow this lead alone if you must,” she says, “but I would rather you did not. The road west is not simply dangerous. It is being edited.”

Hollis nods toward the inn.

“Rowan, Tilda, and Moss are still in Bramblecross. Choose who you want beside you before you leave. One steady companion can matter more than three names on a plan.”

**Choices**

- I’ll choose a companion at the inn first.
- Brief me anyway.

### If player has an active companion

**Text**

Enna looks up as you enter, then nods once to the companion at your side.

“Good. One clear witness is better than a crowd of half-listeners.”

Hollis stands near the case wall, the strip of Edden’s blue cloth now pinned beside the sketch of the Briar Crown mark. He has slept, maybe. Not enough to look rested. Enough to look more certain.

“The cellar gave us a direction,” he says. “Westroot. But the maps disagree on what Westroot is.”

Enna taps the first map.

“Public road map: nothing useful.”

She taps the second.

“Courier map: fragments. Old marks. A westward cut that should not still exist.”

She taps the charcoal drawing.

“Edden’s map: three doors and a lantern pointing the wrong way.”

Hollis folds his arms.

“I do not like sending you toward a place our maps cannot agree on.”

Enna’s eyes stay on the drawings.

“I like less that someone else has already opened it.”

**Choices**

- What exactly is Westroot?
- What did Edden draw?
- How does this help us find Lio?
- I’m ready for the lead.

---

## Ask: What exactly is Westroot?

**Text**

“That is the honest answer: we do not know exactly,” Enna says.

She pulls a thin strip of parchment from under the courier map. It is older than the others, worn soft at the edges and marked with route symbols instead of proper town names.

“Westroot is not listed like a town. It appears in old courier shorthand as a root mark, a lantern mark, and sometimes a storehouse tally. That means it may be a route, a gate, a hidden waystation, a settlement, or all of those wearing one name.”

Hollis looks toward the cellar stairs.

“Edden reached the sealed door and came back saying the old way still listens. If Westroot is part of that old way, then someone just opened more than a tunnel.”

**Choice**

- Then we follow what the old marks say.

---

## Ask: What did Edden draw?

**Text**

Enna slides the charcoal drawing closer.

The lines are shaky, but not careless. Three doors stand side by side under a tangle of roots.

The first door has a crown.

The second has a lantern.

The third has no handle.

Beneath them, Edden has written the same phrase three times, each time smaller:

**THE HONEST ONE HAS NO HANDLE.**

Hollis’s expression tightens.

“He woke before dawn asking for charcoal. Said the door was still trying to explain itself.”

Enna does not smile, but her voice softens.

“That may be fear speaking. It may also be memory. We will treat it carefully as both.”

**Choice**

- I should talk to Edden before I leave.

---

## Ask: How does this help us find Lio?

**Text**

Enna pins a clean strip of paper beside the case wall.

“Lio’s satchel was cut loose before the boar reached Hearthhollow. The old cellar command said ‘courier unaccounted for,’ not ‘courier ended.’ That matters.”

She draws a line from Hearthhollow to Lantern Road, then to Bramblecross, then west into a faded patch of route marks.

“If Lio was moved through the old ways, Westroot is the next honest place to look.”

Hollis adds, “And if he left even one courier mark behind, someone who knows him may be able to read what the rest of us miss.”

A voice from the doorway says, “That would be me, then.”

**Outcome**

Triggers Mara entrance scene if not already triggered.

---

# Mara Brindle

## Mara Entrance Scene

### First appearance

**Text**

The watchhouse door has opened without anyone noticing.

A girl stands in the doorway, twelve or near enough, with road dust on her boots and a blue string tied around one wrist. Her hair has been pinned back in a hurry and has already escaped in three directions. She is holding a wrapped pear roll like evidence.

“I am Mara Brindle,” she says. “If you are making a plan about my brother without me, it is probably a worse plan than it needs to be.”

Hollis closes his eyes for half a second, the way captains do when the day has become more complicated but not less important.

“Mara,” he says carefully, “this is not a safe conversation.”

“Good,” Mara says. “Then it matches the rest of the week.”

Enna looks at the blue string on Mara’s wrist.

“That came from Lio’s lunch packet?”

Mara lifts her chin.

“I tied it. He was supposed to bring it back so I could prove he ate the roll and not just the raisins.”

For the first time, the room stops treating Lio Brindle like a route problem.

He becomes someone’s brother.

**Choices**

- Mara, we’re trying to find him.
- It may be dangerous for you to come.
- What can you tell us about Lio’s route marks?

---

## Choice: Mara, we’re trying to find him.

**Text**

Mara studies you as if deciding whether your words have enough weight to stand on.

“People keep saying that,” she says. “Find him. Account for him. Follow the lead. Like he is a dropped parcel with boots.”

She looks at the maps.

“Lio hums when he ties knots. He saves crust edges for last. He draws arrows wrong on purpose if he thinks I am watching, just to make me argue. If he left a mark, I might know it.”

Her voice wobbles on the last word, then stiffens back into bravery.

“So yes. You are trying to find him. I am trying to find Lio.”

**Choice**

- Then help us read what he left behind.

---

## Choice: It may be dangerous for you to come.

**Text**

Mara gives you the look of someone who has heard this sentence from every adult in town and disliked it more each time.

“I know,” she says. “That is why I am bringing a pear roll.”

Hollis starts to object.

Mara points at him with the wrapped roll.

“Also, I am not asking to sword-fight a thorn monster. I am asking to look at road marks. I am very good at looking. Lio says I look at people until they confess things they did not steal.”

Enna covers her mouth with one hand. It might be a cough.

Hollis sighs.

“You stay behind the line when danger starts.”

Mara nods too quickly.

“Behind the line. Near the line. A reasonable distance from the line.”

“Mara.”

“Behind the line.”

**Choice**

- Agreed. Behind the line.

---

## Choice: What can you tell us about Lio’s route marks?

**Text**

Mara steps closer to the table, suddenly all business.

“Lio writes small when he is worried. Too small. Like the message will be safer if it takes up less room.”

She points to one of the courier marks on Enna’s map.

“That one is normal courier shorthand. Safe turn. Dry ground. Shelter within shouting distance.”

Then she taps the edge of Edden’s drawing.

“But Lio adds a little tail to arrows when he wants me to know he was the one who made them. He says it makes the road look like it sneezed. It does not. It looks like a worm wearing a hat.”

Enna writes this down with absolute seriousness.

“Worm wearing a hat,” she says.

Mara nods.

“Important evidence.”

**Choice**

- Then we will watch for sneezing arrows.

---

## Mara repeat conversation before leaving town

**Text**

Mara has taken over the corner of the map table with the confidence of a very small general. She has arranged three crumbs, a string, and a button into what may be a route diagram or a threat to anyone who moves them.

“If Lio left a mark, it will be where grown-ups almost see it and then decide it is probably just dirt,” she says. “Grown-ups are very good at almost seeing things.”

**Choices**

- Stay close when we leave.
- Tell me again what Lio’s mark looks like.

### Tell me again what Lio’s mark looks like

**Text**

“A small arrow with a little hook-tail,” Mara says. “Not every time. Only when he wants someone who knows him to notice.”

She holds up the blue string.

“And if he knew I might follow, he would leave something annoying. Lio believes annoying things are easier to remember.”

**Choice**

- I’ll remember that.

---

# Edden’s Recovery Room

## Door prompt

**Text**

Visit Edden in the watchhouse side room? The door is half-open, and the smell of charcoal dust drifts through the crack.

**Choices**

- Enter
- Not yet

---

## First visit

**Text**

Edden Vale sits beside a narrow window with a blanket over his shoulders and charcoal on his fingers. He is seventeen, maybe, though the shadows under his eyes make him look younger and older at once.

The cracked lantern from Hollis’s desk rests on the table beside him.

He is drawing doors.

Not good doors. Not tidy doors. Doors with roots where hinges should be, arrows pointing into stone, and lanterns hung upside down like sleeping bats.

Hollis stays near the doorway, close enough to help and far enough not to crowd him.

Edden notices you and smiles in a quick, embarrassed way.

“I know it sounds wrong when I say it out loud,” he says.

His hand keeps drawing.

“The road said it better.”

**Choices**

- What did the road say?
- Tell me about the three doors.
- We found your cloth at the sealed door.

---

## Choice: What did the road say?

**Text**

Edden looks toward the cracked lantern.

“Not words. Not exactly. More like... when you remember a song but only the stairs remember the tune.”

He frowns, frustrated with himself.

“Three doors. Crown. Lantern. Nothing. The crown shouts. The lantern waits. The nothing door listens.”

His charcoal snaps in his hand.

“The honest one has no handle.”

Hollis writes the phrase down, though Enna has already written it twice.

Edden whispers, “Do not pull. Do not push. Tell the truth nearby.”

**Choice**

- That may help us.

---

## Choice: Tell me about the three doors.

**Text**

Edden turns the drawing around.

The first door is marked with a crooked crown. It has six handles, all drawn too large.

“That one wants hands on it,” Edden says. “Pull here. Push there. Hurry. Obey. Be frightened properly.”

He taps the second door. The lantern door is small and carefully shaded.

“That one is kind. But tired. It can show you where not to go.”

Then he touches the third door.

It is almost blank.

No handle. No hinge. Just a small mark at the bottom that might be a root, or an arrow, or a worm wearing a hat.

Mara leans forward.

“That looks like Lio’s stupid arrow.”

Edden blinks at her.

“It sneezed,” he says.

Mara’s eyes widen.

“I told you.”

**Outcome**

Mara recognizes that Edden may have drawn a distorted version of Lio’s personal courier mark.

**Choice**

- The no-handle door may point to Lio.

---

## Choice: We found your cloth at the sealed door.

**Text**

Edden’s fingers go still.

For a moment, all the restless lines in him seem to stop moving.

“I tied it there,” he says.

Hollis steps forward before he can stop himself.

“You remember?”

Edden nods, but slowly.

“I did not know if I would remember later. So I made the door remember for me.”

Hollis looks away, jaw tight.

Mara lowers her voice.

“That was smart.”

Edden looks surprised by the compliment.

“It was scared,” he says.

Mara shrugs.

“Sometimes smart is scared wearing boots.”

**Choice**

- You helped us find the truth.

---

## Edden gives the drawing

### After asking at least one question

**Text**

Edden tears one drawing from the stack. Hollis starts to protest, but Edden shakes his head.

“This one is done being mine.”

The drawing shows three doors beneath roots. Under the blank door, the tiny hooked arrow waits like a secret trying not to be proud of itself.

Edden presses the paper into your hands.

“When the sign is loud,” he says, “listen smaller.”

**Outcome text**

You receive **Edden’s Three-Door Drawing**.

**Story Item**

- Edden’s Three-Door Drawing

**Quest update**

Edden’s drawing may help identify the true path toward Westroot.

---

## Repeat visit after receiving drawing

**Text**

Edden has gone back to drawing roots, but the lines are calmer now. Hollis sits nearby pretending to read a report and doing a poor job of not watching him.

“The honest one has no handle,” Edden murmurs. “Tell the truth nearby.”

**Choice**

- We’ll remember.

---

# Bramblecross Inn

## Story update purpose

The inn remains the place where the player switches active companions. Chapter 2 should acknowledge that only one companion travels with the hero at a time.

## Inn interior update before leaving for Westroot

**Text**

The Bramblecross Inn feels less crowded than it did yesterday, but not less worried. Travelers speak in lower voices now. A few have stopped pretending not to listen when the watchhouse bell rings.

Rowan, Tilda, and Moss are still here, each responding to the same trouble in their own way.

You can travel with one companion at a time. The others will wait here until you return.

**Actions**

- Ask current companion to wait here
- Talk to Rowan Reedshield
- Talk to Tilda Quickstep
- Talk to Moss Fenmere
- Rest for the night
- Leave the inn

---

## Rowan — Chapter 2 availability

### If not active

**Text**

Rowan is tightening the strap on his shield. He has already packed, though he has not assumed you will ask.

“The west road will not need noise,” he says. “It will need someone who can stand still when fear tries to move everyone at once.”

**Choices**

- Travel with me.
- Any thoughts before I go?
- I’ll come back later.

### If active

**Text**

Rowan stands when you approach, shield ready at his side.

“If we are following Lio’s trail,” he says, “then we protect the trail too. People leave signs behind because they believe someone decent may come after.”

**Choice**

- Let’s go.

### Ask: Any thoughts before I go?

**Text**

“If Mara comes,” Rowan says, “she stays behind the fighting. Not because she is weak. Because courage should not have to prove itself by standing where a shield belongs.”

**Choice**

- That’s fair.

---

## Tilda — Chapter 2 availability

### If not active

**Text**

Tilda has built a small tower out of apple seeds, spoon handles, and one coin that almost certainly belonged to someone else five minutes ago.

“Westroot, hidden roads, false signs, mysterious doors,” she says. “I am trying to be respectful, but this is exactly the sort of suspicious nonsense I am professionally interested in.”

**Choices**

- Travel with me.
- Any thoughts before I go?
- I’ll come back later.

### If active

**Text**

Tilda hops down from her chair and pockets something small. Possibly hers. Possibly not.

“If a sign tells us not to question it,” she says, “I intend to question it until it regrets learning letters.”

**Choice**

- Let’s go.

### Ask: Any thoughts before I go?

**Text**

“Mara is going to run ahead the first time someone says ‘stay here,’” Tilda says. “Not because she is foolish. Because ‘stay here’ sounds exactly like ‘give up’ when you are scared.”

She flicks an apple seed into a cup without looking.

“So maybe give her jobs instead of fences.”

**Choice**

- Good advice.

---

## Moss — Chapter 2 availability

### If not active

**Text**

Moss sits near the hearth, listening to the fire as if it has finally reached the important part of a long story.

“The old roads are waking unevenly,” they say. “That makes them helpful, dangerous, and easily misunderstood.”

**Choices**

- Travel with me.
- Any thoughts before I go?
- I’ll come back later.

### If active

**Text**

Moss rises slowly, one hand resting on the cracked teacup tied to their pack.

“Westroot is not only west,” they say. “Roots do not think in straight lines. We should not either.”

**Choice**

- Let’s go.

### Ask: Any thoughts before I go?

**Text**

“Edden is not speaking nonsense,” Moss says. “But neither is he speaking plainly. Do not squeeze riddles until they confess. Hold them up to the right light.”

**Choice**

- I’ll keep that in mind.

---

# Willow Market / Ada’s Seal Lesson

## Door prompt

**Text**

Enter Willow Market? The bell over the door gives one nervous ring, then seems embarrassed by its own alarm.

**Choices**

- Enter
- Stay outside

---

## Ada before seal lesson

**Text**

Ada Willowmarket has cleared a space on her counter and filled it with stamps, tags, sealing wax, twine, crate slats, ledger slips, and one small jar labeled **DO NOT USE UNLESS THE DAY GETS WORSE**.

She sees you looking at it.

“Pepper oil,” she says. “For soup or emergencies.”

Then she pushes a green-painted crate slat toward you.

“If you are following Willow-marked cargo west, you should know what my mark looks like when it is honest.”

Mara leans on the counter.

“Can marks be dishonest?”

Ada gives her a look.

“Child, half of business is learning when handwriting has started wearing a fake mustache.”

**Choices**

- Teach me how to spot a false Willow seal.
- Did you find anything else about the stolen crate?
- I’ll come back later.

---

## Teach me how to spot a false Willow seal

**Text**

Ada places two crate seals side by side.

At first glance, they look nearly identical: three leaves inside a circle.

Then Ada taps the honest one.

“My stamp has one nick in the lower leaf. See it? Tiny. Annoying. Mine.”

She taps the copied one.

“This one is too perfect. That is how you spot some liars. They do not know which flaws belong.”

She hands you a small brass-rimmed lens and a folded rubbing cloth.

“Use this on green paint, cargo stamps, and seals that look proud of themselves. It will not tell you everything. But it may tell you when something has been cleaned too carefully.”

**Outcome text**

You receive **Willowmark Lens**.

**Story Item / Utility Item**

- Willowmark Lens

**Quest update**

The Willowmark Lens can help reveal altered cargo marks and copied seals.

**Mara reaction**

Mara squints through the lens at the counter, then at Ada.

“You have cinnamon on your sleeve.”

Ada glances down.

“That is not hidden evidence. That is breakfast.”

**Choice**

- I’ll use it carefully.

---

## Did you find anything else about the stolen crate?

**Text**

Ada pulls a ledger close and turns it around.

“Only that the stolen crate was not the only one delayed. Lamp oil, salt, dried apples, bandage cloth — ordinary things. Useful things. The kind of goods people wave through because they are boring.”

She taps a line in the ledger.

“Someone is hiding behind boring.”

Mara frowns.

“Lio says boring things are where grown-ups hide important things because children are too smart to look there.”

Ada points at her.

“Your brother has a future in accounting if he survives.”

The sentence lands heavily.

Ada’s face softens.

“When he survives,” she corrects.

Mara nods once.

“When.”

**Choice**

- We’ll look for Willow-marked cargo west of town.

---

## Ada repeat after receiving Willowmark Lens

**Text**

Ada wipes her counter with the force of someone imagining the counter is personally responsible for forged paperwork.

“Remember,” she says. “My honest mark has a nick in the lower leaf. Copied marks are often too smooth. Altered marks often have fresh scraping around the circle.”

She pauses.

“And if you find someone moving cargo under my name, tell them Ada Willowmarket considers that poor manners with legal consequences.”

**Choice**

- I’ll pass that along if they survive the embarrassment.

---

# Leaving Bramblecross

## Gate prompt

**Text**

Leave Bramblecross by the westward road? The public sign points south and east clearly, but the westward cut is marked only by an old lantern scratch half-hidden under moss.

**Choices**

- Follow the westward cut
- Stay in Bramblecross

### If player has not spoken to Enna/Hollis

**Toast**

You need the Westroot lead from Enna and Hollis before leaving.

### If player has not received Edden’s drawing

**Toast**

Edden’s drawing may help you read the road west. Visit him before leaving.

### If player has no active companion

**Toast / soft warning**

You can leave alone, but the road west is dangerous. Consider choosing a companion at the inn.

**Choices**

- Leave anyway
- Return to the inn

### If Mara has not joined the scene

**Toast**

Mara may know Lio’s personal route marks. Speak with her at the watchhouse before following the trail.

---

## Departure scene

**Text**

The westward cut does not look like a road at first.

It looks like a place where the grass has been persuaded to lean the same direction for a very long time.

Mara walks between you and the edge of the path, one hand on the blue string at her wrist. She is trying not to look too eager, which mostly makes her look like she might burst into a run if anyone says the word “careful.”

Hollis stops at the edge of town.

“Mara stays behind the line when trouble starts,” he says.

“I remember,” Mara says.

Enna hands you a folded note.

“If you find a true Westroot mark, copy it. If you find a Briar Crown mark, do not assume it means what they want you to assume. And if the road asks a question, answer slowly.”

Mara looks at her.

“Roads ask questions?”

Enna glances toward the old lantern scratch.

“Lately, I prefer roads that ask questions to signs that give orders.”

**Active companion reaction**

### Rowan active

Rowan adjusts his shield.

“Then we walk carefully and keep Mara behind us when careful is no longer enough.”

### Tilda active

Tilda grins.

“I have always wanted to argue with a road. Finally, a respectable opponent.”

### Moss active

Moss touches the mossy lantern mark.

“Old roads do not ask questions to confuse us. They ask so we remember what kind of travelers we are.”

### No active companion

The westward cut waits in silence. It does not look safer for being quiet.

**Choice**

- Step onto the Westroot Trail

---

# Old Westward Cut

## First arrival

**Text**

The westward cut slips away from Bramblecross like a secret that has been told too many times and believed by too few.

Old cart ruts appear, vanish, then appear again under grass. Lantern scratches mark stones at knee height. A few have been scraped nearly smooth. Others have fresh mud smeared over them, as if someone tried to make old truth look like ordinary dirt.

Mara crouches beside the first stone before anyone asks her to.

“Not Lio’s,” she says.

Then, after a moment:

“But someone wanted us to think it might be.”

**Choices**

- Study the scraped lantern mark.
- Ask Mara what she sees.
- Continue west.

---

## Study the scraped lantern mark

**Text**

The lantern scratch is old, but the scraping is new. Whoever damaged it did not erase the whole sign. They only blurred the lower marks: the part that would have told travelers whether the path ahead meant shelter, warning, or water.

A false crown mark has been pressed into the mud below it.

Not carved. Not permanent.

Planted.

**Active companion reaction**

### Rowan active

Rowan’s jaw tightens.

“They do not need to destroy every sign. Just enough to make people stop trusting signs at all.”

### Tilda active

Tilda pokes the mud with a stick.

“Lazy villainy. Temporary crown, permanent inconvenience.”

### Moss active

Moss studies the damaged lantern scratch.

“This is not only vandalism. It is interruption. The sign was trying to finish a sentence.”

**Choice**

- Copy the mark into your notes.

**Outcome**

XP +4

---

## Ask Mara what she sees

**Text**

Mara leans close enough that her nose nearly touches the stone.

“Lio cuts marks deeper when he is in a hurry,” she says. “This is shallow. And the arrow is too straight.”

She frowns.

“Lio says roads are allowed to wiggle because people are allowed to get tired.”

She stands and wipes moss from her sleeve.

“Whoever made this wanted Lio’s mark without knowing Lio.”

**Choice**

- That tells us something.

---

## Continue west

**Text**

The road narrows.

Ahead, three crows lift from a signpost and vanish into the trees. One drops something shiny. It lands in the grass with a soft clink.

**Choices**

- Pick up the shiny object.
- Leave it and keep moving.

### Pick up shiny object

**Text**

You find a thin curl of green sealing wax. It smells faintly of pine pitch.

The wax bears the edge of a copied crown point.

Someone sealed an order here recently, then broke it open again.

**Outcome**

Story clue gained: **Broken False Seal Wax**

XP +3

### Leave it

**Text**

You leave the wax in the grass. The road accepts your decision without comment, which is somehow less comforting than if it had objected.

---

# Roadside Shelter Nook

## First visit

**Text**

A small shelter nook sits beneath a leaning cedar, half-hidden by fern and root. It is too small for a cart and too plain for a camp, but dry leaves have been swept away from the entrance.

A true lantern mark is carved above the opening:

**SHELTER. SMALL. DRY. LEAVE KINDLING.**

Someone has left kindling.

Someone else has left a false notice nailed over the back wall.

The notice reads:

**BY CROWN ORDER: ALL WESTBOUND TRAVELERS MUST RETURN TO BRAMBLECROSS AND AWAIT SAFE COMMAND.**

The crown seal is close enough to worry a frightened traveler and wrong enough to worry you.

**Choices**

- Remove the false notice.
- Rest briefly in the shelter.
- Search for Lio’s mark.
- Leave the shelter.

---

## Remove the false notice

**Text**

The notice comes free with a dry tear.

Behind it, old writing has been scratched into the cedar wall by dozens of travelers over dozens of years:

**RAIN EAST. BRIDGE LOW. BERRIES SAFE AFTER FIRST FROST. THANK YOU FOR THE KINDLING.**

The false order had not hidden a secret.

It had hidden a hundred small kindnesses.

Mara runs one finger under the older marks.

“Lio likes these,” she says quietly. “He says road notes are proof that strangers can be useful on purpose.”

**Outcome**

Will +1 temporary blessing or HP +6 if desired.

**Choice**

- Leave the true notes visible.

---

## Rest briefly in the shelter

**Text**

You rest in the cedar shelter long enough for your breathing to settle and the road noise to become ordinary again.

Mara unwraps the pear roll, stares at it, then wraps it again.

“Emergency roll,” she explains.

**Outcome**

HP +6

---

## Search for Lio’s mark

**Text**

Mara searches the wall, then the floor, then the underside of the little cedar bench.

“There,” she says.

It is not a full message. Only a tiny hooked arrow scratched under the bench where most adults would never think to look.

The mark points west.

Mara exhales through her nose like she is trying not to become too hopeful too quickly.

“That is him.”

**Outcome**

Story flag: `foundLioShelterMark = true`

Quest update: Lio passed the shelter nook alive.

**Choice**

- We keep following him.

---

## Repeat after false notice removed

**Text**

The shelter nook feels more honest now. The false order is gone, and the cedar wall once again belongs to old traveler notes, tiny warnings, and thanks for kindling.

Mara keeps glancing at the hooked arrow beneath the bench.

“West,” she says. “Still west.”

**Choice**

- Continue.

---

# False Detour Notice

## Encounter before Three-Sign Hollow

**Text**

A fresh sign has been hammered into the road at an angle that makes it look official from a distance and desperate up close.

**WESTROOT WAY UNSAFE.**

**RETURN EAST.**

**AWAIT CROWN DIRECTION.**

The wood is new. The mud around the post is fresh. The letters are painted in a careful hand trying very hard to sound calm.

Below the words, someone has added a small crown seal.

Below that, almost hidden in the grass, is an older lantern scratch pointing onward.

**Choices**

- Inspect the crown seal.
- Inspect the old lantern scratch.
- Follow the false detour east.
- Continue west by the lantern mark.

---

## Inspect the crown seal

**Text**

The seal has the same wrongness as the marks from Chapter 1: crown points too uneven, wax smelling faintly of pine pitch, authority copied by someone who knows shape better than weight.

The sign does not explain danger.

It only commands retreat.

**Active companion reaction**

### Rowan active

“Real warnings tell you what they are protecting you from,” Rowan says. “This only wants obedience.”

### Tilda active

Tilda tilts her head. “The sign is wearing a crown costume and hoping nobody asks it to dance.”

### Moss active

Moss traces the air near the seal without touching it. “No shelter mark. No witness mark. No care for the traveler. Only command.”

**Choice**

- That is not a true warning.

---

## Inspect the old lantern scratch

**Text**

The lantern scratch is low, old, and half-filled with moss. It does not shout from the road. It waits where someone careful might find it.

Beside it are three smaller marks:

**WARNING. SHELTER WEST. WATER BELOW.**

Mara smiles despite herself.

“That sounds like a road trying to help.”

**Choice**

- Trust the lantern mark.

---

## Follow the false detour east

**Text**

You follow the false detour only a short way before the trees begin repeating themselves.

The same bent pine.

The same muddy stone.

The same beetle crawling over the same leaf with the same offended determination.

Mara stops walking.

“That beetle already judged us once.”

The detour is a loop.

Worse, it is a useful loop: frightened travelers could walk in circles until they returned to Bramblecross convinced the west road was impossible.

**Outcome**

The party returns to the false detour notice.

Optional minor penalty: extra encounter chance or HP -2 from brambles.

**Choice**

- Back to the sign. Read it properly this time.

---

## Continue west by the lantern mark

**Text**

You leave the shouting sign behind and follow the quiet mark west.

For several steps, nothing happens.

Then the moss inside the old lantern scratch warms gold at the edges, just once, like a tiny nod from the road.

Mara sees it and whispers, “Lio came this way.”

**Outcome**

XP +5

---

# The Three-Sign Hollow

## Arrival

**Text**

The road opens into a small hollow where three signs stand under a ring of leaning trees.

The first is tall, new, and painted white. A crown seal shines near the top.

The second is old, low, and carved with a lantern mark mostly hidden by moss.

The third is not a sign at all at first glance. It is a flat stone door set into the hillside, blank except for roots curling around its edges.

No handle.

No hinges.

No obvious way through.

Mara takes Edden’s drawing from her pocket and holds it beside the hollow.

“Crown,” she says, pointing to the tall sign.

“Lantern,” she says, pointing to the low sign.

Then she looks at the blank stone.

“Nothing door.”

From somewhere above, a crow laughs like it has been waiting all day for someone to say that.

**Choices**

- Inspect the Crown Sign.
- Inspect the Lantern Sign.
- Inspect the No-Handle Stone.
- Ask Mara what she thinks.
- Ask active companion for their read.

---

## Inspect the Crown Sign

**Text**

The Crown Sign is freshly painted and impressively unhelpful.

**BY ROYAL ROAD AUTHORITY:**

**WESTROOT PASSAGE CLOSED.**

**ALL TRAVELERS MUST RETURN EAST.**

**ALL QUESTIONS MUST BE BROUGHT TO PROPER OFFICIALS.**

There is no warning mark. No shelter mark. No route distance. No witness name. Nothing to help the next traveler except the command to stop being one.

The seal looks better than the earlier copies, but the wax still smells wrong.

At the bottom, in smaller letters, someone has written:

**OBEDIENCE IS SAFETY.**

**Choices**

- This sign commands, but does not guide.
- Try following its direction anyway.
- Step back.

### This sign commands, but does not guide

**Text**

The phrase feels right as soon as you say it.

The sign seems less impressive afterward. Not less dangerous, perhaps, but smaller.

Mara nods firmly.

“Lio would hate that sign.”

**Outcome**

Puzzle clue gained: Crown Sign is false.

### Try following its direction anyway

**Text**

You step toward the eastward route indicated by the Crown Sign.

The hollow shifts.

For a moment, the road behind you seems straighter than it was. Easier. Safer. A road that asks nothing except that you stop asking questions.

Then Edden’s drawing rustles in Mara’s hand though there is no wind.

The no-handle door gives one quiet knock from the inside.

Mara freezes.

“Doors should not knock,” she says.

The Crown Sign’s paint begins to drip green.

**Outcome**

Triggers optional snare encounter if desired, or returns player to puzzle with warning.

**Choice**

- Step away from the false sign.

---

## Inspect the Lantern Sign

**Text**

The Lantern Sign is old enough that the wood has gone silver. Moss covers most of the lower carvings. Someone has smeared mud across the route marks, but not carefully enough.

When you clear the moss, four marks appear:

**WARNING. SHELTER. WATER. WITNESS.**

Beneath them is a short line carved in a courier hand:

**THE STRAIGHT ROAD FORGETS THE SMALL.**

Mara stares at the sentence.

“That sounds like Lio,” she says. “He gets dramatic when he is annoyed.”

But she shakes her head.

“Not his carving. Older.”

**Choices**

- Clean the Lantern Sign fully.
- Compare it with Edden’s drawing.
- Step back.

### Clean the Lantern Sign fully

**Text**

You scrape away the last of the mud.

The lantern mark glows faintly, not enough to light the hollow, but enough to warm your fingers.

Under the mud, a route phrase appears:

**DO NOT FORCE THE CLOSED WAY. SPEAK TRUE AND WAIT.**

**Outcome**

Puzzle clue gained: The door opens by truth, not force.

XP +5

### Compare it with Edden’s drawing

**Text**

You hold Edden’s drawing beside the Lantern Sign.

The lantern in the drawing points downward. The lantern on the sign points west.

Mara turns the paper sideways, then upside down.

The roots in the drawing suddenly match the roots around the blank stone.

“Oh,” she says.

Then, more quietly:

“Oh, Edden.”

The drawing was not wrong.

It was waiting to be turned.

**Outcome**

Puzzle clue gained: Rotate/interpret Edden’s drawing to match the no-handle stone.

---

## Inspect the No-Handle Stone

**Text**

The stone door is set into the hillside so smoothly it might have grown there.

There is no handle.

No hinge.

No lock.

Only a tiny mark near the bottom, almost hidden under a root.

Mara drops to her knees.

“That’s Lio’s.”

Her voice is small enough that the hollow seems to lean closer.

A tiny hooked arrow has been scratched beside the root. Smaller than a fingernail. The arrow points not at the road, but at the blank stone itself.

Below it, there are marks in courier shorthand.

Mara reads them once silently.

Then again, with a shaking breath.

“Alive past this point,” she says. “Do not trust the straight road.”

For a moment, nobody moves.

Lio Brindle was here.

Alive.

**Choices**

- Tell Mara this is good news.
- Study the door for a way in.
- Say the old road phrase.
- Try to force the door.

---

## Choice: Tell Mara this is good news

**Text**

Mara nods too many times.

“Yes,” she says. “Yes. I know. I know it is.”

She presses her thumb beside the tiny hooked arrow, not touching it, just near enough to prove it is real.

“He came this far.”

Her voice steadies.

“Then we can come this far too.”

**Choice**

- And farther.

---

## Choice: Study the door for a way in

**Text**

You study the stone door, but there is still no handle. No keyhole. No seam wide enough for a blade.

Then you notice something strange.

The roots around the edge are not gripping the door shut. They are resting against it, like hands folded in patience.

The door is not resisting force.

It is refusing to be forced.

**Active companion reaction**

### Rowan active

Rowan lowers his shield slightly.

“Some doors are guarded by strength. This one is guarded against it.”

### Tilda active

Tilda squints at the blank stone.

“I hate to admit this, but I think the smug rock wants manners.”

### Moss active

Moss smiles faintly.

“No handle means no taking. Only receiving.”

**Choice**

- Maybe it opens to truth.

---

## Choice: Say the old road phrase

### Available after cleaning Lantern Sign or inspecting No-Handle Stone

**Text**

You stand before the no-handle door.

The hollow waits.

Not silently. Not exactly. Leaves shift. Roots creak. The old Lantern Sign gives off one faint thread of warmth.

You speak the traveler saying that has followed you from shrine to cellar to sealed door:

**A road is safest when truth walks it first.**

For a heartbeat, nothing happens.

Then Mara lifts her wrist, the blue lunch string tied around it.

“And Lio Brindle came this way,” she says. “He is not cargo. He is not a route note. He is my brother.”

The tiny hooked arrow at the base of the door glows gold.

The roots unfold.

The stone door opens inward without a sound.

**Outcome**

Puzzle solved.

Story flag: `westrootGateOpened = true`

XP +10

Optional reward: **No-Handle Token** appears inside the threshold.

---

## Choice: Try to force the door

**Text**

You press against the stone.

It does not move.

You try harder.

The stone remains exactly as impressed as stone usually is.

A root taps your boot once.

Not angrily.

Disapprovingly.

Mara folds her arms.

“Edden said no handle. I think that means no shoving.”

**Outcome**

No progress. Optional small comic beat.

**Choice**

- Fine. No shoving.

---

## Ask Mara what she thinks

**Text**

Mara looks from the Crown Sign to the Lantern Sign to the no-handle stone.

“The crown sign talks like someone who wants to be obeyed from far away,” she says.

She points to the lantern sign.

“That one talks like someone who has actually been cold on a road before.”

Then she points to the blank stone.

“And that one is where Lio would hide a message because it would annoy me to look there.”

She pauses.

“So obviously we look there.”

**Choice**

- Obviously.

---

## Ask active companion for their read

### Rowan active

**Text**

Rowan studies the three signs.

“The Crown Sign demands obedience but offers no protection. The Lantern Sign gives warning before direction. The stone door waits until we know why we are entering.”

He rests one hand on his shield.

“I trust the sign that cares what happens to the traveler.”

**Choice**

- Then we start with the quiet signs.

### Tilda active

**Text**

Tilda circles the signs with theatrical suspicion.

“Tall sign: bossy. Low sign: useful. Blank rock: deeply annoying, probably important.”

She points at the Crown Sign.

“That one wants us to stop thinking. I am personally opposed.”

**Choice**

- Then we keep thinking.

### Moss active

**Text**

Moss stands very still in the center of the hollow.

“The false sign points away from the question. The true sign teaches us how to ask it. The door waits for an answer that is not force.”

They open their eyes.

“Truth first.”

**Choice**

- Truth first.

### No active companion

**Text**

You study the signs alone. The hollow offers no easy answer, but Edden’s drawing and Mara’s attention make the pattern clearer.

The loud sign commands.

The quiet sign guides.

The blank door waits.

**Choice**

- The quiet signs matter.

---

# Optional Snare Encounter

## Trigger

This encounter can trigger if the player follows the Crown Sign, ignores the Lantern Sign repeatedly, or tries to force the door too many times. It can also trigger after the puzzle is solved if the story needs combat escalation.

## Pre-combat text

**Text**

The Crown Sign splits with a sharp wooden crack.

From the brush behind it, something moves.

A figure in a mud-brown cloak steps into the hollow, face hidden beneath a hood stitched with a crooked crown mark. Beside them, a thorn-collared hound pads low to the ground, every step careful and wrong.

The figure looks past you, straight at the no-handle door.

“That gate was not meant for you.”

Mara steps back before anyone has to tell her. She ducks behind the sheltering roots near the Lantern Sign, one hand still wrapped around the blue string.

“I am behind the line,” she says quickly. “I am extremely behind it.”

**Active companion reaction**

### Rowan active

Rowan lifts his shield.

“Good. Stay there.”

### Tilda active

Tilda draws her weapon with a grin that does not reach her eyes.

“Excellent. A villain with scheduling opinions.”

### Moss active

Moss’s expression goes quiet.

“That collar is forcing the hound. Break the command if we can.”

### No active companion

The hollow tightens around you. Mara stays behind the roots, eyes wide but steady.

**Choices**

- Break the ambush.
- Try to drive them away from the gate.
- Fall back and prepare.

---

## Battle enemies

Suggested enemies:

- Briar Roadwatcher
- Thorn-Collared Hound

Optional second wave:

- False Sign Scratcher

---

## Battle reward after victory

**Title**

Briar Roadwatcher

**Text**

The hooded roadwatcher drops a pouch of sealing wax, false nails, and thin strips of painted wood. They were not guarding treasure.

They were ready to make more signs.

Among the scraps is a half-finished order:

**KEEP WESTROOT CLOSED TO WITNESSES.**

The last word has been underlined twice.

Mara reads it and goes very still.

“Witnesses,” she says. “That means they are afraid someone saw something.”

**Loot / Rewards**

- Gold
- XP
- Pine-Pitch Wax
- Trail Snack

**Story clue**

Briar Crown agents are trying to keep witnesses away from Westroot.

---

## Repeat after clearing ambush

**Toast**

The hollow is quiet now. The Crown Sign hangs cracked and crooked, much improved by being less convincing.

---

# First Westroot Gate

## Threshold after puzzle solved

**Text**

The no-handle door opens inward onto a narrow passage sloping beneath the hill.

Gold-green light glows along the roots overhead. Not bright. Not grand. The kind of light that knows how to wait.

The air smells of wet stone, cedar, moss, and something warm enough to be soup somewhere far below.

Mara stands at the threshold but does not rush in.

For once, she waits.

The tiny hooked arrow near the base of the door still glows faintly.

Lio’s mark.

Alive past this point.

Do not trust the straight road.

**Active companion reaction**

### Rowan active

Rowan looks down the passage, shield ready but lowered.

“Lio marked the road for whoever came after him. Captive or not, he was still protecting people.”

### Tilda active

Tilda peers into the passage.

“No handle. Secret soup smell. Judgmental roots. I am furious to report that I like this door.”

### Moss active

Moss rests a hand near the glowing root, not touching it.

“The door was not closed to keep everyone out. It was waiting for someone who knew how to enter truthfully.”

### No active companion

The passage waits ahead. You feel the weight of going forward without another fighter at your side, but the old road has opened all the same.

**Choices**

- Step through the gate.
- Search the threshold first.
- Let Mara read the mark one more time.

---

## Search the threshold first

**Text**

Just inside the threshold, tucked into a root hollow, you find a small smooth stone carved with a blank door on one side and a tiny lantern on the other.

It warms when held near the open gate.

**Outcome text**

You receive **No-Handle Token**.

**Item suggestion**

No-Handle Token — Trinket. Possible bonuses: Will +1 or Wit +1. Optional skill interaction with road puzzles.

**Choice**

- Take the token carefully.

---

## Let Mara read the mark one more time

**Text**

Mara kneels beside the hooked arrow.

Her voice is quiet, but steady.

“Alive past this point. Do not trust the straight road.”

She presses her palm to the stone beside the mark.

“He knew I would find it,” she says.

Then she corrects herself.

“No. He hoped someone would. That is different.”

She stands.

“Let’s be someone.”

**Choice**

- We are.

---

## Step through the gate / Chapter end

**Text**

You step through the no-handle gate.

Behind you, the hollow remains: cracked Crown Sign, cleaned Lantern Sign, and the open stone door that did not yield to force but opened to truth.

Ahead, the passage bends downward under the roots.

Moss-lanterns glow along the walls. Some are green. Some are gold. Some flicker uncertainly, as if deciding whether to trust you yet.

Far below, something taps stone three times.

Not a threat.

Not a welcome.

A question.

Mara takes one breath, then another.

“Lio came this way,” she says.

The old road carries her words forward, under the hill, into Westroot.

**Chapter 2 Complete: The Westroot Trail**

**Outcome / Story Flags**

- `chapter2Complete = true`
- `westrootGateOpened = true`
- `lioAlivePastGate = true`
- `maraTrustInHero += 1`
- `eddensDrawingValidated = true`
- `briarCrownWatchingWestroot = true`

**Story Items**

- Edden’s Three-Door Drawing
- Willowmark Lens
- No-Handle Token, optional
- Broken False Seal Wax, optional

---

# Chapter 2 Wrap-Up Scene

## Optional short report back or transition scene

Depending on desired structure, Chapter 2 can either end immediately at the opened gate or include a brief transition where the party marks the threshold for Enna/Hollis before entering. Since Chapter 1 already had a full report-back, Chapter 2 may be stronger ending on discovery and forward momentum.

Recommended: **End at the gate opening.**

If a report-back is needed for gameplay/save-state reasons, use a short magical or practical message instead of returning to town.

### Optional Enna note drop

**Text**

Before stepping fully under the hill, you copy Lio’s mark and the no-handle symbol onto a strip of paper from Enna’s packet.

Nix Fernwhistle, who has been watching the upper road from the trees, appears long enough to take it.

“I will get this to Bramblecross,” Nix says. “You get to wherever the road just invited you.”

Mara looks at the open gate.

“Invited is one word.”

Nix grins.

“It is the polite one.”

**Choice**

- Send the update and enter Westroot.

---

# Quest Journal / Objective Text

## Main Quest: The Westroot Trail

### Step 1 — Return to the Watchhouse

**Objective title**

Return to the Watchhouse

**Objective detail**

The sealed door beneath Bramblecross pointed toward Westroot. Enna and Hollis are comparing maps and Edden’s drawings. Find out what the road west may be hiding.

---

### Step 2 — Speak with Mara Brindle

**Objective title**

Speak with Mara Brindle

**Objective detail**

Mara Brindle is Lio’s little sister. She knows his habits, marks, and courier shorthand better than anyone in Bramblecross. She may recognize clues others would miss.

---

### Step 3 — Visit Edden

**Objective title**

Visit Edden

**Objective detail**

Edden has drawn three doors beneath roots: one marked by a crown, one by a lantern, and one with no handle. His riddle may help you find the true Westroot path.

---

### Step 4 — Learn Ada’s Seal Marks

**Objective title**

Learn Ada’s Seal Marks

**Objective detail**

Ada can teach you how to recognize honest Willow Market marks and copied seals. If Willow-sealed cargo moved west, this may help you spot it.

This objective can be optional but strongly recommended.

---

### Step 5 — Follow the Westward Cut

**Objective title**

Follow the Westward Cut

**Objective detail**

The road west is nearly hidden, but old lantern marks still point beyond Bramblecross. Follow the true marks and watch for false orders.

---

### Step 6 — Read the Three Signs

**Objective title**

Read the Three Signs

**Objective detail**

At the hollow, three signs wait: a Crown Sign, a Lantern Sign, and a stone door with no handle. Edden said the honest one has no handle.

---

### Step 7 — Open the No-Handle Door

**Objective title**

Open the No-Handle Door

**Objective detail**

Lio’s hooked courier mark is scratched near the blank stone door. The message says he was alive past this point. The door will not open by force. Find the truth it is waiting for.

---

### Chapter Complete

**Objective title**

Chapter 2 Complete: The Westroot Trail

**Objective detail**

Lio survived past the Westroot gate. The old road opened when truth came first. Beneath the hill, Westroot waits.

---

# Side Thread: Ada’s Seal Lesson

## Available

**Objective title**

Ada’s Seal Lesson

**Objective detail**

Ada Willowmarket can show you how to spot copied cargo seals. Her stolen mark may be used to move false cargo through the old roads.

## Complete

**Objective detail**

Ada gave you the Willowmark Lens and taught you that honest marks often have familiar flaws. Copied marks may look too perfect.

---

# Side Thread: The Shelter Nook

## Available

**Objective title**

Restore the Shelter Nook

**Objective detail**

A false crown notice has been nailed over old traveler notes in a cedar shelter. Remove the false notice to reveal what the road was meant to remember.

## Complete

**Objective detail**

The false notice is gone. The shelter notes are visible again: warnings, thanks, and small kindnesses left by travelers for travelers.

---

# Companion-Specific Chapter 2 Notes

## General implementation

The same core story should work with any active companion or none. Companion lines should flavor interpretation, not provide mandatory information unavailable elsewhere.

## Rowan’s Chapter 2 emphasis

Rowan reads signs through protection and responsibility. He notices whether authority is actually caring for vulnerable travelers.

Key idea:

> A true warning protects. A false command controls.

## Tilda’s Chapter 2 emphasis

Tilda reads signs through suspicion, cleverness, and social mischief. She is quick to identify when something is trying too hard to look official.

Key idea:

> A lie often overdresses for the occasion.

## Moss’s Chapter 2 emphasis

Moss reads signs through old magic, patience, and memory. They understand that the road is not only a path but a listening thing.

Key idea:

> The old road opens to truth, not force.

---

# Suggested Chapter 2 Enemies

## Briar Roadwatcher

A human or humanoid Briar Crown scout assigned to monitor the Westroot gate and maintain false signs.

### Flavor

Not a bandit. More like a field agent. Calm, irritated, and trained to retreat if the mission fails.

### Possible intents

- False Command
- Mud-Slick Slash
- Signal the Brambles
- Guard the Sign

## Thorn-Collared Hound

A hound or beast controlled by a thorn collar. Not evil; commanded.

### Flavor

The hound’s movements are too sharp and unwilling. If defeated, the collar breaks and the creature flees rather than dies, keeping the tone family-friendly.

### Possible intents

- Thorny Lunge
- Harried Snap
- Collar-Frenzy

## False Sign Scratcher

A smaller enemy who alters road marks during combat or supports the Roadwatcher.

### Flavor

Carries paint, mud, carving tools, and false seal strips.

### Possible intents

- Blur the Mark
- Toss Pine Wax
- Call Wrong Turn

---

# Battle / Victory / Defeat Text Additions

## Thorn-collared creature defeated

**Text**

The thorn collar snaps with a dry crack. The hound stumbles back, shakes itself as if waking from a bad command, and bolts into the brush.

Mara watches it go.

“It did not want to be here either,” she says.

## Roadwatcher defeated

**Text**

The roadwatcher falls back, cloak torn and false seal pouch split open. They look less angry than alarmed.

“You do not know what opens when Westroot opens,” they say.

Then they flee into the trees, leaving pine-pitch wax and unfinished orders scattered behind them.

## Player defeated

**Title**

Defeat

**Text**

The hollow blurs. The Crown Sign seems taller for a moment, its command pressing down like a heavy hand.

Then the world snaps back to your last safe moment.

The old road waits.

It has not given up on you.

**Choice**

- Try again

---

# Key Chapter 2 Lines to Preserve

These lines carry the chapter’s emotional or thematic spine and should be preserved if possible:

> “If you are making a plan about my brother without me, it is probably a worse plan than it needs to be.”

> “People keep saying ‘the courier’ like he is a hat somebody misplaced. His name is Lio.”

> “The honest one has no handle.”

> “When the sign is loud, listen smaller.”

> “Some liars do not know which flaws belong.”

> “This sign commands, but does not guide.”

> “Alive past this point. Do not trust the straight road.”

> “He came this far. Then we can come this far too.”

> “A road is safest when truth walks it first.”

> “Lio came this way.”

---

# Chapter 2 Final State Summary

By the end of Chapter 2:

- Mara has joined the search as a non-combat guest.
- The player understands Mara’s relationship to Lio and why she matters.
- Edden’s disjointed drawings have become useful rather than merely ominous.
- Ada has equipped the player to recognize false cargo marks.
- The player has practiced distinguishing command from guidance.
- A Briar Crown roadwatcher has confirmed Westroot is being guarded or monitored.
- Lio is confirmed alive beyond the First Westroot Gate.
- The old Lantern Road opens to truth rather than force.
- Chapter 3 is set up: Westroot is waiting beneath the hill.

