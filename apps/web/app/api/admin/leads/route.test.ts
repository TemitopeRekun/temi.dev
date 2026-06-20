import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { GET } from "./route";

describe("GET /api/admin/leads", () => {
  beforeEach(() => {
    cookieGet.mockReset().mockReturnValue({ value: "tok" });
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps take/cursor/status query params into the upstream search string", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest(
      "http://localhost/api/admin/leads?take=5&cursor=c1&status=NEW",
    );

    // Act
    await GET(req);

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/leads?take=5&cursor=c1&status=NEW",
    );
  });

  it("omits absent query params from the upstream search string", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const req = new NextRequest("http://localhost/api/admin/leads?take=5");

    // Act
    await GET(req);

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/leads?take=5",
    );
  });

  it("returns 401 when unauthenticated", async () => {
    // Arrange
    cookieGet.mockReturnValue(undefined);
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/admin/leads");

    // Act
    const res = await GET(req);

    // Assert
    expect(res.status).toBe(401);
  });
});
