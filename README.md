# Liam’s Game

A storybook fantasy adventure prototype about Hearthhollow, Lantern Road, Bramblecross, and the mystery of the Briar Crown.

## Current Status

Chapters 1-3 have automated playable paths in the React/TypeScript prototype. Chapter 1 remains the protected baseline, Chapter 2 is playable through the First Westroot Gate, and Chapter 3 is closed as a release candidate through the Westroot resolution and Chapter 4 handoff. Its human playthrough is signed off; the uninterrupted Chapters 1-3 session is deliberately deferred to the Chapter 4 release-candidate cycle.

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
- Chapter 2 Westroot Trail, Three-Door Hollow, Crown Door Den, and clean/messy Roadwatcher outcomes
- Chapter 3 Rootmarket, Hold Bell, Witness Stones, Cargo Siding, Split Hall, and Rootbread Promise routes
- painted Chapter 1-3 maps, portrait integration, scene art, and custom item icons with fallback-safe presentation

## Chapter 1

**Chapter 1: The Road That Lied**

The road was not simply dangerous. It was being lied about.

The player begins in Hearthhollow, follows evidence onto Lantern Road, briefs Enna in Bramblecross, investigates the old Root Cellar, discovers the Briar Crown mark, and receives the next lead: Westroot.

## Chapters 2-5 Roadmap

The current long-term goal is a fully illustrated playable prototype through **Chapter 5: Briarhold Waystation**.

Chapter arc:

1. **Chapter 2: The Westroot Trail** - playable through the Three-Sign Hollow, Crown Door Den, Roadwatcher consequences, and First Westroot Gate.
2. **Chapter 3: The Hidden Root** - release-candidate route through Westroot and its Willow-sealed cargo resolution, with human-playthrough signoff and a checked-in Chapter 4-ready fixture.
3. **Chapter 4: The Riddle Road** - planned route following Edden's folded-map clues to Lio's message and the Briarhold lead.
4. **Chapter 5: Briarhold Waystation** - planned rescue of Lio and reveal of the Briar Crown cell structure.

Implementation should move in vertical slices: executable chapter contract, central-interaction graybox, data and placeholder map, critical path, automated QA, human playthrough, then production art and release-candidate QA. The Chapter 4 process is documented in [`docs/planning/chapter-4-development-process.md`](docs/planning/chapter-4-development-process.md).

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
npm.cmd run playtest:chapter3
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
npm.cmd run playtest:smoke
```

## Project Docs

Start with [`docs/README.md`](docs/README.md) for the documentation map. Important project docs:

```text
docs/codex-handoff.md
docs/story/chapter-1-story-script.md
docs/art/art-direction.md
docs/art/asset-manifest.md
docs/planning/repository-plan.md
docs/planning/refactor-roadmap.md
docs/planning/chapter-4-development-process.md
docs/playtest-notes/chapter-1-golden-path.md
docs/art/prompts/chapter-1-environments.md
docs/art/prompts/chapter-1-characters.md
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

1. Define and approve the Chapter 4 executable contract, including the early Westroot smith/gatewright access requirement.
2. Graybox and human-test the Folded Map interaction before building the surrounding route or commissioning production art.
3. Keep the uninterrupted human Chapters 1-3 session on the Chapter 4 release-candidate checklist.
4. Continue the staged `src/App.tsx` extraction and address the slightly-over-500-KB main bundle as focused technical work.
5. Continue the source-art, optimized-runtime, and fallback-safe asset workflow as later chapters land.
