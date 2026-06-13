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

Built and launched a production ride-hailing platform connecting vehicle owners with professional drivers — serving 1,000+ vehicle owners and 50+ drivers with sub-150ms p95 API response times on unreliable Nigerian mobile networks.

- Processed ₦2M+ in the first two months with zero duplicate charges — client-generated `X-Idempotency-Key` on every mutation, signature-verified Monnify webhooks, and per-driver sub-accounts that split platform commission and driver earnings automatically at settlement.
- Modelled the trip lifecycle as a server-enforced 13-state machine so the owner app, driver app, and backend never disagree on trip status, even across reconnects mid-ride.
- Designed failure-first reconnection: 401s suppressed during active trips so a signal drop never logs a driver out mid-ride, `/rides/current` restoring full trip context, and concurrent refreshes collapsed into one in-flight call to prevent a token-refresh stampede.
- Cut Postgres write load by accumulating GPS points in a 1/sec-throttled Redis list and settling fares from a three-step fallback (Google Roads → Haversine → estimate), instead of writing on every location tick.
- Snapshotted three-zone, traffic-aware pricing onto each trip at creation so fares never drift mid-trip, and isolated Firebase push and Resend email onto BullMQ queues so third-party slowness never blocks the trip API.

*Stack: TypeScript • React Native • NestJS • PostgreSQL • Prisma • Socket.io • Redis • BullMQ • Monnify API • Capacitor • FCM • Zustand*

### Full-Stack Developer • Martínez & Company • Remote, Spain
*Jun 2024 – Dec 2024*

- Shipped a GDPR-compliant lead-generation site for a European grant consultancy, with consent-gated analytics.
- Built a PostHog funnel around a waitlist to track sign-up conversion and drop-off.
- Wired QR lead-capture forms to WhatsApp and Telegram so field leads reached the team without manual entry.
- Work earned a direct referral to ADP Digitek's engineering team.

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
*Next.js 15 • NestJS • Turborepo • PostgreSQL • pgvector • Gemini • Prisma*

- Built the whole platform — portfolio, service booking, an AI blog, a lead dashboard, and admin analytics — as a database-driven product, not a static site.
- Built semantic search as a plain SQL query: embeddings live beside the relational data, so there's no separate vector database to run or keep in sync.
- Floored retrieval on similarity so the "Ask this article" assistant answers "I don't know" instead of inventing one.
- Built AI lead-scoring that ranks inbound contacts and drafts personalized outreach.
- Treated it like production, not a demo: real auth, rate limiting, error tracking, and a CI gate that blocks on type errors.

temitope.live • github.com/TemitopeRekun/temi.dev

### Lopay — School Fee Installment Platform
*2025*
*TypeScript • NestJS • PostgreSQL • Prisma • Paystack API • Better Auth*

- Built a platform where parents pay school fees in installments and schools receive confirmed, traceable payments.
- Stored all money as integer minor units (kobo) so balances can't drift from floating-point rounding.
- Made the payment lifecycle backend-only — the client can't change state — with enrollment and its first payment in one transaction, so a child is never half-enrolled.
- Froze fees at enrollment and logged every confirmation to an immutable row, so a disputed payment always has an answer.
- Pre-split each payment into school and platform amounts (25% minimum deposit, 2.5% fee, rounding absorbed by the final installment), with retries idempotent so a resubmit can't double-charge.

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
