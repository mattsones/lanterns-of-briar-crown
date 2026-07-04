# NPC and Enemy Art Review - 2026-07-04

This review covers the NPC and enemy artwork currently present in:

- `assets/portraits/characters/`
- `assets/portraits/enemies/`

Temporary contact sheets were generated locally in `.codex-art-review/` for visual comparison. Those sheets are review aids only and should not be committed.

## Review Lens

The main production goals are:

- Keep the storybook painterly style.
- Preserve warm, family-friendly adventure tone.
- Prefer strong role readability at dialogue-card and combat-card sizes.
- Make humanoid ancestry/type distinctions more visible, especially for villagers who might otherwise all read as generic humans.
- Pick one production candidate where multiple versions exist, while keeping useful alternates as references.

## Overall Verdict

The batch is strong. Most assets are production-usable now, especially if the first wiring pass preserves emoji fallbacks. The biggest remaining art-direction checks are optimization and keeping the Briar enemy roles visually distinct:

- Orin v2 and Nella v3 are good moves toward clear fantasy ancestry reads.
- Miri v2 is better than v1 for human variety.
- Roadwatcher v2 fixes the earlier Warden overlap and should replace v1.
- False Sign Scratcher v2 completes the Chapter 2 enemy set and is the cleaner keeper.
- The two hound enemies are distinct enough in pose and story role, but both occupy the same thorny canine family.

Before shipping many of these in a web build, run an optimization pass. Most new portraits are around 2.4-3.0 MB each, which is fine as source/production masters but heavy if loaded eagerly.

## Recommended Keepers

| Role | Recommended asset | Readiness | Notes |
|---|---|---|---|
| Ada Willowmarket | `assets/portraits/characters/ada-willowmarket-portrait-v01.png` | Ready | Excellent role read, props, expression, and Willow Market identity. |
| Edden Vale | `assets/portraits/characters/edden-vale-portrait-v01.png` | Ready with note | Strong emotional/story read. Slightly tearful/dramatic, but appropriate for recovery-room context. |
| Lio Brindle | `assets/portraits/characters/lio-brindle-portrait-v01.png` | Ready with note | Warm and appealing. Could use a future post-captivity variant for Chapter 5. |
| Mara Brindle | `assets/portraits/characters/mara-brindle-portrait-v01.png` | Ready | Excellent. Pear roll, blue string, map, posture, and expression all land. |
| Mayor Anwen | `assets/portraits/characters/mayor-anwen-portrait-v01.png` | Ready with note | Strong civic leader. Slightly ornate/official, but fits Bramblecross. |
| Miri of the Loom | `assets/portraits/characters/miri-portrait-v02.png` | Ready | Prefer v2 for distinctiveness. Keeps loom/sash story read and improves humanoid variety. |
| Nella the Baker | `assets/portraits/characters/nella-portrait-v03.png` | Ready | Best Tideborn/water-person read; use this bolder fantasy direction. |
| Smith Orin | `assets/portraits/characters/smith-orin-portrait-v02.png` | Ready | Best choice for a clear Emberling/fireperson identity. |
| Toma Fielding | `assets/portraits/characters/toma-fielding-portrait-v02.png` | Ready with note | Better prop/silhouette than v1. Still reads human/generic. |
| Worried Road Traveler | `assets/portraits/characters/worried-road-traveler-portrait-v01.png` | Ready with note | Good anxious traveler, but contains baked-in readable sign text. Acceptable if used sparingly; future regeneration should avoid text. |
| Bramble Boar | `assets/portraits/enemies/bramble-boar-v01.png` | Ready | Excellent action, satchel clue, and non-evil panic read. |
| Briar Knot Warden | `assets/portraits/enemies/briar-knot-warden-v01.png` | Ready with note | Strong boss art. Could be more root-cellar/chain specific, but usable. |
| Briar Roadwatcher | `assets/portraits/enemies/briar-roadwatcher-v02.png` | Ready | Strong fix. Now reads as a practical sign-forging field agent rather than a Warden-like guardian. |
| False Sign Scratcher | `assets/portraits/enemies/false-sign-scratcher-v02.png` | Ready | Prefer v2. Clear support-enemy role, less masked, and more distinct from the Warden/Roadwatcher. |
| Rustroot Skulk | `assets/portraits/enemies/rustroot-skulk-v02.png` | Ready | Prefer v2. More organic and less mechanical than v1. |
| Thorncoat Ruffian | `assets/portraits/enemies/thorncoat-ruffian-v02.png` | Ready | Prefer v2 if avoiding fox-person implications. |
| Thorn-Collared Hound | `assets/portraits/enemies/thorn-collared-hound-v01.png` | Ready | Clear collar-control read and sympathetic enemy tone. |
| Thorny Hound | `assets/portraits/enemies/thorny-hound-v01.png` | Ready | More wild/brush creature than the collared hound, good separation. |

## Version Notes

### Smith Orin

- `smith-orin-portrait-v01.png`: technically ready, warm, safe, and charming, but reads as a human blacksmith at first glance.
- `smith-orin-portrait-v02.png`: recommended. Very clear Emberling read, strong forge identity, visually distinct from other Hearthhollow villagers.

Use v2. The clear fire-person read is the point; Emberlings should not collapse into humans with warm lighting. If revised later, preserve the ember skin, glow, and coal/forge material language.

### Nella the Baker

- `nella-portrait-v01.png`: good active baking pose and warm bakery context, but less clean as a dialogue portrait.
- `nella-portrait-v02.png`: strong crop, readable expression, clear bakery identity, and moderate Tideborn cueing.
- `nella-portrait-v03.png`: recommended. Strongest Tideborn read, correctly crossing into water-person territory while preserving bakery context.

Use v3. Tideborn should read as water-people, not humans with blue accents.

### Miri of the Loom

- `miri-portrait-v01.png`: production-usable and bright, but closer to a default fair village portrait.
- `miri-portrait-v02.png`: recommended. Better distinctiveness, stronger face variety, and still excellent loom/sash storytelling.

Use v2.

### Toma Fielding

- `toma-fielding-portrait-v01.png`: warm, friendly, good face, but too close to generic farmer.
- `toma-fielding-portrait-v02.png`: recommended. The rake/fork silhouette reads faster and helps separate him from Orin's crossed-arms pose.

Use v2 for now. If you want Hearthhollow to show more ancestry diversity, Toma could be a good future Sylvan or Mossback pass.

### Rustroot Skulk

- `rustroot-skulk-v01.png`: memorable and cellar-specific, but too mechanical/constructed for the desired organic creature read.
- `rustroot-skulk-v02.png`: recommended. More organic, root-grown, and creature-like while still feeling like a cellar threat.

Use v2.

### Briar Roadwatcher

- `briar-roadwatcher-v01.png`: high-quality, but too close to the Warden's masked thorn-staff silhouette.
- `briar-roadwatcher-v02.png`: recommended. Practical road clothes, visible face, sign tools, false-arrow sign, and no-handle gate context all land.

Use v2. It is more of a scene portrait than a pure isolated enemy card, but that actually helps the Chapter 2 road-deception story read fast.

### False Sign Scratcher

- `false-sign-scratcher-v01.png`: strong and readable, but the wood-mask face pulls it a little closer to Warden language.
- `false-sign-scratcher-v02.png`: recommended. More readable face, better small support-enemy personality, and less overlap with the masked thorn guardians.

Use v2. It is still intense for a support enemy, but the sign slats, claws, and hunched motion make the combat role clear.

### Thorncoat Ruffian

- `thorncoat-ruffian-v01.png`: high-quality and very distinctive, but reads as a fox-person. That may imply an ancestry or creature type the game has not established.
- `thorncoat-ruffian-v02.png`: recommended for current production. More human/humanoid, better if Thorncoat Ruffian should be a Briar Crown-aligned roadside agent rather than a foxfolk enemy.

Use v2 unless you intentionally want to introduce foxfolk/animalfolk as a distinct population.

## Individual Evaluation

### Ada Willowmarket

Production-ready. She has a strong silhouette, decisive expression, market goods, ledger, magnifier, green seal crate, and enough practical clutter to communicate the character immediately. The magnifier may slightly overstate her detective role versus merchant role, but it also connects cleanly to the Willowmark Lens. Keep.

### Edden Vale

Production-ready with a small caveat. The recovery-room context, charcoal drawings, blue cloth, and cracked lantern all read. The face is very vulnerable and tearful, which works for "shaken witness" but may make him feel younger or more fragile than intended. Still usable and emotionally effective.

### Lio Brindle

Production-ready as a pre-rescue or remembered portrait. He is warm, appealing, and courier-coded through cloak, straps, badge, and road background. For Chapter 5, generate a second "rescued Lio" variant that is tougher, tired, bandaged, and angrier.

### Mara Brindle

Production-ready. This is one of the best in the batch. She reads as a real kid, not a miniature adult. The pear roll, blue string, route map, crumbs/string/button clutter, and stubborn expression all serve the story. Keep.

### Mayor Anwen

Production-ready with minor notes. She reads civic and composed, and the notice board/town background is strong. She is a bit more formal and polished than "limited information, holding town together," but that is acceptable for Bramblecross.

### Nella the Baker

Use v3. It keeps enough bakery warmth while making Tideborn visible as water-people. This is the stronger fantasy-world choice for a distinct humanoid ancestry.

### Smith Orin

Use v2. It strongly supports your desire for more distinct humanoid types. The Emberling read is immediate. v1 is more naturalistic and safer, but less interesting for the world.

### Toma Fielding

Use v2. It is production-ready as a human farmer with a clearer tool silhouette. Consider a future ancestry-specific redraw only if you want all Hearthhollow NPCs to become ancestry anchors.

### Miri of the Loom

Use v2. It gives better visual variety than v1 while preserving the loom, shuttle, lantern-sash, and thread motif. Production-ready.

### Worried Road Traveler

Production-usable, but not ideal as a clean game asset because the signpost includes readable text. The expression and role are excellent. If used only as a generic road traveler, the named sign text might be distracting or overly specific. Consider regenerating later without baked-in text.

### Bramble Boar

Production-ready. The satchel clue is clear, the boar feels frantic rather than evil, and the action pose is memorable. Keep.

### Briar Knot Warden

Production-ready as boss art, with a direction note. It is imposing, readable, and has thorn/crown corruption. It could use more root-cellar specifics: rusted chain, old boards, broken iron, and less generic thorn-knight/staff language. Still strong enough to wire now.

### Briar Roadwatcher

Use v2. It solves the earlier v1 problem almost exactly: visible human face, practical road clothes, tools, slats, nails, false sign, and gate context. It reads like someone maintaining a lie rather than a supernatural thorn guardian. Production-ready.

### False Sign Scratcher

Use v2. Both versions communicate "sign-tamperer," but v2 has the better face read and less mask/wood-guardian overlap. v1 is usable as a more frightening alternate, but v2 fits the Chapter 2 support-enemy role better.

### Thorncoat Ruffian

Use v2 for current production. v1 is more distinctive, but likely introduces foxfolk unintentionally. v2 fits the "not a bandit, more field agent" direction while still carrying thorncoat details and false orders.

### Thorny Hound

Production-ready. This one reads as a wild bramble-tangled road threat. It is more animal/hedge than controlled, which separates it from the Thorn-Collared Hound.

### Thorn-Collared Hound

Production-ready. The collar is clear, the body language feels controlled and unwilling, and it is distinct enough from Thorny Hound to justify both.

### Rustroot Skulk

Use v2. v1's lantern and asymmetry are memorable, but the overall read is too mechanical. v2 better supports an organic root-cellar creature while staying readable and family-friendly tense.

## Missing From Current NPC/Enemy Art Scope

These planned entries still need art:

- Bracken Voss portrait and combat/boss version
- Chapter 3 Westroot NPC set
- Chapter 4-5 enemies: Briar Relay Guard, Seal-Forged Sentry, Crown Whisperer, Thornseal Guard, Thornroot Sentry
- Optional future post-rescue Lio portrait

## Notes Outside NPC/Enemy Scope

The `assets/scenes/three-doors-threshhold-v01.png`, `v02`, and `v03` files use the misspelling `threshhold`. There is also `three-doors-threshold-v01.png` with the correct spelling. If those scene assets are kept, prefer the correctly spelled filename path or rename consistently before wiring.
