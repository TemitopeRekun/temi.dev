"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "../../lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Route } from "next";

let registered = false;
function ensureRegister() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

type NavHref = Route | { pathname: Route; hash?: string };
type NavLink = { href: NavHref; label: string };

const LINKS: ReadonlyArray<NavLink> = [
  { href: { pathname: "/" as Route, hash: "work" }, label: "Work" },
  { href: "/about" as Route, label: "About" },
  { href: "/blog" as Route, label: "Blog" },
  { href: "/services" as Route, label: "Services" },
  { href: { pathname: "/" as Route, hash: "contact" }, label: "Contact" }
] as const;

export function Navbar() {
  const ref = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = useMemo(
    () => (resolvedTheme ?? theme) === "dark",
    [resolvedTheme, theme],
  );

  useEffect(() => {
    ensureRegister();
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const setup = () => {
      const ctx = gsap.context(() => {
        const st = ScrollTrigger.create({
          start: "top top",
          end: () => document.body.scrollHeight,
          onUpdate: (self) => {
            const active = self.scroll() > 8;
            el.dataset.glass = active ? "true" : "false";
          },
        });
        return () => st.kill();
      }, el);
      return () => ctx.revert();
    };
    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      },
      () => {
        const teardown = setup();
        return () => teardown();
      },
    );
    return () => {
      mm.kill();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header
      ref={ref}
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,backdrop-filter,border-color] duration-300",
        "data-[glass=true]:bg-(--glass-bg) data-[glass=true]:backdrop-blur-md",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-(--text) font-(--font-syne) text-lg">
          TO
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-(--text)/80 hover:text-(--text) transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current"
          >
            <span className="sr-only">Toggle theme</span>
            <span aria-hidden className="inline-block">
              {isDark ? (
                // Sun icon
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 4.5a1 1 0 0 0 1-1V2a1 1 0 1 0-2 0v1.5a1 1 0 0 0 1 1ZM5.636 6.05a1 1 0 0 0 0-1.414L4.573 3.573a1 1 0 1 0-1.414 1.414l1.063 1.063a1 1 0 0 0 1.414 0ZM4.5 13a1 1 0 1 0 0-2H3a1 1 0 1 0 0 2h1.5Zm15.5 0a1 1 0 1 0 0-2H18.5a1 1 0 1 0 0 2H20ZM19.95 6.05a1 1 0 0 0 1.414-1.414L20.3 3.573a1 1 0 0 0-1.414 1.414l1.063 1.063ZM12 21.5a1 1 0 0 0-1 1V24a1 1 0 1 0 2 0v-1.5a1 1 0 0 0-1-1Zm-7.427-1.123a1 1 0 0 0 1.414 0l1.063-1.063a1 1 0 1 0-1.414-1.414L4.573 18.963a1 1 0 0 0 0 1.414ZM19.427 20.377a1 1 0 0 0 1.414-1.414l-1.063-1.063a1 1 0 0 0-1.414 1.414l1.063 1.063ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.507 5.507 0 0 1 12 6.5Z" />
                </svg>
              ) : (
                // Moon icon
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                </svg>
              )}
            </span>
          </button>
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-current"
        >
          <span className="sr-only">Open menu</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden">
          <div className="mx-4 rounded-2xl border border-current bg-(--glass-bg) backdrop-blur-md p-4">
            <div className="flex items-center justify-between">
              <span className="text-(--text) font-(--font-syne)">
                Menu
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current"
              >
                <span className="sr-only">Close</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-(--text) hover:bg-(--surface)/50"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-current px-3 py-2"
              >
                <span>Toggle theme</span>
                <span aria-hidden>{isDark ? "☀︎" : "☾"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
