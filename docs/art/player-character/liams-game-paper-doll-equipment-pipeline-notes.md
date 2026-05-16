# Liam's Game - Paper-Doll Equipment Pipeline Notes

These notes summarize the first proof loop for `m_standard` equipment overlays.

## Core Finding

The current AI art workflow can make useful equipment concept art, but it does not reliably produce rig-locked paper-doll overlays.

The recurring failures were:

- standalone item art instead of rig-aligned overlays
- fake checkerboard backgrounds instead of real alpha transparency
- correct style but incorrect scale, placement, or perspective
- repeated prompt iterations fixing one issue while regressing another

## Recommended Workflow

Use AI for painting, not final placement.

1. Generate equipment source art.
2. Remove the background with a dedicated image editor.
3. Place and transform the asset against the rig manually or with deterministic transforms.
4. Generate a QA overlay on `rig_reference_m_standard.png`.
5. Compare against the relevant slot mask.
6. Promote the asset only after visual review.

This is slower than a single prompt, but faster than trying to make ChatGPT solve painting, transparency, scale, pose, and alignment in one shot.

## Tool Notes

- Paint.NET worked for manual background removal.
- A layer editor with rotate, scale, perspective, warp, and liquify tools would likely be better for final fitting.
- Krita or Photopea are likely better fit tools than Paint.NET for the transform stage.
- ComfyUI, ControlNet, or inpainting workflows may become useful later, but they add setup complexity and still need QA.

## Boot Proof Loop

The boot loop produced useful evidence:

- `v2` proved ChatGPT can export real transparency, but placement was wrong.
- `v3` and `v4` improved placement but regressed to fake transparency.
- `v5` gave the best ChatGPT placement but still had a baked checkerboard.
- `v6` was manually cleaned in Paint.NET and became the first technically valid transparent overlay.
- Deterministic split/scale/nudge variants improved fit.
- Rotation-aware variants improved fit further, with the best candidate stored as:

```text
art/characters/hero/equipment/m_standard/proof_set/equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png
```

The rotation candidate is not final production art. It is a proof that the pipeline can work, but the boot art still wants human/art-direction fitting.

## Open Question

Before producing a large equipment set, decide whether the project should:

1. Continue with AI concept art plus manual fitting.
2. Use a dedicated 2D art workflow for all equipment.
3. Explore a more advanced AI image workflow that supports reference pose, masks, and inpainting.

The current evidence suggests option 1 is viable for proofs, but may become expensive for a large wardrobe unless transform templates and stricter art standards are established.
