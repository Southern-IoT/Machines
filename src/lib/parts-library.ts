// Centralized parts image library loader.
// Each part is a separate JSON file in src/content/parts-library/.
// Schema: { key, brand, partId, partName, image, notes? }
//
// Two lookup strategies:
//   1. lookupPart(brand, partId, partName) — original naive lookup.
//      Used when a part's identity is known (legacy path).
//   2. lookupConcept(conceptKey, brand) — semantic concept lookup.
//      Used by the inventory scanner + anywhere concept grouping applies.
//      Generic concepts (Needle DC×27) share across brands.
//      Brand-scoped concepts (Bobbin) are looked up by brand + key.

import fs from "node:fs";
import path from "node:path";
import { CONCEPTS, type ConceptDef, conceptLookupKey } from "./concepts";

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
    // Concept-aware indexing: if this entry's filename matches a concept key
    // (either as a generic key or as `brand-conceptkey`), index by concept key.
    const concept = findConceptByKey(entry.key);
    if (concept) {
      if (concept.generic) {
        if (!map.has(concept.key)) map.set(concept.key, entry);
      } else if (brand) {
        const ck = `${brand}:${concept.key}`;
        if (!map.has(ck)) map.set(ck, entry);
      }
    }
    // Strategy 1: brand:partId
    if (brand && entry.partId) {
      const k1 = `${brand}:${entry.partId.toLowerCase().trim()}`;
      if (!map.has(k1)) map.set(k1, entry);
    }
    // Strategy 2: brand:slugified-partName (fallback for parts without partId)
    if (brand && entry.partName) {
      const k2 = `${brand}:${slugify(entry.partName)}`;
      if (!map.has(k2)) map.set(k2, entry);
    }
  }
  lookupCache = map;
  return lookupCache;
}

function findConceptByKey(key: string): ConceptDef | undefined {
  // Match exact concept key
  const exact = CONCEPTS.find((c) => c.key === key);
  if (exact) return exact;
  // Match brand-prefixed key: "juki-bobbin" -> "bobbin"
  for (const c of CONCEPTS) {
    if (key.endsWith(`-${c.key}`)) return c;
  }
  return undefined;
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
 * Look up a part via its concept key.
 *
 * - Generic concepts (Needle DC×27): lookup by concept key alone —
 *   the same image serves every brand.
 * - Brand-scoped concepts (Bobbin): lookup by `brand:conceptkey`.
 *
 * @returns The matching library entry, or undefined.
 */
export function lookupConcept(
  conceptKey: string,
  brand?: string
): PartLibraryEntry | undefined {
  const concept = CONCEPTS.find((c) => c.key === conceptKey);
  if (!concept) return undefined;
  const lookup = buildLookup();
  if (concept.generic) {
    return lookup.get(concept.key);
  }
  if (!brand) return undefined;
  return lookup.get(`${brand.toLowerCase().trim()}:${concept.key}`);
}

/**
 * Build the lookup key for a concept + brand combination. Exposed for the
 * inventory scanner and click-through URL generation.
 */
export function keyForConcept(concept: ConceptDef, brand: string): string {
  return conceptLookupKey(concept, brand);
}

/**
 * Return all library entries (for admin listings, search, etc).
 */
export function getAllParts(): PartLibraryEntry[] {
  return loadAll();
}
