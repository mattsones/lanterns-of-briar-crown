# Portrait Smoothing Candidate Pass

Date: 2026-08-22

Status: Complete candidate batch awaiting owner review. No runtime portrait, approved source master, dialogue mapping, save data, or gameplay state has changed.

## Review Materials

- `assets/reference/concepts/portrait-smoothing/portrait-smoothing-review-sheet.webp` — all 26 selected candidates together, with Queen Isara and King Edran included as the approved finish benchmarks.
- `assets/reference/concepts/portrait-smoothing/portrait-smoothing-comparison-a.webp` — paired source/candidate comparisons for Ada through Moss.
- `assets/reference/concepts/portrait-smoothing/portrait-smoothing-comparison-b.webp` — paired source/candidate comparisons for Nella through the worried road traveler.
- `assets/reference/concepts/portrait-smoothing/approved-portraits-before.webp` — the complete pre-pass portrait set.

The full-resolution candidate PNGs live under `assets/reference/concepts/portrait-smoothing/candidates/`. Queen Isara and King Edran were not regenerated; their approved portraits define the finish target.

## Selected Candidates

```text
ada-willowmarket-portrait-no-lens-smooth-v01.png
ada-willowmarket-portrait-smooth-v01.png
auntie-lume-portrait-smooth-v01.png
bramwell-gatehand-portrait-smooth-v01.png
edden-vale-portrait-smooth-v02.png
enna-portrait-smooth-v01.png
hollis-portrait-smooth-v01.png
lio-brindle-portrait-smooth-v01.png
mara-brindle-portrait-smooth-v01.png
mayor-anwen-portrait-smooth-v01.png
mira-portrait-smooth-v01.png
miri-portrait-smooth-v01.png
moss-portrait-smooth-v01.png
nella-portrait-smooth-v01.png
nix-portrait-smooth-v01.png
noma-greenstill-portrait-smooth-v01.png
pibble-portrait-smooth-v01.png
princess-elowen-portrait-smooth-v01.png
princess-elowen-royal-portrait-smooth-v01.png
quill-pebbleturn-portrait-smooth-v01.png
rowan-portrait-smooth-v01.png
smith-orin-portrait-smooth-v01.png
tilda-portrait-smooth-v01.png
toma-fielding-portrait-smooth-v01.png
westroot-rootbread-child-portrait-smooth-v01.png
worried-road-traveler-portrait-smooth-v01.png
```

Edden's first smoothing candidate introduced wet-looking tear streaks and is preserved under `assets/reference/concepts/portrait-smoothing/rejected/`. V02 restores the approved dry-eyed, worried expression and is the review candidate.

## Generation Direction

The built-in identity-preserving image-edit workflow used each approved full-resolution PNG as its edit target. The shared direction was:

> Conservatively refine only artificial coarse crosshatching, stippling, canvas grain, chunky brush strokes, and mosaic-like color patches on the face, neck, hands, and exposed skin. Use controlled painterly transitions and natural facial planes matching the approved Queen Isara and King Edran finish. Preserve exact identity, ancestry, age, natural nonhuman skin traits, expression, pose, costume, props, background, lighting, palette, crop, camera, scale, and composition. Do not redesign, beautify, age, de-age, zoom, reframe, add, or remove anything.

Species-specific prompts explicitly preserved bark, leaf, moss, stone, mineral, blue-skin, pointed-ear, and other ancestry traits. Ada's no-lens state used the no-lens source as the authoritative composition and her smoothed lens portrait only as a supporting identity/finish reference.

## Approval And Promotion Gate

1. Review the two paired comparison sheets and inspect any uncertain candidate at full size.
2. Approve, reject, or request a targeted second pass per character. Do not treat batch generation as automatic approval.
3. After approval, promote selected candidates as new versioned source masters, create optimized runtime WebPs, update portrait mappings and the optimization manifest, and run the portrait/rules/build verification set.
4. Preserve the currently approved runtime files until that promotion commit is explicitly accepted.

## Verification

- Candidate inventory: 26 selected PNGs, each mapped to one approved source portrait and normalized to that source's exact pixel dimensions.
- Visual review: full-set contact sheet plus two paired before/after sheets inspected; Edden V01 rejected and V02 selected after targeted correction.
- `npm.cmd run audit:assets`: passed (149 production images; candidate concepts remain outside the production scan).
- `npm.cmd run build`: passed.
- `npm.cmd run test:rules`: passed (45 tests).
