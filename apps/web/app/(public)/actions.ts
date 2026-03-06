"use server";
import type { LeadState } from "../../components/contact/ContactForm";

export async function createLeadAction(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const service = formData.get("service")
    ? String(formData.get("service"))
    : null;

  if (!name || !email || !message) {
    return { ok: false, error: "Please complete all required fields." };
  }

  try {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";
    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, service }),
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
