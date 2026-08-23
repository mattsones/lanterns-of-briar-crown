# Chapter 4 Folded Map Faces

## Production Decision

The accepted Folded Map remains one opaque, two-sided rectangular sheet with 54 two-fold configurations. Production art replaces the schematic terrain only. Exact route fragments, clue marks, labels, fold clipping, reverse-face transforms, and success/failure traces remain code-authored SVG so the generated painting cannot change or reveal the solution.

The optional third-fold Lanternwell cache remains retired. Neither painted face contains a lantern cache, treasure mark, or third solution.

## Selected Assets

- Front/source: `assets/reference/source-art/assets/maps/folded-map-survey-face-v01.png`
- Front/runtime: `assets/maps/folded-map-survey-face-v01.webp`
- Reverse/source: `assets/reference/source-art/assets/maps/folded-map-road-crew-face-v01.png`
- Reverse/runtime: `assets/maps/folded-map-road-crew-face-v01.webp`

Runtime derivatives are 1600 × 992 WebPs cropped to the component's 1000:620 sheet ratio.

## Front-Face Prompt

Generation mode: built-in ImageGen, new-image generation.

Create a production-ready painted texture for the front face of a fantasy folding road map used as an interactive puzzle in a storybook adventure game. Show one flat, perfectly overhead rectangular sheet in approximately 1000:620 landscape proportion, with the artwork filling the canvas edge to edge and no surrounding table, props, perspective, shadows, folds, creases, or UI. Paint a formal civil survey of Westroot's Lower Gate district beneath an ancient rootbound city: pale amber parchment, a narrow muted teal river running north-to-south at roughly 62% width, enormous braided roots, old fitted-stone causeways, small paving, low arches, retaining walls, elevation hatching, and restrained survey geometry. Keep roads and landmarks long and small-scale. Make this face cleaner, lighter, and more measured than the reverse, while retaining hand-painted ink, watercolor, and fine-pen character. Preserve lower-contrast overlay space through the center-left, upper center, upper right, and lower center. Include only subtle incomplete road traces and no bold continuous solution. Exclude readable text, numerals, symbols, compass rose, border ornament, icons, people, lanterns, lantern cache, treasure marks, detour or construction signs, glow, modern printing, and pure black.

## Reverse-Face Prompt

Generation mode: built-in ImageGen, reference-guided new-image generation using the selected front face.

Using the front-face painting as geographic and stylistic reference, create the reverse face of the same physical fantasy folding map. Preserve the flat overhead 1000:620 format, rootbound district geography, river placement, fitted-stone works, long road scale, braided roots, and ink/watercolor craft. Change the treatment to an older road-crew field-correction map: darker weathered flax and ochre parchment, muted olive-brown ink, imperfect contour hatching, faded corrections, worn stains, measurement ticks, erased traces, and older stone partly reclaimed by roots. Keep the center, upper center, upper right, west-middle, and bottom quarter low enough in contrast for exact SVG clues. Include no bold continuous solution or conspicuous shortcut. Apply the same exclusions as the front face, especially no readable text, lantern cache, treasure mark, folds, or baked puzzle answer.

## Visual Verification

Desktop in-app checks cover both flat faces, the accepted front-up west-half plus south-three-quarter true route, and the front-up north-half plus east-half Survey Shortcut. The richer faces remain legible under folds, while the deterministic overlays preserve both outcomes.
