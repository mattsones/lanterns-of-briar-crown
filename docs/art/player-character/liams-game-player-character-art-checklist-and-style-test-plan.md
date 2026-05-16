# Liam’s Game — Player Character Art Checklist and Style Test Plan

This document translates the player character art production spec into a practical working plan.

---

## 1. Immediate Working Goals

Before generating the full 16-character base set, complete three tasks:

1. Lock the 4-rig reference model.
2. Define the style-test asset bundle.
3. Validate that layered compositing works cleanly.

---

## 2. Four-Rig Reference Plan

The purpose of the rig reference plan is **not** to create final art immediately. It is to define the underlying body families so all later assets align correctly.

### 2.1 Rig Definitions

#### A. Male Standard
Use for:
- Human
- Sylvan
- Emberling
- Tideborn
- Cloudling
- Moonmark

Qualities:
- average heroic build
- youthful adventurer silhouette
- practical proportions
- readable shoulders / waist / hand positions

#### B. Female Standard
Use for:
- Human
- Sylvan
- Emberling
- Tideborn
- Cloudling
- Moonmark

Qualities:
- average heroic build
- practical and grounded
- not exaggerated
- strong readability for torso, cloak, boots, and headwear

#### C. Male Stocky
Use for:
- Stonekin
- Mossback

Qualities:
- broader torso
- heavier stance
- slightly shorter / denser silhouette feel if desired
- strong anchor readability for armor and boots

#### D. Female Stocky
Use for:
- Stonekin
- Mossback

Qualities:
- sturdy and grounded
- broader, denser silhouette than standard rig
- still readable and warm, not caricatured

---

## 3. Canonical Pose Checklist

Every rig must use the same pose rules.

### Pose checklist
- [ ] body in slight 3/4 front-facing orientation
- [ ] head turned to look directly at viewer
- [ ] feet planted and aligned to shared baseline
- [ ] right hand positioned for one-handed weapon display
- [ ] left hand positioned for offhand or neutral open hold
- [ ] arms separated enough for torso/cloak layering
- [ ] silhouette supports cloak, boots, and gloves
- [ ] no pose drift across rigs

---

## 4. Style Test Plan

The style test should prove three things:

1. the art style feels right
2. the layering system works
3. the naming / slot structure is practical

### 4.1 Recommended Style Test Character

Use:
- **Human Male Standard**

Reason:
- easiest neutral starting point
- good baseline for checking proportions and layering
- simplest test case before more race-specific silhouettes

### 4.2 Style Test Asset Bundle

Generate the following as the first proof-of-concept set:

#### Base
- `hero_base_human_m_standard.png`

#### Torso
- `equip_torso_briarweave_vest_m_standard.png`

#### Headwear
- `equip_head_apprentice_kettle_helm_m_standard.png`

#### Cloak
- `equip_cloak_giggleleaf_cloak_m_standard.png`

#### Boots
- `equip_boots_village_boots_m_standard.png`

#### Main Hand
- `equip_mainhand_old_hatchet.png`

#### Trinket
- `equip_trinket_lantern_pin_m_standard.png`

Optional add-on for testing:
- `equip_offhand_small_shield.png`

---

## 5. Style Test Review Criteria

When the style test is generated, review each of these:

### 5.1 Style Review
- [ ] feels like storybook fantasy
- [ ] painterly but readable
- [ ] not too glossy or digital
- [ ] emotionally warm and sincere
- [ ] consistent with main art direction

### 5.2 Pose / Rig Review
- [ ] base pose looks natural
- [ ] head-looking-at-viewer works well
- [ ] stance supports layering
- [ ] proportions feel right for future reuse

### 5.3 Layering Review
- [ ] torso fits base cleanly
- [ ] cloak layers without clipping badly
- [ ] boots align to feet correctly
- [ ] headwear aligns correctly
- [ ] trinket sits in readable chest area
- [ ] weapon aligns correctly in right hand
- [ ] silhouette remains readable when all are combined

### 5.4 Production Review
- [ ] asset naming is practical
- [ ] slot definitions still feel right
- [ ] no unexpected overlap problems require spec changes

---

## 6. Composite Test Set

After the first style test is approved, make test composites for all 4 rig families using equivalent gear.

### Composite targets
- [ ] Human Male Standard equivalent test
- [ ] Human Female Standard equivalent test
- [ ] Stonekin Male Stocky equivalent test
- [ ] Mossback Female Stocky equivalent test

The goal is to prove the slot structure holds across both rig families.

---

## 7. Production Checklist for Full Base Set

After style-test approval:

### 7.1 Base Hero Production Checklist
- [ ] human male
- [ ] human female
- [ ] stonekin male
- [ ] stonekin female
- [ ] sylvan male
- [ ] sylvan female
- [ ] emberling male
- [ ] emberling female
- [ ] tideborn male
- [ ] tideborn female
- [ ] cloudling male
- [ ] cloudling female
- [ ] mossback male
- [ ] mossback female
- [ ] moonmark male
- [ ] moonmark female

---

## 8. Equipment Wave 1 Checklist

### Torso
- [ ] Briarweave Vest (4 rig variants)

### Headwear
- [ ] Apprentice Kettle Helm (4 rig variants)

### Cloak
- [ ] Giggleleaf Cloak (4 rig variants)

### Boots
- [ ] Village Boots (4 rig variants)

### Gloves
- [ ] none required yet

### Main Hand
- [ ] Old Hatchet
- [ ] Turnipwood Blade
- [ ] Pebbleknock Hammer

### Trinkets
- [ ] Lantern Pin (4 rig variants)
- [ ] Stormbell Charm (4 rig variants)

### Optional Offhand
- [ ] Small Shield
- [ ] Lantern

---

## 9. Future Slot Planning Notes

These are intentionally deferred, not rejected.

### Gloves
The slot is part of the structure now, but can remain lightly used until gameplay needs it.

### Back-Carried Gear
Maintain as a separate future slot so cloaks do not have to compete with bows, staves, or other large carried items.

### Portrait Variants
Not part of v1 paper-doll implementation.

---

## 10. Recommended Generation Order

1. Rig definition confirmation
2. Human male style test bundle
3. Review and adjust
4. Equivalent test across the 4 rigs
5. Generate all 16 base heroes
6. Generate equipment wave 1
7. Composite test and implementation prep

---

## 11. What We Are Optimizing For

This system should optimize for:
- consistency
- warmth
- clarity
- manageable production scope
- reusability
- future expansion without asset chaos

The right standard is not “maximum customization.”

The right standard is:

> a beautiful, readable, storybook paper-doll hero system that feels personal, even with curated base appearances.

