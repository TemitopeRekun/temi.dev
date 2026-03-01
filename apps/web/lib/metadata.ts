import type { Metadata } from "next";

const SITE_NAME = "Temitope Ogunrekun";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://temi.dev";
const DEFAULT_OG = "https://picsum.photos/1200/630?grayscale&blur=0&seed=temi";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
};

export function buildMetadata(input: MetaInput): Metadata {
  const url = input.path ? new URL(input.path, BASE_URL).toString() : BASE_URL;
  const image = input.image ?? DEFAULT_OG;
  const type = input.type ?? "website";
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

