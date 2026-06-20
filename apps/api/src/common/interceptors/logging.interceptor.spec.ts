import { CallHandler, ExecutionContext } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { LoggingInterceptor } from "./logging.interceptor";

describe("LoggingInterceptor", () => {
  let interceptor: LoggingInterceptor;

  function contextWith(req: { method?: string; url?: string }): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it("calls next.handle and logs on success", (done) => {
    const logSpy = jest
      .spyOn(interceptor["logger"], "log")
      .mockImplementation(() => undefined);
    const next: CallHandler = { handle: jest.fn(() => of("result")) };

    interceptor
      .intercept(contextWith({ method: "GET", url: "/x" }), next)
      .subscribe((value) => {
        expect(value).toBe("result");
        expect(next.handle).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("GET /x"));
        done();
      });
  });

  it("logs a warning when the handler errors", (done) => {
    const warnSpy = jest
      .spyOn(interceptor["logger"], "warn")
      .mockImplementation(() => undefined);
    const next: CallHandler = {
      handle: jest.fn(() => throwError(() => new Error("boom"))),
    };

    interceptor.intercept(contextWith({}), next).subscribe({
      error: () => {
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("(error)"));
        done();
      },
    });
  });
});
