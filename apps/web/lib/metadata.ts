import type { Metadata } from "next";

export const SITE_NAME = "Temitope Ogunrekun";

/**
 * The public contact address, and the single place it is defined.
 *
 * It was previously hardcoded as `hello@temi.dev` in two places while the site
 * canonicalised on temitope.live and no mailbox existed on temi.dev at all — so
 * every message sent to the address on the hiring page went nowhere. Contact-form
 * submissions are unaffected: those are delivered by the API via
 * LEAD_NOTIFY_EMAIL.
 */
export const CONTACT_EMAIL = "olalekanogunrekun@gmail.com";
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.temitope.live";
const DEFAULT_OG = `${BASE_URL}/opengraph-image`;

/**
 * The RSS `<link rel="alternate">` descriptor.
 *
 * Must be repeated on every page that sets `alternates`, not just the root
 * layout: Next merges `alternates` as a whole field, so a page supplying
 * `{ canonical }` replaces the layout's `{ types }` rather than extending it —
 * which silently drops the feed link from every page.
 */
export const RSS_ALTERNATE_TYPES = {
  "application/rss+xml": [
    { url: "/feed.xml", title: `${SITE_NAME} — Blog` },
  ],
};

type MetaInput = {
  /**
   * The page-specific title segment, e.g. "Blog". The root layout title
   * template appends " — Temitope Ogunrekun" automatically, so do NOT repeat
   * the site suffix here. Pass `titleAbsolute: true` to opt out of the
   * template (used for the homepage, where the full title is the default).
   */
  title: string;
  titleAbsolute?: boolean;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
};

/**
 * Compose the full, suffixed title used for Open Graph / Twitter, which have
 * no title template of their own. Mirrors the root layout template.
 */
function fullTitle(input: MetaInput): string {
  if (input.titleAbsolute || input.title.includes(SITE_NAME)) {
    return input.title;
  }
  return `${input.title} — ${SITE_NAME}`;
}

export function buildMetadata(input: MetaInput): Metadata {
  const url = input.path ? new URL(input.path, BASE_URL).toString() : BASE_URL;
  const image = input.image ?? DEFAULT_OG;
  const type = input.type ?? "website";
  const social = fullTitle(input);
  return {
    metadataBase: new URL(BASE_URL),
    title: input.titleAbsolute ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url, types: RSS_ALTERNATE_TYPES },
    openGraph: {
      title: social,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description: input.description,
      images: [image],
    },
  };
}
