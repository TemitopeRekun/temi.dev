import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const compareMock = bcrypt.compare as jest.Mock;
const hashMock = bcrypt.hash as jest.Mock;

const ADMIN_EMAIL = "admin@temi.dev";
const ENV_HASH = "$2a$10$envhash";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: { setting: { findUnique: jest.Mock; upsert: jest.Mock } };
  let jwt: { signAsync: jest.Mock };

  beforeEach(async () => {
    compareMock.mockReset();
    hashMock.mockReset();
    prisma = {
      setting: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({}),
      },
    };
    jwt = { signAsync: jest.fn().mockResolvedValue("signed.jwt.token") };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string): string => {
              if (key === "ADMIN_EMAIL") return ADMIN_EMAIL;
              if (key === "ADMIN_PASSWORD_HASH") return ENV_HASH;
              return "";
            },
          },
        },
        { provide: JwtService, useValue: jwt },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it("logs in with valid credentials (env-hash fallback)", async () => {
    compareMock.mockResolvedValue(true);
    const res = await service.login({
      email: ADMIN_EMAIL,
      password: "correct-password",
    });
    expect(res.accessToken).toBe("signed.jwt.token");
    expect(compareMock).toHaveBeenCalledWith("correct-password", ENV_HASH);
  });

  it("uses the db-hash when present (db-hash over env-hash)", async () => {
    prisma.setting.findUnique.mockResolvedValue({
      key: "ADMIN_PASSWORD_HASH",
      value: "$2a$10$dbhash",
    });
    compareMock.mockResolvedValue(true);
    await service.login({ email: ADMIN_EMAIL, password: "pw" });
    expect(compareMock).toHaveBeenCalledWith("pw", "$2a$10$dbhash");
  });

  it("rejects a wrong email", async () => {
    compareMock.mockResolvedValue(true);
    await expect(
      service.login({ email: "wrong@temi.dev", password: "pw" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects a wrong password", async () => {
    compareMock.mockResolvedValue(false);
    await expect(
      service.login({ email: ADMIN_EMAIL, password: "bad" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("locks the account after 5 failed attempts", async () => {
    compareMock.mockResolvedValue(false);
    for (let i = 0; i < 5; i += 1) {
      await expect(
        service.login({ email: ADMIN_EMAIL, password: "bad" }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    }
    await expect(
      service.login({ email: ADMIN_EMAIL, password: "bad" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("resets the failure counter on a successful login", async () => {
    compareMock.mockResolvedValue(false);
    for (let i = 0; i < 3; i += 1) {
      await expect(
        service.login({ email: ADMIN_EMAIL, password: "bad" }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    }
    compareMock.mockResolvedValue(true);
    await service.login({ email: ADMIN_EMAIL, password: "good" });
    // After reset, a fresh streak of failures should not be locked yet.
    compareMock.mockResolvedValue(false);
    await expect(
      service.login({ email: ADMIN_EMAIL, password: "bad" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("changes the password when current password is valid", async () => {
    compareMock.mockResolvedValue(true);
    hashMock.mockResolvedValue("$2a$10$newhash");
    await service.changePassword({
      currentPassword: "old",
      newPassword: "newpassword",
    });
    expect(prisma.setting.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: "ADMIN_PASSWORD_HASH" },
        update: { value: "$2a$10$newhash" },
      }),
    );
  });

  it("rejects changePassword when current password is invalid", async () => {
    compareMock.mockResolvedValue(false);
    await expect(
      service.changePassword({
        currentPassword: "wrong",
        newPassword: "newpassword",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.setting.upsert).not.toHaveBeenCalled();
  });
});
