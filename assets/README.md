# Assets

This folder is split by runtime intent:

- `maps/`, `portraits/`, `scenes/`, and `icons/` contain shipped game assets imported by `src/`.
- `reference/` contains source art, concept art, alternates, and archived proof work that should not be imported by the game.

Use `npm.cmd run audit:assets` to inspect shipped asset sizes.

Use `npm.cmd run optimize:assets` after adding a production art batch. The optimizer keeps full-size originals in `assets/reference/source-art/`, moves non-imported production-folder images to `assets/reference/alternates/`, and leaves optimized runtime assets in the shipped folders.

Keep emoji/text fallbacks in code even when an asset is available.
