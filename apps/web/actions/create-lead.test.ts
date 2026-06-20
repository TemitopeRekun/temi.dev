import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLeadAction } from "./create-lead";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("createLeadAction", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a validation error when required fields are missing", async () => {
    // Arrange
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await createLeadAction(null, form({ name: "Ada" }));

    // Assert
    expect(result).toEqual({
      ok: false,
      error: "Please complete all required fields.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the trimmed lead and returns ok on upstream success", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await createLeadAction(
      null,
      form({
        name: "  Ada  ",
        email: " ada@example.com ",
        message: "  Hi there ",
        service: "consulting",
      }),
    );

    // Assert
    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example/api/leads");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "Hi there",
      service: "consulting",
    });
  });

  it("returns a friendly error when the upstream responds non-ok", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    // Act
    const result = await createLeadAction(
      null,
      form({ name: "Ada", email: "a@b.c", message: "hi" }),
    );

    // Assert
    expect(result).toEqual({
      ok: false,
      error: "Failed to submit. Please try again.",
    });
  });

  it("returns a network error when the fetch throws", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    // Act
    const result = await createLeadAction(
      null,
      form({ name: "Ada", email: "a@b.c", message: "hi" }),
    );

    // Assert
    expect(result).toEqual({
      ok: false,
      error: "Network error. Please try again later.",
    });
  });

  it("sends service as null when not provided", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    // Act
    await createLeadAction(
      null,
      form({ name: "Ada", email: "a@b.c", message: "hi" }),
    );

    // Assert
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).service).toBeNull();
  });
});
