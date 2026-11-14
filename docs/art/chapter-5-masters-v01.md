# Briarhold layout and scale / lighting masters v01

Masters produced **2026-11-13** against the owner-accepted Chapter 5 greybox, then accepted as the foundation for painting. These editable technical compositions establish architecture, dimensions, proposed intermediate travel nodes and the 4:3 rescue crop. Production navigation/frame integration remains outstanding. The later track-removal correction updates one matching prose paragraph; runtime maps, checkpoints and combat behavior are unchanged.

**Current revision 4 / rescue painting:** [closed/open room candidate v02](briarhold-rescue-paint-v01.md) uses the accepted grille-above-E arrangement. The owner rejected rail-like floor strips during painting, so the current master has ordinary uneven stone paving and a freely wheeled cart beside the steps. Guide light reveals the floor, step edge and brake, with no cart track. One matching runtime prose sentence was updated; no mechanics changed.

**Owner accepted the masters and authorized the approach painting.** [The first painted approach candidate](briarhold-approach-paint-v01.md) is now in the review page. Revision 2 incorporated his natural-wet-runoff/no-path and farther-off-road-shelter corrections. The current shared layout is **revision 3**: at his suggestion, G is north/above E, so the party can observe through the grille before approaching the doorway. The table moves 0.4 m north to clear all three views, the upper gallery extends 1 m for marker clearance, and the entrance's upper jamb moves 0.3 m south. The approach painting and its revision-2 source geometry are unchanged by this rescue-room correction.

Open the [standalone review](../../assets/reference/concept/environments/chapter-5-masters-v01/briarhold-review-v01.html), or use the running development server at `http://127.0.0.1:5185/assets/reference/concept/environments/chapter-5-masters-v01/briarhold-review-v01.html`. It works offline and does not access game storage. The [overview](../../assets/reference/concept/environments/chapter-5-masters-v01/briarhold-overview-v01.png) and [six-view contact sheet](../../assets/reference/concept/environments/chapter-5-masters-v01/briarhold-masters-contact-sheet-v01.png) provide static previews.

## Files and editable source

All generated images and the standalone HTML live in `assets/reference/concept/environments/chapter-5-masters-v01/`.

| Sheet basename | Source | Purpose |
|---|---|---|
| `briarhold-site-layout-v01` | 2048 × 1440 | Shared north-up site/floor plan, room numbers, connections, crop bounds, floor heights and guide-light branches |
| `briarhold-approach-scale-v01` | 2048 × 1152 | 46 × 25.875 m approach; routes, anchors, portals, trigger markers, phone marker envelopes |
| `briarhold-approach-lighting-v01` | 2048 × 1152 | Exposed receiving approach versus lower runoff; fixed lights and occluded party halo |
| `briarhold-rescue-scale-v01` | 2048 × 1536 | 20 × 15 m room/gallery/cell composition; mandatory first sight, cover, actors, danger and clearance |
| `briarhold-rescue-lighting-closed-v01` | 2048 × 1536 | Grille arrival with the guide shutter closed; far-side brake rod obscured |
| `briarhold-rescue-lighting-open-v01` | 2048 × 1536 | Cart caught with the amber beam open, brake exposed and separate escape route |

Every sheet has an editable SVG and lossless PNG. Shared geometry is in `layout.json`; coordinates are metres, east right and south down. `scripts/lib/chapter5-master-drawing.mjs` draws both exports and the review page, so revising the plan also revises the lighting studies. SVG groups separate architecture, props, light footprints, actors, navigation/clearance, annotations and sheet furniture. No unused image has been placed in a production asset folder.

Regenerate and check from the repository root:

```powershell
node scripts/build-chapter5-masters.mjs
node scripts/check-chapter5-masters.mjs
```

## Briarhold as one place

The broken roadworkers’ shelter is uphill and faces downhill through its open side. The opening climb leaves the road and crosses rough overgrown ground in silence; this remains the existing authored transition. Its lookout sees the receiving gate and low work window without putting the party against the skyline. A broad ridge road reaches the lit gate. The lower route follows a wet natural streambed beneath a retaining wall into the culvert; it is not a maintained trail. The service court occupies the terrace above that wall.

Both entrances reach room **01**, the service landing. The receiving entrance is a main-floor transition. The culvert runs through the subfloor and rises into the same landing. It does not lead directly into the workshop. Rooms **02–07** arrange the central hub, upper records, lower workshop, raised signal platform, inner post/gallery and Crown Table room. The platform is reached through the workshop and returns to the inner post. There is no additional hub-to-platform shortcut. The quenching trough is outside the workshop; the service court remains a separate safe gathering space near the landing.

The signal platform retains two separate sightlines: west/northwest into the receiving yard and north into the inner post. The ordinary amber guide lamp sits at +4.6 m above the landing datum, on the +3.4 m platform. One reflector branch lights the hub/stair junction. Another straight shaft reaches the rescue room’s high opening at +2.8 m. The direct fan reaches the brake at about +1 m, with softer reflected floor light over the uneven paving. This is an elevated light channel, not a traversable passage or a bent magical ray. Other floor levels are workshop −2 m, landing/hub/rescue 0 m and records +2.8 m.

## Rescue geometry

The inspection grille is **above/north of E**, in the wall between the upper gallery and the room. From E `(43.9, 17.3)`, the party moves north to G `(43.9, 14.0)` without crossing in front of the entrance. The actual window spans wall y=14.2–15.3; the separate doorway is farther south at y=17.8–20.7. Observe first, return south to E, then continue toward the doorway. The first-sight gate also applies before the lower gallery bend, preserving that order.

Three view rays pass through the grille to Lio/cuff, the brake assembly and the right edge of the first loading step. The route table shifts 0.4 m north so none of those views crosses it or Mara’s console. Physical visibility of the brake's location does not make the obscured rod readable before the amber guide lamp opens. Grille observation remains mandatory before the confrontation. The console is substantial cover; Mara stays behind it during combat. Four enemy footprints show a representative alerted encounter, not a permanent roster baked into the background.

Bracken moves from the table to the cart, kicks up the brake, then escapes **east** through a personnel door. The cart moves **south**, with Lio cuffed to it, toward steep stone loading steps. The hero turns back through the clear south aisle. Mara runs toward Lio and the selected conscious companion braces the cart; the companion footprint is a staging slot, not a new requirement that a companion be conscious.

The cart is 1 × 1.2 m. It begins at world `(54.8, 19.1)`, moves to `(54.8, 19.9)` on release, and stops at `(54.8, 20.2)` on catch/brake. Its nose stops at y=20.8, **0.7 m before the first step** at y=21.5. The steps descend 2.8 m. The cuff remains shut until the third action. Bracken’s exit, the downhill steps and the cells are separate openings with distinct silhouettes.

The fallen Sentry lies north of the south aisle. Its changed-state bounds clear the return line. The cell-release stance sits outside the barred fronts. The near cell contains a packed bundle; Hesta occupies the far cell. A legacy Orren cell occupant must replace the bundle overlay exclusively, preserving the existing save compatibility and four-present/fifth-transferred accounting.

The map’s hero pin denotes the party’s navigation anchor. Small actor circles show approximate 0.6 m physical footprints. Authored rescue staging can move characters within the action space; the large screen-sized pin is not a human body or an arm-reach measurement. The battle still uses the accepted four-card battle presentation.

## Navigation and trigger boundaries

The existing quest anchors keep their IDs. Intermediate `a##` / `r##` points are proposed subdivisions for painted-path alignment. Explicit aliases and the complete edge/trigger list are inspectable in the review page and `layout.json`. They are not registered in `chapter5Runtime.ts`.

- Approach: shelter → descent → fern bend → ridge fork. Right continues through cover to the gate; down follows the root bank, runoff and retaining wall to the culvert. Backtracking follows the reciprocal aliases. Gate and culvert transitions require the existing receiving/grate actions; the drawn portal dashes are not free-walk links.
- Interior topology remains landing–hub, hub–records, hub–workshop–platform–inner post and hub–inner post. The site circulation strokes establish architectural connections and levels; they do not claim every interior corridor has received a token-scale master.
- Rescue: **E ↑ G ↓ E**, then down through the first-sight gate to the lower gallery bend and right through the console-side entrance. The grille spur stays north of the doorway, removing the earlier need to pass the entrance before looking in. Follow the south aisle around the table to the confrontation. After victory, down through the east bend reaches the cart stance. The east aisle/cell threshold is gated on Lio’s rescue. Backtracking to the inner post stays available once the authored rescue permits it.
- Dashed rust boxes identify **node/action boundaries**, not newly invented proximity radii. The shelter recovery/checkpoint, saved grate check and separate crawl action, mandatory first sight, saved boss, catch/brake/cuff sequence, cuff reward and departure requirements retain their runtime one-shot behavior. No automatic encounter or real-time countdown is added.

The review deliberately lets the observer cross gates, switch stages and select any anchor to inspect the whole composition. Its navigation is an art tool, not a playable replacement for the greybox.

## Frame, marker and lighting checks

The measurements below come from the existing game shell, not the full viewport width. The proposed Chapter 5 composition keeps status/interaction controls outside the image, matching the current Chapter 5 greybox. Generic `MapStage` currently has overlaid controls; production integration must explicitly preserve this proposed Chapter 5 framing before adopting the coordinates. The rescue’s taller crop is supported by per-map aspect ratios but is not wired yet.

| Viewport | Painted width | Hero diameter | Approach height | Rescue height |
|---|---:|---:|---:|---:|
| 1280 × 720 | 870 px | 52 px | 489.375 px | 652.5 px |
| 390 × 844 | 332 px | 32 px | 186.75 px | 249 px |
| 430 × 932 | 372 px | 32 px | 209.25 px | 279 px |

The hero marker keeps the existing −50% / −70% anchor. Clearance includes the 3 px shadow outside its diameter and a further 0.2 m stand-off from solid props/walls. The dashed envelopes show the selected display size; they are UI clearance, not an enlarged physical character. The body footprint is checked separately. In revision 2 the narrowest sampled clearance is **0.263 m on the approach** and **0.215 m in the rescue room**. Every movement edge is sampled at intervals no larger than 0.025 m, including released/stopped cart and fallen-Sentry states. These are model margins; recheck them against the painting and final crop.

The review can place the party halo at every travel node, including arrival, intermediate steps, junctions and backtracking. Fixed light and the low party halo raycast against wall/prop occluders. The gate lamp has a restricted outward fan. The rescue’s low halo casts a cart shadow across the far-side brake; a check confirms the brake would be within light range without the cart, so the occlusion check is meaningful. The separate high amber beam reveals it when open. These are design footprints, not claims of a finished runtime lighting renderer or physically accurate illumination.

Phone presets hide dense drafting labels by default; 10 px anchor letters, the selected landmark/trigger details and navigation controls remain outside/above the map where appropriate. Labels can be re-enabled for inspecting the source. The image safe inset marks crop breathing room, with no status panel or D-pad consuming the illustration. Clean composition hides navigation/debug annotations while retaining the normal hero marker and state actors.

## State inventory for painting

| Element | Treatment |
|---|---|
| Terrain, masonry, shelter, receiving wagon, route table, console, steps and cell shells | Base composition; keep interactive details clear of the token envelope |
| Gate guards, unloading movement, culvert grate closed/open/wedged | State overlays; explicit entry/grate actions stay in UI |
| Guide lamp closed/open; green fixed lights; party halo | Separate light layers clipped to agreed geometry; final night values still need painting review |
| Uneven footing, step edge and far-side brake readability | Warm open-state lighting layer; do not bake the solved state into every background |
| Bracken, guards, Sentry, companion, Mara and Lio | Stateful actors; remove defeated/escaped personnel, preserve companion absence/down state |
| Cart release/catch/brake; cuff closed/open | Independent bounded overlays; changing the brake alone must not free Lio |
| Fallen Sentry; opened escape door; cleared cells | Changed-state overlays, preserving the south return aisle |
| Hesta / near-cell bundle / legacy Orren | Mutually exclusive occupant states; remove after gathering |
| Anchor pins, exact labels, triggers, puzzle/evidence text | UI/debug overlays; never paint exact answers or microtext |

## Verification and next review

`validation.json` records passing topology, aspect, reciprocal alias, sampled clearance, stopping-distance and cart-shadow checks. Revision 3 additionally checks the observation route's body footprint stays north of the doorway, the entry-to-grille connection/gate order, and all three furniture-clear view rays through the actual aperture. `review-checks.json` records six passing browser frame/view combinations, exact map/marker sizes, reciprocal arrow movement (including E ↑ G ↓ E), light/stage changes, clean view, zero page errors and no horizontal overflow. `review-grille-*.png` captures show the new position at all three frames. The offline browser review never opened the game or touched the owner’s save. The served review URL also returned HTTP 200.

Open `briarhold-review-v01.html?view=rescue&node=grille` to start at the revised inspection position. The earlier below-doorway closed-lamp sheet is preserved as `briarhold-rescue-grille-before-move.png` for comparison.

Review the overall arrangement, approach distance, rescue room proportions and closed/open contrast next. If accepted, establish the finished storybook paint treatment on the approach, inspect it under these same overlays, then paint the rescue room against the agreed geometry. The remaining room masters inherit this site layout. Final paintings, runtime registration, asset optimization and the illustrated release-candidate gate remain outstanding.
