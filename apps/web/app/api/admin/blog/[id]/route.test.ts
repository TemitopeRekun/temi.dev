import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { PATCH, DELETE } from "./route";

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/api/admin/blog/[id]", () => {
  beforeEach(() => {
    cookieGet.mockReset().mockReturnValue({ value: "tok" });
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("PATCH forwards the body to the id-scoped upstream path", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "42" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/blog/42", {
      method: "PATCH",
      body: JSON.stringify({ title: "Edit" }),
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await PATCH(req, params("42"));

    // Assert
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example/api/admin/blog/42");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body)).toEqual({ title: "Edit" });
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 on an invalid JSON body", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/admin/blog/42", {
      method: "PATCH",
      body: "oops",
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await PATCH(req, params("42"));

    // Assert
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid JSON body" });
  });

  it("DELETE forwards a DELETE to the id-scoped upstream path", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/blog/42", {
      method: "DELETE",
    });

    // Act
    const res = await DELETE(req, params("42"));

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/blog/42",
    );
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    expect(res.status).toBe(200);
  });

  it("returns 401 when unauthenticated", async () => {
    // Arrange
    cookieGet.mockReturnValue(undefined);
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/admin/blog/42", {
      method: "DELETE",
    });

    // Act
    const res = await DELETE(req, params("42"));

    // Assert
    expect(res.status).toBe(401);
  });
});
