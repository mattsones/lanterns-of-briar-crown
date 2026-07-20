import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ASSET_ROOTS = [
  "assets/maps",
  "assets/portraits",
  "assets/scenes",
  "assets/icons",
];

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

const CATEGORY_BUDGETS = [
  {
    test: (relativePath) => relativePath.startsWith("assets/maps/"),
    category: "map",
    target: "1600-2048 px wide WebP/AVIF derivative",
    maxBytes: 750 * 1024,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/scenes/"),
    category: "scene",
    target: "1400-1920 px wide WebP/AVIF derivative",
    maxBytes: 700 * 1024,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/portraits/player/"),
    category: "transparent hero",
    target: "900-1400 px tall PNG with alpha",
    maxBytes: 900 * 1024,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/portraits/"),
    category: "portrait",
    target: "900-1400 px tall WebP/AVIF derivative",
    maxBytes: 500 * 1024,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/icons/map-tokens/"),
    category: "map token",
    target: "256-512 px transparent PNG",
    maxBytes: 180 * 1024,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/icons/"),
    category: "icon",
    target: "128-512 px transparent PNG",
    maxBytes: 120 * 1024,
  },
];

function parseArgs(argv) {
  const options = {
    limit: 25,
    json: false,
  };

  argv.forEach((arg, index) => {
    if (arg === "--json") options.json = true;
    if (arg === "--limit") {
      const next = Number(argv[index + 1]);
      if (Number.isInteger(next) && next > 0) options.limit = next;
    }
    if (arg.startsWith("--limit=")) {
      const next = Number(arg.slice("--limit=".length));
      if (Number.isInteger(next) && next > 0) options.limit = next;
    }
  });

  return options;
}

function getPngDimensions(buffer) {
  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer.toString("ascii", 1, 4) === "PNG"
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }
  return null;
}

function getJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }
    offset += 2 + length;
  }

  return null;
}

function getWebpDimensions(buffer) {
  if (
    buffer.length < 30 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return null;
  }

  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunk === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function categorize(relativePath) {
  return (
    CATEGORY_BUDGETS.find((budget) => budget.test(relativePath)) || {
      category: "asset",
      target: "review manually",
      maxBytes: 500 * 1024,
    }
  );
}

async function collectImages(relativeDir) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry.name);
    const relativePath = path.relative(repoRoot, absolutePath).replaceAll(path.sep, "/");

    if (entry.isDirectory()) {
      images.push(...await collectImages(relativePath));
      continue;
    }

    if (!entry.isFile() || !IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    const fileStat = await stat(absolutePath);
    const buffer = await readFile(absolutePath);
    const dimensions =
      getPngDimensions(buffer) ||
      getJpegDimensions(buffer) ||
      getWebpDimensions(buffer);
    const budget = categorize(relativePath);

    images.push({
      path: relativePath,
      bytes: fileStat.size,
      size: formatBytes(fileStat.size),
      dimensions,
      category: budget.category,
      target: budget.target,
      maxBytes: budget.maxBytes,
      overTarget: fileStat.size > budget.maxBytes,
    });
  }

  return images;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const assets = (await Promise.all(ASSET_ROOTS.map((root) => collectImages(root))))
    .flat()
    .sort((a, b) => b.bytes - a.bytes);
  const largest = assets.slice(0, options.limit);

  if (options.json) {
    console.log(JSON.stringify({ count: assets.length, largest }, null, 2));
    return;
  }

  console.log(`Production asset audit: ${assets.length} image file(s) scanned`);
  console.log(`Showing largest ${largest.length} asset(s). Report-only; no build gate.`);
  console.log("");
  console.log("Size      Dimensions  Category          Status       Path");
  console.log("--------  ----------  ----------------  -----------  ----");
  largest.forEach((asset) => {
    const dimensions = asset.dimensions
      ? `${asset.dimensions.width}x${asset.dimensions.height}`.padEnd(10)
      : "unknown".padEnd(10);
    const category = asset.category.padEnd(16);
    const status = asset.overTarget ? "over target" : "ok";
    console.log(
      `${asset.size.padEnd(8)}  ${dimensions}  ${category}  ${status.padEnd(11)}  ${asset.path}`,
    );
  });
  console.log("");
  console.log("Targets are documented in docs/art/asset-manifest.md.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
