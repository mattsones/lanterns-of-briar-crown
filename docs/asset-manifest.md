# Liam’s Game — Asset Manifest

This document tracks selected and planned assets for the playable prototype chapters.

## Naming Convention

Use descriptive kebab-case filenames.

```text
chapter-1-lantern-road-key-art-v02.png
mira-portrait-v01.webp
enna-portrait-v02.png
```

## Folder Convention

```text
assets/
  maps/
  portraits/
    characters/
    enemies/
    player/
  scenes/
  icons/
    items/
    map-tokens/
    skills/
    ui/
  reference/
    concept/
    alternates/
    source-art/
    paper-doll/
  source-prompts/
```

Concept art should remain in `assets/reference/concept/`.

Production-ready runtime derivatives live in `assets/maps/`, `assets/portraits/`, `assets/scenes/`, or `assets/icons/`. Full-size originals for optimized shipped assets live in `assets/reference/source-art/`; non-selected alternates live in `assets/reference/alternates/`.

---

# Current Artwork Strategy

The production artwork strategy is now:

- painted maps for explorable locations;
- half-body portraits for dialogue, companions, and key NPCs;
- custom painted object art for item icons;
- story/key art for major chapter moments;
- emoji/icon fallbacks preserved anywhere art is missing.

The paper-doll equipment effort is archived as proof work only. Do not build the main UI around visible gear overlays on the hero body. Item art should be generated as bespoke icon-object illustrations instead.

The item icon production plan lives at:

```text
docs/art/item-icons/liams-game-custom-item-icon-plan.md
```

## Production Export Discipline

Use this policy before Chapter 3-5 art production grows the web build:

- Keep source, concept, and alternate generations in `assets/reference/`, `assets/source-prompts/`, or task-specific art folders.
- Put only production-ready game assets in `assets/maps/`, `assets/portraits/`, `assets/scenes/`, and `assets/icons/`.
- Prefer WebP or AVIF derivatives for opaque maps, portraits, and scene art.
- Keep PNG for transparent assets such as item icons, map tokens, UI symbols, and full-body hero cutouts.
- Preserve emoji/text fallbacks in code even when an asset is available.
- Run `npm.cmd run audit:assets` to report the largest shipped assets before adding or promoting a large art batch.
- Run `npm.cmd run optimize:assets` after promoting a batch to create web-ready runtime derivatives, move full-size originals to `assets/reference/source-art/`, and move non-imported production-folder images to `assets/reference/alternates/`.

Target export ranges:

| Asset type | Production format | Target dimensions | Target file size |
|---|---|---|---|
| Playable maps | WebP or AVIF derivative; source PNG may stay in concept/reference folders | 1600-2048 px wide, 16:9 or current map aspect | 450-750 KB |
| Story scenes and closeups | WebP or AVIF derivative | 1400-1920 px wide | 350-700 KB |
| Dialogue portraits | WebP or AVIF derivative when opaque; PNG only if transparency is required | 900-1400 px tall | 250-500 KB |
| Full-body hero variants | Transparent PNG until a better alpha-safe pipeline exists | 900-1400 px tall | 450-900 KB |
| Map tokens | Transparent PNG | 256-512 px on longest edge | 60-180 KB |
| Item and UI icons | Transparent PNG | 128-512 px on longest edge | 30-120 KB |

The audit script is report-only: it tells us what would ship. The optimizer performs the asset split. If a file is over target, create or regenerate a web-ready derivative rather than removing working art or fallback behavior.

For imported opaque art, the runtime file usually keeps the selected basename and uses `.webp`. The original source file is preserved under `assets/reference/source-art/`.

---

# Selected First-Pass Assets

## Key Art

| Asset | Suggested filename | Notes |
|---|---|---|
| Chapter 1 key art, hero on Lantern Road | `chapter-1-lantern-road-key-art-v02.png` | Cleaner version with fewer lights; keep as style anchor. |

## Environments

| Asset | Suggested filename | Notes |
|---|---|---|
| Hearthhollow gameplay map | `hearthhollow-gameplay-map-v04.webp` | Current clean production map; icon-free version of the cozy village layout. |
| Lantern Road gameplay map | `lantern-road-gameplay-map-v02.webp` | Current clean production map; icon-free version of the winding road layout. |
| Bramblecross town gameplay map | `bramblecross-town-map-v01.webp` | Practical, square, guarded town layout. |
| Root Cellar gameplay map | `root-cellar-map-v01.webp` | Strong layout; Warden visibly blocks sealed door. |
| Westroot Trail gameplay map | `westroot-trail-map-v04.webp` | Current Chapter 2 production map; readable Shelter Nook, false notice, Three-Sign Hollow, Roadwatcher bend, and First Westroot Gate. |
| Crown Door Den gameplay map | `crown-door-den-map-v01.webp` | Current Chapter 2 production map for the Roadwatcher signworks behind the Crown Door. Prompt lives in `docs/art/prompts/chapter-2-crown-door-and-three-doors.md`. |

## Scenes

| Asset | Suggested filename | Notes |
|---|---|---|
| Three-Door Threshold scene | `three-doors-threshold-v01.webp` | Current Chapter 2 room-dialog scene for the Crown Door, Lantern Door, and No-Handle Door. Crown Door uses the false-official thorn crown and slat latch. |
| Edden's Three-Door Drawing scene | `eddens-three-door-drawing-scene-v01.webp` | Current Chapter 2 dialogue scene image for Edden's shaky charcoal drawing. Avoids readable labels and keeps the no-handle clue obscure. |
| Crown Door closeup | `crown-door-closeup-v01.webp` | Current Chapter 2 dialogue closeup for inspecting the Crown Door. Wired into door dialogue visuals. |
| Lantern Door closeup | `lantern-door-closeup-v01.webp` | Current Chapter 2 dialogue closeup for inspecting the Lantern Door. Wired into door dialogue visuals. |
| No-Handle Door closeup | `no-handle-door-closeup-v01.webp` | Current Chapter 2 dialogue closeup for inspecting the No-Handle Door. Wired into door dialogue visuals. |

## Map Tokens

| Asset | Suggested filename | Notes |
|---|---|---|
| Crown Den wax table token | `assets/icons/map-tokens/crown-den-wax-table-token-v01.png` | Transparent PNG wired into the Crown Door Den map token renderer. |
| Crown Den wax table cleared token | `assets/icons/map-tokens/crown-den-wax-table-cleared-token-v01.png` | Transparent PNG wired as the spent-state token after the wax table is cleared. |
| Crown Den slat rack token | `assets/icons/map-tokens/crown-den-slat-rack-token-v01.png` | Transparent PNG wired into the Crown Door Den map token renderer. |
| Crown Den slat rack broken token | `assets/icons/map-tokens/crown-den-slat-rack-broken-token-v01.png` | Transparent PNG wired as the spent-state token after the slats are broken. |
| Crown Den witness ledger token | `assets/icons/map-tokens/crown-den-witness-ledger-token-v01.png` | Transparent PNG wired into the Crown Door Den map token renderer. |
| Crown Den witness ledger copied token | `assets/icons/map-tokens/crown-den-witness-ledger-copied-token-v01.png` | Transparent PNG wired as the spent-state token after the ledger is copied. |
| Crown Den collar kennel token | `assets/icons/map-tokens/crown-den-collar-kennel-token-v01.png` | Transparent PNG wired into the Crown Door Den map token renderer. |
| Crown Den collar kennel broken token | `assets/icons/map-tokens/crown-den-collar-kennel-broken-token-v01.png` | Transparent PNG wired as the spent-state token after the collars are broken. |
| Crown Den false map token | `assets/icons/map-tokens/crown-den-false-map-token-v01.png` | Transparent PNG wired into the Crown Door Den map token renderer. |
| Crown Den false map cleared token | `assets/icons/map-tokens/crown-den-false-map-cleared-token-v01.png` | Transparent PNG wired as the spent-state token after the false map is pulled down. |
| Crown Den exit token | `assets/icons/map-tokens/crown-den-exit-token-v01.png` | Transparent PNG wired into the Crown Door Den map token renderer. |
| Crown Den cleared token master sheet | `assets/icons/map-tokens/crown-den-cleared-token-master-sheet-v01.png` | Reference-only sheet for the cleared token generation. The individual transparent PNGs are the production assets. |

## Characters

| Character | Suggested filename | Notes |
|---|---|---|
| Elder Mira | `mira-portrait-v01.webp` | Warm, wise Hearthhollow elder. |
| Enna | `enna-portrait-v02.webp` | Black woman, darker skin, tough and focused. |
| Captain Hollis | `hollis-portrait-v01.webp` | Worn, responsible watch captain. |
| Nix Fernwhistle | `nix-portrait-v01.webp` | Wiry road-scout, Lantern Road guide. |
| Pibble Thatch | `pibble-portrait-v01.webp` | Curious, helpful, odd village clue-noticer. |
| Rowan Reedshield | `rowan-portrait-v02.webp` | Defensive companion; sturdy playable-ancestry look, not fox-person. |
| Tilda Quickstep | `tilda-portrait-v01.webp` | Quick, clever, mischievous companion. |
| Moss Fenmere | `moss-portrait-v01.webp` | Mossback companion; calm, rooted, ancient-adjacent. |
| Ada Willowmarket | `ada-willowmarket-portrait-v01.webp` | Production portrait; organized market authority and Willow seal identity. |
| Ada Willowmarket, no lens | `ada-willowmarket-portrait-no-lens-v01.webp` | Post-borrow portrait variant for after the player takes the Willowmark Lens. |
| Smith Orin | `smith-orin-portrait-v02.webp` | Selected Emberling/fireperson blacksmith direction. |
| Mayor Anwen | `mayor-anwen-portrait-v01.webp` | Production portrait; Bramblecross civic leader. |
| Nella the Baker | `nella-portrait-v03.webp` | Selected Tideborn/water-person baker direction. |
| Toma Fielding | `toma-fielding-portrait-v02.webp` | Selected farmer portrait with clearer tool silhouette. |
| Miri of the Loom | `miri-portrait-v02.webp` | Selected loom/thread portrait with stronger face variety. |
| Mara Brindle | `mara-brindle-portrait-v01.webp` | Production portrait for Chapter 2 protected guest role. |
| Edden Vale | `edden-vale-portrait-v01.webp` | Production portrait for the recovery-room witness. |
| Lio Brindle | `lio-brindle-portrait-v01.webp` | Pre-rescue or remembered courier portrait; generate a later rescued variant if needed. |
| Worried Road Traveler | `worried-road-traveler-portrait-v01.webp` | Production-usable generic traveler; includes baked-in sign text, so use sparingly. |

## Enemies

| Enemy | Suggested filename | Notes |
|---|---|---|
| Bramble Boar | `bramble-boar-v01.webp` | Production battle portrait; frantic road threat with satchel clue. |
| Thorncoat Ruffian | `thorncoat-ruffian-v02.webp` | Selected humanoid version; avoids implying foxfolk as a new ancestry. |
| Thorny Hound | `thorny-hound-v01.webp` | Production battle portrait; wild bramble-tangled hound. |
| Rustroot Skulk | `rustroot-skulk-v02.webp` | Selected organic root-cellar creature; less mechanical than v1. |
| Briar Knot Warden | `briar-knot-warden-v01.webp` | Production boss portrait; still could use future root-cellar/chain specificity. |
| Briar Roadwatcher | `briar-roadwatcher-v02.webp` | Selected practical sign-forging field agent; replaces Warden-like v1. |
| Thorn-Collared Hound | `thorn-collared-hound-v01.webp` | Production battle portrait; collar-control read is clear. |
| False Sign Scratcher | `false-sign-scratcher-v02.webp` | Selected support enemy; clearer face and less Warden overlap than v1. |

---

# Generated But Not Selected

| Asset | Notes |
|---|---|
| First busier Chapter 1 key art | Too many lanterns/lights; useful style reference. |
| First Hearthhollow concept map with baked-in labels | Nice concept, but too much text for gameplay map. |
| Hearthhollow map with boar sign above gate | Rejected; south gate should not have permanent boar warning sign. |
| Hearthhollow gameplay map v03 | Preserved as concept/reference; replaced in production by icon-free v04. |
| Lantern Road gameplay map v01 | Preserved as concept/reference; replaced in production by icon-free v02. |
| First Rowan human portrait | Too human/soft for defensive non-human companion. |
| Rowan fox-person portrait | Good art, but fox-person was not one of the intended playable ancestries. Could be repurposed as a future roadside trickster NPC. |
| `westroot-trail-map-v01.png` | Strong painterly candidate, but the gate/sign composition is less aligned to the current Chapter 2 playable route than v04. |
| `westroot-trail-map-v02.png` | Clear candidate with good landmarks, but v04 has better safe margins and a more readable path-to-gate composition. |
| `westroot-trail-map-v03.png` | Strong candidate and previous code target; replaced by v04 because v04 gives cleaner path readability and overlay spacing. |

---

# Immediate Missing Assets

## Important NPCs

- Bracken Voss portrait and combat/boss variant
- Chapter 3 Westroot NPC set
- Chapter 4 captive porter and relay captain portraits
- Optional post-rescue Lio portrait

## Enemies

- Briar Relay Guard
- Seal-Forged Sentry
- Crown Whisperer
- Thornseal Guard
- Thornroot Sentry

## Symbols / UI

- Briar Crown symbol sheet
- Lantern Road symbol sheet
- custom item icon set
- skill icon sheet
- parchment dialogue panel
- quest journal panel
- battle pouch UI treatment

| Asset | Suggested filename | Notes |
|---|---|---|
| Crown Den distant scratching icon | `assets/icons/ui/crown-den-distant-scratching-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. |
| Crown Den chain drag icon | `assets/icons/ui/crown-den-chain-drag-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. |
| Crown Den hound warning icon | `assets/icons/ui/crown-den-hound-warning-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. Reads primarily as the thorn collar, which fits the false-command beat. |
| Crown Den patrol caught up icon | `assets/icons/ui/crown-den-patrol-caught-up-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. |
| Crown Den pursuit tension master sheet | `assets/icons/ui/crown-den-pursuit-tension-master-sheet-v01.png` | Reference-only sheet for the tension icon generation. The individual transparent PNGs are the production assets. |

## Hero Assets

- Twenty-two selected transparent full-body hero variants are wired in `src/data/playerArtwork.ts` and live under `assets/portraits/player/`. Humans use four fantasy-world heritages; new Human heroes default to Rainroot:
  - Hearthvale Human: `human-hearthvale-female-v01.png`, `human-hearthvale-male-v01.png`
  - Sunreach Human: `human-sunreach-female-v01.png`, `human-sunreach-male-v01.png`
  - Rainroot Human: `human-rainroot-female-v01.png`, `human-rainroot-male-v01.png`
  - Dawnmere Human: `human-dawnmere-female-v01.png`, `human-dawnmere-male-v01.png`
  - `stonekin-female-v06.png`
  - `stonekin-male-v04.png`
  - `sylvan-female-v04.png`
  - `sylvan-male-v03.png`
  - `emberling-female-v06.png`
  - `emberling-male-v06.png`
  - `tideborn-female-v02.png`
  - `tideborn-male-v01.png`
  - `cloudling-female-v02.png`
  - `cloudling-male-v02.png`
  - `mossback-female-v02.png`
  - `mossback-male-v02.png`
  - `moonmark-female-v04.png`
  - `moonmark-male-v02.png`

Do not prioritize dynamic visible gear overlays. Equipment should be represented through custom item icons, combat skills, loot cards, and inventory/equipment UI.

---

# Existing Item-Art Proof Assets

The generated paper-doll proof files are not production item icons, but they are useful as style and subject references:

| Source asset | Status | Notes |
|---|---|---|
| `assets/reference/paper-doll/characters/hero/equipment/m_standard/proof_set/equip_mainhand_old_hatchet.png` | Reference only | Strong custom painted hatchet, but stored as RGB with a fake checkerboard background. Regenerate or clean before production icon use. |
| `assets/reference/paper-doll/characters/hero/equipment/m_standard/proof_set/equip_torso_briarweave_vest_m_standard.png` | Reference only | Good Briarweave Vest concept, but stored as RGB with a fake checkerboard background. Regenerate or clean before production icon use. |
| `assets/reference/paper-doll/characters/hero/equipment/m_standard/proof_set/equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png` | Reference only | Has alpha, but composition is a full paper-doll canvas with too much blank area. Needs icon-specific crop or regeneration. |

---

# Immediate Item Icon Batch

Generate custom icon-object art for Chapter 1 items first:

- Old Hatchet
- Turnipwood Blade
- Pebbleknock Hammer
- Apprentice Kettle Helm
- Briarweave Vest
- Giggleleaf Cloak
- Friendmaker Cloak
- Stormbell Charm
- Lantern Pin
- Warden Chain
- Edden's Blue Watch Cloth
- Healing Fizzpop
- Trail Snack
- Fizzberry Handpie
- Bubbleburst Tonic
- Moonmint
- Bubblecap Mushroom

## Selected Production Item Icons

These icons have been cleaned and promoted into the item-art registry:

| Item | Selected asset | Notes |
|---|---|---|
| Old Hatchet | `assets/icons/items/old-hatchet-icon-v01.png` | Best starter-tool personality; worn and readable. |
| Turnipwood Blade | `assets/icons/items/turnipwood-blade-icon-v01.png` | Strongest design in the first batch; distinctive and very readable. |
| Pebbleknock Hammer | `assets/icons/items/pebbleknock-hammer-icon-v02.png` | Cleaner small-size silhouette than v1. |
| Apprentice Kettle Helm | `assets/icons/items/apprentice-kettle-helm-icon-v01.png` | Better apprentice/made-do charm than the more ornate v2. |
| Briarweave Vest | `assets/icons/items/briarweave-vest-icon-v01.png` | Darker but readable; strong woven-thorn armor identity. |
| Giggleleaf Cloak | `assets/icons/items/giggleleaf-cloak-icon-v01.png` | Strong silhouette and playful leaf-cloak personality. |
| Friendmaker Cloak | `assets/icons/items/friendmaker-cloak-icon-v01.png` | Clear, warm cloak read with distinct color identity. |
| Stormbell Charm | `assets/icons/items/stormbell-charm-icon-v01.png` | Production-usable; optional future v2 could emphasize cracked/weathered storm magic more. |
| Lantern Pin | `assets/icons/items/lantern-pin-icon-v01.png` | Excellent read as a humble road-lantern pin. |
| Warden Chain | `assets/icons/items/warden-chain-icon-v01.png` | Strong reward icon; still readable at small size. |
| Edden's Blue Watch Cloth | `assets/icons/items/eddens-blue-watch-cloth-icon-v01.png` | Good story-item read; civic watch identity is clear. |
| Healing Fizzpop | `assets/icons/items/healing-fizzpop-icon-v01.png` | Bright, readable potion icon. |
| Trail Snack | `assets/icons/items/trail-snack-icon-v01.png` | Strong food bundle silhouette with useful detail. |
| Fizzberry Handpie | `assets/icons/items/fizzberry-handpie-icon-v01.png` | Readable and charming; filling color separates it from generic pie. |
| Bubbleburst Tonic | `assets/icons/items/bubbleburst-tonic-icon-v01.png` | Strong potion silhouette and bubble identity. |
| Moonmint | `assets/icons/items/moonmint-icon-v01.png` | Clean herb silhouette; cool color contrast works. |
| Bubblecap Mushroom | `assets/icons/items/bubblecap-mushroom-icon-v01.png` | Production-usable ingredient cluster; includes a moss base but remains item-like. |

## Selected Chapter 2 Story-Item Icons

These have also been cleaned and promoted into the item-art registry so Chapter 2 item data can use them as soon as the items exist:

| Item | Selected asset | Notes |
|---|---|---|
| Edden's Three-Door Drawing | `assets/icons/items/eddens-three-door-drawing-icon-v02.png` | Chosen over v1 because the door shapes remain clearer at 40-64 px and the sketch feels more urgent. Keep v1 as a polished reference candidate. |
| Willowmark Lens | `assets/icons/items/willowmark-lens-icon-v01.png` | Production-ready; strong silhouette, brass detail, and clear investigative identity. |
| Broken False Seal Wax | `assets/icons/items/broken-false-seal-wax-icon-v01.png` | Production-ready; reads immediately as cracked false authority. |
| Pine-Pitch Wax | `assets/icons/items/pine-pitch-wax-icon-v01.png` | Production-ready; amber resin and twine give it a useful material read. |
| No-Handle Token | `assets/icons/items/no-handle-token-icon-v01.png` | Production-ready; the missing handle reads clearly even small. |
| Witness Note for Bramblecross | `assets/icons/items/witness-note-for-bramblecross-icon-v01.png` | Production-ready; official note shape and blue watch detail are clear. |

---

# Art Integration Notes

Use selected art first as concept and documentation.

Safe integration order:

1. Add assets to repo.
2. Reference selected portraits in NPC data.
3. Display portrait images in dialogue with emoji fallback.
4. Add map backgrounds behind current tile maps as experiments.
5. Add production item icon art in `assets/icons/items/`.
6. Wire item art through `src/data/itemArtwork.ts` while preserving emoji fallback.
7. Add UI panels after gameplay remains stable.

Avoid replacing the tile system with freeform movement for now.
