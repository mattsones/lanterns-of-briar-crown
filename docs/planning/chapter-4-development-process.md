# Chapter 4 Development Process

Last updated: 2026-09-04

Status: complete; Chapter 4 release candidate accepted after the uninterrupted Chapters 1–4 owner playthrough

The completed-process assessment and Chapter 5 recommendations are recorded in `docs/playtest-notes/2026-09-04-chapter-4-completion-retrospective.md`.

This document turns the Chapter 2 and Chapter 3 development retrospective into the working process for Chapter 4, **The Riddle Road**. It complements the Chapter 4 story direction in `docs/story/chapters-2-5-story-bible.md`; it does not replace the future Chapter 4 story script or vertical-slice contract.

## Outcome

Build Chapter 4 as a tested, save-compatible, illustrated vertical slice while discovering interaction, state, map, and presentation problems earlier than we did in Chapters 2 and 3.

The process should preserve the working Chapters 1-3 baseline, keep changes reviewable, and avoid placing another chapter's full behavior directly into `src/App.tsx`.

## Retrospective Summary

### Evidence snapshot

- Chapter 2 implementation ran for 17 commits from initiation through the wrapped prototype, with approximately 8,272 inserted lines and 426 removed lines. During that span, `src/App.tsx` grew from about 3,300 to 5,465 lines and the dedicated Chapter 2 browser suite grew from nothing to more than 500 lines.
- The three-commit post-Chapter 2 hardening pass briefly reduced `src/App.tsx` to about 5,333 lines while adding the ready fixture, story extraction, typed flags, migrations, validators, QA helpers, and the optimized asset workflow.
- Chapter 3 and its cross-chapter playtest polish added 16 commits after the stable pre-Chapter 3 baseline. `src/App.tsx` is now approximately 7,200 lines, while the Chapter 3 browser suite has grown to 10 focused tests and roughly 600 lines.
- The Chapter 3 release-candidate branch passes 107 automated tests across rules, Chapters 1-3, and smoke. The 2026-08-02 full local `verify` run took 430 seconds, which supports separate fast, affected-chapter, and full verification tiers.
- The Chapter 4 pre-production pass raises the complete local gate to 114 checks: 38 rules tests, 75 chapter browser tests across Chapters 1-4, and one smoke test. `verify:full` passed on 2026-08-02 in 388 seconds; the Folded Map UI builds as a separate lazy-loaded chunk.

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
- GitHub Actions includes the Chapter 3 Playwright suite.
- The asset audit reports over-budget files but does not fail CI.
- The canonical Chapter 3-complete / Chapter 4-ready fixture is checked in and validated by the rules suite.

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

- [x] Human-play Chapter 3 end to end; owner signoff recorded on 2026-08-02. Prior automated browser QA covered desktop and phone widths, and no separate second human viewport pass is required for this release candidate.
- [ ] Run one uninterrupted Chapters 1-3 session with the map-first shell. **Deferred by owner to the Chapter 4 release-candidate cycle; not a Chapter 3 blocker.**
- [x] Replace `witness-stones-public-renewal-scene-v02.webp` with the selected v03 public-renewal illustration showing Bramwell and Noma opening the hold, Quill recording the order, and neighbors taking responsibility at the four stones while preserving the established symbols and fallback-safe wiring.
- [x] Decide which remaining Chapter 3 findings block a release candidate: none. Cross-chapter endurance testing is deferred as noted above.
- [x] Create a canonical `public/saves/chapter-3-complete.json` fixture.
- [x] Verify that the fixture satisfies every Chapter 4 entry requirement, both with canonical Rootbread completion and with all optional Rootbread state removed.
- [x] Integrate the Chapter 3 branch into the agreed stable branch (`main`, 2026-08-02).
- [x] Mark the Chapter 3 release candidate with tag `chapter-3-rc.2` (`rc.1` exposed and preceded the CI lockfile repair).

The ready fixture represents the required Chapter 3 ending without relying on the user-provided endpoint save. Canonically, the Rootbread Promise is complete and its wearable charm is owned but not auto-equipped. The executable validator deliberately removes all Rootbread state and still accepts the save as Chapter 4 ready; only optional recognition or bonuses may depend on that side thread.

## Phase 1 — Define The Executable Chapter Contract

Implementation status: complete in `docs/story/chapter-4-vertical-slice-contract.md`, `src/story/chapter4.ts`, and `src/game/chapter4.ts`. The captive porter and gatewright purchase are explicitly optional; gatewright access is required.

Create a Chapter 4 vertical-slice contract before implementing scenes. It should declare:

- chapter promise and non-goals;
- entry requirements and checked-in starting fixture;
- early access to a Westroot smith/gatewright or equivalent new-weapon path before the Underway, without requiring a return to Hearthhollow or adding weapon durability;
- critical path and optional porter path;
- map regions and required landmarks;
- required items, enemies, and fallback art;
- Folded Map success and fail-forward mistake outcomes;
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

Implementation status: the first answer-card graybox was rejected because it neither felt like folding nor supported real deduction. The second cross-wing graybox improved manipulation but was rejected because four binary flaps still made the solution an elimination exercise, the transparent layers felt unlike paper, and the silhouette did not feel like one map. The accepted interaction now appears in-story at the Survey Station reached through **Begin Chapter 4 Playtest**: one opaque rectangular sheet with distinct front and back faces, four draggable edges, three landing depths per edge, 54 two-edge configurations, an evidence-backed Old Keeper Road construction, a persuasive false Survey Shortcut, and many ordinary wrong constructions. The owner accepted this interaction direction on 2026-08-02. Acceptance follow-up added unmistakable result stamps for every traced outcome and clearer matching marks for discovering the straight Survey Shortcut. On 2026-08-20 the owner retired the unrelated optional third-fold Lanternwell cache idea while preserving the complete two-fold puzzle, then separated the false Survey Shortcut from the later physical construction detour. Drag, clean, fail-forward, ordinary-failure, repeat, Back, desktop, and phone behavior are automated.

Build the smallest possible functional version before the full chapter:

1. Use schematic vector ink and paper textures rather than production art.
2. Let the player physically drag any sheet edge to a quarter, half, or three-quarter landing; clicking the map surface must not choose an answer.
3. Provide multiple fold configurations: one persuasive false revision, many ordinary wrong constructions, and one true two-fold route.
4. Make the correct configuration align several visible facts at once instead of exposing an answer color.
5. Keep experimentation safe; apply the fail-forward consequence only when the persuasive false route is deliberately traced.
6. Keep the interaction at a maximum of two active folds; the required route solve is the complete puzzle.
7. Preserve Back, repeat, keyboard, and review behavior.
8. Human-test whether manipulation reads as folding and whether the solution reads as deduction rather than elimination.

This gate is closed. The accepted interaction now appears at an abandoned Survey Station below the Lower Gate; its in-world setup is documented in the vertical-slice contract.

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
3. Descend to the unmanned Survey Station and resolve the Folded Map with Lio's twice-folded clue and the physical shutter marks.
4. Cross Rootwater Bridge as a linear route-confirmation beat.
5. Traverse the later Underway approach and construction detour decision.
6. Answer the Listening Mile.
7. Find the captive porter or preserve that route as optional.
8. Discover Lio's message.
9. Clear the Briar Relay Post encounter.
10. Reveal Briarhold Waystation and set the Chapter 5 handoff.

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

- [x] Audit every dialogue for prerequisite knowledge and name/term introduction.
- [x] Verify unanswered questions remain available.
- [x] Verify converged speeches and rewards do not repeat.
- [x] Verify first, repeat, completed, and review states.
- [x] Verify Back and Close return to the correct place.
- [x] Verify optional content does not make the endpoint look broken.
- [x] Verify every major investigation choice has a visible consequence or recap entry.
- [x] Play desktop and phone widths.
- [x] Run an uninterrupted Chapters 1-4 session. **Owner-completed on 2026-09-04.**
- [x] Run the full automated gate. **Release-candidate gate completed on 2026-09-04.**

## Tooling Backlog

### Priority 0 — Before Chapter 4 content

- [x] Add the canonical Chapter 3-complete / Chapter 4-ready fixture.
- [x] Add Chapter 3 to GitHub Actions; add Chapter 4 when its suite exists.
- [x] Split local verification into fast, affected-chapter, and full gates.
- [x] Add a reusable Playwright fixture helper for checkpoint construction and loading.
- [x] Add stable `sceneId` and `choiceId` test hooks so navigation tests do not depend on final prose.

Suggested verification tiers:

- `verify:fast` — build, pure rules, contracts, fixtures, and lightweight asset checks;
- `verify:chapter4` — fast checks plus the Chapter 4 browser suite;
- `verify:full` — all chapter suites and smoke, with the current report-only asset audit included through the fast gate.

Implemented command names are `verify:fast`, `verify:chapter4`, and `verify:full`; `verify` remains an alias for the full gate. Asset auditing remains report-only until the separate enforced-budget task lands.

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

Current status: every item above is complete, including owner agreement on the Folded Map interaction direction. The executable contract is `docs/story/chapter-4-vertical-slice-contract.md`; the fast and Chapter 4 affected gates are the normal implementation checks, while the full gate remains reserved for release-candidate and handoff milestones.

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

Current status: complete. The owner accepted the full Chapters 1–4 story playthrough on 2026-09-04. The optional captive porter remains explicitly deferred and is not part of the required Chapter 4 contract.
