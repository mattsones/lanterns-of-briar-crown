# Liam's Game — Normalized Rig Templates Package

This package contains the current approved **baseline normalized rig templates** for the Liam's Game player-character paper-doll system.

## Included rig files

Located in:

```text
art/characters/hero/rig-guides/
```

Files:
- `rig_reference_m_standard.png`
- `rig_reference_f_standard.png`
- `rig_reference_m_stocky.png`
- `rig_reference_f_stocky.png`

## What these are for

These four rig references are the approved baseline body templates that should be used before expanding to all 8 races / 16 base bodies.

They are intended to lock:
- the shared pose language
- the feet baseline
- the head / helmet zone
- the vertical relationship of chest, waist, and knee areas
- the general locations of main-hand and off-hand anchors
- the difference between standard and stocky body families

## Important hand-direction rule

**Main hand = the character's right hand.**  
Because the character is facing the viewer, the character's right hand appears on the **viewer-left side** of the image.

**Off hand = the character's left hand.**  
That appears on the **viewer-right side** of the image.

So:
- **main-hand anchor** = viewer-left hand
- **off-hand anchor** = viewer-right hand

## Alignment note

These rigs are considered **production-baseline approved** for the next phase.

However, not every rig should share the same **absolute X coordinate** for the hand anchors. Wider bodies naturally place the hands farther outward.

### What should be shared across all four rigs
- feet baseline (Y)
- top/head/helmet zone (Y)
- eye-line region (Y)
- shoulder/chest/waist zones (Y)
- overall pose logic

### What may vary by rig
- main-hand X position
- off-hand X position
- shoulder width
- torso width
- hip width
- leg width

That means the implementation should use:
- a shared vertical rig logic
- **per-rig anchor offsets** for weapons and off-hand items

## Current production recommendation

Use these next in this order:

1. Keep these four files as the baseline rig templates.
2. Create a small first-wave gear test set.
3. Confirm that torso, cloak, boots, headwear, trinket, and weapon layers work on all four rigs.
4. Only after that, expand to the full 8 races / 16 hero bases.

## Suggested repo location

```text
docs/art/player-character/
art/characters/hero/rig-guides/
```
