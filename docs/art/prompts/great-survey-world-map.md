# The Great Survey Of Alderreach — Political World Map

Last updated: 2026-07-24

Status: Selected reference artwork and reusable generation prompt. The map is not wired into the playable build yet.

## Selected Artwork

`assets/reference/source-art/assets/maps/great-survey-of-alderreach-v02.png`

The selected image is a full-size reference source, not an optimized runtime asset. If it enters the game, create a web-ready derivative rather than importing the source PNG directly.

Version 02 supersedes the first composition. Version 01 placed Bramblecross and Westroot too close to Veyrun and made the local settlements too visually prominent. It remains preserved as an earlier reference.

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

## Geographic Reading

| Place | Map relationship |
|---|---|
| Alderreach | Central kingdom containing Rainroot, Hearthvale, Dawnmere, and Sunreach |
| Hearthward | National capital in Hearthvale |
| Lanthorne | Rainroot regional city; above Bramblecross in the nested charter system |
| Bramblecross | Modest interior market town within Rainroot, several days east of the defended frontier |
| Hearthhollow | Tiny village in Bramblecross's rural jurisdiction |
| Westroot | Underground Rainroot junction west of Bramblecross but comfortably inside Alderreach, added later in pencil |
| Veyrun | Centralized western rival beyond the historically shifted border |
| Cairn Cantons | Northern mountain cantons, including Stonekin holds and isolated Cloudling shelf settlements |
| Mereward League | Eastern river-and-lake city-state league |
| Ember Coast Principalities | Southern coastal polities |
| Cinder Vale | Emberling-majority foundry and glassmaking coastal district with an unsettled boundary |
| Saltwake Isles | Rugged southern island chain associated with the Saltwake War |

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

## Art Review Notes

- The selected composition reads clearly from conventional west-left to east-right.
- Hearthward is visibly the capital; Lanthorne reads as a regional city.
- Bramblecross is a modest interior town and Hearthhollow is a tiny nearby village.
- Rainroot includes numerous unnamed settlements and secondary roads without implying that every village needs a lore name.
- A fortified border settlement and small keeps absorb the Veyrun-facing defense role.
- Westroot is visibly an underground Rainroot location added later in graphite, with settled forest country between it and the border.
- Rainroot and Veyrun share a direct frontier with only narrow disputed sections, not an unclaimed no-man's-land.
- The western boundary and Cinder Vale boundary imply history without turning the map into a battle illustration.
- The Lantern Road reads as civic infrastructure, not a conscious or cosmic magical system.
