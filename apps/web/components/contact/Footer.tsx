"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import { AnimatedText } from "../common/AnimatedText";
import { RoundedButton } from "../common/RoundedButton";
import { MagneticWrapper } from "@temi/ui";
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
  const curveRaw = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const y = useSpring(yRaw, { stiffness: 80, damping: 20 });
  const x = useSpring(xRaw, { stiffness: 80, damping: 20 });
  const rotate = useSpring(rotateRaw, { stiffness: 80, damping: 20 });
  const curve = useSpring(curveRaw, { stiffness: 120, damping: 24 });

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
      className="relative mt-32 overflow-hidden rounded-t-3xl text-white"
      style={{
        y,
        backgroundColor: "color-mix(in oklab, var(--text) 15%, #000 85%)",
      }}
    >
      <motion.div
        style={{ scaleY: curve, originY: 0 }}
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
      >
        <svg
          className="absolute inset-x-0 top-0 h-full w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 C240,10 480,10 720,90 C960,170 1200,170 1440,90 L1440,0 L0,0 Z"
            fill="var(--bg)"
          />
          <path
            d="M0,90 C240,10 480,10 720,90 C960,170 1200,170 1440,90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mix-blend-difference opacity-70"
          />
        </svg>
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-(--accent)/25 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-white/60 uppercase tracking-[0.25em] text-xs mb-4">
                Contact
              </p>
              <h2 className="font-(--font-syne) text-[clamp(3rem,9vw,7rem)] font-light leading-none">
                Let's work
              </h2>
              <h2 className="font-(--font-syne) text-[clamp(3rem,9vw,7rem)] font-light leading-none">
                together
              </h2>
            </div>
            <motion.svg
              style={{ rotate }}
              width="12"
              height="12"
              viewBox="0 0 9 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 self-start sm:self-auto opacity-70"
            >
              <path
                d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
                fill="currentColor"
              />
            </motion.svg>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-xl text-white/70 text-sm sm:text-base">
              <AnimatedText phrase="Tell me about your product, your timeline, and the problem you want to solve. I'll respond with a clear plan and next steps." />
            </div>
            <motion.div style={{ x }} className="shrink-0">
              <RoundedButton
                accentColor="rgba(255,255,255,0.8)"
                className="border-white/30 text-white shadow-[0_10px_30px_rgba(255,255,255,0.18)]"
                onClick={() => setShowBrief(true)}
              >
                Get in touch
              </RoundedButton>
            </motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-3">
                Email
              </p>
              <RoundedButton
                accentColor="rgba(255,255,255,0.12)"
                className="border-white/20 text-white w-full justify-center"
                href="mailto:hello@temi.dev"
              >
                hello@temi.dev
              </RoundedButton>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-3">
                Availability
              </p>
              <RoundedButton
                accentColor="rgba(255,255,255,0.12)"
                className="border-white/20 text-white w-full justify-center"
                onClick={() => setShowBrief(true)}
              >
                Available for work
              </RoundedButton>
            </div>
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
      </div>

      {showBrief && (
        <div
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
        </div>
      )}
    </motion.footer>
  );
}
