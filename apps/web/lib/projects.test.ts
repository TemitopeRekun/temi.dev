import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getProjects, getProjectBySlug } from "./projects";

describe("projects", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getProjects", () => {
    it("maps a valid payload, deriving slug/year/category/tags defaults", async () => {
      // Arrange
      const payload = [
        {
          id: "p1",
          title: "CRM",
          createdAt: "2023-04-01T00:00:00.000Z",
          techStack: ["Next", "Nest"],
          description: "A CRM",
          coverImage: "/crm.png",
          featured: true,
          order: 2,
        },
      ];
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          // The list endpoint returns a cursor-paginated envelope.
          json: async () => ({ items: payload, nextCursor: undefined }),
        }),
      );

      // Act
      const projects = await getProjects();

      // Assert
      expect(projects).toHaveLength(1);
      expect(projects[0]).toMatchObject({
        id: "p1",
        slug: "p1", // falls back to id when slug absent
        title: "CRM",
        year: 2023, // derived from createdAt
        category: "Other",
        tags: ["Next", "Nest"],
        image: "/crm.png",
        featured: true,
        order: 2,
      });
    });

    it("returns [] and logs on a non-ok response", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ([]) }),
      );

      // Act
      const projects = await getProjects();

      // Assert
      expect(projects).toEqual([]);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("upstream returned 503"),
      );
    });

    it("returns [] and logs when the fetch throws", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

      // Act
      const projects = await getProjects();

      // Assert
      expect(projects).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it("returns [] and logs on an invalid (zod) payload shape", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          // each item must have id+title; missing id fails the schema.
          json: async () => [{ title: "no id" }],
        }),
      );

      // Act
      const projects = await getProjects();

      // Assert
      expect(projects).toEqual([]);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("unexpected payload shape"),
        expect.anything(),
      );
    });
  });

  describe("getProjectBySlug", () => {
    it("maps a valid single project", async () => {
      // Arrange
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ id: "p1", slug: "crm", title: "CRM", year: 2024 }),
        }),
      );

      // Act
      const project = await getProjectBySlug("crm");

      // Assert
      expect(project).toMatchObject({ id: "p1", slug: "crm", year: 2024 });
    });

    it("returns null on a 404 without logging an error", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
      );

      // Act
      const project = await getProjectBySlug("missing");

      // Assert
      expect(project).toBeNull();
      expect(spy).not.toHaveBeenCalled();
    });

    it("returns null and logs when the fetch throws", async () => {
      // Arrange
      const spy = vi.spyOn(console, "error");
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));

      // Act
      const project = await getProjectBySlug("crm");

      // Assert
      expect(project).toBeNull();
      expect(spy).toHaveBeenCalled();
    });
  });
});
