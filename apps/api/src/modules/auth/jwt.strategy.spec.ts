import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";

describe("JwtStrategy", () => {
  it("throws when JWT_SECRET is not configured", () => {
    const config = { get: (): undefined => undefined } as unknown as ConfigService;
    expect(() => new JwtStrategy(config)).toThrow("JWT_SECRET is not configured");
  });

  it("validate returns the payload unchanged", async () => {
    const config = {
      get: (): string => "a-very-long-test-secret",
    } as unknown as ConfigService;
    const strategy = new JwtStrategy(config);
    const payload = { sub: "admin", email: "a@b.c", role: "ADMIN" as const };
    await expect(strategy.validate(payload)).resolves.toEqual(payload);
  });
});
