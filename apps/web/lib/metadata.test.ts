import { describe, it, expect } from "vitest";
import { buildMetadata, BASE_URL, SITE_NAME } from "./metadata";

describe("metadata", () => {
  describe("BASE_URL", () => {
    it("falls back to the production site URL when env is unset", () => {
      // Arrange / Act: BASE_URL is resolved at module load. In the test env
      // NEXT_PUBLIC_SITE_URL is not set, so the fallback applies.
      // Assert
      expect(BASE_URL).toBe("https://www.temitope.live");
    });
  });

  describe("buildMetadata", () => {
    it("returns the templated title and matching canonical alternate", () => {
      // Arrange
      const input = {
        title: "Blog",
        description: "Writing on the craft.",
        path: "/blog",
      };

      // Act
      const meta = buildMetadata(input);

      // Assert
      expect(meta.title).toBe("Blog");
      expect(meta.description).toBe("Writing on the craft.");
      expect(meta.alternates?.canonical).toBe(`${BASE_URL}/blog`);
    });

    it("sets metadataBase to the BASE_URL origin", () => {
      // Act
      const meta = buildMetadata({ title: "Home", description: "x" });

      // Assert
      expect(meta.metadataBase).toBeInstanceOf(URL);
      expect(meta.metadataBase?.toString()).toBe(`${BASE_URL}/`);
    });

    it("builds an openGraph object with suffixed social title and image", () => {
      // Act
      const meta = buildMetadata({
        title: "Blog",
        description: "desc",
        path: "/blog",
        image: "https://img.example/og.png",
      });

      // Assert
      expect(meta.openGraph?.title).toBe(`Blog — ${SITE_NAME}`);
      expect(meta.openGraph).toMatchObject({
        url: `${BASE_URL}/blog`,
        siteName: SITE_NAME,
        type: "website",
      });
      expect(meta.openGraph?.images).toEqual([
        { url: "https://img.example/og.png", width: 1200, height: 630 },
      ]);
    });

    it("uses a summary_large_image twitter card", () => {
      // Act
      const meta = buildMetadata({ title: "Blog", description: "desc" });

      // Assert
      expect(meta.twitter).toMatchObject({
        card: "summary_large_image",
        title: `Blog — ${SITE_NAME}`,
        description: "desc",
      });
    });

    it("respects titleAbsolute and defaults canonical to BASE_URL when no path", () => {
      // Act
      const meta = buildMetadata({
        title: "Temitope Ogunrekun — Software Engineer",
        description: "desc",
        titleAbsolute: true,
      });

      // Assert
      expect(meta.title).toEqual({
        absolute: "Temitope Ogunrekun — Software Engineer",
      });
      expect(meta.alternates?.canonical).toBe(BASE_URL);
    });
  });
});
