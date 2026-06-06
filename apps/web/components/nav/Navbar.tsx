"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "../../lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FullscreenNav } from "./FullscreenNav";
import { MagneticWrapper } from "@temi/ui";

let registered = false;
function ensureRegister() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

import type { Route } from "next";

function NavLinkItem<T extends string>({ href, label }: { href: Route<T>; label: string }) {
  const circle = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const tid = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(circle.current, { top: "-25%", width: "150%", duration: 0.25, ease: "power2.inOut" }, "enter")
      .to(circle.current, { top: "-150%", width: "125%", duration: 0.15 }, "exit");
    return () => { timeline.current?.kill(); };
  }, []);

  const onEnter = () => {
    if (tid.current) clearTimeout(tid.current);
    timeline.current?.tweenFromTo("enter", "exit");
  };
  const onLeave = () => {
    tid.current = setTimeout(() => timeline.current?.play(), 300);
  };

  return (
    <MagneticWrapper>
      <Link
        href={href}
        prefetch={true}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative inline-flex items-center justify-center px-4 py-2 rounded-full overflow-hidden text-sm text-(--text)/70 transition-colors hover:text-[#0C0B0A] group"
      >
        <span className="relative z-10 font-medium">{label}</span>
        <div
          ref={circle}
          className="absolute w-full h-[150%] rounded-full top-full left-1/2 -translate-x-1/2 pointer-events-none bg-(--accent)"
        />
      </Link>
    </MagneticWrapper>
  );
}

export function Navbar() {
  const ref = useRef<HTMLElement | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = useMemo(
    () => (resolvedTheme ?? theme) === "dark",
    [resolvedTheme, theme],
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ensureRegister();
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top top",
        end: () => document.body.scrollHeight,
        onUpdate: (self) => {
          el.dataset.glass = self.scroll() > 8 ? "true" : "false";
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <header
        ref={ref}
        className={[
          "absolute inset-x-0 top-0 z-50",
          "transition-[background-color,backdrop-filter,border-color] duration-300",
          "data-[glass=true]:bg-(--glass-bg) data-[glass=true]:backdrop-blur-md",
        ].join(" ")}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            prefetch={true}
            className="z-201 rounded-lg overflow-hidden"
          >
            <Image src="/icon" width={32} height={32} alt="Temitope Ogunrekun" />
          </Link>

          {/* Desktop links — hidden on mobile (burger covers all) */}
          <div className="hidden items-center gap-8 md:flex">
            {(
              [
                { href: "/", label: "Home" },
                { href: "/work", label: "Work" },
                { href: "/about", label: "About" },
                { href: "/stack" as Route, label: "Stack" },
                { href: "/blog", label: "Blog" },
              ] as const
            ).map((l) => (
              <NavLinkItem key={l.label} href={l.href} label={l.label} />
            ))}

            {/* Theme toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current text-(--text)"
            >
              <span aria-hidden>
                {mounted ? (
                  isDark ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4.5a1 1 0 001-1V2a1 1 0 10-2 0v1.5a1 1 0 001 1ZM5.636 6.05a1 1 0 000-1.414L4.573 3.573a1 1 0 10-1.414 1.414l1.063 1.063a1 1 0 001.414 0ZM4.5 13a1 1 0 100-2H3a1 1 0 100 2h1.5zm15.5 0a1 1 0 100-2H18.5a1 1 0 100 2H20ZM19.95 6.05a1 1 0 001.414-1.414L20.3 3.573a1 1 0 00-1.414 1.414l1.063 1.063ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.507 5.507 0 0 1 12 6.5Z" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                    </svg>
                  )
                ) : (
                  <span className="block h-4 w-4" />
                )}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Awwwards fullscreen nav with burger */}
      <FullscreenNav />
    </>
  );
}
