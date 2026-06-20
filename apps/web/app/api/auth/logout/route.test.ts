import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const cookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ set: cookieSet }),
}));

import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    cookieSet.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clears the admin_jwt cookie and redirects to the login page", async () => {
    // Arrange
    const req = new NextRequest("http://localhost/api/auth/logout", {
      method: "POST",
    });

    // Act
    const res = await POST(req);

    // Assert
    expect(cookieSet).toHaveBeenCalledTimes(1);
    expect(cookieSet.mock.calls[0][0]).toMatchObject({
      name: "admin_jwt",
      value: "",
      maxAge: 0,
      path: "/",
    });
    // NextResponse.redirect responds with a 3xx and a Location header.
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toBe("http://localhost/admin/login");
  });
});
