# Liam’s Game — Art Direction

This document defines the first-pass visual direction for **Liam’s Game / Lanterns of Briar Crown, Chapter 1**. It is intended as a handoff for art generation, asset organization, UI design, and future implementation in the repo.

---

# 1. Overall Visual Identity

## Core Style

**Liam’s Game** should look and feel like a **storybook fantasy adventure**.

The art direction should emphasize:

- hand-drawn / hand-painted warmth
- subtle painterly texture
- expressive but grounded character design
- cozy fantasy environments
- gentle whimsy inside a sincere adventure
- readable, map-like compositions for explorable areas
- clean UI with bookish / parchment-inspired panels

The world should feel **handmade rather than slick or computer-generated**.

The target is not photorealistic, not anime, not 3D game art, and not overly cartoonish. The ideal style sits in the middle ground: **storybook villagers and adventurers with enough detail to feel emotionally real, but enough stylization to remain warm and family-friendly.**

---

# 2. Tone

The story has real urgency and danger, but the world should not feel grimdark.

## Emotional tone

- sincere
- adventurous
- warm
- slightly mysterious
- gently whimsical
- occasionally silly
- emotionally grounded

There is panic early in Chapter 1, and the mystery implies real danger, but the world should still feel like a place worth saving.

## Humor level

Use **gentle whimsical humor**, not broad parody.

Good examples of visual humor:

- odd little props
- expressive side characters
- cozy clutter
- slightly exaggerated tavern signs
- practical fantasy weirdness
- characters with personality in posture and accessories

Avoid:

- slapstick-heavy comedy
- meme-like visuals
- goofy facial exaggeration
- making serious story beats feel unserious

---

# 3. Rendering Style

## Characters

Character art should use a **middle-ground storybook rendering style**.

Characters should feel like:

- storybook villagers
- practical adventurers
- warm but distinct NPCs
- expressive, readable personalities
- not too chibi
- not hyper-realistic
- not glossy digital fantasy art

Portraits should usually be **half-body dialogue portraits**, with enough costume and posture visible to communicate role and personality.

The protagonist eventually needs **full-body art** because gear changes should visibly affect the hero.

## Texture

Use **subtle painterly texture**.

The texture should be visible enough to avoid a slick digital feel, but not so heavy that the art becomes muddy or hard to read.

Preferred texture qualities:

- soft brushwork
- watercolor / gouache-inspired layering
- light paper grain
- gentle ink-like line definition
- warm illustrated-book finish

Avoid:

- plastic shine
- 3D-rendered lighting
- over-crisp vector edges
- heavy grunge
- muddy over-texturing
- harsh comic-book ink

---

# 4. Environment Palette and Mood

Each Chapter 1 location should have a distinct emotional and color identity.

## Hearthhollow

**Mood:** warm, cozy, home, humble courage

Visual qualities:

- golden lantern light
- soft greens
- warm browns
- cottage windows glowing
- garden plots
- rounded village paths
- gentle fences
- inviting but slightly worried atmosphere

Hearthhollow is the emotional baseline of the game. It should feel like a place people love.

## Lantern Road

**Mood:** ancient, magical, benevolent, uncertain

Visual qualities:

- enchanted old road
- subtle route marks
- old stones and shrines
- amber lantern glow
- muted greens
- mossy stone
- touches of dusky blue
- sacred/mythic feeling in key places

Lantern Road should feel clearly magical, mostly benevolent, and a little sacred. The magic should feel like the road remembers truth and guidance.

Avoid making everything glow. The magic should feel special, not visually noisy.

## Bramblecross

**Mood:** practical, guarded, civic, structured

Visual qualities:

- squarer architecture
- stone walls
- timber framing
- watchhouse presence
- posted notices
- route maps
- ledgers
- muted reds
- stone grays
- brown timbers
- parchment tones

Bramblecross should feel more organized and guarded than Hearthhollow. It is not cold or evil, but it is more structured, watchful, and civic.

## Root Cellar

**Mood:** ancient, earthy, mysterious, tense but not horror

Visual qualities:

- greens
- golds
- browns
- amber lantern light
- roots through stone
- mossy textures
- old storage rooms
- route murals
- root sigils
- sealed door
- ancient infrastructure beneath ordinary town life

The Root Cellar is the climax location of Chapter 1. It should feel dangerous and meaningful, but not grotesque or terrifying.

---

# 5. Map Style

Explorable maps should use a **painted storybook / board-game map style**.

## Map principles

- readable paths
- charming illustrated landmarks
- hand-painted icon language
- clear interactable locations
- visually appealing but not cluttered
- no embedded text labels if avoidable
- UI overlays can provide icons and labels

The maps should eventually function as illustrated backgrounds with **tile-based movement under the hood**.

## Movement model

For now, gameplay should remain tile-based or node/grid-based mechanically.

The painted map acts as a visual skin:

- background = painted illustrated map
- movement = invisible grid or defined nodes
- player marker = moves cell to cell
- interactables = subtle UI markers over actual locations

This preserves the current prototype’s clarity while improving the visual presentation.

---

# 6. UI Direction

The UI should stay mostly clean, but story-heavy panels should feel bookish.

## Preferred UI approach

- clean fantasy interface
- parchment-inspired dialogue and journal panels
- subtle borders
- warm neutral backgrounds
- readable typography
- soft shadows
- not too ornate
- not too modern
- not full medieval manuscript overload

## Best use of parchment styling

Use parchment/book texture for:

- dialogue panels
- quest journal
- story recap
- map notes
- item lore
- investigation boards

Keep core gameplay controls clean and readable.

---

# 7. Symbol Language

## Lantern Road Symbols

Lantern Road symbols should feel:

- humble
- old
- helpful
- handmade by travelers
- designed to guide, warn, shelter, and remember

Examples:

- tiny lantern marks
- route scratches
- water/shelter warning marks
- courier signs
- traveler initials
- old road symbols worn into stone

These symbols represent true guidance and shared trust.

## Briar Crown Symbol

The Briar Crown should feel like **rough, invasive false authority**.

It is not a polished royal seal. It should look like:

- thorny crown imagery
- scrawled over older truthful marks
- imposed rather than grown naturally
- controlling
- aggressive
- deliberately false
- a mark that wants to be mistaken for authority at a distance

The Briar Crown should visually contrast with Lantern Road symbols:

| Lantern Road | Briar Crown |
|---|---|
| guides | commands |
| remembers | overwrites |
| protects travelers | controls movement |
| humble | invasive |
| true marks | false authority |

---

# 8. Protagonist Art Direction

The protagonist should support future customization.

## Hero design requirements

The hero should eventually support:

- different races/ancestries
- gender changes
- visible gear changes
- full-body presentation
- starter-to-advanced equipment progression

For early concept art, the default hero can be a youthful village adventurer:

- sincere
- brave
- early in the journey
- simple village travel clothes
- short cloak
- practical boots
- belt pouch
- starter weapon such as old hatchet

The hero should feel capable but not yet epic.

## Gear visibility

Gear should visibly affect the hero when possible:

- Old Hatchet: rugged village tool / starter weapon
- Turnipwood Blade: cleaner rootwood blade
- Pebbleknock Hammer: squat, practical hammer
- Lantern Pin: warm, roadwarden-like symbol
- Stormbell Charm: small crackling charm
- Warden Chain: heavier, late Chapter 1 reward

---

# 9. Character Portrait Direction

Dialogue portraits should generally be **half-body portraits**.

Each portrait should show:

- face
- upper body
- role-specific clothing
- key props
- background hints of location
- posture/personality

Avoid making every NPC too similar. Silhouette, skin tone, build, posture, costume, expression, and background should all help differentiate them.

---

# 10. Chapter 1 Character Notes

## Elder Mira

Role: emotional center of Hearthhollow

Visual identity:

- wise
- steady
- warm
- quietly burdened
- trusted village elder
- practical, dignified village clothing
- not queenly or magical-sorceress-like

Mood:

- caring
- serious
- reassuring
- “the heart of Hearthhollow”

## Enna

Role: sharp investigative mind of Bramblecross

Visual identity:

- Black woman / much darker skin
- tough, hard, focused
- observant
- organized
- slightly intense
- practical investigative attire
- papers, pins, route notes, ledgers

Mood:

- intelligent
- no-nonsense
- guarded
- not soft like Mira
- sees the pattern before others want to admit it

Avoid making Enna feel like a younger Mira. She should feel harder, sharper, and more Bramblecross than Hearthhollow.

## Captain Hollis

Role: responsible authority with emotional weight

Visual identity:

- dependable
- worn
- disciplined
- serious without being cruel
- practical watch armor or sturdy guard attire
- not ornate paladin armor
- emotionally tired

Mood:

- protective
- burdened
- values truth over glory
- carries regret over Edden

## Nix Fernwhistle

Role: road-scout / Lantern Road bridge

Visual identity:

- wiry
- sharp-eyed
- outdoorsy
- roadwise
- practical cloak/hood
- bow or scouting gear
- signs of travel
- connected to Lantern Road but not official

Mood:

- alert
- perceptive
- slightly odd
- sees the difference between random panic and planted fear

## Pibble Thatch

Role: curious Hearthhollow clue-noticer

Visual identity:

- warm, clever, curious
- slightly eccentric
- glasses or magnifying tool can work
- practical village clothes
- pockets full of herbs/tools/notes
- gentle humor

Mood:

- odd but helpful
- notices what others miss
- probably measures mud with a spoon

## Rowan Reedshield

Role: defensive companion

Visual identity:

- sturdy, grounded, protective
- non-fox; should match available playable ancestry/race options
- broad build
- shield clearly visible
- practical travel/tavern clothing
- blue-green scarf/cloak works well
- calm, steady posture

Mood:

- protective first
- not flashy
- serious about bringing people home
- “a shield is not furniture”

Rowan should be from the strongest defensive ancestry/race option available. Avoid animal-muzzle/fox-person designs unless that becomes a later intentional race.

## Tilda Quickstep

Role: clever/mischievous companion

Visual identity:

- quick, nimble, sharp-eyed
- playful but not silly
- perched in inn
- small tools/cards/apple seeds
- light travel gear
- grin that suggests she noticed something you missed

Mood:

- clever chaos
- trips bullies, not children
- enjoys unraveling lies
- most playful companion

## Moss Fenmere

Role: old-magic / patient observer companion

Visual identity:

- Mossback works well
- green/earthy skin or moss-like texture
- calm, rooted, ancient-adjacent
- plants, moss, little mushrooms, vines, natural adornments
- quiet tavern presence

Mood:

- still
- patient
- strange but gentle
- sees roads as promises and roots as memory
- not creepy, not monstrous

---

# 11. Environment Asset Notes

## Key Art

The selected key art direction:

- hero on Lantern Road
- Hearthhollow warm behind
- magical road ahead
- subtle Briar Crown intrusion
- full-body hero
- medium-wide composition
- more magical than urgent

This establishes the overall storybook look.

## Hearthhollow Gameplay Map

Selected direction:

- cozy forest village clearing
- central well
- warm cottages
- smithy, home, potion shed, supply cache, Mira location
- south gate as actual exit
- no permanent boar warning sign over gate
- icons/labels can be UI overlays

The Hearthhollow map should feel navigable with a hidden tile/grid system underneath.

## Lantern Road Gameplay Map

Selected direction:

- winding magical road
- shrine
- milestone ruin
- broken cart
- traveler camp
- cache
- ambush bend
- exit toward Bramblecross
- old road symbols in path
- not too many lanterns

The road should feel enchanted and benevolent, with a few corrupted/false marks.

## Bramblecross Town Map

Selected direction:

- squared, practical, guarded town
- walls/gates
- watchhouse prominent
- market area
- inn
- organized streets
- posted notices and civic structure

Bramblecross should contrast with Hearthhollow by feeling more structured and less cozy.

## Root Cellar Map

Selected direction:

- readable dungeon route
- root-woven chambers
- sigil
- mural
- mushrooms
- cache
- Warden blocking sealed door
- amber lantern light
- earthy greens/golds/browns

The Warden can be intimidating but should eventually be softened if it feels too scary for family adventure tone.

---

# 12. First Selected Asset List

These are the current first-pass art assets worth carrying forward into the repo as concept pieces.

## Key Art

- `chapter-1-lantern-road-key-art-v02.png`

## Environments

- `hearthhollow-map-concept-v03.png`
- `lantern-road-map-concept-v01.png`
- `bramblecross-town-concept-v01.png`
- `root-cellar-map-concept-v01.png`

## Characters

- `mira-portrait-v01.png`
- `enna-portrait-v02.png`
- `hollis-portrait-v01.png`
- `nix-portrait-v01.png`
- `pibble-portrait-v01.png`
- `rowan-portrait-v02.png`
- `tilda-portrait-v01.png`
- `moss-portrait-v01.png`

These filenames are suggestions for the repo. Actual downloaded/generated filenames can be renamed when copied into the asset folders.

---

# 13. Prompt Style Block

Use this style block as the base for future generations.

```text
Storybook fantasy illustration with a hand-drawn, hand-painted feel, subtle painterly texture, soft brushwork, gentle ink-like line definition, and a warm illustrated-book atmosphere. The image should feel handmade rather than slick or overtly digital. Use a middle-ground character style: expressive and warm, like storybook villagers and adventurers, but not overly cartoony or exaggerated. The world should feel whimsical, adventurous, and emotionally sincere, with room for gentle humor. Use a clean fantasy visual language with soft parchment-like warmth in the palette and composition. Lighting should be cinematic but painterly, with cozy glow where appropriate.
```

## Global negative prompt

```text
No photorealism, no 3D-rendered look, no glossy digital game art, no anime style, no harsh comic-book ink, no horror tone, no grimdark mood, no over-saturated neon colors, no overly detailed clutter, no exaggerated caricature proportions, no modern clothing, no sci-fi elements, no copyright-specific franchise resemblance.
```

---

# 14. Art Production Priority

## Immediate next art assets

1. Ada Willowmarket
2. Smith Orin
3. Bramble Boar
4. Thorncoat Ruffian
5. Thorny Hound
6. Rustroot Skulk
7. Briar Knot Warden
8. Briar Crown symbol sheet
9. Lantern Road symbol sheet
10. item icon sheet

## Later assets

- hero customization base bodies
- gear overlays
- battle backgrounds
- UI parchment panels
- skill icons
- consumable icons
- world/chapter splash screens

---

# 15. Implementation Notes for Codex

When integrating art into the repo:

1. Preserve the working prototype first.
2. Do not replace the map logic with freeform movement yet.
3. Add art assets as organized files first.
4. Use art in non-invasive places first:
   - splash images
   - portrait references
   - documentation
5. Later, wire portraits into dialogue.
6. Later, use illustrated maps as background skins under grid movement.
7. Keep UI markers separate from baked-in map text/icons where possible.

The safest implementation path is:

1. Store selected concept art in `assets/concept/`.
2. Copy current keepers into production folders later:
   - `assets/portraits/characters/`
   - `assets/maps/`
3. Add asset references in data files once the code has been moved into a repo.
4. Replace emoji portraits gradually, one character at a time.
5. Keep fallback emoji/icons until every asset reference is tested.

---

# 16. Core Art Principle

The game should feel like opening a hand-painted storybook where the map is playable.

The visuals should make the player feel:

- home is worth protecting
- roads can be trusted, but trust can be attacked
- truth can be hidden under roots, paper, and fear
- the world is serious enough to matter
- the adventure is warm enough to invite a family to play together
