import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "../providers/ThemeProvider";
import { QueryProvider } from "../providers/QueryProvider";
import { JsonLd } from "../components/seo/JsonLd";
import { BASE_URL } from "../lib/metadata";
import { DM_Mono, Fraunces, Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Temitope Ogunrekun — Full-Stack Engineer",
    template: "%s — Temitope Ogunrekun",
  },
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
