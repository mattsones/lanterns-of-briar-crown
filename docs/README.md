# Liam's Game Documentation

The documentation is grouped by purpose. `codex-handoff.md` stays at the root because it is the active chronological implementation handoff.

## Start Here

1. [`playtest-notes/2026-07-17-current-status.md`](playtest-notes/2026-07-17-current-status.md) — concise current-state pickup; the filename is historical, but the document title and contents carry the current update date.
2. [`planning/chapter-4-development-process.md`](planning/chapter-4-development-process.md) — Chapter 2-3 retrospective, Chapter 4 gates, execution phases, and tooling backlog.
3. [`codex-handoff.md`](codex-handoff.md) — chronological implementation history and latest handoff.
4. [`story/`](story/) — canonical chapter scripts and the Chapters 2–5 story bible.
5. [`planning/`](planning/) — repository, refactor, UX, and chapter implementation plans.
6. [`art/`](art/) — art direction, the asset manifest, production prompts, and art pipeline notes.
7. [`playtest-notes/`](playtest-notes/) — golden paths, dated playtest handoffs, and navigation notes.

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

## Chapter 3 Story-Clarity Package

These documents define the implemented Chapter 3 story foundation and its pending human validation:

- [`story/chapter-3-story-clarity-audit.md`](story/chapter-3-story-clarity-audit.md) — historical diagnosis and immediate human-validation handoff.
- [`story/chapter-3-story-truth.md`](story/chapter-3-story-truth.md) — implemented one-page factual foundation.
- [`story/chapter-3-route-diagram.md`](story/chapter-3-route-diagram.md) — physical route and boundary model.
- [`story/chapter-3-three-day-timeline.md`](story/chapter-3-three-day-timeline.md) — causal chronology.
- [`story/chapter-3-player-knowledge-contract.md`](story/chapter-3-player-knowledge-contract.md) — implemented scene-by-scene acceptance contract and seven-question human check.

## Realm Worldbuilding Workshop

- [`story/realm-history-and-government-workshop.md`](story/realm-history-and-government-workshop.md) — non-canonical nested political chassis, two-hundred-year history spine, ten historical modules, neighboring powers, ancestry relations, non-cosmic Lantern Road direction, and Briar Crown political model.
- [`story/historical-backdrop-integration-audit.md`](story/historical-backdrop-integration-audit.md) — chapter-by-chapter revision brief for integrating that foundation into the playable story and Chapters 4–5 without lore dumps.

## Political World Map

- [`art/prompts/great-survey-world-map.md`](art/prompts/great-survey-world-map.md) — selected Great Survey map, its in-world date and Westroot correction logic, geographic reading, reusable generation prompt, and correction prompt.

## Active Planning Documents

- [`planning/refactor-roadmap.md`](planning/refactor-roadmap.md) — staged architecture and chapter roadmap.
- [`planning/chapter-4-development-process.md`](planning/chapter-4-development-process.md) — approved process for closing Chapter 3 and building Chapter 4.
- [`planning/gameplay-ux-redesign-plan.md`](planning/gameplay-ux-redesign-plan.md) — implemented map-first and responsive-shell decisions.

`planning/post-chapter-2-technical-hardening.md` is a completed historical plan. Its shipped practices remain active, but it is not the current pickup document.

## Filing Rules

- Put chapter manuscripts and story bibles in `story/`.
- Put implementation proposals, roadmaps, and design decisions in `planning/`.
- Put visual direction, asset tracking, and generation prompts in `art/`.
- Put test routes and dated QA notes in `playtest-notes/`.
- Use kebab-case filenames for new docs.
- Move superseded material into the nearest `archive/` folder instead of leaving ambiguous duplicates at the root.

Repository automation belongs in the top-level [`scripts/`](../scripts/) folder, which is separate from the story scripts collected here.
