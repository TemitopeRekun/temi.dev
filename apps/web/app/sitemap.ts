import type { MetadataRoute } from "next";
import { getProjects } from "../lib/projects";
import { getPosts } from "../lib/blog";
import { BASE_URL } from "../lib/metadata";

/**
 * Every crawlable route that is not generated from content. Exported so
 * `sitemap.test.ts` can assert this list covers every public page directory —
 * `/stack` was live for months without appearing here, and a hand-maintained
 * literal list is exactly how that happens.
 *
 * `derivesLastModified` marks the routes whose content comes from the CMS, so
 * their <lastmod> can be computed from real timestamps. The rest are
 * hand-written pages with no truthful runtime timestamp; see below.
 */
export const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
  derivesLastModified?: "newest-content" | "newest-post" | "newest-project";
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1, derivesLastModified: "newest-content" },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8, derivesLastModified: "newest-post" },
  { path: "/work", changeFrequency: "weekly", priority: 0.8, derivesLastModified: "newest-project" },
  { path: "/stack", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

/** Parse an ISO timestamp, or undefined when absent/unparseable. */
export function parseDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/** The most recent of the given dates, ignoring gaps. */
export function newest(dates: Array<Date | undefined>): Date | undefined {
  const times = dates
    .filter((d): d is Date => d !== undefined)
    .map((d) => d.getTime());
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BASE_URL;
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const newestPost = newest(
    posts.map((b) => parseDate(b.updatedAt ?? b.publishedAt)),
  );
  const newestProject = newest(projects.map((p) => parseDate(p.updatedAt)));
  const newestContent = newest([newestPost, newestProject]);

  const derived = {
    "newest-content": newestContent,
    "newest-post": newestPost,
    "newest-project": newestProject,
  } as const;

  /*
   * Static routes omit <lastmod> unless it can be derived from content.
   *
   * These previously all reported `new Date()`. Because this route revalidates
   * every 60s, that made six URLs claim to have changed moments ago on every
   * single fetch — the exact false-freshness signal the content routes below
   * are careful to avoid, and one crawlers learn to discount. /about, /stack
   * and /contact are hand-written: their real last-modified is a source-control
   * fact not available at runtime, and <lastmod> is optional in the sitemap
   * protocol, so omitting it is the honest choice.
   */
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => {
    const lastModified = route.derivesLastModified
      ? derived[route.derivesLastModified]
      : undefined;
    return {
      url: `${base}${route.path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });

  // Use real content timestamps so <lastmod> reflects genuine freshness rather
  // than the request time.
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => {
    const lastModified = parseDate(p.updatedAt);
    return {
      url: `${base}/work/${p.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "yearly",
      priority: 0.6,
    };
  });

  const blogRoutes: MetadataRoute.Sitemap = posts.map((b) => {
    const lastModified = parseDate(b.updatedAt ?? b.publishedAt);
    return {
      url: `${base}/blog/${b.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
