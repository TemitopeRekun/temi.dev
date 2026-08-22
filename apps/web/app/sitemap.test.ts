import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STATIC_ROUTES, newest, parseDate } from "./sitemap";

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

describe("sitemap lastmod helpers", () => {
  it("parses ISO timestamps and rejects junk", () => {
    expect(parseDate("2026-03-11T22:56:31.875Z")?.toISOString()).toBe(
      "2026-03-11T22:56:31.875Z",
    );
    expect(parseDate(undefined)).toBeUndefined();
    expect(parseDate(null)).toBeUndefined();
    expect(parseDate("")).toBeUndefined();
    expect(parseDate("not a date")).toBeUndefined();
  });

  it("picks the most recent date and ignores gaps", () => {
    const a = new Date("2026-01-01T00:00:00.000Z");
    const b = new Date("2026-06-01T00:00:00.000Z");
    expect(newest([a, undefined, b])?.toISOString()).toBe(b.toISOString());
    expect(newest([undefined, undefined])).toBeUndefined();
    expect(newest([])).toBeUndefined();
  });

  it("only derives lastmod for content-driven routes", () => {
    // The hand-written pages must not report a runtime timestamp: this route
    // revalidates every 60s, so `new Date()` made them claim to change on
    // every fetch.
    const derived = STATIC_ROUTES.filter((r) => r.derivesLastModified).map(
      (r) => r.path,
    );
    const bare = STATIC_ROUTES.filter((r) => !r.derivesLastModified).map(
      (r) => r.path,
    );
    expect(derived.sort()).toEqual(["/", "/blog", "/work"]);
    expect(bare.sort()).toEqual(["/about", "/contact", "/stack"]);
  });
});
