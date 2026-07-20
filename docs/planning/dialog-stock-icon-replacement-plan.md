# Dialogue Stock Icon Replacement Plan

## Goal

Remove stock emoji and symbol art from the normal presentation of the game's story dialogue modal. Replace it with the visual source that best supports the moment:

1. a character portrait when a person is speaking;
2. enemy artwork when a creature or hostile group is the subject;
3. a focused crop of the painted map when the player is interacting with a place;
4. a bespoke scene or object close-up when the physical clue matters to the story; or
5. no thumbnail at all when the dialogue is a chapter transition, system message, or abstract summary.

This document began as an audit of `DialogueModal` calls in `src/App.tsx` and `src/components/modals.tsx`. The whole-code audit dated 2026-07-16 expands it to every emoji-like literal in `src/`, including interiors, evidence cards, companions, inventory, enemies, level-up choices, map metadata, and semantic UI symbols.

## Audit Snapshot

- There are 168 direct `setDialogue(...)` object assignments in the two audited files.
- 46 already specify a map vignette, scene, dialogue visual, or production image explicitly.
- 122 still carry only a stock `portrait` value at the call site. Many of those resolve to real character art by matching the dialogue title, but the others currently fall back to a text-only layout or can reveal the stock icon if an image fails.
- Repeated branches are grouped below by visible dialogue title or story function. Every direct assignment is covered by one of the rows in this document.

The current renderer already avoids drawing an empty stock-icon tile when no real art resolves. That is a useful safety behavior, but it does not solve the underlying data problem: battle rewards all receive the same scroll, exact title matching is fragile, and several important evidence moments have no intentional visual assignment.

Project rules require emoji fallbacks to remain available while assets are being integrated. The polished path should therefore never show them, while the fallback data remains behind the image-error path until every replacement has been tested.

## Whole-Code Emoji Audit — 2026-07-16

The source scan found 230 emoji-bearing lines across nine files. That number substantially overstates the visible problem: most matches are deliberately retained fallback data behind production artwork, or map metadata that the painted-map renderer does not draw. The goal is not to delete every emoji literal. It is to prevent stock emoji from appearing during normal play while preserving useful image-error and development fallbacks.

**Implementation update:** The Watchhouse environment and evidence cards, companion surfaces, three reachable Chapter 2 item placeholders, and all five level-up growth choices were converted to production art on 2026-07-16. The level-up sparkle was removed, the bespoke growth emblems are wired with emoji retained only as image-error fallbacks, and the later-chapter art backlog remains unfinished by design.

### Rendering audit

| Surface | Raw source matches | Normal presentation | Decision |
|---|---:|---|---|
| Dialogue definitions in `src/App.tsx` and `src/story/chapter2.ts` | 107 | Named portraits, enemy art, vignettes, scene art, or text-only dialogue | Keep `portrait` values as fallback data; finish the explicit art-key work documented below. |
| Painted-map metadata in `src/data/maps.ts` | 53 | Map art, real character portraits, and real token art; ordinary action-token emoji are not drawn | Keep as fallback/debug metadata. Do not add stock markers back to painted maps. |
| Item records in `src/data/items.ts` | 34 item icons | `ItemIcon` uses production artwork first | Replace the three currently reachable Chapter 2 placeholders; retain fallback values. Generate five later-chapter items when those chapters become playable. |
| Enemy records in `src/data/enemies.ts` | 15 enemy icons | Ten use production enemy art; five later-chapter enemies still use their fallback | Generate the five Chapter 4–5 enemies before enabling those encounters. |
| Companion records and UI | 3 companion icons plus direct render sites | Portraits exist, but three UI surfaces still print the emoji directly | Replace those direct render sites with existing portraits. |
| Watchhouse evidence cards | 9 direct icons | Stock emoji are always visible | Replace all nine in the next Watchhouse pass. |
| Level-up modal | 6 direct icons | Five bespoke transparent emblems; no header ornament | Complete. Keep the five stored emoji only as image-error fallbacks. |
| Quest, QA, and navigation state | check, warning, play, arrows, bullets, close marks | Compact semantic controls | Keep. These communicate interface state rather than pretending to be story artwork. |

### Priority 1: Watchhouse environment and evidence cards

The Watchhouse is the most concentrated current-play stock-icon surface and the one shown in the 2026-07-16 playtest screenshot. It should be updated as one coherent environment pass.

#### People inside

Replace the plain **Talk with Enna** and **Talk with Hollis** buttons at the Watchhouse table with two compact portrait-led talk cards:

| Control | Existing art | Treatment |
|---|---|---|
| Talk with Enna | `enna-portrait-v02.webp` | Face-forward crop, name, role label **Watch Clerk**, and a clear **Talk** action. |
| Talk with Hollis | `hollis-portrait-v01.webp` | Face-forward crop, name, role label **Captain**, and a clear **Talk** action. |

Keep the cards beside one another on wider screens and stack them on mobile. The portraits should use the same focal-position treatment as map portrait tokens so faces remain centered. Keep the Westroot briefing and later case actions as ordinary text buttons below the two people; they are tasks, not characters. The existing emoji stored on Enna and Hollis dialogue objects remains fallback-only.

Remove the generic **A focused interior scene.** subtitle from the shared interior header. It adds no information in the Watchhouse and is equally unnecessary in the other named interiors.

Stage the Watchhouse table description with the player's knowledge of Edden:

- Before Edden has been introduced: **Enna keeps the maps pinned down with inkpots and impatience. Hollis stands near the case wall, glancing with grave concern toward a closed door farther down the hall.**
- After the Edden reveal: identify it as Edden's door and let Hollis's watchfulness carry its intended meaning.

The earlier version named Edden before the player had the context to understand why Hollis was watching his door; the environment should foreshadow that concern without prematurely labeling it.

#### Incomplete case wall

| Card | Replacement | New art? |
|---|---|---|
| Missing Porters | Tight detail from the existing Watchhouse duty-ledger art | No |
| Copied Orders | Tight paper-and-seal detail from the existing forged-orders file art | No |
| Supply Delays | Cargo/basket detail cropped from the Bramblecross Willow Market area | No |
| Road-Side Evidence Missing | Text-only dashed placeholder labeled **Awaiting field evidence** | No |

#### Completed case wall

| Card | Replacement | New art? |
|---|---|---|
| Lio's Satchel | Existing courier-satchel close-up | No |
| Planted Order | Existing Lantern Road milestone/hidden-order crop | No |
| Willow Seal | Selected `assets/icons/ui/willowmark-seal-v02.png`; Ada's green three-leaf mark is shown on a crate lid with a deliberately tiny nick in the left leaf | No — v2 selected and wired; v1 retained as an alternate |
| Root Cellar | Existing Bramblecross cellar entrance or Root Cellar stair crop | No |
| False Crown? | Existing transparent Briar Crown mark | No |

Implement these through a small reusable evidence-thumbnail/card component that accepts an existing dialogue-art key or a map crop. If a crop is illegible at card size, prefer a deliberate text-only card over another stock symbol. The completed case-wall illustration remains the wide establishing image above the individual clues.

### Priority 2: Companion surfaces

Existing portraits are sufficient; no generation is needed.

1. In the Companion tab, replace the large active-companion emoji with the companion portrait.
2. In the unrecruited-companion list, replace the inline emoji/name row with a small portrait and name.
3. In the battle party card, replace the large companion emoji with the same portrait treatment used for the hero and enemies.
4. Retain `COMPANION_OPTIONS.icon` only as an image-error fallback.

### Priority 3: currently reachable item placeholders

Three Chapter 2 items lack an `ITEM_ARTWORK` entry and therefore expose text or emoji-like placeholders during normal play. Existing art can cover all three:

| Item | Replacement source |
|---|---|
| Split Crown Slat | `crown-den-slat-rack-broken-token-v01.png` |
| Briar Signmaker's Ledger | `crown-den-witness-ledger-token-v01.png` |
| Cleaned Lantern Mark | `crown-den-false-map-cleared-token-v01.png` |

Register focused variants or reuse the source directly, depending on legibility at inventory size. Keep the item record's `icon` as the failure fallback.

### Priority 4: level-up presentation

The decorative sparkle beside the level-up title has been removed; the modal does not need an ornamental substitute. The five growth choices now use one coherent set of small, transparent, storybook-painted emblems:

| Growth | Emblem direction |
|---|---|
| Power | Hatchet or blade striking through a briar |
| Resolve | Roadwarden shield braced against roots |
| Cleverness | Open route map with one honest path illuminated |
| Heart | Warm lantern held between two hands |
| Craft | Well-used handcrafting tools |

Production files live at `assets/icons/ui/level-up-*.png` and are registered in `src/data/growthArtwork.ts`. The source emoji remain only as resilient image-error fallbacks, per the project fallback rule.

### Priority 5: later-chapter art backlog

These records are not defects in the current Chapter 1–3 play path, but their fallback icons will become visible when their content is enabled. They are already represented in `src/data/artworkPlan.ts` and should remain on the production-art backlog.

| Type | Needs artwork before normal play |
|---|---|
| Chapter 4–5 items | Folded Map Scrap, Lanternwell Drop, True Seal Fragment, Briar Chain Link, Lio's Courier Knot |
| Chapter 4–5 enemies | Briar Relay Guard, Crown Whisperer, Bracken Voss, Thornseal Guard, Thornroot Sentry |

### Approved fallback and symbol allowlist

Emoji-like source literals may remain only when they meet one of these conditions:

- hidden beneath a real portrait, enemy image, item image, or map token and used only if that image fails;
- retained as non-rendered tile metadata for map debugging or accessibility support;
- used as a compact semantic UI state such as a check, warning, current-step marker, directional arrow, bullet, or close control; or
- attached to content that is not yet enabled, with a named production-art backlog item that must be completed before release.

They should not appear as decoration, evidence thumbnails, character identity, dialogue subject art, level-up decoration, or normal item/enemy presentation.

### Verification plan

1. Add a source-audit rule that flags emoji-like literals outside approved fallback fields and semantic control components.
2. Require an artwork registry entry for every item obtainable in the currently enabled chapters.
3. Require production artwork for every enemy referenced by an enabled encounter.
4. Add browser coverage asserting that the Watchhouse, Companion tab, companion battle card, and level-up modal show no stock emoji during their normal render path.
5. Retain targeted image-error tests proving that approved fallbacks still prevent broken-image holes.
6. Acceptance criterion: no stock emoji is visible in an ordinary Chapter 1–3 playthrough, including interiors and secondary menus.

## Visual Rules

| Dialogue subject | Preferred treatment | Avoid |
|---|---|---|
| Named person | Existing half-body portrait | A symbol for the person's job |
| Enemy or hostile group | Existing enemy painting; use the lead threat for a group | Crossed swords, skulls, monster emoji |
| Door, building, landmark, or map feature | Tight crop from the painted map or an existing door scene | Door, house, map, or pin icons |
| Important evidence object | Bespoke close-up or a crop from a larger evidence scene | Scroll, book, box, star, and crown emoji |
| Chapter transition or system outcome | Existing wide scene/map, or text-only | Decorative sparkle or book icons with no story value |

Small square art should be reserved for real portraits and object close-ups. Locations should use the existing wide vignette treatment so the painted world does the visual work.

## Existing Art: Character and Creature Dialogues

These replacements require wiring and alias cleanup, not new generation.

| Dialogue titles or group | Current stock fallback | Replacement | Implementation note |
|---|---|---|---|
| Smith Orin | hammer/tools | `smith-orin-portrait-v02.webp` | Resolve by a stable `smithOrin` art key. |
| Elder Brynn | wizard | `mira-portrait-v01.webp` | Existing title lookup works; make it explicit. |
| Pibble Thatch | toolbox | `pibble-portrait-v01.webp` | Existing title lookup works; make it explicit. |
| Nix Fernwhistle | bow | `nix-portrait-v01.webp` | Existing title lookup works; make it explicit. |
| Watch Clerk Enna / Enna | file box | `enna-portrait-v02.webp` | Keep both display names mapped to one portrait. |
| Captain Hollis | shield | `hollis-portrait-v01.webp` | Existing title lookup works; make it explicit. |
| Ada Willowmarket / Ada's Seal Lesson / Leave Without Ada's Lens? | basket, lens, or map | Ada portrait with the correct lens/no-lens variant | Use the no-lens portrait after the player borrows the lens. |
| Mara Brindle / Mara at the Crown Door / Mara at the Lantern Door / Mara at the Threshold | thread | `mara-brindle-portrait-v01.webp` | Dynamic titles need `portraitName` or an art key. |
| Edden's Recovery Room | scroll | `edden-vale-portrait-v01.webp` | Already uses `portraitName`; retain. |
| Mayor Anwen | crown | `mayor-anwen-portrait-v01.webp` | Existing title lookup works. |
| Nella the Baker / Toma Fielding / Sela of the Loom | tile-specific icons | Existing Nella, Toma, and Sela portraits | Dynamic `TILE_META` dialogue must pass the NPC art key. |
| Rowan Reedshield / Tilda Quickstep / Moss Fenmere and companion reads | companion icons | Existing companion portraits | Use companion id, not a generated dialogue title such as `Rowan Reedshield's Read`. |
| Bramwell Gatehand / Chapter 3 First Gate | diamond | Bramwell portrait plus `westroot-arrival-scene-v01.webp` where already used | No new art. |
| Quill Pebbleturn | house symbol | `quill-pebbleturn-portrait-v01.webp` | No new art. |
| Auntie Lume | bread | `auntie-lume-portrait-v02.webp` | No new art. |
| Noma Greenstill | flower | `noma-greenstill-portrait-v02.webp` | No new art. |
| Rootbread child / The Rootbread Promise | bread | Child portrait for conversation; `rootbread-promise-scene-v01.webp` for the reveal | Some branches currently omit `portraitName`; make them consistent. |
| Worried Traveler / Traveler's Tracks | suitcase | `worried-road-traveler-portrait-v01.webp` when the traveler is present; a map crop for tracks after they leave | Add `Worried Traveler` as a portrait alias or pass the stable art key. |
| Bramble Boar | boar emoji | `bramble-boar-v01.webp` | Already registered; retain. |
| Suspicious Roadside Figures / Roadside Ambush | crossed swords | `thorncoat-ruffian-v02.webp`; optionally include the hound only in a wide encounter treatment | Reuse the lead enemy art; no new scene is necessary. |
| Rustroot Skulk | scorpion | `rustroot-skulk-v02.webp` | Register enemy art with the dialogue resolver. |
| Briar Knot Warden | monster face | `briar-knot-warden-v01.webp` | Register enemy art with the dialogue resolver. |
| Briar Roadwatcher / Briar Roadwatcher Ambush / Roadwatcher reward | eye | `briar-roadwatcher-v02.webp` | Reuse the same art across encounter and aftermath. |
| False Sign Guard / Signworks Patrol | punctuation or scroll | `false-sign-scratcher-v02.webp` | Use the lead enemy from the encounter. |
| Thorn-Collared Hound | generic scroll in reward dialogue | `thorn-collared-hound-v01.webp` | Use enemy art. |

## Existing Art: Places, Doors, and World Interactions

### Already assigned to painted map crops

No new artwork is needed for these. Their stock `portrait` values can remain fallback-only and should never appear in the normal path.

| Dialogue titles | Existing crop source |
|---|---|
| Home, Smithy, Potion Shed | Hearthhollow map entrance crops |
| Village Well | Hearthhollow well crop |
| South Gate | Hearthhollow south-gate crop |
| Pond Edge | Lantern Road pond crop |
| Milestone Ruin | Lantern Road milestone crop |
| Cart Tracks / Broken Cart | Lantern Road cart crop |
| Road Camp | Lantern Road camp crop |
| Lantern Shrine | Lantern Road shrine crop |
| Road Cache | Lantern Road cache crop |
| Road to Bramblecross | Bramblecross gate crop |
| Bramblecross Inn / Willow Market / Watchhouse | Bramblecross entrance crops |
| Sealed Iron Door / Briar Crown Mark | Root Cellar sealed-door crop |

### Add focused crops from existing maps

These are visible landmarks in production maps or are sufficiently represented by their surrounding location. Add crop definitions before requesting more art.

| Dialogue titles or group | Current fallback | Recommended existing source | New art? |
|---|---|---|---|
| Hearthhollow, Dawn | book | A calm wide Hearthhollow map crop | No |
| Notice Board | scroll | Bramblecross map crop at the notice-board location | No, unless the crop fails visual QA |
| Old Root Cellar | hole | Bramblecross cellar-entrance crop, then Root Cellar stair crop after entering | No, unless the exterior is unreadable |
| Glowcap Cluster | mushroom | Root Cellar map crop around the fungus patch | No |
| Cellar Cache | box | Root Cellar map crop around the cache | No |
| Chapter 1 Complete: The Road That Lied | sparkle | Wide Bramblecross or westward-road crop; text-only is also acceptable | No |
| Westroot / Westroot Briefing | map | Westroot Trail map overview or Bramblecross watchhouse art, depending on the scene | No |
| Leaving Bramblecross / Old Westward Cut | trail or sparkle | Westroot Trail map crop at the route entrance | No |
| Roadside Shelter Nook | house symbol | Westroot Trail shelter crop | No |
| False Detour Notice | exclamation mark | Westroot Trail false-notice crop | No |
| The Three-Sign Hollow | number 3 | Westroot Trail hollow crop | No |
| Traveler's Tracks | suitcase | Lantern Road track/camp crop when the traveler is absent | No |
| Rootmarket | house symbol | Westroot Hub Rootmarket crop | No |
| Mossgarden | flower | Westroot Hub Mossgarden crop | No |
| Witness Stone Carvings and early puzzle branches | circle symbol | `witness-stones-scene-v01.webp` or a Westroot Hub crop | No |
| Cargo Siding setup and aftermath | block symbol | Westroot Hub crop before the reveal; `cargo-siding-evidence-scene-v01.webp` after it | No |
| Split Hall setup and resolution | bars symbol | Westroot Hub crop before the decision; `split-hall-resolution-scene-v03.webp` for the resolution | No |
| First Westroot Gate / Chapter 2 Complete | square or sparkle | Existing door closeup and `westroot-threshold-opening-v02.webp` | No |

### Existing bespoke scenes and object art

Keep these in place and remove their stock-looking fallback from the normal rendering path:

- Edden's Drawing: `eddens-three-door-drawing-scene-v01.webp`
- Three-Door Threshold: `three-doors-threshold-v01.webp`
- Crown Door, Lantern Door, and No-Handle Door: their existing closeup scenes
- Crown Sign, Lantern Sign, Door Waits, Door Listens, Door Opens, The Crown Door Holds, and companion threshold reads: reuse the appropriate door closeup rather than their symbolic `portrait` value
- Crown Door Den vestibule, wax table, slat rack, witness ledger, kennel, guard, and false map: existing painted map tokens and tension art
- The Signworks Finds You: existing Crown Door Den pursuit/tension art
- Chapter 3 arrival, Witness Stones, Rootbread Promise, Cargo Siding evidence, Split Hall resolution, and Mossgarden closing: existing production scenes

## Story Evidence and Battle Aftermath

This is the part of the inventory where new artwork provides the most value.

| Dialogue title or reward | Current fallback | Best replacement | New art? |
|---|---|---|---|
| Courier Satchel | scroll | Dedicated wide evidence close-up of the scuffed satchel, brass courier badge, forged order, and blue-string lunch packet | **Yes - required** |
| Dropped Orders | generic reward scroll | Thorncoat Ruffian art for v1; optional forged-orders close-up later | No for v1 |
| Broken Shell | generic reward scroll | Rustroot Skulk art, with the copy explaining the root fiber | No |
| Briar Knot Warden reward | generic reward scroll | Briar Knot Warden art | No |
| Briar Roadwatcher rewards | generic reward scroll | Briar Roadwatcher art; item art can appear in the loot strip | No |
| False Sign Guard / Signworks Patrol rewards | generic reward scroll | False Sign Scratcher art | No |
| Thorn-Collared Hound reward | generic reward scroll | Thorn-Collared Hound art | No |
| Cargo Siding Cleared | generic reward scroll | Existing Cargo Siding evidence scene | No |
| Evidence Board | pushpin | Shared Bramblecross watchhouse case-wall scene, focused on the connected evidence board | **Yes - recommended** |
| Duty Ledger | books | Same watchhouse scene, focused on the open altered ledger | **Yes - covered by shared scene** |
| Wall Map | map | Same watchhouse scene, focused on the pinned route map | **Yes - covered by shared scene** |
| Forged Orders File | paper | Same watchhouse scene, focused on the waxed order file | **Yes - covered by shared scene** |
| The Case Wall Changes / Bramblecross Watchhouse | file box or map | Full shared watchhouse case-wall scene | **Yes - covered by shared scene** |
| Root Sigil | star/sigil | One shared Root Cellar evidence-wall scene, focused on the recent dark-green root mark | **Yes - recommended** |
| Route Mural | brick | Same Root Cellar evidence-wall scene, focused on the old route mural | **Yes - covered by shared scene** |
| The Briar Crown | crown | A bespoke crooked Briar Crown mark derived from a new symbol master | **Yes - recommended** |
| Defeat | skull | Text-only over the dimmed battle background; do not add a decorative image | No |

## New Art Order

Four generated masters are enough to cover the high-value gaps:

1. **Courier Satchel Evidence** - required because it is the first major mystery reveal and the current scroll is especially generic.
2. **Bramblecross Watchhouse Case Wall** - one high-resolution scene can provide the full scene and four focused evidence crops.
3. **Root Cellar Evidence Wall** - one high-resolution scene can provide both the Root Sigil and Route Mural crops.
4. **Briar Crown Primary Mark** - a transparent, production-ready mark for the antagonist identity and future UI reuse.

### Integration status — 2026-07-16

- Courier Satchel Evidence: selected, optimized, and wired into the boar reward dialogue.
- Bramblecross Watchhouse Case Wall: selected, optimized, and wired as a full watchhouse scene plus four focused dialogue crops.
- Root Cellar Evidence Wall: selected, optimized, and wired into the Root Sigil and Route Mural dialogues.
- Briar Crown Primary Mark: regenerated with genuine alpha, selected, optimized, and wired into both Chapter 1 Crown-mark reveals. The earlier opaque checkerboard export remains rejected.

Optional only after in-game crop QA:

- a Bramblecross notice-board close-up;
- an exterior Old Root Cellar entrance close-up; and
- a dropped forged-orders close-up if reusing the ruffian art feels repetitive.

The ready-to-paste generation instructions are in `docs/art/prompts/dialog-stock-icon-replacement-prompt-pack.md`.

## Implementation Plan

### Phase 1 - Make dialogue art explicit

1. Add a central dialogue-art registry keyed by stable ids such as `courierSatchel`, `watchhouseEvidenceBoard`, `rootCellarSigil`, and `westrootShelter`.
2. Let a registry entry select one of: character portrait, enemy artwork, map crop, scene image, custom object image, or deliberately text-only.
3. Add an optional `artKey` to dialogue data. Do not use the visible title as the primary identity; several titles are conditional or change by branch.
4. Keep `portraitName` support temporarily so the migration can stay small and reviewable.
5. Preserve the existing emoji field only as an error fallback. The normal render path must require resolved production art before it creates the thumbnail frame.

### Phase 2 - Wire all existing assets first

1. Add dialogue aliases for the worried traveler and dynamic NPC/companion titles.
2. Expose enemy artwork through the dialogue-art resolver instead of duplicating imports.
3. Add the proposed Bramblecross, Root Cellar, Westroot Trail, and Westroot Hub crop definitions.
4. Reuse existing door and Chapter 3 scenes in every related branch, not just the final branch.
5. Add an `artKey` to every battle reward in `BATTLE_REWARDS`; remove the single generic scroll assignment in `finishBattle` from the normal visual path.

This phase should remove almost every stock icon before any new generation is delivered.

### Phase 3 - Integrate the four new masters

1. Preserve selected source PNGs under `assets/reference/source-art/`.
2. Promote opaque dialogue scenes as WebP under `assets/scenes/`; keep the Briar Crown mark as a transparent PNG under `assets/icons/ui/`.
3. Add crop metadata so the watchhouse and cellar master scenes can be reused without exporting many near-duplicate files.
4. Run the asset optimizer and asset audit after promotion.

### Phase 4 - Regression protection

1. Add a rule test that every production dialogue `artKey` resolves to art or is explicitly marked `textOnly`.
2. Add smoke coverage for the Courier Satchel, Evidence Board, Root Sigil, a door interaction, a named NPC, an enemy encounter, a chapter transition, and Defeat.
3. Assert that no stock emoji is visible when its intended production asset loads.
4. Assert that a broken image falls back safely without hiding dialogue text or choices.
5. Visually inspect mobile and desktop layouts. Wide map/scene art must not push choices below an unusable scroll area.

## Acceptance Criteria

- No stock emoji or generic symbol is visible in any normal story dialogue path through Chapters 1-3.
- All named speakers use their production portrait.
- All hostile subjects use production enemy art or a relevant encounter scene.
- All location interactions use a painted map crop or existing scene.
- The Courier Satchel, watchhouse evidence, Root Cellar evidence, and Briar Crown have intentional custom visuals.
- Abstract/system dialogues are text-only or use an existing wide scene; they do not receive decorative stock art.
- Missing-image fallback behavior remains safe and testable.
