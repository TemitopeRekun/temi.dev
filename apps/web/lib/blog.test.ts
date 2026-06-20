import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { estimateReadTime, getPosts, getPostBySlug } from "./blog";

describe("blog", () => {
  describe("estimateReadTime", () => {
    it("returns a minimum of 1 minute for empty/short content", () => {
      // Assert
      expect(estimateReadTime(undefined)).toBe(1);
      expect(estimateReadTime("")).toBe(1);
      expect(estimateReadTime("a few words here")).toBe(1);
    });

    it("computes read time from word count at ~200 wpm", () => {
      // Arrange: 600 words => 3 minutes.
      const content = Array.from({ length: 600 }, () => "word").join(" ");

      // Act / Assert
      expect(estimateReadTime(content)).toBe(3);
    });

    it("rounds to the nearest minute", () => {
      // Arrange: 500 words => 2.5 => rounds to 3.
      const content = Array.from({ length: 500 }, () => "word").join(" ");

      // Act / Assert
      expect(estimateReadTime(content)).toBe(3);
    });
  });

  describe("getPosts", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("maps a valid payload, deriving tag/image/readTime", async () => {
      // Arrange
      const payload = {
        items: [
          {
            id: "1",
            slug: "hello",
            title: "Hello",
            tags: ["Tech", "Next"],
            excerpt: "An intro",
            coverImage: "/cover.png",
            content: Array.from({ length: 400 }, () => "w").join(" "),
          },
        ],
      };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => payload,
        }),
      );

      // Act
      const posts = await getPosts();

      // Assert
      expect(posts).toHaveLength(1);
      expect(posts[0]).toMatchObject({
        slug: "hello",
        title: "Hello",
        tag: "Tech",
        tags: ["Tech", "Next"],
        excerpt: "An intro",
        image: "/cover.png",
        readTime: 2,
      });
    });

    it("falls back to defaults for sparse items", async () => {
      // Arrange
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ items: [{ slug: "bare", title: "Bare" }] }),
        }),
      );

      // Act
      const posts = await getPosts();

      // Assert
      expect(posts[0]).toMatchObject({
        tag: "Tech",
        tags: [],
        excerpt: "No excerpt available.",
        image: "/blog/bare/og",
        readTime: 1,
      });
    });

    it("returns [] and logs when the upstream fetch fails", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("network down")),
      );

      // Act
      const posts = await getPosts();

      // Assert
      expect(posts).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it("returns [] and logs on a non-ok response", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
      );

      // Act
      const posts = await getPosts();

      // Assert
      expect(posts).toEqual([]);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("upstream returned 500"),
      );
    });

    it("returns [] and logs on an invalid (zod) payload shape", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          // `items` should be an array; a string fails the schema.
          json: async () => ({ items: "nope" }),
        }),
      );

      // Act
      const posts = await getPosts();

      // Assert
      expect(posts).toEqual([]);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("unexpected payload shape"),
        expect.anything(),
      );
    });
  });

  describe("getPostBySlug", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("maps a valid single post", async () => {
      // Arrange
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ slug: "hello", title: "Hello", content: "x" }),
        }),
      );

      // Act
      const post = await getPostBySlug("hello");

      // Assert
      expect(post).toMatchObject({ slug: "hello", title: "Hello" });
    });

    it("returns undefined on a 404 without logging an error", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
      );

      // Act
      const post = await getPostBySlug("missing");

      // Assert
      expect(post).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
    });

    it("returns undefined and logs when the fetch throws", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));

      // Act
      const post = await getPostBySlug("hello");

      // Assert
      expect(post).toBeUndefined();
      expect(spy).toHaveBeenCalled();
    });
  });
});
