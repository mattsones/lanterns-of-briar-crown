# Chapter 3 Westroot Map Prompt Pack

Use this pack with ChatGPT image generation while the Chapter 3 placeholder map is being built.

## Production Scope

Chapter 3 needs **one required playable map background**: the **Westroot Hub**. The hub contains First Westroot Gate, Rootmarket, Mossgarden, Witness Stones, Split Hall, and Cargo Siding on one connected map. Do not generate separate maps for each of those places unless the playable route later proves too crowded.

The Mossgarden and Cargo Siding should be visually distinct districts within the same image, not disconnected interiors. Narrative closeups are deliberately out of scope for this map pack; they can be generated later as scene art after the playable flow is approved.

## Global Style Block

Include this style language in every prompt below.

```text
Hand-painted storybook fantasy gameplay-map background for Liam's Game. Warm watercolor and gouache texture, gentle ink-like edge definition, handmade illustrated-book feeling, middle-ground family-friendly fantasy, readable landmark silhouettes, subtle paper grain, and balanced contrast for UI overlays. The image must feel like a playable map, not a cinematic landscape, poster, or character illustration.
```

## Global Negative Prompt

```text
No photorealism, no 3D render, no anime, no horror, no grimdark palette, no sci-fi, no modern objects, no readable text labels, no captions, no logo, no watermark, no UI panel, no character closeups, no heavy fog, no busy crowd that hides paths, and no baked-in gameplay icons.
```

---

# 1. Required Production Candidate — Westroot Hub

**Suggested filename:** `westroot-hub-gameplay-map-v01.png`

```text
Create a 16:9 landscape hand-painted storybook fantasy gameplay map for Liam's Game, Chapter 3: The Hidden Root. This is the one connected hidden village map called Westroot, built inside a broad, welcoming cavern beneath a green hill. It must support invisible node or tile-based movement, with clear walkable routes between named landmark zones but no readable labels baked into the art.

View: top-down to gently angled isometric board-game-map view, broad enough to show the whole community. Keep the center and all walking routes visually open enough for a hero token, fog of war, interaction tokens, and small UI labels.

World: Westroot is a living Stonekin and Mossback old-road community, not a dungeon and not a ruined mine. It has fitted gray stone terraces, roots that have grown around homes without breaking them, warm gold-and-green moss lanterns, wooden footbridges, water channels, small carved rail grooves, tiny gardens, practical market awnings, bread ovens, repaired shutters, and signs of ordinary people carefully maintaining an old route. It should feel hidden and cautious but genuinely inhabited, with warmth, dignity, and gentle whimsy.

Arrange these six visually distinct gameplay zones across one connected walkable hub:

1. First Westroot Gate: at the lower-left or near foreground edge, an oval root-and-stone threshold with a small bridge leading into the town. It should feel old, watchful, and recently opened, not threatening.
2. Rootmarket: central warm market shelf with rootbread stall, jars, lamp oil, carved stone toys, modest awnings, baskets, and a few small domestic details. Leave generous open walking room.
3. Mossgarden: an upper or side garden district with shallow water channels, glowing pale moss, old stone name tablets, and quiet sheltered paths. It should read as a place of memory and care.
4. Witness Stones: a clearly readable circular or semicircular set of four worn standing stones near the Mossgarden, connected by a low water channel. The production base map should show the approach open and walkable. A temporary oak-and-brass Westroot hold-shutter belongs in a separate stateful overlay or pre-renewal variant; do not depict it as Briar Crown construction, and do not include a false Crown plaque.
5. Split Hall: a sturdy communal stone hall with a wide front plaza or meeting terrace, central enough to feel like the civic heart of Westroot. It should not look royal or militaristic.
6. Cargo Siding: an upper-right or far-side storage district with old rail grooves in stone, covered lamps, neat stacks of sealed crates, a service passage, and a little visual tension from muted red-briar details. It must still read as part of the village rather than a separate dungeon.

Composition rules:
- Make the route from the gate to Rootmarket obvious.
- From Rootmarket, provide clear paths to Mossgarden/Witness Stones, Split Hall, and Cargo Siding.
- Use varied elevation, bridges, roots, and terraces without creating visually confusing dead ends.
- Keep the outer edges naturally enclosed by cavern wall, roots, or dark recesses, but do not use deep black voids.
- Use warm stone gray, moss green, lantern gold, bark brown, rootbread amber, and small controlled accents of false-authority red. The red should feel invasive, not dominant.
- Keep important landmark centers and route junctions free of busy scenery.
- Do not put people, speech bubbles, signs, text, labels, arrows, icons, or a player character into the final image.

Output a high-resolution PNG, ideally 1920 by 1080 or larger. Preserve clean safe margins near every edge. This is production source art for later optimization into a WebP runtime background.
```

---

# 2. Alternate Production Candidate — Westroot Hub, More Open Navigation

Generate this only if the first candidate makes the routes too dense, dark, or vertically confusing.

**Suggested filename:** `westroot-hub-gameplay-map-v02-open-routes.png`

```text
Create a second 16:9 landscape gameplay-map candidate for Liam's Game, Chapter 3: The Hidden Root. Use the same hand-painted storybook fantasy style and the same six Westroot zones: First Westroot Gate, Rootmarket, Mossgarden, Witness Stones, Split Hall, and Cargo Siding.

Prioritize map readability over atmospheric complexity. Use a slightly higher top-down view and a broad ring-road or three-pronged plaza structure: the gate enters a central Rootmarket plaza; a calm green Mossgarden and its four Witness Stones sit to one side; Split Hall sits on a central upper terrace; and Cargo Siding occupies the opposite side behind a clearly visible service route. Make every destination legible at a glance with open stone paths, low bridges, and modest elevation changes.

Westroot must remain a warm inhabited underground road-community of Stonekin and Mossback people. Show fitted stone, roots, water channels, moss lanterns, bread ovens, practical stalls, and old route infrastructure. Use only light touches of Briar Crown red near the Cargo Siding. Keep the same clean overlay space, no text, no people, no UI, and no icons.

Output a high-resolution PNG, ideally 1920 by 1080 or larger, with clear edge safe margins for a React gameplay map.
```

---

# 3. Optional Contingency — Cargo Siding Inset Map

Do **not** generate this unless the first implementation shows that the Cargo Siding needs a dedicated combat/investigation map. The current plan keeps it within the Westroot Hub.

**Suggested filename:** `westroot-cargo-siding-gameplay-map-v01.png`

```text
Create a 16:9 landscape hand-painted storybook fantasy gameplay map for a small Westroot Cargo Siding beneath the hill. This is a connected old-road storage chamber, not a horror dungeon: fitted stone, shallow old rail grooves, covered moss lanterns, root-wrapped support pillars, tidy stacks of plain sealed crates, an open loading apron, a service tunnel, and a visible route back to Westroot.

The mood is tense because false Willow-sealed cargo has been discovered, but the setting should still look like a real village work space. Include small hints of invasive false authority—muted red wax drips, a thorn-cord scrap, a crooked nailed slat—without readable text, huge symbols, or excessive red. Leave a broad central floor area open for a simultaneous multi-enemy battle and map-token overlays.

Use a top-down / gently angled board-game-map composition with clear paths and safe margins. No people, readable labels, UI, icons, logos, watermarks, photorealism, 3D rendering, anime, heavy fog, or grimdark horror.

Output a high-resolution PNG, ideally 1920 by 1080 or larger.
```

---

# Selection and Handoff Checklist

Before promoting any candidate into `assets/maps/`:

1. Confirm every planned landmark reads without embedded text.
2. Check that paths are wide and distinct enough for hidden node movement.
3. Keep high-detail props away from expected node centers and UI-token space.
4. Save all raw generations under `assets/reference/source-art/` or a Chapter 3 reference folder.
5. Promote only the selected opaque source image to `assets/maps/`, then run:

```bash
npm.cmd run optimize:assets
npm.cmd run audit:assets
```

6. Keep the placeholder-map fallback and all token/text fallbacks until the selected asset is visually checked with Map Debug on and off.
