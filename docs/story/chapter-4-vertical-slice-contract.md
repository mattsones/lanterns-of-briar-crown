# Chapter 4 Vertical-Slice Contract

Last updated: 2026-08-02

Status: executable pre-production contract and Folded Map graybox implemented; interaction direction awaits owner playtest acceptance before full Chapter 4 scene work

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

The graybox is available from the title screen through **Test Folded Map Graybox** and can be reopened from the Chapter 3 completion banner.

Required route solve:

- connect the **Great Survey Lantern** to the **Keeper Lantern**;
- reject the tempting **Crown Shortcut**;
- reveal the winding Underway route by comparing two incomplete records.

Fail-forward mistake:

- connecting any edge to the Crown Shortcut records a first-attempt mistake when appropriate;
- the mistake exposes a sealed maintenance approach rather than blocking progress;
- correcting the map still decodes the true route;
- later Listening Mile or route content may add pressure for the maintenance approach, but may not remove Lio's-message progression.

Optional deeper solve:

- after the true route is decoded, connect the **Root Arrow** to the **Broken Bridge Notch**;
- reveal a Lanternwell cache mark;
- award exactly one Lanternwell Drop;
- repeat visits remain reviewable and cannot repeat the reward.

Back behavior:

- Back clears one selected edge first;
- Back closes the interaction only when no edge is selected.

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

> Does choosing two paper edges make the action read as comparing and folding two incomplete records, or does it still feel like selecting the correct answer from a list?

If it still feels like a quiz, revise the interaction model before building the Underway route or final art.
