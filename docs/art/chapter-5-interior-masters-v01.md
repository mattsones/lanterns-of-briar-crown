# Briarhold interior navigation and lighting masters v01

**West wall revision for review.** Compare the painted approach with the [revised floor plan and side sections](../../assets/reference/concept/environments/chapter-5-interior-masters-v01/briarhold-west-wall-review-v02.html). The revised plan turns south from the hub into a narrow corridor and opens into a guard bay outside the locked inspection door. The stair to records branches north before that turn. The walkable review includes the corridor, the longer left turn into the pocket south of the spare desk, and direct access to the lower stair from the covered service passage. The court route now stops by the culvert stair between the landing and court passage. The [workshop workflow study](../../assets/reference/concept/environments/chapter-5-interior-masters-v01/briarhold-west-wall-review-v02.html#workshop) shows the layout now used by the walkable review, with hot work in the north, a projecting south-wall rack, and packing on the lower east wall. The west window sits above the wax stove, with the press and stamp chest to its south. A low shelf in the southwest corner holds empty trays and cloths beside the wash-yard door.

Prepared November 20, 2026. The [hub painting v03](briarhold-hub-paint-v02.md) is available as a closed/open pair in the walkable review. The [records room painting v06](briarhold-records-paint-v02.md) is available in the same review.

Use **five interior navigation maps** built from one north-up, metre-space building plan. The existing rescue painting is the fifth; four new paintings replace the remaining whole-interior schematic. A single building-wide gameplay image would make the smaller rooms and their interactions too small at the 332 px phone map width.

[Open the standalone review](../../assets/reference/concept/environments/chapter-5-interior-masters-v01/briarhold-interior-review-v01.html), or serve it from the running development server:

`http://127.0.0.1:5185/assets/reference/concept/environments/chapter-5-interior-masters-v01/briarhold-interior-review-v01.html`

The review has a whole-building sheet, four walkable technical drafts and the existing closed/open rescue background for continuity. It is an offline art tool, without game or save access. Its route inspection deliberately permits examining authored gates; it is not a second implementation of chapter progression.

| Map | Contents | Level | Production crop |
|---|---|---|---|
| `briarholdHub` | Service landing, pier/tally cover, workroom thresholds, inner guard post, separate platform return stair, sheltered gathering court | Main floor 0 m; stairs indicate changes | 2048 × 1536, 4:3 |
| `briarholdLedger` | Upper records room, crates and spare desk cover, officer's tally turn, clerk's desk/chart/drawer | +2.8 m | 2048 × 2048, square |
| `briarholdWorkshop` | Cooling-rack cover, hand press and cuff, supervisor/alarm position, tool bench, mechanical feed, exterior quenching trough, signal stair | −2.0 m | 2048 × 2048, square |
| `briarholdLanternHall` | Raised operating platform with an exposed stair crossing and screened east bay, three signal housings, pane storage, transmission chain, separate amber guide lamp, two stairs and two viewing openings | +3.4 m; oil lamp at +4.6 m | 2048 × 2048, square |
| `briarholdCrownTable` | Existing inspection gallery, confrontation/rescue room, cells and separate exits | 0 m | Existing accepted 2048 × 1536, 4:3 |

The exterior approach and later Rainroot return are outside this five-map interior count. Room scene illustrations are separate narrative assets, following [the scene plan](chapter-5-scene-art-plan.md).

## Architecture and navigation

The [accepted revision-4 foundation](chapter-5-masters-v01.md) remains authoritative for room footprints, levels, exterior entrances, guide-light origin and rescue geometry. This pack refines its rough circulation strokes into room crops with paired landing coordinates and phone-sized marker clearance:

- Both exterior entries arrive at the same service landing. The culvert remains a subfloor crawl rising inside the landing; it does not become an entrance into the workshop.
- Landing → hub; hub → records; hub → workshop → signal platform → inner post; hub → inner post. **No additional hub → signal-platform shortcut.** The separate stair flights have a divider.
- The platform return flight stays **west of the inspection-gallery wall** and reaches the guard bay. The hub approach bends south, then east into the same bay. The north stair to records branches before the bend. Shared stair widths/partitions align across crops. A turn on the workshop descent avoids cutting the workshop's north/east wall.
- The main map contains the court and its cistern/road stores. The court stance is 0.4 m farther south within its original 7 × 3 m footprint to fit the phone marker. The workshop's outside quenching trough remains a different space.
- The inner post hands off to the existing west gallery. The accepted north-of-entry grille, first-sight gate, south-aisle entrance, free-wheeled cart, loading steps, east escape and cells are unchanged. No rails, grooves or paired floor strips return.
- The spare desk and the cooling rack screen the party's initial crouching position from the officer and supervisor. They are actual cover in the model, rather than arbitrary props beside an exposed anchor.

Draft intermediate IDs (`h##`, `l##`, `w##`, `s##`) and crop-landing IDs exist **only in the reference model**. Later integration must extend the existing bounded map adapter, retain story node IDs and version-1 save compatibility, and preserve direct movement from ordinary scenes. It must not add repeated Back-to-path clicks, rolls or auto-interactions to walking.

Room/action knowledge stays in narration. Technical labels shown in this review are production annotations; painting must not bake in unearned room names or hidden evidence. All forward/back aliases and paired crop thresholds are in [layout.json](../../assets/reference/concept/environments/chapter-5-interior-masters-v01/layout.json). Rust boxes mark existing explicit actions, not new proximity triggers.

## Light and state layers

Each new map has navigation/scale, closed-lighting, open-lighting and clean composition exports. The records/workshop do not acquire an invented guide beam; their closed/open sheets are intentionally equivalent. The hub and platform change with the amber guide. Party-light previews raycast against furniture and walls. High guide-light fans are architectural design footprints, not a physical lighting engine.

The separate ordinary amber oil lamp retains its two high, straight reflector branches: hub/stair junction and rescue-room opening at +2.8 m. It is not a fourth selectable signal pane or a traversable passage. Three fixed signal housings remain distinct from the four possible pane colors/marks and their exact UI arrangements.

State inspection shows occupied rooms, temporary diversions, secured workers/freed captives, gathered party, and mutually exclusive hub lamp/timber passages. Actor circles are staging slots, not finished character art or a new runtime cast. Painting backgrounds must omit people, player markers, exact writing/puzzle answers and one-time pickups. Per-map `stateInventory` specifies the independent actors, cuffs, keys, drawer, shim, evidence, machine coupling, shutter, guard and rest states.

## Verification and files

Rebuild with `node scripts/build-chapter5-interiors.mjs`; inspect offline frames with `node scripts/check-chapter5-interiors.mjs`.

- Editable source: `scripts/lib/chapter5-interior-model.mjs`; exported `layout.json` is self-contained.
- Renderer/review source: `scripts/lib/chapter5-interior-drawing.mjs` and `scripts/lib/chapter5-interior-review.html`.
- Outputs: `assets/reference/concept/environments/chapter-5-interior-masters-v01/` contains the overview, contact sheet, 16 room SVG/PNG exports, embedded offline review, validation and frame captures.
- Geometry samples every movement edge at intervals ≤0.025 m, using the current 52 px desktop / 32 px phone token, −70% vertical anchor, 3 px shadow and ≥0.2 m wall/prop stand-off. It checks reciprocal direction aliases, crop bounds, the physical human footprint inside drawn floor, paired landing coordinates, crouching cover and preserved topology/rescue entry. Smallest measured marker margin is 0.205 m, between the workshop approach and the south corridor wall on the 390 px phone frame.
- Frame review covers 1280 × 720 (870 px map), 390 × 844 (332 px map), and 430 × 932 (372 px map), including every point, forward/back movement, crop transitions, changed states, clean view and existing rescue lighting pair. Results live in `review-checks.json`.

These are geometric/drafting checks, not a new game regression run or a claim that future paint already aligns. No runtime source, existing save, combat tuning or accepted image is changed by this pack.

## Next production steps

Review the room grouping, stair connections, cover and crop framing here. Then follow [the art production sequence](chapter-5-art-production.md#production-order): **“Paint one accepted map at a time and immediately inspect it beneath the same navigation and lighting overlay.”** Start with the main-floor hub because it replaces the landing view in the owner's screenshot and establishes the connected interior materials. Paint its guide-closed/open pair, inspect alignment in all three frames, then proceed to records, workshop and signal platform. Use the accepted rescue painting as the architecture/material/style reference.

After painting, integrate the four new layouts through the Chapter 5 adapter and verify map transitions, old saves, knowledge labels, stealth events, puzzle states, gathering/rest and phone navigation. Promote the four accepted enemy portraits by personnel role separately; do not globally turn ordinary local guards into Hearthvale elites. The Rainroot return map and room/long-narrative scene queue remain outstanding.
