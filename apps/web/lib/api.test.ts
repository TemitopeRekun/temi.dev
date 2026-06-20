import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock next/headers cookies() so forwardToApi can read the admin_jwt cookie.
const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { apiBaseUrl, forwardToApi } from "./api";

describe("api", () => {
  describe("apiBaseUrl", () => {
    const original = { ...process.env };
    afterEach(() => {
      process.env = { ...original };
    });

    it("prefers API_BASE_URL over the public var and localhost", () => {
      // Arrange
      process.env.API_BASE_URL = "https://server.example";
      process.env.NEXT_PUBLIC_API_BASE_URL = "https://public.example";

      // Act / Assert
      expect(apiBaseUrl()).toBe("https://server.example");
    });

    it("falls back to NEXT_PUBLIC_API_BASE_URL when API_BASE_URL is empty", () => {
      // Arrange
      process.env.API_BASE_URL = "   ";
      process.env.NEXT_PUBLIC_API_BASE_URL = "https://public.example";

      // Act / Assert
      expect(apiBaseUrl()).toBe("https://public.example");
    });

    it("falls back to localhost when neither var is set", () => {
      // Arrange
      delete process.env.API_BASE_URL;
      delete process.env.NEXT_PUBLIC_API_BASE_URL;

      // Act / Assert
      expect(apiBaseUrl()).toBe("http://localhost:4000");
    });
  });

  describe("forwardToApi", () => {
    beforeEach(() => {
      cookieGet.mockReset();
      process.env.API_BASE_URL = "https://api.example";
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("returns 401 when the admin_jwt cookie is missing", async () => {
      // Arrange
      cookieGet.mockReturnValue(undefined);
      const fetchSpy = vi.fn();
      vi.stubGlobal("fetch", fetchSpy);

      // Act
      const res = await forwardToApi({ path: "/api/admin/blog" });

      // Assert
      expect(res.status).toBe(401);
      await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("forwards the bearer token and mirrors the upstream JSON + status", async () => {
      // Arrange
      cookieGet.mockReturnValue({ value: "tok-123" });
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ id: "abc" }),
      });
      vi.stubGlobal("fetch", fetchMock);

      // Act
      const res = await forwardToApi({
        method: "POST",
        path: "/api/admin/blog",
        body: { title: "hi" },
      });

      // Assert
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.example/api/admin/blog");
      expect(init.method).toBe("POST");
      expect(init.headers.authorization).toBe("Bearer tok-123");
      expect(init.headers["content-type"]).toBe("application/json");
      expect(init.body).toBe(JSON.stringify({ title: "hi" }));

      expect(res.status).toBe(201);
      await expect(res.json()).resolves.toEqual({ id: "abc" });
    });

    it("returns 502 when the upstream fetch rejects", async () => {
      // Arrange
      cookieGet.mockReturnValue({ value: "tok" });
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("net")));

      // Act
      const res = await forwardToApi({ path: "/api/admin/blog" });

      // Assert
      expect(res.status).toBe(502);
      await expect(res.json()).resolves.toEqual({ error: "Upstream error" });
    });

    it("propagates an upstream error status when the response is not ok", async () => {
      // Arrange
      cookieGet.mockReturnValue({ value: "tok" });
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 418, json: async () => ({}) }),
      );

      // Act
      const res = await forwardToApi({ path: "/api/admin/blog" });

      // Assert
      expect(res.status).toBe(418);
      await expect(res.json()).resolves.toEqual({ error: "Upstream error" });
    });

    it("appends the search string to the upstream URL", async () => {
      // Arrange
      cookieGet.mockReturnValue({ value: "tok" });
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });
      vi.stubGlobal("fetch", fetchMock);

      // Act
      await forwardToApi({ path: "/api/admin/blog", search: "take=10" });

      // Assert
      expect(fetchMock.mock.calls[0][0]).toBe(
        "https://api.example/api/admin/blog?take=10",
      );
    });
  });
});
