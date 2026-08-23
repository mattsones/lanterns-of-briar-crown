# Chapter 4 Enemy Portrait Drafts

Status: owner review pending. These full-resolution concepts are not yet wired into the game. V02 is the current recommended pass.

## Review sheet

- `chapter-4-enemies-review-v02.webp` — current smoothed pass
- `chapter-4-enemies-review-v01.webp` — original painted-texture pass

## New concepts

- `briar-relay-guard-concept-v02.png` — current recommendation
- `crown-whisperer-concept-v02.png` — current recommendation

The V01 files are retained beside them for comparison and provenance.

The Seal-Forged Sentry already has approved production artwork at `assets/portraits/enemies/seal-forged-sentry-v01.webp`. Chapter 4 reuses that enemy without redesigning it.

## Shared art direction

Storybook fantasy enemy portraits matching the existing Liam's Game roster: hand-painted warmth, watercolor/gouache-inspired layering, gentle ink-like definition, grounded costumes and materials, readable combat silhouettes, and restrained surface texture on faces and hands. The Relay is lit by credible warm lanterns against cool underground stone. The tone is dangerous but family-friendly, never grimdark or horrific.

### Briar Relay Guard

A broad, grounded human station enforcer built to hold a cramped passage rather than stalk a road. His short iron route bar, low fighting stance, shutter key, chalked tally, layered work gear, and false red seal-cloth distinguish him from the lighter Briar Cargo Runner and hooded Briar Roadwatcher.

### Crown Whisperer

A poised human political operative in a travel-stained court coat, standing on the Relay's signal gallery with a hooked knife and forged orders. Her threat comes from controlled posture, persuasive authority, and stolen institutional dress rather than magic. The first generated portrait's legitimate-looking gold crown brooch was revised into a small dark thorn-and-wax Briar Crown badge.

## V02 facial-finish revision

Both portraits received an identity-preserving smoothing pass after owner review. The revision removes mottled, crosshatched, stippled, canvas-like, and pixel-like paint texture from exposed facial skin while preserving identity, age, expression, posture, costume, props, lighting, and story details. Faces retain restrained natural texture and storybook character without waxy or photorealistic retouching.

## After approval

Preserve the approved PNG masters under source art, export optimized opaque WebP runtime portraits under `assets/portraits/enemies/`, register the artwork in `src/data/enemies.ts`, mark the entries available in `src/data/artworkPlan.ts`, update the asset manifest, and run the production-asset, rules, build, and Chapter 4 browser checks.
