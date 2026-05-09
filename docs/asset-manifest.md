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

# Selected First-Pass Assets

## Key Art

| Asset | Suggested filename | Notes |
|---|---|---|
| Chapter 1 key art, hero on Lantern Road | `chapter-1-lantern-road-key-art-v02.png` | Cleaner version with fewer lights; keep as style anchor. |

## Environments

| Asset | Suggested filename | Notes |
|---|---|---|
| Hearthhollow gameplay map concept | `hearthhollow-map-concept-v03.png` | Cozy village; simple south gate; no boar sign. |
| Lantern Road gameplay map concept | `lantern-road-map-concept-v01.png` | Winding magical road; shrine, ruin, camp, cart, cache, ambush path. |
| Bramblecross town concept | `bramblecross-town-concept-v01.png` | Practical, square, guarded town layout. |
| Root Cellar map concept | `root-cellar-map-concept-v01.png` | Strong layout; Warden visibly blocks sealed door. |

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
| First Rowan human portrait | Too human/soft for defensive non-human companion. |
| Rowan fox-person portrait | Good art, but fox-person was not one of the intended playable ancestries. Could be repurposed as a future roadside trickster NPC. |

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
- item icon sheet
- skill icon sheet
- parchment dialogue panel
- quest journal panel
- battle pouch UI treatment

## Hero Assets

- default hero full-body
- customizable race/ancestry base bodies
- gender presentation variations
- visible gear overlays
- weapon variants
- trinket variants

---

# Art Integration Notes

Use selected art first as concept and documentation.

Safe integration order:

1. Add assets to repo.
2. Reference selected portraits in NPC data.
3. Display portrait images in dialogue with emoji fallback.
4. Add map backgrounds behind current tile maps as experiments.
5. Replace item icons gradually.
6. Add UI panels after gameplay remains stable.

Avoid replacing the tile system with freeform movement for now.
