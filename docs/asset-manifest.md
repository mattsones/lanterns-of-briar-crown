# Liam’s Game — Asset Manifest

This document tracks selected and planned assets for Chapter 1.

## Naming Convention

Use descriptive kebab-case filenames.

```text
chapter-1-lantern-road-key-art-v02.png
hearthhollow-map-concept-v03.png
mira-portrait-v01.png
enna-portrait-v02.png
```

## Folder Convention

```text
assets/
  concept/
    key-art/
    environments/
    characters/
  maps/
  portraits/
    characters/
  icons/
    items/
    skills/
    ui/
  source-prompts/
```

Concept art should remain in `assets/concept/`.

Production-ready versions can later be copied into `assets/maps/`, `assets/portraits/`, or `assets/icons/`.

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

---

# Selected First-Pass Assets

## Key Art

| Asset | Suggested filename | Notes |
|---|---|---|
| Chapter 1 key art, hero on Lantern Road | `chapter-1-lantern-road-key-art-v02.png` | Cleaner version with fewer lights; keep as style anchor. |

## Environments

| Asset | Suggested filename | Notes |
|---|---|---|
| Hearthhollow gameplay map | `hearthhollow-gameplay-map-v04.png` | Current clean production map; icon-free version of the cozy village layout. |
| Lantern Road gameplay map | `lantern-road-gameplay-map-v02.png` | Current clean production map; icon-free version of the winding road layout. |
| Bramblecross town concept | `bramblecross-town-concept-v01.png` | Practical, square, guarded town layout. |
| Root Cellar map concept | `root-cellar-map-concept-v01.png` | Strong layout; Warden visibly blocks sealed door. |
| Westroot Trail gameplay map | `westroot-trail-map-v04.png` | Current Chapter 2 production map; readable Shelter Nook, false notice, Three-Sign Hollow, Roadwatcher bend, and First Westroot Gate. |

## Characters

| Character | Suggested filename | Notes |
|---|---|---|
| Elder Mira | `mira-portrait-v01.png` | Warm, wise Hearthhollow elder. |
| Enna | `enna-portrait-v02.png` | Black woman, darker skin, tough and focused. |
| Captain Hollis | `hollis-portrait-v01.png` | Worn, responsible watch captain. |
| Nix Fernwhistle | `nix-portrait-v01.png` | Wiry road-scout, Lantern Road guide. |
| Pibble Thatch | `pibble-portrait-v01.png` | Curious, helpful, odd village clue-noticer. |
| Rowan Reedshield | `rowan-portrait-v02.png` | Defensive companion; sturdy playable-ancestry look, not fox-person. |
| Tilda Quickstep | `tilda-portrait-v01.png` | Quick, clever, mischievous companion. |
| Moss Fenmere | `moss-portrait-v01.png` | Mossback companion; calm, rooted, ancient-adjacent. |

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

- Ada Willowmarket
- Smith Orin
- Mayor Anwen
- Nella the Baker
- Toma Fielding
- Miri of the Loom
- Edden Vale
- Lio Brindle
- Mara

## Enemies

- Bramble Boar
- Thorncoat Ruffian
- Thorny Hound
- Rustroot Skulk
- Briar Knot Warden

## Symbols / UI

- Briar Crown symbol sheet
- Lantern Road symbol sheet
- custom item icon set
- skill icon sheet
- parchment dialogue panel
- quest journal panel
- battle pouch UI treatment

## Hero Assets

- default hero portrait or full-body key illustration
- curated race/ancestry hero portraits later if needed
- fixed major-look hero art only if chapter milestones justify it

Do not prioritize dynamic visible gear overlays. Equipment should be represented through custom item icons, combat skills, loot cards, and inventory/equipment UI.

---

# Existing Item-Art Proof Assets

The generated paper-doll proof files are not production item icons, but they are useful as style and subject references:

| Source asset | Status | Notes |
|---|---|---|
| `art/characters/hero/equipment/m_standard/proof_set/equip_mainhand_old_hatchet.png` | Reference only | Strong custom painted hatchet, but stored as RGB with a fake checkerboard background. Regenerate or clean before production icon use. |
| `art/characters/hero/equipment/m_standard/proof_set/equip_torso_briarweave_vest_m_standard.png` | Reference only | Good Briarweave Vest concept, but stored as RGB with a fake checkerboard background. Regenerate or clean before production icon use. |
| `art/characters/hero/equipment/m_standard/proof_set/equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png` | Reference only | Has alpha, but composition is a full paper-doll canvas with too much blank area. Needs icon-specific crop or regeneration. |

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
