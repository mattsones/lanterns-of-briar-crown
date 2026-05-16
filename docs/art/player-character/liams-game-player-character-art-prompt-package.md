# Liam’s Game — Player Character Art Prompt Package v1

This prompt package supports the first player-character paper-doll art pass.

It assumes the locked production spec:

- 4 rig model: male standard, female standard, male stocky, female stocky
- full-body 1200 × 1800 px transparent PNG assets
- slight 3/4 front-facing body pose
- head turned to look directly at the viewer
- one-handed weapons shown in hand
- boots and gloves included as equipment slots
- cloak and future back-carried gear are separate slots
- one visible trinket slot
- no granular facial customization in v1

---

# 1. Global Style Block

Use this block in all character and equipment generations:

```text
Storybook fantasy character art with a hand-drawn, hand-painted feel, subtle painterly texture, soft brushwork, gentle ink-like line definition, and a warm illustrated-book atmosphere. The art should feel handmade rather than slick or overtly digital. Use a middle-ground character style: expressive and warm, like storybook villagers and young adventurers, but not overly cartoony or exaggerated. Cozy fantasy tone, sincere and adventurous, family-friendly, with gentle whimsy. Use natural fantasy materials, practical village-travel clothing, soft parchment warmth in the palette, and clear readable silhouettes.
```

---

# 2. Global Negative Prompt

Use this in all image generations:

```text
No photorealism, no 3D-rendered look, no glossy digital game art, no anime style, no harsh comic-book ink, no horror tone, no grimdark mood, no over-saturated neon colors, no modern clothing, no sci-fi elements, no excessive clutter, no exaggerated caricature proportions, no chibi proportions, no aggressive grim warrior look, no franchise resemblance, no text, no labels, no background scenery, no floor shadow that extends beyond the character layer.
```

---

# 3. Canonical Pose Prompt Block

Use this in all base-hero generations:

```text
Full-body character, slight 3/4 front-facing body orientation, head turned to look directly at the viewer, relaxed but ready stance, feet planted evenly on the same baseline, shoulders natural, right arm positioned slightly away from the body as if ready to hold a one-handed weapon, left arm positioned slightly away from the body as if ready to hold a small shield or lantern, arms separated enough for armor and cloak layering, clean readable silhouette, centered on a transparent background, consistent paper-doll pose for equipment layering.
```

---

# 4. Transparent Layer Prompt Block

Use this for equipment overlay assets:

```text
Transparent PNG equipment overlay only, no full character body, no face, no background. The item must align to the established Liam’s Game paper-doll character pose on a 1200 x 1800 canvas. Keep the same camera angle, scale, and perspective as the base character. The overlay should fit cleanly over the target rig without changing the pose. Preserve empty transparent space around the item so it can be composited over the base character.
```

---

# 5. Four-Rig Reference Prompts

These prompts are for generating a reference sheet or individual rig guides before producing final character bases.

## 5.1 Male Standard Rig Reference

```text
Create a full-body male standard hero rig reference for a storybook fantasy RPG paper-doll character system. The character should have an average youthful adventurer build, practical proportions, and a neutral village-adventurer silhouette. Slight 3/4 front-facing body orientation, head turned to look directly at the viewer, relaxed but ready stance, feet planted, right hand positioned for a one-handed weapon, left hand positioned for small offhand gear. Simple neutral underclothes only, no armor, no cloak, no weapon, no hat, no trinket. Transparent background, 1200 x 1800 px, centered, consistent pose for future layering.

[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 5.2 Female Standard Rig Reference

```text
Create a full-body female standard hero rig reference for a storybook fantasy RPG paper-doll character system. The character should have an average youthful adventurer build, practical grounded proportions, and a neutral village-adventurer silhouette. Slight 3/4 front-facing body orientation, head turned to look directly at the viewer, relaxed but ready stance, feet planted, right hand positioned for a one-handed weapon, left hand positioned for small offhand gear. Simple neutral underclothes only, no armor, no cloak, no weapon, no hat, no trinket. Transparent background, 1200 x 1800 px, centered, consistent pose for future layering.

[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 5.3 Male Stocky Rig Reference

```text
Create a full-body male stocky hero rig reference for a storybook fantasy RPG paper-doll character system. The character should have a sturdy broad build, grounded stance, slightly denser silhouette than the standard rig, and practical proportions suitable for Stonekin or Mossback ancestry. Slight 3/4 front-facing body orientation, head turned to look directly at the viewer, relaxed but ready stance, feet planted, right hand positioned for a one-handed weapon, left hand positioned for small offhand gear. Simple neutral underclothes only, no armor, no cloak, no weapon, no hat, no trinket. Transparent background, 1200 x 1800 px, centered, consistent pose for future layering.

[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 5.4 Female Stocky Rig Reference

```text
Create a full-body female stocky hero rig reference for a storybook fantasy RPG paper-doll character system. The character should have a sturdy grounded build, broader denser silhouette than the standard rig, practical proportions, warm storybook presence, suitable for Stonekin or Mossback ancestry. Slight 3/4 front-facing body orientation, head turned to look directly at the viewer, relaxed but ready stance, feet planted, right hand positioned for a one-handed weapon, left hand positioned for small offhand gear. Simple neutral underclothes only, no armor, no cloak, no weapon, no hat, no trinket. Transparent background, 1200 x 1800 px, centered, consistent pose for future layering.

[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

---

# 6. Style-Test Bundle Prompts

The first proof-of-concept uses **Human Male Standard**.

## 6.1 Base Hero — Human Male Standard

**Filename:** `hero_base_human_m_standard.png`

```text
Create a full-body Human male standard base hero for Liam’s Game, a cozy storybook fantasy RPG. He is a young village adventurer at the beginning of his journey: sincere, brave, capable but not yet epic. Human ancestry, warm approachable face, practical simple travel underclothes, no armor, no cloak, no weapon, no hat, no visible trinket. Slight 3/4 front-facing body orientation, head turned to look directly at the viewer, relaxed but ready stance, feet planted evenly, right hand positioned to hold a one-handed weapon, left hand positioned to hold a small shield or lantern. Full body centered on transparent background, 1200 x 1800 px, consistent pose for paper-doll equipment layering.

[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.2 Torso Overlay — Briarweave Vest, Male Standard

**Filename:** `equip_torso_briarweave_vest_m_standard.png`

```text
Create a transparent PNG torso equipment overlay for Liam’s Game: Briarweave Vest, male standard rig. The vest is practical light adventuring armor made of woven briar-fiber, soft leather, and sturdy village craft. It should look protective but not harsh or militaristic, with warm earthy browns, muted greens, subtle woven texture, and storybook fantasy charm. It must fit over the male standard hero torso in the established paper-doll pose. Overlay only: vest and any necessary torso straps only, no full character body, no head, no hands, no weapon, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.3 Headwear Overlay — Apprentice Kettle Helm, Male Standard

**Filename:** `equip_head_apprentice_kettle_helm_m_standard.png`

```text
Create a transparent PNG headwear equipment overlay for Liam’s Game: Apprentice Kettle Helm, male standard rig. The helm is a charming practical beginner helmet, slightly kettle-shaped, hand-forged, warm metal with gentle dents and a cozy village-smith feel. It should be protective, whimsical, and family-friendly, not intimidating. It must fit the head angle of the male standard hero pose: body 3/4, face looking toward viewer. Overlay only: helmet/headwear only, no face, no body, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.4 Cloak Overlay — Giggleleaf Cloak, Male Standard

**Filename:** `equip_cloak_giggleleaf_cloak_m_standard.png`

```text
Create a transparent PNG cloak equipment overlay for Liam’s Game: Giggleleaf Cloak, male standard rig. The cloak is a short practical travel cloak made from soft leaf-green fabric with gentle whimsical leaf-like edges, cozy fantasy charm, and subtle painterly texture. It should sit behind and around the shoulders without covering the whole body, leaving arms readable for weapon and offhand layering. It must fit the male standard paper-doll pose. Overlay only: cloak/back garment only, no full body, no face, no weapon, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.5 Boots Overlay — Village Boots, Male Standard

**Filename:** `equip_boots_village_boots_m_standard.png`

```text
Create a transparent PNG boots equipment overlay for Liam’s Game: Village Boots, male standard rig. The boots are simple sturdy village travel boots, warm brown leather, practical and slightly worn, suitable for a young adventurer leaving home. They should fit the feet of the male standard paper-doll pose and align to the common feet baseline. Overlay only: boots/shoes only, no legs beyond what is necessary for fit, no full body, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.6 Main Hand Overlay — Old Hatchet

**Filename:** `equip_mainhand_old_hatchet.png`

```text
Create a transparent PNG main-hand equipment overlay for Liam’s Game: Old Hatchet. A small rugged village hatchet used as a starter weapon, practical wood handle, simple iron head, worn but trustworthy, not brutal or scary. It should align to the right hand of the established paper-doll hero pose, held naturally in a lowered ready position. Overlay only: hatchet only, no hand, no body, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero hand anchor.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.7 Trinket Overlay — Lantern Pin, Male Standard

**Filename:** `equip_trinket_lantern_pin_m_standard.png`

```text
Create a transparent PNG visible trinket overlay for Liam’s Game: Lantern Pin, male standard rig. A small warm-gold lantern-shaped pin or brooch worn on the upper chest or cloak/vest area, symbolic of true road signs and roadwarden courage. It should be visible but not oversized, with a soft amber glow and storybook warmth. It must align to the chest anchor of the male standard paper-doll pose. Overlay only: pin/trinket only, no full body, no face, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

## 6.8 Optional Offhand Overlay — Small Shield

**Filename:** `equip_offhand_small_shield.png`

```text
Create a transparent PNG offhand equipment overlay for Liam’s Game: Small Shield. A small practical round or leaf-shaped beginner shield, warm wood and simple metal rim, protective but not militaristic, cozy storybook fantasy style. It should align to the left hand of the established paper-doll hero pose, held naturally at the side. Overlay only: shield only, no hand, no body, no background. 1200 x 1800 canvas, transparent background, aligned to the base hero offhand anchor.

[TRANSPARENT LAYER PROMPT BLOCK]
[GLOBAL STYLE BLOCK]
[GLOBAL NEGATIVE PROMPT]
```

---

# 7. First Composite Test

After the first style-test bundle is generated, create a composite preview using this layer stack:

1. `hero_base_human_m_standard.png`
2. `equip_torso_briarweave_vest_m_standard.png`
3. `equip_cloak_giggleleaf_cloak_m_standard.png`
4. `equip_boots_village_boots_m_standard.png`
5. `equip_head_apprentice_kettle_helm_m_standard.png`
6. `equip_mainhand_old_hatchet.png`
7. `equip_trinket_lantern_pin_m_standard.png`

Optional:

8. `equip_offhand_small_shield.png`

Review for:

- alignment
- clipping
- silhouette readability
- style consistency
- whether the head-facing-viewer pose works with helmet layering
- whether the cloak leaves enough arm/weapon readability
- whether the trinket is visible enough to justify the slot

---

# 8. Notes for Actual Generation

AI image generation may struggle to make perfect transparent equipment overlays on the first pass. If an overlay comes back with body fragments, background remnants, or pose drift, use the output as a concept reference and regenerate with stricter wording.

Most likely problem areas:

- headwear angle
- hands/weapons alignment
- cloak overlap around shoulders
- boots matching foot angle
- trinket scale

Do not generate all 16 bases or all equipment until the first style test proves the approach.
