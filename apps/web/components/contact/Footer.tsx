"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import { AnimatedText } from "../common/AnimatedText";
import { RoundedButton } from "../common/RoundedButton";
import { MagneticWrapper } from "@temi/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContactForm, type LeadState } from "./ContactForm";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/TemitopeRekun" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

type Props = {
  action: (prev: LeadState, data: FormData) => Promise<LeadState>;
  defaultService?: string | null;
};

export function Footer({ action, defaultService = null }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [showBrief, setShowBrief] = useState(false);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [120, 90]);
  const curveRaw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const y = useSpring(yRaw, { stiffness: 80, damping: 20 });
  const x = useSpring(xRaw, { stiffness: 80, damping: 20 });
  const rotate = useSpring(rotateRaw, { stiffness: 80, damping: 20 });
  const curve = useSpring(curveRaw, { stiffness: 120, damping: 24 });

  const curveFill = useTransform(
    curve,
    [0, 1],
    [
      "M0,0 Q720,600 1440,0 L1440,0 L0,0 Z",
      "M0,0 Q720,0 1440,0 L1440,0 L0,0 Z",
    ],
  );
  const curveStroke = useTransform(
    curve,
    [0, 1],
    ["M0,0 Q720,600 1440,0", "M0,0 Q720,0 1440,0"],
  );

  useEffect(() => {
    if (!showBrief) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowBrief(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBrief]);

  return (
    <motion.footer
      ref={container}
      id="contact"
      className="relative mt-32 overflow-hidden text-white isolate"
      style={{
        backgroundColor: "color-mix(in oklab, var(--text) 15%, #000 85%)",
      }}
    >
      <motion.div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] z-10">
        <svg
          className="absolute inset-x-0 top-0 h-full w-full block"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <motion.path
            d={curveFill}
            style={{
              fill: "var(--bg)",
            }}
          />
          {/* This path creates the soft shadow effect just below the curve's edge */}
          <motion.path
            d={curveStroke}
            fill="none"
            stroke="black"
            strokeWidth="20"
            className="opacity-20"
            style={{ filter: "blur(10px)" }}
          />
          <motion.path
            d={curveStroke}
            fill="none"
            stroke="color-mix(in oklab, var(--bg) 80%, var(--text) 20%)"
            strokeWidth="2"
            className="opacity-70"
          />
        </svg>
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-(--accent)/25 blur-3xl" />
      </motion.div>

      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10"
      >
        <div className="border-b border-white/10 pb-12 sm:pb-16 relative">
          <div className="flex flex-col gap-6">
            <p className="text-white/60 uppercase tracking-[0.25em] text-xs">
              Contact
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center text-white/80 text-sm">
                TO
              </div>
              <h2 className="font-(--font-syne) text-[clamp(2.8rem,8vw,6rem)] font-light leading-none">
                Let's work
              </h2>
            </div>
            <h2 className="font-(--font-syne) text-[clamp(2.8rem,8vw,6rem)] font-light leading-none">
              together
            </h2>
          </div>

          <motion.div
            style={{ x }}
            className="mt-6 sm:mt-8 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:translate-y-1/2"
          >
            <RoundedButton
              accentColor="rgba(255,255,255,0.85)"
              className="border-white/30 text-white shadow-[0_10px_30px_rgba(255,255,255,0.18)] w-44 h-44 sm:w-48 sm:h-48 rounded-full"
              onClick={() => setShowBrief(true)}
            >
              Get in touch
            </RoundedButton>
          </motion.div>

          <motion.svg
            style={{ rotate }}
            width="14"
            height="14"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -right-2 sm:-right-6 top-6 opacity-70"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
              fill="currentColor"
            />
          </motion.svg>
        </div>

        <div className="my-10 sm:mt-12 flex flex-col gap-8">
          <div className="max-w-xl text-white/70 text-sm sm:text-base">
            <AnimatedText phrase="Whether you need a full-stack overhaul, an AI integration, or a mobile app—let's discuss how I can help you achieve your goals. Tell me about your product, and I'll respond with a clear plan." />
          </div>

          <div className="flex flex-wrap gap-4">
            <RoundedButton
              accentColor="rgba(255,255,255,0.12)"
              className="border-white/20 text-white"
              href="mailto:hello@temi.dev"
            >
              hello@temi.dev
            </RoundedButton>
            <RoundedButton
              accentColor="rgba(255,255,255,0.12)"
              className="border-white/20 text-white"
              onClick={() => setShowBrief(true)}
            >
              Start a Project
            </RoundedButton>
            <MagneticWrapper>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                View Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticWrapper>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 pt-8 border-t border-white/10 text-sm text-white/60">
          <div className="flex flex-wrap gap-10">
            <span>
              <p className="text-white/80 mb-1 font-medium">Version</p>
              <p>2026 (c) Edition</p>
            </span>
            <span>
              <p className="text-white/80 mb-1 font-medium">Location</p>
              <p>Lagos, NG</p>
            </span>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            {SOCIALS.map((s) => (
              <MagneticWrapper key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {s.label}
                </a>
              </MagneticWrapper>
            ))}
          </div>
        </div>
      </motion.div>

      {showBrief && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Project brief"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowBrief(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-(--surface) p-6 sm:p-8 text-(--text) shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-(--muted) text-xs uppercase tracking-[0.2em] mb-2">
                  Project brief
                </p>
                <p className="text-(--text) text-sm">
                  Share a few details and I’ll get back with a plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBrief(false)}
                className="rounded-full border border-(--border) px-3 py-1.5 text-xs text-(--muted) hover:text-(--text)"
              >
                Close
              </button>
            </div>
            <div className="mt-6">
              <ContactForm action={action} defaultService={defaultService} />
            </div>
          </div>
        </motion.div>
      )}
    </motion.footer>
  );
}
