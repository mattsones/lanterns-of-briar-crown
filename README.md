# Liam’s Game

A storybook fantasy adventure prototype about Hearthhollow, Lantern Road, Bramblecross, and the mystery of the Briar Crown.

## Current Status

Chapter 1 is playable as a React/TypeScript prototype. Chapter 2, **The Westroot Trail**, now has a playable clean/messy No-Handle Gate path with a painted Westroot Trail map integrated.

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
- Chapter 2 Westroot Trail scenes, puzzle flags, clean/messy Roadwatcher outcomes, and painted map background
- painted Chapter 1 maps, portrait integration, and custom item icons with emoji fallbacks

## Chapter 1

**Chapter 1: The Road That Lied**

The road was not simply dangerous. It was being lied about.

The player begins in Hearthhollow, follows evidence onto Lantern Road, briefs Enna in Bramblecross, investigates the old Root Cellar, discovers the Briar Crown mark, and receives the next lead: Westroot.

## Chapters 2-5 Roadmap

The current long-term goal is a fully illustrated playable prototype through **Chapter 5: Briarhold Waystation**.

Planned arc:

1. **Chapter 2: The Westroot Trail** - complete Mara, Edden, Ada's Willowmark Lens, the Three-Sign Hollow, Roadwatcher consequences, and the First Westroot Gate.
2. **Chapter 3: The Hidden Root** - introduce Westroot as a hidden Lantern Road community and expose Willow-sealed cargo.
3. **Chapter 4: The Riddle Road** - follow Edden's folded-map clues, find Lio's message, and discover the Briarhold lead.
4. **Chapter 5: Briarhold Waystation** - rescue Lio, reveal the Briar Crown cell structure, and hint that the mark itself is older than the faction.

Implementation should move in vertical slices: story/script, data, map, art prompts/generation, implementation, automated QA, then user playthrough.

## Run Locally

```bash
npm install
npm run dev
```

## Recommended Build Check

```bash
npm.cmd run build
```

## Test Checks

```bash
npm.cmd run test:rules
npm.cmd run playtest:chapter1
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
```

Run the full pre-commit verification suite with:

```bash
npm.cmd run verify
```

## Asset Maintenance

Shipped game assets live in `assets/maps/`, `assets/portraits/`, `assets/scenes/`, and `assets/icons/`. Source art, alternates, concepts, and proof work live under `assets/reference/`.

```bash
npm.cmd run audit:assets
npm.cmd run optimize:assets
```

`dist/`, `test-results/`, and local Vite logs are generated and ignored.

## Smoke Playtest

```bash
npm run playtest:smoke
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

At the start of a new thread, fetch and compare against `origin/main` before assuming local files are current.

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

1. Play through Chapter 2 for story feel and map-label taste.
2. Apply any Westroot Trail map projection tweaks found during playthrough.
3. Continue extracting chapter story text and interaction helpers from `src/App.tsx`.
4. Start Chapter 3 as the next vertical slice: story module, Westroot hub map, interactions, and tests.
5. Add chapter-progress, guest-NPC, and artwork-registry tests as new chapters land.
