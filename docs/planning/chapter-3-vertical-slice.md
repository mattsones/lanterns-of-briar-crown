# Chapter 3 Vertical Slice Contract

## Promise

Chapter 3, **The Hidden Root**, reveals Westroot as a living Stonekin and Mossback road-community rather than merely a tunnel or storehouse. Its central conflict is whether safety requires Westroot to close itself again, or whether witnessed truth must travel outward so the Briar Crown cannot isolate settlements with different lies.

## Entry contract

Start from `public/saves/chapter-2-complete.json`. Entry requires the Chapter 2 completion, open-gate, Lio-survival, validated-drawing, and Briar-Crown-watcher flags. The first playable build must not require replaying Chapter 2.

## Smallest complete playable loop

1. Enter through the First Westroot Gate.
2. Move through the painted Westroot hub containing First Gate, Rootmarket, Witness Stones, Mossgarden, Split Hall, and Cargo Siding.
3. Use Rootmarket as a location hub: approach Quill or Auntie Lume independently, and hear ambient villagers whose concerns cross ancestry lines.
4. Trigger the mandatory Hold Bell crisis and hear the first Split Hall debate; Stonekin and Mossbacks must appear on both sides of the conflict.
5. Join Westroot at the shuttered Witness Stones for a public renewal: Bramwell and Noma open the lawful emergency hold together, and the player chooses which shared road promise the town should act on first.
6. Investigate Willow-sealed cargo and fight a simultaneous multi-enemy encounter.
7. Return the evidence to Split Hall, where earlier testimony is remembered.
8. Finish with `westrootTrustEarned`, `witnessStoneSequenceSolved`, `willowCargoExposed`, and `chapterThreeClear` set.

## Build order

- Data-only hub and story scene definitions.
- Placeholder graph and tokens using fallback art.
- Chapter 3 start and golden-path Playwright coverage.
- Dialogue pass and companion reactions.
- Final map, portraits, enemies, items, and symbols.

Chapter 1 and Chapter 2 golden paths remain required gates throughout.
