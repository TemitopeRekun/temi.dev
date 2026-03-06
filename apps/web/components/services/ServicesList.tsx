"use client";
import { useEffect, useState } from "react";
import { StaggerReveal } from "@temi/ui";
import { TiltCard } from "./TiltCard";
import { ContactForm, type LeadState } from "../contact/ContactForm";
import { SERVICES } from "../../lib/services-data";

type Props = {
  action: (prev: LeadState, data: FormData) => Promise<LeadState>;
};

export function ServicesList({ action }: Props) {
  const [showBrief, setShowBrief] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (!showBrief) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowBrief(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBrief]);

  const openBrief = (service: string) => {
    setSelectedService(service);
    setShowBrief(true);
  };

  return (
    <>
      <StaggerReveal className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {SERVICES.map((s) => (
          <TiltCard key={s.key}>
            <div className="group rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--bg) text-(--text)">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-(--text)">
                    {s.title}
                  </h3>
                </div>
                <span className="text-sm text-(--muted)">{s.price}</span>
              </div>
              <p className="mt-3 text-(--muted)">{s.description}</p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => openBrief(s.title)}
                  className="inline-flex rounded-full border border-current px-4 py-2 text-sm text-(--text) hover:bg-(--surface)/60 transition-colors"
                >
                  Book Now →
                </button>
              </div>
            </div>
          </TiltCard>
        ))}
      </StaggerReveal>

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
          <div className="relative w-full max-w-xl rounded-3xl border border-(--border) bg-(--surface) p-6 sm:p-8 text-(--text) shadow-2xl">
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
              <ContactForm
                action={action}
                defaultService={selectedService}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
