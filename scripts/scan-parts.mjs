#!/usr/bin/env node
// scripts/scan-parts.mjs
//
// Scans all src/content/machines/*.json files, deduplicates parts by
// semantic concept (defined in src/lib/concepts.ts), and writes one
// inventory JSON per unique concept to src/content/parts-inventory/.
//
// Run with: node scripts/scan-parts.mjs
//   or:    npm run scan-parts

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MACHINES_DIR = join(ROOT, "src/content/machines");
const INVENTORY_DIR = join(ROOT, "src/content/parts-inventory");
const LIBRARY_DIR = join(ROOT, "src/content/parts-library");

// ─── Load the concept taxonomy from the TypeScript source ────────────────
// We can't `import` a .ts file from vanilla .mjs, so we parse the source
// text and extract the regex patterns inline. The shape of CONCEPTS is
// stable; this approach avoids an extra build step.

const conceptsSrc = readFileSync(join(ROOT, "src/lib/concepts.ts"), "utf-8");

// Parse the CONCEPTS array — extract each { key, label, generic } block by
// splitting on top-level `},` at indent level 2. Patterns are kept as their
// source string and re-built as RegExp here.
function parseConcepts(src) {
  const out = [];
  // Find the start of CONCEPTS array (skip past type annotation bracket)
  const start = src.indexOf("export const CONCEPTS");
  if (start < 0) return [];
  // Find the opening `[` AFTER the `=` sign
  const eqIdx = src.indexOf("=", start);
  const openBracket = src.indexOf("[", eqIdx);
  if (openBracket < 0) return [];
  // Walk forward, tracking depth of `[` and `{`
  let depthBracket = 0;
  let depthBrace = 0;
  let end = -1;
  for (let i = openBracket; i < src.length; i++) {
    const c = src[i];
    if (c === "[") depthBracket++;
    else if (c === "]") {
      depthBracket--;
      if (depthBracket === 0) {
        end = i;
        break;
      }
    } else if (c === "{") depthBrace++;
    else if (c === "}") depthBrace--;
  }
  if (end < 0) return [];
  const arrayBody = src.slice(openBracket, end + 1);

  // Split into top-level concept objects by tracking { } depth
  const blocks = [];
  let blockStart = -1;
  let inString = false;
  let stringChar = "";
  let bDepth = 0;
  for (let i = 0; i < arrayBody.length; i++) {
    const c = arrayBody[i];
    if (inString) {
      if (c === "\\") { i++; continue; }
      if (c === stringChar) inString = false;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inString = true; stringChar = c; continue; }
    if (c === "{") {
      if (bDepth === 0) blockStart = i;
      bDepth++;
    } else if (c === "}") {
      bDepth--;
      if (bDepth === 0 && blockStart >= 0) {
        blocks.push(arrayBody.slice(blockStart, i + 1));
        blockStart = -1;
      }
    }
  }

  for (const block of blocks) {
    const keyMatch = block.match(/key:\s*"([^"]+)"/);
    const labelMatch = block.match(/label:\s*"([^"]+)"/);
    const genericMatch = block.match(/generic:\s*(true|false)/);
    const patternsMatch = block.match(/patterns:\s*\[([\s\S]*?)\]/);
    if (!keyMatch || !labelMatch || !genericMatch || !patternsMatch) continue;

    const patterns = [];
    const patRe = /\/[^\n\/\\]*(?:\\.[^\n\/\\]*)*\/[gimuy]*/g;
    let pm;
    while ((pm = patRe.exec(patternsMatch[1])) !== null) {
      const patSrc = pm[0];
      try {
        const lastSlash = patSrc.lastIndexOf("/");
        const body = patSrc.slice(1, lastSlash);
        const flags = patSrc.slice(lastSlash + 1);
        patterns.push(new RegExp(body, flags));
      } catch (err) {
        // skip
      }
    }

    const catMatch = block.match(/appliesToCategories:\s*\[([^\]]*)\]/);
    const brandMatch = block.match(/appliesToBrands:\s*\[([^\]]*)\]/);
    const appliesToCategories = catMatch
      ? [...catMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
      : undefined;
    const appliesToBrands = brandMatch
      ? [...brandMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
      : undefined;

    out.push({
      key: keyMatch[1],
      label: labelMatch[1],
      patterns,
      generic: genericMatch[1] === "true",
      appliesToCategories,
      appliesToBrands,
    });
  }
  return out;
}

const CONCEPTS = parseConcepts(conceptsSrc);
console.log(`Loaded ${CONCEPTS.length} concepts from src/lib/concepts.ts`);

// ─── Helpers ─────────────────────────────────────────────────────────────
function matchesConcept(partName, partId, category, brand, concept) {
  if (concept.appliesToCategories && !concept.appliesToCategories.includes(category)) return false;
  if (concept.appliesToBrands && !concept.appliesToBrands.includes(brand)) return false;
  for (const pat of concept.patterns) {
    if (pat.test(partName) || pat.test(partId)) return true;
  }
  return false;
}

function findConcept(partName, partId, category, brand) {
  for (const concept of CONCEPTS) {
    if (matchesConcept(partName, partId, category, brand, concept)) {
      return concept;
    }
  }
  return null;
}

function slugifyBrand(brand) {
  return (brand || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function lookupKey(concept, brand) {
  return concept.generic ? concept.key : `${slugifyBrand(brand)}-${concept.key}`;
}

// ─── Scan machines ───────────────────────────────────────────────────────
const machineFiles = readdirSync(MACHINES_DIR).filter((f) => f.endsWith(".json"));
const allMachines = machineFiles.map((f) => {
  const data = JSON.parse(readFileSync(join(MACHINES_DIR, f), "utf-8"));
  return { slug: f.replace(".json", ""), brand: data.brand || "", category: data.category || "", parts: data.partsList || [] };
});

console.log(`Scanning ${machineFiles.length} machine files...`);

// ─── Build inventory (dedup by concept) ──────────────────────────────────
/**
 * Map key:
 *   - generic concepts:  concept.key  (e.g. "needle-dc27")
 *   - brand-scoped:      `${brand}-${concept.key}`  (e.g. "juki-bobbin")
 *
 * Each entry: { key, concept, brand, machines: Set, totalOccurrences, sampleNames: Set, hasImage }
 */
const inventory = new Map();

let totalRows = 0;
let matched = 0;
let orphan = 0;

for (const m of allMachines) {
  for (const part of m.parts) {
    totalRows++;
    const concept = findConcept(
      part.partName || "",
      part.partId || "",
      m.category,
      m.brand
    );
    if (!concept) {
      orphan++;
      continue;
    }
    matched++;
    const key = lookupKey(concept, m.brand);
    if (!inventory.has(key)) {
      inventory.set(key, {
        key,
        concept,
        brand: concept.generic ? null : m.brand,
        machines: new Set(),
        occurrences: 0,
        sampleNames: new Set(),
        hasImage: false,
      });
    }
    const entry = inventory.get(key);
    entry.machines.add(m.slug);
    entry.occurrences++;
    if (entry.sampleNames.size < 4 && part.partName) {
      entry.sampleNames.add(part.partName);
    }
  }
}

// ─── Cross-check with the parts library (which concepts already have images?) ─
let libraryFiles = [];
if (existsSync(LIBRARY_DIR)) {
  libraryFiles = readdirSync(LIBRARY_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("."));
}
console.log(`Found ${libraryFiles.length} entries in parts-library`);

// For each inventory entry, check if a library file exists with the matching key.
for (const entry of inventory.values()) {
  // Direct key match
  if (libraryFiles.includes(`${entry.key}.json`)) {
    entry.hasImage = true;
  }
}

const withImage = [...inventory.values()].filter((e) => e.hasImage).length;
console.log(
  `\nInventory summary:` +
    `\n  Total rows:           ${totalRows}` +
    `\n  Matched to concept:   ${matched} (${((matched / totalRows) * 100).toFixed(1)}%)` +
    `\n  Model-specific orphan: ${orphan}` +
    `\n  Unique concepts:      ${inventory.size}` +
    `\n  Already have image:   ${withImage}`
);

// ─── Write inventory files ───────────────────────────────────────────────
if (!existsSync(INVENTORY_DIR)) {
  mkdirSync(INVENTORY_DIR, { recursive: true });
} else {
  // Clean existing inventory files first (so renames / deletions propagate).
  for (const f of readdirSync(INVENTORY_DIR)) {
    if (f.endsWith(".json") || f === ".gitkeep") continue;
    rmSync(join(INVENTORY_DIR, f));
  }
  // Only delete .json files (not .gitkeep)
  for (const f of readdirSync(INVENTORY_DIR)) {
    if (f.endsWith(".json")) {
      rmSync(join(INVENTORY_DIR, f));
    }
  }
}

// Sort: pending first, then by occurrences desc.
const sorted = [...inventory.values()].sort((a, b) => {
  if (a.hasImage !== b.hasImage) return a.hasImage ? 1 : -1;
  return b.occurrences - a.occurrences;
});

for (const entry of sorted) {
  const file = {
    key: entry.key,
    type: entry.concept.generic ? "generic" : "brand-scoped",
    label: entry.concept.label,
    brand: entry.brand,
    machines: [...entry.machines].sort(),
    occurrences: entry.occurrences,
    hasImage: entry.hasImage,
    sampleNames: [...entry.sampleNames],
  };
  writeFileSync(join(INVENTORY_DIR, `${entry.key}.json`), JSON.stringify(file, null, 2) + "\n");
}

console.log(`\nWrote ${sorted.length} inventory files to src/content/parts-inventory/`);
console.log(
  sorted
    .slice(0, 10)
    .map((e) => `  ${e.hasImage ? "✓" : "·"} ${e.key}  (${e.occurrences}× across ${e.machines.size} machines)`)
    .join("\n")
);
console.log(`  ... and ${Math.max(0, sorted.length - 10)} more`);