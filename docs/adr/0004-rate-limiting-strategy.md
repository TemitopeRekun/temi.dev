# ADR-0004: Rate limiting & login lockout — in-memory now, Redis later

- **Status:** Accepted (with a documented follow-up)
- **Date:** 2026-06-22

## Context

The API throttles requests (`@nestjs/throttler`) and locks an admin account
after repeated failed logins. Both currently use **process-local, in-memory**
state. Fly is configured with `auto_start_machines = true`, so the platform can
run more than one instance, at which point per-instance counters under-count and
lockout state is not shared.

## Decision

Keep the **in-memory** ThrottlerStorage and lockout map for now (single primary
instance, `min_machines_running = 1`). Document the migration path: when
horizontal scale is enabled, switch to a **Redis-backed** throttler storage
(`@nest-lab/throttler-storage-redis` + `ioredis`) and move the lockout counter
to Redis (atomic `INCR` + `EXPIRE`), driven by a `REDIS_URL` env var with the
in-memory path as the local-dev fallback.

The public AI endpoints (paid Gemini calls) are throttled tighter (3 req/60s)
and the public lead form carries a honeypot, reducing abuse pressure regardless
of store.

## Consequences

- Simple and correct for the current single-instance deployment; no extra
  infrastructure to operate today.
- **Known limitation:** correct distributed throttling/lockout requires Redis
  before scaling beyond one instance. This is the one deliberate gap on the
  Security/Scalability axes and is gated on provisioning a Redis instance.
