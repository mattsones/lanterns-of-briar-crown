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
| Bramblecross town gameplay map | `bramblecross-town-map-v02.webp` | Practical, square, guarded town layout with a clearly painted cellar entrance in the left-center building. The interaction is aligned to logical tile `(3,5)`. |
| Root Cellar gameplay map | `root-cellar-map-v01.webp` | Strong layout; Warden visibly blocks sealed door. |
| Root Cellar cleared gameplay map | `root-cellar-no-boss-map-v01.webp` | Post-Warden state preserving the same landmarks and navigation alignment while replacing the boss with collapsed roots. Runtime swaps to this map immediately after victory. |
| Westroot Trail gameplay map | `westroot-trail-map-v04.webp` | Current Chapter 2 production map; readable Shelter Nook, false notice, Three-Sign Hollow, Roadwatcher bend, and First Westroot Gate. |
| Crown Door Den gameplay map | `crown-door-den-map-v01.webp` | Current Chapter 2 production map for the Roadwatcher signworks behind the Crown Door. Prompt lives in `docs/art/prompts/chapter-2-crown-door-and-three-doors.md`. |
| Westroot Hub gameplay maps | `westroot-hub-map-v01.webp`, `westroot-hub-map-v02-open-stones.webp` | Chapter 3 uses v01 while Bramwell's legitimate hold-shutter closes the Witness Stone approach, then swaps to v02 after the public renewal opens the walk. The v02 source PNG is preserved in `assets/reference/source-art/assets/maps/`. |
| Underway approach gameplay map | `underway-approach-map-v03.webp` | Owner-approved Chapter 4 pre-choice Lower Gate approach. One continuous, moderately serpentine fitted-stone road leads from a small iron gate to an official-looking construction closure; neither later route is visible until the folded-map decision replaces this map. V03 restores Candidate A2's large woven-root essence, removes the unexplained route dial, and balances long-road scale with readable paving and endpoints. Uses runtime-only party-lantern lighting; V01–V02 are preserved in reference alternates. |
| Old Keeper Road gameplay map | `old-keeper-road-map-v02.webp` | Revised to the approved approach-map scale: a narrow, strongly winding old road with many small fitted stones, large woven roots, and a small abandoned waykeeper recess at the central low bend. V01 is preserved in reference alternates. |
| Construction detour gameplay map | `construction-detour-map-v03.webp` | Revised to the approved approach-map scale: an equally long but nearly straight newer service cut, with smaller construction courses, trimmed roots, and a compact unlit signal rig. V01–V02 are preserved in reference alternates. |
| Blind Junction gameplay map | `underway-convergence-map-v01.webp` | The two exclusive routes have already merged offscreen. One root-woven fitted road crosses a concealed blind bend with overlay-safe ambush space; no fork or enemy is baked into the map. |
| Listening Mile gameplay maps | `listening-mile-first-hood-map-v01.webp`, `listening-mile-second-hood-map-v01.webp`, `listening-mile-third-hood-map-v01.webp` | Three distinct long road stretches at the approved scale. Each contains exactly one small cold-brass acoustic hood and fired-clay conduit. The final stretch adds a scored inspection shutter and subtle loose route-record plate; Lio's blue knot remains an interaction reveal. |
| Westbound Relay approach gameplay map | `relay-approach-map-v01.webp` | Final long Underway stretch. Root-bound fitted road gradually transitions into formal old civic masonry and ends at a small closed Relay gate; the station interior remains a separate map. |
| Briar Relay Post gameplay map | `briar-relay-post-map-v01.webp` | Final Chapter 4 captured-station interior. Fixed light comes from a banked stove, shielded work lanterns, and desk candles while cool root-bound edges preserve a role for the party lantern. The upper-left wall carries the approved waist-up Princess Elowen Progress Notice with restrained briar defacement below her face and heading. Full PNG source is preserved under `assets/reference/source-art/assets/maps/`. |
| Folded Map puzzle faces | `folded-map-survey-face-v01.webp`, `folded-map-road-crew-face-v01.webp` | Painted front and reverse faces for the accepted opaque-sheet puzzle. The geographically matched root-city maps provide terrain, fitted-stone works, parchment character, and the shared river; exact Survey Shortcut, road-crew route, bridge, ring, labels, and fold registration remain SVG overlays so the puzzle answer is never baked into generated art. Full PNG masters are preserved under `assets/reference/source-art/assets/maps/`; generation and integration constraints live in `docs/art/prompts/chapter-4-folded-map-faces.md`. |
| Great Survey political world map | `assets/reference/source-art/assets/maps/great-survey-of-alderreach-v06.png` | Selected geographic reference source. V06 preserves the accepted V05 geography and symbol hierarchy while replacing the retired painted principality label with `CORAVENE`. V05 remains preserved as the superseded pre-rename source. Create an optimized derivative before any runtime import. Generation prompts and diegetic timing live in `docs/art/prompts/great-survey-world-map.md`. |

## Scenes

| Asset | Suggested filename | Notes |
|---|---|---|
| Three-Door Threshold scene | `three-doors-threshold-v01.webp` | Current Chapter 2 room-dialog scene for the Crown Door, Lantern Door, and No-Handle Door. Crown Door uses the false-official thorn crown and slat latch. |
| Edden's Three-Door Drawing scene | `eddens-three-door-drawing-scene-v01.webp` | Current Chapter 2 dialogue scene image for Edden's shaky charcoal drawing. Avoids readable labels and keeps the no-handle clue obscure. |
| Crown Door closeup | `crown-door-closeup-v01.webp` | Current Chapter 2 dialogue closeup for inspecting the Crown Door. Wired into door dialogue visuals. |
| Lantern Door closeup | `lantern-door-closeup-v01.webp` | Current Chapter 2 dialogue closeup for inspecting the Lantern Door. Wired into door dialogue visuals. |
| No-Handle Door closeup | `no-handle-door-closeup-v01.webp` | Current Chapter 2 dialogue closeup for inspecting the No-Handle Door. Wired into door dialogue visuals. |
| Westroot threshold opening | `westroot-threshold-opening-v02.webp` | Chapter 2 closing illustration: a character-neutral view through the open oval Westroot gate, matching the rounded Three-Door Threshold architecture. |
| Westroot arrival | `westroot-arrival-scene-v01.webp` | Chapter 3 First Westroot Gate dialogue scene; establishes Mara's arrival beneath the hill. |
| Rootmarket uneasy arrival | `rootmarket-uneasy-arrival-scene-v01.webp` | Selected Chapter 3 pre-bell Rootmarket hub scene; Quill and Auntie Lume anchor independent conversation areas while mixed neighbors continue their work under quiet social strain. |
| Witness Stones public renewal | `witness-stones-public-renewal-scene-v03.webp` | Final Chapter 3 public-renewal scene: exactly four established promise stones, Bramwell and Noma opening the hold together, Quill recording the order, and mixed neighbors visibly taking responsibility. V02 is preserved under reference alternates. |
| Rootbread Transfer Checkpoint | `rootbread-transfer-checkpoint-scene-v01.webp` | Current Chapter 3 Rootbread scene; Mara and the young Mossback stand at the First Gate checkpoint with the basin, airing rack, account rail, ordinary tray, and Lio's returned cup with its blue knot. |
| Cargo Siding evidence | `cargo-siding-evidence-scene-v01.webp` | Chapter 3 cargo inspection scene; false Willow cargo and the evidence crate are legible. |
| Split Hall Hold Debate | `split-hall-hold-debate-scene-v01.webp` | Selected Chapter 3 post-bell confrontation scene; Bramwell and Noma remain sympathetic, the crowd is mixed across ancestry lines, Quill's shutter occupies the contested center, and thin ceiling hold-lines reinforce the temporary civic closure. |
| Split Hall resolution | `split-hall-resolution-scene-v03.webp` | Selected Chapter 3 resolution scene; Bramwell, Noma, Auntie Lume, Mara, Mossbacks, and Stonekin gather around the evidence table. |
| Mossgarden closing mark | `mossgarden-closing-mark-scene-v01.webp` | Chapter 3 closing scene; Mara and Noma restore a courier mark without relying on baked-in text. |
| Courier Satchel evidence | `courier-satchel-evidence-scene-v01.webp` | Selected Chapter 1 boar-reward scene; Lio's scuffed satchel, crooked false seal, brass badge, and blue-string lunch packet remain legible in the dialogue modal. |
| Bramblecross Watchhouse case wall | `bramblecross-watchhouse-case-wall-scene-v01.webp` | Selected shared evidence master; full scene and focused crops cover the evidence board, duty ledger, wall map, and forged-orders file. |
| Root Cellar evidence wall | `root-cellar-evidence-wall-scene-v01.webp` | Selected shared evidence master; separate crops distinguish the recent coercive Root Sigil from the older communal Route Mural. |
| Chapter 1 ending tableau | `chapter-1-ending-the-road-that-lied-v01.webp` | Selected Chapter 1 completion scene; the fallen Warden, recovered chain, blue watch cloth, and sealed old-road door frame the discovery after the boss climax. |
| Princess Elowen Royal Progress Notice | `princess-elowen-progress-notice-v01.webp` | Selected full-color public broadside shown in the Relay interaction. The waist-up formal likeness uses Elowen's approved sapphire gown without a scenic background; readable copy identifies her as heir apparent, announces her first independent Progress, and states the dated, witnessed, sealed limits of her authority. Full PNG source is preserved under `assets/reference/source-art/assets/scenes/`. |
| Relay forged-authority evidence | `relay-forged-authority-scene-v01.webp` | Selected wide Relay desk comparison. Elowen's lawful blue-and-gold Progress notice and public road appeal sit above the concealed false ledger, copied seal, red route marks, and prisoner tallies, making the public-authority versus secret-criminal-order contrast readable at the exact evidence beat. Full PNG source is preserved under `assets/reference/source-art/assets/scenes/`. |
| Briarhold route-ledger reveal | `briarhold-route-ledger-reveal-scene-v02.webp` | Selected wide Chapter 4 closing evidence scene. Five mundane prisoner-transfer rows fill the scorched working ledger in small clerk handwriting. Lio's `L.B. — courier — alive — refuses route marks` entry sits naturally among the other four records, with `Briarhold Waystation` in the ordinary destination column and neighboring rows using the same destination or ditto marks. Honest distant gold route lights contrast with sickly green lights behind briar hoods. V01's rejected oversized clue-card treatment is preserved as a reference alternate. Full PNG sources are preserved under `assets/reference/source-art/assets/scenes/`. |

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
| Elder Brynn | `mira-portrait-v02.webp` | Warm, wise Hearthhollow elder; approved smoother facial finish. |
| Enna | `enna-portrait-v03.webp` | Black woman, darker skin, tough and focused; approved smoother facial finish. |
| Captain Hollis | `hollis-portrait-v02.webp` | Worn, responsible watch captain; approved smoother facial finish. |
| Nix Fernwhistle | `nix-portrait-v02.webp` | Wiry road-scout and Lantern Road guide; approved smoother facial finish. |
| Pibble Thatch | `pibble-portrait-v02.webp` | Curious, helpful, odd village clue-noticer; approved smoother facial finish. |
| Rowan Reedshield | `rowan-portrait-v03.webp` | Defensive companion; sturdy playable-ancestry look, not fox-person; approved smoother facial finish. |
| Tilda Quickstep | `tilda-portrait-v02.webp` | Quick, clever, mischievous companion; approved smoother facial finish. |
| Moss Fenmere | `moss-portrait-v02.webp` | Mossback companion; calm, rooted, ancient-adjacent; approved smoother facial finish. |
| Ada Willowmarket | `ada-willowmarket-portrait-v02.webp` | Organized market authority and Willow seal identity; approved smoother facial finish. |
| Ada Willowmarket, no lens | `ada-willowmarket-portrait-no-lens-v02.webp` | Smoothed post-borrow variant for after the player takes the Willowmark Lens. |
| Smith Orin | `smith-orin-portrait-v03.webp` | Selected Emberling/fireperson blacksmith direction; approved smoother facial finish. |
| Mayor Anwen | `mayor-anwen-portrait-v02.webp` | Bramblecross civic leader; approved smoother facial finish. |
| Nella the Baker | `nella-portrait-v04.webp` | Selected Tideborn/water-person baker direction; approved smoother facial finish. |
| Toma Fielding | `toma-fielding-portrait-v03.webp` | Selected farmer portrait with clearer tool silhouette and approved smoother facial finish. |
| Sela of the Loom | `miri-portrait-v03.webp` | Selected loom/thread portrait with stronger face variety and approved smoother facial finish. |
| Mara Brindle | `mara-brindle-portrait-v02.webp` | Chapter 2 protected guest portrait; approved smoother facial finish. |
| Edden Vale | `edden-vale-portrait-v02.webp` | Dry-eyed recovery-room witness portrait with the approved smoother facial finish. |
| Lio Brindle | `lio-brindle-portrait-v02.webp` | Smoothed pre-rescue or remembered courier portrait; generate a later rescued variant if needed. |
| Bramwell Gatehand | `bramwell-gatehand-portrait-v02.webp` | Chapter 3 Stonekin gatehand; distinct elder/gate-tool silhouette and approved smoother facial finish. |
| Quill Pebbleturn | `quill-pebbleturn-portrait-v02.webp` | Chapter 3 Rootmarket technician with lantern-shutter identity and approved smoother facial finish. |
| Auntie Lume | `auntie-lume-portrait-v03.webp` | Chapter 3 Rootmarket host portrait with the approved warmer composition and smoother facial finish. |
| Noma Greenstill | `noma-greenstill-portrait-v03.webp` | Chapter 3 Mossgarden memory-keeper portrait; older, steady, and smoothly rendered. |
| Westroot Rootbread Child | `westroot-rootbread-child-portrait-v03.webp` | Young Mossback girl with the Transfer Checkpoint/rootbread story read and approved smoother facial finish. |
| Worried Road Traveler | `worried-road-traveler-portrait-v02.webp` | Smoothed generic traveler; includes baked-in sign text, so use sparingly. |
| Princess Elowen | `princess-elowen-portrait-v02.webp` | Approved canonical traveling profile with the smoother royal-family facial finish: a human heir in her early twenties who strongly resembles her Coraveni-born, Sunreach-heritage mother, with blue-green eyes inherited from her Hearthvale father. Practical scholar-princess attire, quiet warmth, and regal authority; no satchel and no held map tool. |
| Princess Elowen, formal royal portrait | `princess-elowen-royal-portrait-v02.webp` | Approved smoothed official likeness in an ornate sapphire fairy-tale gown on a palace-garden terrace. This is the identity and costume source for public royal portraiture and the Progress Notice. Full PNG sources for both Elowen portraits are preserved under `assets/reference/source-art/assets/portraits/characters/`. |
| Queen Isara of Coravene | `queen-isara-portrait-v01.webp` | Approved canonical Chamber of Compacts profile: a very dark-skinned Coraveni-born queen of Sunreach heritage, age fifty-three, with an entirely black sculptural updo and dark amber eyes. Her pearl-white sleeveless high-collared gown, saturated teal cape and lining, wave-and-frond embroidery, shell clasps, compact sea-glass earrings, restrained pearl necklace, and sunlit pale-stone Hearthvale chamber preserve both her foreign-born royal identity and present authority. Facial and skin rendering uses the approved smoother portrait finish. |
| King Edran of Alderreach | `king-edran-portrait-v01.webp` | Approved canonical seated council profile: a broad sixty-three-year-old Hearthvale human with former-blond silver-gray hair, a groomed gray beard, and Elowen's clear blue-green eyes. He sits upright with relaxed hands in a restrained pale council chair, wearing formal navy, royal green, bright gold alder embroidery, and a narrow circlet before charter banners. His bearing balances settled royal authority, patience, kindness, scholarship, and private weariness. |

The versioned portrait-smoothing batch is documented in `docs/art/portrait-smoothing-pass.md`. All twenty-six candidates were owner-approved on 2026-08-22, promoted as new versioned source masters, optimized as runtime WebPs, and wired into the game. The original comparison materials remain under `assets/reference/concepts/portrait-smoothing/`; superseded runtime derivatives are preserved under `assets/reference/alternates/assets/portraits/characters/`.

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
| Briar Cargo Runner | `briar-cargo-runner-v01.webp` | Chapter 3 cargo encounter portrait; clear runner/smuggler silhouette. |
| Seal-Forged Sentry | `seal-forged-sentry-v01.webp` | Chapter 3 cargo encounter portrait; false-seal, wax, and sentry identity stay readable at battle-card size. |
| Briar Relay Guard | `briar-relay-guard-v02.webp` | Smoothed Chapter 4 production portrait. The hooked gate-polearm, defensive stance, relay masonry, and signal hardware match his guard-and-brace combat kit. |
| Crown Whisperer | `crown-whisperer-v02.webp` | Smoothed Chapter 4 production portrait. The composed infiltrator, whispering hand, sealed papers, and relay shadows match her Shaken debuff and Guard-piercing pressure. |

---

# Generated But Not Selected

| Asset | Notes |
|---|---|
| First busier Chapter 1 key art | Too many lanterns/lights; useful style reference. |
| First Hearthhollow concept map with baked-in labels | Nice concept, but too much text for gameplay map. |
| Princess Elowen profile candidates v01-v02 | Superseded identity passes retained under `assets/reference/concept/characters/princess-elowen/`; v03 was promoted as the production traveling portrait. |
| Briar Relay Post candidates v01-v02 | Earlier unlit and first lit room passes retained under `assets/reference/concept/environments/chapter-4-briar-relay-post/`; the final pass replaces the placeholder broadside with Elowen's approved Progress Notice. |
| Hearthhollow map with boar sign above gate | Rejected; south gate should not have permanent boar warning sign. |
| Earlier `briar-crown-primary-mark-v01.png` candidate from 2026-07-16 | Rejected; strong silhouette, but the checkerboard was painted into an opaque RGB image. Superseded by the selected true-alpha regeneration. |
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
- Chapter 4 captive porter and relay captain portraits
- Optional post-rescue Lio portrait

## Enemies

- Thornseal Guard
- Thornroot Sentry

## Symbols / UI

- Optional expanded Briar Crown symbol sheet; the primary production mark is complete
- Lantern Road symbol sheet
- custom item icons beyond the completed Chapters 1-4 sets
- skill icon sheet
- parchment dialogue panel
- quest journal panel
- battle pouch UI treatment

| Asset | Suggested filename | Notes |
|---|---|---|
| Briar Crown primary mark | `assets/icons/ui/briar-crown-primary-mark-v01.png` | Selected true-alpha PNG wired into the Root Cellar discovery and Bramblecross report-back dialogues. Full-size source is preserved under `assets/reference/source-art/`. |
| Crown Den distant scratching icon | `assets/icons/ui/crown-den-distant-scratching-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. |
| Crown Den chain drag icon | `assets/icons/ui/crown-den-chain-drag-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. |
| Crown Den hound warning icon | `assets/icons/ui/crown-den-hound-warning-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. Reads primarily as the thorn collar, which fits the false-command beat. |
| Crown Den patrol caught up icon | `assets/icons/ui/crown-den-patrol-caught-up-icon-v01.png` | Transparent PNG wired into the Crown Door Den tension strip. |
| Crown Den pursuit tension master sheet | `assets/icons/ui/crown-den-pursuit-tension-master-sheet-v01.png` | Reference-only sheet for the tension icon generation. The individual transparent PNGs are the production assets. |
| Level-up Power emblem | `assets/icons/ui/level-up-power-v01.png` | Optimized 512 px true-alpha storybook emblem; hatchet cutting through briar. |
| Level-up Resolve emblem | `assets/icons/ui/level-up-resolve-v01.png` | Optimized 512 px true-alpha storybook emblem; roadwarden shield braced against roots. |
| Level-up Cleverness emblem | `assets/icons/ui/level-up-cleverness-v01.png` | Optimized 512 px true-alpha storybook emblem; map revealing the honest route. |
| Level-up Heart emblem | `assets/icons/ui/level-up-heart-v01.png` | Optimized 512 px true-alpha storybook emblem; hands sheltering a road lantern. |
| Level-up Craft emblem | `assets/icons/ui/level-up-craft-v02.png` | Optimized 512 px true-alpha storybook emblem; well-used handcrafting tools. Full-size masters, the earlier Craft choice, and checkerboard source deliveries are preserved under `assets/reference/`. |

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

## Selected Shared Evidence Art

| Evidence | Selected asset | Notes |
|---|---|---|
| Willowmark Seal | `assets/icons/ui/willowmark-seal-v02.png` | Selected over v1 because the maker's nick in the left leaf is subtle enough to reward Ada's Willowmark Lens instead of announcing the defect at ordinary viewing size. Used on the completed Watchhouse case wall. |

---

## Selected Chapter 3 Story-Item Icons

| Item | Selected asset | Notes |
|---|---|---|
| Rootbread Charm | `assets/icons/items/rootbread-charm-icon-v01.png` | Production-ready wearable support trinket; distinct warm bread-and-knot silhouette, with stronger healing/guard utility than the Lantern Pin. |
| Witness Stone Rubbing | `assets/icons/items/witness-stone-rubbing-icon-v02.png` | Selected correction: a loose charcoal crown-mark rubbing, not a book. |
| Cargo Transfer Tag | `assets/icons/items/cargo-transfer-tag-icon-v02.png` | Selected correction: a tied freight tag with a seal, not a scroll. |

---

## Selected Chapter 4 Item Icons

The complete Chapter 4 set is promoted into `src/data/itemArtwork.ts`; the item emoji remain as fallback content.

| Item | Selected asset | Notes |
|---|---|---|
| Folded Map Scrap | `assets/icons/items/folded-map-scrap-icon-v01.png` | Worn two-sided survey fragment; supports the map-puzzle identity without implying the retired Lanternwell cache. |
| Gatewright Hookblade | `assets/icons/items/gatewright-hookblade-icon-v01.png` | Compact hooked passage tool with a quick, close-control silhouette. |
| Gatewright Passage Pike | `assets/icons/items/gatewright-passage-pike-icon-v01.png` | Long defensive reach weapon built for narrow civic tunnels. |
| Gatewright Counterweight Maul | `assets/icons/items/gatewright-counterweight-maul-icon-v01.png` | Heavy architectural tool-weapon with a clear counterweight read. |
| Ironroot Ribplate | `assets/icons/items/ironroot-ribplate-icon-v01.png` | Root-braced fitted armor with Underway craft language. |
| Low-Arch Roothelm | `assets/icons/items/low-arch-roothelm-icon-v01.png` | Compact protective helm shaped for constrained passages. |
| Old Waykeeper Helm | `assets/icons/items/old-waykeeper-helm-icon-v01.png` | Distinct weathered route-cache reward with older civic construction. |
| Lio's Courier Knot | `assets/icons/items/lios-courier-knot-icon-v01.png` | Blue courier-string evidence token from the last Listening Mile hood. |

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
