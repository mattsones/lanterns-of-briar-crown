# Liam’s Game — Codex Handoff

This file is the starting point for Codex.

## Project Summary

**Liam’s Game** is a storybook fantasy adventure prototype built in React/TypeScript. Chapter 1 is currently playable as a single-file prototype.

The game’s first chapter is titled:

> **Chapter 1: The Road That Lied**

The player begins in Hearthhollow, follows trouble onto Lantern Road, brings evidence to Bramblecross, investigates the old Root Cellar, discovers the Briar Crown mark, and receives the next lead: Westroot.

## Current Source Files

The repo currently includes:

```text
docs/
  story/chapter-1-story-script.md
  planning/repository-plan.md
  art/art-direction.md

liams_game_prototype.jsx
```

The immediate goal is to turn this into a runnable Vite + React + TypeScript project while preserving the working prototype.

## Codex Instructions

Please read these first:

1. `docs/planning/repository-plan.md`
2. `docs/story/chapter-1-story-script.md`
3. `docs/art/art-direction.md`
4. `docs/art/prompts/chapter-1-environments.md`
5. `docs/art/prompts/chapter-1-characters.md`
6. `docs/art/asset-manifest.md`
7. `docs/planning/refactor-roadmap.md`

## First Task

Create the initial Vite React TypeScript repo structure.

Important constraints:

1. Preserve the current working prototype first.
2. Do not rewrite major game systems yet.
3. Do not split the prototype into many components yet.
4. Create a runnable app from `liams_game_prototype.jsx`.
5. Convert only what is needed to make it run cleanly as `src/App.tsx`.
6. Keep behavior identical unless a change is required by TypeScript/build constraints.
7. Use the repo plan as the destination architecture, not as a mandate to refactor everything immediately.

## Files to Create

```text
README.md
package.json
index.html
src/
  main.tsx
  App.tsx
  styles.css
assets/
  concept/
    key-art/
    environments/
    characters/
  maps/
  portraits/
  icons/
docs/
  prompts/
  playtest-notes/
```

## Suggested Initial package.json

```json
{
  "name": "liams-game",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest",
    "framer-motion": "latest"
  },
  "devDependencies": {}
}
```

## Success Criteria for First Pass

The first repo pass is successful when:

- `npm install` completes
- `npm run dev` starts the app
- `npm run build` completes or reveals only clear TypeScript migration issues
- Chapter 1 prototype remains playable
- no major gameplay logic has been intentionally changed
- README explains how to run the app

## Refactor Warning

Do not do large architecture work in the first pass. The first commit should be a safe, working baseline.

Refactor later in this order:

1. data extraction
2. utility extraction
3. component extraction
4. tests
5. art integration

## Current Design Principle

The game should feel like opening a hand-painted storybook where the map is playable.

Mechanically, keep tile/grid movement for now. Visually, the future goal is painted map backgrounds with invisible grid movement and UI markers layered over the art.

## Current Handoff - Painted Map Pass

Last updated: 2026-05-10

Branch: merged into `main`

### What Changed

- Replaced the visible tile-button map board with a painted map stage in `src/components/MapStage.tsx`.
- Added reusable visual map projection config in `src/data/mapVisuals.ts`.
- Kept tile-based gameplay logic intact: movement, blocked cells, inspect prompts, doors, encounters, story flags, and keyboard/on-screen controls still use the existing grid rules.
- Tuned Hearthhollow, Lantern Road, Bramblecross, and Old Root Cellar tile layouts so movement follows the painted artwork more naturally.
- Added Dev Tools map debug mode. It is off during normal play and shows node centers, labels, states, and nav bounds when enabled.
- Added portrait-backed NPC map tokens where portraits exist, with emoji fallbacks preserved.
- Added fog-of-war exploration on wilderness/road/dungeon maps. Town and village maps stay visible because Liam can read civic spaces at a glance.
- Adjusted Bramblecross Inn companion portrait crops slightly downward.
- Updated the smoke test to assert the painted map stage, hidden old grid, hero movement, save/load controls, Dev Tools, and built-in QA checks.
- Wired the cleaned Hearthhollow and Lantern Road map exports into production (`hearthhollow-gameplay-map-v04.png` and `lantern-road-gameplay-map-v02.png`).
- Tuned the Old Root Cellar visual projection in `src/data/mapVisuals.ts` with Root Cellar-only node anchors so the hidden grid follows the painted corridors more closely. Bramblecross keeps the regular grid and uses blocked town tiles for roofs/fenced lots.
- Strengthened fog-of-war in `src/components/MapStage.tsx` so unexplored map areas are fully hidden instead of faintly visible through a dark overlay.

### Verification Run

Use these commands after pulling this branch on another machine:

```bash
npm install
npm run build
npm run test:rules
npm run playtest:smoke
```

Latest local verification:

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed.
- `npm.cmd run playtest:smoke` passed.
- Manual Playwright visual checks were run for Lantern Road, Bramblecross, Old Root Cellar, and the Bramblecross Inn portrait cards.
- 2026-05-10 Root Cellar alignment pass was checked with debug and normal Playwright screenshots after tuning map-specific node anchors.
- 2026-05-10 stronger fog-of-war pass was checked with a normal Playwright screenshot before commit.

### Known Follow-Ups

- Continue checking map alignment with Dev Tools > Show Map Debug after any map art replacement. For grid-readable maps, prefer tile ownership/blocking changes before custom point overrides; reserve `pointOverrides` for organic layouts like Root Cellar.
- Bramblecross should remain a regular Manhattan town grid unless new art forces a projection change. Prefer tile-level blocking for buildings/fenced lots before adding custom graph navigation.
- The current hero map token uses `HeroArtwork`; if artwork is missing, it falls back to a single neutral avatar marker.
- If a future session needs a GitHub PR, install and authenticate GitHub CLI with `gh auth login`. This machine can push with `git`, but `gh` is not currently installed.

## Current Handoff - Root Cellar Navigation Graph Pass

Last updated: 2026-05-11

Branch: `main`

### What Changed

- Root Cellar movement now renders as a walkable-only navigation graph instead of showing every grid coordinate in debug.
- Black-space filler nodes were removed from the visible/debug movement layer. The northeast void and lower-right dead space no longer present as usable route options.
- Root Cellar graph nodes are smaller and hand-placed with `pointOverrides` in `src/data/mapVisuals.ts`.
- Root Cellar fog reveal now follows graph distance instead of square grid radius, so disconnected rooms do not light up just because they are physically nearby.
- Added lower central support nodes so the cache, fungus, skulk, and Warden approaches line up more naturally with the painted floor.
- Strengthened fog on Lantern Road and Bramblecross slightly, and strengthened Root Cellar fog much more aggressively.
- Added `docs/playtest-notes/root-cellar-navigation-graph.md` as the working guide for future dungeon node tuning.

### Latest Verification

```bash
npm run build
npm run test:rules
npm run playtest:smoke
```

All three passed locally after this pass. Manual browser visual checks also confirmed 49 visible Root Cellar debug nodes, 0 blocked debug nodes, strong graph-aware fog at the cellar entrance, and a keyboard route to the Warden. The known Warden route is documented in `docs/playtest-notes/root-cellar-navigation-graph.md`.

## Current Handoff - Lantern Road and Bramblecross Alignment

Last updated: 2026-05-11

Branch: `main`

### What Changed

- Kept Lantern Road on grid-centered movement and moved landmark ownership to better matching cells: milestone `7,1`, cart `11,2`, road cache `11,4`, ambush `7,7`, pond `2,6`, Hearthhollow entrance `0,7`, and Bramblecross road `11,7`.
- Marked Hearthhollow and Bramblecross as `revealAll` maps in `src/data/mapVisuals.ts`; fog-of-war now remains for Lantern Road and Root Cellar.
- Kept Bramblecross on the regular tile grid and replaced building/fenced-yard filler cells with blocked `fenced_yard` tiles.
- Reopened the Bramblecross lower-center north/south road at tile `6,7` so the town still reads as a Manhattan street grid from the gate.
- Opened Hearthhollow tile `2,6` for movement.
- Added rules coverage for town reveal behavior, Lantern Road grid ownership, and Bramblecross blocked-yard preservation.

### Latest Verification

Run the standard checks:

```bash
npm run build
npm run test:rules
npm run playtest:smoke
```

Latest local verification passed after this pass: TypeScript no-emit check, Vite build, rules tests, smoke test, and Playwright visual captures of Lantern Road, Hearthhollow, and Bramblecross debug maps. Normal-mode fog check confirmed Hearthhollow and Bramblecross have no fog layer, while Lantern Road and Old Root Cellar still do.

## Current Handoff - Hearthhollow Polish

Last updated: 2026-05-11

Branch: `main`

### What Changed

- Moved Nella the Baker off the hero start tile at `2,4`; she now uses Hearthhollow tile `5,2`.
- Changed Hearthhollow tile `6,4` into a `well` landmark. Historical note: this was originally blocked, but the 2026-07-09 playtest polish pass made it walkable and hidden-token.
- Added a small well interaction in `src/App.tsx`; it now fires as a one-time walk-on discovery instead of a blocked-tile bump.
- Added QA/smoke coverage so future map edits preserve the Nella/start/well placement.

### Latest Verification

- `npm run build` passed.
- `npm run test:rules` passed.
- `npm run playtest:smoke` passed.
- Manual browser check at the time confirmed the hero starts on Grass and Nella is separate. The well behavior has since been superseded by the one-time walk-on discovery pass.

## Current Handoff - Root Cellar Annotation Follow-Up

Last updated: 2026-05-11

Branch: `main`

### What Changed

- Applied the second annotated Root Cellar pass: removed the red-marked off-path nodes in the mural room, central mushroom/rock edge, and Warden approach.
- Nudged the blue-marked nodes in `src/data/mapVisuals.ts` so the visible graph sits tighter on painted stone paths.
- Added a few green-marked support nodes at the central vertical path, lower central path, and post-Warden/door edge.
- Updated the no-dialog Warden route in `tests/smoke.spec.ts` and `docs/playtest-notes/root-cellar-navigation-graph.md`.

### Latest Verification

```bash
npm run build
npm run test:rules
npm run playtest:smoke
```

All three passed locally after this pass. Manual browser visual QA confirmed 44 visible Root Cellar debug nodes, 0 blocked debug nodes, and the revised keyboard route reaches the Briar Knot Warden.

## Current Handoff - Hearthhollow Placement Follow-Up

Last updated: 2026-05-11

Branch: `main`

### What Changed

- Moved the Hearthhollow home door from `2,3` to `3,2`.
- Moved the potion hut door from `2,6` to `1,6`.
- Moved the old supply chest from `11,5` to `11,6`.
- Made Hearthhollow `10,5` and `11,5` unpassable.
- Made all Hearthhollow `y=9` tiles unpassable except the gate at `6,9`.
- Updated QA and rules coverage for these exact placements.

### Latest Verification

```bash
npm run build
npm run test:rules
npm run playtest:smoke
```

All three passed locally after this pass. Manual browser QA confirmed the new home door, potion door, chest, south gate, and blocked south-row grass placements.

## Current Handoff - Root Cellar Movement Refinements

Last updated: 2026-05-14

Branch: `main`

Code commit: `5ea4a4f` (`further root cellar movement refinements`)

### What Changed

- Refined the Old Root Cellar navigation graph and point overrides from the latest annotated map pass.
- Removed movement between `2,5` and `2,6`; later removed movement between `1,6` and `2,6` too. Cellar node `2,6` is now only reachable from `2,7`.
- Removed graph nodes `2,8` and `10,5`.
- Added a top-right empty-room exploration spur at `7,1`/`8,1`.
- Added an extra lower-right support node at `8,5` between `8,6` and `9,6`.
- Tuned several node positions, including `1,5`, `1,6`, `1,7`, `2,1`, `2,5`, `2,6`, `3,2`, `4,1`, `4,5`, and `8,6`.
- Locked the sealed door at `10,4` until the Briar Knot Warden is defeated, so players cannot back away from the Warden and slip around to the door.
- Warden fallback now moves the player back to `9,5`.
- Rustroot Skulk fallback now returns the player to the previous node that triggered the encounter.
- Updated `tests/smoke.spec.ts` for the revised Warden route and Root Sigil stopover.
- Updated `docs/playtest-notes/root-cellar-navigation-graph.md` with the latest route and editing constraints.

### Latest Verification

```bash
npm run build
npm run test:rules
npm run playtest:smoke
```

All three passed locally on 2026-05-14 before the handoff documentation commit. Browser sanity checks confirmed that moving right from `1,6` no longer enters `2,6`, and backing away from the Rustroot Skulk returns to the prior node.

### Handoff Rule

For machine switching, finish each meaningful work session by:

1. Updating this handoff section or adding a dated note.
2. Running the relevant checks.
3. Committing the scoped changes.
4. Pushing the current branch to GitHub.
5. Mentioning the branch name and latest commit in the final Codex response.

## Current Handoff - Chapter 1 Story Sync and Story Module

Last updated: 2026-05-15

Branch: `main`

### What Changed

- Added `src/story/chapter1.ts` as the first story-facing content module for Chapter 1.
- Moved the richer Courier Satchel reward text into the story module and wired `src/data/battleRewards.ts` to use it.
- Wired the richer sealed-door, Briar Crown, report-back, Hollis/Edden, Westroot, and closing narration beats from the story script into `src/App.tsx`.
- Added the third Chapter 1 closing choice: "The Briar Crown won't get to bury this."
- Added sparse companion reactions for the case wall, Briar Crown, sealed door, and report-back beats, sourced from the story module.
- Appended the case-wall companion reaction through the Watchhouse evidence board flow in `src/components/modals.tsx`.
- Added rules coverage so key story-script beats remain wired into game data.

### Latest Verification

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:smoke
git diff --check
```

All checks passed locally. `npm run build` was blocked by the Windows PowerShell execution policy for `npm.ps1`, so `npm.cmd` was used instead.

## Current Handoff - m_standard Slot Masks

Last updated: 2026-05-15

Branch: `main`

### What Changed

- Added `scripts/generate_m_standard_masks.mjs`, a deterministic vector/SVG-based mask generator using Playwright rendering.
- Generated reusable 1024x1536 transparent PNG masks in `assets/reference/paper-doll/characters/hero/masks/m_standard/`.
- Generated:
  - `mask_torso.png`
  - `mask_cloak_back.png`
  - `mask_cloak_front.png`
  - `mask_boots.png`
  - `mask_head.png`
  - `mask_trinket.png`
  - `guide_mainhand_anchor.png`
  - `guide_offhand_anchor.png`
  - `manifest.json`
  - `proof_sheet.png`
  - `README.md`
- Manifest includes source rig, m_standard anchors, handedness, stacking order, mask coordinates, guide coordinates, and output file list.
- README documents slot purpose, hand direction, regeneration command, and stacking order.

### Latest Verification

```bash
node scripts\generate_m_standard_masks.mjs
node -e "<PNG header/alpha verification script>"
```

All generated PNGs verified as 1024x1536 with an alpha channel. The six masks and two guide PNGs include transparent pixels and opaque mask/marker pixels. The proof sheet was visually inspected.

## Current Handoff - m_standard Mask Refinement and Proof Prompts

Last updated: 2026-05-15

Branch: `main`

### What Changed

- Refined the generated `m_standard` mask paths from rough polygon-like regions into smoother editable SVG paths.
- Tightened the boots mask after review showed one boot/foot alignment was not adequately covered and the lower mask shape had too much empty area.
- Added `proof_sheet_by_slot.png` for a larger per-slot review sheet.
- Added full-size single-slot proof overlays:
  - `proof_torso.png`
  - `proof_cloak_back.png`
  - `proof_cloak_front.png`
  - `proof_boots.png`
  - `proof_head.png`
  - `proof_trinket.png`
  - `proof_mainhand_anchor.png`
  - `proof_offhand_anchor.png`
- Updated the mask README to explain the full-size proof overlays and the special review behavior for the behind-body `cloak_back` slot.
- Added `docs/art/player-character/liams-game-paper-doll-proof-set-prompts.md` with ChatGPT-facing art generation directions for the first paper-doll proof equipment set.

### Latest Verification

```bash
node scripts\generate_m_standard_masks.mjs
node -e "<PNG header/alpha verification script>"
```

All generated PNGs verified with expected dimensions and alpha channels. `proof_boots.png`, `proof_torso.png`, and `proof_sheet_by_slot.png` were visually inspected after the refinement pass.

## Current Handoff - m_standard Equipment Proof Loop

Last updated: 2026-05-16

Branch: `main`

### What Changed

- Added `assets/reference/paper-doll/characters/hero/equipment/m_standard/proof_set/` for generated paper-doll proof equipment assets.
- Tested the first three generated equipment assets: boots, Briarweave Vest, and Old Hatchet.
- Confirmed the original three generated assets were not usable as overlays because they were standalone object art and/or had fully opaque fake checkerboard backgrounds.
- Iterated on Village Boots through multiple ChatGPT exports (`v2` through `v5`), then used Paint.NET-cleaned `v6` as the first technically valid transparent overlay.
- Generated QA overlays for boot attempts against `rig_reference_m_standard.png`.
- Produced deterministic split/scale/nudge variants (`fit_*`) and rotation-aware variants (`rotfit_*`) from the cleaned boot asset.
- Marked the best current boot proof as a rotation candidate, not a final accepted production asset:
  - `equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png`
  - `qa_equip_boots_village_boots_m_standard_ROTATION_CANDIDATE_overlay.png`
- Added `assets/reference/paper-doll/characters/hero/equipment/m_standard/proof_set/README.md` to explain the boot version history and the premature `ACCEPTED` filename.
- Added `docs/art/player-character/liams-game-paper-doll-equipment-pipeline-notes.md` to capture the process lesson: AI is useful for painting source art, but fitting should be manual or deterministic.

### Latest Verification

```bash
node scripts\generate_m_standard_masks.mjs
node -e "<PNG header/alpha verification script>"
git diff --check
```

The boot rotation candidate was visually inspected against the base rig. It is suitable as proof-of-pipeline evidence, but it is not final production equipment art.

## Current Handoff - Artwork/UI Pivot to Custom Item Icons

Last updated: 2026-06-28

Branch: `main`

### Decision

- Abandoned the paper-doll equipment overlay path as the active production direction.
- Keep the paper-doll files in `assets/reference/paper-doll/characters/hero/` as proof/reference material only.
- Use custom painted object art for item icons instead of stock-looking icons or rig-fitted gear overlays.
- Keep emoji fallbacks anywhere item, portrait, map-token, or enemy art is missing.

### Current Art Model

- Painted maps remain the primary exploration art layer.
- Half-body portraits remain the primary dialogue/companion art layer.
- Item art should live in `assets/icons/items/` once production-ready.
- Item artwork wiring should go through `src/data/itemArtwork.ts`.
- The item UI should render custom artwork when present and fall back to each item's existing emoji.

### Useful References

- `docs/art/item-icons/liams-game-custom-item-icon-plan.md`
- `docs/art/asset-manifest.md`
- `docs/art/art-direction.md`

### Proof Asset Evaluation

- `equip_mainhand_old_hatchet.png` and `equip_torso_briarweave_vest_m_standard.png` have strong custom painted object art, but are RGB with fake checkerboard backgrounds. Treat as source references, not production UI assets.
- `equip_boots_village_boots_m_standard_ROTATION_CANDIDATE.png` has alpha, but it is composed as a paper-doll overlay canvas with too much blank area. Treat as source/reference unless recropped or regenerated as an icon.

## Current Handoff - Chapters 2-5 Roadmap Foundation

Last updated: 2026-06-30

Branch: `codex/roadmap-foundation-ch2-5`

### What Changed

- Updated `agents.md` with the required thread-start repo sync ritual. Remote `origin/main` should be treated as the source of truth unless the user says otherwise.
- Updated README and refactor roadmap to reflect the current state: Chapter 1 is playable, Chapter 2 is already underway, and the long-term target is a fully illustrated playable prototype through Chapter 5.
- Added chapter progress scaffolding in `src/game/chapterProgress.ts` for Chapters 1-5.
- Added non-combat guest NPC scaffolding in `src/game/guestNpcs.ts`; Mara is explicitly present in story/map flow but excluded from combat and damage systems.
- Added implementation-facing story plan metadata for Chapters 2-5 in `src/story/chapters2to5.ts`.
- Added full-scope art backlog metadata in `src/data/artworkPlan.ts`, including 16 hero race/gender variants, future maps, portraits, enemies, item icons, and symbol/UI sheets.
- Added future Chapter 3-5 story item IDs to `src/data/items.ts` with emoji fallbacks.
- Added future Chapter 4-5 enemy IDs and encounters to `src/data/enemies.ts` with emoji fallbacks.
- Wired current Chapter 2 completion moments to stable flags including `lioAlivePastGate`, `eddensDrawingValidated`, `briarCrownWatchingWestroot`, `roadwatcherPrepared`, and `roadwatcherDefeated`. `roadwatcherEncounterAvoided` is legacy/default state, not the desired clean-solve reward.
- Added rules coverage for chapter progress, Mara guest behavior, story plan coverage, art backlog scope, future item/enemy IDs, and Roadwatcher reward flags.

### Next Recommended Slice

Complete the Chapter 2 playable path before starting Chapter 3 code:

1. Extract the current Chapter 2 dialogue text from `src/App.tsx` into a story module.
2. Generate or add the painted Westroot Trail map, then tune `src/data/mapVisuals.ts`.
3. Add Playwright coverage for Chapter 2 clean and messy Three-Sign Hollow outcomes.
4. Add visual QA screenshots for the Westroot Trail map with debug on and off.

### Verification To Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:smoke
git diff --check
```

### Build Size Note

`npm.cmd run build` is currently green, but the asset list already includes multiple 1-3.5 MB PNG files. Before the full Chapter 2-5 art push, add export/compression guidelines and review any new painted maps, portraits, and item icons for dimensions and file size before registering them.

## Current Handoff - Chapter 2 Completion Pass

Last updated: 2026-07-02

Branch: `codex/chapter-2-completion`

### What Changed

- Added `src/story/chapter2.ts` as the Chapter 2 puzzle/story contract module, including the old road phrase, Lio gate mark, required end flags, supporting clue flags, mistake flags, and clean/standard/hard Roadwatcher outcome helpers.
- Added the saved Westroot Trail map art prompt at `docs/art/prompts/chapter-2-westroot-trail-map.md`.
- Promoted `assets/maps/westroot-trail-map-v04.png` as the active painted Westroot Trail gameplay map. `v01`, `v02`, and `v03` are preserved as alternate candidates.
- Wired the Westroot Trail map background in `src/data/maps.ts`, marked it available in `src/data/artworkPlan.ts`, and tuned the first `src/data/mapVisuals.ts` projection pass for the painted landmarks.
- Expanded the Three-Sign Hollow flow in `src/App.tsx`: Mara can receive a non-combat puzzle job, the active companion can comment on the hollow, Crown/Lantern sign choices now write stable clue/mistake flags, and the No-Handle Stone uses the shared Chapter 2 outcome helper.
- Clean No-Handle solve should prepare the standard Roadwatcher battle and grant better context/rewards. Messy solves summon harder Roadwatcher pressure and open the gate after the Roadwatcher battle resolves.
- Threshold search now grants the No-Handle Token; Roadwatcher victory grants Pine-Pitch Wax and the witness clue.
- Added `npm.cmd run playtest:chapter2` with browser coverage for clean and messy Chapter 2 No-Handle outcomes plus visual assertions that the painted Westroot map and hero token render.
- Expanded rules coverage for Chapter 2 puzzle outcomes, map prompt registration, required end flags, map art wiring, and the no-Princess-Elowen-in-Chapter-2 boundary.
- Fixed a Chapter 2 briefing dead-end where choosing "I should talk to Edden." from Edden's Drawing before the briefing flag was set only raised the pre-briefing toast and left the same modal open.
- Added Playwright regression coverage for that exact Bramblecross briefing path; it now verifies the button opens Edden's Recovery Room and exposes the drawing pickup choice.
- Redesigned the No-Handle Stone puzzle around the door-first repair loop: the door now frames the problem with "let the road behind you speak true," then requires concrete repairs instead of an accidental clue count.
- The opening requirements are now: break false road orders, restore true Lantern guidance, confirm Lio's real hook-tailed mark through Mara/Shelter Nook, and align Edden's drawing with the hollow.
- Shelter Nook, false notice, Crown Sign, Lantern Sign, and First Westroot Gate now keep local menus open after useful actions so players can naturally select multiple options in one visit.
- Spent Chapter 2 trail nodes now skip movement-triggered repeat popups where appropriate while remaining available through manual Inspect.

### Verification Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed. The selected `westroot-trail-map-v04` production export is about 3.37 MB in the Vite output.
- `npm.cmd run test:rules` passed: 11 tests.
- `npm.cmd run playtest:chapter2` passed: 5 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with only normal Windows CRLF warnings.

### Next Recommended Slice

Next Chapter 2 pass should continue the puzzle redesign before map alignment:

1. Rework Three-Sign Hollow into a freer three-door interaction hub. Let the player inspect and try the Crown, Lantern, and No-Handle doors/signs individually.
2. Remove explicit checklist-style solving from the door and quest copy. The No-Handle Door should imply the need to clear falsehoods through inscription/description, not tell the player exactly which tasks remain.
3. Add "ask Mara" and "ask companion" options at the doors. Mara should notice Lio's tiny mark at the No-Handle Door only when asked or brought into that moment, making her knowledge feel earned and personal.
4. Treat Roadwatcher combat as desirable adventure content, not a punishment for a messy solve. Better solving can change the encounter setup, enemy mix, rewards, or Mara's safety, but should not simply skip the battle.
5. Keep a future false-door mini-dungeon in mind. For the next small pass, a short false passage or combat-forward branch is enough; a full second Chapter 2 dungeon can come later.
6. After that interaction model settles, take the detailed Westroot Trail node-alignment pass and consider graph-driven movement instead of the current rectangular grid.

## Current Handoff - Chapter 2 Three-Door Puzzle Pass

Last updated: 2026-07-02

Branch: `codex/chapter-2-completion`

### What Changed

- Reworked Three-Sign Hollow into a three-door interaction hub: Crown Door, Lantern Door, and No-Handle Door now each have their own local door/sign surface.
- Added a short false Crown Door passage branch that marks the straight official-looking route as a lure and records the existing messy-solve flags.
- Removed explicit checklist-style solving from the No-Handle Door text and Chapter 2 quest copy. The shared puzzle contract still tracks requirements, but player-facing copy now gives inscription/description feedback instead of listing tasks.
- Added door-level "ask Mara" and "ask companion" reads. Mara now confirms the No-Handle Door's tiny Lio mark only after the player asks her about that scratch and has found Lio's shelter/practice mark.
- Changed the clean No-Handle solve so it prepares the standard Roadwatcher battle instead of skipping combat. Messy solves still escalate to the hard Roadwatcher encounter.
- Moved Roadwatcher evidence and Pine-Pitch Wax payoff onto Roadwatcher battle victory rewards.
- Added stable flags for the new door interactions and prepared fight state, including `maraAskedNoHandleMark`, `roadwatcherPrepared`, and `maraProtectedAtHollow`.
- Updated built-in QA, rules coverage, and Chapter 2 Playwright coverage for the three-door hub, non-checklist door copy, clean prepared Roadwatcher fight, and messy hard Roadwatcher pressure.

### Verification Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed. Vite still reports the selected `westroot-trail-map-v04` production export at about 3.37 MB.
- `npm.cmd run test:rules` passed: 11 tests.
- `npm.cmd run playtest:chapter2` passed: 6 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

After this puzzle model pass, the preferred next design slice is the Crown Door dungeon expansion, followed by the detailed Westroot Trail node-alignment pass:

1. Expand the Crown Door from a short false branch into a compact Roadwatcher den where false signs, copied wax, witness lists, and thorn-collar supplies are found.
2. Make Roadwatcher victory provide the clue/key-mark that turns the Crown Door into an explorable dungeon.
3. Let clearing the Crown Door dungeon remove the final false command from the road, making the No-Handle Door's truth requirement feel earned.
4. Keep the dungeon compact: roughly 5-7 rooms, one or two small encounters, and strong evidence/reward beats rather than a full second chapter.
5. After that design lands, check the painted Westroot Trail map with Dev Tools map debug on and off.
6. Tune `src/data/mapVisuals.ts` node placement around the three-door hollow, shelter nook, false notice, Roadwatcher node, Crown Door dungeon entry, and First Westroot Gate.
7. Consider graph-driven movement for Westroot Trail if the rectangular grid cannot follow the painted road cleanly.

## Current Handoff - Chapter 2 Crown Door Den Pass

Last updated: 2026-07-04

Branch: `codex/chapter-2-completion`

### What Changed

- Expanded the Crown Door into a playable compact dungeon map, the Crown Door Den, now using `assets/maps/crown-door-den-map-v01.png`.
- Made Roadwatcher victory grant the Split Crown Slat, which acts as the story key for opening the Crown Door.
- Updated the standard Roadwatcher fight to include a Thorn-Collared Hound, keeping combat as adventure payoff rather than a failure-only branch. The hard version still escalates with the False Sign Scratcher.
- Added Crown Door Den rooms for copied wax, false sign slats, a witness ledger, thorn-collar supplies, a den guard encounter, and the final false map.
- Added den rewards and evidence items: Split Crown Slat, Briar Signmaker's Ledger, and Cleaned Lantern Mark.
- Changed the No-Handle Door so the prepared Roadwatcher fight is not the final unlock by itself. The door now waits until the Crown Door Den's false map is cleared.
- Updated Chapter 2 quest, story-plan, item, map, enemy, battle reward, and art backlog data for the Crown Door Den flow.
- Added shared dialogue scene-image support and wired `assets/scenes/three-doors-threshold-v01.png` into the Three-Door Threshold overview dialog.
- Expanded Chapter 2 Playwright coverage and rules tests for the key, dungeon entry, false map clearing, den-gated No-Handle Door, and updated Roadwatcher enemy mix.

### Verification Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 13 tests.
- `npm.cmd run playtest:chapter2` passed: 16 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

The Crown Door Den is now playable; the next Chapter 2 pass should be visual and script polish:

1. Human playtest the expanded Chapter 2 again from Bramblecross briefing through the Crown Door Den and First Westroot Gate. Automated coverage is green, but the new pacing, repeated dialogue, and den evidence beats need a fresh human read.
2. Check Westroot Trail and Crown Door Den with Dev Tools map debug on and off.
3. Tune `src/data/mapVisuals.ts` node placement around Three-Sign Hollow, the Crown Door entry, den rooms, Roadwatcher bend, and First Westroot Gate.
4. Consider close-up painted scene images for the individual Crown, Lantern, and No-Handle Door dialogs if the procedural door visuals start to feel thin beside the threshold art.

## Current Handoff - NPC and Enemy Art Integration

Last updated: 2026-07-04

Branch: `codex/chapter-2-completion`

### What Changed

- Added the new NPC and enemy portrait assets under `assets/portraits/characters/` and `assets/portraits/enemies/`.
- Wired selected NPC portraits through `src/data/portraits.ts`, preserving dialogue and map-token emoji fallbacks.
- Selected bolder fantasy ancestry reads for Smith Orin and Nella: Orin uses the Emberling/fireperson v2 portrait, and Nella uses the Tideborn/water-person v3 portrait.
- Wired selected enemy portraits through `src/data/enemies.ts` and the battle modal, preserving the existing enemy emoji fallback if art is missing or fails to load.
- Selected Roadwatcher v2 and False Sign Scratcher v2 for production; Roadwatcher v2 fixes the earlier Warden silhouette overlap.
- Marked the wired Chapter 1-2 portrait and enemy entries as available in `src/data/artworkPlan.ts`.
- Updated `docs/art/asset-manifest.md`, `docs/art/art-direction.md`, and the art prompt/review docs for the selected versions and bolder ancestry direction.

### Verification Run

Run before pushing this slice:

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:smoke
git diff --check
```

### Next Recommended Slice

1. Run a browser visual pass through Hearthhollow, Bramblecross, Westroot Trail, Crown Door Den, and at least one battle per enemy-art group.
2. Optimize production portrait PNGs before a public build; most source portraits are still roughly 2.3-3.0 MB each.
3. Generate future Chapter 3-5 portraits/enemies after the next story slice hardens.

## Current Handoff - Chapter 2 Playtest Polish

Last updated: 2026-07-09

Branch: `codex/chapter-2-completion`

### What Changed

- Generated and wired `assets/scenes/eddens-three-door-drawing-scene-v01.png` for the Edden's Drawing review dialog.
- Removed the early explicit "honest one has no handle" clue from active app text, item descriptions, and Chapter 2 story-plan metadata.
- Rewrote Edden's recovery-room dialog to sound more traumatized and fragmentary, with "back first / old side / listens behind" as the subtle delayed-payoff clue.
- Moved Hollis and Enna off outdoor Bramblecross map tiles; they are now accessed through the Watchhouse interior flow.
- Moved the Ada lens reminder into the Watchhouse briefing copy before departure.
- Added dialogue `portraitName` support so Edden's Recovery Room and Ada's Seal Lesson can keep scene titles while showing character portraits.
- Audited skill-check failure copy and tightened fail-forward results for the Watchhouse board, ledger, wall map, forged orders, broken cart, Lantern Shrine, and Briar Crown study so failures no longer reveal the same interpretive answer as successes.
- Changed map portrait tokens to crop toward faces instead of fitting the full half-body portrait into the small circular map marker. Dialogue still shows the full portrait.
- Opened Bramblecross road-art movement cells along `3,9` through `11,9`, `3,6` through `11,6`, `10,4` through `10,6`, `3,6` through `3,9`, and `11,6` through `11,9`; preserved the Root Cellar and town gate as walkable interactable tiles inside those runs.
- Corrected the Bramblecross pass by turning over-opened cells `4,7`, `4,8`, `5,8`, `7,8`, `8,7`, `8,8`, `5,4`, `7,4`, `8,4`, `8,5`, and `8,2` back into blocked `fenced_yard` cells.
- Updated the Chapter 2 playtest save to start outside the Watchhouse door instead of on Enna's old outdoor tile.
- Added the shopkeeper portrait header to shop modals so Smith Orin is visible in his shop; Ada also uses the same shopkeeper portrait slot in Willow Market.
- Turned the Hearthhollow well and Lantern Road pond into quiet walk-on discoveries: their map tokens are hidden, the tiles are walkable, and each auto-dialog fires only the first time the player steps onto it.
- Added `ada-willowmarket-portrait-no-lens-v01.png` and swapped Ada's portrait immediately after the player borrows the Willowmark Lens; pre-briefing Ada interactions now open a short dialogue instead of only setting a toast.

### Latest Verification

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 13 tests.
- `npm.cmd run playtest:chapter2` passed: 18 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.
- Live sanity against `http://127.0.0.1:5173/` passed for Orin's shop portrait, hidden well/pond map tokens, and one-time well/pond walk-on discovery dialogs.
- Live sanity against `http://127.0.0.1:5173/` passed for Ada's immediate no-lens portrait swap after borrowing the Willowmark Lens.

## Current Handoff - Player Hero Art Curation

Last updated: 2026-07-09

Branch: `codex/chapter-2-completion`

### What Changed

- Added generated player hero base art under `assets/portraits/player/`.
- Curated the visible working set down to 16 selected ancestry/gender variants:
  - `human-female-v03.png`
  - `human-male-v02.png`
  - `stonekin-female-v06.png`
  - `stonekin-male-v04.png`
  - `sylvan-female-v04.png`
  - `sylvan-male-v03.png`
  - `emberling-female-v06.png`
  - `emberling-male-v06.png`
  - `tideborn-female-v02.png`
  - `tideborn-male-v01.png`
  - `cloudling-female-v02.png`
  - `cloudling-male-v02.png`
  - `mossback-female-v02.png`
  - `mossback-male-v02.png`
  - `moonmark-female-v04.png`
  - `moonmark-male-v02.png`
- Moved non-selected generated versions into `assets/portraits/player/_alternates/` so the selected folder is easier to process.
- Added `assets/portraits/player/README.md` with the selected list and art-direction notes.

### Art Direction Notes

- Cloudlings should be allowed to read more ephemeral and spirit-like than the other ancestries.
- The selected v6 Emberlings, latest female Stonekin, and latest female Moonmark reflect current user preference.

### Next Reminder

The selected player hero images have now been cleaned to true transparent PNGs and are ready for game UI wiring.

## Current Handoff - Player Hero Art Wiring

Last updated: 2026-07-10

Branch: `codex/chapter-2-completion`

### What Changed

- Wired the selected transparent player hero variants through `src/data/playerArtwork.ts`: 8 Human heritage variants plus 14 non-Human ancestry variants.
- Added Human heritage support with fantasy-world labels: Hearthvale, Sunreach, Rainroot, and Dawnmere. New/default Human heroes normalize to Rainroot, and the player can choose a different heritage during character creation.
- Removed the old player-facing attitude/appearance selector; `appearanceId` remains as a neutral default save-compatibility field.
- Added a reusable `HeroArtwork` component that shows hero art when available and keeps a neutral avatar marker as the fallback.
- Replaced the emoji-only hero display in character creation preview, the player panel, battle hero card, and the map hero token.
- Tightened circular map-token portrait crops for both NPC portraits and player character art so the token centers on faces instead of necks/chests.
- Marked all shared hero artwork plan entries as available, including the Human heritage variants.
- Added the human sub-variant batch generation prompt at `docs/art/player-character/liams-game-human-subvariant-batch-prompt.md`.
- Moved leftover and superseded human variants into `assets/portraits/player/_alternates/` so the selected folder remains the curated set:
  - `human-female-africa-v03.png`
  - `human-male-africa-v01.png`
  - `human-male-america-v01.png`
  - `human-female-v03.png`
  - `human-male-v02.png`

### Verification To Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

### Post-Chapter 2 Planning Note

After Chapter 2 is playtested, finalized, committed, and pushed, use `docs/planning/post-chapter-2-technical-hardening.md` as the next pickup plan before starting Chapter 3 code. The intent is a focused hardening pass: lock a Chapter 2 complete fixture, reduce `App.tsx` risk, type story flags, add save migrations, validate map graphs, audit asset size, and extract reusable QA validators without starting a broad rewrite.

## Current Handoff - Chapter 2 Door And Den Token Art Wiring

Last updated: 2026-07-10

Branch: `codex/chapter-2-completion`

### What Changed

- Renamed the generated Crown Door Den token folder from `assets/icons/map tokens/` to `assets/icons/map-tokens/`.
- Renamed the generated door and token PNGs from generation-batch filenames to production-style filenames:
  - `crown-door-closeup-v01.png`
  - `lantern-door-closeup-v01.png`
  - `no-handle-door-closeup-v01.png`
  - `assets/icons/map-tokens/crown-den-*-token-v01.png`
- Wired the six transparent Crown Door Den active map-token images into `src/components/MapStage.tsx` while preserving text/icon fallbacks.
- Wired five transparent cleared-state Crown Door Den map-token images for spent den objectives.
- Renamed the generated Crown Door Den pursuit/tension UI icons into `assets/icons/ui/crown-den-*-icon-v01.png`.
- Wired the four tension icons into a compact Crown Door Den pursuit strip that appears while `crownDenAlertLevel` is active.
- Replaced Crown Door Den dialogue portrait placeholders (`wax`, `sign`, `book`, `link`, `map`, `!`, `C`) with image-backed token art and kept text fallbacks if image loading fails.
- Removed the visible `C` vestibule map token while keeping the vestibule floor tile walkable/inspectable.
- Added two floor-only Crown Door Den movement nodes at the central lower connector and the right-hand passage connector, with map-graph tests covering the new route.
- Updated map-token CSS so transparent object art displays cleanly without portrait-style face cropping.
- Wired the three generated door closeups into `DialogueVisual` for the Crown Door, Lantern Door, and No-Handle Door inspection panels.
- Added the promoted assets to `docs/art/asset-manifest.md` and noted the no-space token path in the prompt doc.

### Verification To Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

## Current Handoff - Post-Chapter 2 Hardening, Items 1-4

Last updated: 2026-07-12

Branch: `main`

### What Changed

- Added `public/saves/chapter-2-complete.json` as the checked-in "Chapter 2 Complete - Chapter 3 Ready" save fixture. It loads at Westroot Trail / Three-Door Threshold with `chapterTwoClear`, `westrootGateOpened`, `lioAlivePastGate`, `eddensDrawingValidated`, `briarCrownWatchingWestroot`, and `crownDoorDungeonCleared` set.
- Kept the existing `public/saves/chapter-2-playtest.json` fixture as the Chapter 1-complete / Chapter 2 briefing-start checkpoint.
- Added `CHAPTER_2_COMPLETE_SAVE_PATH` plus a "Load Chapter 3 Ready Save" title/load-modal action.
- Added save migration and normalization in `src/game/save.ts`; disk saves, slot saves, local checkpoints, and checked-in fixtures now pass through `migrateSavePayload`.
- Bumped `SAVE_FILE_VERSION` to 2. Migration fills missing default flags, normalizes missing Human heritage/appearance fields, normalizes moved Westroot graph positions, backfills Chapter 2 completion-derived flags, and maps a few legacy flag names to current names.
- Replaced the broad `Flags = Record<string, unknown>` shape with a typed `GameFlags` contract in `src/game/types.ts`.
- Added the missing `roadwatcherHardCleared` default flag because the hard Roadwatcher reward already writes it.
- Moved shared save-position helpers into `src/game/map.ts`.
- Added reusable map graph validation in `src/game/mapValidation.ts` for graph endpoints, blocked nodes, orphan nodes, required landmark reachability, and one-way links.
- Documented the current intentional one-way links for organic Root Cellar and Westroot Trail controls inside `DOCUMENTED_ONE_WAY_LINKS`.
- Expanded rules and Chapter 2 Playwright coverage for the new fixture, migrations, typed flag defaults, and reusable graph validation.

### Verification Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 16 tests.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

Continue with the remaining post-Chapter 2 hardening items:

1. Extract more stable Chapter 2 scene text from `src/App.tsx`.
2. Add asset size/export audit guidance and/or a largest-production-assets script.
3. Move the built-in Dev Tools QA checks out of `App.tsx` into reusable validators.

## Current Handoff - Post-Chapter 2 Hardening, Items 5-7

Last updated: 2026-07-12

Branch: `main`

### What Changed

- Moved stable Chapter 2 review copy, scene metadata, door labels, Crown Door Den room text, companion reads, Edden recovery copy, Roadwatcher copy, and Chapter 2 completion copy into `src/story/chapter2.ts` under `CHAPTER_2_SCENE_COPY` and small formatting helpers.
- Kept the imperative Chapter 2 callback flow in `src/App.tsx`; the app now reads the stable copy from the story module instead of owning the large dialogue blocks directly.
- Fixed the threshold companion-read function scope while touching the Chapter 2 threshold flow so the "Ask your companion for their read" choice stays available from the outer app component scope.
- Added `scripts/audit-assets.mjs` plus `npm.cmd run audit:assets` as a report-only largest-production-assets command. The script scans `assets/maps`, `assets/portraits`, `assets/scenes`, and `assets/icons`, reports dimensions where possible, and marks files over the documented target ranges.
- Added production export discipline to `docs/art/asset-manifest.md` and linked it from `docs/art/art-direction.md`: source/concept art stays separate, opaque maps/portraits/scenes should get WebP or AVIF derivatives, transparent icons/tokens/hero cutouts remain PNG, and fallbacks stay preserved.
- Added `src/game/qa.ts` with reusable pure game QA checks for map shape/metadata, shop and recipe IDs, companion definitions, battle pouch IDs, item-granted skills, graph validation, chapter contracts, art contracts, guest NPC safety, and Chapter 2 puzzle divergence.
- Slimmed the Dev Tools QA button in `src/App.tsx` so it calls `runGameQaChecks` and only supplies live runtime callback checks from inside the component.
- Expanded rules coverage for Chapter 2 copy extraction, reusable QA checks, and asset audit docs/script discoverability.

### Verification Run

```bash
npm.cmd run audit:assets -- --limit=5
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run audit:assets -- --limit=5` passed and reported the current largest production assets; top files are still multi-MB PNG maps, which is expected before web derivatives are created.
- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 18 tests.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

Start the Chapter 3 vertical slice contract from `docs/planning/post-chapter-2-technical-hardening.md`: enter Chapter 3 from the checked-in Chapter 2 complete fixture, add placeholder playable Westroot hub flow first, and keep Chapter 1/2 smoke paths green before adding final Chapter 3 art.

## Current Handoff - Asset Runtime Split And Repo Cleanup

Last updated: 2026-07-12

Branch: `main`

### What Changed

- Split asset storage by runtime intent. Shipped game assets now live in `assets/maps/`, `assets/portraits/`, `assets/scenes/`, and `assets/icons/`; reference-only material lives under `assets/reference/`.
- Moved the former top-level `art/characters/` proof work to `assets/reference/paper-doll/characters/` and updated the paper-doll docs/scripts to use the new path.
- Moved Chapter 1 concept art and its top-level manifest docs into `assets/reference/concept/` and `docs/art/archive/`.
- Added `assets/README.md` and `assets/reference/README.md` to document shipped vs. reference asset folders.
- Added `scripts/optimize-assets.mjs` plus `npm.cmd run optimize:assets`. The optimizer preserves full-size originals in `assets/reference/source-art/`, moves non-imported production-folder images to `assets/reference/alternates/`, and leaves optimized runtime derivatives in the shipped asset folders.
- Converted opaque imported maps, scenes, portraits, and enemy art to WebP runtime files. Transparent icons, map tokens, UI symbols, and full-body hero art remain PNG.
- Updated `src/` asset imports for the WebP runtime derivatives while preserving existing emoji/text fallbacks.
- Updated `docs/art/asset-manifest.md`, `docs/art/art-direction.md`, README asset notes, and rules coverage for the new asset workflow.
- Installed `sharp` as a dev dependency for local image optimization.
- Updated Vite to `8.1.4` after `npm audit` flagged the old Vite range; `npm.cmd audit --audit-level=high` now reports zero vulnerabilities.
- Removed ignored generated local clutter (`dist/`, `test-results/`, and `.vite-dev.*` logs). These are safe to delete and are recreated by build/playtest commands.

### Asset Result

- `npm.cmd run optimize:assets` optimized 98 imported assets.
- Imported runtime asset payload went from 151.82 MB to 15.31 MB.
- `npm.cmd run audit:assets -- --limit=10` reports all largest shipped assets as `ok`; the largest runtime image is under 500 KB.

### Verification Run

```bash
npm.cmd run optimize:assets
npm.cmd run audit:assets -- --limit=10
npm.cmd run build
npm.cmd audit --audit-level=high
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run optimize:assets` passed; repeat run moved 0 additional alternates.
- `npm.cmd run audit:assets -- --limit=10` passed.
- `npm.cmd run build` passed. Vite still reports the single JS chunk slightly over 500 KB, which is separate from image payload size.
- `npm.cmd audit --audit-level=high` passed: 0 vulnerabilities.
- `npm.cmd run test:rules` passed: 18 tests.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

Start Chapter 3 from the checked-in Chapter 2 complete fixture, and keep the optimized asset workflow in place when adding Westroot hub art: source/concept/alternate images under `assets/reference/`, runtime derivatives only in the shipped asset folders, then run `npm.cmd run optimize:assets` and `npm.cmd run audit:assets`.

## Current Handoff - Chapter 3 Westroot Vertical Slice And Map Prompt Pack

Last updated: 2026-07-12

Branch: `codex/chapter-3-vertical-slice`

### What Changed

- Added `docs/art/prompts/chapter-3-westroot-hub-map.md`, a ChatGPT-ready map prompt pack. Chapter 3 needs one connected Westroot Hub gameplay map; the pack also includes a route-readable alternate and a Cargo Siding contingency prompt that should only be used if playtesting proves an inset map is needed.
- Added the fallback-safe `westrootHub` map, with placeholder First Westroot Gate, Rootmarket, Mossgarden, Witness Stones, Split Hall, Cargo Siding, and Rootbread Hatch nodes. It intentionally has no final background image yet.
- The checked-in Chapter 2-complete fixture now loads at the First Westroot Gate, so Chapter 3 testing never requires replaying Chapter 2.
- Added the first playable Chapter 3 loop: Bramwell's limited welcome, Quill and Noma's community voices, the optional Rootbread Promise, a fail-forward Witness Stones sequence, a simultaneous Cargo Siding encounter, and the Split Hall resolution/Chapter 4 handoff.
- Added Chapter 3 typed flags, quest journal steps, fallback map tokens, enemy and reward data, and Chapter 3 scene copy in `src/story/chapter3.ts`.
- Added `npm.cmd run playtest:chapter3` and its Playwright coverage. The test proves the Chapter 3-ready save reaches Westroot and that an incorrect Witness Stones choice recovers into the correct sequence.
- Kept all art and token fallbacks intact; final map art is an overlay replacement task, not a movement-system rewrite.

### Verification Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 21 tests.
- `npm.cmd run playtest:chapter1` passed: 1 test.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:chapter3` passed: 1 test.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

1. Generate Westroot Hub candidates from `docs/art/prompts/chapter-3-westroot-hub-map.md`; select only after comparing path clarity and overlay safe space.
2. Put raw generations in `assets/reference/`, promote the selected opaque map to `assets/maps/`, then run `npm.cmd run optimize:assets` and `npm.cmd run audit:assets`.
3. Wire the selected background into `src/data/maps.ts`, tune `src/data/mapVisuals.ts` with Map Debug on/off, and preserve the Westroot placeholder fallback until visual QA passes.
4. Expand the Chapter 3 Playwright path from the Witness Stones through Cargo Siding, Split Hall, and the completion flags before adding final portraits and scene art.

## Current Handoff - Westroot Hub Art Integration

Last updated: 2026-07-12

Branch: `codex/chapter-3-vertical-slice`

### What Changed

- Promoted the user-provided Westroot Hub source map into the runtime asset flow. The original `westroot-hub-map-v01.png` now lives under `assets/reference/source-art/assets/maps/`; the imported runtime derivative is `assets/maps/westroot-hub-map-v01.webp`.
- The 1672x941 opaque source was optimized to a 1600x900 WebP runtime asset (about 413 KB), within the documented map budget.
- Wired the WebP as `MAPS.westrootHub.backgroundImage` and marked Westroot Hub map art available in `src/data/artworkPlan.ts` and `docs/art/asset-manifest.md`.
- Replaced the loose Westroot Hub grid with a connected navigation graph, then placed its gate bridge, Rootmarket, Mossgarden, Witness Stones, Split Hall, Cargo Siding, and Rootbread Hatch nodes directly on their painted landmarks in `src/data/mapVisuals.ts`.
- Visual browser QA confirmed the initial fog now follows the painted gate bridge instead of revealing disconnected map pockets. The Chapter 3 Playwright path was adjusted to use the graph's real route to Mossgarden.

### Verification Run

```bash
npm.cmd run audit:assets -- --limit=12
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
git diff --check
```

### Next Recommended Slice

1. Continue the Chapter 3 automated golden path through Cargo Siding, Split Hall, and the Chapter 4 handoff.
2. Use Map Debug after any future Westroot image replacement; retain the graph and tune only node anchors, not freeform movement.
3. Generate the Chapter 3 Westroot NPC portraits and any selected story-scene closeups after the core gameplay pass is human-playtested.

## Current Handoff - Chapter 3 Full Story Flow

Last updated: 2026-07-12

Branch: `codex/chapter-3-vertical-slice`

### What Changed

- Promoted the full Chapter 3 script, not the former abbreviated vertical-slice copy, as the playable flow source.
- Expanded Rootmarket into Quill's complete introduction and old-road follow-up choices, and added Auntie Lume's Rootbread Promise conversation.
- Restored the sealed-hatch sequence: the Mossback child, Lio's blue-thread knot, the promise completion, and a visible side-quest journal entry.
- Added Witness Stone inspection copy and the fail-forward correction outcome now awards the Witness Stone Rubbing immediately while keeping the correct sequence available.
- Expanded Cargo Siding into lens, wax, ledger, and crate inspections; the true multi-enemy encounter remains intact.
- Added a save-safe Cargo Transfer Tag story item with emoji fallback. After the Cargo Siding battle, the player can secure a captured runner or let the runner escape; both branches preserve the required evidence and Chapter 3 completion route.
- Restored Split Hall's three player responses, its full community resolution, the Mossgarden closing handoff, and sparse companion reactions for the major Chapter 3 beats.
- Expanded `tests/chapter3.spec.ts` to cover the Rootbread/Witness route and the Cargo/Split Hall/Chapter 4 handoff route.

### Verification Run

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 21 tests.
- `npm.cmd run playtest:chapter1` passed: 1 test.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:chapter3` passed: 2 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.

### Next Recommended Slice

1. Human-playtest the fuller Chapter 3 script and adjust pacing or choice wording without reducing its story beats.
2. Promote the selected Chapter 3 portrait, enemy, icon, and scene art from the prompt pack, then wire it through the fallback-safe registries.
3. Keep Map Debug on/off visual QA after any Westroot map or scene art replacement.

## Current Handoff - Chapter 3 Production Art Integration

Last updated: 2026-07-13

Branch: `codex/chapter-3-vertical-slice`

### What Changed

- Selected and wired the final Chapter 3 NPC portraits: Bramwell, Quill, Auntie Lume v02, Noma v02, and the Rootbread child v02. Dialogue retains emoji fallbacks if an image fails.
- Selected and wired the Briar Cargo Runner and Seal-Forged Sentry battle portraits, while preserving their existing battle icons as fallbacks.
- Selected and wired the Rootbread Charm plus corrected Witness Stone Rubbing v02 and Cargo Transfer Tag v02 item icons.
- Added six story-scene images to their matching beats: First Westroot Gate, Witness Stones, Rootbread Promise, Cargo Siding, Split Hall resolution v03, and Mossgarden closing mark.
- Extended the Chapter 3 Playwright path to assert all six scene-image references, and added static registry coverage for selected portraits, enemy artwork, icons, and art-plan availability.
- Ran the production asset optimizer. Opaque portraits/enemies/scenes are now 1200px/1600px WebP runtime assets; transparent icons remain PNG. Full-size originals are under `assets/reference/source-art/`; earlier v01/v02 choices and source sheets are under `assets/reference/alternates/`.
- Updated `docs/art/asset-manifest.md` and `src/data/artworkPlan.ts` to record the selected Chapter 3 production set.

### Verification Run

```bash
npm.cmd run optimize:assets
npm.cmd run audit:assets
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
git diff --check
```

Latest local results:

- Asset optimization reduced imported runtime payload from 198.71 MB to 19.59 MB and archived 9 unselected Chapter 3 files.
- `npm.cmd run audit:assets` passed; selected Chapter 3 scenes are 1600×900 and within the documented runtime range.
- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 22 tests.
- `npm.cmd run playtest:chapter1` passed: 1 test.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:chapter3` passed: 2 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

1. Do one human visual playtest of Chapter 3 at desktop and narrow-mobile widths, focusing on dialogue scrolling around the six illustrations.
2. When Chapter 4 art is ready, use the same source-art/alternate/runtime split and retain the existing fallback UI.

## Current Handoff - Chapter 1 Playtest Polish And Dialogue Art

Last updated: 2026-07-16

Branch: `codex/chapter-3-vertical-slice`

### What Changed

- Applied the queued Chapter 1 human-playtest pass covering story sequencing, map interactions, camp behavior, crafting copy, companion-command clarity, narrow battle layout, and dialogue presentation.
- Kept the forged-order reveal after the Bramble Boar fight and made Elder Brynn the report-back authority before the player leaves Hearthhollow.
- Made the Hearthhollow well a one-time walk-on discovery, moved Sela of the Loom near the well crowd, aligned the Bramblecross notice board, and made Hollis lead the player directly to the Root Cellar.
- Reworked the latest-update presentation, camp feedback, recipe benefit copy, worried-traveler testimony, and Chapter 1 naming/exit-gate continuity.
- Replaced the highest-value generic dialogue symbols with intentional production art: Courier Satchel evidence, the complete Watchhouse case wall and four crops, the Root Sigil and Route Mural crops, and a true-alpha Briar Crown mark.
- Reconnected the formerly orphaned Route Mural node to the Root Cellar navigation graph.
- Added focused Chapter 1 and rules coverage for the revised story, interactions, companion commands, and dialogue art.
- Added `docs/playtest-notes/2026-07-16-playtest-handoff.md` as the concise completed-work and remaining-work checkpoint.

### Asset Result

- The three opaque dialogue masters are optimized WebP runtime scenes with full-size PNG sources under `assets/reference/source-art/`.
- The Briar Crown mark is a 512×512 true-alpha runtime PNG; its 1254×1254 source is preserved under `assets/reference/source-art/`.
- `src/data/dialogueArt.ts` is the reusable registry for full scenes, focused crops, and transparent emblem presentation.

### Resume On Another Machine

```bash
git fetch --all --prune
git switch codex/chapter-3-vertical-slice
git pull --ff-only
npm install
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
```

If the branch does not exist locally yet, use `git switch --track origin/codex/chapter-3-vertical-slice`.

### Verification Run

- `npm.cmd run optimize:assets` passed: 120 imported assets; no selected asset was archived.
- `npm.cmd run audit:assets -- --limit=10` passed: 120 production images scanned.
- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains documented as follow-up work.
- `npm.cmd run test:rules` passed: 24 tests.
- `npm.cmd run playtest:chapter1` passed: 11 tests.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:chapter3` passed: 2 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

### Next Recommended Slice

Use `docs/playtest-notes/2026-07-16-playtest-handoff.md` as the source of truth. The first priorities are narrow-mobile human QA, a full Chapter 3 pacing playtest, and completing the remaining stock-dialogue-art migration without disturbing the working Chapter 1 baseline.

## Current Handoff - Chapter 1 Road And Notice Follow-Up

Last updated: 2026-07-16

Branch: `codex/chapter-3-vertical-slice`

### What Changed

- Rewrote the worried traveler's follow-up so he fully believes and obeys the apparent Crown order rather than diagnosing the forgery.
- Made the Lantern Road bandit encounter trigger across the eastern road corridor after the planted order is found. Missing the hidden battle tile no longer allows the player to bypass the ambush.
- Kept Lantern Road on its tuned grid movement model; a full hand-authored graph remains optional rather than necessary for this fix.
- Moved the Bramblecross notice board from logical tile `7,4` to `7,5` while preserving its painted-map anchor. It is now accessible from below and the left, matching the artwork.
- Removed the unwanted seal-analysis sentence from the public notice board, separated Ada's side-quest notice from the cellar evidence collection, and expanded Hollis's explanation of why the player needs the public notices before entering the cellar.
- Updated the Chapter 1 canonical story script and focused regression coverage for these behaviors.

### Stock-Icon Replacement Follow-Up

- Replaced the Watchhouse evidence-card emoji with existing scene crops, map crops, the courier satchel scene, and the Briar Crown mark. Empty evidence slots are now deliberate text-only placeholders.
- Added portrait-led Watchhouse controls for Enna and Hollis, removed the generic interior subtitle, and staged Hollis's concern about Edden so the door is not named before the player knows him.
- Replaced direct companion emoji in the Companion menu and battle party card with existing portraits.
- Registered existing artwork for the Split Crown Slat, Briar Signmaker's Ledger, and Cleaned Lantern Mark.
- Added and wired five transparent level-up emblems. The original growth emoji remain only as image-error fallbacks; Craft uses `level-up-craft-v02.png`.
- Saved the generation handoff in `docs/art/prompts/dialog-stock-icon-replacement-prompt-pack.md` and updated `docs/planning/dialog-stock-icon-replacement-plan.md` with the completed and remaining audit work.

### Verification

- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 25 tests.
- `npm.cmd run playtest:chapter1` passed: 14 tests (13 in the full run plus the corrected golden-path selector rerun).
- `npm.cmd run playtest:smoke` passed: 1 test.
- `npm.cmd run optimize:assets` produced 512 px runtime emblems and preserved their full-size true-alpha sources.
- `npm.cmd run audit:assets -- --limit=10` passed: 125 production images scanned, with no over-target assets.
- `git diff --check` passed with normal Windows LF-to-CRLF warnings only.

## Current Handoff — Bramblecross V2 And Responsive Gameplay Shell

Last updated: 2026-07-17

### What Changed

- Promoted the user-generated Bramblecross town map v2, optimized it to `assets/maps/bramblecross-town-map-v02.webp`, and preserved the full PNG source under `assets/reference/source-art/`.
- Moved the Old Root Cellar interaction from `(5,6)` to `(3,5)` and focused its painted-map point at `(25.2%, 49.7%)`, on the new visible cellar steps. The former cellar tile is ordinary road again.
- Repaired the cramped Adventure Menus presentation: tabs now sit below the heading, and inventory items use readable full-width cards instead of two squeezed columns.
- Completed the functional combat-responsive pass with a persistent action dock below the `2xl` breakpoint. It keeps hero HP, selected-target HP, skills, items, and companion command together while the battlefield scrolls.
- Added `docs/planning/gameplay-ux-redesign-plan.md` with the recommended map-first shell, desktop menu drawer, mobile bottom sheet, and phased implementation plan.
- Recorded the user's Paint.NET alpha-cleaned level-up files as the authoritative sources; do not replace them with the earlier cleanup working files.

### Verification

- `npm.cmd run optimize:assets` passed: 125 imported assets optimized; Bramblecross v1 moved to reference alternates.
- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 25 tests.
- Focused Chapter 1 responsive/map tests passed: 3 tests.
- `npm.cmd run playtest:chapter1` passed: 16 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `npm.cmd run audit:assets -- --limit=10` passed: Bramblecross v2 is 1448×1086 WebP at approximately 433 KB and within target.

## Current Handoff — Willowmark V2 And Room-Aware Cellar Fog

Last updated: 2026-07-17

### What Changed

- Selected `willowmark-seal-v02.png` for the completed Watchhouse case wall. Its defect is a lens-level nick in the left leaf; v1 is retained under reference alternates.
- Optimized the selected 1448×1086 source into a 512 px runtime PNG while preserving the full-resolution v2 under source art.
- Updated Ada's runtime and canonical Chapter 2 wording so the identifying nick consistently belongs to the left leaf.
- Added eight authored Root Cellar fog-reveal areas. Corridors retain narrow path visibility, while entering a chamber reveals most of that room and keeps it discovered.
- Made Smith Orin's weapon complete the main **Prepare for the road** objective. The old hatchet remains optional backup equipment and no longer outranks later story objectives when left at home.
- Updated older Chapter 2 and Chapter 3 location assertions to use accessible map interaction names after removal of the former below-map location sentence.

### Verification

- `npm.cmd run optimize:assets` passed: 126 imported assets; Willowmark v1 moved to reference alternates.
- `npm.cmd run audit:assets -- --limit=10` passed: 126 production images scanned.
- `npm.cmd run build` passed.
- `npm.cmd run test:rules` passed: 26 tests.
- `npm.cmd run playtest:chapter1` passed: 19 tests.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:chapter3` passed: 2 tests.
- Desktop and narrow-width browser QA confirmed that room masks expand coherently while untouched rooms remain obscured.

### Canonical Pickup

Use `docs/playtest-notes/2026-07-17-current-status.md` for the concise current state, verified commands, and prioritized remaining work. This file remains the chronological implementation history.

## Current Handoff — Chapter 1 Ending And Chapter 2 Transition

Last updated: 2026-07-17

### What Changed

- Moved the formal **Chapter 1 Complete: The Road That Lied** presentation to the sealed-door proof pickup after the Briar Knot Warden fight.
- Combined the cellar report, Westroot explanation, and Chapter 2 expedition organization into one Watchhouse conversation. Its closing choice now sets `chapterReported`, `chapterTwoStarted`, and `chapterTwoBriefed` together.
- Kept the Watchhouse's Westroot briefing available afterward as an optional review and as a compatibility path for older saves.
- Updated the combined briefing to identify Mara, Edden, and Ada as the next preparation threads without repeating the Westroot premise in a second required Enna interaction.
- Gated Edden's drawing review on `eddenDrawingReceived`; the briefing now leaves room for his testimony until the player visits him and receives the drawing.
- Replaced Mayor Anwen's cellar warning with post-cellar and post-report dialogue once Chapter 1 is cleared.
- Collapsed the detailed Chapter 1 case wall into a compact archive after the report, removing the four obsolete evidence actions while keeping the active Westroot preparation controls.
- Companion story reactions now require the companion to have positive HP. A living companion's sealed-door reaction remains available from the Chapter 1 completion tableau after the player takes the Warden Chain and Edden's cloth; a downed companion offers no reaction control.
- Corrected the Root Cellar stairs so they return to the painted Bramblecross cellar entrance at `(3,5)` instead of the retired `(6,6)` location.
- Added Chapter 1 browser coverage for the completion tableau, merged transition, and corrected cellar return.
- Updated the canonical Chapter 1 story script to treat the Watchhouse report as the combined epilogue and Chapter 2 opening.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run optimize:assets` passed: 128 imported assets optimized; the two new full-size PNGs were preserved under source art and emitted as runtime WebPs.
- `npm.cmd run audit:assets -- --limit=10` passed: 128 production images scanned, with both new assets within the documented map/scene targets.
- `npm.cmd run test:rules` passed: 26 tests.
- `npm.cmd run playtest:chapter1` passed: 23 tests.
- `npm.cmd run playtest:chapter2` passed: 19 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows line-ending warnings only.

### Artwork Follow-Up

The selected Chapter 1 ending scene is wired into the completion dialogue, and the Root Cellar now swaps to a cleared painted background after the Warden falls. Runtime WebP derivatives live in `assets/scenes/` and `assets/maps/`; full-resolution PNG sources are preserved under `assets/reference/source-art/`.

## Current Handoff — Downed Companion System Pass

Last updated: 2026-07-17

### What Changed

- Added the shared `isCompanionConscious` rule so recruitment and ability to act are no longer treated as the same state.
- Applied the rule to Chapter 1 case-wall/report reactions, Chapter 2 briefing/departure narration and all threshold/door reads, and Chapter 3 story reactions.
- Downed companions remain recruited and recoverable, but do not speak, perform physical story actions, satisfy cellar-readiness language, or receive victory XP.
- The quest journal now marks a recruited 0-HP companion as **Downed** and directs the player toward rest, shelter, camp, or a healing item.
- Fixed battle-item revival so a companion healed from 0 HP takes the immediately following companion turn instead of being skipped by stale pre-heal state.
- Made the Briar Knot Warden victory flow directly into the Sealed Iron Door. The post-boss reveal cannot be dismissed before the proof is collected, so the player cannot leave a defeated cellar with `chapterOneClear` still unset.
- Made the companion's sealed-door reaction a persistent one-time beat; once heard, its action is hidden from both the door and the Chapter 1 ending tableau.
- Added Chapter 1–3 browser coverage plus a rules-level availability contract.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run test:rules` passed: 27 tests.
- `npm.cmd run playtest:chapter1` passed: 27 tests.
- `npm.cmd run playtest:chapter2` passed: 20 tests.
- `npm.cmd run playtest:chapter3` passed: 3 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.

## Current Handoff — Persistent Choices And One-Time Action Pass

Last updated: 2026-07-17

### What Changed

- Added a persistent companion roster. Sending a companion to the inn and inviting them back now restores their HP, XP, level, and learned progress instead of rebuilding a fresh companion. The currently active companion is marked **Traveling** and cannot be recruited again.
- Split repeatable skill checks into explicit **attempted** and **succeeded** state. The Watchhouse evidence checks, shrine study, cart tracks, Briar Crown examination, and companion recruitment checks no longer reroll or award repeat XP when reviewed.
- Hid exhausted one-time actions such as the pond forage and completed door reactions. Repeatable reference material remains available with review-oriented labels and the remembered result.
- Separated Chapter 2 clue observation from clue resolution. The Westward Cut can still be copied on the return trip after an outbound study, and early questions to Mara or Edden remain actionable once the matching shelter or Lantern clues are found.
- Kept the Crown and Lantern Door NPC/companion opinions one-time, and removed the failed Lantern supply-door attempt after it has been tried.
- Gave Noma's three Chapter 3 information topics independent state. Asking one question no longer discards the other two; each remains available until asked.
- Extended save migration for the companion roster and all new choice-state flags so older saves remain loadable.

### Interaction-State Rule

For future story actions, persist the three concepts separately when they can diverge: whether an action was attempted, what result it produced, and whether a later clue actually resolved it. A review must not reroll a remembered check, and collecting an unrelated clue must not silently consume an unanswered action.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run test:rules` passed: 27 tests.
- Combined Chapters 1–3 browser suite passed: 56 tests (29 Chapter 1, 23 Chapter 2, and 4 Chapter 3).
- Focused regression coverage confirms companion progress survives inn swaps, exhausted actions disappear, Westroot clues work in either order, and Noma preserves unanswered topics.

## Current Handoff — Compact Grouped Dialogue Choices

Last updated: 2026-07-17

### What Changed

- Added an opt-in grouped layout to the shared dialogue renderer. Existing dialogues remain single-column unless they explicitly request grouping.
- Applied the layout to the Three-Door Threshold: the three door approaches share a responsive row, Mara and companion reads share a second row when available, and **Step back** remains a quieter full-width exit.
- Preserved touch-friendly minimum button heights. Groups use three columns on wide screens, two columns at intermediate widths, and full-width stacked actions on phones.
- Added browser coverage that checks the threshold's wide-screen row and its phone-width stack.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run test:rules` passed: 27 tests.
- Combined Chapters 1–3 browser suite passed: 57 tests (29 Chapter 1, 24 Chapter 2, and 4 Chapter 3).
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows line-ending warnings only.

## Current Handoff — Three-Door Close-Up And Backtracking Pass

Last updated: 2026-07-17

### What Changed

- Retired the obsolete **False Crown Passage** preview. Before the Roadwatcher's split slat is found, the Crown Door does not open and reveals nothing about the den beyond it.
- Trying the locked door now records only `crownDoorTried` and points out the hidden notch. Deliberately trusting the false Crown Sign still records the intended messy-route mistake, but ends at the same sealed door instead of granting premature knowledge.
- Added an opt-in split presentation to the shared dialogue modal and applied it to the Crown, Lantern, and No-Handle Door close-ups. On wider screens, the copy begins beside the art and is visible immediately; narrow screens stack the same content.
- Removed the redundant captions beneath single-door artwork. The dialogue title remains the one accessible visible label.
- Grouped each door's investigation actions, character reads, and consequential actions into compact responsive rows while preserving full-width phone targets.
- Made **Step back** at the Three-Door Threshold restore the trail node used to enter it. The previous node is retained if the player closes and manually reopens the threshold dialogue.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- Focused Chapter 2 browser coverage confirms the locked Crown Door reveals no passage, false-sign trust ends at the sealed door, all three close-ups expose their copy at desktop and phone widths, and threshold backtracking restores the prior map node.
- `npm.cmd run test:rules` passed: 27 tests.
- Combined Chapters 1–3 browser suite passed: 60 tests (29 Chapter 1, 27 Chapter 2, and 4 Chapter 3).
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows line-ending warnings only.

## Current Handoff — Threshold Readability And Door Return-State Pass

Last updated: 2026-07-18

### What Changed

- Applied the split scene layout to the Three-Door Threshold itself. The threshold copy now begins beside the illustration on wider screens instead of below it.
- At phone widths, required prose appears before a shorter stacked illustration. Players no longer need to discover the internal scrollbar to understand the scene.
- Kept the compact action area available without forcing a ceremonial scroll through already-read prose.
- Fixed the Lantern Door-to-sign return loop so `lanternSignCleaned` and related local state are carried through every dialogue transition.
- Cleaning the Lantern Sign now awards XP only once. Later visits are labeled **Review the Lantern Sign**, preserve the cleaned copy, and never restore the cleaning action.
- Applied the same inspect/review distinction to the Crown Sign once it has been resolved.
- Companion opinions at the Crown, Lantern, and No-Handle Doors now return to the exact door that launched them. Each return carries its one-time reaction flag and the door's current local state, so the opinion remains consumed.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- Focused Chapter 2 coverage confirms threshold prose is immediately visible at 1400×900 and 430×932, Lantern cleaning remains at one XP award across repeated reviews, and all three companion reads return to their originating doors.

## Current Handoff — Save-Gate Clarity And Encounter Marker Pass

Last updated: 2026-07-18

### What Changed

- Reproduced the user-provided **Mossgirl - Westroot Trail** save through the real disk file-picker path. Its repair flags are complete and the No-Handle Door opens correctly after the player repeats the old road phrase.
- Kept the second phrase as the intentional password beat. When the door is ready, its copy now says so directly and the opening phrase becomes a highlighted primary choice with an explicit consequence.
- Removed map overlays from the False Detour Notice and Crown Den clue/exit stations. Their locations remain readable in the painted maps and through navigation hitboxes.
- Added enemy-art markers for visible encounters: the south-gate boar, Root Cellar skulk, Briar Roadwatcher, releasable thorn-collared hound, fixed Crown Den guard, and Cargo Siding threat. Defeated/resolved markers disappear.
- Kept intentionally hidden ambushes unmarked. The Briar Knot Warden also remains unmarked because the guardian is already painted into the Root Cellar map.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run test:rules` passed: 27 tests.
- Combined Chapters 1–3 browser suites passed: 65 tests (30 Chapter 1, 31 Chapter 2, and 4 Chapter 3).
- `npm.cmd run playtest:smoke` passed: 1 test.
- `git diff --check` passed with normal Windows line-ending warnings only.

## Current Handoff — Westroot Hub Navigation And Chapter 3 Entry Order

Last updated: 2026-07-18

### What Changed

- Rebuilt the Westroot Hub graph around the painted entrance road and plaza. Added short intermediate path nodes so movement follows visible stonework instead of hopping between distant landmark coordinates.
- Increased path reveal width and added room-aware fog areas for the gate approach, Rootmarket, central plaza, Mossgarden, Witness Stones, Split Hall, Cargo Siding, and Rootbread Hatch.
- Removed the duplicate non-navigable Rootmarket tile and added every Chapter 3 hub landmark to reusable map-graph validation.
- Made Bramwell’s introduction mandatory before Westroot exploration. A normal Chapter 2 transition opens his scene immediately; movement, connected-node clicks, manual inspection, and older saves already inside the hub all route back to the First Westroot Gate until `metBramwell` is set.
- Changed repeat/auto-inspect logic to key off `metBramwell`, repairing the previously possible state where Chapter 3 had started but Bramwell had never been met.

### Future Option To Preserve

- **High-perception ambush discovery:** near an intentionally hidden encounter, an exceptional hidden Perception/Instinct result could reveal its enemy marker and allow a pre-ambush response. Keep normal failures fully hidden. Include this among the options the next time the user asks **“what’s next?”**

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run test:rules` passed: 28 tests.
- `npm.cmd run playtest:chapter3` passed: 4 tests.
- Live browser QA confirmed the gate-to-market reveal is continuous and that an attempted first move opens Bramwell without moving the hero past the gate.

## Current Handoff — Chapter 3 Endpoint And Bridge Alignment

Last updated: 2026-07-18

### What Changed

- Inspected `public/saves/stuck ch 3.json`. Its main Chapter 3 flags are fully complete (`witnessStoneSequenceSolved`, `willowCargoExposed`, `westrootTrustEarned`, and `chapterThreeClear`), so the silent hub was the current prototype endpoint rather than a blocked main quest.
- Found one unfinished optional thread in that save: Auntie Lume and the Rootbread Promise. The persistent objective now explains that Chapter 4 is not playable yet and gives the exact optional route through Rootmarket to the sealed hatch.
- Added the same endpoint explanation to the final Mossgarden scene and changed its closing action to **Finish Chapter 3 for now**, avoiding a button that implies the westward Chapter 4 route is already playable.
- Corrected the Westroot entrance geometry after live comparison with the painted map. The route descends from the gate, crosses the lower wooden bridge, and rises into the open Rootmarket plaza. Rootmarket is no longer positioned inside its awning, and the Mossgarden branch skirts the hut instead of crossing it.
- Preserved one-time walk-over behavior: completed landmark scenes do not repeatedly interrupt movement, but manual **Inspect** still opens their review dialogue.
- Made Rootmarket the deliberate exception while Auntie Lume is still unmet: walking onto the market automatically opens its choices until the Rootbread lead has been introduced, then later walk-throughs remain quiet.

### Verification

- `npm.cmd run build` passed; the existing slightly-over-500-KB JavaScript chunk warning remains.
- `npm.cmd run test:rules` passed: 28 tests.
- `npm.cmd run playtest:chapter1` passed: 30 tests.
- `npm.cmd run playtest:chapter2` passed: 31 tests.
- `npm.cmd run playtest:chapter3` passed: 5 tests, including the user-provided stuck save.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `npm.cmd run audit:assets` passed: 128 production images scanned within the documented category targets.
- Live disk-load QA confirmed the endpoint guidance and remaining Rootbread thread.
- Live map QA confirmed the hero follows the wooden bridge and adjacent paving; no browser console errors were reported.

## Current Handoff — Chapter 3 Faction Tension And Rootmarket Hub

Last updated: 2026-07-19

### What Changed

- Added an optional pre-bell Split Hall visit where ordinary Stonekin and Mossback residents are already arguing across ancestry lines. It is one-time on walk-through and remains reviewable by inspection.
- Added a mandatory Hold Bell crisis after both Quill and Noma have been heard. The first formal Split Hall debate now occurs before the Witness Stones unlock, so the central conflict cannot be skipped on a clean path.
- Made the First Gate, Rootmarket, and Mossgarden react to the Hold Bell and later investigation state. The final Split Hall scene recalls testimony the player chose to hear during the earlier debate.
- Rebuilt Rootmarket as a location hub with independent choices for Quill, Auntie Lume, ambient market voices, and departure. Character conversations return to the market hub instead of nesting Auntie inside Quill's dialogue.
- Added save flags and migration defaults for the new beats so older completed Chapter 3 saves remain past the new gates.
- Selected and wired `split-hall-hold-debate-scene-v01.webp` for the tense debate only. The full PNG source remains in the source-art tree; the existing resolution scene remains exclusive to the final outcome.
- Added the Rootmarket uneasy-arrival prompt to the Chapter 3 production pack, then selected, optimized, and wired the resulting scene exclusively to the Rootmarket location hub. Quill and Auntie Lume retain their individual portraits inside their conversations.

### Verification

- `npm.cmd run build` passed; the existing over-500-KB main-chunk warning remains.
- `npm.cmd run test:rules` passed: 28 tests.
- `npm.cmd run playtest:chapter1` passed: 30 tests.
- `npm.cmd run playtest:chapter2` passed: 31 tests.
- `npm.cmd run playtest:chapter3` passed: 6 tests.
- `npm.cmd run playtest:smoke` passed: 1 test.
- `npm.cmd run audit:assets -- --limit=10` passed: 130 production images scanned within the documented category targets.
- `git diff --check` passed with normal Windows line-ending warnings only.
