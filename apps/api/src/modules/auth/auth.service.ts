import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { PrismaService } from "../../prisma/prisma.service";

const ADMIN_HASH_KEY = "ADMIN_PASSWORD_HASH";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type FailedAttempt = { count: number; firstAt: number };

@Injectable()
export class AuthService {
  private readonly adminEmail: string;
  private readonly envPasswordHash: string;
  // Per-account in-memory failed-login tracker keyed by email. Resets on a
  // successful login or once the window elapses. Lightweight and testable.
  private readonly failedAttempts = new Map<string, FailedAttempt>();

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.adminEmail = this.config.get<string>("ADMIN_EMAIL") ?? "";
    this.envPasswordHash = this.config.get<string>("ADMIN_PASSWORD_HASH") ?? "";
  }

  /**
   * Evicts entries whose window has elapsed. Called on every login so the map
   * can't grow unbounded under a credential-stuffing run that sprays many
   * distinct emails.
   */
  private pruneExpired(now: number): void {
    for (const [email, entry] of this.failedAttempts) {
      if (now - entry.firstAt > LOCKOUT_WINDOW_MS) {
        this.failedAttempts.delete(email);
      }
    }
  }

  private isLockedOut(email: string): boolean {
    const entry = this.failedAttempts.get(email);
    if (!entry) return false;
    if (Date.now() - entry.firstAt > LOCKOUT_WINDOW_MS) {
      this.failedAttempts.delete(email);
      return false;
    }
    return entry.count >= MAX_FAILED_ATTEMPTS;
  }

  private recordFailure(email: string): void {
    const now = Date.now();
    const entry = this.failedAttempts.get(email);
    if (!entry || now - entry.firstAt > LOCKOUT_WINDOW_MS) {
      this.failedAttempts.set(email, { count: 1, firstAt: now });
      return;
    }
    entry.count += 1;
  }

  private resetFailures(email: string): void {
    this.failedAttempts.delete(email);
  }

  private async getPasswordHash(): Promise<string> {
    const setting = await this.prisma.setting.findUnique({
      where: { key: ADMIN_HASH_KEY },
    });
    return setting?.value ?? this.envPasswordHash;
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    this.pruneExpired(Date.now());
    if (this.isLockedOut(dto.email)) {
      throw new ForbiddenException("Account temporarily locked");
    }
    const validEmail = dto.email === this.adminEmail;
    const passwordHash = await this.getPasswordHash();
    const validPassword =
      !!passwordHash && (await compare(dto.password, passwordHash));
    if (!validEmail || !validPassword) {
      this.recordFailure(dto.email);
      throw new UnauthorizedException("Invalid credentials");
    }
    this.resetFailures(dto.email);
    const payload = {
      sub: "admin",
      email: this.adminEmail,
      role: "ADMIN" as const,
    };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const currentHash = await this.getPasswordHash();
    const valid = !!currentHash && (await compare(dto.currentPassword, currentHash));
    if (!valid) {
      throw new UnauthorizedException("Current password is incorrect");
    }
    const newHash = await hash(dto.newPassword, 10);
    await this.prisma.setting.upsert({
      where: { key: ADMIN_HASH_KEY },
      update: { value: newHash },
      create: { key: ADMIN_HASH_KEY, value: newHash },
    });
  }
}
