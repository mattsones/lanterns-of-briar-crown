# Liam’s Game — Custom Item Icon Prompt Bank

Prepared for the current Chapter 1 / Chapter 2 item icon list.

## How to Use These Prompts

Recommended generation setup:

- Square image, exactly 1024 x 1024 when the tool allows it.
- Transparent PNG with a real alpha channel.
- One item per image.
- Object centered and large enough to read at 40 px, 64 px, and 96 px.
- No text, labels, UI frame, border, fake checkerboard transparency, gray square, parchment square, painted vignette, or spotlight backdrop.
- Light object shadow or tiny contained glow is okay only if it stays transparent and tight to the object. Do not create a full scene.

## Strict Export Addendum

This language is already included in every copy/paste prompt below. Keep it here as the reason for rejecting failed exports:

```text
Strict production export requirements: output a true transparent PNG with a real alpha channel. The background must be empty transparency, not a visible checkerboard pattern, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. Do not draw a fake transparency checkerboard. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.
```

## Production Acceptance Gate

An icon is production-ready only if all of these are true:

- The file has a real alpha channel.
- The background is actually transparent, not a painted checkerboard, gray square, parchment square, or glow-filled scene.
- The canvas is square and preferably 1024 x 1024.
- The object reads clearly at 40 px, 64 px, and 96 px.
- The object has a small safe margin and is not clipped by the image edge.
- The style matches the warm hand-painted storybook direction without becoming glossy mobile-game art or stock vector art.

If a generated image shows a checkerboard, that checkerboard is part of the image and the export should be rejected or cleaned before production. Do not wire checkerboard-background images into the game.

## Practical Cleanup Workflow

If ChatGPT produces good object art with a bad background, the asset can still be production-ready after cleanup:

1. Open the image in Paint.NET.
2. Remove the background/checkerboard/temporary flat color.
3. Export as PNG with transparency preserved.
4. Confirm the file reports an alpha-capable format.
5. Check the icon on a dark background and at UI size before wiring it into `src/data/itemArtwork.ts`.

This workflow is acceptable for production when the object silhouette, style, and small-size readability are already strong.

## Optional Regeneration Notes

No Chapter 1 icons are currently blocked on regeneration.

Optional future polish:

- **Stormbell Charm:** make the bell more weathered and less ornate, with a clearer cracked shell and contained storm spark.
- **Bubblecap Mushroom:** keep the bubblecap cluster, but reduce the moss base if it starts feeling too much like a tiny environment scene.

## Shared Style Prefix

Use this at the beginning of every item prompt:

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.
```

## Shared Negative / Avoid Block

Append this to every prompt:

```text
No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

For parchment, notes, cloth, seals, and drawings: visual symbols and sketch marks are fine, but avoid readable letters or words.

---

# Chapter 1 — Equipment and Rewards

## 01. Old Hatchet

Suggested filename: `old-hatchet-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Old Hatchet, a humble starter weapon that is really a rugged village tool. Show a short worn wooden handle with leather wrap, a nicked iron hatchet head, small scratches from real use, and one tiny carved Lantern Road-style mark near the grip. It should feel trustworthy, practical, and a little battered, not heroic or ornate.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 02. Turnipwood Blade

Suggested filename: `turnipwood-blade-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Turnipwood Blade, a cleaner rootwood short blade carved from pale turnip-like rootwood. Show a compact single-edged blade with creamy wood grain, faint root fibers, a slightly sharpened amber edge, a simple green cloth grip, and small copper pins. It should feel handmade, clever, and surprisingly capable, with gentle organic curves rather than polished metal.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 03. Pebbleknock Hammer

Suggested filename: `pebbleknock-hammer-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Pebbleknock Hammer, a squat practical hammer with a rounded river-stone head bound to a short oak handle. Show smooth gray-brown stone with chips and dents, sturdy twine lashings, a leather grip, and a compact silhouette that reads instantly at small size. It should feel sturdy, humble, and faintly funny without being silly.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 04. Apprentice Kettle Helm

Suggested filename: `apprentice-kettle-helm-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Apprentice Kettle Helm, a beginner’s protective helm made from a small hammered kettle. Show a rounded tin-and-copper kettle body repurposed as a helmet, little side handle loops, patched dents, a simple leather chin strap, and a warm worn metal sheen. It should look charming and practical, like a village apprentice made do with what was available.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 05. Briarweave Vest

Suggested filename: `briarweave-vest-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Briarweave Vest, a protective travel vest woven from tough dark green-brown plant fiber and patched leather. Show a sleeveless vest with thorn-like stitch patterns, reinforced shoulders, braided vine cord, and warm brass fasteners. It should feel defensive and rugged but not evil; the briar motif should look like practical protection, not the false Briar Crown.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 06. Giggleleaf Cloak

Suggested filename: `giggleleaf-cloak-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Giggleleaf Cloak, a playful green cloak made of overlapping leaf-shaped cloth panels. Show curled leaf edges, stitched seams, tiny seed-bead fasteners, and a slightly mischievous asymmetrical shape. It should feel nimble, whimsical, and family-friendly, with gentle humor rather than slapstick.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 07. Friendmaker Cloak

Suggested filename: `friendmaker-cloak-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Friendmaker Cloak, a warm welcoming travel cloak in soft blue-green fabric with golden-brown lining. Show gentle patched fabric, a clasp shaped like two simple leaves meeting or hands clasped abstractly, and soft folds that suggest shelter and trust. It should feel comforting, hospitable, and road-worn rather than fancy or royal.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 08. Stormbell Charm

Suggested filename: `stormbell-charm-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Stormbell Charm, a tiny weathered brass bell on a dark leather cord. Show a cracked bell shell, little etched cloud-and-rain shapes with no letters, a few contained blue-white sparks inside the bell mouth, and warm reflections on aged metal. It should feel like a small crackling charm, mysterious but not dangerous or horror-like.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 09. Lantern Pin

Suggested filename: `lantern-pin-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Lantern Pin, a humble roadwarden-like brass cloak pin shaped like a small lantern. Show a simple rounded pin with a warm amber lantern center, faint traveler scratch marks around the rim, and a sturdy clasp visible behind it. It should feel old, helpful, trustworthy, and handmade by travelers, not shiny or official.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 10. Warden Chain

Suggested filename: `warden-chain-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Warden Chain, a heavier late Chapter 1 reward. Show a short loop of aged iron-and-bronze chain with a central ancient warden medallion, root-like etching, green patina in the grooves, and a restrained amber glow from within one link. It should feel weighty, earned, protective, and connected to the Root Cellar, not flashy treasure.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

---

# Chapter 1 — Consumables and Clues

## 11. Healing Fizzpop

Suggested filename: `healing-fizzpop-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Healing Fizzpop, a small stoppered glass bottle of fizzy pink-gold healing drink. Show round warm glass, lively bubbles inside, a cork stopper tied with twine, and a tiny blank parchment tag with no writing. It should feel comforting, homemade, and slightly whimsical, like a village remedy that actually works.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 12. Trail Snack

Suggested filename: `trail-snack-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Trail Snack, a compact travel bundle wrapped in brown parchment and a broad green leaf, tied with twine. Show oat cakes, a wedge of cheese, a few dried berries, and a nut or two peeking out from the wrap. It should feel practical, homemade, and ready for Lantern Road travel.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 13. Fizzberry Handpie

Suggested filename: `fizzberry-handpie-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Fizzberry Handpie, a small golden crimp-edged hand pie with bright purple-blue berry filling bubbling from one little split in the crust. Show sugar dust, toasted edges, and a cozy bakery feel. The fizz should be magical and playful but contained, not explosive.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 14. Bubbleburst Tonic

Suggested filename: `bubbleburst-tonic-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Bubbleburst Tonic, a squat round glass flask full of blue-green tonic with oversized bubbles pressing against the glass. Show a cork stopper, a little twine wrap, and several contained bubbles rising around the bottle silhouette. It should feel energetic, fizzy, and slightly unpredictable while still warm and storybook-like.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 15. Moonmint

Suggested filename: `moonmint-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Moonmint, a small tied sprig of mint with crescent-shaped silver-green leaves. Show soft cool moonlit highlights, dewdrops, a twine tie, and a few darker green underside leaves. It should feel calm, restorative, and gently magical without overwhelming glow.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 16. Bubblecap Mushroom

Suggested filename: `bubblecap-mushroom-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Bubblecap Mushroom, a small cluster of forest mushrooms with rounded translucent caps like soap bubbles. Show creamy stems, mossy green shadows, little amber speckles, and bubble-like domes that catch warm light. It should feel strange, cute, and natural, not poisonous or creepy.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 17. Edden’s Blue Watch Cloth

Suggested filename: `eddens-blue-watch-cloth-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Edden’s Blue Watch Cloth, a folded piece of deep blue Bramblecross watch cloth. Show worn woven fabric, frayed edges, a simple stitched sword-and-laurel style watch crest with no words, and a small smear of dust or road grit. It should feel like a meaningful clue from a guarded civic town, sober and personal rather than decorative.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

---

# Chapter 2 — Clue and Investigation Items

## 18. Edden’s Three-Door Drawing

Suggested filename: `eddens-three-door-drawing-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Edden’s Three-Door Drawing, a folded scrap of parchment with a rough ink sketch of three simple doors. Show uneven fold creases, thumb-worn corners, three pictorial door shapes, small arrows or route marks with no letters, and a hint of blue watch-cloth fiber tucked at one edge. It should feel like an urgent clue drawn by hand, mysterious but readable even at small size.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 19. Willowmark Lens

Suggested filename: `willowmark-lens-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Willowmark Lens, a small brass magnifying lens used for careful investigation. Show round clear glass catching a warm highlight, a willow-leaf shape etched into the brass rim, green patina in the grooves, and a short dark wooden handle. It should feel precise, curious, and handmade, like something Pibble or Enna would respect.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 20. Broken False Seal Wax

Suggested filename: `broken-false-seal-wax-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Broken False Seal Wax, cracked fragments of dark red sealing wax bearing a rough thorn-crown impression. Show three or four broken wax pieces arranged as one centered object, jagged edges, a partly visible aggressive briar-crown mark, and tiny parchment fibers stuck to the underside. It should feel like false authority exposed, controlling and suspicious, but not horror-like.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 21. Pine-Pitch Wax

Suggested filename: `pine-pitch-wax-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Pine-Pitch Wax, a warm amber lump of pine resin and sealing wax. Show translucent golden pitch, small pine needles embedded in it, one soft waxy smear, and a bit of brown twine curled around the base. It should feel natural, sticky, fragrant, and useful for investigation or repair.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 22. No-Handle Token

Suggested filename: `no-handle-token-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: No-Handle Token, a strange small bronze token shaped like a simple door with no knob or handle. Show an oval or rounded-rectangle coin with a raised door outline, a conspicuously smooth blank spot where a handle should be, worn edges, and a faint dark groove around the center. It should feel like a puzzling clue rather than currency.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

## 23. Witness Note for Bramblecross

Suggested filename: `witness-note-for-bramblecross-icon-v01.png`

```text
Create a custom storybook fantasy item icon for Liam's Game as a 1024 x 1024 transparent PNG. Paint one single object only, centered on a real transparent background with no square backdrop. The file must have a real alpha channel: the background should be empty transparency, not a visible checkerboard, gray square, parchment square, painted vignette, spotlight backdrop, or full-scene glow. The object should be a warm hand-painted illustration with subtle brush texture, gentle ink-like line definition, soft watercolor/gouache layering, light paper-grain texture on the object itself, and cozy amber storybook lighting. It should be readable at 40 px, 64 px, and 96 px game UI sizes, with a clear silhouette and a small safe margin around the object. It should feel bespoke to a hand-painted family-friendly fantasy adventure, matching the warm lantern-lit portrait style: rich browns, soft greens, dark blue-green accents, parchment warmth, and careful little handcrafted details. The icon should be an item portrait, not a full scene. If true transparency is not available, use a flat solid temporary background color so it can be removed cleanly later.

Specific item: Witness Note for Bramblecross, a folded civic parchment note prepared for the Bramblecross watch. Show a tan folded note tied with dark blue thread, a small blank blue wax dab with a simple sword-and-laurel watch crest, and several short unreadable line marks that imply testimony without forming words. It should feel official, organized, guarded, and important, with Bramblecross’s practical civic tone.

No photorealism, no 3D render, no glossy mobile-game icon style, no stock vector look, no anime style, no harsh comic-book ink, no neon saturation, no grimdark horror, no modern objects, no sci-fi elements, no UI frame, no border, no label, no readable text, no fake checkerboard background, no checkerboard pattern of any kind, no gray square, no parchment square, no painted vignette, no spotlight backdrop, no cluttered scene, no object touching the image edges.
```

---

# Optional Batch Prompt Format

When generating icons one at a time, use the exact prompt for each item.

When generating a batch concept sheet instead of final icons, use this:

```text
Create a clean concept sheet of custom storybook fantasy item icons for Liam’s Game, showing [ITEM NAMES]. Each icon should be a separate single object on transparent or plain light parchment space, with consistent hand-painted storybook style, subtle brush texture, gentle ink-like definition, cozy amber lighting, and readable silhouettes for small UI. No text labels, no UI frames, no stock vector style, no fake checkerboard background. Keep the objects distinct and separated, each large enough to crop cleanly into a square item icon.
```

Use batch sheets only for exploration. For production, regenerate or crop one icon per file with true transparency.
