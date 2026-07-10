# Chapter 2 Crown Door Den Close-Up And Icon Prompts

Use these prompts for ChatGPT image generation. They are designed for easy copy/paste and can be run in batches of up to 10 similar images.

The goal is to replace temporary symbolic/text map tokens and door icons with real storybook art that matches the existing Three-Door Threshold and Crown Door Den assets.

Promoted map-token outputs should live in `assets/icons/map-tokens/`, and promoted tension UI outputs should live in `assets/icons/ui/`, so Vite imports stay simple and no paths contain spaces.

## Shared Style Block

Use this style block at the start of each prompt if generating one image at a time, or once for the full batch:

```text
Liam's Game storybook fantasy art style: hand-painted warm children's fantasy illustration, subtle watercolor/gouache texture, soft brushwork, gentle ink-like definition, cozy but tense lantern light, handmade illustrated-book atmosphere, family-friendly adventure tone, earthy greens, root browns, warm amber light, muted parchment, pine-wax gold, and restrained false-crown red accents. The image should feel handmade rather than slick digital art. Clear readable silhouette at small UI sizes. No photorealism, no 3D render, no anime, no horror, no gore, no modern objects, no readable text, no logo, no watermark.
```

## Batch 1: Three Door Close-Ups

Generate these as separate square or 4:3 close-up images. These are for dialogue panels, not item icons. Keep the full door readable and centered with a little surrounding root/stone context.

```text
Create a close-up storybook fantasy dialogue image of the Crown Door from Liam's Game Chapter 2. A tall, too-official false door set into an old forest hillside beneath tangled roots. The door is newly painted compared with the old stone around it, with a crooked thorn-crown motif and too many handles or oversized handles that practically demand to be pulled. It should feel bossy, suspicious, handmade, and false, not truly royal. Include root-stone edges and a hint of the Three-Door Threshold environment around it. No readable text. No characters. Output as a high-resolution PNG, 4:3 or square, centered and easy to crop for a dialogue panel.
```

```text
Create a close-up storybook fantasy dialogue image of the Lantern Door from Liam's Game Chapter 2. A lower, older, weathered door set into old stone and roots, with a humble lantern mark, moss, worn edges, and warm golden light. It should feel quiet, kind, and helpful, a door that guides rather than commands. Include a little root-stone context from the Three-Door Threshold. No readable text. No characters. Output as a high-resolution PNG, 4:3 or square, centered and easy to crop for a dialogue panel.
```

```text
Create a close-up storybook fantasy dialogue image of the No-Handle Door from Liam's Game Chapter 2. A smooth stone door grown into roots, with no handle, no keyhole, and no obvious seam at first glance. Near the base, include a tiny hook-tailed courier scratch mark that an observant viewer might notice, but keep it subtle. The door should feel honest, hidden, patient, and old, not scary. Include root-stone context from the Three-Door Threshold. No readable text. No characters. Output as a high-resolution PNG, 4:3 or square, centered and easy to crop for a dialogue panel.
```

## Batch 2: Crown Door Den Map Tokens

Generate these as a batch of separate transparent PNG icons. Each icon should be one object or compact object cluster, not a full scene. These replace the temporary `wax`, `sign`, `map`, and `link` text tokens.

```text
Create six separate transparent PNG map-token icons for Liam's Game Chapter 2: Crown Door Den. Each icon should be a small hand-painted storybook object cluster, centered on a real transparent background, readable at 48-96 px, with no square backdrop and no readable text.

1. Wax Table token: pine-pitch wax lump, green Willow wax scrap, red false-crown wax, tiny stamp, and heating spoon arranged as a compact worktable clue.
2. Slat Rack token: two or three small removable wooden road-sign slats, one false crown-red slat cracked, one older lantern-mark slat partly cleaned, no readable lettering.
3. Witness Ledger token: closed route ledger with string, folded witness notes, a small blue watch mark or courier cord, no readable words.
4. Collar Kennel token: broken thorn collar links beside soft bedding or straw, threatening but not cruel, no gore.
5. False Map token: compact distorted route map with red string and pins, crossed straight route shape, hidden lantern mark impression, no readable labels.
6. Crown Den Exit token: root-stair or threshold-return arch marker, warm lantern glow, old stone edge, suggests a safe way back.

Style: Liam's Game storybook fantasy art style, hand-painted, warm but tense, clear silhouettes, subtle brush texture, family-friendly. Use transparent backgrounds. No text labels, no UI frames, no logos, no watermarks, no fake checkerboard background.
```

## Batch 3: Completed / Broken Den Tokens

Generate these only if the map needs distinct "cleared" token art instead of using CSS treatment on the regular icons.

```text
Create five separate transparent PNG "cleared clue" icons for Liam's Game Chapter 2: Crown Door Den. These should match the regular den map-token icons but show that the player has already disrupted the false signworks. Each icon should be centered, readable at 48-96 px, and on a real transparent background.

1. Cleared Wax Table: wax seals broken apart, heating spoon cooled, copied wax scraped away, no readable text.
2. Broken Slat Rack: false sign slats snapped, one old lantern mark visible underneath, no readable text.
3. Copied Witness Ledger: route ledger open with a copied note tucked safely away, no readable words.
4. Broken Collar Kennel: thorn collars cracked open beside empty bedding, implying the danger has been disarmed, no cruelty or gore.
5. Cleared False Map: red strings slack, pins removed, a small clean lantern mark visible, no readable labels.

Style: warm hand-painted storybook fantasy, subtle gouache/watercolor texture, clear small-size silhouette, family-friendly tension, transparent background, no UI frame, no logo, no watermark, no fake checkerboard.
```

## Batch 4: Pursuit / Tension UI Icons

These are optional, for the den pressure system.

```text
Create four separate transparent PNG UI icons for Liam's Game Chapter 2: Crown Door Den pursuit/tension meter. Each icon should be a compact hand-painted storybook symbol, centered, readable at 32-64 px, no text, no UI frame.

1. Distant Scratching: small claw or scratch marks on wood with tiny amber dust.
2. Chain Drag: a short thorny chain link dragging across stone.
3. Hound Warning: a small thorn-collar silhouette or alert hound ear shape, not scary or realistic.
4. Patrol Caught Up: crossed false sign slats with a sharp red thread knot, tense but family-friendly.

Use Liam's Game storybook fantasy art style, transparent background, warm dark den colors with amber highlights and restrained false-crown red. No readable text, no horror, no gore, no logo, no watermark.
```

## Batch 5: Optional Door Crop Repair

Use this if cropping the existing Three-Door Threshold image does not give clean enough door close-ups.

```text
Create three separate door close-up images for Liam's Game Chapter 2, matching the existing Three-Door Threshold scene exactly in style, color, lighting, and materials. The images should be: Crown Door close-up, Lantern Door close-up, No-Handle Door close-up. Keep each door centered, full height visible, with root-stone surroundings and no characters. The Crown Door should be loud and false with too many handles; the Lantern Door should be humble and old with warm guidance; the No-Handle Door should be smooth stone with no handle and a tiny hook-tailed courier mark near the base. No readable text, no UI, no logos, no watermarks. High-resolution PNGs, 4:3 or square.
```
