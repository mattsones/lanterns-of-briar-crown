import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const CANVAS = { width: 1024, height: 1536 };
const SLOT_PROOF_CANVAS = { width: 2048, height: 3072 };
const RIG_ID = "m_standard";
const SOURCE_RIG = "art/characters/hero/rig-guides/rig_reference_m_standard.png";
const FALLBACK_SOURCE_RIG =
  "docs/art/player-character/liams-game-player-character-design-reference-lineup.png";
const OUT_DIR = "art/characters/hero/masks/m_standard";

// Edit these coordinates directly when tuning the rig.
// Coordinate space: 1024 x 1536, origin at top-left.
const ANCHORS = {
  helmetZoneCenter: { x: 512, y: 194 },
  eyeLineY: 253,
  shoulderLineY: 343,
  cloakOriginLeft: { x: 444, y: 364 },
  cloakOriginRight: { x: 582, y: 364 },
  chestCenter: { x: 512, y: 457 },
  trinketCenter: { x: 488, y: 432 },
  waistCenter: { x: 512, y: 612 },
  mainhandGrip: { x: 327, y: 797 },
  offhandGrip: { x: 622, y: 689 },
  feetBaselineY: 1387,
};

const STACKING_ORDER = [
  "cloak_back",
  "base_rig",
  "boots",
  "torso",
  "cloak_front",
  "head",
  "trinket",
  "mainhand",
  "offhand",
];

const MASKS = {
  torso: {
    file: "mask_torso.png",
    purpose: "Torso clothing and armor overlays such as tunics, vests, and chest armor.",
    shapes: [
      {
        kind: "path",
        d: [
          "M 412 346",
          "C 438 330, 476 322, 512 324",
          "C 552 324, 590 336, 614 358",
          "C 630 404, 636 474, 630 536",
          "C 624 594, 604 626, 566 644",
          "C 532 656, 490 656, 456 644",
          "C 420 628, 396 596, 388 544",
          "C 378 480, 386 400, 412 346",
          "Z",
        ].join(" "),
      },
    ],
  },
  cloak_back: {
    file: "mask_cloak_back.png",
    purpose: "Back cloak or cape mass, rendered behind the base rig.",
    shapes: [
      {
        kind: "path",
        d: [
          "M 406 348",
          "C 372 456, 344 650, 344 862",
          "C 344 1050, 380 1222, 444 1312",
          "C 474 1354, 506 1376, 526 1384",
          "C 554 1368, 594 1332, 626 1272",
          "C 688 1152, 700 948, 684 748",
          "C 670 564, 642 426, 612 348",
          "C 580 364, 546 372, 512 372",
          "C 478 372, 442 364, 406 348",
          "Z",
        ].join(" "),
      },
    ],
  },
  cloak_front: {
    file: "mask_cloak_front.png",
    purpose: "Front cloak lapels and visible front drape, rendered over torso but under head/trinket.",
    shapes: [
      {
        kind: "path",
        d: [
          "M 420 348",
          "C 446 356, 468 378, 482 418",
          "C 482 508, 474 610, 456 686",
          "C 444 734, 424 774, 406 800",
          "C 390 746, 386 648, 392 524",
          "C 396 438, 406 374, 420 348",
          "Z",
        ].join(" "),
      },
      {
        kind: "path",
        d: [
          "M 594 350",
          "C 616 366, 628 420, 632 500",
          "C 638 626, 624 738, 590 800",
          "C 568 754, 556 672, 552 594",
          "C 548 506, 552 422, 564 388",
          "C 572 368, 582 356, 594 350",
          "Z",
        ].join(" "),
      },
    ],
  },
  boots: {
    file: "mask_boots.png",
    purpose: "Boots and shoes around the lower legs and planted feet.",
    shapes: [
      {
        kind: "path",
        d: [
          "M 368 1078",
          "C 390 1064, 430 1064, 450 1082",
          "C 452 1138, 452 1214, 446 1266",
          "C 450 1282, 464 1296, 470 1318",
          "C 456 1346, 418 1360, 360 1356",
          "C 318 1354, 298 1344, 300 1328",
          "C 302 1310, 328 1300, 356 1288",
          "C 366 1236, 360 1144, 368 1078",
          "Z",
        ].join(" "),
      },
      {
        kind: "path",
        d: [
          "M 588 1078",
          "C 610 1064, 650 1066, 670 1084",
          "C 668 1148, 674 1220, 696 1278",
          "C 716 1288, 734 1318, 738 1352",
          "C 732 1378, 704 1390, 662 1384",
          "C 622 1378, 592 1364, 588 1344",
          "C 586 1322, 598 1302, 614 1288",
          "C 600 1230, 584 1138, 588 1078",
          "Z",
        ].join(" "),
      },
    ],
  },
  head: {
    file: "mask_head.png",
    purpose: "Headwear, helmets, hoods, hair-overlap checks, and upper head accessory coverage.",
    shapes: [
      {
        kind: "path",
        d: [
          "M 416 204",
          "C 420 140, 464 98, 522 96",
          "C 584 100, 626 146, 634 214",
          "C 638 278, 606 330, 558 352",
          "C 528 362, 492 358, 462 344",
          "C 434 318, 416 270, 416 204",
          "Z",
        ].join(" "),
      },
    ],
  },
  trinket: {
    file: "mask_trinket.png",
    purpose: "Visible chest trinkets such as pins, charms, chains, and small medallions.",
    shapes: [
      {
        kind: "path",
        d: [
          "M 460 392",
          "C 480 380, 508 382, 528 398",
          "C 546 418, 546 450, 528 474",
          "C 508 498, 470 496, 448 474",
          "C 428 450, 434 412, 460 392",
          "Z",
        ].join(" "),
      },
    ],
  },
};

const GUIDES = {
  mainhand_anchor: {
    file: "guide_mainhand_anchor.png",
    point: ANCHORS.mainhandGrip,
    color: "#ff3b30",
    label: "mainhand / character right / viewer-left",
    labelOffset: { x: 44, y: -36 },
    textAnchor: "start",
    purpose: "Main hand weapon grip anchor. This is the character's right hand on viewer-left.",
  },
  offhand_anchor: {
    file: "guide_offhand_anchor.png",
    point: ANCHORS.offhandGrip,
    color: "#0a84ff",
    label: "offhand / character left / viewer-right",
    labelOffset: { x: -44, y: -36 },
    textAnchor: "end",
    purpose: "Off-hand shield/lantern/book anchor. This is the character's left hand on viewer-right.",
  },
};

const PROOF_COLORS = {
  cloak_back: "#7c3aed",
  boots: "#f97316",
  torso: "#06b6d4",
  cloak_front: "#ec4899",
  head: "#22c55e",
  trinket: "#facc15",
};

const PROOF_OUTPUTS = [
  ...Object.keys(MASKS).map((id) => `proof_${id}.png`),
  ...Object.keys(GUIDES).map((id) => `proof_${id}.png`),
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pointsAttr(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function shapeToSvg(shape, attrs) {
  const attr = Object.entries(attrs)
    .map(([key, value]) => `${key}="${esc(value)}"`)
    .join(" ");
  if (shape.kind === "polygon") {
    return `<polygon points="${pointsAttr(shape.points)}" ${attr} />`;
  }
  if (shape.kind === "path") {
    return `<path d="${esc(shape.d)}" ${attr} />`;
  }
  if (shape.kind === "ellipse") {
    return `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}" ${attr} />`;
  }
  if (shape.kind === "circle") {
    return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" ${attr} />`;
  }
  throw new Error(`Unknown shape kind: ${shape.kind}`);
}

function svgDocument(content, canvas = CANVAS) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body { margin: 0; width: ${canvas.width}px; height: ${canvas.height}px; background: transparent; overflow: hidden; }
    svg { display: block; width: ${canvas.width}px; height: ${canvas.height}px; }
    text { font-family: Arial, Helvetica, sans-serif; font-weight: 700; paint-order: stroke; stroke: rgba(0,0,0,0.55); stroke-width: 4px; stroke-linejoin: round; }
  </style>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
    ${content}
  </svg>
</body>
</html>`;
}

function maskSvg(mask) {
  return mask.shapes
    .map((shape) =>
      shapeToSvg(shape, {
        fill: "#ffffff",
        stroke: "none",
        "fill-rule": "evenodd",
      }),
    )
    .join("\n");
}

function guideSvg(guide) {
  const { x, y } = guide.point;
  const color = guide.color;
  const labelOffset = guide.labelOffset || { x: 44, y: -36 };
  const textAnchor = guide.textAnchor || "start";
  return `
    <g>
      <circle cx="${x}" cy="${y}" r="34" fill="${color}" fill-opacity="0.28" stroke="${color}" stroke-width="8" />
      <line x1="${x - 76}" y1="${y}" x2="${x + 76}" y2="${y}" stroke="${color}" stroke-width="6" stroke-linecap="round" />
      <line x1="${x}" y1="${y - 76}" x2="${x}" y2="${y + 76}" stroke="${color}" stroke-width="6" stroke-linecap="round" />
      <circle cx="${x}" cy="${y}" r="8" fill="#ffffff" stroke="${color}" stroke-width="5" />
      <text x="${x + labelOffset.x}" y="${y + labelOffset.y}" text-anchor="${textAnchor}" font-size="28" fill="${color}">${esc(guide.label)}</text>
    </g>`;
}

async function renderPng(page, content, outPath, canvas = CANVAS) {
  await page.setViewportSize(canvas);
  await page.setContent(svgDocument(content, canvas), { waitUntil: "load" });
  await page.screenshot({
    path: outPath,
    omitBackground: true,
    clip: { x: 0, y: 0, width: canvas.width, height: canvas.height },
  });
}

async function existingSourceRig() {
  const primary = path.join(REPO_ROOT, SOURCE_RIG);
  try {
    await readFile(primary);
    return { relative: SOURCE_RIG, absolute: primary };
  } catch {
    const fallback = path.join(REPO_ROOT, FALLBACK_SOURCE_RIG);
    await readFile(fallback);
    return { relative: FALLBACK_SOURCE_RIG, absolute: fallback };
  }
}

async function proofSheetSvg(sourceAbsolute) {
  const base64 = await readFile(sourceAbsolute, "base64");
  const overlays = Object.entries(MASKS)
    .map(([id, mask]) =>
      mask.shapes
        .map((shape) =>
          shapeToSvg(shape, {
            fill: PROOF_COLORS[id],
            "fill-opacity": id === "cloak_back" ? 0.22 : 0.34,
            stroke: PROOF_COLORS[id],
            "stroke-opacity": 0.8,
            "stroke-width": 3,
          }),
        )
        .join("\n"),
    )
    .join("\n");

  const guideMarkers = Object.values(GUIDES).map(guideSvg).join("\n");
  const legend = [
    ["cloak_back", PROOF_COLORS.cloak_back],
    ["boots", PROOF_COLORS.boots],
    ["torso", PROOF_COLORS.torso],
    ["cloak_front", PROOF_COLORS.cloak_front],
    ["head", PROOF_COLORS.head],
    ["trinket", PROOF_COLORS.trinket],
    ["mainhand anchor", GUIDES.mainhand_anchor.color],
    ["offhand anchor", GUIDES.offhand_anchor.color],
  ]
    .map(
      ([label, color], index) => `
        <rect x="28" y="${28 + index * 40}" width="24" height="24" rx="4" fill="${color}" fill-opacity="0.8" />
        <text x="64" y="${49 + index * 40}" font-size="22" fill="#ffffff">${esc(label)}</text>`,
    )
    .join("\n");

  return `
    <image x="0" y="0" width="${CANVAS.width}" height="${CANVAS.height}" opacity="0.94" href="data:image/png;base64,${base64}" />
    ${overlays}
    ${guideMarkers}
    <g>
      <rect x="16" y="16" width="356" height="354" rx="18" fill="rgba(15,23,42,0.72)" stroke="rgba(255,255,255,0.45)" />
      <text x="28" y="346" font-size="20" fill="#ffffff">m_standard proof overlay</text>
      ${legend}
    </g>`;
}

async function singleSlotProofSvg(sourceAbsolute, id, item) {
  const base64 = await readFile(sourceAbsolute, "base64");
  const isGuide = id.endsWith("_anchor");
  const color = isGuide ? item.color : PROOF_COLORS[id];
  const overlay = isGuide
    ? guideSvg(item)
    : item.shapes
        .map((shape) =>
          shapeToSvg(shape, {
            fill: color,
            "fill-opacity": id === "cloak_back" ? 0.24 : 0.36,
            stroke: color,
            "stroke-opacity": 0.95,
            "stroke-width": 4,
          }),
        )
        .join("\n");

  return `
    <image x="0" y="0" width="${CANVAS.width}" height="${CANVAS.height}" opacity="0.94" href="data:image/png;base64,${base64}" />
    ${overlay}
    <g>
      <rect x="24" y="24" width="338" height="76" rx="12" fill="rgba(15,23,42,0.7)" stroke="rgba(255,255,255,0.42)" />
      <rect x="44" y="47" width="30" height="30" rx="5" fill="${color}" fill-opacity="0.86" />
      <text x="90" y="72" font-size="28" fill="#ffffff">${esc(id)}</text>
    </g>`;
}

async function slotProofSheetSvg(sourceAbsolute) {
  const base64 = await readFile(sourceAbsolute, "base64");
  const cells = [
    ["cloak_back", MASKS.cloak_back],
    ["torso", MASKS.torso],
    ["cloak_front", MASKS.cloak_front],
    ["boots", MASKS.boots],
    ["head", MASKS.head],
    ["trinket", MASKS.trinket],
    ["mainhand_anchor", GUIDES.mainhand_anchor],
    ["offhand_anchor", GUIDES.offhand_anchor],
  ];
  const cellWidth = 1024;
  const cellHeight = 768;
  const scale = 0.43;
  const rigWidth = CANVAS.width * scale;
  const rigHeight = CANVAS.height * scale;
  const sourceImage = `<image x="0" y="0" width="${CANVAS.width}" height="${CANVAS.height}" opacity="0.94" href="data:image/png;base64,${base64}" />`;

  return cells
    .map(([id, item], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col * cellWidth;
      const y = row * cellHeight;
      const tx = x + (cellWidth - rigWidth) / 2;
      const ty = y + 78;
      const isGuide = id.endsWith("_anchor");
      const overlay = isGuide
        ? guideSvg(item)
        : item.shapes
            .map((shape) =>
              shapeToSvg(shape, {
                fill: PROOF_COLORS[id],
                "fill-opacity": 0.38,
                stroke: PROOF_COLORS[id],
                "stroke-opacity": 0.95,
                "stroke-width": 5,
              }),
            )
            .join("\n");
      return `
        <g>
          <rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="rgba(15,23,42,0.18)" />
          <text x="${x + 34}" y="${y + 46}" font-size="30" fill="#ffffff">${esc(id)}</text>
          <g transform="translate(${tx} ${ty}) scale(${scale})">
            ${sourceImage}
            ${overlay}
          </g>
        </g>`;
    })
    .join("\n");
}

function manifest(sourceRelative) {
  return {
    project: "Liam's Game / Lanterns of Briar Crown",
    assetType: "paper-doll-slot-masks",
    rig: RIG_ID,
    version: "v1",
    generatedBy: "scripts/generate_m_standard_masks.mjs",
    canvas: { ...CANVAS, background: "transparent" },
    sourceRig: sourceRelative,
    handedness: {
      mainhand: "character_right_hand",
      mainhandAppearsOn: "viewer_left",
      offhand: "character_left_hand",
      offhandAppearsOn: "viewer_right",
    },
    stackingOrder: STACKING_ORDER,
    anchors: ANCHORS,
    masks: MASKS,
    guides: GUIDES,
    outputs: [
      ...Object.values(MASKS).map((mask) => mask.file),
      ...Object.values(GUIDES).map((guide) => guide.file),
      "manifest.json",
      "proof_sheet.png",
      "proof_sheet_by_slot.png",
      ...PROOF_OUTPUTS,
      "README.md",
    ],
  };
}

function readmeText(sourceRelative) {
  return `# m_standard Slot Masks

Generated deterministic transparent PNG masks for the male standard player rig.

Source rig:

\`\`\`text
${sourceRelative}
\`\`\`

Regenerate from repo root:

\`\`\`bash
node scripts/generate_m_standard_masks.mjs
\`\`\`

The mask coordinates live near the top of the script. Edit the path coordinates there, rerun the script, and review \`proof_sheet.png\`, \`proof_sheet_by_slot.png\`, and the full-size \`proof_*.png\` overlays.

## Canvas

- Size: 1024 x 1536
- Mask files: solid white slot shape on transparent background
- Guide files: colored markers on transparent background
- \`proof_sheet.png\`: all masks overlaid together on the base rig
- \`proof_sheet_by_slot.png\`: each mask/guide shown separately on the base rig
- \`proof_*.png\`: full-size single-slot overlay proofs for detailed alignment review

## Hand Direction

- Main hand = character's right hand = viewer-left side.
- Off hand = character's left hand = viewer-right side.

## Slot Purpose

- \`mask_cloak_back.png\`: back cape/cloak volume behind the base rig.
- \`mask_boots.png\`: shoes and boot overlays around lower legs and feet.
- \`mask_torso.png\`: torso clothing, armor, tunics, and vests.
- \`mask_cloak_front.png\`: front cloak panels/lapels above torso.
- \`mask_head.png\`: helmets, hats, hoods, and headwear checks.
- \`mask_trinket.png\`: visible pins, charms, chains, and medallions.
- \`guide_mainhand_anchor.png\`: main-hand weapon grip marker.
- \`guide_offhand_anchor.png\`: off-hand item grip marker.

## Initial Stacking Order

1. cloak_back
2. base_rig
3. boots
4. torso
5. cloak_front
6. head
7. trinket
8. mainhand
9. offhand

## Notes

These masks are deterministic vector paths, not AI-generated art. Treat them as editable slot boundaries: tighten or loosen the path coordinates in \`scripts/generate_m_standard_masks.mjs\`, rerun the generator, and review the proof overlays before painting equipment.

\`cloak_back\` is intentionally reviewed a little differently from the front-facing slots: the mask is painted behind \`base_rig\`, so the proof overlay shows some area that will be hidden by the body in the actual stack. Boots, torso, head, trinket, and cloak_front should read much tighter in their full-size \`proof_*.png\` files.
`;
}

async function main() {
  const source = await existingSourceRig();
  const outDir = path.join(REPO_ROOT, OUT_DIR);
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: CANVAS,
      deviceScaleFactor: 1,
    });

    for (const mask of Object.values(MASKS)) {
      await renderPng(page, maskSvg(mask), path.join(outDir, mask.file));
    }

    for (const guide of Object.values(GUIDES)) {
      await renderPng(page, guideSvg(guide), path.join(outDir, guide.file));
    }

    await renderPng(page, await proofSheetSvg(source.absolute), path.join(outDir, "proof_sheet.png"));
    await renderPng(
      page,
      await slotProofSheetSvg(source.absolute),
      path.join(outDir, "proof_sheet_by_slot.png"),
      SLOT_PROOF_CANVAS,
    );

    for (const [id, mask] of Object.entries(MASKS)) {
      await renderPng(page, await singleSlotProofSvg(source.absolute, id, mask), path.join(outDir, `proof_${id}.png`));
    }

    for (const [id, guide] of Object.entries(GUIDES)) {
      await renderPng(page, await singleSlotProofSvg(source.absolute, id, guide), path.join(outDir, `proof_${id}.png`));
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    path.join(outDir, "manifest.json"),
    `${JSON.stringify(manifest(source.relative), null, 2)}\n`,
    "utf8",
  );
  await writeFile(path.join(outDir, "README.md"), readmeText(source.relative), "utf8");

  console.log(`Generated m_standard masks in ${pathToFileURL(outDir).href}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
