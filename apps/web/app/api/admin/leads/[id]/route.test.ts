import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { GET, PATCH } from "./route";

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/api/admin/leads/[id]", () => {
  beforeEach(() => {
    cookieGet.mockReset().mockReturnValue({ value: "tok" });
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("GET forwards to the id-scoped upstream path", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "7" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/leads/7");

    // Act
    const res = await GET(req, params("7"));

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/leads/7",
    );
    expect(res.status).toBe(200);
  });

  it("PATCH forwards the body to the id-scoped upstream path", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "7", status: "CONTACTED" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/leads/7", {
      method: "PATCH",
      body: JSON.stringify({ status: "CONTACTED" }),
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await PATCH(req, params("7"));

    // Assert
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example/api/admin/leads/7");
    expect(JSON.parse(init.body)).toEqual({ status: "CONTACTED" });
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 on an invalid JSON body", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/admin/leads/7", {
      method: "PATCH",
      body: "nope",
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await PATCH(req, params("7"));

    // Assert
    expect(res.status).toBe(400);
  });
});
