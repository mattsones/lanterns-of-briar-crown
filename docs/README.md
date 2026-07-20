# Liam's Game Documentation

The documentation is grouped by purpose. `codex-handoff.md` stays at the root because it is the active chronological implementation handoff.

## Start Here

1. [`codex-handoff.md`](codex-handoff.md) — full implementation history and latest handoff.
2. [`playtest-notes/2026-07-17-current-status.md`](playtest-notes/2026-07-17-current-status.md) — concise current-state pickup.
3. [`story/`](story/) — canonical chapter scripts and the Chapters 2–5 story bible.
4. [`planning/`](planning/) — repository, refactor, UX, and chapter implementation plans.
5. [`art/`](art/) — art direction, the asset manifest, production prompts, and art pipeline notes.
6. [`playtest-notes/`](playtest-notes/) — golden paths, dated playtest handoffs, and navigation notes.

## Folder Layout

```text
docs/
  README.md
  codex-handoff.md
  art/
    art-direction.md
    asset-manifest.md
    prompts/
    item-icons/
    player-character/
    archive/
  planning/
    archive/
  playtest-notes/
  story/
    archive/
```

## Canonical Story Documents

- [`story/chapter-1-story-script.md`](story/chapter-1-story-script.md)
- [`story/chapter-2-story-script.md`](story/chapter-2-story-script.md) — the updated integrated Chapter 2 draft
- [`story/chapter-3-story-script.md`](story/chapter-3-story-script.md)
- [`story/chapters-2-5-story-bible.md`](story/chapters-2-5-story-bible.md)

The earlier Chapter 2 draft is retained in [`story/archive/`](story/archive/) for history. It should not be used as the current implementation source.

## Filing Rules

- Put chapter manuscripts and story bibles in `story/`.
- Put implementation proposals, roadmaps, and design decisions in `planning/`.
- Put visual direction, asset tracking, and generation prompts in `art/`.
- Put test routes and dated QA notes in `playtest-notes/`.
- Use kebab-case filenames for new docs.
- Move superseded material into the nearest `archive/` folder instead of leaving ambiguous duplicates at the root.

Repository automation belongs in the top-level [`scripts/`](../scripts/) folder, which is separate from the story scripts collected here.
