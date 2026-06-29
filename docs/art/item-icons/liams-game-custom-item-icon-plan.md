# Liam's Game - Custom Item Icon Art Plan

## Decision

Use custom painted object art for item icons instead of paper-doll equipment overlays.

The game should still avoid stock-looking item icons. Each important item should eventually have its own small storybook illustration, but the art no longer needs to align to a character body, rig, hand anchor, or equipment layer stack.

## Why This Replaces Paper Doll Gear

The paper-doll proof loop showed that AI can paint useful equipment concepts, but exact pose alignment, transparency, and layer fitting require too much manual work for the current project stage.

Custom item icon art keeps the good part:

- hand-painted item identity
- readable gear, consumables, clues, and rewards
- consistent storybook style
- artwork that can be generated one item at a time

It drops the expensive part:

- per-rig fitting
- boot/hand/torso alignment
- body-layer QA
- custom offsets for every wearable

## UI Model

Item UI should render in this order:

1. Custom item artwork if a production icon exists.
2. Emoji fallback if artwork is missing or fails to load.

Do not remove emoji fallbacks. They are still useful while the icon set is incomplete and they keep the game playable if an asset path breaks.

## Production Folder

Use this folder for final item artwork:

```text
assets/icons/items/
```

Suggested naming:

```text
old-hatchet-icon-v01.png
briarweave-vest-icon-v01.png
village-boots-icon-v01.png
healing-fizzpop-icon-v01.png
willowmark-lens-icon-v01.png
eddens-three-door-drawing-icon-v01.png
```

Keep experimental proof art in `art/` or `assets/concept/`. Only copy or export cleaned, game-ready icon images into `assets/icons/items/`.

## Icon Art Specs

Recommended first production specs:

- square PNG, 768 x 768 or 1024 x 1024 master
- transparent background preferred
- object fills most of the frame without touching edges
- readable at 40 to 64 px in UI
- subtle painterly texture
- warm storybook lighting
- no stock vector style
- no generic mobile-game gloss
- no fake checkerboard background
- no text baked into the image

The object can be angled or staged lightly, but it should remain an item portrait, not a scene.

## Prompt Base

Use this base for item icon generation:

```text
Create a custom storybook fantasy item icon for Liam's Game. Paint a single object as a warm hand-painted illustration with subtle brush texture, gentle ink-like definition, and cozy adventure tone. The object should be centered, readable at small UI size, and isolated on a transparent background. It should look like bespoke game artwork, not stock vector art or a generic app icon. No text, no label, no UI frame, no checkerboard background.
```

Add the specific item description after that block.

## Current Proof Assets

The paper-doll proof files are not production icons, but several can guide future item art:

| Source asset | Evaluation | Use |
|---|---|---|
| `art/characters/hero/equipment/m_standard/proof_set/equip_mainhand_old_hatchet.png` | Strong custom object silhouette, but RGB with fake checkerboard background. | Good style/source reference; needs regeneration or cleanup for icon use. |
| `art/characters/hero/equipment/m_standard/proof_set/equip_torso_briarweave_vest_m_standard.png` | Good painted vest concept, but RGB with fake checkerboard background. | Good source reference; needs square icon crop/regeneration. |
| `art/characters/hero/equipment/m_standard/proof_set/equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png` | Has alpha, but framed as a rig overlay with too much blank canvas. | Usable concept/reference; needs icon-specific composition. |

## First Icon Batch

Start with items already visible in Chapter 1 UI:

1. Old Hatchet
2. Turnipwood Blade
3. Pebbleknock Hammer
4. Apprentice Kettle Helm
5. Briarweave Vest
6. Giggleleaf Cloak
7. Friendmaker Cloak
8. Stormbell Charm
9. Lantern Pin
10. Warden Chain
11. Healing Fizzpop
12. Trail Snack
13. Fizzberry Handpie
14. Bubbleburst Tonic
15. Moonmint
16. Bubblecap Mushroom
17. Edden's Blue Watch Cloth

Chapter 2 should add:

1. Edden's Three-Door Drawing
2. Willowmark Lens
3. Broken False Seal Wax
4. Pine-Pitch Wax
5. No-Handle Token
6. Witness Note for Bramblecross

## Acceptance Checklist

An item icon is ready when:

- it is a real image asset in `assets/icons/items/`;
- it has no fake transparency background;
- it reads clearly at inventory, shop, pouch, and loot sizes;
- it matches the storybook fantasy art direction;
- the corresponding item still has an emoji fallback in data;
- the app builds after the icon is wired into `src/data/itemArtwork.ts`.
