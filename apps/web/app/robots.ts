import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const base = BASE_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Explicitly allow major AI crawlers to index and reference this site
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

