"use client";

import { useState } from "react";
import { Container, RevealOnScroll, Section, Button } from "@temi/ui";
import { AnimatedText } from "../common/AnimatedText";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setEmail("");
  };

  return (
    <Section className="bg-(--surface) py-16 md:py-24 border-y border-(--border)/10">
      <Container>
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <AnimatedText
              phrase="Stay in the loop"
              className="mb-4 text-3xl font-bold text-(--text) md:text-4xl"
            />
            <p className="mb-8 text-lg text-(--muted)">
              Get the latest insights on AI, web development, and system
              architecture delivered straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="relative mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-(--border) bg-(--bg) px-6 py-3 text-base md:text-sm text-(--text) placeholder:text-(--muted)/50 focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)"
              />
              <Button
                type="submit"
                disabled={status === "loading" || status === "success"}
              >
                {status === "loading"
                  ? "Subscribing..."
                  : status === "success"
                    ? "Subscribed!"
                    : "Subscribe"}
              </Button>
            </form>
            {status === "success" && (
              <p className="mt-4 text-sm text-green-500 animate-fade-in">
                Thanks for subscribing! Check your inbox for confirmation.
              </p>
            )}
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
