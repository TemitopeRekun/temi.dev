import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

type NormalizedError = {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
};

/**
 * Global exception filter. Logs the full error server-side via Nest's Logger
 * and returns a normalized JSON body. For non-HttpException errors (i.e. real
 * 500s) the client only ever sees a generic "Internal server error" message so
 * we never leak stack traces or provider/internal details.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ url?: string }>();
    const response = ctx.getResponse();
    const path = httpAdapter.getRequestUrl(request) ?? request.url ?? "";

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === "string") {
        message = body;
      } else if (body && typeof body === "object") {
        const obj = body as { message?: unknown; error?: unknown };
        if (typeof obj.message === "string") {
          message = obj.message;
        } else if (Array.isArray(obj.message)) {
          message = obj.message.join(", ");
        }
        if (typeof obj.error === "string") {
          error = obj.error;
        }
      }
      if (error === "Internal Server Error") {
        error = exception.name;
      }
    }

    // Always log the full error server-side for diagnostics.
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${statusCode} ${path}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${statusCode} ${path} - ${message}`);
    }

    const payload: NormalizedError = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
    };

    httpAdapter.reply(response, payload, statusCode);
  }
}
