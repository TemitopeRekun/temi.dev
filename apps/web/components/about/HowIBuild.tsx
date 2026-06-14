"use client";
import { RevealOnScroll } from "@temi/ui";
import {
  Workflow,
  Repeat,
  Clock,
  Layers,
  Gauge,
  MonitorSmartphone,
} from "lucide-react";
import { TextReveal } from "../common/TextReveal";

const PRINCIPLES = [
  {
    title: "Server-enforced state machines",
    description:
      "Complex lifecycles modelled as state machines the server owns, so no two clients can ever disagree on where things stand.",
    icon: Workflow,
  },
  {
    title: "Idempotent by default",
    description:
      "Mutation flows that survive retries, timeouts, and dropped connections without double-charging or duplicating work.",
    icon: Repeat,
  },
  {
    title: "Snapshot at write time",
    description:
      "Time-sensitive data frozen the moment it's created, so a later read never drifts from what the user actually saw.",
    icon: Clock,
  },
  {
    title: "Failure off the critical path",
    description:
      "Queues and background workers isolate slow or flaky third parties, so their bad day never becomes the user's.",
    icon: Layers,
  },
  {
    title: "Built for load",
    description:
      "High-frequency writes accumulated in memory and settled in batches, so traffic spikes don't turn into write storms.",
    icon: Gauge,
  },
  {
    title: "Frontends that match the backend",
    description:
      "Optimistic UI, offline-tolerant state, and real-time views that stay in sync across reconnects — type-safe and sharing contracts with the API.",
    icon: MonitorSmartphone,
  },
];

export function HowIBuild() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-16 max-w-2xl">
        <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
          <TextReveal text="How I Build" type="chars" />
        </div>
        <RevealOnScroll>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-(--text) mb-6">
            I think in systems, not screens.
          </h2>
          <p className="text-base sm:text-lg text-(--muted) leading-relaxed">
            Owning products end to end taught me that the interesting problems
            are rarely the features — they're what happens when the network
            drops, a payment retries, or two clients race for the same state. A
            few principles I keep coming back to:
          </p>
        </RevealOnScroll>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {PRINCIPLES.map((principle) => {
          const Icon = principle.icon;
          return (
            <RevealOnScroll key={principle.title}>
              <div className="group relative h-full rounded-2xl border border-(--border) bg-(--surface) p-6 transition-colors duration-300 hover:border-(--accent)/40">
                <div
                  className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-(--accent) opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10"
                  aria-hidden="true"
                />
                <Icon
                  className="h-9 w-9 text-(--accent) mb-5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="text-lg font-semibold text-(--text) mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-(--muted) leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>

      <RevealOnScroll>
        <p className="mt-12 max-w-3xl text-base sm:text-lg text-(--muted) leading-relaxed">
          And I treat everything I own as production from day one — real auth,
          rate limiting, CI gates on type errors and tests, infrastructure
          that's reproducible across environments, and documentation of the
          architecture so the next engineer isn't guessing how it fits together.
          People use software in ways
          you never intended — the double-tap, the dropped connection, the
          half-finished payment — so it isn't enough that the happy path works.{" "}
          <span className="text-(--text)">
            I build for the edges, because that's where users actually live.
          </span>
        </p>
      </RevealOnScroll>
    </div>
  );
}
