import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { PATCH, DELETE } from "./route";

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/api/admin/projects/[id]", () => {
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
      json: async () => ({ id: "p1" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/projects/p1", {
      method: "PATCH",
      body: JSON.stringify({ featured: true }),
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await PATCH(req, params("p1"));

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/projects/p1",
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      featured: true,
    });
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 on an invalid JSON body", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/admin/projects/p1", {
      method: "PATCH",
      body: "bad",
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await PATCH(req, params("p1"));

    // Assert
    expect(res.status).toBe(400);
  });

  it("DELETE forwards a DELETE to the id-scoped upstream path", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/projects/p1", {
      method: "DELETE",
    });

    // Act
    const res = await DELETE(req, params("p1"));

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/projects/p1",
    );
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    expect(res.status).toBe(200);
  });
});
