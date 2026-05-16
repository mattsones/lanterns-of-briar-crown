# Liam’s Game — Player Character Art Production Spec v1

This document defines the first-pass production spec for the **player character art and equipment layering system** in **Liam’s Game / Lanterns of Briar Crown**.

It is intended for repo storage and future use during asset generation, naming, implementation, and testing.

This spec follows the project’s storybook fantasy art direction: hand-painted warmth, subtle painterly texture, expressive but grounded characters, and a readable paper-doll style layering system. See the main art direction document for the broader visual rules and mood. fileciteturn5file0

---

## 1. Goal

Create a **layered paper-doll player character system** that supports:

- 8 races
- male / female
- 16 total base hero figures
- visible gear layering
- simple and clean implementation
- strong readability in a storybook fantasy style

The system should feel curated and manageable rather than like a modern freeform RPG character creator.

---

## 2. Locked Core Decisions

### 2.1 Rig Model

Use a **4-rig model**:

1. Male Standard
2. Female Standard
3. Male Stocky
4. Female Stocky

### 2.2 Race-to-Rig Mapping

**Standard rigs**
- Human
- Sylvan
- Emberling
- Tideborn
- Cloudling
- Moonmark

**Stocky rigs**
- Stonekin
- Mossback

Each race still receives a distinct racial identity through:
- head/face design
- hair
- ears / horns / bark / stone / moss / other ancestry traits
- skin tone / texture / color identity
- subtle silhouette flavor

Equipment is fitted to the **rig family**, not uniquely to every race.

### 2.3 Base Character Count

Generate **16 base hero figures**:
- Human male / female
- Stonekin male / female
- Sylvan male / female
- Emberling male / female
- Tideborn male / female
- Cloudling male / female
- Mossback male / female
- Moonmark male / female

### 2.4 Pose

All full-body hero bases and layerable equipment must use one canonical standing pose.

**Locked pose description:**
- full-body
- slight 3/4 front-facing body orientation
- head turned to look directly at the viewer
- relaxed but ready
- feet planted
- shoulders natural
- right arm positioned to hold a one-handed weapon
- left arm positioned to hold offhand gear or rest naturally
- enough arm separation from torso to allow clean layering
- silhouette must support cloak, gloves, boots, and visible gear

This pose must remain consistent across all 16 base bodies.

---

## 3. Rendering Style Requirements

### 3.1 Style
- storybook fantasy
- hand-drawn / hand-painted warmth
- subtle painterly texture
- expressive but grounded
- not photorealistic
- not anime
- not glossy digital fantasy art
- not 3D-rendered
- not overly cartoonish

### 3.2 Texture
- soft brushwork
- watercolor / gouache-inspired layering
- gentle paper-grain suggestion
- light ink-like definition where helpful
- readable at game size

### 3.3 Readability
Each hero must read clearly by:
- race
- gender
- rig family
- equipped silhouette

---

## 4. Master Canvas and File Specs

### 4.1 Full-Body Master Art Size
**1200 × 1800 px**

This is the master working size for all player character layers.

### 4.2 File Format
All player art assets should be delivered as:
- PNG
- transparent background
- identical canvas dimensions
- identical alignment system

### 4.3 Canvas Rules
Every hero base and every layer must:
- use the same canvas size
- keep feet aligned to the same baseline
- keep body centered consistently
- use the same camera distance
- use the same perspective
- use the same body pose standard

No drift between assets.

---

## 5. Base Hero Rules

### 5.1 Base Figures Include
Each base figure should include:
- full body
- race-specific visual identity
- curated default face
- default hair
- simple starter underclothes / neutral base outfit
- visible hands
- visible feet / basic simple shoes if needed for base modesty/readability
- no equipped armor overlays
- no cloak
- no hat or helmet
- no equipped weapon
- no equipped visible trinket unless it is biologically or culturally inseparable from the race design

### 5.2 Facial Customization
**No granular facial customization in v1.**

That means no:
- face sliders
- hair selector
- eye selector
- mouth selector
- beard selector
- nose selector

Each race/gender combination uses one curated base appearance.

---

## 6. Layer Stack and Equipment Slots

### 6.1 Layer Order (back to front)
1. Base Body
2. Base Underclothes / Default Outfit
3. Torso Clothing / Armor
4. Cloak / Back Garment
5. Boots / Shoes
6. Gloves / Handwear
7. Headwear
8. Main Hand
9. Offhand
10. Visible Trinket
11. Back Weapon / Back-Carried Large Gear (future slot)
12. Front Overlay / Effects (reserved)

> Note: In engine implementation, some slot rendering order may need adjustment depending on visual overlap, but this is the production-spec default.

### 6.2 Launch Equipment Slots
Support these slots from the start:
- Base
- Torso
- Cloak / Back Garment
- Boots / Shoes
- Gloves / Handwear
- Headwear
- Main Hand
- Offhand
- Visible Trinket

### 6.3 Future Large Weapons / Back-Carried Gear
Future large weapons should **not** replace the cloak slot.

Large or awkward gear should use a **separate future slot**:
- Back Weapon / Back-Carried Gear

Examples:
- bows
- staves
- spears
- large axes
- very large shields

This keeps cloaks and back-carried weapons conceptually separate.

---

## 7. Slot Rules

### 7.1 Headwear
Includes:
- hats
- hoods
- helmets

Variants needed:
- m_standard
- f_standard
- m_stocky
- f_stocky

### 7.2 Torso
Includes:
- tunics
- armor
- robes
- vests

Variants needed:
- m_standard
- f_standard
- m_stocky
- f_stocky

### 7.3 Cloak / Back Garment
Includes:
- cloaks
- capes
- short mantles
- simple back garments

Variants needed:
- m_standard
- f_standard
- m_stocky
- f_stocky

### 7.4 Boots / Shoes
Includes:
- shoes
- boots
- greaves if needed later

Variants needed:
- m_standard
- f_standard
- m_stocky
- f_stocky

### 7.5 Gloves / Handwear
Includes:
- gloves
- mitts
- wraps
- gauntlets later

Variants needed:
- m_standard
- f_standard
- m_stocky
- f_stocky

### 7.6 Main Hand
Includes:
- hatchet
- sword
- hammer
- wand
- torch
- simple one-handed item

Default variants:
- 1 shared version per item

### 7.7 Offhand
Includes:
- shield
- lantern
- book
- simple tool

Default variants:
- 1 shared version per item

If a specific offhand item becomes too difficult to align, either:
- create special alternates later, or
- move it to Back-Carried Gear

### 7.8 Visible Trinket
Only **one visible trinket slot** is supported.

Use this slot only for trinkets large enough to matter visually, such as:
- Lantern Pin
- Stormbell Charm
- Warden Chain
- visible pendant, brooch, or chest charm

Variants needed:
- m_standard
- f_standard
- m_stocky
- f_stocky

Not every trinket in the game needs paper-doll art.

---

## 8. Anchor Points

All character and equipment art must obey fixed logical anchor zones.

### Required Anchors
- Head anchor
- Neck / chest anchor
- Torso / shoulder zone
- Waist zone
- Cloak origin
- Right hand anchor
- Left hand anchor
- Boot / foot zone
- Glove / handwear zone
- Back-weapon anchor (future)
- Feet baseline

### Anchor Intent
**Head anchor** — hats, helmets, hoods  
**Chest anchor** — trinkets, pins, chains  
**Cloak origin** — cloaks / back garments  
**Right hand anchor** — main-hand item  
**Left hand anchor** — offhand item  
**Boot zone** — shoe / boot placement  
**Glove zone** — gloves / wraps / gauntlets  
**Back-weapon anchor** — future bows, staves, large gear  
**Feet baseline** — all figures stand at the same visual floor level

---

## 9. Portrait Strategy

Hero portraits are a **related but separate asset track**.

### Locked direction
- portraits are not fully dynamic in v1
- start with static hero base portraits
- major visible gear updates may be explored later for:
  - helmet
  - cloak
  - iconic trinket

Do not build the portrait system as a fully equipment-reactive paper doll in v1.

---

## 10. Naming Convention

### 10.1 Base Heroes
`hero_base_{race}_{gender}_{rig}.png`

Examples:
- `hero_base_human_m_standard.png`
- `hero_base_human_f_standard.png`
- `hero_base_stonekin_m_stocky.png`
- `hero_base_mossback_f_stocky.png`

### 10.2 Torso
`equip_torso_{item}_{gender}_{rig}.png`

### 10.3 Headwear
`equip_head_{item}_{gender}_{rig}.png`

### 10.4 Cloak / Back Garment
`equip_cloak_{item}_{gender}_{rig}.png`

### 10.5 Boots / Shoes
`equip_boots_{item}_{gender}_{rig}.png`

### 10.6 Gloves / Handwear
`equip_gloves_{item}_{gender}_{rig}.png`

### 10.7 Main Hand
`equip_mainhand_{item}.png`

### 10.8 Offhand
`equip_offhand_{item}.png`

### 10.9 Trinket
`equip_trinket_{item}_{gender}_{rig}.png`

### 10.10 Back Weapon / Back-Carried Gear (future)
`equip_backgear_{item}_{gender}_{rig}.png`

---

## 11. Folder Structure

Recommended repo structure:

```text
art/
  characters/
    hero/
      base/
      torso/
      head/
      cloak/
      boots/
      gloves/
      mainhand/
      offhand/
      trinket/
      backgear/
      portraits/
      references/
      templates/
      rig-guides/
      test-composites/
```

---

## 12. First-Wave Asset List

### 12.1 Base Hero Set
- all 16 base hero figures

### 12.2 Torso
- starter tunic / base torso if needed separately
- Briarweave Vest

### 12.3 Headwear
- Apprentice Kettle Helm

### 12.4 Cloak
- Giggleleaf Cloak

### 12.5 Boots
- simple village boots
- simple travel shoes (optional if boot slot needs immediate variety)

### 12.6 Gloves
- none required immediately for gameplay, but slot exists
- first likely glove asset can wait until needed

### 12.7 Main Hand
- Old Hatchet
- Turnipwood Blade
- Pebbleknock Hammer

### 12.8 Trinkets
- Lantern Pin
- Stormbell Charm

### 12.9 Optional Early Offhand
- simple lantern
- simple shield

---

## 13. Production Workflow

### Phase 1 — Rig and Template Lock
1. define the 4 rig silhouettes
2. define the canonical pose
3. define anchor behavior
4. define layer order
5. create style test plan

### Phase 2 — Style Test
Create one complete proof-of-concept set:
- 1 base hero
- 1 torso item
- 1 head item
- 1 cloak
- 1 pair of boots
- 1 weapon
- 1 visible trinket

Then test compositing.

### Phase 3 — Base Hero Production
Generate all 16 base hero figures.

### Phase 4 — Equipment Wave 1
Generate first-wave visible gear.

### Phase 5 — Composite Testing
Test combinations across:
- male standard
- female standard
- male stocky
- female stocky

### Phase 6 — Expansion
Expand slot coverage and gear library only after the system is proven.

---

## 14. Acceptance Criteria

### Base hero approved if:
- matches art direction
- consistent pose
- consistent framing
- clearly readable race/gender identity
- clean transparency
- aligns to the proper rig family

### Wearable item approved if:
- fits intended rig cleanly
- layers without awkward overlap
- preserves silhouette readability
- matches storybook style

### Weapon / offhand item approved if:
- aligns correctly to hand anchor
- reads clearly
- does not float or clip badly
- scales consistently across rigs

### Trinket approved if:
- is visible enough to justify the slot
- avoids clutter
- sits cleanly in chest / pin / necklace area

---

## 15. Do-Not-Do List for v1

Do not do the following in v1:
- full facial customization
- per-race bespoke armor fitting beyond rig families
- dynamic portraits for every equipment change
- visual representation for every trinket in the game
- complex two-handed in-hand weapon posing
- complex ranged-weapon in-hand posing
- over-expanding the slot count beyond what is needed

---

## 16. Immediate Next Steps

1. Create a checklist and style-test plan.
2. Create rig reference definitions for the 4 rig families.
3. Produce one proof-of-concept hero layering set.
4. Verify compositing.
5. Proceed to full base hero production.

