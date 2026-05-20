import Link from "next/link";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { ContactForm } from "../../../components/contact/ContactForm";
import { createLeadAction } from "../../../actions/create-lead";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Contact — Temitope Ogunrekun",
  description:
    "Currently open to remote mid-level full-stack or backend roles. Get in touch.",
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
                <h1 className="sr-only">Let’s connect</h1>
                <AnimatedText
                  phrase="Let’s connect"
                  className="text-3xl font-semibold text-(--text)"
                />
                <p className="mt-3 text-(--muted)">
                  I’m currently open to remote mid-level full-stack or backend
                  roles. If you’re hiring or just want to talk engineering, I’d
                  like to hear from you. I reply within a day or two.
                </p>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="text-(--text)">hello@temi.dev</div>
                  <div className="flex items-center gap-4">
                    <Link
                      href="https://github.com/TemitopeRekun"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      GitHub
                    </Link>
                    <Link
                      href="https://www.linkedin.com/in/temitope-ogunrekun-092736229/"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      LinkedIn
                    </Link>
                    <Link
                      href="https://x.com/_sireTemi"
                      className="text-(--muted) underline-offset-4 hover:underline"
                    >
                      Twitter
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
