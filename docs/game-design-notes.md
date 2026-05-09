# Liam’s Game — Game Design Notes

This document summarizes the current gameplay direction.

## Core Experience

A beginner-friendly storybook fantasy RPG adventure.

The game should feel like:

- reading a fantasy storybook
- moving across a playable map
- making meaningful but simple choices
- engaging in light tactical combat
- discovering clues
- building trust with companions
- becoming more heroic through choices and growth

## Tone

Family-friendly, adventurous, gently whimsical, and emotionally sincere.

The world can include danger and serious stakes, but it should not become grim, gory, or frightening.

---

# Exploration

## Current Model

Tile-based movement under the hood.

The player moves around maps and interacts with:

- NPCs
- doors
- shops
- chests
- shrines
- clues
- battle encounters
- exits

## Future Visual Direction

Use illustrated storybook maps as backgrounds, with invisible grid movement over them.

Map labels and interactable markers should be UI overlays, not baked into the art whenever possible.

---

# Dialogue

## Current Direction

Dialogue should feel like conversation, not just single-message popups.

Best current examples:

- Enna’s investigation exchange
- companion recruitment conversations
- Hollis/Edden explanation
- Ada’s missing seal realization

## Dialogue Principles

- NPCs should not know information the player has not shared.
- Repeated dialogue should react to story state.
- Main story choices should fail forward.
- Skill checks should reveal richer outcomes, not block the core story.
- Companion comments should be sparse but meaningful.

---

# Quests

## Current Direction

The quest journal should not reveal the whole chapter in advance.

It should show:

- the next known main objective
- discovered side quests/threads only
- completed side threads in quieter styling

## Side Quests

Side quests should connect to the story world.

Example:

Ada’s missing spice crate is not just a fetch quest. It reveals that the conspiracy can misuse trusted cargo seals.

---

# Combat

## Current Direction

Simple turn-based combat with:

- initiative check
- hero turn
- companion turn if active
- enemy turn
- multiple-enemy queue
- battle pouch items
- item-granted combat skills
- guard/healing/weakening effects
- defeat checkpoint flow

## Combat Principles

- Enemies should not act after reaching 0 HP.
- Enemy winning initiative should trigger the enemy turn correctly.
- Multiple enemies should be visible in the interface.
- Consumables should advance the turn immediately.
- Healing should be useful but not so abundant that danger disappears.

## Skill Sources

Hero combat skills come from:

1. core hero skills
2. equipped weapon
3. equipped trinket / special item

Examples:

- Old Hatchet → Scrappy Chop
- Turnipwood Blade → Rootcut Lunge
- Pebbleknock Hammer → Pebbleknock Slam
- Stormbell Charm → Spark Toss
- Lantern Pin → Roadwarden’s Resolve
- Warden Chain → Rootbind

## Cooldowns

Roadwarden’s Resolve has a 5-turn cooldown so the Lantern Pin remains special without becoming unlimited healing.

---

# Inventory and Equipment

## Current Direction

Inventory should separate:

- equipment
- consumables

Equipment screens should show:

- what is currently equipped
- available equipment options
- item bonuses
- item-granted skills

Battle pouch screens should show:

- current pouch slots
- available battle-ready consumables
- move/equip actions

---

# Progression

## Hero Leveling

When the protagonist reaches the XP threshold:

- level-up modal appears after other overlays are closed
- level increases by 1
- Max HP +4
- Current HP +4
- XP rolls over
- player chooses a growth path

## Growth Choices

- Power: Might +1, Precision +1
- Resolve: Guard +1, Will +1
- Cleverness: Wit +1, Instinct +1
- Heart: Heart +1, Charm +1
- Craft: Craft +1, Grit +1

## Companion Progression

Companion XP exists structurally but does not need to be fully surfaced yet.

Later, companions can:

- gain levels
- improve HP/stats
- unlock ability upgrades
- develop based on participation and trust

---

# Companions

## Current Chapter 1 Companions

### Rowan Reedshield

Defensive, protective, steady.

Best for players who want survivability.

### Tilda Quickstep

Quick, clever, playful.

Best for players who want trickery and agility.

### Moss Fenmere

Patient, old-magic-aware, observant.

Best for players who want insight and magical support.

## Recruitment Principles

- Companion recruitment should feel like conversation.
- Good approach matters more than RNG.
- Skill checks add texture and trust.
- Failed checks should fail forward, not hard-lock recruitment.
- Poor attitude choices can fail socially.

---

# Story Themes

## Chapter 1 Core Contrast

True road signs vs. false authority.

Lantern Road signs:

- guide
- warn
- shelter
- remember

Briar Crown marks:

- overwrite
- command
- control
- misdirect

## Recurring Phrase

> A road is safest when truth walks it first.

This phrase should echo through:

- Lantern Shrine
- Enna’s investigation
- Sealed Door
- Chapter 1 report-back
- future Westroot story
