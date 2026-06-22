# ADR-0002: NestJS API on Fly.io (long-running) vs. serverless

- **Status:** Accepted
- **Date:** 2026-06-22

## Context

The API is a stateful NestJS application: it holds DB connection pools, streams
Server-Sent Events for RAG answers, runs background embedding jobs, and keeps a
small in-memory throttle/lockout map. Serverless functions are a poor fit for
long-lived SSE streams and connection pooling, and cold starts hurt streaming
latency.

## Decision

Deploy the API as a **long-running container on Fly.io** (`temi-api`, region
`lhr`), built from `apps/api/Dockerfile` via the `deploy.yml` GitHub Action. The
web app stays on **Vercel** (great DX for Next.js, edge middleware, ISR).

## Consequences

- Native support for SSE streaming, pooled DB connections, and in-process
  background work.
- A DB-aware `/health` check lets Fly stop routing to an unhealthy instance.
- `auto_start_machines` is on; scaling past one machine requires moving
  per-instance state (throttle/lockout) to a shared store — see ADR-0004.
- Two platforms to operate (Vercel + Fly), accepted for the right runtime model
  on each tier.
