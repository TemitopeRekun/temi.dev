<div align="center">

# temi.dev

### The AI-Powered Portfolio & Content Platform of Temitope Ogunrekun

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**A production-grade, full-stack monorepo powering a professional developer portfolio — complete with an AI blog assistant, RAG-powered search, lead capture, project showcases, and an admin CRM dashboard.**

</div>

---

## What is temi.dev?

`temi.dev` is not your typical portfolio. It is a fully engineered platform built to stand out — combining world-class frontend animations with a powerful backend API, intelligent AI features, and a private admin layer.

From immersive **Three.js / WebGL** visuals and **GSAP + Framer Motion** animations on the frontend, to a **NestJS + Fastify** API backend with **AI-powered RAG search**, **JWT authentication**, **email outreach**, **lead management**, and **Supabase file storage** — this repo is a showcase of production-level full-stack engineering.

---

## Monorepo Structure

This project is managed as a **pnpm workspace monorepo** orchestrated with **Turborepo**.

```
temi.dev/
├── apps/
│   ├── web/          # Next.js 15 frontend (portfolio, blog, projects)
│   └── api/          # NestJS 11 + Fastify backend API
├── packages/
│   ├── ui/           # Shared React component library
│   ├── types/        # Shared TypeScript type definitions
│   └── config/       # Shared ESLint / TS configs
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```

---

## Apps

### `apps/web` — The Frontend

Built with **Next.js 15 (App Router)** and **React 19**, the web app is a visually stunning, performance-focused portfolio site.

| Folder | Purpose |
|---|---|
| `app/` | Next.js App Router pages and layouts |
| `components/` | Reusable UI components |
| `actions/` | Next.js server actions |
| `lib/` | Utility functions and API client |
| `providers/` | React context and global providers |

**Frontend Tech Highlights:**
- `Three.js` + `@react-three/fiber` + `@react-three/drei` — 3D scenes and WebGL visuals
- `GSAP` + `@gsap/react` — advanced scroll-triggered animations
- `Framer Motion` — fluid UI transitions
- `Lenis` — smooth scroll engine
- `TanStack Query` — server state management with real-time data fetching
- `next-themes` — dark/light mode
- `react-markdown` + `highlight.js` — rich blog post rendering with syntax highlighting
- `Tailwind CSS v4` — utility-first styling
- `Sonner` — toast notification system

---

### `apps/api` — The Backend

A robust **NestJS 11** API served on **Fastify** with JWT authentication, Prisma ORM, and AI integration.

**API Modules:**

| Module | Description |
|---|---|
| `auth` | JWT-based authentication & authorization (admin-only) |
| `blog` | Blog post CRUD with public and admin endpoints |
| `ai` | AI service integration (Google Gemini) |
| `rag` | Retrieval-Augmented Generation over posts & projects using pgvector embeddings |
| `projects` | Portfolio project management with database & embeddings |
| `leads` | Contact/lead capture and admin management |
| `dashboard` | Admin dashboard data aggregation |
| `email` | Transactional email service (Resend) |
| `upload` | File upload management via Supabase Storage |

**Backend Tech Highlights:**
- `NestJS 11` + `Fastify` — high-performance modular API framework
- `Prisma ORM` — type-safe database access with migration support
- `Passport.js` + `JWT` — secure authentication
- `@nestjs/swagger` — auto-generated API documentation
- `@nestjs/throttler` — rate limiting
- `@fastify/helmet` — HTTP security headers
- `@fastify/multipart` — multipart file upload support
- `@supabase/supabase-js` — cloud file storage
- `@google/generative-ai` — Gemini AI integration (chat + `text-embedding-005`)
- `pgvector` — PostgreSQL vector embeddings powering RAG search
- `Resend` — transactional email
- `@sentry/nestjs` — error monitoring
- `bcryptjs` — password hashing
- `class-validator` + `class-transformer` — request validation and transformation

---

## Shared Packages

| Package | Description |
|---|---|
| `@temi/ui` | Shared React component library used across apps |
| `@temi/types` | Shared TypeScript interfaces and types |
| `@temi/config` | Shared ESLint and TypeScript configuration |

---

## Key Features

- **AI-Powered RAG Search** — Semantic search over blog posts and projects using Gemini embeddings stored in pgvector
- **3D Interactive Portfolio** — Three.js WebGL scenes throughout the site
- **Advanced Animations** — GSAP scroll animations + Framer Motion transitions
- **Technical Blog** — Full markdown rendering with code syntax highlighting
- **Real-Time Data Fetching** — TanStack Query with live blog and project data
- **Lead Capture & Admin Dashboard** — Public contact form feeding an admin-only dashboard to manage leads
- **Transactional Email** — Resend-powered notifications on new leads
- **Supabase File Storage** — Cloud-hosted media and project assets
- **JWT Auth** — Secure admin-only routes for the dashboard
- **Swagger API Docs** — Auto-generated REST API documentation at `/api/docs`
- **Error Monitoring** — Sentry integration across the API
- **Dark / Light Mode** — System-aware theming via next-themes
- **Monorepo Architecture** — Turborepo pipelines for fast, cached builds

---

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm v9+
- A PostgreSQL database (local or cloud)
- A Supabase project (for file storage)
- Google Gemini API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/TemitopeRekun/temi.dev.git
cd temi.dev

# Install all dependencies across the monorepo
pnpm install
```

### Environment Variables

**`apps/api/.env`** (based on `.env.example`):

```env
DATABASE_URL=your_postgresql_connection_string

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="Temitope <hello@temi.dev>"

# Auth
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@temi.dev
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-005

# Supabase Storage
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=uploads

# Error monitoring (Sentry) — leave empty to disable
SENTRY_DSN=
```

### Database Setup

```bash
# Generate Prisma client
pnpm --filter api prisma:generate

# Run migrations
pnpm --filter api prisma:migrate:dev

# (Optional) Backfill AI embeddings
pnpm --filter api backfill:embeddings
```

### Development

```bash
# Run all apps in parallel (Turborepo)
pnpm dev

# Run individual apps
pnpm --filter web dev     # Frontend on http://localhost:3000
pnpm --filter api dev     # Backend on http://localhost:4000 (Swagger at /api/docs)
```

### Build

```bash
pnpm build
```

---

## Deployment

| App | Platform |
|---|---|
| `web` | Vercel (recommended) |
| `api` | Railway / Render / any Node.js host |
| Database | Supabase / Neon / PlanetScale |
| File Storage | Supabase Storage |

---

## Author

**Temitope Ogunrekun** — Full-Stack Engineer

- Portfolio: [temi.dev](https://temi.dev)
- GitHub: [@TemitopeRekun](https://github.com/TemitopeRekun)
- LinkedIn: [temitope-ogunrekun](https://www.linkedin.com/in/temitope-ogunrekun-092736229/)
- X: [@_sireTemi](https://x.com/_sireTemi)

---

## License

This project is open source and available under the [MIT License](LICENSE).
