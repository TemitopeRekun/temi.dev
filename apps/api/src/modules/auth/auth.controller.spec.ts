import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let auth: { login: jest.Mock; changePassword: jest.Mock };

  beforeEach(async () => {
    auth = {
      login: jest.fn().mockResolvedValue({ accessToken: "token" }),
      changePassword: jest.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compile();
    controller = moduleRef.get(AuthController);
  });

  it("login delegates to the service", async () => {
    const dto = { email: "admin@temi.dev", password: "pw" };
    await expect(controller.login(dto)).resolves.toEqual({
      accessToken: "token",
    });
    expect(auth.login).toHaveBeenCalledWith(dto);
  });

  it("changePassword delegates to the service", async () => {
    const dto = { currentPassword: "old", newPassword: "newpassword" };
    await controller.changePassword(dto);
    expect(auth.changePassword).toHaveBeenCalledWith(dto);
  });
});
