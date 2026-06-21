// Centralized base-path helpers so we never hardcode "/Machines/" in components.
// astro.config.mjs sets base="/Machines/" for GitHub Pages.

export function getBase(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path)) return path;
  if (/^(mailto:|tel:|#)/i.test(path)) return path;
  const base = getBase();
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/${path}`;
}

export function assetSrc(path?: string): string {
  if (!path) return "";
  return path.startsWith("/") ? withBase(path) : path;
}
