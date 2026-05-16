# Liam’s Game — Player Character Rig Reference Plan v1

This document defines the next practical step before full production: generating and evaluating the 4 rig reference bodies and the first style-test set.

---

# 1. Goal

Create a small, controlled reference set that proves the player character art system can work before scaling to:

- 16 base hero figures
- multiple equipment slots
- many layerable gear assets

The first goal is **not** to make final production art for every race. The first goal is to prove:

1. the pose works
2. the art style works
3. the 4 rig families are distinct enough
4. equipment can layer cleanly
5. the workflow is manageable

---

# 2. Rig Families

## 2.1 Male Standard

Used for:
- Human
- Sylvan
- Emberling
- Tideborn
- Cloudling
- Moonmark

Visual qualities:
- average youthful adventurer build
- practical and grounded
- not overly muscular
- flexible enough for many races
- readable shoulders, hands, torso, and boots

## 2.2 Female Standard

Used for:
- Human
- Sylvan
- Emberling
- Tideborn
- Cloudling
- Moonmark

Visual qualities:
- average youthful adventurer build
- practical and grounded
- not exaggerated
- strong readable silhouette
- good fit for tunics, vests, cloaks, boots, gloves, and headwear

## 2.3 Male Stocky

Used for:
- Stonekin
- Mossback

Visual qualities:
- broader stance
- stronger torso mass
- grounded weight
- slightly denser silhouette
- still warm and storybook, not brute-like

## 2.4 Female Stocky

Used for:
- Stonekin
- Mossback

Visual qualities:
- sturdy and grounded
- broader than standard rig
- practical and warm
- not exaggerated or caricatured

---

# 3. Canonical Pose

All rigs must share the same pose logic.

## Pose Requirements

- full-body
- slight 3/4 front-facing body orientation
- head turned to look directly at viewer
- feet planted on shared baseline
- relaxed but ready stance
- right arm positioned for one-handed weapon
- left arm positioned for offhand item or neutral hold
- arms separated enough to support layered armor/cloaks/gloves
- body centered on 1200 × 1800 canvas
- transparent background

## Important Pose Note

The body should not face perfectly straight forward. The **body** should be slight 3/4 front-facing, while the **head/face** turns toward the viewer.

This should create a pleasing storybook hero-pose while still making the face emotionally readable.

---

# 4. Rig Reference Generation Strategy

There are two possible approaches.

## Approach A — Rig Reference Sheet

Generate one sheet showing all four rig silhouettes side by side.

Pros:
- easy to compare proportions
- helps visually lock the rig families

Cons:
- not immediately usable as layerable production art
- may introduce inconsistent scaling between figures

## Approach B — Individual Rig Reference Assets

Generate each rig separately on the 1200 × 1800 transparent canvas.

Pros:
- closer to actual production
- easier to test layering
- better for direct asset development

Cons:
- harder to compare side by side unless we composite a review sheet later

## Recommended Approach

Use **Approach B** first.

Generate separate individual rig references, then create a composite review sheet after generation if needed.

---

# 5. First Rig Reference Outputs

Generate these four files:

```text
rig_reference_m_standard.png
rig_reference_f_standard.png
rig_reference_m_stocky.png
rig_reference_f_stocky.png
```

These are not final hero bases. They are reference guides for pose, scale, and body family.

---

# 6. First Production-Style Test

After the rig references look right, generate the first actual style-test character and gear bundle.

Recommended first test:

```text
hero_base_human_m_standard.png
```

with these overlays:

```text
equip_torso_briarweave_vest_m_standard.png
equip_head_apprentice_kettle_helm_m_standard.png
equip_cloak_giggleleaf_cloak_m_standard.png
equip_boots_village_boots_m_standard.png
equip_mainhand_old_hatchet.png
equip_trinket_lantern_pin_m_standard.png
```

Optional:

```text
equip_offhand_small_shield.png
```

---

# 7. Review Sequence

## 7.1 Rig Review

Review the four rig references for:

- pose consistency
- scale consistency
- head-facing-viewer success
- clear standard vs. stocky distinction
- hands positioned for equipment
- feet baseline consistency
- style fit

## 7.2 Base Hero Review

Review `hero_base_human_m_standard.png` for:

- Human identity
- young adventurer feel
- warm storybook tone
- clean neutral base outfit
- good face readability
- no unwanted equipment

## 7.3 Overlay Review

Review overlays for:

- transparent canvas cleanliness
- fit to the base hero
- no unwanted body fragments
- no background fragments
- correct item scale
- correct layer behavior

## 7.4 Composite Review

Create a composite using:

1. base hero
2. torso
3. cloak
4. boots
5. headwear
6. weapon
7. trinket
8. optional offhand

Check:

- clipping
- silhouette readability
- style consistency
- whether the trinket is visible
- whether the cloak and weapon conflict
- whether boots/gloves slot decisions still feel right

---

# 8. Approval Gate

Do not generate the full 16-character set until this question can be answered confidently:

> Does the style-test bundle prove that the paper-doll layering system can work?

If yes, proceed to the 16 base heroes.

If no, revise:

- pose
- rig proportions
- layer order
- prompt wording
- slot complexity

---

# 9. Known Risks

## AI overlay consistency

Generated equipment overlays may not align perfectly on the first try.

Mitigation:
- keep the first test narrow
- use transparent PNGs
- use exact canvas size language
- regenerate problem layers before scaling up

## Headwear angle

Because the body is 3/4 but the head looks directly at the viewer, helmets and hats need special attention.

Mitigation:
- test Apprentice Kettle Helm early

## Cloak conflict

Cloaks may cover arms or interfere with weapons.

Mitigation:
- specify short cloak, open front, arms readable

## Trinket visibility

Small trinkets may disappear at gameplay size.

Mitigation:
- visible but not oversized
- likely chest/pin placement

## Boots alignment

Boots may drift if generated separately.

Mitigation:
- enforce feet baseline and rig-specific boot variants

---

# 10. Next Production Step

Generate the four rig reference images first.

Then generate the Human Male Standard style-test bundle.

Then composite and review before proceeding to all 16 base heroes.
