# temi.dev — Road to 10/10: File-by-File Implementation Plan

> **Goal:** take the platform from its current audited baseline (~8.0 overall) to a verifiable **10/10 across all seven dimensions**: Code Quality, Security, Modularity, Test Coverage, Documentation, Scalability, and SEO.
>
> This document is **exhaustive and file-scoped**. Every task names the exact file(s) to create or change, the change to make (with code where it removes ambiguity), the rationale, and a concrete **acceptance criterion** you can check off. Task IDs (`SEC-1`, `SCA-3`, …) are stable references for commits/PRs.

---

## How to use this plan

1. Work the **phases in order** (P0 → P3). Phases are ordered by risk/impact, not by dimension.
2. Each task is independently shippable and has an **Acceptance** line — do not mark a task done until it is met.
3. Run the **Definition of Done** checklist (bottom of this file) before claiming a dimension is at 10/10.
4. Commit messages follow the repo convention: **no AI/co-author trailers**. Suggested messages are given per task.
5. The **Master File Index** (bottom) lists every file touched, so you can review surface area at a glance.

### Conventions
- `apps/api` = NestJS 11 + Fastify + Prisma. `apps/web` = Next.js 15 App Router. `packages/*` = shared.
- "Verify" = a command that must pass: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm --filter api test:e2e`, `pnpm build`.

---

## Decisions to make first (blockers for several tasks)

These are **product/ops decisions**, not code. Resolve them before starting — multiple tasks depend on them.

| # | Decision | Recommendation | Tasks blocked |
|---|---|---|---|
| D1 | **Canonical domain**: `temi.dev` vs `temitope.live` | Pick the domain you actually own/serve. The code today is wired to `temitope.live` (CORS, metadata default, Google verification), while README/`.env.example` say `temi.dev`. **Standardize on the live domain everywhere.** | DOC-1, SEC-4, SEO-2 |
| D2 | **Redis availability** for distributed rate-limit/lockout | Add Upstash/Redis (free tier is fine) — required for true horizontal scale and correct throttling. | SEC-3, SCA-3 |
| D3 | **Bot protection vendor** for public forms/AI | Cloudflare Turnstile (free, privacy-friendly) or hCaptcha. | SEC-5 |
| D4 | **Coverage thresholds** to enforce | Start at lines 90 / branches 80 (api), lines 80 / branches 70 (web), ratchet up over time. | TEST-2 |

---

## Phase overview

| Phase | Theme | Tasks |
|---|---|---|
| **P0 — Correctness & honesty** | Fix things that are broken or misleading *today* | CQ-1 (prompts in prod), TEST-1 (failing test), TEST-2 (coverage gate), DOC-1/2 (drift), SEO-1 (sitemap dates) |
| **P1 — Security hardening** | Close the real gaps | SEC-1 (web headers), SEC-2 (middleware fail-closed), SEC-3 (Redis throttle), SEC-4 (env-driven CORS), SEC-5 (bot protection), SEC-6 (small fixes) |
| **P2 — Scalability & modularity** | Make the headline features scale; tighten boundaries | SCA-1 (vector index), SCA-2 (single embedding), SCA-4 (caching/ISR), MOD-1 (shared types), MOD-2 (ai package), MOD-3 (shared constants) |
| **P3 — Polish & completeness** | Tests, docs, SEO to 10 | TEST-3/4/5, DOC-3/4/5, SEO-3/4, CQ-2/3 |

---

# Dimension 1 — Code Quality → 10/10

Baseline 8.5. The API TS config is already excellent (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noUnusedLocals`). The gaps are a production-only bug, build-time lint suppression, and a few duplications.

### CQ-1 — Make AI prompt files load in production `[P0]`
**Problem:** [apps/api/src/modules/ai/ai.service.ts](../apps/api/src/modules/ai/ai.service.ts) (`getPersona`, line ~56) and [apps/api/src/modules/rag/rag.service.ts](../apps/api/src/modules/rag/rag.service.ts) (`summarizeArticle`, line ~91) read `resolve(process.cwd(), "../../packages/ai/prompts/*.txt")`. The [Dockerfile](../apps/api/Dockerfile) only copies `apps/api/` and `packages/config/`, so in the Fly image those files do not exist and the persona/summary **silently fall back to hardcoded strings**.

**Fix (chosen approach: ship prompts as a real package — see MOD-2).** Interim minimal fix if MOD-2 is deferred:
- **Modify** `apps/api/Dockerfile`: add `COPY packages/ai/ ./packages/ai/` before the build step.
- **Modify** `ai.service.ts` / `rag.service.ts`: resolve from a module-relative base, not `process.cwd()`:
  ```ts
  // robust in both ts-node (src) and compiled (dist) contexts
  import { join } from "path";
  const PROMPTS_DIR =
    process.env.PROMPTS_DIR ?? join(__dirname, "../../../prompts"); // adjust to final layout
  ```
- **Change** the silent `catch(() => "")` / fallback to **log an error** when a prompt file is missing so prod degradation is visible.

**Acceptance:** with `NODE_ENV=production` in a built image, a request to `/api/rag/ask-website` uses the persona from `digital-brain-persona.txt` (verify by temporarily logging the resolved prompt length in a test build); missing-file path logs an error, never silently empties.
**Commit:** `fix(api): load AI prompt files reliably in production`

### CQ-2 — Stop suppressing ESLint at build time `[P3]`
**Modify** [apps/web/next.config.ts](../apps/web/next.config.ts): remove `eslint: { ignoreDuringBuilds: true }` (lines 16–18). Fix any errors it was hiding.
**Acceptance:** `pnpm --filter web build` runs with lint enabled and passes; CI unchanged.
**Commit:** `chore(web): enforce eslint during next build`

### CQ-3 — Remove duplicated/inline logic `[P3]`
- **CORS resolver** duplicated in [apps/api/src/main.ts](../apps/api/src/main.ts) (lines 43–50) and [apps/api/src/modules/rag/rag.controller.ts](../apps/api/src/modules/rag/rag.controller.ts) (lines 6–12). After SEC-4, both consume the same helper.
- **Lead scoring magic numbers** in [apps/api/src/modules/leads/leads.service.ts](../apps/api/src/modules/leads/leads.service.ts) (lines 19–22): extract to a named `LEAD_SCORE_WEIGHTS` const at top of file with a comment.
- **Email HTML interpolation**: see SEC-6 (escape `name`).

**Acceptance:** no CORS string list appears in more than one source file; lead weights are named constants.
**Commit:** `refactor(api): centralize cors origins and name lead-score weights`

### Code Quality — steps to 10 (summary)
- [ ] CQ-1 prompts load in prod (no silent fallback)
- [ ] CQ-2 build lints
- [ ] CQ-3 no duplicated CORS / no inline magic numbers
- [ ] Add Prettier + `format:check` to CI (see DOC-5)
- [ ] `pnpm lint` and `pnpm typecheck` clean across the monorepo

---

# Dimension 2 — Security → 10/10

Baseline 8.0. Auth, uploads, injection defenses, and env validation are strong. The real gaps: no web-tier security headers, a fail-open middleware fallback, process-local rate limiting, hardcoded CORS, and unprotected billable/public endpoints.

### SEC-1 — Add security headers to the web app `[P1]`
**Create/modify** [apps/web/next.config.ts](../apps/web/next.config.ts) — add an async `headers()`. *(Grounded against Next.js docs via Context7.)*
```ts
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  // Next injects inline runtime + (in dev) eval; tighten with a nonce later (SEC-1b)
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://picsum.photos https://media.licdn.com https://avatars.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://<API_HOST> https://generativelanguage.googleapis.com", // SSE + AI
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  /* ...existing... */
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};
```
- Replace `<API_HOST>` with the env-driven API origin (read from `NEXT_PUBLIC_API_BASE_URL`).
- **SEC-1b (optional, for true 10):** move to a **nonce-based CSP** via middleware to drop `'unsafe-inline'` on `script-src` (Context7 shows the `script-nonce` middleware pattern).

**Acceptance:** `curl -I https://<domain>` shows all six headers; securityheaders.com grade ≥ A; site renders (fonts, images, 3D, SSE all work — adjust `connect-src`/`img-src` if blocked).
**Commit:** `feat(web): add CSP and security response headers`

### SEC-2 — Make the admin gate fail closed `[P1]`
**Problem:** [apps/web/middleware.ts](../apps/web/middleware.ts) (lines 18–28) falls back to a **cookie-presence** check when `JWT_SECRET` is unset; [apps/web/app/(admin)/admin/(protected)/layout.tsx](../apps/web/app/(admin)/admin/(protected)/layout.tsx) (lines 11–15) only checks presence too.
- **Modify** `middleware.ts`: in production, if `JWT_SECRET` is missing → **deny** (redirect/401), never presence-fallback. Keep the dev convenience only when `NODE_ENV !== "production"`.
- **Modify** the protected `layout.tsx`: verify the JWT (reuse a shared `verifyAdminJwt(token)` helper) instead of presence; redirect on failure.
- **Create** `apps/web/lib/auth.ts` exporting `verifyAdminJwt(token: string): Promise<boolean>` (jose, HS256) used by both middleware and layout (removes duplication).

**Acceptance:** with `NODE_ENV=production` and `JWT_SECRET` unset, `/admin/dashboard` redirects to login and `/api/admin/*` returns 401; a forged non-empty cookie never renders the admin shell.
**Commit:** `fix(web): fail closed when admin jwt cannot be verified`

### SEC-3 — Distributed rate limiting (Redis storage) `[P1]` *(depends on D2)*
**Problem:** [apps/api/src/app.module.ts](../apps/api/src/app.module.ts) (line 28) uses the default **in-memory** ThrottlerStorage. Context7 (`/nestjs/throttler`) confirms in-memory is per-process and recommends a shared Redis storage for distributed deployments.
- **Add dep:** `@nest-lab/throttler-storage-redis` (or implement the `ThrottlerStorage` shown in Context7) + `ioredis`.
- **Modify** `app.module.ts`:
  ```ts
  ThrottlerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (c: ConfigService) => ({
      throttlers: [{ ttl: 60_000, limit: 10 }],
      storage: c.get("REDIS_URL")
        ? new ThrottlerStorageRedisService(c.get("REDIS_URL"))
        : undefined, // falls back to in-memory in local dev
    }),
  })
  ```
**Acceptance:** two API instances share throttle counters (hit limit on instance A, instance B also blocks); login lockout (SEC-3b) likewise shared.
**Commit:** `feat(api): use redis-backed throttler storage`

### SEC-3b — Move login lockout state to shared store `[P2]` *(depends on D2)*
**Modify** [apps/api/src/modules/auth/auth.service.ts](../apps/api/src/modules/auth/auth.service.ts): replace the in-process `failedAttempts` Map (line 26) with Redis (atomic `INCR` + `EXPIRE`) so lockout survives restarts and works across instances. Keep the same 5-attempt / 15-min semantics.
**Acceptance:** failed logins on one instance lock the account on another; lockout persists across an instance restart.
**Commit:** `fix(api): persist login lockout in shared store`

### SEC-4 — Env-driven CORS allowlist `[P1]` *(depends on D1)*
**Problem:** [apps/api/src/main.ts](../apps/api/src/main.ts) (lines 43–46) hardcodes `temitope.live`; [rag.controller.ts](../apps/api/src/modules/rag/rag.controller.ts) duplicates it; SSE emits `ACAO: *` when `Origin` is absent.
- **Create** `apps/api/src/config/cors.ts` exporting `getAllowedOrigins(config): string[]` and `isOriginAllowed(origin, config): boolean`, reading a comma-separated `CORS_ORIGINS` env (+ localhost only when `NODE_ENV !== production`).
- **Modify** `main.ts` and `rag.controller.ts` to use it. Do **not** emit `ACAO: *` for credentialed SSE — only echo an allowlisted origin.
- **Modify** [apps/api/src/config/env.validation.ts](../apps/api/src/config/env.validation.ts): add `CORS_ORIGINS` (required in production).
**Acceptance:** changing `CORS_ORIGINS` changes accepted origins with no code edit; a non-allowlisted origin is rejected; no `*` is sent on credentialed responses.
**Commit:** `feat(api): env-driven cors allowlist`

### SEC-5 — Bot/abuse protection on public + billable endpoints `[P1]` *(depends on D3)*
**Problem:** the public lead form ([apps/api/src/modules/leads/leads.controller.ts](../apps/api/src/modules/leads/leads.controller.ts)) and AI endpoints (`ask-article`/`ask-website`/`summarize` in [rag.controller.ts](../apps/api/src/modules/rag/rag.controller.ts)) are unauthenticated and only IP-throttled (5/60s) — Gemini calls cost money.
- **Web:** add Turnstile widget to [apps/web/components/contact/ContactForm.tsx](../apps/web/components/contact/ContactForm.tsx) and the AI ask components ([AskArticle.tsx](../apps/web/components/blog/AskArticle.tsx), [AskAI.tsx](../apps/web/components/blog/AskAI.tsx)); pass the token through the server action/route.
- **API:** add a `TurnstileGuard` (`apps/api/src/common/guards/turnstile.guard.ts`) that verifies the token server-side; apply to leads + public RAG routes. Add a **honeypot** field on the lead DTO ([create-lead.dto.ts](../apps/api/src/modules/leads/dto/create-lead.dto.ts)) that must be empty.
- **API:** tighten AI route throttle (e.g. 3/60s) and add a per-day cap if desired.
**Acceptance:** requests without a valid Turnstile token are rejected (403); filled honeypot is rejected; legitimate form/AI flows still work end-to-end.
**Commit:** `feat: add turnstile + honeypot to public lead and ai endpoints`

### SEC-6 — Smaller hardening items `[P2]`
- **bcrypt cost 10 → 12:** [auth.service.ts](../apps/api/src/modules/auth/auth.service.ts) line ~110 (`hash(dto.newPassword, 10)`). Add a comment noting the cost.
- **Gemini key out of the URL:** [ai.service.ts](../apps/api/src/modules/ai/ai.service.ts) line ~75 — send the key via `x-goog-api-key` header instead of `?key=` query string (avoids log leakage).
- **Email HTML injection:** [resend.service.ts](../apps/api/src/modules/email/resend.service.ts) line ~60 interpolates `name` into HTML — HTML-escape it (`escapeHtml(name)`), or use a templating helper.
- **Cookie/token lifetime mismatch:** [apps/web/app/api/auth/login/route.ts](../apps/web/app/api/auth/login/route.ts) sets `maxAge` 7d while the JWT expires in 12h — align to 12h (or add refresh).
- **Add** `apps/web/public/.well-known/security.txt` with a contact + expiry.
**Acceptance:** new admin password hashes are `$2*$12$…`; no API key appears in logs; lead name with `<script>` renders inert in the confirmation email; cookie maxAge matches token expiry.
**Commit:** `chore(security): bcrypt cost, header api key, email escaping, cookie ttl`

### Security — steps to 10 (summary)
- [ ] SEC-1 web security headers (A grade) → SEC-1b nonce CSP for full marks
- [ ] SEC-2 admin gate fails closed
- [ ] SEC-3/3b distributed throttle + lockout
- [ ] SEC-4 env-driven CORS, no `*` on credentialed responses
- [ ] SEC-5 bot protection on public/billable endpoints
- [ ] SEC-6 bcrypt 12, header key, email escaping, cookie ttl, security.txt
- [ ] Run a dependency audit (`pnpm audit --prod`) in CI and a SAST pass (e.g. `github/codeql`)

---

# Dimension 3 — Modularity → 10/10

Baseline 8.5. Monorepo boundaries are real and Nest modules are cohesive. Gaps: `@temi/types` is nearly empty, `packages/ai` isn't a package, and constants are duplicated across apps.

### MOD-1 — Single source of truth for domain types `[P2]`
**Problem:** [packages/types/src/index.ts](../packages/types/src/index.ts) only exports a `Brand` helper. `Project`/`BlogPost`/`Lead` shapes are re-declared in API DTOs and in the web mappers ([apps/web/lib/blog.ts](../apps/web/lib/blog.ts), [apps/web/lib/projects.ts](../apps/web/lib/projects.ts)).
- **Create** `packages/types/src/domain.ts` with the canonical public DTO shapes (`PublicProject`, `PublicBlogPost`, `LeadInput`, paginated `ListResponse<T>`, etc.) and re-export from `index.ts`.
- **Modify** web `lib/*.ts` to import these types; **modify** API response DTOs to `implements`/align with them.
**Acceptance:** the `Project`/`BlogPost`/`Lead` field lists exist in exactly one place; changing a field there surfaces type errors in both apps.
**Commit:** `refactor(types): canonical shared domain types`

### MOD-2 — Make `packages/ai` a real package `[P2]` *(pairs with CQ-1)*
**Problem:** [packages/ai](../packages/ai) has no `package.json`; it's loaded by fragile filesystem paths.
- **Create** `packages/ai/package.json` (`@temi/ai`), `packages/ai/src/index.ts` exporting `getPersonaPrompt()` / `getSummaryPrompt()` that read the bundled `.txt` (or inline them as exported template strings — simplest and Docker-proof).
- **Modify** `apps/api` to depend on `@temi/ai` and call the exported functions; delete the `process.cwd()` path logic.
- **Modify** `apps/api/Dockerfile` to `COPY packages/ai/` (and `packages/types/`) and install them.
**Acceptance:** the API imports prompts via `@temi/ai`; production image contains them; CQ-1 acceptance also passes.
**Commit:** `refactor: promote packages/ai to @temi/ai package`

### MOD-3 — Shared constants `[P3]`
**Problem:** the 5 MB upload cap is triplicated ([apps/api/src/main.ts](../apps/api/src/main.ts) L29, [upload.controller.ts](../apps/api/src/modules/upload/upload.controller.ts) L15, [apps/web/components/ui/ImageUpload.tsx](../apps/web/components/ui/ImageUpload.tsx) L~32) and the allowed-MIME list lives only server-side.
- **Create** `packages/types/src/constants.ts`: `MAX_UPLOAD_BYTES`, `ALLOWED_IMAGE_MIME`, default pagination `take`. Re-export.
- **Modify** all three call sites to import it.
**Acceptance:** one definition of the upload limit/MIME set; web and API agree by construction.
**Commit:** `refactor: share upload constants across apps`

### Modularity — steps to 10 (summary)
- [ ] MOD-1 shared domain types, no duplication
- [ ] MOD-2 `@temi/ai` package, shipped in Docker
- [ ] MOD-3 shared constants
- [ ] Verify no `apps/web` file imports from `apps/api` (and vice-versa) except via `packages/*`

---

# Dimension 4 — Test Coverage → 10/10

Baseline 7.5. **Measured:** API 171 tests passing (~96–100% statements); Web has **1 failing test** and thin component/e2e/DB-integration coverage. "Coverage-gated" CI label is currently not backed by thresholds.

### TEST-1 — Fix the failing/flaky ContactForm test `[P0]`
**Problem:** [apps/web/components/contact/ContactForm.test.tsx](../apps/web/components/contact/ContactForm.test.tsx) → *"invokes the action … shows success"* times out at 5000 ms.
- Replace fixed waits with `await screen.findBy*` / `waitFor`; mock the server action so it resolves deterministically; ensure `userEvent` is awaited. Avoid real timers.
**Acceptance:** `pnpm --filter web test` is fully green; the test completes in < 1 s.
**Commit:** `test(web): stabilize contact form success test`

### TEST-2 — Enforce coverage thresholds (make CI honest) `[P0]` *(depends on D4)*
**Problem:** CI step is named *"coverage-gated"* ([.github/workflows/ci.yml](../.github/workflows/ci.yml)) but neither app's `test` script runs with thresholds.
- **Modify** `apps/api` Jest config (in `apps/api/package.json` or a new `apps/api/jest.config.ts`): add `coverageThreshold` (global lines 90 / branches 80 / functions 90) and make the CI test run use `test:cov`.
- **Modify** [apps/web/vitest config](../apps/web) (`vitest.config.ts`): `test.coverage.thresholds` (lines 80 / branches 70 initially) and run `test:cov` in CI.
- **Modify** `.github/workflows/ci.yml`: call `pnpm --filter api test:cov` and `pnpm --filter web test:cov` (remove `--passWithNoTests` from the gated path).
**Acceptance:** a deliberate coverage drop fails CI; the badge/label reflects reality.
**Commit:** `ci: enforce coverage thresholds`

### TEST-3 — Cover the untested web components/pages `[P3]`
**Add tests** for the largest untested units:
- `apps/web/app/(admin)/admin/(protected)/projects/projectsClient.tsx` (469 LOC) — render, create/edit/delete happy + error paths (mock fetch).
- `apps/web/app/(admin)/admin/(protected)/blog/blogClient.tsx` (429 LOC).
- `apps/web/app/(admin)/admin/(protected)/leads/leadsClient.tsx` (258 LOC).
- `apps/web/components/blog/AskArticle.tsx` / `AskAI.tsx` — SSE streaming render (mock `EventSource`/fetch stream).
- `apps/web/middleware.ts` — valid/expired/missing token, secret-set vs unset (after SEC-2).
**Acceptance:** web statement coverage ≥ 85%; admin client components covered for CRUD + error states.
**Commit:** `test(web): cover admin clients, ask components, middleware`

### TEST-4 — Real API e2e + DB-integration `[P3]`
**Problem:** `test:e2e` is `--passWithNoTests`; [apps/api/test/app.e2e-spec.ts](../apps/api/test/app.e2e-spec.ts) is minimal; the `$queryRawUnsafe` vector search is only unit-tested with mocks.
- **Expand** `app.e2e-spec.ts`: auth login → lockout, throttling (429), CRUD with JWT, validation rejects (`forbidNonWhitelisted`), upload rejects non-image, 404/500 shape.
- **Add** `apps/api/test/rag.integration-spec.ts` using **Testcontainers** (`pgvector/pgvector` image) to run the real similarity SQL incl. the HNSW index (SCA-1) and the keyword fallback.
**Acceptance:** `pnpm --filter api test:e2e` exercises real HTTP paths and passes; the vector query runs against a real pgvector DB in CI.
**Commit:** `test(api): real e2e + pgvector integration`

### TEST-5 — Browser E2E smoke `[P3]`
- **Add** Playwright (root or `apps/web`): login → admin CRUD → public blog/project render → contact submit (Turnstile test key). Wire a CI job (can be non-blocking initially).
**Acceptance:** `pnpm e2e` runs the smoke suite headless and passes locally + in CI.
**Commit:** `test: add playwright smoke suite`

### Test Coverage — steps to 10 (summary)
- [ ] TEST-1 suite fully green
- [ ] TEST-2 thresholds enforced in CI
- [ ] TEST-3 web components/pages covered (≥85%)
- [ ] TEST-4 e2e + pgvector integration
- [ ] TEST-5 Playwright smoke

---

# Dimension 5 — Documentation → 10/10

Baseline 7.5. README and inline comments are strong; the issues are factual **drift** and missing architecture/operational docs.

### DOC-1 — Fix README/.env drift `[P0]` *(depends on D1)*
**Modify** [README.md](../README.md):
- Embedding model: README/`.env.example` say `text-embedding-005`; code defaults to `gemini-embedding-001` ([ai.service.ts](../apps/api/src/modules/ai/ai.service.ts) L38). Make all three agree on the **actual** model.
- Deploy target: README says "Railway / Render" (L228); the repo deploys the API to **Fly.io** ([fly.toml](../fly.toml), [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)). Correct it; document the web → Vercel (push-to-`main`) flow.
- Canonical domain per D1, everywhere it appears.
**Modify** [apps/api/.env.example](../apps/api/.env.example) and [apps/web/.env.example](../apps/web/.env.example): add the **undocumented** vars actually read by code — `GEMINI_EMBEDDING_DIM`, `RAG_SIMILARITY_FLOOR`, `CORS_ORIGINS` (SEC-4), `REDIS_URL` (SEC-3), `TURNSTILE_SECRET`/`NEXT_PUBLIC_TURNSTILE_SITE_KEY` (SEC-5), `NODE_ENV`.
**Acceptance:** every `config.get(...)`/`process.env.*` key in the codebase appears in an `.env.example`; no README statement contradicts the code.
**Commit:** `docs: fix env/readme drift and document all config keys`

### DOC-2 — Document the prod prompt behavior `[P0]` *(folds into CQ-1/MOD-2)*
Once CQ-1/MOD-2 land, document how prompts are bundled and how to override (`PROMPTS_DIR` or `@temi/ai`).
**Acceptance:** README "AI / RAG" section explains prompt loading + the embedding/backfill flow.
**Commit:** `docs: document ai prompt loading and rag pipeline`

### DOC-3 — Architecture doc + diagram `[P3]`
**Create** `docs/architecture.md`: request flow (web proxy route → `forwardToApi` → Nest controller → service → Prisma/pgvector → Gemini/Resend/Supabase), auth/session model, RAG pipeline, deployment topology (Vercel + Fly + Supabase), and the trust boundary. Include a Mermaid diagram.
**Acceptance:** a new contributor can trace a request end-to-end from this file alone.
**Commit:** `docs: add architecture overview`

### DOC-4 — ADRs `[P3]`
**Create** `docs/adr/0001-monorepo-turborepo.md`, `0002-fly-vs-serverless-api.md`, `0003-pgvector-rag.md`, `0004-in-memory-vs-redis-throttling.md` (record the SEC-3 decision). Use a short ADR template.
**Acceptance:** each significant architectural choice has a one-page ADR.
**Commit:** `docs: add initial ADRs`

### DOC-5 — Contributor + API docs `[P3]`
- **Create** `CONTRIBUTING.md` (setup, branch/commit convention — **no AI trailers**, test/lint gates, how to run e2e).
- **Export OpenAPI:** add an `apps/api` script that writes `openapi.json` from the `DocumentBuilder` doc at build; publish it (or enable a read-only `/api/docs` in prod behind basic auth). Today Swagger is dev-only ([main.ts](../apps/api/src/main.ts) L82).
- **Add** Prettier config + `format:check` script + CI step (also serves CQ).
**Acceptance:** `CONTRIBUTING.md` exists; `openapi.json` is generated in CI as an artifact; `pnpm format:check` runs in CI.
**Commit:** `docs: contributing guide, openapi export, prettier`

### Documentation — steps to 10 (summary)
- [ ] DOC-1 zero drift; all env keys documented
- [ ] DOC-2 prompt/RAG behavior documented
- [ ] DOC-3 architecture.md with diagram
- [ ] DOC-4 ADRs
- [ ] DOC-5 CONTRIBUTING + OpenAPI export + Prettier

---

# Dimension 6 — Scalability → 10/10

Baseline 7.0. Cursor pagination and pooling are good. The headline RAG feature does sequential vector scans and double-embeds; rate-limit state is process-local; public content isn't cached.

### SCA-1 — Add a pgvector index (HNSW) `[P2]`
**Problem:** `Project.embedding` / `BlogPost.embedding` are `Unsupported("vector(768)")` ([schema.prisma](../apps/api/prisma/schema.prisma) L39, L56) with **no vector index** — the search in [ai.service.ts](../apps/api/src/modules/ai/ai.service.ts) (L224–232) is a sequential scan. Context7 (Prisma docs) notes vector types need a hand-written migration.
- **Create** a Prisma migration `apps/api/prisma/migrations/<ts>_add_vector_index/migration.sql`:
  ```sql
  CREATE INDEX IF NOT EXISTS blogpost_embedding_hnsw
    ON "BlogPost" USING hnsw (embedding vector_cosine_ops);
  CREATE INDEX IF NOT EXISTS project_embedding_hnsw
    ON "Project" USING hnsw (embedding vector_cosine_ops);
  ```
  (Ensure `CREATE EXTENSION IF NOT EXISTS vector;` exists in an earlier migration.)
- Keep the cosine operator (`<=>`) consistent with `vector_cosine_ops`.
**Acceptance:** `EXPLAIN ANALYZE` on the search query shows an `Index Scan using *_hnsw` (not `Seq Scan`); TEST-4 integration test asserts the index is used.
**Commit:** `perf(api): add hnsw indexes on embedding columns`

### SCA-2 — Embed the query once per RAG request `[P2]`
**Problem:** [apps/api/src/modules/rag/rag.service.ts](../apps/api/src/modules/rag/rag.service.ts) `searchContext` (L24–25) calls `semanticSearch` twice, and each re-embeds the same question ([ai.service.ts](../apps/api/src/modules/ai/ai.service.ts) L216) → **2 Gemini embedding calls per ask**.
- **Refactor** `AiService`: add `searchByEmbedding(vector, table, limit)` and compute the embedding once in `RagService.searchContext`, passing it to both table searches (or a single `UNION ALL` query across both tables).
**Acceptance:** one embedding API call per `ask-website` request (assert via a spy in a unit test); latency drops measurably.
**Commit:** `perf(api): embed query once per rag request`

### SCA-3 — Distributed throttle/lockout `[P1]`
Covered by **SEC-3 / SEC-3b** (same change; listed here for the scalability checklist). Required before enabling Fly autoscaling (`auto_start_machines = true` in [fly.toml](../fly.toml)).

### SCA-4 — Cache/ISR for public content `[P2]`
**Problem:** public pages and [apps/web/app/sitemap.ts](../apps/web/app/sitemap.ts) call `getPosts`/`getProjects` ([lib/blog.ts](../apps/web/lib/blog.ts), [lib/projects.ts](../apps/web/lib/projects.ts)) with no caching strategy → DB hit per render.
- **Modify** `lib/blog.ts` / `lib/projects.ts` fetches to use Next caching: `fetch(url, { next: { revalidate: 300, tags: ["posts"|"projects"] } })`.
- **Add** revalidation: an admin write (via web API routes) calls `revalidateTag("posts")`/`revalidatePath` so content updates promptly.
- Confirm blog/work detail pages keep `generateStaticParams` (SSG) and add `revalidate`.
**Acceptance:** repeated public page loads don't hit the API/DB within the TTL; publishing a post triggers revalidation within seconds.
**Commit:** `perf(web): isr + tag revalidation for public content`

### SCA-5 — Operational headroom `[P3]`
- **Health checks:** point [fly.toml](../fly.toml) check at the real health endpoint (`/api/health` from [health.controller.ts](../apps/api/src/modules/health/health.controller.ts)) instead of `/`, and have it verify DB connectivity.
- **DB pool:** document/verify `connection_limit` for the pooled URL under expected concurrency.
- **Async AI (optional):** move embedding backfill ([scripts/backfill-embeddings.ts](../apps/api/src/scripts/backfill-embeddings.ts)) behind a queue if content volume grows.
- **Multi-region (optional):** note read-replica/region strategy in `docs/architecture.md`.
**Acceptance:** health check fails when the DB is down; documented capacity assumptions.
**Commit:** `chore(api): db-aware health check and pool docs`

### Scalability — steps to 10 (summary)
- [ ] SCA-1 HNSW vector index (no seq scan)
- [ ] SCA-2 single embedding per request
- [ ] SCA-3 distributed throttle/lockout (= SEC-3)
- [ ] SCA-4 ISR + tag revalidation
- [ ] SCA-5 DB-aware health check + documented capacity

---

# Dimension 7 — SEO → 10/10

Baseline 9.0 — already strong (canonical, OG/Twitter, JSON-LD, sitemap, robots, OG image routes, SSG, skip link). Close the last gaps.

### SEO-1 — Real `lastModified` in the sitemap `[P0]`
**Problem:** [apps/web/app/sitemap.ts](../apps/web/app/sitemap.ts) uses `now` for every entry (L8) — a false freshness signal.
- **Modify** to use `post.updatedAt ?? post.publishedAt` and `project.updatedAt` per URL (ensure these fields are returned by `getPosts`/`getProjects`; extend the mappers/DTOs if needed).
**Acceptance:** sitemap `lastmod` values match content timestamps, not the request time.
**Commit:** `fix(web): accurate sitemap lastmod`

### SEO-2 — Lock the canonical domain `[P0]` *(depends on D1)*
**Modify** [apps/web/lib/metadata.ts](../apps/web/lib/metadata.ts) (`BASE_URL` default L4–5) and set `NEXT_PUBLIC_SITE_URL` in prod so canonicals/OG/sitemap never point at the wrong host; align robots/CORS.
**Acceptance:** `<link rel="canonical">`, OG `url`, and sitemap all use the single canonical host in production.
**Commit:** `fix(web): pin canonical site url`

### SEO-3 — Add site-wide structured data `[P3]`
- **Modify** [apps/web/app/layout.tsx](../apps/web/app/layout.tsx) (or a small `JsonLd` component) to emit `WebSite` (+ optional `SearchAction`) and `Organization` JSON-LD globally (currently only `Person` on the homepage and `BlogPosting`/`Breadcrumb` on posts).
- **Modify** [apps/web/app/(public)/work/[slug]/page.tsx](../apps/web/app/(public)/work/[slug]/page.tsx) to add `CreativeWork`/`SoftwareSourceCode` JSON-LD (name, description, `programmingLanguage` from `techStack`, `codeRepository`, `url`).
**Acceptance:** Google Rich Results test passes for home, blog post, and a work item with the expected types.
**Commit:** `feat(web): website/organization and creativework structured data`

### SEO-4 — Robustness polish `[P3]`
- Remove the non-standard `host` field from [apps/web/app/robots.ts](../apps/web/app/robots.ts) (ignored by Google).
- Verify each public page sets a unique `description` and that `generateMetadata` handles missing data without throwing.
- Add `priority`/`changeFrequency` review and ensure `picsum.photos` placeholder images are not used on indexable pages ([next.config.ts](../apps/web/next.config.ts) remotePatterns).
**Acceptance:** Lighthouse SEO = 100 on home, blog index, a post, work index, a work item.
**Commit:** `chore(web): seo robustness polish`

### SEO — steps to 10 (summary)
- [ ] SEO-1 real sitemap dates
- [ ] SEO-2 pinned canonical domain
- [ ] SEO-3 WebSite/Organization + CreativeWork JSON-LD
- [ ] SEO-4 robots/meta polish; Lighthouse SEO 100

---

# Master File Index (every file touched)

### New files
| File | Purpose | Task |
|---|---|---|
| `apps/web/lib/auth.ts` | shared `verifyAdminJwt` (jose) | SEC-2 |
| `apps/api/src/config/cors.ts` | env-driven CORS helpers | SEC-4, CQ-3 |
| `apps/api/src/common/guards/turnstile.guard.ts` | verify Turnstile token | SEC-5 |
| `apps/web/public/.well-known/security.txt` | security contact | SEC-6 |
| `packages/types/src/domain.ts` | canonical domain types | MOD-1 |
| `packages/types/src/constants.ts` | shared constants (upload limit, MIME) | MOD-3 |
| `packages/ai/package.json`, `packages/ai/src/index.ts` | `@temi/ai` package | MOD-2 |
| `apps/api/prisma/migrations/<ts>_add_vector_index/migration.sql` | HNSW indexes | SCA-1 |
| `apps/api/test/rag.integration-spec.ts` | pgvector integration (Testcontainers) | TEST-4 |
| `apps/web/vitest.config.ts` (if not present) + coverage thresholds | TEST-2 |
| `apps/api/jest.config.ts` (or package.json jest block) coverage thresholds | TEST-2 |
| Playwright config + `e2e/*.spec.ts` | browser smoke | TEST-5 |
| `docs/architecture.md` | architecture + diagram | DOC-3 |
| `docs/adr/0001..0004-*.md` | ADRs | DOC-4 |
| `CONTRIBUTING.md`, Prettier config | contributor docs/format | DOC-5 |
| component test files (projectsClient/blogClient/leadsClient/AskArticle/AskAI/middleware) | TEST-3 |

### Modified files
| File | Change | Tasks |
|---|---|---|
| `apps/web/next.config.ts` | security headers; remove `ignoreDuringBuilds`; tidy remotePatterns | SEC-1, CQ-2, SEO-4 |
| `apps/web/middleware.ts` | fail-closed; use shared `verifyAdminJwt` | SEC-2 |
| `apps/web/app/(admin)/admin/(protected)/layout.tsx` | verify JWT, not presence | SEC-2 |
| `apps/web/app/api/auth/login/route.ts` | cookie maxAge = token ttl | SEC-6 |
| `apps/api/src/main.ts` | env CORS via helper; prompt path (interim) | SEC-4, CQ-1 |
| `apps/api/src/modules/rag/rag.controller.ts` | CORS helper; no `*` on credentialed SSE; tighten throttle | SEC-4, SEC-5 |
| `apps/api/src/app.module.ts` | Redis throttler storage | SEC-3 |
| `apps/api/src/modules/auth/auth.service.ts` | Redis lockout; bcrypt 12 | SEC-3b, SEC-6 |
| `apps/api/src/modules/ai/ai.service.ts` | header API key; single-embedding search; `@temi/ai` prompts | SEC-6, SCA-2, MOD-2, CQ-1 |
| `apps/api/src/modules/rag/rag.service.ts` | embed once; `@temi/ai` summary prompt | SCA-2, MOD-2 |
| `apps/api/src/modules/email/resend.service.ts` | escape `name`; canonical `EMAIL_FROM` | SEC-6, DOC-1 |
| `apps/api/src/modules/leads/leads.service.ts` | named score weights | CQ-3 |
| `apps/api/src/modules/leads/leads.controller.ts` + `dto/create-lead.dto.ts` | Turnstile guard + honeypot | SEC-5 |
| `apps/api/src/config/env.validation.ts` | add `CORS_ORIGINS`, `REDIS_URL`, Turnstile, embedding vars | SEC-3/4/5, DOC-1 |
| `apps/api/prisma/schema.prisma` | (if needed) ensure `vector` extension; field timestamps for SEO-1 | SCA-1, SEO-1 |
| `apps/api/Dockerfile` | COPY `packages/ai` + `packages/types`; install | CQ-1, MOD-2 |
| `apps/api/src/modules/health/health.controller.ts` + `fly.toml` | DB-aware health check; check path | SCA-5 |
| `apps/web/lib/blog.ts`, `apps/web/lib/projects.ts` | shared types; ISR caching; expose timestamps | MOD-1, SCA-4, SEO-1 |
| `apps/web/app/sitemap.ts` | real `lastModified` | SEO-1 |
| `apps/web/app/robots.ts` | drop `host` | SEO-4 |
| `apps/web/lib/metadata.ts` | pin canonical `BASE_URL` | SEO-2 |
| `apps/web/app/layout.tsx` | WebSite/Organization JSON-LD | SEO-3 |
| `apps/web/app/(public)/work/[slug]/page.tsx` | CreativeWork JSON-LD | SEO-3 |
| `apps/web/components/ui/ImageUpload.tsx` | shared upload constant; rely on server validation | MOD-3 |
| `apps/web/components/contact/ContactForm.tsx` + `.test.tsx` | Turnstile; stabilize test | SEC-5, TEST-1 |
| `apps/web/components/blog/AskArticle.tsx`, `AskAI.tsx` | Turnstile token | SEC-5 |
| `README.md`, `apps/api/.env.example`, `apps/web/.env.example` | drift + all config keys | DOC-1 |
| `.github/workflows/ci.yml` | coverage-gated runs; format check; audit; (Playwright) | TEST-2, DOC-5 |

---

## Definition of Done (per-dimension 10/10 gate)

| Dimension | Gate |
|---|---|
| **Code Quality** | `pnpm lint` + `pnpm typecheck` clean; build lints; no duplicated CORS/constants; prompts verified loaded in a prod image; Prettier check passes. |
| **Security** | securityheaders.com ≥ A (nonce CSP for A+); admin gate fails closed; throttle/lockout shared; CORS env-driven, no `*` on credentialed; Turnstile+honeypot live; `pnpm audit --prod` clean; CodeQL passing. |
| **Modularity** | domain types defined once; `@temi/ai` consumed as a package; shared constants; no cross-app imports outside `packages/*`. |
| **Test Coverage** | suite fully green; thresholds enforced in CI (api ≥90/80, web ≥85); e2e + pgvector integration + Playwright smoke all pass. |
| **Documentation** | zero README/code drift; every env key documented; `architecture.md`, ADRs, `CONTRIBUTING.md`, OpenAPI export present. |
| **Scalability** | HNSW index used (no seq scan); one embedding per request; ISR + revalidation; DB-aware health check; documented capacity. |
| **SEO** | Lighthouse SEO = 100 on all public templates; Rich Results valid for Person/WebSite/BlogPosting/CreativeWork; sitemap dates accurate; canonical domain pinned. |

## Suggested PR sequence
1. **PR-1 (P0):** CQ-1, TEST-1, TEST-2, DOC-1, SEO-1 — *correctness & honesty.*
2. **PR-2 (P1 security):** SEC-1, SEC-2, SEC-4 — *headers, fail-closed, CORS.*
3. **PR-3 (P1 infra):** SEC-3/3b + SCA-3 (Redis), SEC-5 (Turnstile) — *needs D2/D3.*
4. **PR-4 (P2 scale):** SCA-1, SCA-2, SCA-4 — *vector index, embeddings, ISR.*
5. **PR-5 (P2 modularity):** MOD-1, MOD-2, MOD-3 + CQ-1 finalization.
6. **PR-6 (P3 polish):** TEST-3/4/5, DOC-2/3/4/5, SEO-3/4, CQ-2/3, SEC-6, SCA-5.

> Each PR must keep CI green (lint, typecheck, coverage-gated tests, e2e). Frontend changes go live only on push to `main` (Vercel); the API deploys to Fly.io via `deploy.yml`.
