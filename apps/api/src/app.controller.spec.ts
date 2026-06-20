import { AppController } from "./app.controller";

describe("AppController", () => {
  it("health returns ok with a timestamp", () => {
    const controller = new AppController();
    const res = controller.health();
    expect(res.status).toBe("ok");
    expect(typeof res.timestamp).toBe("string");
  });
});
