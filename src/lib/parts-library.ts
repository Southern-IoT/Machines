// Centralized parts image library loader.
// Each part is a separate JSON file in src/content/parts-library/.
// Schema: { key, brand, partId, partName, image, notes? }
//
// The lookupPart() function uses two strategies in order:
//   1. Exact match:  brand.toLowerCase() + ":" + partId.toLowerCase()
//   2. Name fallback: brand.toLowerCase() + ":" + slugify(partName)
//
// This way, the same physical part (e.g. "M-027 Crank") shared across many
// machines only needs ONE image uploaded here — every machine that lists it
// automatically inherits the same modal image.

import fs from "node:fs";
import path from "node:path";

export const PARTS_LIBRARY_DIR = path.join(process.cwd(), "src/content/parts-library");

export interface PartLibraryEntry {
  key: string;
  brand: string;
  partId: string;
  partName: string;
  image: string;
  notes?: string;
}

let cache: PartLibraryEntry[] | null = null;
let lookupCache: Map<string, PartLibraryEntry> | null = null;

function listJsonFiles(): string[] {
  if (!fs.existsSync(PARTS_LIBRARY_DIR)) return [];
  return fs.readdirSync(PARTS_LIBRARY_DIR).filter((f) => f.endsWith(".json"));
}

function loadAll(): PartLibraryEntry[] {
  if (cache) return cache;
  cache = listJsonFiles().map((file) => {
    try {
      const raw = fs.readFileSync(path.join(PARTS_LIBRARY_DIR, file), "utf-8");
      const data = JSON.parse(raw) as Partial<PartLibraryEntry>;
      return {
        key: data.key || file.replace(/\.json$/, ""),
        brand: (data.brand || "").toString(),
        partId: (data.partId || "").toString(),
        partName: (data.partName || "").toString(),
        image: (data.image || "").toString(),
        notes: data.notes,
      } as PartLibraryEntry;
    } catch (err) {
      // Skip malformed files but log the failure
      // eslint-disable-next-line no-console
      console.warn(`[parts-library] Skipped malformed file: ${file}`, err);
      return null;
    }
  }).filter((e): e is PartLibraryEntry => e !== null);
  return cache;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildLookup(): Map<string, PartLibraryEntry> {
  if (lookupCache) return lookupCache;
  const map = new Map<string, PartLibraryEntry>();
  for (const entry of loadAll()) {
    const brand = entry.brand.toLowerCase().trim();
    if (!brand) continue;
    // Strategy 1: brand:partId
    if (entry.partId) {
      const k1 = `${brand}:${entry.partId.toLowerCase().trim()}`;
      if (!map.has(k1)) map.set(k1, entry);
    }
    // Strategy 2: brand:slugified-partName (fallback for parts without partId)
    if (entry.partName) {
      const k2 = `${brand}:${slugify(entry.partName)}`;
      if (!map.has(k2)) map.set(k2, entry);
    }
  }
  lookupCache = map;
  return lookupCache;
}

/**
 * Look up a part in the library by brand + partId, with a fallback
 * to brand + slugified partName when partId is missing.
 *
 * @returns The matching library entry, or undefined if no match found.
 *          Caller should show a "No image uploaded yet" placeholder.
 */
export function lookupPart(
  brand: string | undefined,
  partId: string | undefined,
  partName: string | undefined
): PartLibraryEntry | undefined {
  if (!brand) return undefined;
  const lookup = buildLookup();
  const b = brand.toLowerCase().trim();
  // 1. Try brand + partId
  if (partId && partId.trim().length > 0) {
    const entry = lookup.get(`${b}:${partId.toLowerCase().trim()}`);
    if (entry) return entry;
  }
  // 2. Fallback: brand + slugified partName
  if (partName && partName.trim().length > 0) {
    const entry = lookup.get(`${b}:${slugify(partName)}`);
    if (entry) return entry;
  }
  return undefined;
}

/**
 * Return all library entries (for admin listings, search, etc).
 */
export function getAllParts(): PartLibraryEntry[] {
  return loadAll();
}
