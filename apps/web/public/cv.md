# TEMITOPE OGUNREKUN

**Backend / Full-Stack Developer** — TypeScript • Node.js • NestJS • PostgreSQL  
Lagos, Nigeria (Remote) • +234 901 785 7885 • olalekanogunrekun@gmail.com  
temitope.live • github.com/TemitopeRekun • linkedin.com/in/temi-dev

---

## Profile

Backend-leaning Full-Stack Developer with 4+ years building production systems across fiscal-compliance SaaS, fintech, and real-time platforms for teams in Spain, the UK, and Nigeria. Strong in TypeScript, Node.js, NestJS, and PostgreSQL, with hands-on experience designing payment flows, compliance integrations, state-driven backend systems, and developer-facing platform features. Delivered measurable results across shipped products, including platforms with 300+ monthly active users, a 40% reduction in scheduling overhead, a 35% API response-time improvement, and production-safe financial calculations with sub-cent rounding precision.

---

## Core Skills

- **Languages:** TypeScript, JavaScript, Python, SQL
- **Backend:** Node.js, NestJS, Fastify, Express.js, REST APIs, GraphQL, WebSockets, JWT, RBAC, Better Auth
- **Frontend:** React, Next.js, React Native, Tailwind CSS, SWR, Framer Motion, Capacitor
- **Data:** PostgreSQL, Prisma, Redis, MongoDB, Supabase, Kysely, pgvector
- **Testing & DevOps:** Docker, GitHub Actions, Playwright, Jest, Supertest, Testcontainers, AWS S3/KMS, Vercel, Netlify
- **Architecture:** Monorepos (Turborepo/pnpm), Multi-Tenant SaaS, Event-Driven Systems, OpenAPI/Swagger, SOAP, RAG Pipelines, Vector Search

---

## Experience

### Full-Stack Developer • ADP Digitek / AINVID Coding S.L. • Remote, Palma, Spain
*Jan 2025 – Present*

Engineering team for Multifactu, a fiscal-compliance invoicing platform for Spanish SMEs built in a TypeScript monorepo with NestJS, Fastify, GraphQL, PostgreSQL, and Next.js 16.

- Built and maintained AEAT Modelos submission integrations using REST/SOAP adapters, exponential-backoff retry, circuit breakers, and TLS client certificate handling through AWS S3 and KMS.
- Contributed to the Deterministic Fiscal Engine for Model 303 VAT returns, supporting line-by-line and aggregate calculations with rate-by-rate breakdowns and a 0.02€ tolerance threshold.
- Implemented Verifactu invoice lifecycle flows for submit, correct, and cancel operations in real-time and deferred modes, including QR verification against AEAT and signed PDF generation.
- Helped maintain the TicketBAI regional compliance module for Basque territories, including Bizkaia, Gipuzkoa, and Araba.
- Contributed API endpoints, GraphQL resolvers, OpenAPI documentation, Playwright E2E tests, and Docker-based CI/CD workflows as part of the release cycle.

*Stack: TypeScript • NestJS • Fastify • GraphQL • PostgreSQL • Prisma • Turborepo • Docker • Playwright • AWS S3/KMS • SOAP*

### Full-Stack Developer • BicaDriver Limited • Remote, Lagos, Nigeria
*Jan 2026 – Present*

Built and launched a production ride-hailing platform — 13-state trip state machine, real-time GPS over namespaced Socket.io, and idempotent Monnify payment splits — serving 1,000+ vehicle owners and 50+ drivers with sub-150ms p95 API response times.

- Modelled trip flow as a 13-state machine with server-enforced transitions, so two clients and the server stay in agreement regardless of connection quality.
- Implemented three-zone pricing with traffic-aware fare logic and rate snapshotting at trip creation, so fares never drift when settings change mid-trip.
- Built GPS fare settlement with a three-step fallback (Google Roads → Haversine → estimate) and 1/sec-throttled Redis list accumulation, avoiding Postgres writes on every location tick.
- Designed failure-first reconnection: 401 errors suppressed during active trips so signal drops never log a driver out mid-ride, with `/rides/current` restoring full trip context on reconnect.
- Implemented client-side `X-Idempotency-Key` on every mutating request and signature-verified Monnify webhooks with status normalisation — processing ₦2M+ in the first two months with zero duplicate charges.
- Isolated Firebase push and Resend email to BullMQ queues so third-party slowness never blocks trip lifecycle API responses.
- Built driver rating enforcement with automated 72-hour/30-day suspensions and full audit logging; OTP verification with 4-digit PIN, 5-attempt lockout, and brute-force protection.

*Stack: TypeScript • React Native • NestJS • PostgreSQL • Prisma • Socket.io • Redis • BullMQ • Monnify API • Capacitor • FCM • Zustand*

### Full-Stack Developer • Martínez & Company • Remote, Spain
*Jun 2024 – Dec 2024*

- Built a GDPR-compliant website for a European grant consultancy using Next.js, TypeScript, Tailwind CSS, and Vercel, delivered on schedule.
- Integrated PostHog analytics with a custom waitlist funnel, enabling launch visibility and conversion tracking.
- Developed QR-based lead capture forms connected to WhatsApp and Telegram Bot API integrations.
- Delivery quality earned a direct referral to ADP Digitek's engineering team.

*Stack: React • Next.js • TypeScript • Tailwind CSS • PostHog • WhatsApp API • Telegram Bot API • Vercel*

### Web Developer • Talent Group Services • Remote, Bedford, UK
*Jan 2022 – May 2024*

- Built a booking platform from scratch as the sole developer, scaling to 300+ monthly active users.
- Reduced manual scheduling workload by 40% through self-serve booking workflows integrated with the operations team.
- Optimized PostgreSQL queries and backend endpoints, reducing average response time by 35%.
- Managed production deployments, monitoring, incident response, and day-to-day platform reliability.

*Stack: React • Next.js • TypeScript • Node.js • PostgreSQL • Vercel*

---

## Selected Projects

### temi.dev — Personal SaaS Platform
*2025 – Present*
*Next.js • NestJS • PostgreSQL • LangChain • pgvector • OpenAI API • Turborepo*

- Built a full-stack SaaS platform with portfolio presentation, service booking, an AI-generated blog, a lead management dashboard, and admin analytics.
- Engineered a RAG-powered blog with "Ask this article" contextual chat, AI-generated summaries, and pgvector-backed semantic search.
- Built an AI lead-scoring system that prioritizes inbound contacts, generates personalized outreach drafts, and tracks conversion.

temitope.live • github.com/TemitopeRekun/temi.dev

### Lopay — School Fee Installment Platform
*2025*
*TypeScript • NestJS • PostgreSQL • Prisma • Paystack API • Better Auth*

- Built a fintech platform that enables Nigerian parents to pay school fees in flexible installments with traceable disbursements to schools.
- Designed a kobo-safe Money value object to eliminate floating-point drift across all financial calculations.
- Implemented installment plans with a 25% minimum deposit, 2.5% platform fee, and rounding-absorbed final installment so schedules sum exactly.
- Integrated Paystack split payments with subaccount routing, fee gross-up, idempotent processing, and auditable lifecycle transitions.

github.com/TemitopeRekun/Lopay • github.com/TemitopeRekun/lopay-backend

---

## Education

**B.Sc. Computer Science** • National Open University of Nigeria
*2023 – Present (Part-time, in progress)*

Relevant coursework: Data Structures & Algorithms • Database Systems • Software Engineering • OOP • Web Technologies

---

## References

**Aina Maria Perellò**
Chief Technology Officer, Martínez Company, Spain
admin@martinezcompany.eu • martinezcompany.eu/english
> "His work contributed to the digital implementation aspects of grant-funded initiatives… I would not hesitate to work with Temitope again."

**Pedro Martínez Dopico**
Managing Director, ADP Digitek / AINVID Coding S.L., Spain
admin@adpdigitek.com
> "He showed a clear ability to adapt to modern development environments and to quickly familiarise himself with unfamiliar systems."

---

## Additional Information

- **Remote:** 4+ years across async-first international teams in Nigeria, the UK, and Spain; documentation-first and collaborative in distributed environments.
- **Languages:** English (C1+, Professional) • Yoruba (Native)
- **Timezone:** WAT (UTC+1) with full EU/UK overlap and partial US-East overlap through flexible scheduling.
- **Availability:** Full-time remote • Contract • Open to mid-level and senior individual contributor roles.
