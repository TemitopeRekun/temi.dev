import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { PrismaService } from "../../prisma/prisma.service";

const ADMIN_HASH_KEY = "ADMIN_PASSWORD_HASH";

@Injectable()
export class AuthService {
  private readonly adminEmail: string;
  private readonly envPasswordHash: string;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.adminEmail = this.config.get<string>("ADMIN_EMAIL") ?? "";
    this.envPasswordHash = this.config.get<string>("ADMIN_PASSWORD_HASH") ?? "";
  }

  private async getPasswordHash(): Promise<string> {
    const setting = await this.prisma.setting.findUnique({
      where: { key: ADMIN_HASH_KEY },
    });
    return setting?.value ?? this.envPasswordHash;
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const validEmail = dto.email === this.adminEmail;
    const passwordHash = await this.getPasswordHash();
    const validPassword = passwordHash && (await compare(dto.password, passwordHash));
    if (!validEmail || !validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { sub: "admin", email: this.adminEmail, role: "ADMIN" as const };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const currentHash = await this.getPasswordHash();
    const valid = currentHash && (await compare(dto.currentPassword, currentHash));
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
