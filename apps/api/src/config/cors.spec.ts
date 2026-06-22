import { getAllowedOrigins, isOriginAllowed, corsOriginForSse } from "./cors";

describe("cors config helpers", () => {
  describe("getAllowedOrigins", () => {
    it("parses a comma-separated CORS_ORIGINS list, trimming blanks", () => {
      expect(
        getAllowedOrigins({
          CORS_ORIGINS: "https://a.com, https://b.com ,, ",
        } as NodeJS.ProcessEnv),
      ).toEqual(["https://a.com", "https://b.com"]);
    });

    it("falls back to the canonical production domains when unset", () => {
      expect(getAllowedOrigins({} as NodeJS.ProcessEnv)).toEqual([
        "https://temitope.live",
        "https://www.temitope.live",
      ]);
    });
  });

  describe("isOriginAllowed", () => {
    it("returns false for a missing origin", () => {
      expect(isOriginAllowed(undefined, {} as NodeJS.ProcessEnv)).toBe(false);
    });

    it("allows an allowlisted origin", () => {
      expect(
        isOriginAllowed("https://a.com", {
          CORS_ORIGINS: "https://a.com",
        } as NodeJS.ProcessEnv),
      ).toBe(true);
    });

    it("rejects a non-allowlisted origin", () => {
      expect(
        isOriginAllowed("https://evil.com", {
          CORS_ORIGINS: "https://a.com",
        } as NodeJS.ProcessEnv),
      ).toBe(false);
    });

    it("allows localhost outside production but not in production", () => {
      expect(
        isOriginAllowed("http://localhost:3000", {
          NODE_ENV: "development",
        } as NodeJS.ProcessEnv),
      ).toBe(true);
      expect(
        isOriginAllowed("http://localhost:3000", {
          NODE_ENV: "production",
        } as NodeJS.ProcessEnv),
      ).toBe(false);
    });
  });

  describe("corsOriginForSse", () => {
    it("echoes an allowlisted origin and never emits '*'", () => {
      expect(
        corsOriginForSse("https://a.com", {
          CORS_ORIGINS: "https://a.com",
        } as NodeJS.ProcessEnv),
      ).toBe("https://a.com");
    });

    it("returns '' (omit header) for a missing or disallowed origin", () => {
      expect(corsOriginForSse(undefined, {} as NodeJS.ProcessEnv)).toBe("");
      expect(
        corsOriginForSse("https://evil.com", {
          CORS_ORIGINS: "https://a.com",
        } as NodeJS.ProcessEnv),
      ).toBe("");
    });
  });
});
