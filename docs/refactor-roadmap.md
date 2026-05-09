# Liam’s Game — Refactor Roadmap

This roadmap describes how to move from the current single-file prototype to a maintainable game project without breaking Chapter 1.

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

1. Store selected art in `assets/concept`.
2. Add asset references to docs.
3. Add character portrait fields to NPC data.
4. Display portrait images in dialogue with fallback emoji.
5. Add map background experiments behind the tile system.

## Do not do yet

- Do not replace tile movement with freeform movement.
- Do not remove fallback emoji before assets are tested.
- Do not bake labels into map images.

---

# Phase 7 — Chapter 2 Readiness

Chapter 2 implementation should wait until:

- Chapter 1 is committed and runnable.
- Data extraction has started.
- Key docs are in repo.
- Basic tests exist for progression and battle.
- Map/art integration approach is chosen.
