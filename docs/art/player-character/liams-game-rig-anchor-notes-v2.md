# Liam's Game — Rig Anchor Notes v2

This note accompanies `hero-rig-anchors.json` and clarifies how the refined anchors should be used.

## Directionality

- **Main hand** = the character's **right hand**
- The main hand appears on the **viewer-left side** of the image
- **Off hand** = the character's **left hand**
- The off hand appears on the **viewer-right side** of the image

This should be treated as canonical in prompt-writing, naming, and implementation.

## What is locked across all four rigs

These rigs now intentionally share the same *vertical* logic as closely as practical:

- helmet / hat zone
- eye line region
- shoulder line region
- chest / trinket region
- waist region
- main-hand grip height
- off-hand grip height
- feet baseline

## What is allowed to vary by rig

These values intentionally vary somewhat between rigs:

- main-hand X
- off-hand X
- cloak shoulder spread
- body width
- torso width
- hip width

That is desirable because the stocky bodies are wider.

## Practical recommendation for gear generation

### Safe to generate as rig-specific
- torso / armor
- cloak / cape
- boots / shoes
- gloves
- helmets / hats / hoods
- trinkets

### Safe to generate as shared-object art, placed by anchors
- one-handed weapons
- shields
- books
- lanterns
- maps
- simple off-hand objects

## Small future adjustments

If a specific item needs a tiny nudge later, apply a small item-specific offset. Do **not** move the baseline rig anchors unless there is a major error.
