import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const CANVAS = { width: 1024, height: 1536 };
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
        kind: "polygon",
        points: [
          [424, 340],
          [492, 318],
          [560, 318],
          [620, 344],
          [650, 424],
          [634, 540],
          [602, 628],
          [512, 646],
          [416, 626],
          [382, 542],
          [374, 424],
        ],
      },
      {
        kind: "ellipse",
        cx: 512,
        cy: 556,
        rx: 118,
        ry: 102,
      },
    ],
  },
  cloak_back: {
    file: "mask_cloak_back.png",
    purpose: "Back cloak or cape mass, rendered behind the base rig.",
    shapes: [
      {
        kind: "polygon",
        points: [
          [420, 342],
          [604, 342],
          [690, 612],
          [682, 1058],
          [620, 1288],
          [526, 1348],
          [410, 1282],
          [330, 1050],
          [322, 620],
        ],
      },
      {
        kind: "ellipse",
        cx: 512,
        cy: 780,
        rx: 190,
        ry: 430,
      },
    ],
  },
  cloak_front: {
    file: "mask_cloak_front.png",
    purpose: "Front cloak lapels and visible front drape, rendered over torso but under head/trinket.",
    shapes: [
      {
        kind: "polygon",
        points: [
          [424, 348],
          [474, 354],
          [468, 622],
          [426, 758],
          [386, 706],
          [394, 492],
        ],
      },
      {
        kind: "polygon",
        points: [
          [596, 352],
          [640, 372],
          [654, 510],
          [636, 720],
          [592, 774],
          [552, 628],
          [548, 360],
        ],
      },
    ],
  },
  boots: {
    file: "mask_boots.png",
    purpose: "Boots and shoes around the lower legs and planted feet.",
    shapes: [
      {
        kind: "polygon",
        points: [
          [372, 1234],
          [462, 1230],
          [466, 1378],
          [436, 1422],
          [326, 1418],
          [300, 1382],
          [340, 1334],
          [366, 1292],
        ],
      },
      {
        kind: "polygon",
        points: [
          [596, 1234],
          [676, 1230],
          [710, 1328],
          [742, 1378],
          [724, 1428],
          [612, 1430],
          [584, 1386],
          [584, 1300],
        ],
      },
    ],
  },
  head: {
    file: "mask_head.png",
    purpose: "Headwear, helmets, hoods, hair-overlap checks, and upper head accessory coverage.",
    shapes: [
      {
        kind: "ellipse",
        cx: 512,
        cy: 225,
        rx: 110,
        ry: 135,
      },
      {
        kind: "polygon",
        points: [
          [420, 188],
          [456, 112],
          [518, 92],
          [586, 126],
          [628, 198],
          [606, 326],
          [552, 366],
          [480, 360],
          [434, 314],
        ],
      },
    ],
  },
  trinket: {
    file: "mask_trinket.png",
    purpose: "Visible chest trinkets such as pins, charms, chains, and small medallions.",
    shapes: [
      {
        kind: "ellipse",
        cx: 488,
        cy: 432,
        rx: 58,
        ry: 62,
      },
      {
        kind: "polygon",
        points: [
          [454, 386],
          [526, 386],
          [552, 438],
          [518, 504],
          [456, 498],
          [426, 438],
        ],
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
  if (shape.kind === "ellipse") {
    return `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}" ${attr} />`;
  }
  if (shape.kind === "circle") {
    return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" ${attr} />`;
  }
  throw new Error(`Unknown shape kind: ${shape.kind}`);
}

function svgDocument(content) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body { margin: 0; width: ${CANVAS.width}px; height: ${CANVAS.height}px; background: transparent; overflow: hidden; }
    svg { display: block; width: ${CANVAS.width}px; height: ${CANVAS.height}px; }
    text { font-family: Arial, Helvetica, sans-serif; font-weight: 700; paint-order: stroke; stroke: rgba(0,0,0,0.55); stroke-width: 4px; stroke-linejoin: round; }
  </style>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}" viewBox="0 0 ${CANVAS.width} ${CANVAS.height}">
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

async function renderPng(page, content, outPath) {
  await page.setViewportSize(CANVAS);
  await page.setContent(svgDocument(content), { waitUntil: "load" });
  await page.screenshot({
    path: outPath,
    omitBackground: true,
    clip: { x: 0, y: 0, width: CANVAS.width, height: CANVAS.height },
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

The mask coordinates live near the top of the script. Edit the polygon/ellipse points there, rerun the script, and review \`proof_sheet.png\`.

## Canvas

- Size: 1024 x 1536
- Mask files: solid white slot shape on transparent background
- Guide files: colored markers on transparent background

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

These masks are intentionally approximate first-pass shapes. They are not AI-generated. They are vector-defined and rendered by code so the rig can be tuned deterministically as the paper-doll system matures.
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
