import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { GET } from "./route";

describe("GET /api/admin/blog/list", () => {
  beforeEach(() => {
    cookieGet.mockReset();
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards an authed GET to the upstream blog list", async () => {
    // Arrange
    cookieGet.mockReturnValue({ value: "tok" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [{ id: "1" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // Act
    const res = await GET();

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/blog/list",
    );
    expect(fetchMock.mock.calls[0][1].headers.authorization).toBe("Bearer tok");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ items: [{ id: "1" }] });
  });

  it("returns 401 when unauthenticated", async () => {
    // Arrange
    cookieGet.mockReturnValue(undefined);
    vi.stubGlobal("fetch", vi.fn());

    // Act
    const res = await GET();

    // Assert
    expect(res.status).toBe(401);
  });
});
