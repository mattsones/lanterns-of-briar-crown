# Chapter 4 Development Process

Last updated: 2026-07-21

Status: approved process plan; execute after Chapter 3 human signoff

This document turns the Chapter 2 and Chapter 3 development retrospective into the working process for Chapter 4, **The Riddle Road**. It complements the Chapter 4 story direction in `docs/story/chapters-2-5-story-bible.md`; it does not replace the future Chapter 4 story script or vertical-slice contract.

## Outcome

Build Chapter 4 as a tested, save-compatible, illustrated vertical slice while discovering interaction, state, map, and presentation problems earlier than we did in Chapters 2 and 3.

The process should preserve the working Chapters 1-3 baseline, keep changes reviewable, and avoid placing another chapter's full behavior directly into `src/App.tsx`.

## Retrospective Summary

### Evidence snapshot

- Chapter 2 implementation ran for 17 commits from initiation through the wrapped prototype, with approximately 8,272 inserted lines and 426 removed lines. During that span, `src/App.tsx` grew from about 3,300 to 5,465 lines and the dedicated Chapter 2 browser suite grew from nothing to more than 500 lines.
- The three-commit post-Chapter 2 hardening pass briefly reduced `src/App.tsx` to about 5,333 lines while adding the ready fixture, story extraction, typed flags, migrations, validators, QA helpers, and the optimized asset workflow.
- Chapter 3 and its cross-chapter playtest polish added 16 commits after the stable pre-Chapter 3 baseline. `src/App.tsx` is now approximately 7,200 lines, while the Chapter 3 browser suite has grown to 10 focused tests and roughly 600 lines.
- The synced Chapter 3 branch currently passes 103 automated tests across rules, Chapters 1-3, and smoke. The full local `verify` command takes approximately 399 seconds, which supports separate fast, affected-chapter, and full verification tiers.

### What Chapter 2 taught us

Chapter 2 proved that a detailed story manuscript does not by itself validate an interactive puzzle. The Three-Sign Hollow evolved from a simpler No-Handle puzzle into a door-first repair loop, a three-door hub, a Roadwatcher consequence system, and finally the Crown Door Den. Each iteration improved the chapter, but late interaction redesign required coordinated changes to prose, flags, quests, callbacks, maps, saves, art, and tests.

The main Chapter 2 lesson is:

> Prototype the central interaction before committing the surrounding chapter structure and production art.

Practices worth preserving:

- fail-forward paths with meaningful clean, standard, and messy consequences;
- Mara's explicit non-combat guest contract;
- painted art layered over tile or graph movement rather than replacing it;
- user saves and reported bugs converted into regression coverage;
- stable story copy extracted from imperative callbacks;
- fallback-safe artwork registries.

### What Chapter 3 taught us

The post-Chapter 2 hardening pass paid off. The Chapter 2-complete fixture, typed flags, save migrations, map validators, asset pipeline, and reusable QA checks made it much safer to start Chapter 3 with a placeholder Westroot hub before final art.

The later Chapter 3 work exposed a different gap: a route can be technically complete while still having problems with knowledge order, repeat conversations, one-time actions, navigation clarity, pacing, endpoint communication, consequences, or responsive illustration layout.

The main Chapter 3 lesson is:

> "Can complete" and "understands, flows, and feels right" are separate milestones.

Human playtesting found issues that the first automated golden path could not judge:

- mandatory introductions and prerequisite knowledge;
- questions disappearing too early or converged speeches repeating;
- the Hold Bell interrupting unfinished conversations;
- insufficient faction tension before the investigation;
- map geometry and directional controls that did not match painted paths;
- the Chapter 3 endpoint reading like a broken objective;
- story evidence that needed a mechanical consequence;
- dialogue art obscuring required copy or actions at practical viewport sizes.

### Current structural signals

- `src/App.tsx` is approximately 7,200 lines and remains the center of imperative game flow.
- The typed `GameFlags` contract now contains more than 200 fields. Typing prevents misspellings, but a flat collection is not enough to explain state transitions.
- Browser coverage is strong but the full local `verify` run takes about six and a half minutes.
- Tests repeat checkpoint construction, storage loading, movement, and dialogue-navigation helpers.
- Many browser paths navigate through exact story copy, so prose polish causes avoidable test churn.
- GitHub Actions currently omits the Chapter 3 Playwright suite even though local `verify` includes it.
- The asset audit reports over-budget files but does not fail CI.
- There is no canonical Chapter 3-complete / Chapter 4-ready fixture yet.

These are Chapter 4 process inputs, not reasons for a broad rewrite.

## Chapter 4 Risk Focus

The Chapter 4 story bible identifies the Folded Map as the central puzzle, followed by the Underway, Listening Mile, captive porter thread, Lio's message, and Briar Relay Post.

The highest-risk elements are:

1. **Folded Map interaction** — the simple implementation must feel like interpretation rather than an arbitrary answer button.
2. **Listening Mile responses** — multiple answer categories need defined consequences without producing an unmanageable branch tree.
3. **Map topology** — the planned locations may need one connected graph or several focused maps; decide through graybox testing rather than art constraints.
4. **Knowledge order** — Edden's clues, the porter's testimony, Lio's message, and the Briarhold reveal must unlock in a comprehensible sequence.
5. **Mara's emotional state** — her shift from urgency to "follow clever" needs persistent consequences without consuming choices prematurely.
6. **Chapter boundary** — the player must understand exactly what was learned, what remains optional, and why Chapter 5 is the next destination.

## Milestone Vocabulary

Use precise milestone names instead of an unqualified "complete":

- **Graybox playable** — the central interaction works with placeholder content.
- **Critical path complete** — entry-to-ending progression works with fallbacks.
- **Content complete** — intended scenes, choices, consequences, and optional threads exist.
- **Illustrated** — selected production art is integrated and fallback-safe.
- **Human-QA complete** — desktop, phone, and uninterrupted playthrough gates pass.
- **Release candidate** — the full automated gate is green and remaining issues are explicitly deferred.

Only the release-candidate milestone should be described as Chapter 4 complete.

## Phase 0 — Close Chapter 3 Deliberately

Do not start Chapter 4 implementation until these gates are resolved:

- [ ] Human-play Chapter 3 end to end at desktop width.
- [ ] Human-play Chapter 3 at approximately 430x932.
- [ ] Run one uninterrupted Chapters 1-3 session with the map-first shell.
- [ ] Replace `witness-stones-public-renewal-scene-v02.webp` with a public-renewal illustration that visibly includes Bramwell and Noma opening the hold, Quill recording the order, and neighbors taking responsibility at the four stones; preserve the four established symbols and fallback-safe scene wiring.
- [ ] Decide which remaining Chapter 3 findings block a release candidate.
- [ ] Create a canonical `public/saves/chapter-3-complete.json` fixture.
- [ ] Verify that the fixture satisfies every Chapter 4 entry requirement.
- [ ] Integrate the Chapter 3 branch into the agreed stable branch.
- [ ] Mark a Chapter 3 release-candidate commit or tag.

The ready fixture should represent the required Chapter 3 ending without relying on the user-provided endpoint save or leaving its optional Rootbread state ambiguous. If optional completion materially affects Chapter 4, keep a second focused fixture rather than overloading the canonical one.

## Phase 1 — Define The Executable Chapter Contract

Create a Chapter 4 vertical-slice contract before implementing scenes. It should declare:

- chapter promise and non-goals;
- entry requirements and checked-in starting fixture;
- critical path and optional porter path;
- map regions and required landmarks;
- required items, enemies, and fallback art;
- Folded Map success, mistake, and deeper-solve outcomes;
- Listening Mile response categories and fail-forward effects;
- required chapter-end flags;
- save migration expectations;
- Chapter 5 handoff and explicit playable endpoint.

### Interaction state matrix

For every consequential scene or action, answer these before coding:

| Concern | Required decision |
| --- | --- |
| Knowledge | What has the player actually been told, and by whom? |
| Availability | Which prerequisites expose each choice? |
| Attempt | Is the first attempt remembered independently of success? |
| Result | What exact clean, standard, or messy result occurred? |
| Later resolution | Can a clue found later resolve an earlier attempt? |
| Repeat visit | What remains reviewable and what must disappear? |
| Backtracking | Which map node or dialogue surface does Back return to? |
| Companion | What changes when the companion is absent or downed? |
| Failure | What consequence changes while the critical path remains open? |
| Save compatibility | What can migration infer for older or partial saves? |

The default interaction rule is to persist attempt, result, and later resolution separately whenever they can diverge.

## Phase 2 — Spike The Folded Map

Build the smallest possible functional version before the full chapter:

1. Use placeholder symbols and copy.
2. Let the player connect the intended lantern marks.
3. Include the tempting crown-marked shortcut.
4. Define one fail-forward mistake consequence.
5. Define the optional deeper alignment reward.
6. Preserve Back, repeat, and review behavior.
7. Human-test whether the interaction communicates folding or alignment without an explicit checklist.

Do not generate final Wrong Map Room or Folded Map art until this spike is accepted.

## Phase 3 — Add A Chapter-Specific Logic Seam

Create small, reviewable modules rather than a general dialogue-engine rewrite:

- `src/story/chapter4.ts` for stable copy, scene metadata, and the chapter contract;
- `src/game/chapter4.ts` for pure prerequisites, transition helpers, puzzle outcomes, and recap derivation.

Keep rendering and high-level orchestration in `src/App.tsx` initially. Move Chapter 4 business rules into pure functions so they can be tested without navigating the browser.

Chapter 4 flags may remain flat for save compatibility, but they should be declared together, defaulted together, migrated deliberately, and mutated through named helpers where practical.

## Phase 4 — Build The Graybox Critical Path

Implement with placeholder maps, tokens, portraits, and icons:

1. Enter from the Chapter 3-complete fixture.
2. Pass the Westroot Lower Gate.
3. Resolve the Folded Map.
4. Traverse the Underway.
5. Answer the Listening Mile.
6. Find the captive porter or preserve that route as optional.
7. Discover Lio's message.
8. Clear the Briar Relay Post encounter.
9. Reveal Briarhold Waystation and set the Chapter 5 handoff.

Required automated coverage at this milestone:

- one real-fixture critical path;
- one Folded Map mistake path;
- one Listening Mile fail-forward path;
- one entry/migration boundary;
- one absent or downed companion boundary;
- pure chapter-contract and transition tests;
- all earlier chapter gates still green.

Human-play the unillustrated route before production art begins.

## Phase 5 — Integrate Map And Production Art

Use the existing source-art / alternate / runtime workflow:

1. Decide map topology from the graybox route.
2. Write prompts that explicitly preserve path readability and overlay-safe space.
3. Keep raw generations under `assets/reference/`.
4. Promote only selected runtime candidates.
5. Run `optimize:assets` and `audit:assets`.
6. Tune node anchors with Map Debug on and off.
7. Capture desktop and phone visual checks.
8. Preserve emoji, text, portrait, and token fallbacks until in-game QA passes.

If one connected Underway map cannot make all planned locations readable, prefer several focused graph maps over forcing navigation through unsuitable art.

## Phase 6 — Content, Consequence, And Human QA

Before the release candidate:

- [ ] Audit every dialogue for prerequisite knowledge and name/term introduction.
- [ ] Verify unanswered questions remain available.
- [ ] Verify converged speeches and rewards do not repeat.
- [ ] Verify first, repeat, completed, and review states.
- [ ] Verify Back and Close return to the correct place.
- [ ] Verify optional content does not make the endpoint look broken.
- [ ] Verify every major investigation choice has a visible consequence or recap entry.
- [ ] Play desktop and phone widths.
- [ ] Run an uninterrupted Chapters 1-4 session.
- [ ] Run the full automated gate.

## Tooling Backlog

### Priority 0 — Before Chapter 4 content

- [ ] Add the canonical Chapter 3-complete / Chapter 4-ready fixture.
- [ ] Add Chapter 3 to GitHub Actions; add Chapter 4 when its suite exists.
- [ ] Split local verification into fast, affected-chapter, and full gates.
- [ ] Add a reusable Playwright fixture helper for checkpoint construction and loading.
- [ ] Add stable `sceneId` and `choiceId` test hooks so navigation tests do not depend on final prose.

Suggested verification tiers:

- `verify:fast` — build, pure rules, contracts, fixtures, and lightweight asset checks;
- `verify:chapter4` — fast checks plus the Chapter 4 browser suite;
- `verify:full` — all chapter suites, smoke, and enforced asset budgets.

### Priority 1 — During the vertical slice

- [ ] Add a chapter-contract validator for flags, defaults, fixtures, maps, items, enemies, and fallback art.
- [ ] Add `audit:assets --fail-over-target` for CI.
- [ ] Add `optimize:assets --dry-run` before the optimizer moves files or rewrites imports.
- [ ] Extract shared movement and graph-route helpers from chapter tests.
- [ ] Add a Map Debug capture script for normal/debug desktop and phone screenshots.
- [ ] Add a key-scene viewport capture runner for 1280x720, 430x932, and 390x844.

### Priority 2 — Focused follow-ups

- [ ] Add a documentation health check for broken links, stale status text, test-command lists, and CI chapter coverage.
- [ ] Consider an affected-suite selector for local work; shared systems must still run the full gate.
- [ ] Address main-bundle code splitting as a dedicated performance slice.
- [ ] Continue staged `App.tsx` extraction without combining it with new story behavior.

## Documentation Rules

- Keep `docs/playtest-notes/2026-07-17-current-status.md` concise and current even though its historical filename remains stable.
- Keep `docs/codex-handoff.md` chronological, but add only a short result and link when a dedicated plan or decision document already owns the detail.
- Update README status and verification commands whenever a chapter becomes playable.
- Archive superseded plans or mark them explicitly completed; do not leave historical risks presented as current truth.
- Record each human playtest as decisions, remaining questions, and reproducible regressions rather than a transcript.

## Scope Guardrails

Do not use Chapter 4 as a reason to:

- introduce a global state library;
- rewrite all of `App.tsx`;
- build a universal dialogue graph engine;
- replace tile or graph movement with freeform movement;
- remove fallback artwork;
- generate the full art batch before topology and interactions are validated;
- combine a major structural refactor with new chapter behavior.

## Definition Of Ready To Start Chapter 4

Chapter 4 implementation is ready to begin when:

- Chapter 3 human signoff is recorded;
- the stable Chapter 3 milestone is integrated;
- a Chapter 4-ready fixture exists and passes contract validation;
- the Folded Map spike has an agreed interaction direction;
- the Chapter 4 entry, end, interaction-state, and map contracts are documented;
- the fast verification gate is green.

## Definition Of Chapter 4 Release Candidate

Chapter 4 reaches release-candidate status when:

- the real ready fixture completes the critical path;
- clean and fail-forward puzzle outcomes are tested;
- optional content and the playable endpoint are clear;
- maps pass graph validation and visual alignment checks;
- production art is optimized, audited, and fallback-safe;
- desktop, phone, and uninterrupted human playtests are recorded;
- Chapters 1-4 and smoke pass in CI and locally;
- remaining work is explicitly deferred rather than hidden behind the word "complete."
