# The Great Survey Of Alderreach — Political World Map

Last updated: 2026-08-22

Status: Selected geographic reference artwork and reusable generation prompt. The map is not wired into the playable build yet. V06 completes the approved composition-preserving lettering revision from the retired principality name to `CORAVENE`.

## Selected Artwork

`assets/reference/source-art/assets/maps/great-survey-of-alderreach-v06.png`

The selected image is a full-size reference source, not an optimized runtime asset. If it enters the game, create a web-ready derivative rather than importing the source PNG directly.

Version 06 preserves Version 05's accepted terrain-led composition, broad mainland Ember Coast, separate Saltwake Isles, and distinct national, provincial, council, city, and fortress symbols. Its sole intended revision is the painted `CORAVENE` principality label. V01–V04 remain preserved as earlier geographic references, and V05 remains preserved as the superseded pre-rename source.

## What The Object Is

This is a surviving copy of the Crown's Great Survey, completed about twenty-five years before the present story after a ten-year national mapping project.

The original ink shows only places the surveyors could verify. Westroot had already hidden itself about thirty years earlier, no keeper answered the survey, and contradictory local references were not enough to place it responsibly. Its absence is therefore evidence of the Survey's limits, not surveyor incompetence or conspiracy.

The graphite circle, route, and note **WESTROOT — NOT IN SURVEY** were added after the events of Chapter 3, when Quill's first named warning reaches Enna and Bramblecross can once again place Westroot in a witnessed record.

## Best Story Uses

1. Unlock the map as the Chapter 3 completion reward or Chapter 4 opening transition.
2. Show Enna's copy on the Bramblecross case wall, with Quill or Enna penciling Westroot onto it.
3. Use a crop during the first explanation of the political ladder: Hearthhollow, Bramblecross, Lanthorne, and Hearthward.
4. Use later crops when Elowen's Royal Progress, the western border, Cinder Vale, or the Cairn Cantons become relevant.

Do not display the penciled Westroot version before the party has found Westroot unless it is clearly framed as a non-diegetic player reference.

## Required Diegetic Map States

The selected v06 source is the **post-Chapter-3 reference state** because the graphite Westroot circle, route, and note are already present. It is not the clean Survey copy that Enna can display during Chapters 1–2.

Any later runtime integration should derive two clearly named states without rewriting the v06 source:

1. **Clean Survey, before Chapter 3:** preserve all official ink and remove or mask only the later graphite Westroot circle, connector, and note. Enna may compare this copy with older courier scraps and explain that the Survey ends where verified knowledge ended.
2. **Witnessed correction, after Chapter 3:** show the graphite Westroot correction only after Quill's first named warning reaches Bramblecross. Add the responsible witness name and in-story date in a legible annotation, overlay, caption, or transition treatment. The current v06 pixels do not contain that name or date, so the surrounding presentation must supply them before the image is treated as the completed diegetic correction.

Do not use the annotated v06 source as an ordinary wall map in an earlier chapter, and do not imply that the original surveyors placed or erased Westroot.

## Scale And Local Travel Use

V06 is the selected national political composition, not the executable travel-time contract for the playable local routes. Its settlement labels and symbols are spaced for national readability, while Chapters 1–3 already establish the playable pacing from Hearthhollow to Bramblecross and from Bramblecross to Westroot.

Before runtime integration, validate those local relationships in a dedicated Rainroot crop or local route inset. If literal distances cannot be reconciled with the national scale bar, treat the local labels in the national composition as displaced for legibility and say so in the artifact presentation; do not silently lengthen chapter travel or move the story communities to satisfy an illustrative spacing choice.

The conservative Chapter 4–5 direction keeps the Underway, Listening Mile, Briar Relay Post, and Briarhold Waystation inside Rainroot, east of Riverwatch and the disputed Veyran river march. Those underground sites need not appear on the official Survey. Westward movement after Westroot does not cross into Veyrun unless a later story decision explicitly adds a separate border plot.

## Geographic Reading

| Place | Map relationship |
|---|---|
| Alderreach | Central kingdom containing Rainroot, Hearthvale, Dawnmere, and Sunreach |
| Hearthward | National capital in Hearthvale |
| Lanthorne | Rainroot regional city; above Bramblecross in the nested charter system |
| Bellwater | Dawnmere regional capital beside the linked lake-and-river system |
| Saffron Gate | Sunreach regional capital on the plateau at a major southern escarpment pass |
| Bramblecross | Modest interior market town within Rainroot, several days east of the defended frontier |
| Hearthhollow | Tiny village in Bramblecross's rural jurisdiction |
| Westroot | Underground Rainroot junction west of Bramblecross but comfortably inside Alderreach, added later in pencil |
| Underway / Listening Mile / Briarhold | Unmapped underground route complex west of Westroot but still east of Riverwatch and the disputed river march; remains inside Alderreach for Chapters 4–5 |
| Riverwatch | Alderreach fortress guarding a crossing on the disputed western river march |
| Veyrun / Kestovar | Centralized western rival and its inland national capital |
| Cairn Cantons / Cairnmeet | Northern mountain cantons and their accessible conclave seat |
| Mereward League / Sevenbridge | Eastern river-and-lake city-state league and its council seat |
| Ember Coast Principalities / Tideglass | Southern mainland coastal polities and their shared mainland Sea Council port |
| Coravene / Whiteharbor | The queen's mainland Ember Coast principality and its capital port |
| Cinder Vale / Valehaven | Emberling-majority glassmaking and metalworking coastal district and its ordinary civic chief city |
| Saltwake Isles | Separate rugged offshore island chain associated with the Saltwake War |

## Initial Generation Prompt

```text
Use case: infographic-diagram
Asset type: in-world political map and game-lore artifact for Liam's Game
Primary request: Create a complete landscape political map of the known world as the finished Great Survey of Alderreach, with Westroot added later by hand in graphite pencil.
Scene/backdrop: one aged but well-preserved cream parchment sheet lying flat, no desk or surrounding props; subtle folds, survey pinholes, watercolor washes, inked coastlines and rivers.
Style/medium: warm hand-painted children's storybook fantasy cartography; watercolor and gouache with fine brown ink; charming illustrated mountains, forests, lakes, farms, walled cities, ports and tiny ships; precise professional survey map rather than an antique treasure map; visually compatible with the cozy painterly maps in Liam's Game; sophisticated and readable, not cartoonish.
Composition/framing: wide landscape map, north at top. Alderreach fills the center. Conventional west is left and east is right. Include a restrained compass rose, scale bar, title cartouche, and a small clean legend in open water. Keep political regions and roads clearly readable without clutter.
Political geography:
- ALDERREACH is the large central kingdom, divided by subtle dashed regional borders into RAINROOT in the west, HEARTHVALE in the center, DAWNMERE around northern lakes, and SUNREACH in the southern uplands.
- HEARTHWARD is the national capital in Hearthvale, shown with the largest warm walled-city symbol.
- LANTHORNE is Rainroot's regional city, west of Hearthward and northeast of Bramblecross.
- BRAMBLECROSS is a smaller fortified market town west of Lanthorne. HEARTHHOLLOW is a tiny village just east or southeast of Bramblecross inside its rural jurisdiction.
- West of Bramblecross, near low forested hills and still inside Rainroot, add WESTROOT only as a later graphite-pencil correction: a small hand-drawn circle, a dashed penciled route from Bramblecross, and the handwritten note "WESTROOT — NOT IN SURVEY". It must visibly differ from the original professional ink.
- VEYRUN borders Alderreach on the west beyond a fortified, historically shifted boundary. Show straight military roads and one former Alderreach town now on the Veyrun side, without inventing another town label.
- THE CAIRN CANTONS lie north beyond dramatic mountain ranges, with lower Stonekin holds and very high isolated Cloudling shelf settlements.
- THE MEREWARD LEAGUE lies east around navigable rivers and lakes, shown as several prosperous city-states rather than one capital.
- THE EMBER COAST PRINCIPALITIES lie south along a warm sea, divided into several coastal principalities with ports and small internal borders.
- CINDER VALE is a distinct Emberling foundry-and-glassmaking coastal district among the Ember Coast principalities, with a subtle disputed dotted boundary.
- SALTWAKE ISLES lie offshore to the south, a chain of rugged islands with old watchtowers and small sailing ships.
Roads and history: draw the main Lantern Road network as practical gold-brown surveyed roads linking Hearthward to the four regions, Lanthorne, Bramblecross, the northern passes, the Mereward trade roads, and the Ember Coast. The official inked road stops west of Bramblecross; only the later pencil correction reaches Westroot. Show the western boundary as older erased-and-redrawn ink lines, implying past wars. Show Cinder Vale's unsettled border without battle scenes.
Color palette: warm parchment, forest olive, moss green, muted Rainroot teal, Hearthvale wheat gold, Dawnmere mist blue, Sunreach ochre, Veyrun slate red, Cairn gray-blue, Mereward river blue, Ember Coast terracotta; graphite gray for Westroot correction.
Text (verbatim, uppercase unless the pencil note): "THE GREAT SURVEY OF ALDERREACH", "ALDERREACH", "RAINROOT", "HEARTHVALE", "DAWNMERE", "SUNREACH", "HEARTHWARD", "LANTHORNE", "BRAMBLECROSS", "HEARTHHOLLOW", "VEYRUN", "THE CAIRN CANTONS", "THE MEREWARD LEAGUE", "THE EMBER COAST PRINCIPALITIES", "CINDER VALE", "SALTWAKE ISLES", and handwritten graphite "WESTROOT — NOT IN SURVEY".
Typography: elegant highly legible hand-lettered surveyor capitals for original ink; restrained size hierarchy; the Westroot note is visibly rough graphite handwriting. Render every required label exactly once and do not invent additional place names.
Legend symbols only: "ROYAL ROAD", "REGIONAL BOUNDARY", "DISPUTED BOUNDARY", "PENCILED CORRECTION".
Constraints: geographically coherent; Westroot west of Bramblecross; Hearthhollow subordinate and close to Bramblecross; Lanthorne is not the capital; Hearthward is clearly the capital; no magical glowing terrain; no living roads; no character portraits; no armies or battle scene; no modern objects; no decorative monsters; no extra text; no gibberish lettering; no watermark.
```

## Initial Label-Correction Prompt

The selected generation needed one text-only correction pass:

```text
Use case: text-localization
Asset type: correction pass on the just-generated Great Survey political map
Primary request: Preserve the entire map exactly—same geography, borders, routes, cities, parchment, colors, title, legend, compass, scale, and every existing label. Make only these text additions/corrections:
1. Add the country label "ALDERREACH" once, in restrained large surveyor capitals spanning the central kingdom as a subtle background political label without covering HEARTHVALE or HEARTHWARD.
2. Add "THE EMBER COAST PRINCIPALITIES" once along the southern mainland coast, above the SALTWAKE ISLES and outside the SUNREACH regional label, in the same professional ink typography used for neighboring powers.
3. Ensure the graphite note at the penciled western correction reads exactly "WESTROOT — NOT IN SURVEY".
Constraints: change only these labels; preserve all existing label spellings and positions; do not move, redraw, recolor, add, or remove any geography, political boundaries, roads, settlements, islands, ships, cartouches, legend, scale, or compass; no extra text; no watermark.
```

## Version 02 Geography Revision Prompt

```text
Use case: precise-object-edit
Asset type: revised in-world political map for Liam's Game
Input image: the provided Great Survey map is the edit target.
Primary request: Revise only the western geography so Bramblecross and Westroot read as remote Rainroot interior settlements, not exposed border posts. Preserve the map's painterly parchment style and the rest of the known world.
Western geography changes:
1. Push the current Alderreach–Veyrun political border substantially farther west, making RAINROOT a broad region with a deep forested interior. Veyrun and Rainroot must still share a direct border; do not create a separate unclaimed country or a wide empty no-man's-land.
2. Along a few portions of that shared border, show a narrow disputed strip using the existing red disputed-boundary convention, immediately adjacent to the border. The settled current frontier remains legible.
3. Add one clearly fortified but UNLABELED Rainroot border town/castle and two small UNLABELED watch keeps directly on the Alderreach side of the border. These, not Bramblecross, protect the frontier.
4. Move the graphite Westroot correction well inside Rainroot, with a substantial band of forest, hills, roads, and settlements between it and Veyrun. Westroot is an underground Rainroot junction; depict only its penciled surface location/entrance, never as a separate territory. Preserve the exact handwritten note "WESTROOT — NOT IN SURVEY".
5. Place Bramblecross east of Westroot and well away from the border. Reduce Bramblecross to a modest small-town symbol. Keep Hearthhollow very close to Bramblecross but reduce it to a tiny village symbol, clearly subordinate in scale.
6. Add five to seven small UNLABELED Rainroot town and village symbols scattered along practical minor roads throughout the enlarged region. Some should lie north, south, and east of Westroot so the region feels inhabited and Westroot's historical role as a junction serving several settlements is plausible. Do not add new place-name labels.
7. Lanthorne remains Rainroot's clearly larger regional city, northeast/east of Bramblecross and west of Hearthward.
8. The official gold-brown Survey roads may connect Lanthorne, Bramblecross, the border fortress, and the new unnamed settlements. Westroot itself remains absent from official ink; only later graphite may locate it. A few very faint graphite branch hints may radiate from the Westroot correction toward nearby routes, but no new labels or certainty marks.
Composition/invariants: preserve the title, parchment, folds, compass, scale, legend, color palette, typography, all political-region labels, all neighboring-state labels, Hearthward, Lanthorne, Cinder Vale, Saltwake Isles, the Cairn Cantons, Mereward League, Ember Coast Principalities, all coastlines and all central/eastern/southern geography. Preserve north at top, west at left, and every existing required label with correct spelling. Keep ALDERREACH readable. The result should still look like the same artifact revised by the same artist.
Story feeling: Bramblecross and Hearthhollow are several quiet days removed from the defended frontier. Veyrun is a historical and strategic western rival, but residents near Bramblecross do not live as though war might erupt outside their windows. Westroot is hidden beneath ordinary Rainroot countryside.
Constraints: change only the western Rainroot/Veyrun geography and settlement scale described above; no armies, battles, trenches, destroyed villages, giant border wall, magical terrain, living roads, decorative monsters, modern objects, extra named places, gibberish text, or watermark.
```

## Version 02 Final Label-Correction Prompt

```text
Use case: text-localization
Asset type: label correction on the revised Great Survey political map
Primary request: Preserve the entire revised map exactly—same enlarged Rainroot geography, westward Veyrun border, narrow disputed border marks, frontier castle and keeps, forests, unnamed villages, roads, settlement sizes, graphite Westroot correction, all other regions, parchment, colors, title, legend, scale, and compass. Make only these missing-label additions:
1. Add the country label "ALDERREACH" once in restrained large surveyor capitals across the central kingdom as a subtle background political label. Keep it readable without covering city symbols or obscuring regional labels.
2. Add the regional label "HEARTHVALE" once in professional surveyor capitals in the central wheat-gold region around and above HEARTHWARD.
3. Add the city label "LANTHORNE" once beside the existing medium-large walled regional city in northeastern Rainroot, northwest of Hearthward and northeast of Bramblecross.
4. Preserve the graphite note exactly as "WESTROOT — NOT IN SURVEY".
Typography: match the existing professional ink label style and hierarchy; ALDERREACH largest but subdued, HEARTHVALE regional size, LANTHORNE city size; graphite Westroot remains rough handwriting.
Constraints: change only these labels; do not move, resize, redraw, recolor, add, or remove any geography, border, road, city, village, castle, keep, island, ship, cartouche, legend, scale, or compass; preserve all existing text and spellings; no new place names; no extra text; no gibberish; no watermark.
```

## Version 03 Physical-Geography Revision Prompt

```text
Use case: precise-object-edit
Asset type: version 03 of the in-world Great Survey political map for Liam's Game
Input image: the provided v02 Great Survey is the edit target and visual-style reference.
Primary request: Rebuild the physical geography so terrain plausibly creates the regions and cultures, while preserving the established political layout, parchment artifact, painterly style, labels, and Westroot correction. Political organization should read as resting on geography, not as four colored shapes painted onto flat land.

Alderreach physical geography:
1. HEARTHVALE is a broad fertile central river basin. Several navigable rivers and tributaries converge near HEARTHWARD, explaining the capital's location, farmland, roads, and political centrality. Use open wheat fields, orchards, low rolling country, and river crossings.
2. RAINROOT is the wetter western watershed: deep forests, foothills, rain-fed tributary valleys, and low wooded ridges. LANTHORNE stands at a major river confluence where western traffic enters the Hearthvale basin, explaining why it is the regional seat.
3. WESTROOT remains entirely inside Rainroot and underground. Place its later graphite surface correction at a low forested limestone or sandstone ridge where three tributary valleys and old routes converge. It is a hidden junction beneath ordinary countryside, not a territory. BRAMBLECROSS is a modest town east of that ridge at a river crossing; HEARTHHOLLOW is a tiny nearby village in a sheltered agricultural hollow.
4. DAWNMERE is a northern lake country fed by the Cairn mountains. Show linked lakes, wetlands, glacial valleys, and a low moraine/escarpment or watershed divide separating it naturally from Hearthvale while allowing a few roads and rivers through.
5. SUNREACH is a warmer, somewhat drier southern upland or plateau. A broken ridge and escarpment should separate it naturally from the Hearthvale basin, with several river gaps and road passes connecting the two. Southern passes descend toward the Ember Coast.
6. Keep Rainroot, Hearthvale, Dawnmere, and Sunreach as Alderreach administrative/cultural regions, not separate countries. Replace stark dashed internal borders and hard color blocks with very faint thin stippled administrative lines that generally follow ridges, watersheds, rivers, and old roads. Blend the watercolor washes gradually across their edges. Natural terrain must be visually stronger than internal boundaries.

International geography:
7. VEYRUN and Rainroot share a contested river march rather than a mountain wall or empty no-man's-land. Create a narrow western frontier of several roughly parallel rain-fed rivers, braided channels, oxbows, and old riverbeds flowing from northern uplands toward the southwest/southern sea. Different treaty claims follow different channels, shown by restrained overlapping red and brown dotted boundary traces. Do not create a third territory. Keep a clearly fortified but modest Alderreach march town at a major crossing and two small bridge/watch keeps. Bramblecross and Westroot remain several quiet days east of this frontier.
8. THE CAIRN CANTONS remain naturally separated by the major northern mountain chain and a few high passes.
9. THE MEREWARD LEAGUE occupies the eastern river-and-lake watershed. Give its Alderreach border a broad river, marsh belt, and low wooded divide, with trade crossings rather than an arbitrary line.
10. THE EMBER COAST PRINCIPALITIES lie beyond Sunreach's southern escarpment and mountain passes. Organize their settlements around bays, port valleys, river mouths, and coastal roads.
11. CINDER VALE is a coastal industrial valley/district with modest glassworks, furnace chimneys, terraced workshops, and a small port town. It is not a giant castle or national capital. Retain its subtle disputed boundary.
12. SALTWAKE ISLES and the surrounding coast remain coherent and unchanged in overall position.

Settlement-symbol scale:
13. Reduce every city and castle symbol substantially and consistently. HEARTHWARD remains the largest symbol but should be roughly one-third to one-half its current visual footprint. LANTHORNE is medium. BRAMBLECROSS is small. HEARTHHOLLOW is tiny. Border forts are modest.
14. Reduce all Mereward League city-state symbols to small, comparable river/lake cities; none should dominate the eastern half of the map.
15. Reduce Cairn settlements, Ember Coast ports, Sunreach towns, and all other castles to the same restrained hierarchy. Use clustered roofs, walls, towers, ports, or civic buildings rather than oversized fantasy citadels.
16. Replace Cinder Vale's oversized palace with small foundry-town imagery: furnaces, glass domes, chimneys, workshops, and a modest harbor.

Map style and text:
17. Preserve the warm cream parchment, folds, survey pinholes, watercolor-and-gouache storybook cartography, fine brown ink, title cartouche, compass, scale, legend, roads, coastlines, islands, ships, and professional Great Survey character.
18. Preserve north at top and west at left. Keep the overall known-world composition and relative country positions.
19. Required original-ink labels, each exactly once: "THE GREAT SURVEY OF ALDERREACH", "ALDERREACH", "RAINROOT", "HEARTHVALE", "DAWNMERE", "SUNREACH", "HEARTHWARD", "LANTHORNE", "BRAMBLECROSS", "HEARTHHOLLOW", "VEYRUN", "THE CAIRN CANTONS", "THE MEREWARD LEAGUE", "THE EMBER COAST PRINCIPALITIES", "CINDER VALE", "SALTWAKE ISLES".
20. Preserve the later graphite annotation exactly as "WESTROOT — NOT IN SURVEY", with a penciled circle at the hidden ridge junction and faint graphite route hints. It must visibly differ from the official ink.
21. Legend text exactly: "ROYAL ROAD", "REGIONAL BOUNDARY", "DISPUTED BOUNDARY", "PENCILED CORRECTION". Show regional boundary as a fine subtle stipple, disputed boundary as restrained red/brown alternatives, and penciled correction as graphite.

Story feeling: Alderreach is one interconnected country containing overlapping regional cultures shaped by watersheds, climate, agriculture, travel, and old administration. People and families mix across the faint regional lines. The western frontier remains historically unstable because rivers and claims shift; the other international borders are easier to understand from mountains, watersheds, marshes, escarpments, and coasts.

Constraints: preserve the established map's visual identity; no sharp four-color political quadrants; no thick internal borders; no biologically isolated human regions; no giant cities or castles; no giant Cinder Vale palace; no armies, battles, trenches, destroyed towns, enormous border wall, magical glowing terrain, conscious roads, monsters, modern objects, new named places, duplicate labels, gibberish, or watermark.
```

## Version 04 Political-Geography And Settlement Revision Prompt

This pass used the built-in image-editing workflow against v03.

```text
Edit this existing illustrated parchment map into the next authoritative survey-map revision. Preserve its exact overall composition, warm antique parchment, hand-inked watercolor cartography, thin blue rivers, subdued forests, elegant serif map lettering, compass rose, decorative frame, title cartouche, scale, road and boundary styles, and the story geography that already works. This is a geographic and political-label correction, not a new map.

GEOGRAPHY CORRECTIONS
1. VEYRUN: remove the heavy mountain wall from the land immediately west of the disputed western river march. Make Veyrun there a broad inhabited river valley comparable to Rainroot: green river plains, tributaries, forests, farms, and roads on both sides of the braided contested river system. Veyrun should feel like a centralized, settled neighboring kingdom, with slightly more regular fields, planned roads, and controlled crossings. Retain mountains only along the far western and northwestern outer edge. Keep the braided north-south river march and its red disputed boundary; the political uncertainty comes from competing river channels, not a mountain wall.
2. SOUTHERN ESCARPMENT: extend the dramatic cliff/escarpment formation into a long but naturally broken east-west geographic boundary across most of the separation between Alderreach's southern province of Sunreach and the Ember Coast Principalities. Let several rivers cut gorges through it, with small visible waterfalls where plateau rivers descend to the warmer coastal lowlands. Add a few believable passes and switchback roads. Keep the Ember Coast below the cliffs as warm maritime lowland with bays, deltas, ports, and coastal agriculture.
3. CINDER VALE: remove the conspicuous industrial or factory-looking skyline. Make Cinder Vale a natural broad river valley or major break through the escarpment. Its main settlement is an ordinary civic city shown only with the same restrained survey hierarchy used elsewhere; label that city VALEHAVEN. Keep CINDER VALE as a regional label and preserve a subtle disputed boundary.
4. CORAVENE: within the Ember Coast Principalities, add a subtle internal principality boundary and regional label CORAVENE. Place WHITEHARBOR on its coast as its capital.

SETTLEMENT HIERARCHY
Reduce exaggerated castles and city miniatures across the map. Use professional, restrained Great Survey symbols: national capitals as small double-ring stars; regional capitals, assembly seats, and council seats as small single-ring stars; other cities as large solid dots; towns as medium dots; villages as small dots; fortresses as small square/tower symbols. Keep these symbols legible but much smaller than the oversized scenic city drawings. Hearthhollow must remain a tiny labeled village and Bramblecross a modest labeled town. Riverwatch must be a modest fortress, not a giant castle.

PLACE THE FOLLOWING EXACT NAMES IN CLEAN, LEGIBLE SERIF CAPITALS, WITH THEIR APPROPRIATE SYMBOLS
- HEARTHWARD: national capital of Alderreach, existing central location, double-ring star.
- KESTOVAR: national capital of Veyrun, west of the disputed river march in Veyrun's interior, double-ring star.
- LANTHORNE: regional capital of Rainroot, existing river-confluence location, single-ring star.
- BELLWATER: regional capital of Dawnmere, beside the great lake-and-river system, single-ring star.
- SAFFRON GATE: regional capital of Sunreach, near a major southern escarpment pass, single-ring star.
- CAIRNMEET: conclave seat of the Cairn Cantons, in an accessible highland meeting valley or pass, single-ring star; do not place it on an inaccessible summit.
- SEVENBRIDGE: council seat of the Mereward League, at a conspicuous cluster of river, causeway, or lake crossings, single-ring star.
- TIDEGLASS: Sea Council port on the Ember Coast, on the coast, single-ring star.
- WHITEHARBOR: capital of the Principality of Coravene, on Coravene's coast, single-ring star.
- VALEHAVEN: ordinary civic chief city within Cinder Vale, large solid dot, no factory imagery.
- RIVERWATCH: Alderreach border fortress on the eastern side of the braided disputed river march, small square/tower symbol.

REQUIRED EXISTING TEXT — preserve and spell exactly:
THE GREAT SURVEY OF ALDERREACH
ALDERREACH
RAINROOT
HEARTHVALE
DAWNMERE
SUNREACH
HEARTHWARD
LANTHORNE
BRAMBLECROSS
HEARTHHOLLOW
VEYRUN
THE CAIRN CANTONS
THE MEREWARD LEAGUE
THE EMBER COAST PRINCIPALITIES
CINDER VALE
SALTWAKE ISLES
WESTROOT — NOT IN SURVEY (this remains a small graphite pencil annotation at its current Rainroot ridge location, with circled mark and penciled connector)

Add all ten new exact labels: BELLWATER, SAFFRON GATE, KESTOVAR, CAIRNMEET, SEVENBRIDGE, TIDEGLASS, VALEHAVEN, CORAVENE, WHITEHARBOR, RIVERWATCH. Do not invent any other place names and do not add gibberish text.

LEGEND
Keep the existing bottom-left route/boundary legend if space permits. Add a compact symbol key, spelled exactly: NATIONAL CAPITAL; REGIONAL / COUNCIL SEAT; CITY / TOWN; FORTRESS. Preserve ROYAL ROAD; REGIONAL BOUNDARY; DISPUTED BOUNDARY; PENCILED CORRECTION.

Most important: this should read as a practical completed royal survey that happens to be beautiful, with coherent physical geography, standardized political symbols, and clear labels. Do not turn it into a theme-park illustration, do not add modern factories, and do not change Westroot's placement or story logic.
```

## Version 04 Saffron Gate Placement Correction

The first v04 output put Saffron Gate below its own escarpment. This localized edit moved it back into Sunreach without intentionally changing any other map content.

```text
Make one localized cartographic correction to this exact map and otherwise preserve it pixel-for-pixel as closely as possible.

SAFFRON GATE is the regional capital of SUNREACH and must be on the Sunreach plateau, north/above the long southern escarpment—not in the Ember Coast lowlands below it. Remove the current SAFFRON GATE star and label from below the cliffs. Place the same small regional-capital single-ring star and the exact label SAFFRON GATE on the plateau immediately north of the escarpment, beside a believable major pass where a royal road descends by switchbacks through a river-cut gorge. Keep it clearly within SUNREACH and geographically positioned to control that pass.

Do not change any other geography, labels, spelling, symbols, boundaries, roads, waterways, settlements, title, legend, frame, scale, compass, colors, or art style. In particular preserve KESTOVAR, RIVERWATCH, WESTROOT — NOT IN SURVEY, CAIRNMEET, BELLWATER, LANTHORNE, HEARTHWARD, SEVENBRIDGE, VALEHAVEN, TIDEGLASS, CORAVENE, WHITEHARBOR, all region/country labels, the western braided river march, and the long waterfall escarpment exactly as they are.
```

## Version 05 Ember Coast And Symbol-Hierarchy Revision Prompt

This pass used the built-in image-editing workflow against v04.

```text
Use case: precise-object-edit
Asset type: version 05 of the in-world Great Survey political map for Liam's Game
Input image: the provided v04 Great Survey is the edit target. Preserve its warm parchment, decorative frame, title cartouche, compass, scale, watercolor-and-fine-ink style, northern and central geography, roads, political labels, and professional royal-survey character.
Primary request: Correct the political geography of the Ember Coast and make the settlement-symbol hierarchy unambiguous.

EMBER COAST GEOGRAPHY — REWORK THE SOUTHERN THIRD
1. The Ember Coast Principalities are MAINLAND coastal polities directly south of Sunreach's long waterfall escarpment. Broaden the warm mainland coastal shelf between the foot of the cliffs and the southern sea, with bays, river mouths, deltas, coastal farms, and roads. Keep the long cliffs, waterfall gorges, passes, and switchbacks.
2. Move CORAVENE completely off the Saltwake Isles and onto this mainland Ember Coast shelf. Give it a subtle principality boundary on the mainland and place the regional label CORAVENE inside that mainland territory.
3. Move WHITEHARBOR completely off the islands. Place WHITEHARBOR at a sheltered mainland bay or river mouth within Coravene. It is the capital of the Principality of Coravene.
4. Move TIDEGLASS completely off the islands. Place TIDEGLASS at a different mainland Ember Coast harbor, outside Coravene if practical. It is the shared Sea Council port for the several principalities, not the capital of a unified coastal country.
5. Keep CINDER VALE on the eastern mainland as a natural river valley or broad break in the escarpment. Keep VALEHAVEN as its ordinary civic district capital. No factory, furnace, industrial skyline, or giant castle imagery.
6. Put the label THE EMBER COAST PRINCIPALITIES across the mainland coastal belt, not across open water.
7. The SALTWAKE ISLES remain a separate rugged offshore island chain farther south, divided from the mainland by visible sea. Keep the label SALTWAKE ISLES only across those offshore islands. Remove CORAVENE, WHITEHARBOR, and TIDEGLASS from the islands. Do not add any named island city or new place name.

SETTLEMENT SYMBOL HIERARCHY — REDRAW THE LEGEND AND ALL NAMED MARKERS
The current national-capital and regional/council symbols look too similar. Replace them with four unmistakably different survey symbols:
- NATIONAL CAPITAL: a small eight-point star inside TWO concentric rings. Use only for HEARTHWARD and KESTOVAR.
- PROVINCIAL / DISTRICT CAPITAL: a small solid dark DIAMOND with a thin pale halo, no star and no circular ring. Use for LANTHORNE, BELLWATER, SAFFRON GATE, WHITEHARBOR, and VALEHAVEN.
- COUNCIL / CONCLAVE SEAT: a small open HEXAGON with a central dot, no star and no circular ring. Use for CAIRNMEET, SEVENBRIDGE, and TIDEGLASS.
- FORTRESS: a small solid SQUARE. Use for RIVERWATCH.
Keep ordinary cities/towns as solid circles and villages as smaller solid circles. Bramblecross is a modest town; Hearthhollow is a tiny village.

Update the bottom-left symbol legend so the icons visibly match the map and the text reads exactly:
NATIONAL CAPITAL
PROVINCIAL / DISTRICT CAPITAL
COUNCIL / CONCLAVE SEAT
CITY / TOWN
FORTRESS
Keep the separate route/boundary legend exactly:
ROYAL ROAD
REGIONAL BOUNDARY
DISPUTED BOUNDARY
PENCILED CORRECTION

PLACEMENT INVARIANTS
- HEARTHWARD remains in central Hearthvale.
- KESTOVAR remains in Veyrun's settled western interior.
- LANTHORNE remains at Rainroot's major confluence.
- BELLWATER remains beside Dawnmere's lake-and-river system.
- SAFFRON GATE remains on the Sunreach plateau north of the escarpment at a switchback pass.
- CAIRNMEET remains in an accessible highland meeting valley.
- SEVENBRIDGE remains at Mereward's eastern crossings.
- RIVERWATCH remains on the Alderreach side of the disputed braided river march.
- WESTROOT — NOT IN SURVEY remains the graphite correction in Rainroot at its current ridge location.

PRESERVE AND SPELL EVERY LABEL EXACTLY:
THE GREAT SURVEY OF ALDERREACH
ALDERREACH
RAINROOT
HEARTHVALE
DAWNMERE
SUNREACH
HEARTHWARD
LANTHORNE
BELLWATER
SAFFRON GATE
BRAMBLECROSS
HEARTHHOLLOW
WESTROOT — NOT IN SURVEY
VEYRUN
KESTOVAR
RIVERWATCH
THE CAIRN CANTONS
CAIRNMEET
THE MEREWARD LEAGUE
SEVENBRIDGE
THE EMBER COAST PRINCIPALITIES
CORAVENE
WHITEHARBOR
TIDEGLASS
CINDER VALE
VALEHAVEN
SALTWAKE ISLES

Constraints: Coravene, Whiteharbor, and Tideglass must all be on the mainland Ember Coast and visibly north of the sea channel separating the Saltwake Isles. National capitals and provincial capitals must not share the same marker. Preserve the strong v04 northern and central geography. No extra names, no gibberish, no duplicate labels, no modern objects, no magical terrain, no oversized scenic cities, no watermark.
```

## Art Review Notes

- The selected composition reads clearly from conventional west-left to east-right.
- Hearthward and Kestovar use national-capital stars; provincial capitals use diamonds; council and conclave seats use hexagons; towns use dots; Riverwatch uses a square.
- Bramblecross is a modest interior town and Hearthhollow is a tiny nearby village.
- Rainroot's wet forests and tributary valleys blend naturally into Hearthvale's central river basin.
- Lanthorne sits at the western confluence that explains its regional importance.
- Westroot's graphite correction sits at a wooded ridge and tributary junction, making its underground hub role geographically plausible.
- Bellwater anchors Dawnmere's mountain-fed lake and wetland country.
- Saffron Gate sits on the Sunreach plateau at a switchback pass through the escarpment.
- Alderreach's internal regions use blended washes and faint administrative stipple rather than country-like divisions.
- Veyrun and Rainroot now occupy comparable settled valleys on either side of the disputed river march; Veyrun's fields and roads are somewhat more regular.
- Riverwatch guards an Alderreach-side crossing without making Bramblecross or Westroot frontier settlements.
- The Cairn mountains, Mereward watershed and marshes, and southern escarpment give the other international relationships legible terrain.
- Cairnmeet, Sevenbridge, Tideglass, Whiteharbor, and Valehaven give the neighboring polities political anchors without oversized castles.
- The waterfall escarpment spans most of the Alderreach–Ember Coast boundary and gives the coast a distinct lowland identity.
- The Ember Coast is now a broad mainland belt below the cliffs. Coravene, Whiteharbor, Tideglass, Cinder Vale, and Valehaven all sit on that mainland.
- The Saltwake Isles are a separate, smaller offshore chain divided from the principalities by open water.
- Cinder Vale is now a geographic valley centered on the ordinary civic city of Valehaven; its glassmaking and metalworking history belongs in lore rather than factory iconography.
- The Lantern Road reads as civic infrastructure, not a conscious or cosmic magical system.
