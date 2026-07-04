# Liam's Game - NPC and Enemy Art Prompt Pack

Last updated: 2026-07-04

This is a ChatGPT-facing prompt pack for the remaining NPC and enemy art in Liam's Game so far. It is scoped from:

- `docs/asset-manifest.md`
- `docs/liams-game-art-direction.md`
- `docs/liams_game_chapter_1_story_script.md`
- `docs/liams_game_chapter_2_story_script.md`
- `docs/liams-game-chapter-2-the-westroot-trail-updated.md`
- `docs/liams_game_chapters_2_5_story_bible.md`
- `src/data/artworkPlan.ts`
- `src/data/enemies.ts`
- `src/story/chapters2to5.ts`

The current best next art move is to finish NPC portraits and enemy concepts before expanding hero variants, later maps, or UI/symbol sheets.

## How To Use This With ChatGPT

For each asset, paste:

1. The master style block.
2. One target prompt.
3. The global negative prompt.

Ask for one polished image or a small set of 2-4 variations. Do not ask for baked-in labels, UI frames, captions, or text. Export selected art as PNG, then save the best candidate with a descriptive kebab-case filename.

## Production Format

### Dialogue portraits

- Vertical half-body portrait.
- Suggested output: 1024 x 1536 or larger PNG.
- Subject should fill the frame enough to read at dialogue-card size.
- Include subtle background hints of location, but do not let the background overpower the character.
- No baked-in text.
- Save selected production portraits under `assets/portraits/characters/`.
- Suggested filename: `mara-portrait-v01.png`, `ada-portrait-v01.png`, etc.

### Enemy art

- Full creature or half-to-full figure concept.
- Suggested output: 1536 x 1536 PNG or larger.
- Prefer isolated subject with a simple painted vignette, transparent background, or very plain contextual background.
- The silhouette must read at small combat-card size.
- Keep danger readable without gore, horror, or grimdark mood.
- Enemy art can start in `assets/concept/characters/` until a production enemy-art folder is introduced.
- Suggested filename: `briar-roadwatcher-enemy-v01.png`, `bramble-boar-enemy-v01.png`, etc.

## Master Style Block

```text
Storybook fantasy illustration with a hand-drawn, hand-painted feel, subtle painterly texture, soft brushwork, gentle ink-like line definition, and a warm illustrated-book atmosphere. The image should feel handmade rather than slick or overtly digital. Use a middle-ground character style: expressive and warm, like storybook villagers and adventurers, but not overly cartoony or exaggerated. The world should feel whimsical, adventurous, and emotionally sincere, with room for gentle humor. Use a clean fantasy visual language with soft parchment-like warmth in the palette and composition. Lighting should be cinematic but painterly, with cozy glow where appropriate.
```

## Global Negative Prompt

```text
No photorealism, no 3D-rendered look, no glossy digital game art, no anime style, no harsh comic-book ink, no horror tone, no grimdark mood, no over-saturated neon colors, no overly detailed clutter, no exaggerated caricature proportions, no modern clothing, no sci-fi elements, no copyright-specific franchise resemblance, no text labels, no UI frame, no watermark.
```

## Scope Summary

### Already Available

Selected production portraits already exist for:

- Elder Mira
- Watch Clerk Enna
- Captain Hollis
- Nix Fernwhistle
- Pibble Thatch
- Rowan Reedshield
- Tilda Quickstep
- Moss Fenmere

Selected gameplay maps already exist for:

- Hearthhollow
- Lantern Road
- Bramblecross
- Old Root Cellar
- Westroot Trail

Selected Chapter 1 and Chapter 2 item icons already exist for the current playable item set, including Edden's Three-Door Drawing, Willowmark Lens, Pine-Pitch Wax, No-Handle Token, and Witness Note for Bramblecross.

### Priority A - NPC Portraits Needed Now

These are the best first character batch because they are present in current Chapter 1-2 play or central to the Chapter 2 story.

| Character | Chapter | Suggested filename | Notes |
|---|---:|---|---|
| Mara Brindle | 2 | `mara-portrait-v01.png` | Highest priority emotional portrait for Chapter 2. |
| Edden Vale | 2 | `edden-portrait-v01.png` | Chapter 2 riddle source; also resolves Chapter 1 evidence. |
| Ada Willowmarket | 1/2 | `ada-portrait-v01.png` | Chapter 1 side quest and Chapter 2 Willowmark Lens payoff. |
| Smith Orin | 1 | `orin-portrait-v01.png` | Early gear gate and Hearthhollow personality. |
| Mayor Anwen | 1 | `anwen-portrait-v01.png` | Bramblecross civic voice. |
| Nella the Baker | 1 | `nella-portrait-v01.png` | Humanizes Lio's route and Hearthhollow worry. |
| Toma Fielding | 1 | `toma-portrait-v01.png` | Hearthhollow villager flavor. |
| Miri of the Loom | 1 | `miri-portrait-v01.png` | Hearthhollow villager flavor and thread/truth motif. |
| Lio Brindle | 5, but foreshadowed earlier | `lio-portrait-v01.png` | Useful to establish now, even if his in-game reveal lands later. |

### Priority B - Enemy Art Needed Now

These enemies are in the current playable Chapter 1-2 encounter data.

| Enemy | Chapter | Suggested filename | Notes |
|---|---:|---|---|
| Bramble Boar | 1 | `bramble-boar-enemy-v01.png` | Opening action hook. |
| Thorncoat Ruffian | 1 | `thorncoat-ruffian-enemy-v01.png` | Lantern Road ambush. |
| Thorny Hound | 1 | `thorny-hound-enemy-v01.png` | Lantern Road ambush companion enemy. |
| Rustroot Skulk | 1 | `rustroot-skulk-enemy-v01.png` | Root Cellar mid-dungeon enemy. |
| Briar Knot Warden | 1 | `briar-knot-warden-enemy-v01.png` | Chapter 1 dungeon boss. |
| Briar Roadwatcher | 2 | `briar-roadwatcher-enemy-v01.png` | Chapter 2 gate watcher. |
| Thorn-Collared Hound | 2 | `thorn-collared-hound-enemy-v01.png` | Chapter 2 controlled hound. |
| False Sign Scratcher | 2 | `false-sign-scratcher-enemy-v01.png` | Chapter 2 hard encounter support enemy. |

### Priority C - Planned Chapter 3-5 NPCs

These are story-plan targets. Generate after the current Chapter 1-2 set unless you want to establish future visual identity early.

| Character | Chapter | Suggested filename | Notes |
|---|---:|---|---|
| Bramwell Gatehand | 3 | `bramwell-gatehand-portrait-v01.png` | Working Westroot gatekeeper concept. |
| Noma Greenstill | 3 | `noma-greenstill-portrait-v01.png` | Working Westroot moss-lantern or memory keeper concept. |
| Quill Pebbleturn | 3 | `quill-pebbleturn-portrait-v01.png` | Working Westroot record-keeper concept. |
| Auntie Lume | 3 | `auntie-lume-portrait-v01.png` | Working Westroot hospitality/rootbread concept. |
| Captive Porter | 4 | `captive-porter-portrait-v01.png` | Chapter 4 witness and rescue side thread. |
| Briar Relay Captain | 4 | `briar-relay-captain-portrait-v01.png` | Chapter 4 middle antagonist. |
| Bracken Voss | 5 | `bracken-voss-portrait-v01.png` | Chapter 5 cell leader and boss. |
| Briar Thornbinder | 5 | `briar-thornbinder-portrait-v01.png` | Chapter 5 workshop or secondary antagonist concept. |

### Priority D - Planned Chapter 3-5 Enemy Art

These are in the forward art/story plan. Some are already in `src/data/enemies.ts`; others are story-plan placeholders and should wait until the chapter design hardens.

| Enemy | Chapter | Suggested filename | Notes |
|---|---:|---|---|
| Briar Cargo Runner | 3 | `briar-cargo-runner-enemy-v01.png` | Story-plan target, not yet in live enemy DB. |
| Briar Relay Guard | 4 | `briar-relay-guard-enemy-v01.png` | In live enemy DB. |
| Seal-Forged Sentry | 4 | `seal-forged-sentry-enemy-v01.png` | In live enemy DB. |
| Crown Whisperer | 4 | `crown-whisperer-enemy-v01.png` | In live enemy DB. |
| Thornseal Guard | 5 | `thornseal-guard-enemy-v01.png` | In live enemy DB. |
| Thornroot Sentry | 5 | `thornroot-sentry-enemy-v01.png` | In live enemy DB. |
| Bracken Voss, combat version | 5 | `bracken-voss-enemy-v01.png` | In live enemy DB. |

### Other Art Still Needed Later

Do not start here if the goal is NPC/enemy coverage first, but keep this scope visible:

- 16 hero base variants: 8 races x male/female.
- Chapter 3 Westroot Hub map.
- Chapter 4 Riddle Road Underway map.
- Chapter 5 Briarhold Waystation map.
- Chapter 3-5 item icons.
- Lantern Road symbol sheet.
- Briar Crown symbol sheet.
- Willow seal reference sheet.
- Parchment UI panel treatment.
- Skill icon sheet.

## Recommended Generation Order

1. Mara Brindle, Edden Vale, Ada Willowmarket.
2. Briar Roadwatcher, Thorn-Collared Hound, False Sign Scratcher.
3. Bramble Boar, Thorncoat Ruffian, Thorny Hound, Rustroot Skulk, Briar Knot Warden.
4. Smith Orin, Mayor Anwen, Nella, Toma, Miri.
5. Lio Brindle and Bracken Voss as future identity anchors.
6. Westroot Chapter 3 NPC set.
7. Chapter 4-5 enemy set.

## NPC Portrait Prompts

### Mara Brindle

```text
Create a vertical half-body storybook fantasy portrait of Mara Brindle, a brave twelve-year-old girl from Bramblecross and the younger sister of missing courier Lio Brindle. She should have road dust on her boots, a blue lunch string tied around one wrist, and a wrapped pear roll held like important evidence. Her hair should look hastily pinned back and escaping in a few directions.

Mara's expression should mix stubborn bravery, worry, sharp observation, and childlike directness. She is not a fighter and should not wear battle armor. She is a protected non-combat guest who notices tiny route marks adults overlook. Include subtle Bramblecross watchhouse or map-table hints in the background: route maps, crumbs, string, a button, pinned notes, or lantern light.

Mood: emotionally central, clever, worried, bold, family-friendly, never cute in a sugary way. She should feel like a real kid trying very hard to be useful because her brother is missing.

Use the master style block.
```

### Edden Vale

```text
Create a vertical half-body storybook fantasy portrait of Edden Vale, a seventeen-year-old Bramblecross watch runner recovering in a quiet side room. He should be fast, earnest, and shaken, but not broken or horror-struck. His expression should carry fragile courage: someone who encountered an old road truth too suddenly and is trying to explain it.

Include a blue watch-runner cloth, charcoal-smudged fingers, loose sketches of three doors under roots, a cracked lantern on a small table, and simple runner gear. His clothing should be practical Bramblecross watch attire, worn and rumpled from recovery rather than heroic armor.

Mood: validated witness, anxious but brave, emotionally grounded, mysterious but not scary.

Use the master style block.
```

### Ada Willowmarket

```text
Create a vertical half-body storybook fantasy portrait of Ada Willowmarket, a practical market owner in Bramblecross. She should be sharp, efficient, organized, and protective of trust. She runs Willow Market and cares deeply about accurate weights, honest seals, and goods arriving when promised.

Show her with a ledger, green Willow Market paint, a crate stamp or three-leaf seal motif, spice jars, dried apples, lamp oil, and practical market clutter. Her expression should say she is kind enough to feed you and angry enough to audit a thief into the ground.

Mood: brisk, clever, protective, civic, warm beneath the irritation.

Use the master style block.
```

### Smith Orin

```text
Create a vertical half-body storybook fantasy portrait of Smith Orin, Hearthhollow's blacksmith. Orin should be an Emberling, one of the firepeople of Liam's Game: sturdy, practical, warm but blunt, and completely comfortable around open flame. He should read clearly as an Emberling at first glance, not as a human blacksmith lit by orange forge light.

Use visible Emberling traits: ember-orange or coal-red skin, coal-glow freckles, faint inner heat at the cheeks and knuckles, cinder-dark or flame-colored hair, and eyes that catch like banked coals. Show coal-smudged hands, a leather apron, a working hammer, and forge light behind him. He should look like someone who will not put road gear into eager hands until Elder Mira says it is time. His design should be grounded village fantasy: a fireperson who is also a working village smith, not ornate knightly armor and not a disembodied fire elemental. Include smithy details: tools, half-made hinges, warm coals, iron hooks, and rough wooden beams.

Mood: protective, no-nonsense, caring beneath gruffness, forge-warm, village-made rather than epic.

Use the master style block.
```

### Mayor Anwen

```text
Create a vertical half-body storybook fantasy portrait of Mayor Anwen of Bramblecross. She should look like a capable civic leader trying to hold a worried town together while the roads are being lied about. Her clothing should be practical but official, more town leader than noble.

Include petitions, posted notices, a town seal, ledgers, a watchhouse or civic wall background, and muted Bramblecross colors: stone gray, timber brown, parchment, and muted red. Her expression should be diplomatic, composed, tired, and aware that public fear is part of the danger.

Mood: capable, civic, exhausted but steady, responsible rather than grand.

Use the master style block.
```

### Nella the Baker

```text
Create a vertical half-body storybook fantasy portrait of Nella the Baker from Hearthhollow. Nella should be Tideborn, one of the water-people of Liam's Game: patient, warm, socially perceptive, and steady under pressure. She should read clearly as Tideborn at first glance, not as a human baker with blue jewelry.

Use visible Tideborn traits: blue, teal, or river-stone skin, subtle scale texture along the temples or forearms, fin-like ears, wavy hair like dark river reeds or seaweed, water-drop earrings, river pearls, sea-glass beads, and clothing details inspired by currents and market boats. She should still be a beloved village baker first, with no mermaid tail in the portrait and no flashy battle magic. She should be warm, practical, and worried, with flour dust on one cheek and the posture of someone who keeps baking even when the village has gone quiet. Include bakery details: pear rolls, half-shaped loaves, a warm oven glow, simple shelves, cloth-wrapped bread, and a small glimpse toward the south road or village gate. Her expression should show kindness and fear held together with everyday competence.

Mood: cozy but tense, patient, perceptive, maternal without becoming generic, ordinary courage.

Use the master style block.
```

### Toma Fielding

```text
Create a vertical half-body storybook fantasy portrait of Toma Fielding, a Hearthhollow farmer with a dry sense of humor. He should hold a rake or field tool like it might need to become a spear if the day gets worse. He is practical, skeptical, and observant, the kind of person who knows when even the turnips seem nervous.

Include garden rows, soft village greens, a fence, field baskets, and a glimpse of the road beyond the trees. His clothing should be humble village workwear with a few fantasy touches, not armor.

Mood: grounded, worried, wry, useful, protective of home.

Use the master style block.
```

### Miri of the Loom

```text
Create a vertical half-body storybook fantasy portrait of Miri of the Loom, a Hearthhollow weaver who senses when the village's threads have been tugged. She should be seated or standing near a loom or half-finished sash patterned with little lanterns. Her shuttle may be paused in midair, as if she stopped working to listen to the quiet road.

Use warm Hearthhollow light, woven textures, thread spools, cloth strips, and cottage details. Her expression should be gentle, perceptive, worried, and quietly poetic.

Mood: warm, intuitive, craft-centered, connected to the story's thread and truth motifs.

Use the master style block.
```

### Lio Brindle

```text
Create a vertical half-body storybook fantasy portrait of Lio Brindle, a South Lantern Route courier. He should be seventeen or eighteen, reliable, quick-footed, road-worn, and friendly, with a courier satchel, brass route badge, travel cloak, good boots, and practical road gear. He should feel specific and human, not just "the missing courier."

This should be a pre-rescue or remembered portrait: tired from travel but not captive, with ordinary courage and a hint of sibling humor. Include a small blue string, lunch packet detail, or subtle hooked-arrow courier mark as a personal connection to Mara.

Mood: dependable, warm, brave, expected home before noon.

Use the master style block.
```

### Worried Road Traveler

```text
Create a vertical half-body storybook fantasy portrait of a worried traveler from Lantern Road. This is a generic but memorable Chapter 1 NPC: a frightened traveler clutching a satchel too tightly, hat slightly crooked, trying not to look toward the trees.

Include road dust, a travel satchel, plain merchant or errand clothes, and a muted Lantern Road background with pines, mossy stones, or a distant camp. The character should look frightened but not comic relief, with a small touch of gentle visual humor in the crooked hat or overpacked bag.

Mood: anxious, ordinary, believable, in need of safe guidance.

Use the master style block.
```

### Bramwell Gatehand

```text
Create a vertical half-body storybook fantasy portrait of Bramwell Gatehand, a working Chapter 3 Westroot NPC concept. Bramwell is a Stonekin gatekeeper and practical craftsperson responsible for one of Westroot's old root-and-stone thresholds. He should look cautious, fair, and stubborn in a protective way.

Show stone-dusted hands, carved door tools, old hinge sketches, a lantern mark, and a half-buried Westroot doorway behind him. His design should suggest Stonekin resilience and craft without making him look like a generic dwarf or armored guard.

Mood: cautious hospitality, reliable craft, hidden-community responsibility.

Use the master style block.
```

### Noma Greenstill

```text
Create a vertical half-body storybook fantasy portrait of Noma Greenstill, a working Chapter 3 Westroot NPC concept. Noma is a Mossback memory keeper who tends moss-lanterns, old stones, and quiet witness gardens. They should feel calm, rooted, hospitable, and old-road wise without being spooky.

Include moss-lantern light, small mushrooms, braided roots, soft green-gold glow, stone markers, and gentle natural adornments. Their posture should be still and patient, as if listening to roots remember what people tried to bury.

Mood: gentle old magic, patient witness, warm hidden-road hospitality.

Use the master style block.
```

### Quill Pebbleturn

```text
Create a vertical half-body storybook fantasy portrait of Quill Pebbleturn, a working Chapter 3 Westroot NPC concept. Quill is a small, precise Westroot record-keeper who copies route marks, witness stones, and old lantern signs. They should be clever, meticulous, and a little overburdened by notes.

Include pebbles marked with tiny route symbols, parchment slips, a charcoal pencil, little stone drawers, and warm green-gold Westroot light. Avoid readable text. The design can be Stonekin, Mossback, or mixed-community, but should feel local to Westroot.

Mood: careful, busy, kind, quietly funny, keeper of small truths.

Use the master style block.
```

### Auntie Lume

```text
Create a vertical half-body storybook fantasy portrait of Auntie Lume, a working Chapter 3 Westroot hospitality NPC concept. She should feel like someone who can feed a frightened traveler, scold a council, and remember every old road courtesy. She may be a Mossback, Stonekin, or another Westroot local ancestry.

Include rootbread, soup-smoke, warm round windows set into stone and root, moss-lanterns, a sturdy apron, and practical hospitality details. She should be warm but not soft; her kindness has a backbone.

Mood: hidden-community warmth, practical care, old-road hospitality, gently formidable.

Use the master style block.
```

### Captive Porter

```text
Create a vertical half-body storybook fantasy portrait of a captive porter who escaped or was rescued from a Briar Crown relay route. This Chapter 4 witness should look tired, dirty, and wary, but not broken. They carried goods through ordinary roads before being pulled into the conspiracy.

Include a worn porter's harness, cargo straps, a torn route tag, mud, old rope marks on sleeves or gear without injury focus, and a dim old-road background. Their expression should show relief fighting with caution.

Mood: survivor, witness, ordinary worker pulled into danger, hopeful but shaken.

Use the master style block.
```

### Briar Relay Captain

```text
Create a vertical half-body storybook fantasy portrait of a Briar Relay Captain, a Chapter 4 middle antagonist. This person is not a random bandit. They are an organized field commander who manages false routes, cargo movement, and watchers for a Briar Crown cell.

Show practical dark travel clothing, a thorn-marked dispatch pouch, false seal-cloth strips, route ledgers, and a controlled expression. They should look disciplined and mission-focused, not cackling or ornate.

Mood: calm threat, bureaucratic road control, organized false authority.

Use the master style block.
```

### Bracken Voss

```text
Create a vertical half-body storybook fantasy portrait of Bracken Voss, the Chapter 5 Briar Crown cell leader. Bracken should be calm, controlled, intelligent, and convinced that fear creates safety. He does not think of himself as a villain.

Show a dark practical coat or cloak with restrained thorn motifs, a crooked Briar Crown mark, false order papers, sealing wax, and a coldly orderly workspace or waystation background. He should look like someone who weaponizes paperwork, commands, and roads, not someone who loves chaos.

Mood: false authority, controlled menace, polished but not royal, dangerous because he sounds reasonable.

Use the master style block.
```

### Briar Thornbinder

```text
Create a vertical half-body storybook fantasy portrait of a Briar Thornbinder, a Chapter 5 Briar Crown workshop specialist. This character binds thorn collars, thornseal guards, or root mechanisms for the cell. They should feel unsettling but still within family-friendly fantasy, with no gore or horror imagery.

Include thorn cord, seal wax, small carving tools, old root mechanisms, covered lanterns, and a workshop background. Their expression should be focused and defensive, as if they believe their craft imposes necessary order.

Mood: controlled craft turned wrong, thorn magic, false command, not grotesque.

Use the master style block.
```

## Enemy Art Prompts

### Bramble Boar

```text
Create a square storybook fantasy enemy concept of the Bramble Boar from Chapter 1. It should be a large wild boar tangled with brambles, road dust, burrs, and broken underbrush. A courier satchel is caught around one tusk, with a brass route badge visible but no readable text.

The boar should look dangerous and frightened, not evil. Its body language should show it has been driven into panic by someone else's plan. The image should read clearly as an opening village danger and clue delivery moment.

Mood: urgent, wild, sympathetic, dangerous without gore.

Use the master style block.
```

### Thorncoat Ruffian

```text
Create a square storybook fantasy enemy concept of a Thorncoat Ruffian from the Lantern Road ambush. The ruffian should be a fox-faced or fox-featured humanoid roadside ambusher with a thorn-stitched coat, low-held knife or short blade, road mud on boots, and a pouch of folded false orders.

The ruffian should look less like a common robber and more like someone inconvenienced by a witness finding the wrong paper. Keep the design expressive and family-friendly, with a readable silhouette and practical road gear.

Mood: sly, watchful, thorny, small-time field agent of a larger lie.

Use the master style block.
```

### Thorny Hound

```text
Create a square storybook fantasy enemy concept of a Thorny Hound from the Lantern Road ambush. The hound should look like a lean road-hound tangled with hedge thorns, briar burrs, and rough road dust. It can have bramble-like fur shapes or thorny growths, but it should still read as an animal, not a monster.

The hound should feel threatening and restless, as if trained or pressured into guarding false orders. Avoid gore, horror, or cruelty. Give it a clear combat-card silhouette.

Mood: tense, bristling, road-ambush danger, not evil for evil's sake.

Use the master style block.
```

### Rustroot Skulk

```text
Create a square storybook fantasy enemy concept of the Rustroot Skulk from the Old Root Cellar. It should be a rust-colored organic cellar creature peeling itself from roots and old stone, with jointed legs, splintered shell-like plates, root fibers, dried moss, and earthy rust-colored bark or chitin. It should not look hungry. It should look assigned.

The creature may suggest a cellar scorpion or crustacean-like skulk, but it should remain original and storybook-friendly. It should feel grown from root, stone, rust, and cellar damp, not built from metal. Avoid mechanical construct language: no rivets, armor plating, lantern machinery, clockwork joints, or tool-like parts. Include a simple earthy cellar vignette with roots and amber-green light.

Mood: organic root-cellar guardian, assigned duty, unsettling but not horror.

Use the master style block.
```

### Briar Knot Warden

```text
Create a square storybook fantasy boss concept of the Briar Knot Warden from the Old Root Cellar. It is a hulking enchanted guardian made from braided roots, rusted chain, broken boards, old iron, and forged seal-cloth. It should look like a threshold guardian whose duty has been corrupted.

Show one knotted arm raised, roots braided through rusted chain, and a strip of false seal-cloth fluttering from its chest like a badge made by someone who never understood honor. The design should be intimidating but not grotesque.

Mood: ancient, assigned, corrupted duty, guarding the sealed iron door.

Use the master style block.
```

### Briar Roadwatcher

```text
Create a square storybook fantasy enemy concept of a Briar Roadwatcher from Chapter 2. This is a human or humanoid Briar Crown field agent assigned to monitor Westroot and maintain false road signs at Three-Sign Hollow. They should read as a trained roadside operative, not a supernatural thorn guardian and not a bandit.

Give them a lean, practical silhouette: mud-brown road coat, short hood or scarf, wax-stained gloves, small knife or awl, nail pouch, folded false notices, thin sign slats tucked under one arm, pine-pitch wax pouch, and a crooked Briar Crown patch at one shoulder. Their face should be partly visible, calm and irritated, caught maintaining a lie. Pose them crouched or half-turned beside a false detour sign, watching the no-handle gate from cover.

Differentiate them from the Briar Knot Warden: no mask, no staff, no full-body vine armor, no thorn halo, no giant guardian silhouette. Thorns should appear only as practical stitching, sign fasteners, or small field tools.

Mood: watchful false authority, road spy, sign-forger, controlled threat, not a bandit.

Use the master style block.
```

Edit prompt for an existing Roadwatcher image:

```text
Edit this Briar Roadwatcher concept so it no longer resembles the Briar Knot Warden. Keep the storybook fantasy enemy style and the Chapter 2 false-road theme, but make the character a practical Briar Crown field agent maintaining false signs at Three-Sign Hollow.

Remove the staff, mask, thorn halo, heavy vine armor, and giant guardian silhouette. Make the face partly visible and human or humanoid, with a calm, irritated expression. Replace the thorn-wrapped supernatural look with mud-brown road clothes, a short hood or scarf, wax-stained gloves, a small knife or awl, nail pouch, folded false notices, thin sign slats, pine-pitch wax pouch, and a crooked Briar Crown shoulder patch.

Pose the Roadwatcher crouched or half-turned beside a false detour sign, watching the no-handle gate from cover. Thorns should be limited to practical stitching, sign fasteners, or small field tools. No readable text.
```

### Thorn-Collared Hound

```text
Create a square storybook fantasy enemy concept of a Thorn-Collared Hound from Chapter 2. This hound is controlled by a thorn collar and does not truly want to be there. It should be lean, tense, and alert, with movements that feel too sharp and unwilling.

The thorn collar should be the clear visual focus: invasive, controlling, and connected to the Briar Crown's false-command language. The hound itself should remain sympathetic. Avoid gore, horror, or cruelty. It should be clear that when defeated, the collar could break and the creature could flee.

Mood: forced danger, sympathy under threat, family-friendly combat enemy.

Use the master style block.
```

### False Sign Scratcher

```text
Create a square storybook fantasy enemy concept of a False Sign Scratcher from Chapter 2. This is a small support enemy who alters road marks during combat. They carry carving tools, paint, mud, pine-pitch wax, false seal strips, and thin sign slats.

The character should look quick, nervous, and sneaky rather than powerful. Their clothing should be practical road-worker or scout gear corrupted by Briar Crown markings. Show them mid-motion, scraping or repainting a sign, with no readable text.

Mood: irritating, quick, crafty, false guidance made visible.

Use the master style block.
```

### Briar Cargo Runner

```text
Create a square storybook fantasy enemy concept of a Briar Cargo Runner, a planned Chapter 3 enemy connected to false Willow-sealed cargo. This runner moves goods, messages, or prisoners through old-road routes under stolen trust.

Show practical running gear, stacked or strapped parcels, green wax partly covered by crooked crown wax, a route pouch, and mud from hidden roads. The character should look fast and evasive, more logistics agent than brute.

Mood: smuggler of false trust, quick, nervous, useful to a larger plan.

Use the master style block.
```

### Briar Relay Guard

```text
Create a square storybook fantasy enemy concept of a Briar Relay Guard from Chapter 4. This is a practical guard stationed at a hidden Briar relay post on the old road. The guard bars routes, protects false ledgers, and helps move controlled cargo.

Show a sturdy road shield or staff, seal-cloth straps, mud-dark gear, a crooked Briar Crown mark, and a hidden waystation or tunnel background. The guard should look disciplined and workmanlike, not flashy.

Mood: checkpoint threat, organized cell guard, false order made physical.

Use the master style block.
```

### Seal-Forged Sentry

```text
Create a square storybook fantasy enemy concept of a Seal-Forged Sentry from Chapter 4. This enemy should feel like a false order made into a guard: wax seals, parchment strips, thin wood, old route tags, and thorny binding cords animated around a sturdy central form.

It can be a small construct, armored sentry, or humanoid shape, but it must clearly communicate forged authority. Include cracked green Willow-style wax under crooked crown wax, but no readable text.

Mood: counterfeit paperwork turned dangerous, eerie but not horror, readable silhouette.

Use the master style block.
```

### Crown Whisperer

```text
Create a square storybook fantasy enemy concept of a Crown Whisperer from Chapter 4. This enemy uses fear, wrong-way murmurs, and false command rather than brute force. They should wear quiet road robes or a dark cloak with subtle thorn-crown stitching, route beads, and covered lantern charms.

The pose should suggest they are whispering to the road or to travelers' doubts. Avoid horror imagery. Their threat should come from manipulation, not gore or monster design.

Mood: soft-spoken danger, false guidance, fear as a tool, family-friendly mystery.

Use the master style block.
```

### Thornseal Guard

```text
Create a square storybook fantasy enemy concept of a Thornseal Guard from Chapter 5. This is a Briarhold Waystation guard who protects false ledgers and the thornseal workshop. The design should combine practical armor, a thorn-marked shield or baton, and strips of seal-cloth.

The guard should look heavier and more official than a roadside ruffian, but still not ornate or royal. Include dim waystation lighting, chained lantern hints, or ledger-room details in the background.

Mood: fortified false authority, disciplined, heavy, controlled.

Use the master style block.
```

### Thornroot Sentry

```text
Create a square storybook fantasy enemy concept of a Thornroot Sentry from Chapter 5. This is a root-and-briar construct or bound guardian used in Briarhold Waystation. It should be made of thorn roots, old timber, covered lantern hooks, and pieces of false seal cloth.

The sentry should feel like a darker cousin of old-road guardians: built from living road materials but bent toward control. Keep it readable, painterly, and not grotesque.

Mood: root magic under false command, sturdy, dangerous, family-friendly fantasy boss-minion.

Use the master style block.
```

### Bracken Voss, Combat Version

```text
Create a square storybook fantasy enemy concept of Bracken Voss as a Chapter 5 boss. He should be the same person as the portrait version: calm, controlled, and convinced that fear creates safety. In this combat concept, show him commanding false order magic, thornseal guards, or route-control effects.

Include crooked Briar Crown markings, false order papers, wax seals, a dark practical coat, and a waystation table or route lines under his feet. His expression should be composed rather than furious. He should feel dangerous because he believes he is right.

Mood: cellmaster boss, false authority, command against truth, not a monster.

Use the master style block.
```

## QA Checklist For Each Generated Asset

Before promoting an asset, check:

- Does it match the storybook painted style and avoid slick digital/3D/anime looks?
- Is the character or enemy readable at small in-game sizes?
- Does it avoid baked-in labels, captions, or UI frames?
- Does it preserve the family-friendly tone?
- Does it communicate the character's job or enemy role through silhouette, props, and posture?
- For portraits, does the crop leave room for dialogue UI and still show face, upper body, and key props?
- For enemies, does the silhouette clearly differ from the other enemies in the same chapter?
- Is the file size reasonable for web use after export/compression?
