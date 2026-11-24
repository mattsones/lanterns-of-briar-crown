# Briarhold painted-map integration — November 18, 2026

The accepted approach v05 and rescue-room v02 paintings are now playable backgrounds in Chapter 5. This is a bounded adapter around the existing chapter, not a replacement of its tile/node movement or story progression. Other rooms and the return journey retain the schematic map until their own paintings are ready.

The approved records room v06 is also playable as a square crop. The upper stair and threshold save as footsteps, and the left turn into crate cover opens the existing records scene. Returning along the stair applies the usual distraction consequence. The named room and hub buttons still walk the full route in one action.

The approved workshop v02 is playable beneath the hub. Its square painting follows the exposed crossing to rack cover. Work, diversion and captive states remain separate from the painting, and the east stair still connects to the signal platform through the workshop.

## Production assets and framing

| Runtime asset | Source and treatment |
|---|---|
| `assets/maps/briarhold-workshop-v02.webp` | Approved 2048×2048 workshop painting. Supervisor and laborer remain state overlays. |
| `assets/maps/briarhold-records-v06.webp` | Approved 2048×2048 records painting. Officer and clerk remain state overlays. |
| `assets/maps/briarhold-approach-v05.webp` | Full 2048×1152 accepted approach, 334,964 bytes; shelter off the road and natural wet drainage preserved |
| `assets/maps/briarhold-rescue-closed-v02.webp` | Full 2048×1536 closed-guide room, 354,282 bytes |
| `assets/maps/briarhold-rescue-open-v02.webp` | Matching amber-guide variant, 314,832 bytes |
| `assets/icons/map-tokens/briarhold-rescue-cart-v01.webp` | Existing 448×384 true-alpha derivative, 75,568 bytes; independently positioned cart |

These are the already optimized derivatives from the reference packs; no source was repainted, cropped, or discarded. The cart uses the prepared alpha WebP rather than the 380 KB PNG, preserving its painted detail and transparency within the token budget. Native PNGs and all prompts remain in the reference folders. Do not run a blanket re-export just to re-encode these accepted derivatives.

`src/data/chapter5Maps.ts` registers `briarholdApproach` and `briarholdCrownTable` against revision-4 master coordinates. `Chapter5PaintedMap.tsx` renders them inside the Chapter 5 shell with controls outside the illustration, 16:9 / 4:3 framing, and the existing 52 px desktop / 32 px phone hero token. At 1280×720, 390×844 and 430×932, map widths are 870 / 332 / 372 px. Painted light values are displayed directly: no second darkness mask or extra amber glow is applied.

## Movement and saves

- Arrows/WASD move through the measured walking points. The shelter route crosses the unmarked scramble; the runoff follows the streambed. In the room, the route goes down from the north grille to entry E, then around the console/table. No diagonal cut through the wall or table is added.
- Named-landmark clicks follow the same gated corridor to the adjacent story landmark. Small intermediate dots are individual footsteps; `Show paths` is optional and initially off. Inspect remains at story landmarks. The opening shows the party on the road, then moves it to the shelter only after the silent climb.
- Since November 20, walking directly from ordinary narration acknowledges and leaves the scene. There is no routine Back button. Maps stay available on phones and direction controls follow the scene's actions; explicit critical choices retain their movement locks. Leaving temporary cover/distractions still applies the existing departure consequence.
- Existing `node` IDs, version-1 saves, scene IDs, checks and rewards remain. An additive nullable `mapWaypoint` saves an intermediate footstep while `node` retains the last story anchor. Old saves default to their named anchor. Wrong-map, malformed, mid-dialogue, and emergency-rescue waypoints reject rather than invent progress.
- The grille's unacknowledged first sight blocks travel; the inner-door gate remains; the cells wait for Lio's rescue. The emergency still locks movement through catch → brake → cuff. The gallery's left exit returns to the existing inner-post graph. Other interior connections and the return routes are unchanged.
- Every movement commit retains normal checkpoint saving. Moving to a footstep changes no HP, inventory, skill roll, alert, evidence or captive flag.

## Stateful overlays

The culvert grate is closed, open or wedged according to its saved attempt. Both room backgrounds remain empty of permanent actors and cart. Before the fight, the map shows the actual frozen/current Bracken/Sentry/guard roster and Lio on the cart; Mara/companion staging begins inside the room rather than appearing there while the hero is at the grille. A downed or absent companion supplies no rescue marker. Existing portraits and icon fallbacks carry these actors until bespoke Chapter 5 art is produced.

After victory, Bracken and active enemies disappear, the fallen Sentry remains, the escape door is closed after his flight, and the cart progresses from released to caught to braked. Its deck stops 0.7 m short of the steps. The far-side brake rod is drawn only in the amber-guide state. The cuff remains closed until the separate release action; a freed Lio leaves the cart marker. The fallen sabre disappears on collection. Cell bars/occupants follow their flags; the new-save bundle and legacy near-cell Orren are mutually exclusive. These changes grant no additional game reward.

A missing map image retains the same coordinates, paths, landmark icons, controls and progression. Hero, actor and cart image failures retain their existing or local icon/vector fallbacks. The paintings remain visible above the narrative on phones. Ordinary narration can be left through movement; opening/stealth/first-sight/battle/rescue decisions keep their authored locks.

## Verification and next work

The integration has five new pure rule cases and fourteen browser cases, included in `test:rules` and `playtest:chapter5`. They cover source registration, reciprocal arrows, saved footsteps, gate/legacy boundaries, exact crop/token framing at three sizes, first sight and exit, both light states, the complete cart/cuff/loot/cell sequence, both grate outcomes, the opening climb, and missing-art navigation.

Final affected checks pass: build, 102 rules, all 56 Chapter 5 cases (55 broad plus the updated phone scene-history case focused), smoke, and the 175-image asset audit. The six exact-frame checks have zero page errors/overflow, and seven visually reviewed captures are retained under `assets/reference/concept/environments/chapter-5-runtime-integration-v01/`. The playtest server is running on **http://127.0.0.1:5185/**; the isolated verification preview is stopped. See [the handoff](../codex-handoff.md) for detail. The uninterrupted illustrated Chapters 1–5 human playthrough and later full release-candidate gate remain pending.

Next: owner playtest these maps and the prior sabre/court-rest additions; make the hub, records, workshop, signal-platform and Rainroot-return masters/paintings; establish the missing Chapter 5 cast art; then follow [the room and long-narrative scene-art plan](chapter-5-scene-art-plan.md). Narrative scene illustrations are a separate production pass, including the grille first sight, rescue/reunion, court rest and substantial room/return/ending passages.
