# m_standard Equipment Proof Set

This folder contains first-pass generated equipment art and QA overlays for the `m_standard` paper-doll rig.

These files are proof assets, not final production equipment. They document the workflow experiments and should stay separate from final game-ready equipment exports.

## Current Boot Status

Best current boot candidate:

```text
equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png
qa_equip_boots_village_boots_m_standard_ROTATION_CANDIDATE_overlay.png
```

This candidate came from the cleaned `v6` boot art after splitting the two boots into separate alpha components, scaling, nudging, and rotating each boot independently.

It is still not approved as final production art. The fit is closer than the earlier attempts, but the viewer-right boot still has a pasted-on feel because the source art was not painted for the exact foot angle of the rig.

Earlier `ACCEPTED` naming was premature. Treat `equip_boots_village_boots_m_standard_ACCEPTED.png` as superseded by the rotation candidate.

## Boot Attempt Notes

- `equip_boots_village_boots_m_standard.png`: first ChatGPT attempt; standalone boots, not rig aligned, opaque checkerboard.
- `equip_boots_village_boots_m_standard_v2.png`: real transparency but oversized and too high on the body.
- `equip_boots_village_boots_m_standard_v3.png`: improved placement but opaque checkerboard returned.
- `equip_boots_village_boots_m_standard_v4.png`: better size and placement, still opaque checkerboard.
- `proof_equip_boots_village_boots_m_standard_v5.png`: best ChatGPT placement, still opaque checkerboard.
- `proof_equip_boots_village_boots_m_standard_v6.png`: Paint.NET background-removal pass, real transparency.
- `fit_*`: deterministic split/scale/nudge variants from v6.
- `rotfit_*`: deterministic split/scale/nudge/rotate variants from v6.

## Lessons

For the current toolchain, AI generation is useful for painting equipment concepts, but unreliable for exact paper-doll placement and export requirements.

Recommended workflow:

1. Generate source object art with a clear style prompt.
2. Remove background manually or with a dedicated image-editing tool.
3. Fit the asset over the rig in a layered editor or deterministic transform pass.
4. Generate a QA overlay on the base rig.
5. Only promote the asset after visual review.

Do not assume a transparent PNG claim is true. Check alpha before spending time on alignment.
