# Dialogue Stock Icon Replacement Prompt Pack

Use this document with ChatGPT image generation to replace the remaining generic dialogue symbols in Liam's Game. Generate **one asset per request**. Do not ask for all of them in a single contact sheet.

The implementation audit and reuse plan live in `docs/planning/dialog-stock-icon-replacement-plan.md`. Most dialogue art should come from existing portraits, enemies, scenes, and map crops. This pack is deliberately limited to the few missing masters that add real story value.

## Generation Order

| Priority | Asset | Why |
|---|---|---|
| 1 | Courier Satchel Evidence | Replaces the especially generic scroll in the first major mystery reveal. |
| 2 | Bramblecross Watchhouse Case Wall | One master covers the evidence board, duty ledger, wall map, forged orders, and briefing recaps. |
| 3 | Root Cellar Evidence Wall | One master covers the recent Root Sigil and the much older Route Mural. |
| 4 | Briar Crown Primary Mark | Gives the antagonist's identity a consistent bespoke visual instead of a crown emoji. |
| 5 | Willow Market Seal on Crate | Establishes Ada's trusted cargo mark clearly enough for the Watchhouse clue card and later Willow-marked cargo. |

Generate the optional prompts only if an in-game crop from the existing map fails visual QA.

## Reference Images to Attach

When ChatGPT allows image references, attach the relevant files with the prompt:

- Overall style: `assets/maps/hearthhollow-gameplay-map-v04.webp`
- Courier Satchel: `assets/portraits/enemies/bramble-boar-v01.webp`
- Bramblecross architecture and palette: `assets/maps/bramblecross-town-map-v02.webp`
- Watchhouse characters, if any figures appear: `assets/portraits/characters/enna-portrait-v02.webp` and `assets/portraits/characters/hollis-portrait-v01.webp`
- Willow Market seal and cargo: `assets/portraits/characters/ada-willowmarket-portrait-v01.webp` and `assets/maps/bramblecross-town-map-v02.webp`
- Root Cellar materials and palette: `assets/maps/root-cellar-map-v01.webp`
- Briar Crown context: `assets/scenes/crown-door-closeup-v01.webp` and `assets/portraits/enemies/briar-roadwatcher-v02.webp`

Treat the references as continuity anchors, not as images to copy literally. The new work should feel painted by the same illustrator.

## Shared Style Block

Paste this before each individual prompt:

```text
Create a hand-painted storybook fantasy illustration for Liam's Game. Match the attached production art: warm watercolor and gouache texture, gentle ink-like edge definition, subtle paper grain, soft natural brushwork, and a cozy but adventurous illustrated-book atmosphere. The image should feel handmade, emotionally specific, and lived-in rather than glossy, cinematic, or like stock game art. Use clear silhouettes and controlled contrast so the important subject remains readable when the image is displayed inside a dialogue panel.
```

## Global Negative Block

Paste this after each individual prompt:

```text
No photorealism, no 3D render, no glossy digital game art, no anime, no modern objects, no sci-fi, no grimdark, no horror, no gore, no generic stock icon treatment, no emoji styling, no clip art, no vector-logo finish, no UI panel, no border, no caption, no label, no watermark, and no readable words or letters. Do not imitate a copyrighted franchise. Keep the tone family-friendly and painterly.
```

---

# Current Production Masters

## A1. Courier Satchel Evidence

**Suggested source filename:** `courier-satchel-evidence-scene-v01.png`
**Target runtime filename:** `assets/scenes/courier-satchel-evidence-scene-v01.webp`
**Format:** opaque 16:9 landscape, ideally 1920 x 1080 or larger

Attach the Bramble Boar artwork as a subject reference, then use the shared style and negative blocks with this prompt:

```text
Paint a close, tabletop-like evidence composition immediately after the Bramble Boar encounter in Hearthhollow. The central subject is Lio Brindle's scuffed brown leather courier satchel, dusty and slightly twisted from being caught around one boar tusk but still intact. Arrange the story clues naturally around and partly inside it: a small worn brass courier badge, a folded false order closed with a crooked crown-shaped dab of reddish pine-pitch wax, and a humble lunch packet tied carefully with unmistakable blue string. A pear-roll corner or a few crumbs may peek from the packet.

Set the evidence on dusty village ground near the south gate with soft morning light and a restrained suggestion of brambles at the edge. The boar itself should be absent or only an indistinct out-of-focus shape far at the edge; the scene is about the evidence and the person who expected to reach home, not a defeated animal. Make the satchel, badge, false wax seal, and blue string readable at dialogue-panel size. Leave some calm negative space near the upper edge for the dialogue title, but do not paint any UI.

The badge may have a simple lantern-route pictogram, but no readable name or letters. The folded order may show faint non-text line marks only. Mood: the excitement has stopped, a personal clue has made the danger suddenly serious, and an ordinary packed lunch is the most upsetting detail.
```

### Selection check

- The satchel reads first, not the paper.
- The brass badge, crooked wax, and blue string are distinct at small size.
- There is no readable name or order text baked into the image.
- The scene is poignant but not grim or violent.

## A2. Bramblecross Watchhouse Case Wall

**Suggested source filename:** `bramblecross-watchhouse-case-wall-scene-v01.png`
**Target runtime filename:** `assets/scenes/bramblecross-watchhouse-case-wall-scene-v01.webp`
**Format:** opaque 16:9 landscape, ideally 2560 x 1440 or larger so focused crops remain sharp

Attach the Bramblecross map and the Enna and Hollis portraits, then use the shared style and negative blocks with this prompt:

```text
Paint the working evidence wall and investigation table inside the Bramblecross Watchhouse. Compose one coherent high-resolution scene with four visually distinct zones that can later be cropped separately:

1. On the left, a dense evidence board with small road sketches, scraps of false notices, plain pins, wax fragments, and red string connecting Hearthhollow, Lantern Road, Bramblecross, and the old root cellar.
2. In the lower foreground, an open duty ledger with altered route marks, backward corrections, an inkpot, and a clerk's narrow pen.
3. On the right, a large worn wall map showing public roads, older half-erased passages, a western route, colored pins, and several circled trouble points using symbols rather than words.
4. Near the ledger, a tied file of copied forged orders with crooked red crown wax laid over hints of older green Willow wax.

The room should feel practical, modest, and actively used: fitted timber and stone, lantern-warm light, rain-dark coats on pegs, spare paper, a mug gone cold, and the contained urgency of people finally seeing a pattern. Enna and Captain Hollis may appear only as subtle partial figures at the edge or as hands working with the evidence; do not make this a character portrait. Keep every important object unobstructed and avoid tiny decorative clutter that turns muddy in a dialogue crop.

No readable place names, sentences, or letters. Use route pictograms, scratches, seal shapes, pins, line work, and color relationships to imply the investigation. Mood: ordinary civic systems have been made to lie, and careful people are making them tell the truth again.
```

### Crop plan

- Full frame: The Case Wall Changes, Bramblecross Watchhouse, and Westroot Briefing.
- Left half: Evidence Board.
- Lower center: Duty Ledger.
- Right half: Wall Map.
- Lower-right detail: Forged Orders File.

### Selection check

- All four crop zones are recognizable without readable words.
- The evidence wall is the hero of the scene, not Enna or Hollis.
- Red string communicates connection without looking like a detective-story parody.
- The map and papers look handmade and old-road appropriate, not modern.

## A3. Root Cellar Evidence Wall

**Suggested source filename:** `root-cellar-evidence-wall-scene-v01.png`
**Target runtime filename:** `assets/scenes/root-cellar-evidence-wall-scene-v01.webp`
**Format:** opaque 16:9 landscape, ideally 2560 x 1440 or larger

Attach the Root Cellar map, then use the shared style and negative blocks with this prompt:

```text
Paint one old stone wall inside the Root Cellar beneath Bramblecross, designed as a high-resolution evidence scene with two clearly separable visual histories.

On the left, show a recent, deliberate Root Sigil painted in dark green pigment over the old stone. It should combine a gripped or bound root shape with a road being bent away from its true path. The mark is fresh enough to look invasive and purposeful, with a few sticky brush edges and a faint suggestion of pine-pitch binder. It is not a magical glowing rune and not a beautiful sacred symbol.

On the right, show a much older faded Route Mural painted generations earlier in warm mineral colors. It should connect simple non-text pictograms for storehouses, root cellars, roadside markers, food stores, and branching underground passages. One old westward tunnel symbol has been scratched over repeatedly until the damaged area is darker than the surviving paint. The mural should feel communal and useful, made by people explaining how the town and old road once fit together.

Use cellar lantern light, damp fitted stone, roots entering through mortar, and restrained amber-green reflections. Keep the recent sigil and old mural visually distinct enough that separate dialogue crops can focus on either one. No characters are necessary. Do not include the written phrases from the dialogue; communicate them through shapes and let the game text provide the words.

Mood: a recent campaign of misdirection painted over a much older memory of connection.
```

### Crop plan

- Left half: Root Sigil.
- Right half: Route Mural.
- Full frame: Root Cellar discovery or chapter recap, if useful later.

### Selection check

- The recent sigil and old mural cannot be mistaken for the same artist or era.
- The recent mark feels coercive; the old mural feels practical and communal.
- Neither side contains readable text.
- Both halves remain clear when cropped into a wide dialogue vignette.

## A4. Briar Crown Primary Mark

**Suggested source filename:** `briar-crown-primary-mark-v01.png`
**Target runtime filename:** `assets/icons/ui/briar-crown-primary-mark-v01.png`
**Format:** square 1024 x 1024 PNG with a true transparent background

**Selected 2026-07-16:** the regenerated Paint.NET-cleaned download has genuine alpha and is wired as the production mark. Keep this prompt for future variants, not as an open blocker.

Attach the Crown Door closeup and Briar Roadwatcher art, then use the shared style and negative blocks with this prompt:

```text
Create one bespoke Briar Crown antagonist mark for Liam's Game on a true transparent background. This is not a royal crown and not a polished heraldic logo. It is a rough false-authority symbol made from five uneven thorn points forced into the suggestion of a crown. The base should resemble a bent road slat or a pressed strip of seal cloth, with one point slightly crooked and the outer thorns hooking inward as if trying to command the viewer.

Render it as a hand-painted physical mark with dark briar brown, bruised red wax, a trace of pine-pitch amber, and a few scraped green remnants underneath. It should look like something stamped, painted, or nailed over older honest road guidance. Keep one strong centered silhouette with generous transparent margins so it reads at 48 to 128 pixels. The image should feel invasive and counterfeit, but still family-friendly.

Generate exactly one primary mark, not a sheet of alternatives. No words, letters, shield, gemstones, velvet, gold royal ornament, skulls, or surrounding scene.
```

### Selection check

- It reads as a crown at a glance and as thorns/forced road authority on a second look.
- It does not look regal, valuable, or like a normal kingdom emblem.
- The background is genuinely transparent, not a checkerboard painted into the pixels.
- The silhouette remains legible at small UI size.

## A5. Willow Market Seal on Crate

**Suggested source filename:** `willow-market-seal-crate-detail-v01.png`
**Target runtime filename:** `assets/scenes/willow-market-seal-crate-detail-v01.webp`
**Format:** opaque square or 4:3 image, ideally 1536 x 1536 or larger

Attach Ada's portrait and the Bramblecross town map for palette continuity, then use the shared style and negative blocks with this prompt:

```text
Paint a close, highly readable object study of Ada Willowmarket's genuine cargo seal on a sturdy spice-crate lid. The crate is made from practical, weathered honey-brown timber with worn traces of muted Willow green paint, a little spice dust in the grain, and the scuffs of ordinary merchant use.

The central subject is the impression made by Ada's small Willow Market stamp in muted green merchant sealing wax: three natural willow leaves enclosed by one simple circle. The mark is a hand-pressed working merchant's seal, not a polished heraldic logo. Make the left leaf carry one tiny but clearly intentional nick in its edge. This familiar flaw is how Ada recognizes the honest stamp; the other two leaves should remain intact. Keep the circle slightly uneven and the impression tactile, with modest hand-made pressure variation rather than perfect symmetry.

Show the mark intact on the crate lid and large enough to remain recognizable at 64 to 96 pixels. Use a close three-quarter or near top-down view, with the seal near the center and only enough surrounding wood, green paint, crate hardware, twine, and spice residue to establish that this is trusted working cargo. The object should feel dependable, ordinary, and worth protecting because tired guards, porters, and clerks recognize it at a glance.

This is the clean canonical Willow seal. Do not add a crown, red royal wax, pine pitch, over-stamping, a missing cut-out section, readable writing, letters, a decorative shield, or ornate noble imagery. Generate one finished image, not a reference sheet or set of alternatives.
```

### Selection check

- The mark unmistakably reads as three willow leaves inside one circle.
- The tiny nick is on the left leaf only and survives a small Watchhouse-card crop.
- The green mark and green-painted cargo identity are clear without looking neon or magical.
- It looks like an honest, frequently used merchant's mark rather than a heraldic badge.
- No crown-red wax or forgery materials appear in this clean reference image.

---

# Optional After Crop QA

## B1. Bramblecross Notice Board Close-up

Generate this only if the notice board cannot be isolated cleanly from `bramblecross-town-map-v02.webp`.

**Suggested source filename:** `bramblecross-notice-board-scene-v01.png`
**Target runtime filename:** `assets/scenes/bramblecross-notice-board-scene-v01.webp`
**Format:** opaque 4:3 landscape, 1536 x 1152 or larger

```text
Paint a close view of the public notice board in Bramblecross, mounted under a modest rain awning near the watchhouse. It holds ordinary market notices, road cautions, a missing-person space, and one suspicious newly pinned order with a crooked crown-red wax mark. Use torn edges, pin holes, wax colors, non-text route symbols, and differences in paper age to make the false notice stand out without any readable words. Include just enough town stonework and wet timber to place it in Bramblecross. Mood: a familiar civic object has become one of the places where lies are being made to walk first.
```

## B2. Old Root Cellar Entrance

Generate this only if neither the Bramblecross map nor Root Cellar stair crop gives the entrance dialogue enough identity.

**Suggested source filename:** `old-root-cellar-entrance-scene-v01.png`
**Target runtime filename:** `assets/scenes/old-root-cellar-entrance-scene-v01.webp`
**Format:** opaque 16:9 landscape, 1920 x 1080 or larger

```text
Paint the neglected entrance to the Old Root Cellar beneath Bramblecross warehouses. Show old fitted stone steps descending under thick roots, a warped but sturdy cellar frame, damp barrels and crates pushed aside, one practical watch lantern, and signs that people recently passed through despite the official neglect: fresh scuffs, moved dust, a thread of treated root fiber, and a faint scraped route mark. The entrance should feel mysterious and unsafe but not haunted, gruesome, or like a dungeon portal. Leave the passage dark enough to invite caution while keeping the construction readable.
```

## B3. Dropped Forged Orders

Generate this only if using the Thorncoat Ruffian art in the post-battle dialogue feels too repetitive.

**Suggested source filename:** `dropped-forged-orders-scene-v01.png`
**Target runtime filename:** `assets/scenes/dropped-forged-orders-scene-v01.webp`
**Format:** opaque 4:3 landscape, 1536 x 1152 or larger

```text
Paint a small evidence close-up on a muddy roadside after an ambush: several dropped order sheets, a snapped sign slat, cheap binding cord, a pouch with a few coins, and copied wax seals that imitate authority badly. The papers should use non-readable lines and route pictograms only. Make the organization and funding visible through repeated materials and matching seal wax, while keeping the scene humble and grounded rather than treasure-like. No defeated figures, weapons posed as trophies, or violence.
```

## B4. Cut-Away Willow Seal Evidence

Generate this after A5 only if a separate Broken Cart or Ada evidence close-up is needed. Attach the selected A5 image so the three-leaf design and nick remain identical.

**Suggested source filename:** `willow-market-cut-seal-evidence-v01.png`
**Target runtime filename:** `assets/scenes/willow-market-cut-seal-evidence-v01.webp`
**Format:** opaque 4:3 landscape, 1536 x 1152 or larger

```text
Paint the recovered fragment of Ada Willowmarket's missing green-painted spice-crate lid as a close evidence study. Preserve the exact Willow seal design from the attached approved reference: three leaves inside a circle, with one tiny nick in the left leaf. Someone has deliberately carved the marked section out of the crate lid rather than smashing it. Show the careful cut around the seal area, exposed pale wood, a few green paint flakes, knife or narrow-saw scoring, and the remaining partial outline that makes the theft legible. Place the fragment beside a simple charcoal rubbing cloth or paper impression with non-readable marks only.

The image should communicate planning: the thief wanted the trusted mark itself, not the spices. Keep the scene practical and forensic rather than dramatic. No crown, red royal wax, pine pitch, readable text, treasure styling, violence, or characters.
```

---

# C. Level-Up Growth Emblems

Generate these as five separate assets, one per request. Use the following handoff prompt to establish the set and ask ChatGPT to begin with Power:

```text
Please create a coordinated set of five level-up emblems for a whimsical storybook fantasy game. Generate them as five separate square PNG images with true transparent backgrounds, not a combined sheet. Keep the same visual language, scale, lighting, edge treatment, and composition across all five.

Art direction: hand-painted storybook fantasy, warm gouache-and-watercolor texture, tactile natural materials, slightly whimsical but heroic, rich moss green, lantern gold, weathered wood, muted steel, and restrained sky-blue accents. Strong, simple silhouettes that remain immediately readable at 64–96 pixels. Each emblem should be centered with generous transparent padding and contain no frame, badge shape, UI panel, drop-shadow rectangle, words, letters, numbers, or extra decorative objects. Avoid emoji, clip art, glossy mobile-game icons, photorealism, and modern vector-logo styling.

The five separate emblems are:

1. Power — a practical village hatchet striking cleanly through a thorny briar stem, with the severed briar curling away. Energetic diagonal composition; strength and decisive action, not aggression or gore.
2. Resolve — a weathered roadwarden's round shield planted firmly while thick roots press against it and bend aside. Stable, upright composition; endurance, protection, and refusing to yield.
3. Cleverness — an open, hand-drawn route map with several faint misleading paths, while one honest route glows subtly in warm lantern gold. Clear folded parchment silhouette; insight, observation, and finding the truth.
4. Heart — two ordinary adventurer's hands sheltering a small, warmly glowing road lantern. Gentle symmetrical composition; courage, compassion, friendship, and keeping hope alive.
5. Craft — a small smith's hammer beside a freshly repaired wooden road-sign joint, with one neat iron strap and peg visibly holding the split wood together. Practical, ingenious, handmade—not a generic crossed-tools symbol.

Please preserve visual consistency across the set, but give each emblem a distinct silhouette and dominant accent: muted red-brown for Power, cool blue-steel for Resolve, parchment and gold for Cleverness, warm amber for Heart, and weathered wood/iron for Craft.

Begin by generating Power only. After I approve it, I will ask for Resolve, Cleverness, Heart, and Craft one at a time so the designs remain consistent. Each final image must be a standalone transparent PNG.
```

Suggested runtime filenames:

- `assets/icons/ui/level-up-power-v01.png`
- `assets/icons/ui/level-up-resolve-v01.png`
- `assets/icons/ui/level-up-cleverness-v01.png`
- `assets/icons/ui/level-up-heart-v01.png`
- `assets/icons/ui/level-up-craft-v02.png`

Implementation note: the user-prepared Paint.NET files are the authoritative true-alpha sources for this set. Optimized runtime copies are checked in under the names above. Earlier checkerboard and cleanup-working files are reference-only and should not be regenerated or promoted over the user-cleaned masters. Craft v02 is the selected production image.

---

## Delivery Checklist

For every selected generation:

1. Save the original PNG under `assets/reference/source-art/` before editing or compression.
2. Reject any output with readable invented text, a painted checkerboard, a UI border, or inconsistent slick/3D styling.
3. For opaque scenes, export a production WebP while preserving the PNG source.
4. Keep the Briar Crown mark as a true-alpha PNG.
5. Test the full frame and every planned crop at the actual dialogue size before considering the asset final.
6. Do not create separate duplicate crops until the shared master has been tested with CSS focus metadata.
