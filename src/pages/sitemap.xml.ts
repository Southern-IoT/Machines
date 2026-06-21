import type { APIRoute } from "astro";
import { loadAllMachines, buildMachineUrl } from "../lib/machines";

export const GET: APIRoute = async ({ site }) => {
  const machines = loadAllMachines();
  const urls = [
    { loc: buildMachineUrl("", site) },
    ...machines.map((m) => ({
      loc: buildMachineUrl(m.slug, site),
      lastmod: m.publishedDate ? new Date(m.publishedDate).toISOString().slice(0, 10) : undefined,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
