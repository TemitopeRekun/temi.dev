import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the admin_jwt cookie read used by lib/api.forwardToApi.
const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { POST } from "./route";

function jsonRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/admin/blog", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/admin/blog", () => {
  beforeEach(() => {
    cookieGet.mockReset();
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 on an invalid JSON body", async () => {
    // Arrange
    cookieGet.mockReturnValue({ value: "tok" });
    const req = new NextRequest("http://localhost/api/admin/blog", {
      method: "POST",
      body: "not-json",
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await POST(req);

    // Assert
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid JSON body" });
  });

  it("returns 401 when the admin_jwt cookie is missing", async () => {
    // Arrange
    cookieGet.mockReturnValue(undefined);
    vi.stubGlobal("fetch", vi.fn());

    // Act
    const res = await POST(jsonRequest({ title: "Hello" }));

    // Assert
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("forwards Authorization: Bearer <token> to the upstream when authed", async () => {
    // Arrange
    cookieGet.mockReturnValue({ value: "tok-xyz" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: "new" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // Act
    const res = await POST(jsonRequest({ title: "Hello" }));

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example/api/admin/blog");
    expect(init.method).toBe("POST");
    expect(init.headers.authorization).toBe("Bearer tok-xyz");
    expect(JSON.parse(init.body)).toEqual({ title: "Hello" });

    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({ id: "new" });
  });
});
