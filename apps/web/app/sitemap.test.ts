import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STATIC_ROUTES } from "./sitemap";

/**
 * Guards against the failure this list already had once: a public page shipped,
 * was linked from the nav, carried its own canonical tag — and never appeared
 * in the sitemap, so it was only reachable by crawl.
 *
 * Walks `app/(public)` for real page directories and asserts each one is
 * declared in STATIC_ROUTES. Dynamic segments are excluded because their URLs
 * come from content, not this list.
 */
function discoverPublicRoutes(): string[] {
  const root = join(__dirname, "(public)");
  const found: string[] = [];

  const walk = (dir: string, urlPath: string): void => {
    if (existsSync(join(dir, "page.tsx"))) {
      found.push(urlPath === "" ? "/" : urlPath);
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      // Dynamic segments ([slug]) and route groups are not static routes.
      if (entry.name.startsWith("[")) continue;
      if (entry.name.startsWith("(")) {
        walk(join(dir, entry.name), urlPath);
        continue;
      }
      walk(join(dir, entry.name), `${urlPath}/${entry.name}`);
    }
  };

  walk(root, "");
  return found;
}

describe("sitemap STATIC_ROUTES", () => {
  it("declares every static public page", () => {
    const declared = new Set(STATIC_ROUTES.map((r) => r.path));
    const missing = discoverPublicRoutes().filter((p) => !declared.has(p));
    expect(
      missing,
      `these public pages exist but are absent from STATIC_ROUTES in app/sitemap.ts: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("does not declare routes that have no page", () => {
    const actual = new Set(discoverPublicRoutes());
    const stale = STATIC_ROUTES.map((r) => r.path).filter(
      (p) => !actual.has(p),
    );
    expect(
      stale,
      `these routes are in STATIC_ROUTES but have no page: ${stale.join(", ")}`,
    ).toEqual([]);
  });

  it("finds the pages it is supposed to be checking", () => {
    // Without this the walker could silently return [] and both tests above
    // would pass vacuously.
    const found = discoverPublicRoutes();
    expect(found).toContain("/");
    expect(found).toContain("/stack");
    expect(found.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps the homepage at the highest priority", () => {
    const home = STATIC_ROUTES.find((r) => r.path === "/");
    expect(home?.priority).toBe(1);
  });
});
