import { getPosts } from "../../lib/blog";
import { BASE_URL, SITE_NAME } from "../../lib/metadata";

/**
 * RSS 2.0 feed for the blog.
 *
 * Referenced from the root layout via `alternates.types`, which emits the
 * `<link rel="alternate" type="application/rss+xml">` that readers and
 * aggregators discover.
 */

/** Escape the five XML predefined entities. Order matters: `&` first. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const posts = await getPosts();

  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      // RSS wants RFC 822; an invalid date is worse than an absent one.
      const published = post.publishedAt ? new Date(post.publishedAt) : null;
      const pubDate =
        published && !Number.isNaN(published.getTime())
          ? `<pubDate>${published.toUTCString()}</pubDate>`
          : "";
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        ...post.tags.map((t) => `      <category>${escapeXml(t)}</category>`),
        ...(pubDate ? [`      ${pubDate}`] : []),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${BASE_URL}/blog</link>`,
    "    <description>Notes on AI engineering, backend systems, and full-stack work.</description>",
    "    <language>en</language>",
    `    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
