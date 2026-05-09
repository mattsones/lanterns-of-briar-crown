# Liam’s Game — Agent Instructions

## Project Goal

Preserve and evolve Liam’s Game, a storybook fantasy React/TypeScript adventure prototype.

The current priority is to turn the existing single-file prototype into a runnable Vite React TypeScript project without changing gameplay behavior.

## Read First

Before making changes, read:

- `docs/codex-handoff.md`
- `docs/liams_game_repo_plan.md`
- `docs/liams_game_chapter_1_story_script.md`
- `docs/liams-game-art-direction.md`
- `docs/refactor-roadmap.md`
- `docs/asset-manifest.md`
- `docs/playtest-notes/chapter-1-golden-path.md`

## Current Prototype

The current working prototype is:

- `liams_game_prototype.jsx`

Preserve this behavior when moving it into `src/App.tsx`.

## Rules

1. Preserve the working Chapter 1 prototype first.
2. Do not over-refactor during initial setup.
3. Do not split `App.tsx` into components until the app runs successfully.
4. Keep changes small and easy to review.
5. Prefer a working build over perfect architecture.
6. Do not replace tile-based movement with freeform movement.
7. Do not remove fallback emoji/icons when adding art.
8. If behavior must change to make the app compile, document the change.

## First Milestone

Create a runnable Vite + React + TypeScript app.

Expected files:

- `package.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles.css`
- `.gitignore`
- `README.md`

## First Commands to Run

```bash
git init
npm install
npm run dev
npm run build