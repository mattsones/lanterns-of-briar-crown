# Liam's Game - Post-Chapter 2 Technical Hardening

Status: completed on 2026-07-12; retained as a historical implementation plan

All eight slices in this plan landed before Chapter 3: the Chapter 3-ready fixture, extracted Chapter 2 copy, typed `GameFlags`, save migrations, map validation, asset audit/optimization workflow, reusable QA validators, and the Chapter 3 vertical-slice scaffold. Statements below describe the risks at the time this plan was written. They are not current project status; use `docs/playtest-notes/2026-07-17-current-status.md` and `docs/planning/chapter-4-development-process.md` for current pickup.

This is the recommended technical cleanup pass to pick up after Chapter 2 ships and before Chapter 3 implementation begins in earnest.

The goal is not a rewrite. The goal is to make Chapter 3 cheaper and safer to build while preserving the working Chapter 1 and Chapter 2 baselines.

## Historical Start Condition

Begin this pass only after:

- Chapter 2 has been playtested and finalized.
- The Chapter 2 branch has a clean, pushed commit.
- The standard verification suite is green:

```bash
npm.cmd run build
npm.cmd run test:rules
npm.cmd run playtest:chapter2
npm.cmd run playtest:smoke
git diff --check
```

If there is uncommitted art wiring, map tuning, or story polish in progress, finish that slice first.

## Historical Risk Signals

- `src/App.tsx` is still the center of gravity for game flow and is roughly 5,000 lines.
- `src/App.tsx` still uses `// @ts-nocheck`, so TypeScript cannot catch many story, flag, dialogue, and branch mistakes there.
- `Flags` is currently broad (`Record<string, unknown>`), which makes flag typos easy to miss.
- Save files have a version, but there is no real migration path yet.
- Westroot Trail and Root Cellar movement use hand-authored navigation graphs that should be validated before more graph maps are added.
- Production art is working, but many PNG assets are large enough that Chapter 3-5 art could make the web build heavy.
- Built-in QA checks are useful but still live inside `App.tsx`, which makes them harder to reuse from tests.

## Recommended Order

### 1. Lock The Chapter 2 Baseline

Create a "Chapter 2 complete, Chapter 3 ready" fixture or save after final playtesting.

Acceptance criteria:

- A checked-in save starts at the intended post-Chapter 2 state.
- Tests confirm the save loads and all item, map, companion, guest NPC, and flag data still resolve.
- Chapter progress derives Chapter 3 from the Chapter 2 completion flags.

Likely files:

- `public/saves/`
- `tests/rules.spec.ts`
- `tests/chapter2.spec.ts`
- `src/game/chapterProgress.ts`

### 2. Extract Chapter 2 Scene Text And Scene Contracts

Move stable Chapter 2 dialogue text, scene image metadata, button labels, and repeated local result copy out of `App.tsx` into `src/story/chapter2.ts` or a neighboring story module.

Keep callback behavior in `App.tsx` for now. Do not turn the whole dialogue system into a graph yet.

Acceptance criteria:

- Chapter 2 text can be reviewed mostly from story files.
- `App.tsx` keeps imperative flow, but no longer owns large blocks of stable prose.
- Existing Chapter 2 Playwright tests still pass.

Likely files:

- `src/story/chapter2.ts`
- `src/App.tsx`
- `tests/rules.spec.ts`

### 3. Add A Typed Story Flag Contract

Replace the open-ended flag shape with a known flag contract.

Good first step: derive a `GameFlags` type from the default flag builder or maintain an explicit interface of known flags. Later chapters can add keys deliberately instead of relying on arbitrary strings.

Acceptance criteria:

- Helpers such as Chapter 2 puzzle logic accept the typed flag shape.
- Known Chapter 1-5 flags are declared in one obvious place.
- Tests cover normalization/defaults for new flags.
- This does not require converting all of `App.tsx` to strict TypeScript at once.

Likely files:

- `src/game/types.ts`
- `src/game/state.ts`
- `src/game/chapterProgress.ts`
- `src/story/chapter2.ts`
- `tests/rules.spec.ts`

### 4. Add Save Payload Migrations

Build a small save migration layer before older saves become hard to support.

Use the existing save file version as the entry point, but add explicit migration behavior for:

- missing future flags;
- renamed flags;
- new player fields, such as Human heritage;
- region or position normalization;
- removed or moved items, if that ever happens.

Acceptance criteria:

- Old payloads can be upgraded through `migrateSavePayload`.
- Imported disk saves and localStorage checkpoint saves use the same migration path.
- Tests include at least one intentionally old/minimal payload.

Likely files:

- `src/game/save.ts`
- `src/game/state.ts`
- `src/game/types.ts`
- `tests/rules.spec.ts`

### 5. Validate Map Graphs

Add pure validation helpers for map data and visual navigation graphs before Chapter 3 adds the Westroot hub.

Checks to include:

- every navigation key points to an existing tile;
- every destination points to an existing tile;
- required landmarks are reachable from the map start;
- graph maps have no accidental orphan nodes;
- one-way links are either disallowed or documented intentionally;
- blocked tiles are not accidentally reachable unless the tile is a deliberate interaction node.

Acceptance criteria:

- Root Cellar, Westroot Trail, and Crown Door Den pass validation.
- A future Chapter 3 graph can be added with the same tests.
- Existing hand-tuned point overrides remain supported.

Likely files:

- `src/data/maps.ts`
- `src/data/mapVisuals.ts`
- `src/game/map.ts`
- `tests/rules.spec.ts`

### 6. Add An Asset Size And Export Discipline Pass

Before Chapter 3 art production, create a lightweight asset audit and production export guideline.

The current build is functional, but many individual PNGs are in the 1-3.5 MB range. That is fine for local iteration, but the fully illustrated Chapter 5 prototype will benefit from web-ready derivatives.

Recommended policy:

- Keep source/concept art in source folders.
- Use production-sized derivatives for shipped maps, portraits, scenes, and icons.
- Prefer WebP or AVIF for opaque maps, portraits, and scenes.
- Keep PNG for assets that require transparency, such as item icons and hero cutouts.
- Track budget targets in docs before enforcing them in code.

Acceptance criteria:

- A script or documented command reports the largest production assets.
- Docs state target dimensions and size ranges by asset type.
- No existing fallbacks are removed.

Likely files:

- `scripts/`
- `docs/art/asset-manifest.md`
- `docs/art/art-direction.md`
- `src/data/artworkPlan.ts`

### 7. Move QA Checks Out Of `App.tsx`

The built-in QA checks are valuable. Move the pure validations into a reusable module so both Dev Tools and Playwright can call the same checks.

Acceptance criteria:

- `App.tsx` still exposes a Dev Tools QA button.
- The actual validation rules live outside the component.
- Rules tests cover at least the pure validation module.

Likely files:

- `src/game/qa.ts` or `src/game/validators.ts`
- `src/App.tsx`
- `tests/rules.spec.ts`

### 8. Set Up The Chapter 3 Vertical Slice Contract

After the hardening tasks above, start Chapter 3 as a vertical slice:

1. story module and quest copy;
2. stable item, enemy, map, and flag data;
3. placeholder playable Westroot hub with tile or node movement;
4. automated Chapter 3 start/golden-path coverage;
5. painted map and projection tuning after the route works.

Acceptance criteria:

- Chapter 3 can be entered from the Chapter 2 complete fixture.
- The first playable map works with placeholders before final art.
- Chapter 1 and Chapter 2 smoke paths remain green.

## Non-Goals For This Pass

- Do not introduce Redux, Zustand, routing, or a new state framework unless the current structure becomes actively painful.
- Do not replace tile or node movement with freeform movement.
- Do not split `App.tsx` into many visual components as the first move.
- Do not remove emoji or text fallbacks.
- Do not restart the paper-doll equipment overlay path.
- Do not turn every dialogue into a data-driven graph yet.
- Do not make TypeScript strict across the whole repo in one pass.

## Suggested Commit Slices

Keep these small and independently playable:

1. `Add Chapter 2 complete save fixture`
2. `Extract Chapter 2 story text`
3. `Add typed story flag contract`
4. `Add save payload migrations`
5. `Add map graph validation helpers`
6. `Add asset size audit guidance`
7. `Extract built-in QA validators`
8. `Scaffold Chapter 3 vertical slice`

Run the standard verification suite after each risky slice, especially flags, saves, maps, and movement.
