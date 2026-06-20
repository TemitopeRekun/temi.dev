import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * Logs each HTTP request's method, url and latency once the handler resolves
 * (or errors). Registered globally in main.ts.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      method?: string;
      url?: string;
    }>();
    const method = req.method ?? "UNKNOWN";
    const url = req.url ?? "";
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(`${method} ${url} ${Date.now() - start}ms`);
        },
        error: () => {
          this.logger.warn(`${method} ${url} ${Date.now() - start}ms (error)`);
        },
      }),
    );
  }
}
