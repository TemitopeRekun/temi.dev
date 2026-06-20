import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

import { POST } from "./route";

function jsonRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/admin/projects", () => {
  beforeEach(() => {
    cookieGet.mockReset().mockReturnValue({ value: "tok" });
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the body to the upstream projects endpoint", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: "p1" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // Act
    const res = await POST(jsonRequest({ title: "New" }));

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example/api/admin/projects",
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ title: "New" });
    expect(res.status).toBe(201);
  });

  it("returns 400 on an invalid JSON body", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/admin/projects", {
      method: "POST",
      body: "bad",
      headers: { "content-type": "application/json" },
    });

    // Act
    const res = await POST(req);

    // Assert
    expect(res.status).toBe(400);
  });

  it("returns 401 when unauthenticated", async () => {
    // Arrange
    cookieGet.mockReturnValue(undefined);
    vi.stubGlobal("fetch", vi.fn());

    // Act
    const res = await POST(jsonRequest({ title: "New" }));

    // Assert
    expect(res.status).toBe(401);
  });
});
