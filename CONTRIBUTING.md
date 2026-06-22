# Contributing

Thanks for working on temi.dev. This guide covers local setup, the quality
gates, and the conventions the repo enforces.

## Prerequisites

- Node.js v20+
- pnpm v9+
- A PostgreSQL database with the `pgvector` extension (local or Supabase)

## Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # fill in real values
cp apps/web/.env.example apps/web/.env
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate:dev
pnpm dev                                 # web :3000, api :4000
```

`pnpm dev` builds the shared packages (`@temi/types`, `@temi/ai`, `@temi/ui`)
first via Turborepo, then runs both apps.

## Project layout

- `apps/web` — Next.js 15 (App Router). `apps/api` — NestJS 11 + Fastify.
- `packages/types` (`@temi/types`) — shared domain types + constants.
- `packages/ai` (`@temi/ai`) — AI prompt templates (compiled into the API image).
- `packages/ui` (`@temi/ui`) — shared React components.
- `packages/config` (`@temi/config`) — shared ESLint / Tailwind / TS config.

See [docs/architecture.md](docs/architecture.md) for the end-to-end request flow
and [docs/adr](docs/adr) for the rationale behind key decisions.

## Quality gates (must pass before merge)

CI runs these on every PR; run them locally first:

```bash
pnpm lint            # eslint (typescript-eslint) across the workspace
pnpm typecheck       # tsc --noEmit
pnpm test:cov        # unit/integration with coverage thresholds enforced
pnpm --filter api test:e2e
pnpm build           # production build of every package/app
```

**Coverage thresholds (hard gates):** API ≥ 90% lines / 80% branches / 90%
functions; web ≥ 80% lines / 70% branches. A drop below these fails CI.

Do **not** introduce new lint/type errors, `eslint-disable`, `@ts-ignore`, or
config changes that weaken a gate. Fix the root cause instead.

## Branch & commit conventions

- Branch off `main`; open a PR against `main`.
- Use Conventional Commit prefixes scoped by app where useful, e.g.
  `feat(web): …`, `fix(api): …`, `refactor(types): …`, `docs: …`, `test(api): …`.
- **Do not add AI/co-author trailers** (no `Co-Authored-By`, no "Generated with"
  lines) to commits or PR descriptions.
- Keep PRs focused; update docs/ADRs when you change architecture or config.

## Deployment

- Web → Vercel on push to `main`.
- API → Fly.io via the `deploy.yml` workflow.

Local success is not the same as production: the web app only goes live on a
push to `main`.

## API documentation

Swagger UI is served at `/api/docs` outside production. To export the spec as a
file:

```bash
pnpm --filter api openapi:export   # writes apps/api/openapi.json
```
