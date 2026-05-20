import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Stack — Temitope Ogunrekun",
  description:
    "The tools I actually use to build things. TypeScript, Next.js, NestJS, PostgreSQL, Docker, and more — with context from real projects.",
  path: "/stack",
  image: "https://picsum.photos/1200/630?seed=stack-og",
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
        body: "Every project I'm currently on uses it — Multifactu, Bica Driver, this portfolio. It keeps styling close to the component and makes consistency across a codebase easier to maintain without a design system overhead.",
      },
      {
        name: "Vite",
        body: "Build tool for Bica Driver. Fast HMR, clean config, and the Capacitor integration works without fighting it. Having worked with Vite directly gives me a clearer picture of what's happening under the hood on builds.",
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
        body: "My backend framework on Multifactu's API layer at ADP Digitek. Modules, guards, interceptors, dependency injection — I've built auth systems, file upload pipelines, rate-limited endpoints, and maintained OpenAPI specs that keep the frontend-backend contract honest.",
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
        body: "My ORM for TypeScript projects. The generated types mean database queries are as type-safe as the rest of the code. I use it in personal projects including this portfolio's backend.",
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
        body: "Unit testing in Bica Driver. Fast, Vite-native, and the API is close enough to Jest that there's no context-switching cost.",
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
        body: "File storage and auth in personal projects including this portfolio. PostgreSQL under the hood, which keeps the data model consistent with what I'd use in production.",
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
              These are the tools I actually use to build things. Not a
              wishlist — everything here shows up in real codebases I've
              shipped.
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
