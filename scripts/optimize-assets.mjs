import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PRODUCTION_ROOTS = [
  "assets/maps",
  "assets/portraits",
  "assets/scenes",
  "assets/icons",
];

const IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);
const SOURCE_ART_ROOT = "assets/reference/source-art";
const ALTERNATES_ROOT = "assets/reference/alternates";
const MANIFEST_PATH = "assets/reference/source-art/optimization-manifest.json";

const TARGETS = [
  {
    test: (relativePath) => relativePath.startsWith("assets/maps/"),
    format: "webp",
    width: 1600,
    quality: 82,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/scenes/"),
    format: "webp",
    width: 1600,
    quality: 82,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/portraits/player/"),
    format: "png",
    height: 1200,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/portraits/"),
    format: "webp",
    height: 1200,
    quality: 82,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/icons/map-tokens/"),
    format: "png",
    width: 512,
    height: 512,
  },
  {
    test: (relativePath) => relativePath.startsWith("assets/icons/"),
    format: "png",
    width: 512,
    height: 512,
  },
];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(relativeDir, predicate = () => true) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  if (!(await pathExists(absoluteDir))) return [];

  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry.name);
    const relativePath = toPosixPath(path.relative(repoRoot, absolutePath));

    if (entry.isDirectory()) {
      files.push(...await collectFiles(relativePath, predicate));
      continue;
    }

    if (entry.isFile() && predicate(relativePath)) files.push(relativePath);
  }

  return files;
}

async function collectSrcAssetReferences() {
  const srcFiles = await collectFiles("src", (relativePath) =>
    /\.(ts|tsx|js|jsx)$/.test(relativePath),
  );
  const references = new Set();
  const pattern = /["'](?:\.\.\/)+(assets\/[^"']+\.(?:png|webp|jpg|jpeg|avif))["']/g;

  for (const file of srcFiles) {
    const text = await readFile(path.join(repoRoot, file), "utf8");
    for (const match of text.matchAll(pattern)) {
      references.add(match[1]);
    }
  }

  return { srcFiles, references };
}

function targetFor(relativePath, metadata) {
  const target = TARGETS.find((entry) => entry.test(relativePath)) || {
    format: metadata.hasAlpha ? "png" : "webp",
    width: 1200,
    quality: 82,
  };

  if (metadata.hasAlpha) return { ...target, format: "png" };
  return target;
}

function outputPathFor(relativePath, target) {
  if (target.format === "webp") {
    return relativePath.replace(/\.[^.]+$/, ".webp");
  }
  return relativePath.replace(/\.[^.]+$/, ".png");
}

async function moveFile(relativeSource, relativeDestination) {
  const source = path.join(repoRoot, relativeSource);
  const destination = path.join(repoRoot, relativeDestination);
  await mkdir(path.dirname(destination), { recursive: true });
  if (await pathExists(destination)) await rm(destination, { force: true });
  await rename(source, destination);
}

async function loadExistingOriginalsByOutput() {
  try {
    const manifest = JSON.parse(await readFile(path.join(repoRoot, MANIFEST_PATH), "utf8"));
    return new Map(
      (manifest.conversions || [])
        .filter((conversion) => conversion.output && conversion.original)
        .map((conversion) => [conversion.output, conversion.original]),
    );
  } catch {
    return new Map();
  }
}

async function optimizeOne(relativePath, existingOriginalsByOutput) {
  const mappedSourceArtPath = existingOriginalsByOutput.get(relativePath);
  const defaultSourceArtPath = `${SOURCE_ART_ROOT}/${relativePath}`;
  const sourceArtPath =
    mappedSourceArtPath && await pathExists(path.join(repoRoot, mappedSourceArtPath))
      ? mappedSourceArtPath
      : defaultSourceArtPath;
  const hasRuntimeFile = await pathExists(path.join(repoRoot, relativePath));
  const hasSourceArtFile = await pathExists(path.join(repoRoot, sourceArtPath));

  if (!hasRuntimeFile && !hasSourceArtFile) {
    throw new Error(`Missing asset source for ${relativePath}`);
  }

  if (!hasSourceArtFile) {
    await moveFile(relativePath, sourceArtPath);
  }

  const inputPath = path.join(repoRoot, sourceArtPath);
  const originalStats = await stat(inputPath);
  const metadata = await sharp(inputPath).metadata();
  const target = targetFor(relativePath, metadata);
  const outputRelativePath = outputPathFor(relativePath, target);
  const outputPath = path.join(repoRoot, outputRelativePath);
  const staleOriginalPath = path.join(repoRoot, relativePath);

  await mkdir(path.dirname(outputPath), { recursive: true });

  let pipeline = sharp(inputPath).rotate();
  if (target.width || target.height) {
    pipeline = pipeline.resize({
      width: target.width,
      height: target.height,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const tempOutputPath = path.join(
    path.dirname(outputPath),
    `.${path.basename(outputPath)}.${process.pid}.tmp${path.extname(outputPath)}`,
  );

  try {
    if (target.format === "webp") {
      await pipeline.webp({ quality: target.quality || 82, effort: 6 }).toFile(tempOutputPath);
    } else {
      await pipeline.png({ compressionLevel: 9, effort: 10 }).toFile(tempOutputPath);
    }
    await rm(outputPath, { force: true });
    await rename(tempOutputPath, outputPath);
  } catch (error) {
    await rm(tempOutputPath, { force: true });
    throw error;
  }

  if (outputRelativePath !== relativePath && await pathExists(staleOriginalPath)) {
    await rm(staleOriginalPath, { force: true });
  }

  const outputStats = await stat(outputPath);
  return {
    source: relativePath,
    original: sourceArtPath,
    output: outputRelativePath,
    format: target.format,
    originalBytes: originalStats.size,
    outputBytes: outputStats.size,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: !!metadata.hasAlpha,
  };
}

async function rewriteSrcReferences(srcFiles, conversions) {
  const replacements = conversions
    .filter((conversion) => conversion.source !== conversion.output)
    .map((conversion) => ({
      from: conversion.source,
      to: conversion.output,
    }));

  if (!replacements.length) return;

  for (const file of srcFiles) {
    const absolutePath = path.join(repoRoot, file);
    let text = await readFile(absolutePath, "utf8");
    let changed = false;

    replacements.forEach(({ from, to }) => {
      const next = text.split(from).join(to);
      if (next !== text) {
        text = next;
        changed = true;
      }
    });

    if (changed) await writeFile(absolutePath, text);
  }
}

async function moveUnreferencedProductionImages(references) {
  const productionImages = (
    await Promise.all(PRODUCTION_ROOTS.map((root) =>
      collectFiles(root, (relativePath) => IMAGE_EXTENSIONS.has(path.extname(relativePath).toLowerCase())),
    ))
  ).flat();
  const moved = [];

  for (const relativePath of productionImages) {
    if (references.has(relativePath)) continue;
    const destination = `${ALTERNATES_ROOT}/${relativePath}`;
    await moveFile(relativePath, destination);
    moved.push({ source: relativePath, destination });
  }

  return moved;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

async function main() {
  const { srcFiles, references } = await collectSrcAssetReferences();
  const existingOriginalsByOutput = await loadExistingOriginalsByOutput();
  const importedProductionImages = [...references]
    .filter((relativePath) => PRODUCTION_ROOTS.some((root) => relativePath.startsWith(`${root}/`)))
    .filter((relativePath) => IMAGE_EXTENSIONS.has(path.extname(relativePath).toLowerCase()))
    .sort();

  const movedAlternates = await moveUnreferencedProductionImages(references);
  const conversions = [];

  for (const relativePath of importedProductionImages) {
    conversions.push(await optimizeOne(relativePath, existingOriginalsByOutput));
  }

  await rewriteSrcReferences(srcFiles, conversions);

  await mkdir(path.dirname(path.join(repoRoot, MANIFEST_PATH)), { recursive: true });
  await writeFile(
    path.join(repoRoot, MANIFEST_PATH),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceArtRoot: SOURCE_ART_ROOT,
        alternatesRoot: ALTERNATES_ROOT,
        conversions,
        movedAlternates,
      },
      null,
      2,
    )}\n`,
  );

  const originalBytes = conversions.reduce((sum, item) => sum + item.originalBytes, 0);
  const outputBytes = conversions.reduce((sum, item) => sum + item.outputBytes, 0);

  console.log(`Optimized ${conversions.length} imported asset(s).`);
  console.log(`Imported asset payload: ${formatBytes(originalBytes)} -> ${formatBytes(outputBytes)}.`);
  console.log(`Moved ${movedAlternates.length} non-imported production image(s) to ${ALTERNATES_ROOT}.`);
  console.log(`Manifest written to ${MANIFEST_PATH}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
