# Portrait Smoothing Pass

Date: 2026-08-22

Status: Owner-approved and integrated on 2026-08-22. All 26 selected candidates are now new versioned source masters and optimized runtime portraits; no prior source master was overwritten.

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

Edden's first smoothing candidate introduced wet-looking tear streaks and is preserved under `assets/reference/concepts/portrait-smoothing/rejected/`. V02 restores the approved dry-eyed, worried expression and is the promoted production portrait.

## Generation Direction

The built-in identity-preserving image-edit workflow used each approved full-resolution PNG as its edit target. The shared direction was:

> Conservatively refine only artificial coarse crosshatching, stippling, canvas grain, chunky brush strokes, and mosaic-like color patches on the face, neck, hands, and exposed skin. Use controlled painterly transitions and natural facial planes matching the approved Queen Isara and King Edran finish. Preserve exact identity, ancestry, age, natural nonhuman skin traits, expression, pose, costume, props, background, lighting, palette, crop, camera, scale, and composition. Do not redesign, beautify, age, de-age, zoom, reframe, add, or remove anything.

Species-specific prompts explicitly preserved bark, leaf, moss, stone, mineral, blue-skin, pointed-ear, and other ancestry traits. Ada's no-lens state used the no-lens source as the authoritative composition and her smoothed lens portrait only as a supporting identity/finish reference.

## Promotion Record

The owner approved the complete review sheet on 2026-08-22. Each candidate was copied into `assets/reference/source-art/assets/portraits/characters/` with the next available character-specific version number, optimized to a height of at most 1200 pixels as an opaque quality-82 WebP, and wired into `src/data/portraits.ts`, `src/data/companions.ts`, or `src/data/dialogueArt.ts` as applicable. Queen Isara and King Edran remain unchanged as the finish benchmarks. Superseded runtime WebPs moved to `assets/reference/alternates/assets/portraits/characters/`; the earlier full-resolution source masters remain in source art.

## Verification

- Candidate inventory: 26 selected PNGs, each mapped to one approved source portrait and normalized to that source's exact pixel dimensions.
- Visual review: full-set contact sheet plus two paired before/after sheets inspected; Edden V01 rejected and V02 selected after targeted correction.
- Promotion integrity: 26/26 source masters are byte-identical to their approved candidates; 26/26 runtime WebPs and optimization-manifest entries are present; the production character set contains those 26 portraits plus unchanged Isara and Edran.
- `npm.cmd run audit:assets`: passed (149 production images).
- `npm.cmd run build`: passed.
- `npm.cmd run test:rules`: passed (46 tests, including the complete smoothing-batch selection regression).
- `npm.cmd run playtest:smoke`: passed.
