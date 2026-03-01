import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
  private readonly adminEmail: string;
  private readonly adminPasswordHash: string;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.adminEmail = this.config.get<string>("ADMIN_EMAIL") ?? "";
    this.adminPasswordHash = this.config.get<string>("ADMIN_PASSWORD_HASH") ?? "";
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const validEmail = dto.email === this.adminEmail;
    const validPassword =
      this.adminPasswordHash && (await compare(dto.password, this.adminPasswordHash));
    if (!validEmail || !validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { sub: "admin", email: this.adminEmail, role: "ADMIN" as const };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}
