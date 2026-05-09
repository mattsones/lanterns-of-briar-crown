# Liam’s Game

A storybook fantasy adventure prototype about Hearthhollow, Lantern Road, Bramblecross, and the mystery of the Briar Crown.

## Current Status

Chapter 1 is playable as a React prototype.

Current features include:

- character creation
- tile-based exploration
- dialogue and quest flow
- turn-based combat
- companions
- inventory, equipment, and battle pouch
- item-granted combat skills
- hero XP and level-up choices
- Chapter 1 story arc through the Root Cellar and report-back scene

## Chapter 1

**Chapter 1: The Road That Lied**

The road was not simply dangerous. It was being lied about.

The player begins in Hearthhollow, follows evidence onto Lantern Road, briefs Enna in Bramblecross, investigates the old Root Cellar, discovers the Briar Crown mark, and receives the next lead: Westroot.

## Run Locally

```bash
npm install
npm run dev
```

## Recommended Build Check

```bash
npm run build
```

## Project Docs

Important project docs:

```text
docs/liams_game_repo_plan.md
docs/liams_game_chapter_1_story_script.md
docs/liams-game-art-direction.md
docs/codex-handoff.md
docs/refactor-roadmap.md
docs/asset-manifest.md
docs/playtest-notes/chapter-1-golden-path.md
docs/prompts/chapter-1-environments.md
docs/prompts/chapter-1-characters.md
```

## Development Principle

Preserve the working Chapter 1 prototype first. Refactor slowly after the baseline is committed.

## Art Direction

The game should feel like a hand-painted storybook where the map is playable.

Visual direction:

- storybook fantasy
- hand-drawn / hand-painted feel
- subtle painterly texture
- warm, readable environments
- gentle whimsical humor
- sincere adventure tone
- mostly clean UI with parchment-inspired story panels

## Short-Term Roadmap

1. Preserve the current prototype as `src/App.tsx`.
2. Commit the working baseline.
3. Organize docs and selected concept art.
4. Extract stable data.
5. Extract utilities.
6. Extract UI components.
7. Add tests for progression, battle, map gating, and quest visibility.
8. Begin integrating portraits and illustrated maps.
