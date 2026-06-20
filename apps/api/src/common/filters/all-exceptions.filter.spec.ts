import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { AllExceptionsFilter } from "./all-exceptions.filter";

type ReplyArgs = [unknown, unknown, number];

describe("AllExceptionsFilter", () => {
  let reply: jest.Mock;
  let httpAdapterHost: HttpAdapterHost;
  let filter: AllExceptionsFilter;

  function hostWith(url = "/test"): ArgumentsHost {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ url }),
        getResponse: () => ({}),
      }),
    } as unknown as ArgumentsHost;
  }

  beforeEach(() => {
    reply = jest.fn();
    httpAdapterHost = {
      httpAdapter: {
        reply,
        getRequestUrl: (req: { url?: string }) => req.url,
      },
    } as unknown as HttpAdapterHost;
    filter = new AllExceptionsFilter(httpAdapterHost);
    jest.spyOn(filter["logger"], "error").mockImplementation(() => undefined);
    jest.spyOn(filter["logger"], "warn").mockImplementation(() => undefined);
  });

  it("passes through an HttpException status and message", () => {
    filter.catch(new BadRequestException("bad input"), hostWith("/leads"));
    const [, payload, status] = reply.mock.calls[0] as ReplyArgs;
    const body = payload as { statusCode: number; message: string; path: string };
    expect(status).toBe(HttpStatus.BAD_REQUEST);
    expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe("bad input");
    expect(body.path).toBe("/leads");
  });

  it("joins array messages from a validation error", () => {
    const exception = new HttpException(
      { message: ["field a", "field b"], error: "Bad Request" },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, hostWith());
    const [, payload] = reply.mock.calls[0] as ReplyArgs;
    expect((payload as { message: string }).message).toBe("field a, field b");
  });

  it("returns a generic 500 for a non-HttpException and does not leak details", () => {
    filter.catch(new Error("secret stack trace details"), hostWith("/boom"));
    const [, payload, status] = reply.mock.calls[0] as ReplyArgs;
    const body = payload as { statusCode: number; message: string; error: string };
    expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.message).toBe("Internal server error");
    expect(body.error).toBe("Internal Server Error");
    expect(JSON.stringify(body)).not.toContain("secret stack trace");
  });
});
