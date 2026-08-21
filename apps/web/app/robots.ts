import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/metadata";

const DISALLOW = ["/admin", "/api"];

/**
 * Major AI crawlers, allowed deliberately so this site can be referenced and
 * cited (see also `public/llms.txt`).
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Googlebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const base = BASE_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      // A crawler obeys only the most specific group that matches it, so each
      // named agent must repeat the disallow list. Without it, an `Allow: /`
      // group exempts that agent from the wildcard rule entirely and opens
      // /admin and /api to it.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

