# Codex Bootstrap Prompt

Paste this into Codex after opening the repo folder.

```text
You are helping me create the initial repository for Liam’s Game, a storybook fantasy React/TypeScript prototype.

Please read these docs first:
- docs/codex-handoff.md
- docs/liams_game_repo_plan.md
- docs/liams_game_chapter_1_story_script.md
- docs/liams-game-art-direction.md
- docs/refactor-roadmap.md
- docs/asset-manifest.md

The current working prototype is in:
- liams_game_prototype.jsx

Goal:
Create the initial Vite + React + TypeScript project structure described in the repo plan while preserving the working prototype.

Important constraints:
1. Preserve the current working prototype as `src/App.tsx` first.
2. Do not over-refactor yet.
3. Add only the minimal project scaffolding needed to run locally.
4. Create or update:
   - package.json
   - index.html
   - src/main.tsx
   - src/App.tsx
   - src/styles.css
   - README.md
5. Add placeholder folders for:
   - assets/concept/key-art/
   - assets/concept/environments/
   - assets/concept/characters/
   - assets/maps/
   - assets/portraits/
   - assets/icons/
   - docs/prompts/
   - docs/playtest-notes/
6. Include a README section explaining how to run:
   - npm install
   - npm run dev
7. Do not split App.tsx into components yet unless absolutely necessary to make it run.
8. After scaffolding, run the install/build checks available in this environment and fix any errors.
9. Commit-ready output matters more than clever architecture.

If anything in the repo plan conflicts with preserving the currently working prototype, preserve the working prototype first and note the conflict.
```
