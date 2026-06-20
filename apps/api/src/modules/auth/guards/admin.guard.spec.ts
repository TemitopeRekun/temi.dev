import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";

function contextWithUser(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe("AdminGuard", () => {
  const guard = new AdminGuard();

  it("throws Unauthorized when no user is present", () => {
    expect(() => guard.canActivate(contextWithUser(undefined))).toThrow(
      UnauthorizedException,
    );
  });

  it("allows ADMIN role", () => {
    expect(guard.canActivate(contextWithUser({ role: "ADMIN" }))).toBe(true);
  });

  it("denies a non-ADMIN role", () => {
    expect(guard.canActivate(contextWithUser({ role: "USER" }))).toBe(false);
  });
});
