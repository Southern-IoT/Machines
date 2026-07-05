// Centralized machine JSON loading. All four call sites
// (homepage, detail page, rss feed, sitemap) consume this module
// to avoid re-implementing the directory-walk + parse pattern.
import fs from "node:fs";
import path from "node:path";
import { withBase } from "./base";

export const MACHINES_DIR = path.join(process.cwd(), "src/content/machines");

export interface MachineSummary {
  title: string;
  subtitle?: string;
  brand: string;
  category: string;
  slug: string;
  machineImage?: string;
}

export interface MachineFull {
  title: string;
  subtitle?: string;
  brand?: string;
  category?: string;
  machineImage?: string;
  publishedDate?: string;
  purposeAndApplication?: { purpose?: string; applications?: string[]; industry?: string };
  overviewDescription?: string;
  classificationTable?: { field: string; value: string }[];
  technicalSpecs?: { parameter: string; value: string }[];
  workingPrinciples?: { heading: string; description: string }[];
  sequenceFlow?: { stepTitle: string; stepDescription?: string }[];
  partsList?: { partName: string; partId?: string; section?: string; function: string }[];
  gaugePartsCrossReference?: { gaugeCode?: string; description?: string; needles?: string; needleGauge?: string; presserFoot?: string; feedDog?: string }[];
  maintenance?: { code: string; definition: string; action: string }[];
  resources?: { resourceName: string; description: string; url?: string }[];
  finalNotes?: string;
}

export interface MachineWithSlug extends MachineFull {
  slug: string;
}

let summariesCache: MachineSummary[] | null = null;
let fullCache: MachineWithSlug[] | null = null;

function listJsonFiles(): string[] {
  if (!fs.existsSync(MACHINES_DIR)) return [];
  return fs.readdirSync(MACHINES_DIR).filter((f) => f.endsWith(".json"));
}

export function loadMachineSummaries(): MachineSummary[] {
  if (summariesCache) return summariesCache;
  summariesCache = listJsonFiles().map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(MACHINES_DIR, file), "utf-8")) as MachineFull;
    return {
      title: data.title,
      subtitle: data.subtitle,
      brand: data.brand || "",
      category: data.category || "",
      slug: file.replace(".json", ""),
      machineImage: data.machineImage,
    };
  });
  return summariesCache;
}

export function loadAllMachines(): MachineWithSlug[] {
  if (fullCache) return fullCache;
  fullCache = listJsonFiles().map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(MACHINES_DIR, file), "utf-8")) as MachineFull;
    return { ...data, slug: file.replace(".json", "") };
  });
  return fullCache;
}

// Format an ISO date string into a compact "5 Jul 2026, 14:32 UTC" stamp.
// Returns "" for null/empty input so callers can render conditionally.
export function formatLastUpdated(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
  return `${date}, ${time} UTC`;
}

// Returns the current moment as an ISO string captured during the build.
// Because Astro renders this at build time, every push to main regenerates
// the static HTML and the "Last updated" value advances — it always reflects
// the moment of the most recent successful deploy.
export function getBuildTimestamp(): string {
  return new Date().toISOString();
}

// Absolute URL for a machine page (or the directory root if slug is empty).
export function buildMachineUrl(slug: string, site?: URL | string | null): string {
  const origin = site ? String(site).replace(/\/$/, "") : "https://southern-iot.github.io";
  const path = slug ? `/machines/${slug}/` : "/";
  return `${origin}${withBase(path)}`;
}
