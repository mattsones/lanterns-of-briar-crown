# Chapter 1 Golden Path Playtest

This is the main flow to verify after significant code changes.

## Goal

Confirm Chapter 1 can be completed from a fresh game without broken state, blocked progression, missing dialogs, or combat stalls.

---

# Fresh Start

## Character Creation

- Create a new hero.
- Confirm character name appears correctly.
- Confirm race/ancestry/stat selection works.
- Start the game.

Expected:
- Opening narration appears.
- Player begins in Hearthhollow.
- Current objective: speak with Elder Mira.

---

# Hearthhollow

## Elder Mira

1. Talk to Mira.
2. Ask “Why me?” if desired.
3. Accept the quest.

Expected:
- Mira gives gold.
- Heart +1 is applied.
- Smith discount is unlocked.
- Objective updates to prepare for the road.

## Home

1. Enter home.
2. Take old hatchet.

Expected:
- Old Hatchet appears in inventory.
- Gate should later allow player to leave only after proper prep.

## Smithy

1. Visit Smith Orin after speaking with Mira.
2. Verify shop opens.
3. Verify starter discount is available.
4. Buy/equip if desired.

Expected:
- Discount applies only to equipment, not consumables.
- Orin gives appropriate “talk to Mira first” message if visited too early.

## Optional Pibble

1. Talk to Pibble.
2. Ask what else he noticed.

Expected:
- Pibble mentions cut strap.
- Trail Snack is received.
- This reinforces the Lio/satchel thread.

## South Gate / Boar

1. Approach south gate after preparation.
2. Start boar encounter.
3. Defeat Bramble Boar.

Expected:
- Boar encounter text appears.
- Combat resolves.
- Enemy does not attack after reaching 0 HP.
- Courier satchel reward appears.
- Lio Brindle thread begins.
- Road to Lantern Road opens.

---

# Lantern Road

## Nix

1. Talk to Nix before milestone.
2. Accept his guidance.

Expected:
- Nix points toward milestone ruin.
- XP is awarded once.
- If the ruin note is already found, Nix reacts to that instead of still telling player to check stones.

## Milestone Ruin

1. Search the ruin after meeting Nix.
2. Take planted order.

Expected:
- False order is found.
- `foundRuinNote` behavior works.
- Ambush becomes available.

## Road Camp / Traveler

1. Find road camp.
2. Find worried traveler.
3. Send traveler to camp.

Expected:
- Traveler moves to camp.
- Traveler does not remain visible at starting road tile.
- Old traveler tile becomes normal path/grass.

## Broken Cart

1. Inspect cart before Ada quest.
2. Confirm it gives only partial clue.
3. Later after Ada quest, return and recover proof.

Expected:
- Cart does not complete Ada’s quest before the player knows it matters.
- After completion, walking over spent cart should not interrupt unless manually inspected.

## Lantern Shrine

1. Discover shrine.
2. Study road marks.
3. Clean false seal.

Expected:
- Shrine side thread appears only after discovery.
- Shrine grants HP +8 and Will +1.
- Restored shrine does not auto-interrupt movement afterward.
- Manual inspect still works.

## Ambush

1. After finding false order, approach ambush.
2. Fight Thorncoat Ruffian and Thorny Hound.

Expected:
- Multiple enemy queue is visible.
- If enemy wins initiative, enemy actually acts.
- Combat does not stall.
- Defeated enemies do not take final attacks.
- Loot/reward popup auto-dismisses.

## Enter Bramblecross

1. Clear ambush.
2. Use road exit to Bramblecross.

Expected:
- First entry shows road report text.
- Returning later should not repeat first-entry road report if Enna has already been briefed.

---

# Bramblecross

## Mayor / Notice Board

1. Talk to Mayor Anwen.
2. Read Bramblecross notice board.
3. Take Ada notice.

Expected:
- Ada side quest appears only after notice board.
- Notice board reveals cellar warnings and route order concerns.

## Enna

1. Brief Enna with road report.

Expected:
- Dialog feels like Enna is learning from player.
- Case wall is completed after report.
- XP awarded.
- Current objective updates.

## Watchhouse Interior

1. Enter watchhouse before Enna briefing if desired.
2. Enter again after briefing.
3. Interact with evidence board, ledger, wall map, forged orders.

Expected:
- Before briefing, board is incomplete.
- After briefing, board shows completed case wall.
- Optional skill checks provide richer info but do not block progress.
- Dialogs appear above the watchhouse overlay, not behind it.

## Hollis

1. Speak with Hollis before Enna if desired.
2. Speak after Enna.
3. Study wall/notice board as required.
4. Get authorization for Root Cellar.
5. Ask about Edden if desired.

Expected:
- Hollis gatekeeping feels story-motivated.
- Root Cellar entrance unlocks after authorization.

## Ada

1. Talk before and after accepting notice.
2. Return with cart proof.

Expected:
- Ada connects missing seal to larger conspiracy.
- Rewards are granted.
- Market discount unlocks.
- Side quest completes.

## Inn / Companions

1. Enter Bramblecross Inn.
2. Recruit one companion.
3. Try Rowan, Tilda, or Moss.

Expected:
- Recruitment dialogs are immersive.
- Skill checks fail forward.
- Companion recruitment dialog appears above inn overlay.
- Companion tab shows abilities.
- Companion can participate in combat.
- Companion defeat state behaves sensibly.

---

# Root Cellar

## Entrance

1. Try before authorization.
2. Enter after authorization.

Expected:
- Unauthorized entrance is blocked.
- Authorized entrance works.

## Cellar Interactables

Inspect:

- Root Sigil
- Route Mural
- Glowcap Cluster
- Cellar Cache
- Rustroot Skulk
- Briar Knot Warden
- Sealed Door

Expected:
- First interactions trigger dialogs.
- Repeat walking over spent interactables does not auto-interrupt.
- Manual inspect still works.
- Mural gives XP once.
- Glowcap and cache reward once.

## Layout

Expected:
- Sealed Door cannot be reached without going through the Warden.
- Upper-right exploration spur remains available.
- Lower-right bypass remains blocked.
- After Warden is defeated, Warden tile becomes passable.

## Warden Fight

Expected:
- Warden blocks door.
- Fight resolves cleanly.
- Reward appears.
- Sealed Door becomes meaningful after victory.

## Sealed Door

1. Inspect before Warden.
2. Inspect after Warden.
3. Study Briar Crown mark.
4. Take Warden Chain and Edden’s cloth.

Expected:
- Before Warden, door implies something wrong.
- After Warden, Chapter 1 discovery completes.
- Briar Crown theme is clear.
- Items are received.
- Banner says Root Cellar discovery complete, not Chapter 1 complete yet.

---

# Report Back

1. Return to Hollis and Enna.
2. Trigger report-back scene.

Expected:
- Edden’s cloth matters emotionally to Hollis.
- Enna connects Westroot, Lantern Road, Willow seal, and Lio.
- Briar Crown is identified as false authority growing over true roads.
- Chapter ends with Westroot lead.
- Banner changes to Chapter 1 complete: The Road That Lied.

---

# Regression Checks

## Combat

- Battle pouch item advances turn immediately.
- Roadwarden’s Resolve has 5-turn cooldown.
- Cooldown UI appears.
- Enemy initiative does not stall.
- Multiple enemies show queue/next enemy.
- Player defeat modal appears at 0 HP.

## Progression

- Level-up triggers after overlays are closed.
- Level-up grants Max HP +4 and Current HP +4, not full heal.
- XP target uses curve, not hardcoded 20.
- XP rolls over.

## Quests

- Main quest shows only next known step.
- Side quests hidden until discovered.
- Shrine side thread appears after shrine discovery.
- Ada side quest appears after notice board.

## UI

- Dialogue modals appear above interiors/shops.
- Loot popups auto-dismiss.
- Side quest badges are cosmetic and clean.
- Inventory organized into equipment and consumables.
- Battle pouch and equipment configuration screens work.

---

# Notes Template

## Bugs Found

- 

## Confusing Moments

- 

## Balance Notes

- 

## Story/Dialog Notes

- 

## Art/UI Notes

- 
