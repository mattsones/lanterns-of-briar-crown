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

### Handoff Rule

For machine switching, finish each meaningful work session by:

1. Updating this handoff section or adding a dated note.
2. Running the relevant checks.
3. Committing the scoped changes.
4. Pushing the current branch to GitHub.
5. Mentioning the branch name and latest commit in the final Codex response.
