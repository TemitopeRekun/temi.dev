import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "../providers/ThemeProvider";
import { QueryProvider } from "../providers/QueryProvider";
import { JsonLd } from "../components/seo/JsonLd";
import { BASE_URL, RSS_ALTERNATE_TYPES } from "../lib/metadata";
import { DM_Mono, Fraunces, Syne } from "next/font/google";

// Syne and Fraunces are variable fonts, so `weight` is omitted deliberately:
// listing individual weights makes next/font fetch a static file per weight
// (five each, here), whereas omitting it fetches one variable file covering the
// whole range. Every weight the site uses stays available.
const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

// DM Mono has no variable version, so `weight` is required and each entry is a
// separate file. 300 was declared but never used — every `font-light` site
// resolves to Syne or Fraunces, not the mono face.
const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Temitope Ogunrekun — Full-Stack Engineer",
    template: "%s — Temitope Ogunrekun",
  },
  // Emits <link rel="alternate" type="application/rss+xml">, which is how feed
  // readers discover app/feed.xml. buildMetadata repeats this on every page
  // that sets a canonical — see RSS_ALTERNATE_TYPES for why it must.
  alternates: { types: RSS_ALTERNATE_TYPES },
  verification: {
    google: "zuL_znB3EWJEudjKxbRM1G8Jvab0VPKS-h_rfhanMgk",
  },
};

// Site-wide WebSite + Organization graph (emitted on every page). Page-level
// JSON-LD (Person on home, BlogPosting/CreativeWork on detail pages) augments
// this. The shared @id lets the publisher link resolve to one entity.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: `${BASE_URL}/`,
      name: "Temitope Ogunrekun",
      description:
        "Portfolio, technical blog, and projects of Temitope Ogunrekun, a full-stack engineer.",
      inLanguage: "en",
      publisher: { "@id": `${BASE_URL}/#identity` },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#identity`,
      name: "Temitope Ogunrekun",
      url: `${BASE_URL}/`,
      sameAs: [
        "https://github.com/TemitopeRekun",
        "https://www.linkedin.com/in/temitope-ogunrekun-092736229/",
        "https://x.com/_sireTemi",
      ],
    },
  ],
};

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmMono.variable} ${fraunces.variable} bg-(--bg) text-(--text) antialiased`}
      >
        <JsonLd data={siteJsonLd} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-full focus:bg-(--accent) focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-black focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <QueryProvider>{props.children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
