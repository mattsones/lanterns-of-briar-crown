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

The mask coordinates live near the top of the script. Edit the path coordinates there, rerun the script, and review `proof_sheet.png`, `proof_sheet_by_slot.png`, and the full-size `proof_*.png` overlays.

## Canvas

- Size: 1024 x 1536
- Mask files: solid white slot shape on transparent background
- Guide files: colored markers on transparent background
- `proof_sheet.png`: all masks overlaid together on the base rig
- `proof_sheet_by_slot.png`: each mask/guide shown separately on the base rig
- `proof_*.png`: full-size single-slot overlay proofs for detailed alignment review

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

These masks are deterministic vector paths, not AI-generated art. Treat them as editable slot boundaries: tighten or loosen the path coordinates in `scripts/generate_m_standard_masks.mjs`, rerun the generator, and review the proof overlays before painting equipment.

`cloak_back` is intentionally reviewed a little differently from the front-facing slots: the mask is painted behind `base_rig`, so the proof overlay shows some area that will be hidden by the body in the actual stack. Boots, torso, head, trinket, and cloak_front should read much tighter in their full-size `proof_*.png` files.
