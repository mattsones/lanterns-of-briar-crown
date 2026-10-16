# Chapter Five Full Greybox — October 15, 2026

The owner accepted the lantern puzzles and Bracken fight as sufficient to expand into the full chapter. The follow-up explicitly asks for descriptive, immersive writing throughout development. The accepted infiltration, ordinary guide lamp, checked officer ambush, Sentry feed payoff, and untimed carriage rescue remain the foundation.

## Playable scope

Use **Begin Chapter 5 Playtest** on the title screen, continue a legitimate Chapter 4-complete save at the Relay ledger, or continue an existing Chapter 5 checkpoint. The route now ends after Enna's private evidence meeting in Bramblecross. Finishing the carriage alone leaves `chapterFiveClear` false.

- The adjoining cells use one straightforward release bar. Help Orren Pike and Hesta Brookward out separately. Free Sella Reedmere at the records desk, including when that room was bypassed before the boss.
- Carry four separate original story items: the five-prisoner transfer ledger, genuine office instruction, false-seal materials, and separate prisoner docket. The desk holds the first two; Dessa's bench holds the seal materials; the Crown Table's tally rail holds the docket. All require physical access. True Seal Fragment and Briar Chain Link supplement those originals.
- A direct-route player can secure the officer and Dessa after the escape through authored surrender, with no additional mandatory combat or puzzle. Earlier bound or bypassed rooms retain their actual resolution.
- The sheltered service court displays a cleanup checklist. All four present captives and all four originals must be safe before Lio explains Celia Venn's role and before the fuller sibling reunion. Hesta knows the escort's initial western turning; the surviving docket supplies Lanthorne. Sella authenticates office stock and handling from her own work.
- Departure is at dawn. Ridge crossings, water stops, changing light, and the high detour establish a long eastward journey, reaching town late that afternoon. There is no overnight recovery or return through Westroot.
- Garrick Reed gives a limited eyewitness account of Elowen listening at a public Progress stop and shows a public hearing notice. He warns of two territorial adult tuskers before the fork. The high trail avoids the fight; the hollow can be abandoned before combat. Both paths reconverge at the eastern bridge before the same Lio/Mara conversation.
- Optional tuskers use two independent combatants. Lio takes Mara and the rescued party behind the fallen trunk; neither sibling becomes a combat unit or target. Animals withdraw after the fight, drop no faction evidence or money, and never respawn.
- Bramblecross's public welcome brings Orren to Hollis and Lio/Mara to Enna. The subsequent private meeting includes Enna, Hollis, Anwen, Quill, and the witnesses with the originals. The closing preserves “He is still out there.” / “So are we.” Enna's deduction ends on real institutional access, filtered Progress reports, and the Celia/Elowen hearing lead in Lanthorne. No senior insider is identified.
- Completed major conversations have explicit recall choices. Reading them again does not repeat rewards or advancement.

## State and integration

`chapter5Progress.ts` owns the additive v1 aftermath state, pure transitions, required evidence/rescue gates, normalization validation, and once-only rewards. `chapter5Aftermath.ts` owns the new prose with individual Rowan, Tilda, and Moss beats; absent or unconscious companions perform no active help. The bounded existing `Chapter5Spike` surface extends its discrete node map across approach, station, return, and town phases. Arrows/WASD, Inspect, Back, and the menu remain available. The map bounds include the new cells/court and return nodes.

This is a complete **schematic greybox**, with fallback icons and no finished Chapter 5 paintings. The seven planned production map IDs and scale/lighting masters still need owner acceptance before art. Chapter 1–4 painted navigation is preserved. `App.tsx` changes are limited to existing Chapter 5 seams: atomic resources/checkpoints, battle opening text, area labels, journal state, and the real Bramblecross region/position on arrival. No parent movement rewrite.

New supplies are two Healing Fizzpops, two Trail Snacks, and twelve coins, packed once from the station's road stores. No automatic recovery is attached. The optional tuskers grant eight hero XP once and no gold. The accepted rescue milestone still advances normally to level five while retaining earned XP; the boss receives no duplicate XP award.

Conscious Rowan can quietly contain Dessa once; conscious Moss can bypass the accessible workshop feed once. Tilda's existing bonuses remain. Neither intervention is required. Open officer/sealwright fights explicitly raise Alerted. Their provisional combat profiles reuse the Thornseal Guard's bounded HP/dice with specific names, intent text, and self-defense narration. The new 26-HP tusker has Rooting Brace (self Guard 3) and Tusk Sweep (bypass 2).

Old v1 carriage checkpoints default every new outcome to unearned. Old resolved-workshop saves retain bench access as `bypassed`; migration does not invent a companion intervention or captive rescue. Pending tusker battles retry from the saved pre-combat snapshot. Reload after supplies, each rescue, reading the private evidence, and the closing retains phase and inventory. The four end flags are emitted only at their actual milestones; completion waits for the private closing.

## Verification

`$env:LIAMS_GAME_PORT='5185'; npm.cmd run verify` passed the 171-image asset audit, production build, 80 rules tests, 35 Chapter 1, 31 Chapter 2, 12 Chapter 3, 16 Chapter 4, 24 Chapter 5, and one smoke test: **199 checks total**. This complete run passed without retries.

After the final prose corrections for emptied cells, Sella's post-rescue escort, and return visits, the production build, asset audit, all 80 rules, and all 24 Chapter 5 browser cases passed again on the isolated 5186 preview. Ordinary equipment covers the quiet title-to-ending path and level-five optional tuskers. Legacy/no-companion cleanup and ending, both return routes, combat retry, independent inventory originals, once-only supplies/XP, conscious companion benefits, and recall without rewards are covered.

The first expanded Chapter 5 attempt used a failed officer roll in the test labelled quiet, producing the intended extra guard and defeating that test's two-opponent combat strategy. The test now explicitly exercises the successful check with the fixture's real bonus before restoring its combat seed. No difficulty, equipment, or hero stats were inflated to fix the quiet route.

Visual review covered the desktop ending and station graph at 1280×720, the 390×844 court/ending/station map, and the 430×932 optional battle. Longer phone map labels initially touched the next row; increased map height gives them clear spacing. A final production build and browser layout check passed, with no horizontal overflow or browser errors. A direct UI revisit after freeing both cell prisoners displays the open, emptied cells. The existing build chunk-size warning remains. `git diff --check` passes. The user test server remains on 5185; the separate production preview is stopped after verification.

## Owner playtest

Start at the title or resume your existing carriage checkpoint. After Lio's brief reunion, visit the adjoining cells east of the Crown Table. Gather desk originals and seal materials, take the separate docket at the Crown Table, and bring everyone to the service court off the landing. Follow the eastward return to the public homecoming and private case wall. Try the high trail first; the optional hollow is a second route for balance/pace review. Review descriptive rhythm, prisoner voices, the reunion, travel distance, and Enna's final deduction before scale masters and final art.
