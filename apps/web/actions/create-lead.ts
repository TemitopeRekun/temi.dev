"use server";

import type { LeadInput } from "@temi/types";

export type LeadState = { ok: true } | { ok: false; error: string } | null;

export async function createLeadAction(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  // Honeypot: real users never fill this hidden field. If it has a value the
  // submission is almost certainly a bot — accept it silently (so the bot does
  // not learn it was filtered) without persisting anything.
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { ok: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const service = formData.get("service")
    ? String(formData.get("service"))
    : null;

  if (!name || !email || !message) {
    return { ok: false, error: "Please complete all required fields." };
  }

  // Typed against the shared LeadInput contract so the web payload and the
  // API's CreateLeadDto stay in lockstep.
  const payload: LeadInput = { name, email, message, service };

  try {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";

    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, error: "Failed to submit. Please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again later." };
  }
}
