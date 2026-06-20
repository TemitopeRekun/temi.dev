import type { MetadataRoute } from "next";
import { getProjects } from "../lib/projects";
import { getPosts } from "../lib/blog";
import { BASE_URL } from "../lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BASE_URL;
  const now = new Date();
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
