# Chapter 3 Production Art Prompt Pack

Use this with ChatGPT image generation for **Chapter 3: The Hidden Root**.

The full Chapter 3 story script is the delivery source of truth. The current playable Westroot loop is a technical vertical slice, not permission to abbreviate the Rootbread Promise, Cargo Siding evidence, Split Hall resolution, or Mossgarden closing. This pack replaces the Chapter 3 fragments in the older NPC/enemy prompt pack with implementation-ready prompts, corrects the Seal-Forged Sentry to Chapter 3, and separates current production needs from ideas that should wait for a code/story decision.

## What Chapter 3 Already Has

- The selected Westroot Hub gameplay map is already in production as `assets/maps/westroot-hub-map-v01.webp`. Do **not** generate another map unless playtesting shows that this map must be replaced.
- Mara Brindle, Lio Brindle, Ada Willowmarket, and the player/companion portraits already exist. Do not regenerate them for Chapter 3.
- Emoji and text fallbacks are intentional and stay in place until selected art is wired into the app.
- The full Rootbread Promise must eventually include Auntie Lume, the sealed hatch, the Westroot child, and Mara finding Lio's blue-thread knot. The current direct hatch reward is a temporary implementation shortcut.

## Generation Order

Generate one asset per request. The batches below are grouped so a selection decision in one group does not require regenerating another. They contain 16 current production candidates; none needs to be padded to ten images.

| Batch | Assets | Why it comes first |
|---|---:|---|
| A — Cast and encounter | 7 | Covers every new speaking role and the Chapter 3 battle. |
| B — Reward icons | 3 | Covers the full-script reward/evidence items. |
| C — Story scenes | 6 | Adds illustrated dialogue moments after the portraits/enemies have a consistent visual identity. |

## Production Rules

- Save raw generations first under `assets/reference/source-art/` or a Chapter 3 reference subfolder. Do not place every candidate into a shipped asset folder.
- Promote selected opaque portraits, enemies, and scenes through the normal optimization flow. Runtime assets should ultimately be WebP; source art can remain PNG.
- Item icons need a real alpha channel. Never accept a painted or fake checkerboard as transparency.
- Keep baked-in words, labels, logos, watermarks, UI frames, and readable signs out of every image. Route symbols may be simple, non-text pictograms.
- A selected portrait/enemy/icon still needs a small wiring change in the appropriate art registry; keep its emoji fallback.
- If an image uses Mara, attach the selected Mara portrait as a visual reference when possible. She is twelve, is a protected non-combat guest, and wears a blue string around one wrist.
- Before every Stonekin generation, attach the approved Stonekin player-character samples. Before every Mossback generation, attach the approved Mossback samples. Treat those images as required ancestry references: keep their face, material, silhouette, and color-language consistent while creating an individual new character rather than a duplicate.
- When a scene includes Stonekin or Mossback characters, attach the corresponding approved ancestry samples as references too. Do not rely on text alone for those designs.

## Shared Style and Negative Blocks

Paste the appropriate style block and negative block before each individual prompt.

### Portrait and enemy style

```text
Storybook fantasy illustration with a hand-drawn, hand-painted feel, subtle watercolor and gouache texture, soft brushwork, gentle ink-like edge definition, and a warm illustrated-book atmosphere. Use a middle-ground character style: expressive and emotionally sincere, but not cartoony or exaggerated. The world is whimsical, adventurous, and family-friendly, with a cohesive old-road fantasy visual language and soft parchment-like warmth. Lighting is cinematic but painterly, with cozy glow where appropriate. The image should look handmade rather than slick or overtly digital.
```

### Item-icon style

```text
Custom storybook fantasy item icon for Liam's Game. Paint one centered object as a warm hand-painted illustration with subtle brush texture, gentle ink-like definition, and a cozy adventure tone. It must be readable at 40 to 64 pixels, look like bespoke game artwork rather than stock vector art, and be isolated on a true transparent background.
```

### Scene style

```text
Hand-painted storybook fantasy scene illustration for Liam's Game. Use warm watercolor and gouache texture, gentle ink-like edge definition, subtle paper grain, and a middle-ground family-friendly fantasy style. The scene should feel emotionally specific and lived-in rather than like a poster, a cinematic still, or a dark fantasy illustration. Compose with clear negative space and balanced contrast so it can sit cleanly inside a dialogue panel.
```

### Global negative prompt

```text
No photorealism, no 3D-rendered look, no glossy digital game art, no anime, no harsh comic-book ink, no horror, no gore, no grimdark mood, no neon palette, no modern clothing or objects, no sci-fi, no exaggerated caricature proportions, no generic dwarf stereotype, no copyright-specific franchise resemblance, no readable text, no labels, no UI frame, no logo, and no watermark.
```

---

# Batch A — Cast and Encounter Art

Generate these seven first. Portraits should be opaque vertical 2:3 images, ideally 1024 x 1536 or larger. Enemies should be opaque square images, ideally 1536 x 1536 or larger, with a clear full-figure combat-card silhouette.

## A1. Bramwell Gatehand

**Suggested source filename:** `bramwell-gatehand-portrait-v01.png`<br>
**Target runtime folder:** `assets/portraits/characters/`

```text
Create a vertical half-body portrait of Bramwell Gatehand, the Stonekin keeper of the First Westroot Gate in Chapter 3 of Liam's Game. Bramwell is broad-shouldered and visibly made of stone, but he is not a dwarf, a soldier in plate armor, or a generic fantasy guard. He is an older practical craftsperson and gatekeeper: cautious, tired, fair, and stubborn in a protective way.

Give him a slate-colored work coat, stone-dusted hands, a heavy practical key ring with one small key still warm with gold-green gate light, a hinge tool, and a folded threshold sketch. Behind him, suggest a half-buried oval root-and-stone Westroot doorway and fitted gray-stone bridgework. His face should be weathered and attentive, with the expression of someone deciding whether strangers are a danger or a responsibility. He is not hostile and should not look royal, militaristic, or grim.

Mood: cautious hospitality, dependable craft, hidden-community responsibility, a protective person learning that a shield can become a wall.
```

## A2. Noma Greenstill

**Suggested source filename:** `noma-greenstill-portrait-v01.png`<br>
**Target runtime folder:** `assets/portraits/characters/`

```text
Create a vertical half-body portrait of Noma Greenstill, the Mossback memory-keeper of Westroot's Mossgarden in Chapter 3 of Liam's Game. Noma is calm, observant, gender-neutral in presentation, warmly rooted, and old-road wise without being mystical for its own sake or spooky.

Make their Mossback ancestry clear through living moss, bark-soft texture, small braided roots, and gentle natural adornments rather than a costume or a monster design. Show Noma kneeling or standing beside a shallow stone water channel, old witness tablets, a soft gold-green moss lantern, and a small cup or brush used to clean old route marks. Their expression should be patient and firm: a person who knows the difference between fear and evidence, and makes room for both.

Mood: patient witness, community care, gentle old magic, clear-eyed hospitality. Use moss green, lantern gold, warm stone gray, and restrained earth tones.
```

## A3. Quill Pebbleturn

**Suggested source filename:** `quill-pebbleturn-portrait-v01.png`<br>
**Target runtime folder:** `assets/portraits/characters/`

```text
Create a vertical half-body portrait of Quill Pebbleturn, a young Stonekin craftsperson and record-keeper in Westroot's Rootmarket in Chapter 3 of Liam's Game. Quill is small, clever, precise, curious about surface inventions, a little overburdened by notes, and quietly funny. They should not look like a generic tiny dwarf or a fantasy librarian stereotype.

Show Quill repairing a small brass lantern shutter with a tiny exacting tool while holding or surrounded by non-readable route-symbol pebbles, charcoal slips, and a compact stone drawer of repair parts. Include Rootmarket details in soft focus: a modest awning, jars, a carved stone toy, a rain barrel, warm root-and-stone architecture, and gold-green moss-lantern light. Their face should look focused first, then surprised and amused to notice an unexpected guest.

Mood: practical intelligence, local optimism, careful engineering, keeper of small truths. Keep the silhouette and hands clear enough to read in a dialogue card.
```

## A4. Auntie Lume

**Suggested source filename:** `auntie-lume-portrait-v01.png`<br>
**Target runtime folder:** `assets/portraits/characters/`

```text
Create a vertical half-body portrait of Auntie Lume, the Mossback cook and herbalist of Westroot in Chapter 3 of Liam's Game. Lume feeds a frightened traveler before deciding whether she trusts them, but never confuses hospitality with naivete. She is warm, brisk, lightly formidable, and the person who can scold a council without raising her voice.

Make her Mossback ancestry readable through welcoming moss, bark-soft texture, and a mossy brow tied back with a mustard-yellow scarf. Give her a sturdy practical apron with flour on the sleeves, a just-baked rootbread loaf or warm bread heel, a kettle steaming beside her, dried apples, cups of water, and a softly lit stone-and-root kitchen window. Avoid a witchy silhouette or a cute grandmother caricature; she should feel like an active keeper of Westroot's Rootbread Promise.

Mood: practical care, hidden-community warmth, old-road hospitality with a backbone. Use rootbread amber, moss green, lantern gold, and warm stone.
```

## A5. Rootbread Promise Child

**Suggested source filename:** `westroot-rootbread-child-portrait-v01.png`<br>
**Target runtime folder:** `assets/portraits/characters/`

```text
Create a vertical half-body portrait of a small Mossback child from Westroot for the Rootbread Promise in Chapter 3 of Liam's Game. The child has been quietly leaving rootbread, dried apple, and water at a sealed hatch because somebody on the other side once knocked. They are not a comic sidekick or a fantasy mascot. They are scared of being in trouble, chin lifted in genuine bravery, and proud that they did the careful kind thing without opening the door.

Make their Mossback ancestry clear and consistent with the attached approved Mossback player-character samples, while keeping them recognizably young and distinct from Noma and Auntie Lume. Give them simple practical Westroot clothes, a small cloth food bundle or waxed-leaf cup, a few crumbs, and a nearby barrel or root-wrapped hatch in soft focus. Their expression should combine caution, sincerity, and a child's determined courage.

Mood: small kindness with a boundary, honest worry, practical courage, old-road hospitality passed to the next generation. No magic effects, no tragedy pose, and no exaggerated cuteness.
```

## A6. Briar Cargo Runner

**Suggested source filename:** `briar-cargo-runner-v01.png`<br>
**Target runtime folder:** `assets/portraits/enemies/`

```text
Create a square full-figure storybook fantasy enemy portrait of a Briar Cargo Runner for Chapter 3 of Liam's Game. This is a hooded human or humanoid logistics operative moving goods, messages, and people through old-road routes under stolen trust. They are quick and evasive, not a brute, not a bandit, and not a supernatural thorn guardian.

Show a lean runner caught in motion beside low stacks of crates and old rail grooves. Give them practical mud-dark travel clothes, a short hood or scarf, a strapped parcel and route pouch, wax-stained gloves, and a small emergency pouch of crown-red powder. A green three-leaf cargo seal should be partly covered by crooked crown-red wax, but it must not contain readable text. Their face should be partly visible with a focused, uneasy look: someone who believes an order is safer than a question.

Use a simple Westroot Cargo Siding vignette with fitted stone, roots, and covered moss lanterns. Keep the character's silhouette clean and readable at small combat-card size. Mood: false trust in motion, organized road smuggling, quick controlled threat.
```

## A7. Seal-Forged Sentry

**Suggested source filename:** `seal-forged-sentry-v01.png`<br>
**Target runtime folder:** `assets/portraits/enemies/`

```text
Create a square full-figure storybook fantasy enemy portrait of the Seal-Forged Sentry from Chapter 3 of Liam's Game. It is forged authority made physical: a sturdy humanoid sentry form assembled from wax seals, torn order sheets, thin wood, old route tags, and thorn cord. It should look like counterfeit paperwork trying to stand upright by force, not like a robot, a suit of metal armor, or a horror creature.

Give it a readable central body with a wax-sealed chest, one arm raised as if stamping a command, parchment strips fluttering like a false uniform, thin wooden slats for bracing, and tightly bound thorn cord. Include cracked green Willow-style wax peeking out from under crooked crown-red wax. The background should be a restrained Cargo Siding vignette of stone rail grooves, roots, crates, and covered lamps. Do not include any readable orders, letters, or symbols.

Mood: counterfeit paperwork turned dangerous, eerie in a family-friendly way, constructed false authority, clear combat silhouette. Avoid gore, rotting paper, body horror, mechanical rivets, and excessive red.
```

---

# Batch B — Reward Item Icons

Generate the three icons that support the full Chapter 3 script. Each must be a square 768 x 768 or 1024 x 1024 PNG with a true transparent background and generous clear edges.

## B1. Rootbread Charm

**Suggested source filename:** `rootbread-charm-icon-v01.png`<br>
**Target runtime folder:** `assets/icons/items/`

```text
Create a custom storybook fantasy item icon for the Rootbread Charm from Chapter 3 of Liam's Game. Paint a small handmade Westroot hospitality charm: a warm amber rootbread-shaped token wrapped in a simple braided root-and-blue-thread loop, with a tiny cloth tie and a faint soft lantern warmth. It should feel like a promise to feed the next traveler, not like a full meal, a bakery logo, or a magical artifact of great power.

Center the single object prominently on a true transparent background. Give it a clean, memorable silhouette and enough material detail to read as bread, thread, and a humble keepsake at small UI size. No lettering, no fake checkerboard, no plate, no table, and no scene background.
```

## B2. Witness Stone Rubbing

**Suggested source filename:** `witness-stone-rubbing-icon-v01.png`<br>
**Target runtime folder:** `assets/icons/items/`

```text
Create a custom storybook fantasy item icon for the Witness Stone Rubbing from Chapter 3 of Liam's Game. Paint one small curled parchment rubbing, held by a subtle stone weight or a short piece of charcoal. The parchment should show four clear non-text pictograms in a simple row or circle: a hand for witness, an outward lantern for warning, a roofline beneath a root for shelter, and a cup beside a spring mark for water. The marks must be symbols only, with no readable words.

Center the parchment as a single object on a true transparent background. Use charcoal gray, soft parchment cream, faint moss green, and a small gold lantern accent. It should read immediately as a precious field record rather than a generic treasure map. No lettering, no fake checkerboard, no frame, and no full scene.
```

## B3. Cargo Transfer Tag

**Suggested source filename:** `cargo-transfer-tag-icon-v01.png`<br>
**Target runtime folder:** `assets/icons/items/`

```text
Create a custom storybook fantasy item icon for a Cargo Transfer Tag from Chapter 3 of Liam's Game. Paint a small, battered true-courier route tag tied to a short length of blue courier string. The tag is official enough to be useful but visibly worn from moving through hidden roads: thick parchment board, a brass eyelet, clipped corners, rubbed green seal residue, a little crown-red wax dust, and a dark graphite route notch.

Use only non-readable marks, route notches, and simple pictograms. The object should communicate that a real courier was treated as cargo and that the route points west, without using letters or words. Center it on a true transparent background with a strong silhouette and a little painterly wear. No map behind it, no hand holding it, no fake checkerboard, no UI frame, and no readable text.
```

---

# Batch C — Optional Illustrated Dialogue Scenes

These six scenes make Chapter 3 fully illustrated, but the current code does not yet import or display Chapter 3 scene images. Generate them after Batch A so facial and ancestry details stay consistent, then wire selected images once the full narrative flow is implemented and human-playtested. Use opaque 16:9 images, ideally 1920 x 1080 or larger.

## C1. Westroot Arrival

**Suggested source filename:** `westroot-arrival-scene-v01.png`<br>
**Target runtime folder:** `assets/scenes/`

```text
Create a 16:9 hand-painted storybook fantasy dialogue scene for Chapter 3 of Liam's Game: the first view of Westroot from just inside the First Westroot Gate. Use a character-neutral point of view from an old fitted-stone bridge, looking into a broad inhabited cavern beneath a green hill.

Show root-wrapped stone homes, modest balconies, warm gold-and-green moss lanterns with a few small shutters, a Rootmarket shelf below, water channels, fitted gray-stone terraces, and townspeople who have paused their practical work to look toward the newly opened gate. The community should feel cautious but warmly real, not like a dungeon, mine, palace, or fantasy capital. Leave the foreground bridge and central walking space visually calm; there should be no visible player party or character closeup.

Use warm stone gray, bark brown, moss green, lantern gold, and minimal invasive crown-red. No text, signs, labels, or UI symbols.
```

## C2. Witness Stones

**Suggested source filename:** `witness-stones-scene-v01.png`<br>
**Target runtime folder:** `assets/scenes/`

```text
Create a 16:9 hand-painted storybook fantasy dialogue scene for Chapter 3 of Liam's Game: the Witness Stones in the Mossgarden of Remembering. In a shallow circular stone water channel, show four worn standing stones with clear non-text carvings: a hand, an outward lantern above a broken bridge, a roof beneath a root, and a cup beside a spring mark. A fifth newer crooked slat or plaque with a thorn-crown-like mark has been crudely nailed over part of the oldest stone.

Frame the stones with pale moss, small tablet markers, gentle roots, quiet water, and sheltered gold-green lantern light. The composition should make the four true road needs legible without turning into a game puzzle UI. A Mossback hand holding a small cleaning brush may appear at the edge, but do not make this a character portrait. It must feel like an old community lesson about witness, warning, shelter, and water.

No readable text, labels, numbers, or glowing magical runes. Avoid heavy fog, ominous horror, or excessive false-authority red.
```

## C3. Cargo Siding Evidence

**Suggested source filename:** `cargo-siding-evidence-scene-v01.png`<br>
**Target runtime folder:** `assets/scenes/`

```text
Create a 16:9 hand-painted storybook fantasy dialogue scene for Chapter 3 of Liam's Game: the moment false cargo is exposed in the Westroot Cargo Siding. Show a real village work space beneath the hill: fitted stone floor, shallow old rail grooves, roots around support pillars, covered moss lanterns, tidy crate stacks, and an open crate in the foreground.

Inside the opened crate, show blank official-sized papers, seal tools, thorn-collar fittings wrapped in waxed cloth, small route-tag scraps, and a true courier pouch. The crate's green three-leaf wax seal has been tampered with using pine pitch and a thin wash of crooked crown-red wax, but include no readable writing. A Stonekin craftsperson's hand or boot can be at the edge of frame to suggest investigation, but do not show the combatants yet.

Mood: concrete evidence, violated trust, tense but not horror. Keep the main evidence clearly visible and reserve red as a small invasive accent only.
```

## C4. Split Hall Resolution

**Suggested source filename:** `split-hall-resolution-scene-v01.png`<br>
**Target runtime folder:** `assets/scenes/`

```text
Create a 16:9 hand-painted storybook fantasy dialogue scene for Chapter 3 of Liam's Game: Westroot's community resolution in Split Hall. The room is a broad, practical hall of fitted stone, mismatched benches, lanterns, and a long table repaired so often that the repairs have become its decoration. It is not royal and not a courtroom.

At the table, arrange non-text evidence: the Witness Stone Rubbing, the broken false crown slat, a copied gate-account mark, and false cargo materials. Bramwell Gatehand and Noma Greenstill stand on opposite but respectful sides of the table, both serious and heard rather than framed as enemies. Auntie Lume sets a basket of warm rootbread at the table while ordinary Westroot residents begin to take pieces. Mara may appear at one side with her blue wrist string, offering half a piece of bread to a nearby gatekeeper.

Mood: practical reconciliation after hard evidence, watched openness, a community choosing clear warning and care over isolation. No readable text, banners, speeches, or dramatic cheering.
```

## C5. Mossgarden Closing Mark

**Suggested source filename:** `mossgarden-closing-mark-scene-v01.png`<br>
**Target runtime folder:** `assets/scenes/`

```text
Create a 16:9 hand-painted storybook fantasy dialogue scene for the closing of Chapter 3 of Liam's Game. In the quiet Mossgarden at night, Mara Brindle kneels beside a shallow clear water channel, both hands holding the blue string around one wrist. Noma Greenstill carefully brushes moss aside from a small non-text courier mark scratched into stone. The mark should look like a practical hooked route symbol, not readable writing.

Show pale moss, old name tablets, fitted stone, and a line of gold moss-lanterns gradually brightening along a westward passage. Mara is twelve, brave and overwhelmed but not melodramatic; she wears travel clothes and no armor, and remains clearly a protected non-combat guest. Noma is calm beside her, offering room rather than consolation. The image should feel hopeful because the road has been seen, not because the danger is over.

Mood: intimate, restrained hope, a small useful truth discovered in a hidden place. No readable message, no text, no spectacle, and no ominous darkness swallowing the scene.
```

## C6. Rootbread Promise

**Suggested source filename:** `rootbread-promise-scene-v01.png`<br>
**Target runtime folder:** `assets/scenes/`

```text
Create a 16:9 hand-painted storybook fantasy dialogue scene for the Rootbread Promise in Chapter 3 of Liam's Game. At a sealed door-sized hatch in a root-and-stone Westroot passage, show a small cloth bundle of warm rootbread, dried apple, and a cup of water covered by waxed leaf. Beneath the cup lies a short blue thread tied in a tiny hooked courier loop. Mara Brindle kneels beside it, carefully noticing the knot without touching it yet.

At the edge of the scene, a small Mossback child steps carefully from behind old barrels, holding their breath and expecting to be scolded. Mara is twelve, wears travel clothes and the blue string at her wrist, and is not in armor. The hatch remains sealed; care is shown through food and a boundary, not through opening a dangerous door. Use warm lantern gold, rootbread amber, quiet moss green, fitted stone, and soft shadows.

Mood: small practical kindness, emotional evidence without melodrama, food as an answer, a promise that gives the next traveler farther to walk. No readable note, lettering, labels, or magical spectacle.
```

---

# Defer Until the Game Needs Them

Do not spend a generation on these yet. They are described in the broader story draft but are not currently granted, rendered, or required by the Chapter 3 playable loop.

| Candidate | Why it waits |
|---|---|
| Lio's Courier Knot icon | It is a later-plan item. The Chapter 3 Rootbread scene references the blue thread, but it does not grant an item. |
| Seven Westroot map-token images | The painted map already visually depicts these landmarks. Adding separate tokens should follow a deliberate MapStage/UI decision, not precede it. |
| Replacement Westroot map or Cargo Siding inset map | Generate only if map playtesting proves the existing hub cannot support the route or the battle clearly. |

## After a Candidate Is Selected

1. Keep the source image in the reference/source-art tree and use the suggested filename.
2. Promote only the approved asset into its runtime asset folder.
3. Add a registry import and the fallback-safe mapping: dialogue portrait data for characters, `ENEMY_DB` for combat art, `ITEM_ARTWORK` for icons, and `sceneImage` wiring for scenes.
4. Update `docs/asset-manifest.md` and `src/data/artworkPlan.ts`.
5. Run `npm.cmd run optimize:assets`, `npm.cmd run audit:assets`, the Chapter 3 playtest, the Chapter 1/2 regression playtests, and the production build.
