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
