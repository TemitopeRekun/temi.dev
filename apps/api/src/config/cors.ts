/**
 * Single source of truth for the CORS allowlist, shared by the global CORS
 * config in `main.ts` and the SSE responses in the RAG controller (previously
 * the allowlist was duplicated in both places).
 *
 * The allowlist is driven by the `CORS_ORIGINS` env var (comma-separated), so
 * accepted origins can change without a code edit. When it is unset we fall
 * back to the canonical production domains — matching the metadata default in
 * the web app. Localhost is accepted only outside production.
 */

const LOCALHOST_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const DEFAULT_PRODUCTION_ORIGINS = [
  "https://temitope.live",
  "https://www.temitope.live",
];

/** Parsed allowlist from `CORS_ORIGINS`, or the canonical defaults if unset. */
export function getAllowedOrigins(
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const configured = (env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_PRODUCTION_ORIGINS;
}

/**
 * Whether a browser `Origin` is permitted. Localhost is allowed only outside
 * production; everything else must be on the explicit allowlist. A missing
 * origin (curl, server-to-server) is handled by the caller, not here.
 */
export function isOriginAllowed(
  origin: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (!origin) return false;
  const isProduction = env.NODE_ENV === "production";
  if (!isProduction && LOCALHOST_RE.test(origin)) return true;
  return getAllowedOrigins(env).includes(origin);
}

/**
 * The value to echo in `Access-Control-Allow-Origin` on a *credentialed* SSE
 * response: the allowlisted origin, or `""` to omit the header entirely. We
 * never emit `*` here because it is invalid alongside
 * `Access-Control-Allow-Credentials: true`.
 */
export function corsOriginForSse(
  origin: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return isOriginAllowed(origin, env) ? (origin ?? "") : "";
}
