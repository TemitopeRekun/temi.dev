"use client";
import { useActionState, useEffect } from "react";
import { StaggerReveal } from "@temi/ui";

export type LeadState = { ok: true } | { ok: false; error: string } | null;

type Props = {
  action: (prev: LeadState, data: FormData) => Promise<LeadState>;
  defaultService?: string | null;
};

export function ContactForm({ action, defaultService }: Props) {
  const [state, formAction, pending] = useActionState<LeadState, FormData>(
    action,
    null,
  );
  useEffect(() => {
    const t = setTimeout(() => {}, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <StaggerReveal>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-(--border,rgba(0,0,0,0.08)) bg-(--bg) px-3 py-2 text-(--text)"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-(--border,rgba(0,0,0,0.08)) bg-(--bg) px-3 py-2 text-(--text)"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">Service</label>
            <select
              name="service"
              defaultValue={defaultService ?? ""}
              className="w-full rounded-xl border border-(--border,rgba(0,0,0,0.08)) bg-(--bg) px-3 py-2 text-(--text)"
            >
              <option value="">Select a service</option>
              <option>Full-Stack Development</option>
              <option>AI Automation</option>
              <option>Mobile Engineering</option>
              <option>Freelance/Consulting</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-(--muted)">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full rounded-xl border border-(--border,rgba(0,0,0,0.08)) bg-(--bg) px-3 py-2 text-(--text)"
              placeholder="Tell me about your project..."
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={pending}
              className={[
                "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                "bg-(--accent) text-white border border-transparent",
                pending ? "opacity-70" : "hover:opacity-95 active:opacity-90",
              ].join(" ")}
            >
              {pending ? "Sending..." : "Send message"}
            </button>
          </div>
        </StaggerReveal>
      </form>

      <div
        data-visible={Boolean(state)}
        className={[
          "mt-4 rounded-xl border border-(--border,rgba(0,0,0,0.08)) p-3 text-sm transition-all",
          !state
            ? "opacity-0 translate-y-1 pointer-events-none"
            : "opacity-100 translate-y-0",
          state?.ok
            ? "bg-(--surface) text-(--text)"
            : "bg-(--surface) text-red-500",
        ].join(" ")}
      >
        {state?.ok && "Thanks! Your message has been received."}
        {!state?.ok && state && state.error}
      </div>

      <style jsx>{`
        div[data-visible="true"] {
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
