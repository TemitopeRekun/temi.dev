# TEMITOPE OGUNREKUN

**Full-Stack Developer** — TypeScript & Node.js — SaaS Systems  
Lagos, Nigeria (Remote) · olalekanogunrekun@gmail.com · +234 901 785 7885  
[temitope.live](https://www.temitope.live) · [github.com/TemitopeRekun](https://github.com/TemitopeRekun) · [linkedin.com/in/temi-dev](https://linkedin.com/in/temi-dev)

---

## Professional Summary

Full-Stack Developer with 4+ years building production systems across fiscal-compliance SaaS, fintech, and real-time platforms for clients in the UK, Spain, and Nigeria. Works in TypeScript monorepos with NestJS, Next.js, and PostgreSQL — contributed to SOAP-based Spanish tax authority integrations, a deterministic fiscal engine for VAT returns, real-time ride-hailing state machines with GPS fare settlement, and a fintech installment payment platform with Paystack split transactions. Delivered measurable outcomes: 300+ MAU platforms, 40% reduction in scheduling overhead, sub-cent VAT rounding precision. Currently seeking a remote mid-level full-stack or backend role where engineering culture is strong and the work is real.

---

## Technical Skills

- **Languages:** TypeScript (ES2022+), JavaScript (ES6+), Python, SQL
- **Frontend:** React.js, Next.js 14–16 (App Router), React Native, Tailwind CSS, Framer Motion, recharts, SWR, Capacitor
- **Backend:** Node.js, NestJS, Fastify, Express.js, REST APIs, GraphQL (Apollo), WebSockets (Socket.io), JWT, Better Auth, RBAC
- **Databases:** PostgreSQL, Prisma ORM, Redis, MongoDB, Supabase, Kysely
- **DevOps & Testing:** Docker, GitHub Actions CI/CD, AWS S3, Vercel, Netlify, Jest, Playwright, Supertest, Testcontainers
- **Architecture:** Monorepo (Turborepo/pnpm), Multi-Tenant SaaS, Event-Driven Architecture, OpenAPI/Swagger, SOAP, MCP, RAG Pipelines, Vector Embeddings
- **AI/LLM in Workflow:** Daily use of GitHub Copilot, Claude, and GPT-4 for code generation, test writing, refactoring, and debugging across the full stack. Built RAG-powered semantic search and contextual Q&A with LangChain and pgvector.

---

## Professional Experience

### Full-Stack Developer — ADP Digitek / AINVID CODING S.L. — Remote (Palma, Spain)
*Jan 2025 – Present*  
*Stack: TypeScript · NestJS · Fastify · GraphQL · PostgreSQL · Prisma · Turborepo · pnpm · Docker · Playwright · AWS S3/KMS · SOAP*

- On the engineering team for Multifactu, a fiscal-compliance invoicing platform for Spanish SMEs. TypeScript monorepo (Turborepo/pnpm) with a NestJS + Fastify dual-platform API and Next.js 16 frontend.
- Contributed to the AEAT Modelos integration — REST/SOAP adapters for Spanish Tax Agency submission (presBasicaDos, servaliDos, consultaExt) with exponential-backoff retry, circuit breaker, and TLS client certificate handling via S3 + KMS
- Built features in the Deterministic Fiscal Engine for Model 303 VAT returns — line-by-line computation from invoices or aggregate values with rate-by-rate breakdown and €0.02 tolerance threshold
- Worked on Verifactu invoice lifecycle (submit/correct/cancel) in realtime and deferred modes, QR verification against AEAT, signed PDF generation
- Helped maintain TicketBAI regional compliance module for Basque territories (Bizkaia, Gipuzkoa, Araba)
- Wrote API endpoints, GraphQL resolvers, OpenAPI documentation, and Playwright E2E test suites as part of the team's release cycle
- Contributed to Docker-based CI/CD pipelines and collaborated on code reviews, sprint planning, and cross-timezone async communication

### Full-Stack Developer — Bica Driver
*2026 – Present*  
*Stack: TypeScript · React Native · NestJS · PostgreSQL · Prisma · Socket.io · Redis · Monnify API · Capacitor · FCM · Zustand*

- Built a real-time ride-sharing PWA (React Native + Capacitor) with a NestJS backend serving driver, owner, and admin roles
- Designed the ride state machine (10 statuses) with API-level transition validation
- Implemented a 3-zone pricing engine (short/fast fixed rate, short/slow with traffic penalty, standard meter) with nearest-50-Naira rounding and rate snapshotting at trip creation
- Built GPS-based fare settlement with 3-tier fallback: Google Roads API → Haversine → estimate. GPS accumulated in Redis via 1s-throttled WebSocket location stream
- Developed OTP ride verification — 4-digit PIN with 5-attempt lockout, 60s Redis rate-limit on regeneration, brute-force protection
- Built driver rating system with automated enforcement — rating thresholds trigger 72hr or 30-day suspensions with full audit logging
- Integrated Monnify payments — split transactions, SELECT FOR UPDATE row locking, 10-min reconciliation cron, orphaned transaction recovery
- Built namespaced Socket.io gateway (/rides) with JWT-verified role-based rooms for real-time driver location, trip status, and FCM push notifications

### Full-Stack Developer — Martínez & Company — Remote (Spain)
*Jun 2024 – Dec 2024*  
*Stack: React.js · Next.js · TypeScript · Tailwind CSS · PostHog · WhatsApp API · Telegram Bot API · Vercel*

- Built a GDPR-compliant website for a European grant consultancy, delivered on schedule
- Integrated PostHog analytics with a custom waitlist funnel, enabling conversion visibility from launch
- Built QR-based lead capture forms with WhatsApp and Telegram Bot API integrations
- Earned a direct referral to ADP Digitek based on delivery quality

### Web Developer — Talent Group Services — Remote (Bedford, UK)
*Jan 2022 – May 2024*  
*Stack: React.js · Next.js · TypeScript · Node.js · PostgreSQL · Vercel*

- Built a booking platform from scratch as the sole developer, scaling to 300+ monthly active users
- Eliminated 40% of manual scheduling work with a self-serve client booking system
- Optimized PostgreSQL queries and API endpoints, reducing average response time by 35%
- Handled end-to-end production operations: deployment, monitoring, incident response

### Freelance Full-Stack Developer — Self-Employed — Remote (Lagos, Nigeria)
*Feb 2021 – Present*  
*Stack: TypeScript · Next.js · NestJS · PostgreSQL · LangChain · pgvector · OpenAI API*

- Delivered 10+ production projects across SaaS dashboards, e-commerce platforms, and mobile apps for Nigerian and international clients
- Built temi.dev — a full-stack SaaS platform with a RAG-powered blog system ("Ask this article" contextual Q&A), AI lead scoring engine, and service booking layer
- Architected a multi-tenant monorepo with Turborepo, shared UI package, and PostgreSQL with Prisma ORM

---

## Featured Projects

### temi.dev — Personal SaaS Portfolio Platform
*Next.js · NestJS · PostgreSQL · LangChain · pgvector · OpenAI API · Turborepo · Framer Motion*

- Full-stack platform with portfolio showcase, AI-generated blog, lead management, and admin analytics — deployed as a Turborepo monorepo with shared package
- Engineered a RAG-powered blog system with "Ask this article" contextual chat, AI-generated summaries, and pgvector-backed semantic search using LangChain and OpenAI embeddings
- Built an AI lead scoring engine that prioritises inbound contacts by deal likelihood and generates personalised outreach drafts

### Lopay — School Fee Installment Payment Platform
*TypeScript · NestJS · PostgreSQL · Prisma · Paystack API · Better Auth*

- Fintech platform enabling Nigerian parents to pay school fees in flexible installments with guaranteed traceable disbursements to schools
- Built payment calculation engine using a kobo-safe Money value object — zero floating-point drift across all financial math
- Implemented installment plans (12-week or 3-month) with 25% deposit minimum, 2.5% platform fee, and rounding-absorbed final installment so schedules sum exactly
- Integrated Paystack split payments with fee gross-up, subaccount routing, and idempotent processing via idempotencyKey
- Designed the payment lifecycle (PENDING → ACTIVE → COMPLETED / DEFAULTED / FAILED) with full audit trail recording before/after snapshots on every financial event

---

## Education

**B.Sc. Computer Science** — National Open University of Nigeria (NOUN) — 2023 – Present (part-time, in progress)

---

## Professional References

**Aina Maria Perellò** — Chief Technology Officer, Martínez Company (Spain)  
admin@martinezcompany.eu · martinezcompany.eu/english  
> "His work contributed to the digital implementation aspects of grant-funded initiatives… I would not hesitate to work with Temitope again."

**Pedro Martínez Dopico** — Managing Director, ADP Digitek / AINVID CODING S.L. (Spain)  
admin@adpdigitek.com · Palma, Illes Balears, Spain  
> "He showed a clear ability to adapt to modern development environments and to quickly familiarise himself with unfamiliar systems."

---

## Additional Information

- **Remote Experience:** 4+ years across international async-first teams (Nigeria, UK, Spain)
- **Languages:** English (Professional/C1+) · Yoruba (Native)
- **Availability:** Full-time remote · Open to mid-level roles
- **Timezone:** WAT (UTC+1) — full EU/UK overlap, partial US-East via flexible scheduling
