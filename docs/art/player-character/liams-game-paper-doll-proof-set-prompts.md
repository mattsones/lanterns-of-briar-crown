# Liam's Game - Paper-Doll Proof Set Prompts

Use this prompt pack to generate the first painted equipment overlays for the `m_standard` hero rig.

This is for **painting transparent PNG equipment assets**, not changing the base character.

## Required References

Attach these references when generating each asset:

```text
art/characters/hero/rig-guides/rig_reference_m_standard.png
art/characters/hero/masks/m_standard/proof_sheet_by_slot.png
art/characters/hero/masks/m_standard/mask_torso.png
art/characters/hero/masks/m_standard/mask_cloak_back.png
art/characters/hero/masks/m_standard/mask_cloak_front.png
art/characters/hero/masks/m_standard/mask_boots.png
art/characters/hero/masks/m_standard/mask_head.png
art/characters/hero/masks/m_standard/mask_trinket.png
art/characters/hero/masks/m_standard/guide_mainhand_anchor.png
art/characters/hero/masks/m_standard/guide_offhand_anchor.png
art/characters/hero/masks/m_standard/proof_torso.png
art/characters/hero/masks/m_standard/proof_cloak_back.png
art/characters/hero/masks/m_standard/proof_cloak_front.png
art/characters/hero/masks/m_standard/proof_boots.png
art/characters/hero/masks/m_standard/proof_head.png
art/characters/hero/masks/m_standard/proof_trinket.png
art/characters/hero/masks/m_standard/proof_mainhand_anchor.png
art/characters/hero/masks/m_standard/proof_offhand_anchor.png
```

For a specific slot, attach the base rig plus the relevant mask/guide and full-size `proof_*.png`. The mask is a fit guide, not a shape that must be filled edge-to-edge.

## Non-Negotiable Output Rules

- Output must be a transparent PNG.
- Canvas must be exactly `1024 x 1536`.
- The gear must align to `rig_reference_m_standard.png`.
- Do not draw the full body, face, hair, skin, or background.
- Do not draw text, labels, UI, shadows on the floor, scenery, extra hands, or extra characters.
- Do not change the hero pose.
- Keep the same storybook painterly style as the rig.
- Keep the asset mostly inside the relevant mask or aligned to the relevant guide.
- Preserve visible gaps where the base rig should still show through.
- The item should look like a painted overlay layer, ready to stack on the rig.

## Style Block

```text
Storybook fantasy equipment overlay for Liam's Game, hand-drawn and hand-painted feel, subtle painterly texture, soft brushwork, gentle ink-like line definition, warm illustrated-book finish, practical village-adventure design, readable at full-body game scale, family-friendly cozy fantasy tone. Match the lighting, camera angle, scale, and slight 3/4 front-facing perspective of the provided m_standard hero rig.
```

## Negative Prompt

```text
No full character body, no face, no skin, no hair, no background, no scenery, no floor shadow, no text, no labels, no UI, no extra limbs, no changed pose, no photorealism, no 3D render, no anime, no glossy digital armor, no modern clothing, no sci-fi details, no grimdark or horror styling, no oversized heroic proportions.
```

## Stacking Order

1. `cloak_back`
2. `base_rig`
3. `boots`
4. `torso`
5. `cloak_front`
6. `head`
7. `trinket`
8. `mainhand`
9. `offhand`

## Proof Set Outputs

Generate these first:

```text
equip_torso_briarweave_vest_m_standard.png
equip_cloak_back_giggleleaf_cloak_m_standard.png
equip_cloak_front_giggleleaf_cloak_m_standard.png
equip_boots_village_boots_m_standard.png
equip_head_apprentice_kettle_helm_m_standard.png
equip_trinket_lantern_pin_m_standard.png
equip_mainhand_old_hatchet.png
equip_offhand_small_shield.png
```

---

## 1. Briarweave Vest - Torso

Reference:

```text
rig_reference_m_standard.png
mask_torso.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_torso_briarweave_vest_m_standard.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: a Briarweave Vest for the torso slot. Use the provided rig as alignment reference and the torso mask as the fit boundary.

The vest should be a practical roadwarden-style protective vest made from warm brown woven cloth with subtle thorn-resistant stitched edging. It should sit over the existing sleeveless shirt, cover the chest and abdomen, and end around the waist. Include soft seams, quilted woven texture, small reinforced shoulder edging, and a few understated briar-stitch motifs. Keep it family-friendly and handmade, not spiky or intimidating.

The asset must be only the vest overlay on a transparent 1024 x 1536 canvas. Do not include the body, arms, face, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 2. Giggleleaf Cloak - Back Layer

Reference:

```text
rig_reference_m_standard.png
mask_cloak_back.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_cloak_back_giggleleaf_cloak_m_standard.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: the back layer of the Giggleleaf Cloak. Use the provided rig as alignment reference and the cloak_back mask as the fit boundary.

This layer should be the back drape of a bright, cheerful travel cloak, visible behind the character. The cloak should attach around both shoulders and fall behind the body to around lower calf or ankle height. Use fresh leaf-green fabric with subtle yellow-green highlights, soft stitched hems, tiny leaf-shaped patches, and a gently whimsical handmade feel. It should not cover the face or hands in the front; this is the behind-the-body cloak mass.

The asset must be only the back cloak layer on a transparent 1024 x 1536 canvas. Do not include the body, face, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 3. Giggleleaf Cloak - Front Layer

Reference:

```text
rig_reference_m_standard.png
mask_cloak_front.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_cloak_front_giggleleaf_cloak_m_standard.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: the front layer of the Giggleleaf Cloak. Use the provided rig as alignment reference and the cloak_front mask as the fit boundary.

This layer should be the two visible front panels/lapels of the same bright leaf-green cloak. It should hang from the shoulders down the front edges of the torso, leaving the center chest mostly open so torso armor and trinkets can remain visible. Include soft leaf-like folds, warm yellow-green highlights, stitched edges, and a tiny playful leaf detail or two. It should feel cheerful and practical, not fancy royalty clothing.

The asset must be only the front cloak panels on a transparent 1024 x 1536 canvas. Do not include the body, face, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 4. Village Boots

Reference:

```text
rig_reference_m_standard.png
mask_boots.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_boots_village_boots_m_standard.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: practical village boots for the boots slot. Use the provided rig as alignment reference and the boots mask as the fit boundary.

The boots should fit over both feet and lower legs, matching the planted stance and perspective of the rig. Use warm brown leather, simple laces or wraps, soft worn edges, and handmade village-adventurer construction. They should be sturdy enough for Lantern Road but humble, not armored greaves. Preserve the distinct viewer-left and viewer-right foot angles.

The asset must be only the boots overlay on a transparent 1024 x 1536 canvas. Do not include legs, body, background, labels, or floor shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 5. Apprentice Kettle Helm

Reference:

```text
rig_reference_m_standard.png
mask_head.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_head_apprentice_kettle_helm_m_standard.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: an Apprentice Kettle Helm for the head slot. Use the provided rig as alignment reference and the head mask as the fit boundary.

The helmet should be a charming practical kettle-helm: rounded dull tin or warm gray metal, slightly dented, simple rim, handmade village-smith construction, protective but a little soup-adjacent in personality. It should sit naturally over the top of the head and hair without changing the face. Avoid covering the eyes. Include soft painterly metal texture and a few subtle scuffs.

The asset must be only the helmet overlay on a transparent 1024 x 1536 canvas. Do not include the face, hair, body, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 6. Lantern Pin

Reference:

```text
rig_reference_m_standard.png
mask_trinket.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_trinket_lantern_pin_m_standard.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: a visible Lantern Pin trinket. Use the provided rig as alignment reference and the trinket mask as the fit boundary.

The pin should be small but readable on the upper chest: a warm gold roadwarden-style lantern emblem, polished but handmade, with a tiny amber glow or enamel center. It should feel humble, dependable, and connected to true Lantern Road signs. Keep it sized for the chest, not a huge medallion.

The asset must be only the pin/trinket overlay on a transparent 1024 x 1536 canvas. Do not include clothing, body, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 7. Old Hatchet - Main Hand

Reference:

```text
rig_reference_m_standard.png
guide_mainhand_anchor.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_mainhand_old_hatchet.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: an Old Hatchet held in the main hand. Use the provided rig as alignment reference and the mainhand guide as the grip anchor.

Important: main hand means the character's right hand, which appears on the viewer-left side. The hatchet handle should align to the red mainhand grip marker. The hatchet should be a humble village tool turned starter weapon: short wooden handle, worn iron head, small nicks, practical proportions, not oversized fantasy battle-axe. It should angle naturally with the relaxed hand pose.

The asset must be only the hatchet overlay on a transparent 1024 x 1536 canvas. Do not include the hand, body, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

## 8. Small Shield - Off Hand

Reference:

```text
rig_reference_m_standard.png
guide_offhand_anchor.png
proof_sheet_by_slot.png
```

Output filename:

```text
equip_offhand_small_shield.png
```

Prompt:

```text
Create a transparent PNG equipment overlay for the m_standard Liam's Game hero rig: a small practical shield held in the off hand. Use the provided rig as alignment reference and the offhand guide as the grip anchor.

Important: off hand means the character's left hand, which appears on the viewer-right side. The shield grip should align to the blue offhand marker. The shield should be modest and road-ready: small round or rounded wooden buckler, warm brown wood, simple metal rim or boss, a few painted lantern-road scratches or humble protective marks. It should not hide the whole torso; keep it sized for a young village adventurer.

The asset must be only the shield overlay on a transparent 1024 x 1536 canvas. Do not include the hand, body, background, labels, or shadows. Match the rig's pose, perspective, painterly texture, and warm storybook lighting.
```

---

## After Each Generated Asset

Run a proof pass by compositing the generated asset with:

```text
art/characters/hero/rig-guides/rig_reference_m_standard.png
```

Check:

- the item aligns to the body and perspective
- no extra body parts were generated
- transparent background is clean
- the item does not drift from its slot mask or anchor
- the item remains readable at full-body scale
- layer ordering still works with the stack above
