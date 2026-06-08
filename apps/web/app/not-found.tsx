import Link from "next/link";
import type { Route } from "next";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-(--bg) px-4 text-center"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 30% 40%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 65%),
            radial-gradient(ellipse 50% 45% at 75% 65%, color-mix(in oklab, var(--accent2) 10%, transparent), transparent 60%)
          `,
        }}
      />

      <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-(--accent)">
        404
      </p>

      <h1 className="font-(family-name:--font-fraunces) text-[clamp(4rem,18vw,10rem)] leading-none tracking-tight text-(--text)">
        Lost.
      </h1>

      <p className="mt-6 max-w-sm text-base text-(--muted)">
        This page doesn't exist — or it did once and it's gone now.
      </p>

      <Link
        href={"/" as Route}
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface2)/60 px-6 py-3 text-sm font-medium text-(--text) backdrop-blur-sm transition-all hover:border-(--accent) hover:text-(--accent)"
      >
        ← Back home
      </Link>
    </main>
  );
}
