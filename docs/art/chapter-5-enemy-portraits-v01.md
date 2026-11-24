# Briarhold boss portrait candidates v01

**Current set v03 — accepted designs:** the owner has accepted **Bracken v01, Thornroot Sentry v01, Hearthvale elite guard v02 and ordinary Rainroot guard v01**. The new local guard has warm tan/olive-brown skin, dark wavy hair, a weathered leather cap, patched quilted work coat, a round buckler and a short spear at the amber-lit receiving gate. His simpler local equipment is distinct from the elite's rectangular shield, metal cap and ledger case.

- [Rainroot guard native PNG](../../assets/reference/concepts/chapter-5-enemies/rainroot-local-guard-concept-v01.png): 1254×1254.
- [Optimized reference WebP](../../assets/reference/concepts/chapter-5-enemies/rainroot-local-guard-portrait-v01.webp): 1200×1200, 223,420 bytes.
- [Full generation prompt](../../assets/reference/concepts/chapter-5-enemies/rainroot-local-guard-prompt-v01.md); built-in image_gen was used.
- [Current four-design review and Sentry comparison](../../assets/reference/concepts/chapter-5-enemies/enemy-portrait-review-v03.html), served at `http://127.0.0.1:5185/assets/reference/concepts/chapter-5-enemies/enemy-portrait-review-v03.html`.

Build with `node scripts/build-chapter5-enemy-review.mjs v03`. Native output/provenance and acceptance are recorded in `generation-v03.json`. The standalone v03 review passes at 1280×720, 390×844 and 430×932: all twelve image instances decode, with no page errors or horizontal overflow. Native art and the desktop review were visually inspected. These accepted designs are retained in reference while role-aware runtime portrait binding remains next work.

**Earlier Sentry found:** `assets/portraits/enemies/seal-forged-sentry-v01.webp` is already registered for the **Seal-Forged Sentry**, the paper/wax/order-sheet/route-tag/thorn-cord construct in Chapter 3's Cargo Siding and Chapter 4's hard Underway ambush and Relay Post. The new **Thornroot Sentry** is a separate Chapter 5 root-and-timber support with its own existing enemy ID/mechanics and now its first saved portrait. Both are shown side by side in v03; retain the earlier accepted asset and identity.

**Current update — November 19:** the owner established Bracken and his elite guards as **Hearthvale humans**, with ordinary local guards from **Rainroot**. The current elite portrait is **v02**, generated with built-in image_gen as a targeted edit of v01 using the selected Hearthvale male hero as a heritage reference. Equipment, stance, shield, ledger case, room and practical lighting are preserved. The earlier v01 remains historical. Portrait details remain candidates; the heritage assignments are now canonical.

- [Revised elite guard native PNG](../../assets/reference/concepts/chapter-5-enemies/thornseal-guard-concept-v02.png): 1254×1254.
- [Revised reference WebP](../../assets/reference/concepts/chapter-5-enemies/thornseal-guard-portrait-v02.webp): 1200×1200, 181,248 bytes.
- [Exact v02 edit prompt](../../assets/reference/concepts/chapter-5-enemies/thornseal-guard-prompt-v02.md).
- [Current v02 offline review](../../assets/reference/concepts/chapter-5-enemies/enemy-portrait-review-v02.html), also served at `http://127.0.0.1:5185/assets/reference/concepts/chapter-5-enemies/enemy-portrait-review-v02.html`.

`generation-v02.json` records the edit target, supporting reference and exact native output. Build the current review with `node scripts/build-chapter5-enemy-review.mjs v02`; an explicit `v01` argument rebuilds the historical set. Neither review registers art in the running game.

V02 standalone review checks pass at 1280×720, 390×844 and 430×932: all seven image instances decode at 1200 px, the four/two-column layout and 80/64 px portrait boxes match the live treatment, and there are no page errors or horizontal overflow. `review-checks-v02.json` and three full-page captures are retained alongside the new portrait. The native edit and desktop composition were visually inspected for the Hearthvale face and preserved kit/room. The development server on 5185 still returns 200; no game code or save was changed by this revision.

Generated **November 18, 2026**, with the **built-in image_gen tool**, while the owner playtests the integrated approach/rescue maps. These are first-pass reference candidates. They are not registered in `ENEMY_DB`, and this art pass changes no running game code, portrait registry, combat behavior or save.

## Saved images and exact prompts

All deliverables are in `assets/reference/concepts/chapter-5-enemies/`.

| Candidate | Native output | Optimized reference | Full prompt |
|---|---|---|---|
| Bracken Voss | [1254×1254 PNG](../../assets/reference/concepts/chapter-5-enemies/bracken-voss-concept-v01.png) | [1200×1200 WebP](../../assets/reference/concepts/chapter-5-enemies/bracken-voss-portrait-v01.webp), 171,530 bytes | [Bracken prompt](../../assets/reference/concepts/chapter-5-enemies/bracken-voss-prompt-v01.md) |
| Thornseal Guard | [1254×1254 PNG](../../assets/reference/concepts/chapter-5-enemies/thornseal-guard-concept-v01.png) | [1200×1200 WebP](../../assets/reference/concepts/chapter-5-enemies/thornseal-guard-portrait-v01.webp), 219,086 bytes | [Guard prompt](../../assets/reference/concepts/chapter-5-enemies/thornseal-guard-prompt-v01.md) |
| Thornroot Sentry | [1254×1254 PNG](../../assets/reference/concepts/chapter-5-enemies/thornroot-sentry-concept-v01.png) | [1200×1200 WebP](../../assets/reference/concepts/chapter-5-enemies/thornroot-sentry-portrait-v01.webp), 277,122 bytes | [Sentry prompt](../../assets/reference/concepts/chapter-5-enemies/thornroot-sentry-prompt-v01.md) |

The native tool outputs remain at their original generated-image location as well as in the workspace. `generation-v01.json` records exact output filenames and prompt associations; `export-v01.json` records source dimensions and derivative sizes. No crop, semantic edit or identity alteration was made during export.

## Direction and continuity

**Bracken:** a Hearthvale human, lean, clean-shaven and graying, in a charcoal road-office coat. Controlled expression, ink-stained cuffs, plain sheathed sabre, seal stamp and route ledger communicate institutional work and local control. Heritage is canonical; detailed age, face and costume remain portrait proposals. His institutional/patronage connections place him below the operational architect; no noble title or royal family relationship has been assigned.

**Elite guard, current v02:** a sturdy, watchful Hearthvale man with a fair/light weathered complexion, brown-blond loosely waved hair, gray-blue eyes and restrained stubble. The open iron cap, plank shield, ledger case, keys, short sidearm, uniform and composition carry over from v01. Individual Hearthvale guards can vary in complexion/hair/eyes. The faction marks remain illustrative proposals; exact UI/puzzle symbols retain their existing authoritative art. The earlier warm-brown, close-curled v01 was a provisional face without settled heritage and is superseded for this elite role.

**Ordinary local guards:** Rainroot humans, now represented by the accepted `rainroot-local-guard` v01 design. The earlier elite v01 is historical and has not been relabeled as a local guard. Runtime art selection must account for personnel role/encounter context, because `thornseal_guard` mechanics also back local guards and some workroom opponents. The records officer and Dessa retain their own identities despite that mechanical reuse. A guard's heritage does not change when he moves between posts or investigates a disturbance.

**Sentry:** a worker-built timber frame with compressed bound roots, iron hinges, leather lashings, repair brace and a visible feed cord/pulley. A slatted wooden head and green-glass lenses replace a human face. Practical green oil light illuminates the room; the design adds no glowing runes, tree-spirit origin or supernatural route agency. Its broad root arms and trailing tendrils support the existing stance disruption and sweep attacks.

The three have a shared subdued charcoal/green/brown palette and traditional painted finish. Existing Hollis and Briar Relay Guard portraits were inspected for series context; neither was edited or supplied as a character-identity target. Face/hand rendering and equipment were inspected in the generated native images and reference derivatives. Detailed portrait designs remain subject to owner taste/identity review; the November 19 Hearthvale/Rainroot casting decision is settled.

## Review and checks

Open the [self-contained offline review](../../assets/reference/concepts/chapter-5-enemies/enemy-portrait-review-v01.html), or while the development server is running:

`http://127.0.0.1:5185/assets/reference/concepts/chapter-5-enemies/enemy-portrait-review-v01.html`

The review includes all full portraits and the current four-enemy order at battle-card scale: Bracken, Sentry, Guard, Guard. It reproduces the current `object-contain` / 4 px padding, 80 px desktop and 64 px phone portrait boxes, four columns above 1024 px and two below. This checks the image treatment, not the full live battle layout, and does not claim the art is already integrated.

`node scripts/build-chapter5-enemy-review.mjs` regenerates the reference WebPs and embedded review. Headless standalone browser inspection passed at **1280×720, 390×844 and 430×932**, with all seven displayed image instances decoded at 1200 px, expected portrait heights/column counts, zero page errors and no horizontal overflow. The three full-page captures and `review-checks-v01.json` are saved beside the art; desktop and phone compositions were visually inspected. The headless contexts did not load the game or access the owner's save.

No new game regression run is needed for these unregistered reference images. The preceding map integration's build/rules/chapter/smoke results remain the current game verification. The owner's server on **5185** stays running.

## Next

Promote the four owner-accepted designs through role-aware portrait selection with the existing emoji fallbacks; keep the older Seal-Forged Sentry registered as its own enemy. The remaining map priority is the coordinated hub/records/workshop/signal/return masters and paintings. Remaining cast references include Orren, Sella, Hesta and Dessa before repeated group scenes. Follow [the room/long-narrative scene plan](chapter-5-scene-art-plan.md) for grille, rescue/reunion, court rest, substantial room passages, journey and ending artwork. This portrait batch is not completion of that scene queue.
