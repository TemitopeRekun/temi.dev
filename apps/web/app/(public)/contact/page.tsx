import Link from "next/link";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { ContactForm } from "../../../components/contact/ContactForm";
import { createLeadAction } from "../../../actions/create-lead";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Contact — Temitope Ogunrekun",
  description: "Start a project: web, AI automation, or mobile engineering.",
  path: "/contact",
  image: "https://picsum.photos/1200/630?seed=contact-og",
});

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
                <h1 className="sr-only">Let’s talk</h1>
                <AnimatedText
                  phrase="Let’s talk"
                  className="text-3xl font-semibold text-(--text)"
                />
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

            <div>
              <ContactForm
                action={createLeadAction}
                defaultService={serviceParam}
              />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
