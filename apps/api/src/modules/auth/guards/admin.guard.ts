import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { role?: string } | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user.role === "ADMIN";
  }
}
