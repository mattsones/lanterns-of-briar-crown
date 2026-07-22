# Liam’s Game — Agent Instructions

## Thread Start Ritual

At the start of every new Codex thread for this project:

1. Run `git fetch --all --prune`.
2. Run `git status --short --branch`.
3. Compare local and remote with `git rev-list --left-right --count HEAD...origin/main`.
4. If local is clean and behind only, fast-forward with `git pull --ff-only`.
5. If local has uncommitted work, diverges from remote, or is on a feature branch, do not assume local is the source of truth. Inspect first and explain the state before changing files.
6. Read `docs/codex-handoff.md` and any task-specific docs before implementation.

Remote `origin/main` is the project source of truth unless the user explicitly says otherwise.

## Project Goal

Preserve and evolve Liam’s Game, a storybook fantasy React/TypeScript adventure prototype.

The current priority is to complete the playable, fully illustrated prototype through Chapter 5 while preserving the working Chapter 1 baseline.

Chapters 1-3 have automated playable paths. Chapter 3 still needs final human pacing and uninterrupted-playthrough signoff. Chapter 4 should not begin until the closeout, ready-fixture, central-interaction graybox, and executable-contract gates in `docs/planning/chapter-4-development-process.md` are satisfied.

## Read First

Before making changes, read:

- `docs/codex-handoff.md`
- `docs/playtest-notes/2026-07-17-current-status.md`
- `docs/planning/repository-plan.md`
- `docs/story/chapter-1-story-script.md`
- `docs/art/art-direction.md`
- `docs/planning/refactor-roadmap.md`
- `docs/art/asset-manifest.md`
- `docs/playtest-notes/chapter-1-golden-path.md`

Before Chapter 4 work, also read:

- `docs/planning/chapter-4-development-process.md`
- the Chapter 4 section of `docs/story/chapters-2-5-story-bible.md`

## Current App

The original working prototype is preserved as:

- `liams_game_prototype.jsx`

The active app is now:

- `src/App.tsx`
- extracted helpers in `src/game/`
- extracted data in `src/data/`
- extracted reusable UI in `src/components/`
- chapter story modules in `src/story/`

Preserve Chapter 1 behavior while extending later chapters.

## Rules

1. Preserve the working Chapter 1 prototype first.
2. Do not combine broad refactoring with new story behavior.
3. Keep `App.tsx` extraction staged and independently playable; prefer chapter-specific pure logic seams over a full rewrite.
4. Keep changes small and easy to review.
5. Prefer a working build over perfect architecture.
6. Do not replace tile-based movement with freeform movement.
7. Do not remove fallback emoji/icons when adding art.
8. If behavior must change to make the app compile, document the change.

## Standard Verification Commands

```bash
npm install
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:chapter3
npm.cmd run playtest:smoke
npm run dev
```

On Windows, prefer `npm.cmd` for scripted verification when PowerShell execution policy blocks `npm.ps1`.

Use `npm.cmd run verify` for the full local gate. During implementation, run the affected chapter suite plus build and rules checks; run the full gate at release-candidate and handoff milestones.
