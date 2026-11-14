# Briarhold rescue room — painted candidate v02

Produced **2026-11-13** using the **built-in imagegen tool**, from the owner-accepted grille-above-E layout. Current candidate is the paired **closed/open v02** room backgrounds plus a separate true-alpha painted ordinary cart. During painting the owner rejected the rail-like floor strips: they are removed from both paintings, the master renderer and current story references. The cart runs freely over the uneven stone landing. Bracken creates the danger; the building has no track-to-stair system.

## Review and saved artwork

Open the development review at `http://127.0.0.1:5185/assets/reference/concept/environments/chapter-5-masters-v01/briarhold-review-v01.html?view=rescue&node=grille&clean=1`. Enable/disable **Guide lamp open** to switch the painted light state; toggle **Rescue painting v02** to compare geometry. **People / staging markers** hides the schematic character footprints while retaining the painted cart. Rescue stage moves the cart and changes brake/cuff/character overlays independently.

- [Closed-guide background](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/briarhold-rescue-closed-v02-2048.png)
- [Open-guide background](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/briarhold-rescue-open-v02-2048.png)
- [Closed/open comparison with movable cart](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/rescue-lighting-comparison-v02.png)
- [All eleven navigation anchors over paint](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/painted-node-alignment-v02.png)
- [Transparent cart export](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/briarhold-rescue-cart-v01-trimmed.png)

Everything is saved under `assets/reference/concept/environments/briarhold-rescue-paint-v01/`. Native room images are **1448×1086**, exactly 4:3. Full-image 2048×1536 exports preserve the crop/aspect without claiming extra generated detail. Quality-90 reference WebPs are **354,282 bytes closed** and **314,832 bytes open**. The cart's original 1355×1161 alpha PNG is preserved; a trimmed 448×384 PNG/WebP display export maps to the 1.4×1.2 m deck/wheel envelope. Alpha checks confirm genuinely empty and solid regions. None of these candidates is promoted to a runtime asset folder yet.

## Composition and state treatment

The grille remains above E in the narrow western gallery. The party can inspect Lio and the loading steps without passing the lower doorway. The route table stays north of those sightlines; Mara's console stays beside the entrance. The south aisle, cart-side stance and separate east escape door remain clear. The steps descend south; the two empty adjoining cell shells are southeast.

The closed room has four practical green-glass work lights and a dark high south-wall slot. The open variant admits an amber fan through that same slot over the uneven paving, cart/brake area and upper step edge. There are no glowing tracks, brass floor guides or purpose-built cart rails. The backgrounds contain no people, permanent cart, cuff, dropped reward, captive bundle or stateful door leaf. The only painted map text is an indistinct illustrative route chart, with no exact clue or readable label.

The cart is an ordinary low four-wheel timber workcart with a small writing board and iron anchor eye. Its movement is not baked into either background. Brake/cuff details and actor footprints remain state overlays; the rod stays obscured with the guide closed and is revealed when open. The caught/braked deck stops at the existing **0.7 m** gap above the first step. Actor portraits/animations and exact cell/door/board overlays remain later integration work; schematic footprints are not final character artwork.

The review loads the corresponding fixed-light painting and adds optional light footprints without a second darkness mask. It does not claim a new runtime lighting renderer. The source lamp is outside this crop, so no new interior amber lamp was invented.

## Source prompts and references

| Prompt | Role |
|---|---|
| [Closed v01](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/prompt-closed-v01.md) | Original paint from revision-3 closed light master; approach v05 and Briar Relay material/style references |
| [Open v01](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/prompt-open-v01.md) | Lighting-only edit using the revision-3 open guide footprint |
| [Cart v01](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/prompt-cart-v01.md) | Separate transparent cart from a code-native geometry sketch and room style |
| [Closed v02](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/prompt-closed-v02.md) | Owner correction removes the rail-like strips from the closed room |
| [Open v02](../../assets/reference/concept/environments/briarhold-rescue-paint-v01/prompt-open-v02.md) | Same correction in the open-light variant |

All native passes are retained. V01 room outputs and revision-3 reference sheets document the rejected strips; do not use them as current art. The revised master and clean `reference-r4` sheets remove those features. The sole runtime prose correction replaces brass floor guides with uneven paving and the step lip; the False Order and brake benefits, checks, damage, saves and rescue stages are unchanged.

Rebuild with:

```powershell
node scripts/build-chapter5-rescue-paint.mjs
node scripts/build-chapter5-masters.mjs
node scripts/check-chapter5-masters.mjs
```

## Checks and next work

Master geometry, all movement-edge samples, aperture/sightline checks, stopping distance and occlusion pass with unchanged 0.263 m approach / 0.215 m rescue minimum model clearance. The six offline browser frame/view checks now exercise both paintings, guide switching, the separate cart, hidden/revealed brake, all rescue stages, open cuff and staging-marker toggle. Desktop and both phone widths/hero sizes pass, without page errors or horizontal overflow. The comparison, all-anchor sheet and browser frames were visually inspected. These checks do not automate pixel-perfect collision segmentation of every painted stone edge; owner art review and later runtime alignment remain required.

The matching prose correction also passed production build, all 94 rules and all 41 Chapter 5 browser cases across the combined run and two focused production-preview reruns. The two initial browser interruptions show development-server navigation/reload during actions; both passed on stable preview without any code/test adjustment. No older-chapter browser or full release-candidate gate is claimed.

**Night-wrap mechanics implemented:** Bracken's Sabre is a once-only post-rescue pickup, and the gathered party has a one-time service-court recovery before departure. [The planning decisions](../planning/chapter-5-planning-decisions.md#bracken-loot-and-court-recovery--implemented-november-13) give the final specs. Keep loot and resting people as independent presentation/state layers. [The next scene-art queue](chapter-5-scene-art-plan.md) includes the court rest, most interior rooms and the long return/ending narratives.
