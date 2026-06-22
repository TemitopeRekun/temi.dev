# ADR-0001: pnpm + Turborepo monorepo

- **Status:** Accepted
- **Date:** 2026-06-22

## Context

The product is a Next.js web app and a NestJS API that share domain types,
constants, UI components, and AI prompts. Keeping them in separate repos would
duplicate those shapes and let them drift.

## Decision

Use a single **pnpm workspace** orchestrated by **Turborepo**:

- `apps/web`, `apps/api` — deployable apps.
- `packages/types` (`@temi/types`), `packages/ui` (`@temi/ui`),
  `packages/ai` (`@temi/ai`), `packages/config` (`@temi/config`) — shared code.
- Task graph in `turbo.json`: `lint`, `typecheck`, `test`, `test:cov` and `dev`
  all `dependsOn: ["^build"]`, so a package's compiled `dist` exists before any
  dependent app type-checks, tests, or runs it.

## Consequences

- Domain shapes live in exactly one place; a field change surfaces as a type
  error in both apps.
- CI installs once and runs cached tasks across the graph.
- The API (CommonJS) consumes shared packages as **built CJS `dist`** at
  runtime; the web app (bundled by Next) consumes the same packages. Shared
  packages therefore emit CommonJS + declarations.
- Trade-off: `^build` adds a build step before lint/test, paid back by correct
  cross-package type resolution and Turbo caching.
