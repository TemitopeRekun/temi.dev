import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ set: cookieSet }),
}));

import { POST } from "./route";

function jsonRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    cookieSet.mockReset();
    process.env.API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 on an invalid JSON body", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn());
    const req = new NextRequest("http://localhost/api/auth/login", {
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

  it("returns 400 when email or password is missing", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn());

    // Act
    const res = await POST(jsonRequest({ email: "a@b.c" }));

    // Assert
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Email and password are required",
    });
  });

  it("sets the admin_jwt cookie and returns ok on a valid upstream token", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ accessToken: "jwt-token" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // Act
    const res = await POST(jsonRequest({ email: "a@b.c", password: "pw" }));

    // Assert
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example/api/auth/login");
    expect(cookieSet).toHaveBeenCalledTimes(1);
    expect(cookieSet.mock.calls[0][0]).toMatchObject({
      name: "admin_jwt",
      value: "jwt-token",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("returns the upstream status on a failed login without setting a cookie", async () => {
    // Arrange
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) }),
    );

    // Act
    const res = await POST(jsonRequest({ email: "a@b.c", password: "wrong" }));

    // Assert
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Login failed" });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("returns 502 when the upstream fetch rejects", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("net")));

    // Act
    const res = await POST(jsonRequest({ email: "a@b.c", password: "pw" }));

    // Assert
    expect(res.status).toBe(502);
  });

  it("returns 500 when the upstream auth response lacks a token", async () => {
    // Arrange
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ wrong: "shape" }),
      }),
    );

    // Act
    const res = await POST(jsonRequest({ email: "a@b.c", password: "pw" }));

    // Assert
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Invalid auth response" });
    expect(cookieSet).not.toHaveBeenCalled();
  });
});
