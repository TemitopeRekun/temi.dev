import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Stack — Temitope Ogunrekun",
  description:
    "The tools I actually use to build things. TypeScript, Next.js, NestJS, PostgreSQL, Docker, and more — with context from real projects.",
  path: "/stack",
});

type StackItem = {
  name: string;
  body: string;
};

type StackSection = {
  category: string;
  items: StackItem[];
};

const STACK: StackSection[] = [
  {
    category: "Frontend",
    items: [
      {
        name: "Next.js",
        body: "My primary framework for server-rendered web apps. At ADP Digitek, Multifactu's frontend runs on Next.js 14 inside a TypeScript monorepo — App Router, server components, the full picture. Before that, I used it at Martínez & Company for a GDPR-compliant client site and at Talent Group Services for the booking platform I built solo.",
      },
      {
        name: "React",
        body: "Every web thing I build is React underneath, and Bica Driver — a real-time ride-sharing PWA I work on — runs React 19 without Next.js, which means routing, state, and rendering decisions are all yours to make. I'm comfortable with the full API: hooks, context, performance patterns, error boundaries, virtual lists for long feeds.",
      },
      {
        name: "TypeScript",
        body: "Default on every project I've started since 2021. The moment that really sharpened my view on it was Multifactu — where a type mismatch in a fiscal API isn't just annoying, it's a compliance issue. But even on Bica Driver, having typed Socket.io event payloads and Zod-validated API responses means the gap between what the server sends and what the UI expects stays honest.",
      },
      {
        name: "Tailwind CSS",
        body: "I resisted Tailwind for a while — utility classes felt like a step backwards from clean CSS. What changed my mind was opening a stylesheet on a codebase I hadn't touched in months and having no idea what was safe to delete. Tailwind makes every style decision local and visible: you open a component, the styles are right there, no mystery cascade. Multifactu, Bica Driver, and this portfolio all use it, and onboarding back into any of them after time away takes seconds.",
      },
      {
        name: "Vite",
        body: "I picked Vite for Bica Driver because Capacitor — the native mobile bridge — needed a build tool that didn't get in the way. Webpack configs that fight you are a real productivity drain, and I'd already wasted enough time debugging build issues that had nothing to do with the actual product. With Vite, HMR is fast enough that I stopped noticing it, which is exactly what a build tool should do. Working with it directly rather than through Next.js's abstraction also gave me a clearer picture of what bundlers are actually doing.",
      },
    ],
  },
  {
    category: "State & Real-Time",
    items: [
      {
        name: "Socket.io",
        body: "Bica Driver's core feature is real-time — drivers receive ride requests, owners watch their driver move on a map, admins see live platform stats. All of it runs over Socket.io with separate namespaces for each user role. I built the reconnection handling, the stale-closure guards on event listeners, and the connectivity state that tells users when the socket drops and comes back.",
      },
      {
        name: "Zustand",
        body: "State management for Bica Driver. Auth session, active ride state, connectivity status, and the rating gate that blocks navigation until a driver's been rated — each is a separate store. Zustand's small API and the way it handles persistence with localforage made it the right fit for a PWA where the app needs to survive a refresh mid-trip.",
      },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      {
        name: "NestJS",
        body: "When I outgrew plain Node.js at Talent Group Services, I needed a backend framework that would keep things organised as the codebase grew — not just for me, but for the next person in the code. NestJS gives you that: modules, guards, dependency injection, a clear place for everything. At ADP Digitek I've used it to build Multifactu's entire API layer — auth systems, file uploads, rate-limited endpoints, OpenAPI specs. The structured approach means less time arguing about where things go and more time actually building.",
      },
      {
        name: "Node.js",
        body: "What I started with at Talent Group Services before moving to framework-level tools. Building that booking platform with raw Node helped me understand what NestJS and Express are actually abstracting, which matters when you're debugging something the framework is doing silently.",
      },
      {
        name: "REST APIs",
        body: "I've built API clients as well as servers. Bica Driver's API service layer handles retries on 5xx responses, idempotency keys on every mutation to prevent double-charges, and rate-limit backoff on 429s. On the server side at ADP Digitek I write and maintain OpenAPI documentation.",
      },
      {
        name: "Zod",
        body: "Runtime schema validation in Bica Driver. API responses get validated at the boundary so the rest of the app works with known shapes. Catching a malformed response early — before it causes a confusing UI state mid-trip — is worth the extra line.",
      },
    ],
  },
  {
    category: "Mobile",
    items: [
      {
        name: "Capacitor",
        body: "Bica Driver is a PWA that ships as a native Android app via Capacitor. I've worked with the camera plugin (drivers photograph their car before each trip), geolocation with accuracy fallbacks, Firebase push notifications, and haptic feedback. The interesting engineering problem is bridging the web layer with native capabilities while keeping the codebase a single React app.",
      },
      {
        name: "Google Maps & Places API",
        body: "Live driver tracking, pickup/dropoff location search, reverse geocoding, and route calculation in Bica Driver. The interesting decision was treating pickup location as always-fresh GPS while periodic tracking updates accept a short staleness window — accuracy where it matters, battery where it doesn't.",
      },
    ],
  },
  {
    category: "Database",
    items: [
      {
        name: "PostgreSQL",
        body: "In every production database I've worked on. At Talent Group Services it backed the booking and scheduling system. At ADP Digitek, Multifactu's entire data model — invoices, company records, fiscal compliance chains — runs on PostgreSQL. I'm comfortable with schema design, indexing, migrations, and queries that don't fall apart under load.",
      },
      {
        name: "Prisma",
        body: "Before Prisma I was writing raw SQL migrations at Talent Group Services and manually keeping TypeScript interfaces in sync with the database schema. One missed column meant a runtime error that TypeScript couldn't catch until something blew up in production. Prisma closes that gap: a schema change generates both the migration file and the updated types. It removes a whole category of bugs that live in the gap between your database and your code.",
      },
    ],
  },
  {
    category: "Infrastructure & Tooling",
    items: [
      {
        name: "Docker",
        body: "Multifactu at ADP Digitek runs in containers and our CI/CD pipeline builds and deploys Docker images. I write Dockerfiles, compose multi-service setups, and can debug a container that won't start. Before using it in production I'd had the classic experience of something working locally and breaking in staging — containers solved that permanently.",
      },
      {
        name: "CI/CD",
        body: "GitHub Actions pipelines on Multifactu and Bica Driver — run tests, build, deploy. The goal is always the same: make shipping boring enough that you stop thinking about it.",
      },
      {
        name: "Playwright",
        body: "End-to-end test suites on Multifactu at ADP Digitek covering critical user flows — invoice generation, export pipelines, form submissions. It catches the class of regressions that unit tests miss because it tests actual browser behaviour against a running app.",
      },
      {
        name: "Vitest",
        body: "The parts of Bica Driver that are hardest to test manually are the ones with the most moving state — ride lifecycle transitions, payment status flows, connectivity handling. Those are exactly the things that need unit tests. Vitest is what I use to cover those paths. It's Vite-native so there's no config overhead, and it's fast enough that I actually run it during development rather than treating it as a pre-commit checkbox.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        name: "Firebase / FCM",
        body: "Push notifications in Bica Driver — drivers get alerted to new ride requests even when the app is backgrounded. Wired up via Capacitor's push plugin with routing logic that takes the user to the right screen depending on notification type.",
      },
      {
        name: "Monnify",
        body: "Nigerian payment provider integrated into Bica Driver. The interesting engineering here was the recovery system — tracking orphaned transactions where payment succeeded but the trip didn't finalise, with idempotent retry operations to resolve them without double-charging. Payments in ride-sharing are stateful, and getting that state machine right matters.",
      },
      {
        name: "Supabase",
        body: "I used Supabase for this portfolio because I needed file storage and auth without spinning up a separate service for each. What I liked is that the underlying database is just PostgreSQL — the mental model is the same as production, no 'but Supabase handles it differently' gotcha waiting to bite you. For production work at ADP Digitek we run our own PostgreSQL, but Supabase taught me how to think about managed databases cleanly.",
      },
    ],
  },
  {
    category: "AI in my workflow",
    items: [
      {
        name: "Claude Code (CLI)",
        body: "My primary thinking partner, used through Claude Code — Anthropic's CLI. This is the reasoning layer. Opus is where I go for architecture decisions, designing a new system from scratch, reviewing an implementation before it ships, debugging something that spans multiple files and layers, planning a migration strategy, or working through a tradeoff I haven't committed to yet. If the task requires holding a lot of context and reasoning carefully about correctness — that's the Opus tier. Sonnet handles the step below: refactoring decisions, documentation, explaining code I've inherited, lighter planning. The discipline is knowing which model the task actually earns. Claude reasons. Everything else executes.",
      },
      {
        name: "DeepSeek",
        body: "DeepSeek changed my token cost calculus. V4 Flash is cheap enough that I stopped being conservative on tasks that don't need frontier reasoning. I reach for it when the design is already done and I'm just executing: writing CRUD endpoints from a spec, generating test fixtures, wiring up a service class Claude already designed, implementing repetitive variations of a known pattern, transforming data structures. The quality holds for that tier of work. When the task sits between pure execution and actual reasoning — a non-trivial refactor, a moderately complex feature where the spec exists but the edge cases aren't obvious — V4 Pro is the step up. It's still a fraction of frontier model cost, but it handles more ambiguity without needing hand-holding. My mental model: Claude Opus for decisions, DeepSeek V4 Pro for the in-between, V4 Flash for pure execution. It's not a compromise on output quality — it's not using a sledgehammer where a regular hammer is right. The cost savings mean I can afford to be more exploratory at the planning stage, because execution is cheap.",
      },
      {
        name: "OpenCode + DeepSeek",
        body: "OpenCode is where I run DeepSeek inside the editor. It handles the implementation layer — taking a plan that's already been reasoned through and turning it into working code. Where I reach for this: git commits, PR descriptions, routine refactors, renaming across a codebase, generating migration files from a known schema change, writing out GitHub Actions steps. Work that doesn't need frontier reasoning but needs more context and continuity than plain autocomplete. The combination of Claude Code for decisions and OpenCode + DeepSeek for execution is the closest I've gotten to a workflow that doesn't fight itself.",
      },
      {
        name: "VS Code + GitHub Copilot",
        body: "The ambient layer — in-line completions, quick debugging loops, staying in flow. The value isn't reasoning, it's zero friction. Where it earns its keep: mid-function completions where the next line is obvious, following an error through code without leaving the editor, writing the tenth variation of a similar handler, and staying inside a coding session without breaking concentration to open a chat window. Useful 60% of the time, wrong in an interesting way 30%, completely off 10% — the 60% is worth having. For anything that needs actual thinking, I switch to Claude Code. For everything that should just be fast, Copilot.",
      },
    ],
  },
];

export default function StackPage() {
  return (
    <main>
      <Section className="bg-(--bg)">
        <Container>
          <RevealOnScroll>
            <h1 className="sr-only">My Stack</h1>
            <AnimatedText
              phrase="My Stack"
              className="mb-6 text-3xl font-semibold text-(--text)"
            />
            <p className="mb-16 max-w-2xl text-lg text-(--muted)">
              Each tool here has a story — a real project where it showed up,
              something it cost me to figure out, and a reason it stayed.
            </p>
          </RevealOnScroll>

          <div className="space-y-20">
            {STACK.map((section) => (
              <div key={section.category}>
                <RevealOnScroll>
                  <h2 className="mb-8 text-xs font-medium uppercase tracking-[0.25em] text-(--accent)">
                    {section.category}
                  </h2>
                </RevealOnScroll>
                <div className="grid grid-cols-1 gap-px bg-(--border)/50 rounded-2xl overflow-hidden border border-(--border)/50">
                  {section.items.map((item) => (
                    <RevealOnScroll key={item.name}>
                      <div className="bg-(--bg) p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 sm:gap-8">
                        <div>
                          <h3 className="text-base font-semibold text-(--text)">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-(--muted) leading-relaxed text-sm sm:text-base">
                          {item.body}
                        </p>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
