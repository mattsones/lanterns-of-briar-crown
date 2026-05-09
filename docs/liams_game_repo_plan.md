# Liam’s Game — Repository Plan

This plan turns the current single-file prototype and Chapter 1 assets into a maintainable project without over-engineering too early.

## Goals

1. Preserve the current working prototype.
2. Keep Chapter 1 playable while gradually extracting data and components.
3. Organize story, art, prompts, and code so future chapters can grow cleanly.
4. Make it easy to run locally, test changes, and eventually publish a playable build.
5. Avoid a massive rewrite. Refactor in small safe steps.

---

# Recommended Tech Stack

## Frontend

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

This matches the current prototype shape well and keeps the build simple.

## State

Start with React state and localStorage/checkpoint logic. Do not add Redux/Zustand yet unless the app becomes painful to manage.

## Testing

Add lightweight tests once logic is extracted:

- **Vitest** for data/helpers
- Optional later: **Playwright** for golden-path browser tests

---

# Initial Repo Structure

```text
liams-game/
  README.md
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  public/
    favicon.svg
  src/
    main.tsx
    App.tsx
    styles.css
    data/
      items.ts
      skills.ts
      maps.ts
      quests.ts
      companions.ts
      recipes.ts
      shops.ts
      enemies.ts
      flags.ts
    story/
      dialogue.ts
      chapter1.ts
    components/
      AdventureMenus.tsx
      BattleView.tsx
      CharacterCreate.tsx
      DialogueModal.tsx
      InteriorScene.tsx
      InventoryView.tsx
      LevelUpModal.tsx
      MapView.tsx
      QuestJournal.tsx
      SaveModal.tsx
      ShopModal.tsx
      Toasts.tsx
    utils/
      dice.ts
      progression.ts
      save.ts
      stats.ts
      inventory.ts
      battle.ts
      map.ts
    types/
      game.ts
  assets/
    concept/
      environments/
      characters/
      key-art/
    portraits/
      characters/
    maps/
      hearthhollow/
      lantern-road/
      bramblecross/
      root-cellar/
    icons/
      items/
      skills/
      ui/
    source-prompts/
  docs/
    chapter-1-story-script.md
    art-direction.md
    repo-plan.md
    prompts/
      chapter-1-environments.md
      chapter-1-characters.md
      chapter-1-key-art.md
    playtest-notes/
      chapter-1-golden-path.md
  tests/
    data.test.ts
    progression.test.ts
    battle.test.ts
```

---

# Practical First Commit Structure

Do not split everything immediately. The safest first repo version should be:

```text
liams-game/
  README.md
  package.json
  index.html
  src/
    main.tsx
    App.tsx
    styles.css
  docs/
    chapter-1-story-script.md
    art-direction.md
    repo-plan.md
  assets/
    concept/
      environments/
      characters/
      key-art/
```

Then gradually extract code from `App.tsx`.

---

# Migration Strategy

## Phase 0 — Preserve the working prototype

**Goal:** Get the current prototype into git exactly as it works now.

1. Create Vite React TypeScript project.
2. Put the current working prototype into `src/App.tsx`.
3. Confirm it runs locally.
4. Commit as:

```bash
git add .
git commit -m "Add working Chapter 1 prototype"
```

This commit is the safety checkpoint.

---

## Phase 1 — Add documentation and art assets

**Goal:** Organize what we already have.

Add:

- Chapter 1 story script
- Art direction notes
- Prompt notes
- Selected generated concept art
- Repo plan

Suggested commit:

```bash
git add docs assets
git commit -m "Add Chapter 1 story and art direction docs"
```

---

## Phase 2 — Extract stable data first

Extract data that changes least often and has low risk:

1. `src/data/items.ts`
2. `src/data/skills.ts`
3. `src/data/recipes.ts`
4. `src/data/shops.ts`
5. `src/data/enemies.ts`
6. `src/data/companions.ts`
7. `src/data/maps.ts`
8. `src/data/flags.ts`

Each extraction should be small and tested manually after the change.

Suggested commits:

```bash
git commit -m "Extract item and skill data"
git commit -m "Extract map and encounter data"
git commit -m "Extract companion and shop data"
```

---

## Phase 3 — Extract utility logic

Move pure helper logic out of `App.tsx`:

- dice rolling
- skill checks
- stat calculations
- inventory helpers
- save/load helpers
- XP/level-up helpers
- battle helper functions
- map interaction helpers

Suggested files:

```text
src/utils/dice.ts
src/utils/stats.ts
src/utils/inventory.ts
src/utils/save.ts
src/utils/progression.ts
src/utils/battle.ts
src/utils/map.ts
```

Suggested commits:

```bash
git commit -m "Extract dice and stat helpers"
git commit -m "Extract inventory and progression helpers"
git commit -m "Extract save and battle helpers"
```

---

## Phase 4 — Extract UI components

Move UI sections into components only after data/helper extraction is stable.

Suggested extraction order:

1. `DialogueModal.tsx`
2. `QuestJournal.tsx`
3. `InventoryView.tsx`
4. `BattleView.tsx`
5. `MapView.tsx`
6. `AdventureMenus.tsx`
7. `ShopModal.tsx`
8. `InteriorScene.tsx`
9. `SaveModal.tsx`
10. `LevelUpModal.tsx`

Keep props simple at first. Do not introduce a global state framework unless necessary.

---

## Phase 5 — Add tests for pure logic

Once logic is extracted, add tests for:

- XP thresholds and level-up rollover
- trinket slot behavior
- battle item turn advancement
- Roadwarden’s Resolve cooldown
- item skill references resolving correctly
- story tile overrides
- quest visibility rules
- map gating rules

Example tests:

```text
progression.test.ts
- hero level-up subtracts threshold and rolls over XP
- level-up grants max HP +4 and current HP +4, not full heal

battle.test.ts
- using battle consumable advances turn
- Roadwarden’s Resolve creates 5-turn cooldown
- enemy does not attack after reaching 0 HP

map.test.ts
- Root Cellar sealed door requires Warden path
- traveler disappears from road after going to camp
- spent interaction tiles do not auto-interrupt movement
```

---

# Branching Plan

For now, keep it simple:

```text
main        stable playable prototype
feature/*   new feature branches
art/*       art integration branches
refactor/*  code organization branches
```

Examples:

```bash
git checkout -b feature/hero-level-up
git checkout -b art/hearthhollow-map
git checkout -b refactor/extract-items-skills
```

Do not maintain separate long-running branches yet. The project is too early for that overhead.

---

# Naming Conventions

## Code

- React components: `PascalCase.tsx`
- Data files: `lowercase.ts`
- Utilities: `lowercase.ts`
- Types: `game.ts`, `content.ts`, etc.

Examples:

```text
BattleView.tsx
DialogueModal.tsx
items.ts
skills.ts
progression.ts
```

## Assets

Use descriptive kebab-case filenames.

```text
assets/concept/key-art/chapter-1-lantern-road-key-art-v01.png
assets/concept/environments/hearthhollow-map-concept-v03.png
assets/concept/environments/lantern-road-map-concept-v01.png
assets/concept/environments/bramblecross-town-concept-v01.png
assets/concept/environments/root-cellar-map-concept-v01.png
assets/concept/characters/mira-portrait-v01.png
assets/concept/characters/enna-portrait-v02.png
assets/concept/characters/hollis-portrait-v01.png
assets/concept/characters/nix-portrait-v01.png
assets/concept/characters/pibble-portrait-v01.png
assets/concept/characters/rowan-portrait-v02.png
assets/concept/characters/tilda-portrait-v01.png
assets/concept/characters/moss-portrait-v01.png
```

When an image is selected as a current keeper, copy it later into a production-oriented folder:

```text
assets/portraits/characters/mira.png
assets/maps/hearthhollow/hearthhollow-map.png
```

Keep concept versions so we can revisit earlier iterations.

---

# Art Asset Plan

## Current selected concept art

### Key art

- Chapter 1 / Lantern Road key art

### Environments

- Hearthhollow gameplay-map concept
- Lantern Road gameplay-map concept
- Bramblecross town concept
- Root Cellar concept

### Character portraits

- Elder Mira
- Enna
- Captain Hollis
- Nix Fernwhistle
- Pibble Thatch
- Rowan Reedshield
- Tilda Quickstep
- Moss Fenmere

## Next likely character assets

- Ada Willowmarket
- Smith Orin
- Mayor Anwen
- Nella the Baker
- Toma Fielding
- Miri of the Loom
- Bramble Boar
- Thorncoat Ruffian
- Thorny Hound
- Rustroot Skulk
- Briar Knot Warden

---

# How Art Should Integrate with Gameplay

## Short-term

Use the generated art as:

- concept references
- splash images
- dialogue portraits
- map background references

Keep current tile/emoji system until map art is sliced or overlaid intentionally.

## Medium-term

Move toward illustrated maps with invisible tile movement:

- Background image is the painted map.
- Movement remains grid-based under the hood.
- Interactable tiles render subtle UI markers above the background.
- Player marker moves cell-to-cell over the image.

This preserves predictable gameplay while making the world feel hand-painted.

## Long-term

Replace emoji icons with:

- painted item icons
- skill icons
- character portraits
- map interactable markers
- parchment-style UI panels

---

# README Draft

```markdown
# Liam’s Game

A storybook fantasy adventure prototype about Hearthhollow, Lantern Road, Bramblecross, and the mystery of the Briar Crown.

## Current Status

Chapter 1 is playable as a single-file React prototype. The game includes:

- character creation
- tile-based exploration
- dialogue and quest flow
- turn-based combat
- companions
- inventory, equipment, and battle pouch
- hero XP and level-up choices
- Chapter 1 story arc through the Root Cellar and report-back scene

## Run Locally

```bash
npm install
npm run dev
```

## Project Structure

- `src/App.tsx` — current working prototype
- `docs/` — story, art direction, repo plan, prompts
- `assets/` — concept art and future production assets

## Development Notes

The first priority is preserving a working Chapter 1 prototype. Refactors should be small and tested manually after each change.
```

---

# Suggested package.json

```json
{
  "name": "liams-game",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwindcss": "latest",
    "@tailwindcss/vite": "latest",
    "lucide-react": "latest",
    "framer-motion": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "eslint": "latest"
  }
}
```

---

# Immediate Next Steps

1. Create a local project folder named `liams-game`.
2. Initialize Vite React TypeScript.
3. Paste the current working prototype into `src/App.tsx`.
4. Add the Chapter 1 story script to `docs/chapter-1-story-script.md`.
5. Add this repo plan to `docs/repo-plan.md`.
6. Add selected concept art to `assets/concept/`.
7. Commit the working baseline.
8. Only then begin extraction/refactoring.

---

# Refactor Safety Rules

1. Never refactor and redesign gameplay in the same commit.
2. Keep the game playable after every commit.
3. Extract data before extracting components.
4. Extract pure helper functions before extracting complex UI.
5. Add tests only after the relevant logic is cleanly extracted.
6. Keep the single-file prototype commit available as a known-good fallback.

---

# Definition of “Ready for Chapter 2 Development”

Before starting Chapter 2 in earnest, we should have:

- working local repo
- Chapter 1 code committed
- story script committed
- art direction committed
- selected Chapter 1 concept art organized
- data extraction started or planned
- at least minimal tests for progression and battle helpers
- README explaining how to run the prototype

Chapter 2 can be outlined before this, but heavy implementation should wait until the project is safely organized.

