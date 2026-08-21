import type { MetadataRoute } from "next";
import { SITE_NAME } from "../lib/metadata";

/**
 * Web app manifest. `app/icon.tsx` already generates the icon, so this reuses
 * that route rather than adding static PNG assets.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Full-Stack Engineer`,
    short_name: SITE_NAME,
    description:
      "Portfolio, technical blog, and projects of Temitope Ogunrekun, a full-stack engineer.",
    start_url: "/",
    display: "standalone",
    // The --bg / --accent token values from globals.css, so an installed shell
    // matches the site rather than flashing default white.
    background_color: "#FFF4E6",
    theme_color: "#F07C3A",
    icons: [
      // 32px is the favicon; browsers need >=192px before offering to install.
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
