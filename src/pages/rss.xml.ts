// Astro's content collections aren't used (we use raw JSON files),
// so we hand-roll the feed at build time.
import type { APIRoute } from "astro";
import { loadAllMachines, buildMachineUrl } from "../lib/machines";

export const GET: APIRoute = async ({ site }) => {
  const machines = loadAllMachines();
  const channelLink = buildMachineUrl("", site);
  const items = machines
    .map((m) => ({
      title: m.title,
      link: buildMachineUrl(m.slug, site),
      description: m.subtitle || m.purposeAndApplication?.purpose || m.title,
      pubDate: m.publishedDate ? new Date(m.publishedDate).toUTCString() : new Date().toUTCString(),
    }))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const escapeXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Southern Machines Directory</title>
    <link>${escapeXml(channelLink)}</link>
    <description>Technical specifications, working principles, and maintenance documentation for industrial factory machines.</description>
    <language>en</language>
    ${items
      .map(
        (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <description>${escapeXml(it.description)}</description>
      <pubDate>${it.pubDate}</pubDate>
      <guid>${escapeXml(it.link)}</guid>
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
