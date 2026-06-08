import "reflect-metadata";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { AiModule } from "../modules/ai/ai.module";
import { AiService } from "../modules/ai/ai.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AiModule],
})
class ScriptModule {}

const BLOG_POSTS = [
  {
    slug: "ai-pipelines-at-scale",
    title: "Building Reliable AI Pipelines at Scale",
    tag: "AI",
    excerpt: "Designing evaluation loops, observability, and safe fallbacks for production AI features.",
    content: `
      <h2>The Challenge of Production AI</h2>
      <p>Building AI prototypes is easy; shipping reliable AI features to production is hard. The non-deterministic nature of LLMs introduces a new class of failures that traditional software engineering practices aren't fully equipped to handle. In this post, we'll explore how to build robust AI pipelines that can withstand the chaos of the real world.</p>

      <h2>Evaluation Loops</h2>
      <p>The core of any reliable AI system is a strong evaluation loop. You cannot improve what you cannot measure. We recommend a three-tiered approach: unit tests for deterministic components, model-graded evals for semantic correctness, and human-in-the-loop validation for edge cases. Tools like Ragas or custom evaluation harnesses using stronger models (like GPT-4 or Gemini 1.5 Pro) to grade weaker models (like Gemini 1.5 Flash) are essential.</p>

      <h2>Observability and Tracing</h2>
      <p>When an AI feature fails, you need to know why. Was it a retrieval failure in your RAG pipeline? A hallucination by the model? Or a latency timeout? implementing comprehensive tracing with tools like LangSmith or OpenTelemetry allows you to visualize the entire chain of thought. Tagging traces with user feedback (thumbs up/down) provides a goldmine of data for fine-tuning.</p>

      <h2>Safe Fallbacks</h2>
      <p>Never let the user see a raw JSON error or a timeout. Always implement graceful fallbacks. If the primary model fails, fall back to a smaller, faster model or even a heuristic-based approach. For RAG systems, if retrieval yields no relevant documents, the system should admit ignorance rather than hallucinating an answer. "I don't know" is a perfectly valid and safe response in a production system.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=ai-pipeline",
    readTime: 6,
    published: true,
  },
  {
    slug: "nextjs-15-ssr",
    title: "Next.js 15: SSR Patterns That Scale",
    tag: "Web",
    excerpt: "Leverage Server Components, caching, and edge for performance without complexity.",
    content: `
      <h2>Embracing the Server</h2>
      <p>Next.js 15 continues to push the boundaries of what's possible with React Server Components (RSC). By moving data fetching to the server, we reduce the client-side JavaScript bundle, leading to faster First Contentful Paint (FCP) and better SEO. But with great power comes great responsibility—specifically, managing the waterfall of network requests.</p>

      <h2>Caching Strategies</h2>
      <p>The granular caching mechanisms in Next.js 15 allow us to cache data at the request level, route level, or globally. Understanding the difference between \`force-cache\`, \`no-store\`, and revalidation periods is crucial. We've found that a "stale-while-revalidate" strategy works best for content-heavy sites like blogs, while dynamic dashboards benefit from streaming server components with \`Suspense\` boundaries.</p>

      <h2>Edge Rendering</h2>
      <p>For global applications, edge runtime can significantly reduce latency. However, it comes with constraints—no Node.js APIs, limited database connections. We recommend a hybrid approach: use Node.js runtime for complex mutations and database interactions, and Edge runtime for personalized, read-heavy views that rely on cached data or lightweight APIs.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=nextjs",
    readTime: 5,
    published: true,
    viewCount: 85,
  },
  {
    slug: "nestjs-modules",
    title: "Production-Ready NestJS Modules",
    tag: "Backend",
    excerpt: "Patterns for maintainable services, DTO validation, and cross-module communication.",
    content: `
      <h2>Modular Architecture</h2>
      <p>NestJS shines in its ability to enforce a modular architecture. But simply creating modules isn't enough; you need to define clear boundaries. We advocate for a Domain-Driven Design (DDD) approach where each module encapsulates a specific domain (e.g., Auth, Billing, Users). Circular dependencies are a smell that your boundaries are leaking.</p>

      <h2>DTOs and Validation</h2>
      <p>Never trust user input. NestJS's validation pipe combined with \`class-validator\` and \`class-transformer\` provides a robust defense. Define strict DTOs for every input and output. Use \`whitelist: true\` to strip unexpected properties. This not only secures your API but also serves as self-documenting code for frontend consumers.</p>

      <h2>Cross-Module Communication</h2>
      <p>When Module A needs data from Module B, direct imports create tight coupling. Instead, consider using an event-driven architecture with \`@nestjs/event-emitter\` for side effects (like sending a welcome email after registration). For synchronous needs, expose a clean public API service within the module, or better yet, use a shared library for common interfaces.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=nestjs",
    readTime: 7,
    published: true,
    viewCount: 95,
  },
  {
    slug: "r3f-ux",
    title: "3D UX with R3F",
    tag: "3D",
    excerpt: "Blend subtle motion and lighting to enhance narrative without compromising accessibility.",
    content: `
      <h2>The Third Dimension</h2>
      <p>Adding 3D elements to a web page can elevate the user experience from flat to immersive. React Three Fiber (R3F) makes this accessible to React developers. However, the key is subtlety. A spinning cube is a gimmick; a reactive background that responds to mouse movement adds depth and polish.</p>

      <h2>Performance First</h2>
      <p>WebGL contexts are heavy. Always use \`drei\`'s performance monitoring tools to downgrade quality on lower-end devices. Use instanced meshes for repetitive elements. And crucially, ensure your site is fully functional without the 3D canvas—progressive enhancement is the name of the game.</p>
      
      <h2>Accessibility</h2>
      <p>3D should never impede accessibility. Ensure screen readers can still navigate your content. Use \`aria-label\` on canvas elements if they are interactive. Respect the user's \`prefers-reduced-motion\` setting by disabling or slowing down animations.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=r3f",
    readTime: 4,
    published: true,
    viewCount: 60,
  },
  {
    slug: "mobile-design-systems",
    title: "Mobile Design Systems with React Native",
    tag: "Mobile",
    excerpt: "Build once, ship everywhere—shared primitives and tokens across web and mobile.",
    content: `
      <h2>Universal Design Tokens</h2>
      <p>The dream of "write once, run everywhere" starts with design tokens. By defining your colors, spacing, and typography in a platform-agnostic format (like JSON), you can generate theme files for both Tailwind (Web) and Tamagui/NativeWind (Mobile). This ensures brand consistency across all touchpoints.</p>
      
      <h2>Shared Primitives</h2>
      <p>React Native Web has matured significantly. You can build shared UI primitives (Buttons, Cards, Inputs) that render as \`<div>\` on web and \`<View>\` on mobile. Monorepos with tools like Turborepo make sharing these components seamless. However, always be ready to fork implementation for platform-specific nuances, like navigation or gestures.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=mobile",
    readTime: 5,
    published: true,
    viewCount: 45,
  },
  {
    slug: "pgvector-rag",
    title: "RAG with pgvector",
    tag: "Data",
    excerpt: "Chunking, embeddings, and retrieval patterns that are simple and effective.",
    content: `
      <h2>Why pgvector?</h2>
      <p>You don't always need a specialized vector database like Pinecone or Weaviate. If you're already using PostgreSQL, \`pgvector\` allows you to keep your vector data right alongside your relational data. This simplifies your stack, reduces latency, and allows for powerful hybrid queries (e.g., "find vectors similar to X but only where user_id = Y").</p>
      
      <h2>Chunking Strategies</h2>
      <p>The quality of your retrieval depends heavily on how you chunk your data. Naive splitting by character count often breaks semantic meaning. We recommend recursive character splitting or even semantic splitting based on embedding similarity. Overlapping chunks ensures that context isn't lost at the boundaries.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=rag",
    readTime: 6,
    published: true,
    viewCount: 110,
  },
];

export const PROJECTS = [
  {
    title: "Lopay — School-Fee Installments",
    slug: "lopay",
    category: "Fintech",
    year: 2026,
    description:
      "A school-fee installment platform that lets parents pay tuition in weekly or monthly installments while schools receive confirmed, traceable payments. React 19 + Capacitor frontend on a NestJS + PostgreSQL backend.",
    body: `
A school-fee installment platform where the entire product is a correctness problem: parents pay over time, schools must be paid exactly once, and no rounding error is acceptable.

## The Problem

Paying school fees as a single lump sum is out of reach for many families. Lopay lets parents spread tuition across weekly or monthly installments, while schools still receive confirmed, traceable payments and the platform earns a flat 2.5% fee. Three roles share the system: parents sign up publicly, school owners are onboarded by an admin to confirm payments, and a super-admin manages schools and watches for defaulters. When you're moving other people's tuition money, "it mostly works" isn't a finish line.

## Architecture Thinking

The money model *is* the architecture. I treated every figure as something that has to be reconstructable and defensible months later, which pushed three decisions to the foundation: fees are frozen at enrollment so later changes can't rewrite history, amounts are integers (minor units) so floating-point drift never creeps into a balance, and every payment carries an idempotency key so a retried request can't double-charge. A React 19 + Capacitor frontend talks to a modular NestJS + PostgreSQL backend; Firebase verifies identity once, then the API issues its own JWT for stateless, role-guarded requests.

### Data Model
Fees are snapshotted onto the enrollment at creation, and the payment row is pre-split into platform and school amounts so settlement is never ambiguous:

\`\`\`prisma
model ChildEnrollment {
  totalSchoolFee   Int   // snapshot of class fee at enrollment
  platformFee      Int   // 2.5% of totalSchoolFee, fixed
  schoolMinimumFee Int   // 25% of totalSchoolFee
  remainingBalance Int   // after first payment & installments
  paymentStatus    PaymentStatus
}

model Payment {
  idempotencyKey String? @unique  // prevents duplicate submissions on retry
  amountPaid     Int              // what the parent paid
  platformAmount Int              // fixed 2.5% platform fee
  schoolAmount   Int              // amount going to the school
  status         PaymentTransactionStatus @default(PENDING)
}
\`\`\`

### Payment State Machine
Every payment moves through a backend-controlled lifecycle — **PENDING → ACTIVE → COMPLETED**, or **DEFAULTED** — and the client can never set that state directly. Enrollment and its first payment run inside a single Prisma \`$transaction\`, so a child is never half-enrolled, and a nightly scheduled job sweeps overdue plans and flags them defaulted.

### Real-Time & Boundaries
A JWT-authenticated Socket.io gateway pushes payment and enrollment changes to per-user, per-school, and admin rooms instead of polling. Receipts upload to Supabase through backend-signed URLs, so storage keys never touch the client.

## Constraints

It handles real tuition money, so correctness and auditability outrank everything — hence integer math, frozen fee snapshots, idempotent writes, and an immutable confirmation audit trail. Schools are onboarded manually for trust while parents self-serve for reach, which forces strict role boundaries. And it's multi-tenant by school, so tenant isolation is enforced centrally rather than hoped for at each query.

## What It Demonstrates

- **Idempotent payments** — a unique \`idempotencyKey\` per payment makes a retried submission a no-op instead of a double-charge.
- **Money as integers** — amounts stored in minor units, never floats, so a balance can't drift by rounding.
- **Immutable financial history** — fees snapshotted at enrollment and every confirmation written to an audit row, so a dispute always has an answer.
- **State-machine integrity** — a backend-only payment lifecycle the client can't mutate, with transactional enrollment so records are never half-written.
- **Multi-tenant isolation** — per-school scoping enforced centrally, so one missing clause can't leak another school's data.

## Outcome

Lopay runs as a modular monolith of ten feature modules, with unit and e2e tests over the payment math, a nightly defaulter sweep, structured logging, error tracking, security headers, and rate limiting. The interesting engineering isn't the screens — it's a financial state machine that stays correct under retries, partial failures, and disputes.
`,
    techStack: ["React 19", "Capacitor", "NestJS", "PostgreSQL", "Prisma", "Socket.io", "Firebase Auth"],
    liveUrl: "",
    repoUrl: "https://github.com/TemitopeRekun/Lopay",
    featured: true,
    order: 1,
  },
  {
    title: "BicaDriver — Real-Time Ride-Hailing",
    slug: "bicadriver",
    category: "Mobility",
    year: 2026,
    description:
      "A real-time ride-hailing platform connecting car owners with professional drivers — live GPS tracking, split payments, and a driver-quality system. A Capacitor mobile app on a NestJS + Socket.io backend.",
    body: `
A real-time ride-hailing platform where the hard problems all live in the same place: money moving correctly while a phone loses signal in moving traffic.

## The Problem

BicaDriver connects car owners who need reliable transport with professional drivers who want consistent work. It has to be real-time end to end — drivers receive ride requests, owners watch their assigned driver move on a live map, payments settle and split automatically, and admins see the whole platform's state. The catch: it all runs on phones in moving cars on Nigerian mobile networks, so it has to stay correct even as connections drop mid-trip.

## Architecture Thinking

A ride-hailing app looks like a maps problem and turns out to be a state problem. At any moment a trip sits in one of thirteen states, two phones — owner and driver — need to agree on which one, a payment is settling in the background, and the network is unreliable by definition because people open the app in moving cars. I built BicaDriver around that reality: durable truth in PostgreSQL, fast-moving ephemeral state in Redis, and a real-time layer that treats disconnection as the normal case rather than the exception. A single React 19 + TypeScript codebase ships to Android and iOS through Capacitor; the backend is NestJS on Fastify.

### Real-Time Layer
Live tracking and dispatch run over a token-authenticated Socket.io \`/rides\` namespace (\`rides.gateway.ts\`) with role-scoped rooms — \`user:{id}\`, \`drivers\`, \`tracking:driver:{id}\` — so a location broadcast reaches exactly the people who should see it. Driver GPS is throttled to one update per second before it touches Redis, and trip points accumulate in a Redis list for final distance settlement instead of writing to Postgres on every tick.

### Idempotency & Payment Integration
Payments are the part that can't be wrong. Every mutating request carries an \`X-Idempotency-Key\` generated client-side in \`api.service.ts\`, so a retry after a dropped response settles once instead of double-charging. Money runs through Monnify with a per-driver sub-account model, so platform commission and driver earnings split at settlement; webhooks are signature-verified, and the provider's many success statuses (\`PAID\`, \`OVERPAID\`, \`SUCCESSFUL\`) collapse into one internal \`PaymentStatus\` enum.

The key is generated client-side, once per mutation, with a fallback for older webviews:

\`\`\`ts
interface RequestOptions {
  idempotencyKey?: string;   // safe-retry token, one per mutation
}

const generateUUID = () =>
  crypto.randomUUID?.() ?? fallbackUuidV4();
\`\`\`

### Resilience & Offline
The client assumes the socket will flap. While a trip is \`ASSIGNED\` or \`IN_PROGRESS\`, the auth layer suppresses the spurious 401s reconnection would otherwise trigger (\`App.tsx\`), so a signal drop never logs a driver out mid-ride. On launch the app calls \`/rides/current\` to recover an active trip or a pending payment exactly where it left off, and GPS accuracy is tiered — a fresh high-accuracy fix for pickup, a few seconds of staleness tolerated for tracking (\`CapacitorService.ts\`).

And concurrent 401s don't trigger a stampede of refresh calls — they share a single in-flight refresh:

\`\`\`ts
let refreshPromise: Promise<string> | null = null;

async function attemptTokenRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise;   // already refreshing -> reuse it
  refreshPromise = (async () => {
    const token = await requestNewToken();      // hits /auth/refresh once
    saveToken(token);
    return token;
  })().finally(() => { refreshPromise = null; });
  return refreshPromise;
}
\`\`\`

### Pricing & Driver Quality
Fares come from one server-side engine (\`rides.service.ts\`) with three distance/traffic zones, and the pricing parameters are snapshotted onto the trip at request time so an invoice never drifts when settings change. A rating system auto-suspends drivers who fall below quality thresholds, with every score change written to an audit log.

## Constraints

This is Nigeria-first infrastructure: mobile networks drop constantly, so offline resilience is a requirement, not a polish item. The payments are real money owed to real drivers, so "probably charged once" isn't acceptable — idempotency keys and verified webhooks are mandatory. And it's a two-sided real-time market running on phones, so battery and bandwidth are budgets I spend deliberately — GPS throttling, accuracy tiering, notifications offloaded to a queue — rather than ignore.

## What It Demonstrates

- **Idempotent financial mutations** — an \`X-Idempotency-Key\` on every write makes retries safe, eliminating double-charges when the network drops between request and response.
- **State-machine modeling** — thirteen explicit trip states keep two clients and the server in agreement instead of inferring intent from side effects.
- **Real-time at scale** — a namespaced Socket.io layer with role-scoped rooms and 1/sec GPS throttling delivers live tracking without overwhelming Redis.
- **Failure-first design** — 401 suppression during active trips and \`/rides/current\` recovery treat disconnection as the expected case, not an error state.
- **Background-work isolation** — Firebase push and Resend email run on BullMQ queues, so a slow third party never blocks an API response.
- **Payment-provider integration** — Monnify sub-accounts with signature-verified webhooks and status normalization turn a messy external API into one clean internal contract.
- **Concurrency-safe auth** — concurrent 401s share a single in-flight token refresh, so a reconnection storm can't trigger a refresh stampede.

## Outcome

The system handles three roles, thirteen trip states, live tracking, split payments, and KYC onboarding, with Sentry error tracking, tiered rate limiting, and a BullMQ job dashboard. It's the project where I learned that real-time payments are mostly about getting the state machine right under failure.
`,
    techStack: ["React 19", "Capacitor", "NestJS", "Fastify", "Socket.io", "Redis", "BullMQ", "PostgreSQL", "Monnify"],
    liveUrl: "https://bicadriver.netlify.app",
    repoUrl: "https://github.com/TemitopeRekun/Bica-Driver",
    featured: true,
    order: 2,
  },
  {
    title: "AICore — Multi-Provider LLM Gateway",
    slug: "aicore",
    category: "AI Infrastructure",
    year: 2026,
    description:
      "A single TypeScript SDK and edge proxy that puts OpenAI, Anthropic, Gemini, and Groq behind one contract — returning normalized responses with per-call cost, token, and latency telemetry.",
    body: `
A single SDK and edge proxy that puts OpenAI, Anthropic, Gemini, and Groq behind one contract — every call comes back normalized, with its cost, tokens, and latency attached.

## The Problem

Shipping AI features means re-learning four different SDKs, having no visibility into what any single call costs, and rebuilding the same plumbing — retries, error handling, logging — for every provider. AICore collapses that into one contract: one SDK call returns a normalized response with per-call cost, token count, and latency, regardless of which provider served it.

## Architecture Thinking

The whole system hangs off one idea: if every provider returns the *same shape*, then routing, error handling, cost accounting, and telemetry can each be written once. So the center of the codebase isn't a provider — it's a contract. A pnpm + Turborepo monorepo with a shared-types spine (every package depends on it; it depends on nothing) makes that contract enforceable at build time. A thin SDK calls a Cloudflare Workers edge proxy that runs a composed middleware chain and routes to one of four provider adapters.

### The Provider Contract
Every adapter returns the same discriminated union and the same usage shape, so the proxy builds the response envelope and the telemetry row exactly once:

\`\`\`ts
export interface ProviderCallUsage {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  latencyMs: number;
}

// Discriminated union returned by every provider adapter.
export type ProviderCallResult =
  | { ok: true; data: unknown; usage: ProviderCallUsage }
  | { ok: false; error: AICoreError };
\`\`\`

Adding a fifth provider is a closed change: implement the interface, register it, done.

### Composed Middleware
Each concern — logging, auth, validation, circuit-breaker — is an isolated layer, run as an onion where every layer calls the next:

\`\`\`ts
export function compose(...middlewares: Middleware[]) {
  return async (request, env, ctx) => {
    const context = { request, env, ctx, state: {}, startTime: Date.now() };
    let index = -1;
    async function dispatch(i: number): Promise<Response> {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      const fn = middlewares[i];
      if (i === middlewares.length) return new Response("Not Found", { status: 404 });
      return fn(context, () => dispatch(i + 1));   // hand off to the next layer
    }
    return dispatch(0);
  };
}
\`\`\`

### Hot-Path Safety
Telemetry, logging, and spend tracking run off the request path via \`ctx.waitUntil\` — best-effort, fire-and-forget — so observability can never throw into a user's AI call. Each provider's wildly different error shapes are normalized to one \`AICoreError\`, guarded by a contract test suite all four adapters must pass.

### Telemetry as a Contract
Usage rows land in a monthly-partitioned, row-level-secured Supabase Postgres table. Because partitioned tables are painful to migrate, the schema reserves its full future shape — agent id, workflow id, cache hit, quality score — from day one; later features fill columns instead of running risky migrations.

## Constraints

It sits on the hot path of someone else's product, so nothing it does can add latency or a failure mode to their AI call — hence edge deployment and fire-and-forget telemetry. It spans independent deploy targets (worker, dashboard, SDK, CLI) sharing one contract, so the type spine and eight ADRs exist to keep them honest. And it's cost-reporting software, so the cost math has to be exact — a unit bug there is the whole value proposition gone.

## What It Demonstrates

- **Contract-first design** — one discriminated-union result type lets four providers share routing, error handling, and telemetry, and makes a fifth a closed change.
- **Hot-path safety** — \`ctx.waitUntil\` keeps all observability off the user's request, so logging can never break a call.
- **Error normalization** — four providers' incompatible error shapes collapse into one \`AICoreError\`, enforced by a shared contract test suite.
- **Schema foresight** — a partitioned telemetry table that reserves future columns up front, avoiding risky migrations later.
- **Monorepo discipline** — a shared-types spine plus eight written ADRs keep independently-deployed services in sync.

## Outcome

Four working provider adapters, a unified SDK, accurate sub-cent cost reporting, eight architecture-decision records, and a blocking CI gate of strict type-checking plus green tests across every package. I built it as a production-grade reference for how a multi-provider AI layer should be structured — contracts first, observability built in, decisions written down.
`,
    techStack: ["TypeScript", "Cloudflare Workers", "Supabase", "PostgreSQL", "BullMQ", "Next.js", "Turborepo"],
    liveUrl: "",
    repoUrl: "https://github.com/TemitopeRekun/aicore",
    featured: true,
    order: 3,
  },
  {
    title: "temi.dev — AI-Powered Portfolio Platform",
    slug: "temi-dev",
    category: "Full-Stack",
    year: 2026,
    description:
      "The platform behind this site — a Next.js 15 + NestJS monorepo with RAG-powered semantic search over my posts and projects, a 3D animated frontend, and an admin CRM.",
    body: `
The platform behind this site — a full-stack monorepo with an AI search layer, built so the portfolio is itself the case study.

## The Problem

A portfolio is usually a static site. I wanted mine to be the thing it describes: a real full-stack product with a backend, an AI search layer, and an admin surface — so visiting the site is reading the case study.

## Architecture Thinking

The guiding decision was to over-build deliberately — treat a personal site like a product, so the architecture choices are real ones. It's a pnpm + Turborepo monorepo: a Next.js 15 (App Router, React 19) frontend, a NestJS-on-Fastify backend, and shared \`ui\`, \`types\`, and \`config\` packages, with all content database-driven through a JWT-protected admin rather than hardcoded. The one genuinely interesting subsystem is search.

### RAG Without a Separate Vector Database
Posts and projects are embedded with Gemini and stored as vectors in the same PostgreSQL via \`pgvector\`, so semantic search is just a SQL query sitting next to the relational data — no extra service, nothing to keep in sync:

\`\`\`sql
SELECT id, title, content,
       1 - (embedding <=> $queryVec) AS similarity
FROM "Project"
WHERE embedding IS NOT NULL
  AND 1 - (embedding <=> $queryVec) >= 0.7   -- relevance floor
ORDER BY embedding <=> $queryVec ASC          -- cosine distance
LIMIT 8;
\`\`\`

A visitor's question is embedded, matched against this, and answered from the retrieved context — with "I don't know" treated as a valid response rather than a hallucination.

### Production Hygiene
The API ships with Helmet security headers, tiered rate limiting, request validation, auto-generated Swagger docs, and Sentry error tracking. CI gates every push on lint and type-checking across the whole monorepo, and Open Graph cards are generated as branded images at the edge.

## Constraints

It's a portfolio, so it has to load fast and look polished — but I used it as a place to practice production patterns instead of cutting corners, which is why it carries real auth, validation, observability, and CI. Keeping the AI layer cheap and simple — no separate vector database, a relevance floor to keep junk out of the context — was a deliberate constraint, not a shortcut.

## What It Demonstrates

- **Embeddings in Postgres** — \`pgvector\` cosine search lives beside relational data, so there's no separate vector service to run or sync.
- **Grounded retrieval** — a 0.7 similarity floor keeps weak matches out of the context, so the assistant can honestly say "I don't know."
- **Monorepo architecture** — Turborepo pipelines and shared packages keep a Next.js app and a NestJS API consistent.
- **Production hygiene by default** — security headers, rate limiting, Swagger, Sentry, and a blocking CI gate, on a personal project.

## Outcome

The site you're reading is the deliverable: a monorepo with a real API, embeddings-backed search, an admin CRM for projects, posts, and leads, and a CI/CD pipeline. It's deliberately over-built for a portfolio — that's the point.
`,
    techStack: ["Next.js 15", "NestJS", "Turborepo", "PostgreSQL", "pgvector", "Gemini", "Prisma"],
    liveUrl: "https://www.temitope.live",
    repoUrl: "https://github.com/TemitopeRekun/temi.dev",
    featured: true,
    order: 4,
  },
];

async function main(): Promise<void> {
  console.log("Starting seed...");
  const app = await NestFactory.createApplicationContext(ScriptModule);
  const prisma = app.get(PrismaService);
  const ai = app.get(AiService);

  // Seed Blog Posts
  for (const post of BLOG_POSTS) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });
    if (!existing) {
      console.log(`Creating post: ${post.title}`);
      const created = await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          tags: [post.tag],
          published: post.published,
          publishedAt: new Date(),
        },
      });
      
      // Generate Embedding
      console.log(`Generating embedding for: ${post.title}`);
      try {
        const emb = await ai.generateEmbedding(post.content);
        if (emb.length > 0) {
          const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
          await prisma.$executeRawUnsafe(`UPDATE "BlogPost" SET embedding = ${vec} WHERE id = '${created.id}'`);
          console.log(`Embedding saved for: ${post.title}`);
        } else {
            console.warn(`Embedding generation returned empty for: ${post.title}`);
        }
      } catch (e) {
        console.error(`Failed to generate embedding for ${post.title}:`, e);
      }
    } else {
      console.log(`Post already exists: ${post.title}`);
    }
  }

  // Seed Projects
  for (const project of PROJECTS) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title },
    });
    if (!existing) {
      console.log(`Creating project: ${project.title}`);
      const created = await prisma.project.create({
        data: {
            title: project.title,
            slug: project.slug,
            description: project.description,
            body: project.body,
            category: project.category,
            year: project.year,
            techStack: project.techStack,
            liveUrl: project.liveUrl || null,
            repoUrl: project.repoUrl || null,
            featured: project.featured,
            order: project.order,
        }
      });

      // Generate Embedding
      console.log(`Generating embedding for: ${project.title}`);
      try {
        const emb = await ai.generateEmbedding(project.description);
        if (emb.length > 0) {
          const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
          await prisma.$executeRawUnsafe(`UPDATE "Project" SET embedding = ${vec} WHERE id = '${created.id}'`);
          console.log(`Embedding saved for: ${project.title}`);
        } else {
            console.warn(`Embedding generation returned empty for: ${project.title}`);
        }
      } catch (e) {
        console.error(`Failed to generate embedding for ${project.title}:`, e);
      }
    } else {
        console.log(`Project already exists: ${project.title}`);
    }
  }

  console.log("Seed completed.");
  await app.close();
}

// Only run the seed when executed directly (so other scripts can import PROJECTS).
if (require.main === module) {
  void main();
}
