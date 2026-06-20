import { ConfigService } from "@nestjs/config";
import { ResendService } from "./resend.service";

function makeService(apiKey: string): ResendService {
  const config = {
    get: (key: string): string | undefined => {
      if (key === "RESEND_API_KEY") return apiKey;
      if (key === "EMAIL_FROM") return "Temitope <hello@temi.dev>";
      return undefined;
    },
  } as unknown as ConfigService;
  return new ResendService(config);
}

describe("ResendService", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("sends an email when the API key is configured", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const service = makeService("re_test_key");
    await service.sendEmail({
      to: "a@b.c",
      subject: "Hi",
      html: "<p>hi</p>",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("skips sending and logs when the API key is missing", async () => {
    const service = makeService("");
    const errSpy = jest
      .spyOn(service["logger"], "error")
      .mockImplementation(() => undefined);
    await service.sendEmail({ to: "a@b.c", subject: "Hi", html: "x" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalled();
  });

  it("logs an error when the Resend API responds non-ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      statusText: "Unprocessable",
      text: async () => "bad payload",
    });
    const service = makeService("re_test_key");
    const errSpy = jest
      .spyOn(service["logger"], "error")
      .mockImplementation(() => undefined);
    await service.sendEmail({ to: "a@b.c", subject: "Hi", html: "x" });
    expect(errSpy).toHaveBeenCalled();
  });

  it("logs an error and does not throw when fetch rejects", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const service = makeService("re_test_key");
    const errSpy = jest
      .spyOn(service["logger"], "error")
      .mockImplementation(() => undefined);
    await expect(
      service.sendEmail({ to: "a@b.c", subject: "Hi", html: "x" }),
    ).resolves.toBeUndefined();
    expect(errSpy).toHaveBeenCalled();
  });

  it("sendLeadConfirmation composes a message and sends it", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const service = makeService("re_test_key");
    await service.sendLeadConfirmation("jane@example.com", "Jane");
    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as { body: string }).body,
    ) as { to: string[]; html: string };
    expect(body.to).toEqual(["jane@example.com"]);
    expect(body.html).toContain("Jane");
  });
});
