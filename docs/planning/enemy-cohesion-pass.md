# Enemy Art and Combat Cohesion Pass

Status: complete and integrated on 2026-08-22.

The owner authorized an autonomous roster-wide review after the Chapter 4 enemy production work. Every enemy was evaluated as one combined character-design and combat-design problem: portrait finish at the live battle-card crop, name, silhouette, equipment, location, HP, damage profile, intent names, and implemented effects.

## Result

- All twelve live enemy portraits pass the restrained skin-rendering standard. No additional ImageGen edit was warranted: exposed faces remain clean at the actual card crop, while creature hides, root shells, masks, and deliberately obscured faces retain useful material texture.
- The existing names and visual concepts remain distinct and story-consistent. No rename or redesign is recommended.
- The mechanical audit found the real gap: most pre-Chapter-4 intent names were cosmetic labels over plain damage. Every roster entry now has at least one implemented role effect, using three readable systems already surfaced by the battle UI: Guard, Shaken, and party-Guard bypass.
- HP and damage dice were preserved. The pass adds tactical identity without silently inflating raw damage.
- Custom battle-log narration now describes the actual source of Guard or Shaken instead of calling every defense “bar the route” or every disruption “words.”
- Bracken Voss and his two Chapter 5 supports receive provisional mechanics grounded in the story bible. Their portrait art remains a Chapter 5 production task.

The battle-card review sheet is preserved at `assets/reference/concepts/enemy-cohesion-pass/enemy-roster-review-v01.webp`.

## Completed roster record

Average damage is the mean of each intent's dice before player defense, Guard, Weakening, or the listed special effect.

| Enemy | Portrait finish and visual/environment read | HP; average damage A / B | Implemented cohesion decision |
|---|---|---:|---|
| Bramble Boar | `bramble-boar-v01.webp`; no smoothing needed. Bramble hide, panic, charge, and Lio's caught satchel all read clearly outside Hearthhollow. | 24; 4.5 / 5.5 | **Wild Charge** bypasses 2 party Guard; **Briar Burst** applies Shaken 1. The animal now fights like a terrified mass of momentum and hooked brush. |
| Thorncoat Ruffian | `thorncoat-ruffian-v02.webp`; exposed face already clean and readable. Human knife-fighter, stitched thorn coat, and stolen-order satchel remain distinct from the Roadwatcher. | 22; 4.5 / 5.5 | **Knife Rush** bypasses 1 Guard; **Dirty Trick** applies Shaken 1. Fast pressure and cheap misdirection now match the silhouette. |
| Thorny Hound | `thorny-hound-v01.webp`; animal texture is appropriate, with no skin smoothing needed. Natural briar-tangled road threat remains visibly different from the commanded hound. | 14; 3.5 / 4.5 | **Snap Lunge** bypasses 1 Guard; **Briar Bark** applies Shaken 1. It is the quick, low-HP disruptor of the early wild encounter. |
| Rustroot Skulk | `rustroot-skulk-v02.webp`; no exposed face or smoothing need. Treated root fiber, splintered shell, and cellar assignment read immediately. | 30; 6.0 / 6.5 | **Root Snap** bypasses 2 Guard. **Claw Flurry** remains pure multi-hit damage, preserving a simple contrast between surface pressure and an attack from below. |
| Briar Knot Warden | `briar-knot-warden-v01.webp`; masked construct needs no smoothing. Root armor, rusted chains, boards, and forged badge fit the Root Cellar boss. | 38; 7.5 / 9.0 | **Chain Slam** bypasses 2 Guard; **Root Surge** grants 5 self Guard. The boss alternates direct chain pressure with rebuilding its knotted body. |
| Briar Roadwatcher | `briar-roadwatcher-v02.webp`; face passes at card size. False sign tools, road cloak, copied crown patch, and Westroot threshold make the scout role specific. | 28; 6.5 / 7.0 | **False Command** applies Shaken 1; **Thorn Lash** bypasses 2 Guard. This establishes the weaker field version of the Crown Whisperer's later control style. |
| False Sign Scratcher | `false-sign-scratcher-v02.webp`; face is intentionally shadowed, not artifacted. Small root-and-slat support silhouette fits the Crown Door workshop and Roadwatcher ambush. | 18; 4.5 / 4.5 | **Scrape Mark** grants 3 Guard to an ally; **Pocket Sand** applies Shaken 1. The support enemy now changes the fight instead of duplicating a weak attacker. |
| Thorn-Collared Hound | `thorn-collared-hound-v01.webp`; no smoothing needed. The heavy control collar, harried posture, and darker body clearly separate it from the wild Thorny Hound. | 18; 5.5 / 6.0 | **Forced Lunge** bypasses 2 Guard; **Collar-Snap** remains direct damage. Its stronger pressure reads as coercion by the collar rather than greater natural aggression. |
| Briar Cargo Runner | `briar-cargo-runner-v01.webp`; exposed face remains readable without extra smoothing. Sealed freight, rail siding, and active escape pose strongly match the Westroot encounter. | 24; 6.5 / 6.0 | **Slip the Siding** grants 3 self Guard; **Seal-Cloth Feint** applies Shaken 1. The runner now uses freight and forged procedure to survive long enough to flee. |
| Seal-Forged Sentry | `seal-forged-sentry-v01.webp`; faceless paper-and-wax construct needs no smoothing. Its order sheets, route tags, thorn cord, and giant wax seal are uniquely literal. | 26; 6.5 / 5.5 | **Stamp Command** applies Shaken 1; **Waxen Guard** grants 3 Guard to self and ally. It functions as the procedural support construct promised by its appearance. |
| Briar Relay Guard | `briar-relay-guard-v02.webp`; approved smoothed face remains live. Gate-pole, braced stance, rail, signal shutters, and occupied Relay setting all agree. | 32; 4.5 / 7.0 | **Bar the Route** grants 4 Guard to self and ally; **Seal-Cloth Strike** is the heavier damage turn. No further change after the Chapter 4 case study. |
| Crown Whisperer | `crown-whisperer-v02.webp`; approved smoothed face remains live. Controlled expression, whispering gesture, sealed papers, and Relay shadows read as elite psychological pressure. | 24; 6.0 / 5.5 | **Frighten the Road** applies Shaken 2; **Wrong-Way Murmur** bypasses 3 Guard. No further change after the Chapter 4 case study. |
| Bracken Voss | Portrait still needed for Chapter 5. Art should show a calm regional cellmaster controlling route machinery, not a generic armored warlord. | 44; 10.0 / 8.5 | **False Order** applies Shaken 2; **Commanding Seal** grants 5 Guard to self and ally. These are provisional until the Chapter 5 lantern-counterplay is implemented. |
| Thornseal Guard | Portrait still needed for Chapter 5. Keep this a living disciplined guard with ledger/shield language so he cannot be mistaken for the Seal-Forged Sentry construct. | 28; 6.5 / 7.0 | **Guard the Ledger** grants 4 Guard to self and ally; **Thornseal Bash** bypasses 2 Guard. |
| Thornroot Sentry | Portrait still needed for Chapter 5. Make it a rooted route-control construct rather than another paper-seal body or hound. | 32; 6.5 / 8.0 | **Root Snare** applies Shaken 2; **Briar Sweep** bypasses 2 Guard. |

## Encounter complementarity

- **Early wilds:** the Ruffian and Thorny Hound alternate light Guard bypass with non-stacking Shaken 1; neither invalidates the other.
- **Roadwatcher groups:** the Roadwatcher controls, the commanded hound pressures Guard, and the optional Scratcher protects an ally or disrupts the hero.
- **Westroot cargo:** the Runner hides behind freight while the Sentry projects waxen protection and false-command pressure.
- **Underway and Relay:** the Relay Guard protects the line, the Sentry supports it, and the Whisperer attacks the party's confidence and preparation.
- **Briarhold boss plan:** Bracken combines elite control and command protection; the Thornseal Guard reinforces defense; the Thornroot Sentry controls stance and sweeps through Guard.

Guard uses the strongest current value rather than stacking indefinitely. Multiple Shaken effects use the strongest penalty rather than adding together. This keeps multi-enemy support readable and bounded.

## Verification contract

- Rules coverage checks both intents for all fifteen roster entries.
- Custom narration and ally-only Guard receive focused assertions.
- The affected Chapter 1-4 browser suites must pass before this pass is considered integrated.
- New Chapter 5 portraits should be reviewed against this record before promotion.
