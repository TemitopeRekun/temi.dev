"use client";

import { useState } from "react";
import { Container, Section, RevealOnScroll } from "@temi/ui";
import { AnimatedText } from "../common/AnimatedText";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "What is your tech stack?",
    answer:
      "I specialize in the React ecosystem (Next.js, React Native) and Node.js (NestJS). For databases, I use PostgreSQL with Prisma. I also integrate AI using Gemini/OpenAI and automate workflows with various tools.",
  },
  {
    question: "Do you work with existing teams?",
    answer:
      "Yes. I can join as a fractional lead engineer or individual contributor to help unblock complex features, refactor legacy code, or set up best practices.",
  },
  {
    question: "How do you charge?",
    answer:
      "I offer both project-based pricing (for well-defined scopes) and monthly retainers (for ongoing development and consulting). Contact me to discuss what fits your needs.",
  },
  {
    question: "What about post-launch support?",
    answer:
      "I provide a 30-day warranty period for bug fixes after launch. For long-term maintenance, I offer retainer packages to keep your system updated and secure.",
  },
];

export function ServiceFAQ() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <RevealOnScroll>
            <div>
              <h2 className="sr-only">FAQ</h2>
              <AnimatedText
                phrase="Common Questions"
                className="text-3xl font-semibold tracking-tight text-(--text) sm:text-4xl"
              />
              <p className="mt-4 text-(--muted)">
                Can’t find what you’re looking for?{" "}
                <a
                  href="mailto:email@temi.dev"
                  className="text-(--text) underline decoration-(--accent) underline-offset-4"
                >
                  Email me
                </a>
                .
              </p>
            </div>
          </RevealOnScroll>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border)/30 bg-(--surface)/50 transition-colors hover:border-(--border)">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-(--text)">{question}</span>
        <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center text-(--muted)">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-6 pt-0 text-(--muted) leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}
