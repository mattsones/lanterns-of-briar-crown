# Chapter 4 Vertical-Slice Contract

Last updated: 2026-08-02

Status: executable pre-production contract and third Folded Map interaction spike implemented; the card matcher and cross-wing prototypes were rejected, and the rectangular-sheet prototype awaits owner acceptance before full Chapter 4 scene work

## Chapter Promise

Follow keeper evidence instead of counterfeit speed, find Lio's own message, and identify Briarhold Waystation as the Chapter 5 rescue target.

## Non-Goals

- Do not rescue Lio in Chapter 4.
- Do not require the Rootbread Promise, Rootbread Charm, or captive porter thread.
- Do not introduce weapon durability or require a return to Hearthhollow.
- Do not reveal the Briar Crown's entire hierarchy.
- Do not commission final Folded Map or Underway art before the graybox interaction is accepted.

The executable source of truth is `src/story/chapter4.ts`; pure transitions and validation live in `src/game/chapter4.ts`.

## Entry Contract

- Checked-in fixture: `public/saves/chapter-3-complete.json`
- Starting region: Westroot hub
- Chapter 3 required ending: trust earned, Witness Stones renewed, false Willow cargo exposed, Chapter 3 clear
- Required carried evidence: Edden's drawing, Witness Stone Rubbing, Cargo Transfer Tag
- Rootbread completion: canonical in the fixture, absent from every Chapter 4 prerequisite
- Chapter 4 starts only when the player commits to a Chapter 4 interaction; loading the fixture alone does not mutate its ending state

## Critical Path

1. Meet the Westroot gatewright at the Lower Gate.
2. Receive access to a nearby weapon upgrade; purchase remains optional.
3. Compare the Great Survey layer and the older keeper correction in the Folded Map interaction.
4. Enter the Underway by the decoded true route or its harder fail-forward maintenance approach.
5. Resolve the keeper-built Listening Mile circuit.
6. Optionally help the captive porter.
7. Find Lio's message.
8. Clear the Briar Relay Post.
9. Read Elowen's name in the forged-authority evidence.
10. Identify Briarhold Waystation and stop at the explicit Chapter 5 handoff.

## Folded Map Mechanical Contract

The prototype is available from the title screen through **Test Folded Map Graybox** and can be reopened from the Chapter 3 completion banner. It uses schematic vectors and paper textures so interaction can be judged without production art.

Required route solve:

- manipulate one opaque rectangular map whose route face and keeper-correction face are visibly distinct and never transparent;
- drag any of its four edges inward and snap that edge to the quarter, half, or three-quarter landing guide;
- support 54 distinct two-edge configurations before considering fold order, single folds, the reverse face, or the optional third fold;
- land the west edge at one-half and the south edge at three-quarters for the required two-fold solution;
- make the dated Survey mark, older keeper ring, contour strokes, and winding road into the Underway agree simultaneously;
- keep the map surface itself non-selectable: only moving an edge changes construction, and only **Trace this folded route** commits it;
- give keyboard users the same landing states by cycling the focused edge handle.

Fail-forward mistake:

- landing the east edge at one-half and the north edge at one-half creates the deliberately tempting 817 false configuration;
- its lantern and straight road align convincingly, while its date and terrain evidence do not;
- ordinary wrong configurations are also possible and do not create route consequences;
- folding and unfolding is consequence-free; only **Trace this folded route** commits the current configuration;
- committing the tempting revision exposes a sealed maintenance approach rather than blocking progress;
- correcting the map still decodes the true route;
- later Listening Mile or route content may add pressure for the maintenance approach, but may not remove Lio's-message progression.

Optional deeper solve:

- after the true route is recorded, leave the west-half and south-three-quarter edges folded and add the north edge at one-quarter as a third fold;
- make the root arrow visibly continue across the broken bridge notation;
- reveal the Lanternwell cache mark through the layered drawing;
- award exactly one Lanternwell Drop;
- repeat visits remain reviewable and cannot repeat the reward.

Back behavior:

- Back unfolds the most recently folded edge first;
- Back closes the interaction only when every edge lies flat.

## Folded Map State

| Concern | State/decision |
|---|---|
| Started | `chapterFourStarted` |
| Attempted | `foldedMapAttempted` |
| First mistake | `foldedMapFirstAttemptMistake` |
| Fail-forward pressure | `foldedMapMaintenanceDetour` |
| Required solve | `foldedMapDecoded` |
| Optional deeper solve | `foldedMapDeeperSolved` |
| One-time reward | `foldedMapCacheClaimed` |
| Companion | Hints only; no conscious companion required |
| Save migration | Decoded and deeper-solved saves infer earlier prerequisite state |

## Listening Mile Contract

The Listening Mile uses choice plates, echo tubes, and signal shutters. It records route practice; it does not read thoughts or judge honesty.

- `guidance`: the selected answers emphasize guidance, warning, shelter, and memory.
- `maintenance`: command-first or fear-driven answers route the party through a harder keeper-designed maintenance passage.

Both outcomes reach Lio's message. Attempt and result remain separate through `listeningMileAttempted` and `listeningMileOutcome`.

## Gatewright Weapon Economy

The gatewright encounter is mandatory before the Underway; the purchase is optional.

| Decision | Contract |
|---|---|
| Item | Gatewright Hookblade |
| Rarity | Rare |
| Price | 32 gold |
| Canonical entry gold | 78 gold |
| Bonuses | +2 Might, +2 Precision, +1 Craft |
| Skill | Keeper Gatehook: 1d10, Might/Precision scaling, guard break |
| Previous baseline | Pebbleknock Hammer: +2 Might, +1 Grit, 1d10 guard break |
| Auto-equip | No; buying does not silently replace the current weapon |
| Durability | None |
| Backtracking | Never required |

The Hookblade is a clear Chapter 4 upgrade while leaving the Hammer functional. The 32-gold price is immediately affordable from the canonical save and leaves 46 gold for supplies. A player who declines it may continue.

## Required Ending

Required flags:

- `chapterFourStarted`
- `gatewrightMet`
- `foldedMapDecoded`
- `listeningMileAttempted`
- `lioMessageFound`
- `princessNameSeen`
- `briarRelayCleared`
- `briarholdLeadFound`
- `chapterFourClear`

Optional flags, never ending gates:

- `gatewrightWeaponPurchased`
- `foldedMapDeeperSolved`
- `foldedMapCacheClaimed`
- `captivePorterHelped`

## Test Contract

- `npm.cmd run verify:fast`: asset audit, build, rules, fixtures, and pure contracts
- `npm.cmd run verify:chapter4`: fast gate plus Chapter 4 browser tests
- `npm.cmd run verify:full`: all chapter suites and smoke
- Chapter 4 navigation tests use stable scene and choice IDs instead of prose labels
- `tests/helpers/saveFixtures.ts` owns reusable storage and checked-in-fixture loading helpers

## Owner Acceptance Question

Before full Chapter 4 story implementation, play **Test Folded Map Graybox** and decide:

> Does dragging the edges of one opaque two-sided sheet to different landing points feel like folding a map, and does the correct construction reveal itself through visible evidence rather than color, labels, or elimination?

The first answer-card spike failed on both physicality and deduction. The second cross-wing spike improved manipulation but still reduced the answer to three of four binary flaps, showed implausible transparency, and did not feel like one map. The third spike must be judged on its rectangular-sheet drag interaction, the usefulness of the three landing choices per edge, the plausibility of the 817 false route, and whether the true and cache alignments visually explain themselves. If it still feels like a quiz, revise again before building the Underway route or final art.
