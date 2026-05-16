# m_standard Slot Masks

Generated deterministic transparent PNG masks for the male standard player rig.

Source rig:

```text
art/characters/hero/rig-guides/rig_reference_m_standard.png
```

Regenerate from repo root:

```bash
node scripts/generate_m_standard_masks.mjs
```

The mask coordinates live near the top of the script. Edit the polygon/ellipse points there, rerun the script, and review `proof_sheet.png`.

## Canvas

- Size: 1024 x 1536
- Mask files: solid white slot shape on transparent background
- Guide files: colored markers on transparent background

## Hand Direction

- Main hand = character's right hand = viewer-left side.
- Off hand = character's left hand = viewer-right side.

## Slot Purpose

- `mask_cloak_back.png`: back cape/cloak volume behind the base rig.
- `mask_boots.png`: shoes and boot overlays around lower legs and feet.
- `mask_torso.png`: torso clothing, armor, tunics, and vests.
- `mask_cloak_front.png`: front cloak panels/lapels above torso.
- `mask_head.png`: helmets, hats, hoods, and headwear checks.
- `mask_trinket.png`: visible pins, charms, chains, and medallions.
- `guide_mainhand_anchor.png`: main-hand weapon grip marker.
- `guide_offhand_anchor.png`: off-hand item grip marker.

## Initial Stacking Order

1. cloak_back
2. base_rig
3. boots
4. torso
5. cloak_front
6. head
7. trinket
8. mainhand
9. offhand

## Notes

These masks are intentionally approximate first-pass shapes. They are not AI-generated. They are vector-defined and rendered by code so the rig can be tuned deterministically as the paper-doll system matures.
