import type { MetadataRoute } from "next";
import { getProjects } from "../lib/projects";
import { getPosts } from "../lib/blog";
import { BASE_URL } from "../lib/metadata";

/**
 * Every crawlable route that is not generated from content. Exported so
 * `sitemap.test.ts` can assert this list covers every public page directory —
 * `/stack` was live for months without appearing here, and a hand-maintained
 * literal list is exactly how that happens.
 */
export const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/work", changeFrequency: "weekly", priority: 0.8 },
  { path: "/stack", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

/** Parse an ISO timestamp to a Date, falling back when absent/invalid. */
function toDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BASE_URL;
  const now = new Date();
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Use real content timestamps so <lastmod> reflects genuine freshness rather
  // than the request time (a false signal to crawlers).
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: toDate(p.updatedAt, now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: toDate(b.updatedAt ?? b.publishedAt, now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
