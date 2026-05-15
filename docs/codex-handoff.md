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
  liams_game_chapter_1_story_script.md
  liams_game_repo_plan.md
  liams-game-art-direction.md

liams_game_prototype.jsx
```

The immediate goal is to turn this into a runnable Vite + React + TypeScript project while preserving the working prototype.

## Codex Instructions

Please read these first:

1. `docs/liams_game_repo_plan.md`
2. `docs/liams_game_chapter_1_story_script.md`
3. `docs/liams-game-art-direction.md`
4. `docs/prompts/chapter-1-environments.md`
5. `docs/prompts/chapter-1-characters.md`
6. `docs/asset-manifest.md`
7. `docs/refactor-roadmap.md`

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
- Added fog-of-war exploration on all non-Hearthhollow maps. Hearthhollow stays visible because Liam knows his hometown.
- Adjusted Bramblecross Inn companion portrait crops slightly downward.
- Updated the smoke test to assert the painted map stage, hidden old grid, hero movement, save/load controls, Dev Tools, and built-in QA checks.
- Wired the cleaned Hearthhollow and Lantern Road map exports into production (`hearthhollow-gameplay-map-v04.png` and `lantern-road-gameplay-map-v02.png`).
- Tuned the Old Root Cellar visual projection in `src/data/mapVisuals.ts` with Root Cellar-only node anchors so the hidden grid follows the painted corridors more closely. Bramblecross was intentionally left unchanged.
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

- Continue checking map alignment with Dev Tools > Show Map Debug after any map art replacement. Prefer map-specific `pointOverrides` in `src/data/mapVisuals.ts` before changing gameplay tile arrays.
- Bramblecross currently lines up well enough; avoid changing its projection unless new art changes require it.
- The current hero map token is still a styled placeholder using the selected appearance emoji. A proper hero portrait/token asset can replace it later.
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

## Current Handoff - Hearthhollow Polish

Last updated: 2026-05-11

Branch: `main`

### What Changed

- Moved Nella the Baker off the hero start tile at `2,4`; she now uses Hearthhollow tile `5,2`.
- Changed Hearthhollow tile `6,4` into a blocked `well` landmark.
- Added a small well interaction in `src/App.tsx` for players who try to walk onto it.
- Added QA/smoke coverage so future map edits preserve the Nella/start/well placement.

### Latest Verification

- `npm run build` passed.
- `npm run test:rules` passed.
- `npm run playtest:smoke` passed.
- Manual browser check confirmed the hero starts on Grass, Nella is separate, and walking into the well opens the Village Well joke interaction instead of moving onto it.

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
