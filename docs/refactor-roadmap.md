# Liam’s Game — Refactor Roadmap

This roadmap describes how to move from the current single-file prototype to a maintainable game project without breaking Chapter 1.

## Current State

The original Vite milestone is complete. Chapter 1 is playable, data and helper extraction has started, painted Chapter 1 maps are integrated, custom item artwork is wired through a fallback-safe registry, and Chapter 2 has started in `src/App.tsx`.

The active refactor goal is no longer "make the app run." It is to reduce `App.tsx` risk while Chapters 2-5 are implemented as tested vertical slices.

## Guiding Rule

Do not refactor everything at once.

Every refactor should leave the game playable.

---

# Phase 0 — Working Baseline

## Goal

Get the current prototype running in a real repo.

## Tasks

- Create Vite React TypeScript structure.
- Move the current prototype into `src/App.tsx`.
- Confirm game starts locally.
- Commit before any major refactor.

## Commit

```bash
git commit -m "Add working Chapter 1 prototype"
```

---

# Phase 1 — Documentation and Assets

## Goal

Add story, art, and planning docs.

## Tasks

- Add story script.
- Add repo plan.
- Add art direction.
- Add Codex handoff.
- Add prompt docs.
- Add selected art assets.

## Commit

```bash
git commit -m "Add Chapter 1 docs and art direction"
```

---

# Phase 2 — Extract Stable Data

## Why data first?

Data extraction is safer than component extraction. It reduces the size of `App.tsx` without changing behavior.

## Suggested order

1. `items.ts`
2. `skills.ts`
3. `recipes.ts`
4. `shops.ts`
5. `enemies.ts`
6. `companions.ts`
7. `maps.ts`
8. `flags.ts`
9. `quests.ts`

## Destination

```text
src/data/
  items.ts
  skills.ts
  maps.ts
  quests.ts
  companions.ts
  recipes.ts
  shops.ts
  enemies.ts
  flags.ts
```

## Things to verify after each extraction

- inventory still loads
- shops still work
- equipment still grants skills
- combat still works
- maps still render
- quest journal still updates

---

# Phase 3 — Extract Pure Utilities

## Goal

Move logic that does not render UI.

## Suggested files

```text
src/utils/dice.ts
src/utils/stats.ts
src/utils/inventory.ts
src/utils/progression.ts
src/utils/save.ts
src/utils/battle.ts
src/utils/map.ts
src/utils/quests.ts
```

## Candidate functions

### `dice.ts`

- `resolveRoll`
- `resolveSkillCheck`
- `checkSummary`

### `stats.ts`

- `addBonuses`
- `getDerivedStats`
- `formatBonuses`

### `inventory.ts`

- `gainItem`
- `removeItem`
- `hasItem`
- equipment slot helpers
- battle pouch helpers

### `progression.ts`

- `getHeroXpTarget`
- companion XP target helpers
- level-up calculations

### `battle.ts`

- cooldown ticking
- enemy building
- skill damage calculation
- turn resolution helpers

### `map.ts`

- story tile overrides
- auto-inspection skip logic
- blocked tile checks

---

# Phase 4 — Extract Components

Only extract components after data and utilities are more stable.

## Suggested order

1. `DialogueModal.tsx`
2. `LevelUpModal.tsx`
3. `QuestJournal.tsx`
4. `InventoryView.tsx`
5. `BattleView.tsx`
6. `MapView.tsx`
7. `AdventureMenus.tsx`
8. `ShopModal.tsx`
9. `InteriorScene.tsx`
10. `SaveModal.tsx`

## Warning

Avoid creating a huge prop-drilling mess. If component props become painful, pause and decide whether to introduce a small context or reducer.

Do not add a global state library unless truly needed.

---

# Phase 5 — Add Tests

Add tests after relevant logic is extracted.

## Priority tests

### Progression

- hero level-up subtracts XP threshold
- XP rolls over
- level-up grants Max HP +4 and Current HP +4
- level-up does not full-heal

### Battle

- enemy winning initiative acts first
- enemy does not attack after reaching 0 HP
- battle pouch item advances the turn
- Roadwarden’s Resolve applies cooldown
- cooldown ticks down
- item-granted skills resolve

### Maps

- traveler disappears after going to camp
- Root Cellar sealed door requires Warden route
- spent cellar interactions do not auto-interrupt movement
- shrine thread appears only after shrine discovery

### Quests

- only current main objective is shown
- side quests stay hidden until discovered
- Chapter 1 banner changes after report-back

---

# Phase 6 — Art Integration

## Safe first integrations

1. Store selected art in `assets/reference/concept`.
2. Add asset references to docs.
3. Add character portrait fields to NPC data.
4. Display portrait images in dialogue with fallback emoji.
5. Add map background experiments behind the tile system.
6. Add custom painted item icon art with fallback emoji.

## Do not do yet

- Do not replace tile movement with freeform movement.
- Do not remove fallback emoji before assets are tested.
- Do not bake labels into map images.
- Do not build new UI around paper-doll equipment overlays.

---

# Phase 7 — Chapter 2 Completion

Chapter 2 implementation is already underway. Complete it before starting Chapter 3 code.

- Keep Mara as a non-combat guest, not a battle companion.
- Finish the Westroot Trail flow from briefing through the First Westroot Gate.
- Add clean and messy Three-Sign Hollow paths.
- Generate and integrate the Westroot Trail painted map.
- Add Chapter 2 rules and Playwright coverage.
- Preserve the Chapter 1 golden path.

---

# Phase 7.5 — Post-Chapter 2 Technical Hardening

After Chapter 2 ships, take one focused technical hardening pass before building Chapter 3 content.

Use `docs/post-chapter-2-technical-hardening.md` as the pickup plan. The priorities are:

- lock a Chapter 2 complete / Chapter 3 ready save fixture;
- extract stable Chapter 2 scene text from `App.tsx`;
- add a typed story flag contract;
- add save payload migrations;
- validate hand-authored map navigation graphs;
- add asset size/export discipline before Chapter 3 art grows;
- move built-in QA checks into reusable validators.

Keep this pass small and playable. It should reduce Chapter 3 risk, not become a full architecture rewrite.

---

# Phase 8 — Chapters 3-5 Vertical Slices

Each later chapter should land in this order:

1. Story module and quest copy.
2. Stable item/enemy/map data.
3. Placeholder playable map with tile/node movement.
4. Painted map art and projection tuning.
5. NPC/enemy/item artwork registries and production assets.
6. Automated golden-path and rules coverage.
7. Handoff update, commit, and push.

Target chapters:

- Chapter 3: The Hidden Root
- Chapter 4: The Riddle Road
- Chapter 5: Briarhold Waystation

---

# Phase 9 — Fully Illustrated Prototype Pass

Before treating Chapter 5 as done:

- All planned gameplay maps have painted backgrounds.
- Major NPC and enemy portraits/art are generated, inspected, and wired with fallbacks.
- Sixteen hero base variants exist: 8 races x Male/Female.
- Chapter 3-5 item icons are generated and registered.
- Large assets are reviewed for web build size and compressed where needed.
- Automated tests pass before user playthrough.
