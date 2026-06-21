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

// Absolute URL for a machine page (or the directory root if slug is empty).
export function buildMachineUrl(slug: string, site?: URL | string | null): string {
  const origin = site ? String(site).replace(/\/$/, "") : "https://southern-iot.github.io";
  const path = slug ? `/machines/${slug}/` : "/";
  return `${origin}${withBase(path)}`;
}
