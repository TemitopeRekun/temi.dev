import Link from "next/link";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import {
  ContactForm,
  type LeadState,
} from "../../../components/contact/ContactForm";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Contact — Temitope Ogunrekun",
  description: "Start a project: web, AI automation, or mobile engineering.",
  path: "/contact",
  image: "https://picsum.photos/1200/630?seed=contact-og",
});

async function createLeadAction(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  "use server";
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

export default async function ContactPage(props: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const sp = (await props.searchParams) ?? {};
  const serviceParam = (() => {
    const q = sp.service;
    return Array.isArray(q) ? q[0] : (q ?? null);
  })();
  return (
    <main>
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <RevealOnScroll>
              <div>
                <h1 className="text-3xl font-semibold text-(--text)">
                  Let’s talk
                </h1>
                <p className="mt-3 text-(--muted)">
                  Share a bit about your goals. I’ll reply within 1–2 business
                  days.
                </p>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="text-(--text)">email@temi.dev</div>
                  <div className="flex items-center gap-4">
                    <Link
                      href="#"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      GitHub
                    </Link>
                    <Link
                      href="#"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      LinkedIn
                    </Link>
                    <Link
                      href="#"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      Twitter
                    </Link>
                    <Link
                      href="#"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      Upwork
                    </Link>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
                <ContactForm
                  action={createLeadAction}
                  defaultService={serviceParam}
                />
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>
    </main>
  );
}
