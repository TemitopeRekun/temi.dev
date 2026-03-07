"use client";

import { useState } from "react";
import { Container, Section, RevealOnScroll } from "@temi/ui";
import { Sparkles, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AnimatedText } from "../common/AnimatedText";

export function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const base =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

      // Basic validation for API URL
      if (!base) {
        throw new Error("API configuration missing");
      }

      const res = await fetch(`${base}/api/rag/ask-website`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        // Try to get error message from response
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to get AI response");
      }

      const data = await res.json();
      if (!data.answer) {
        throw new Error("No answer received from AI");
      }
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "AI service is currently unavailable. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-12 border-t border-(--border)/10 bg-(--surface)/50">
      <Container>
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-center gap-2 text-(--accent)">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Ask AI
              </span>
            </div>

            <AnimatedText
              phrase="Ask my Digital Brain"
              className="mb-4 text-center text-2xl font-bold text-(--text) md:text-3xl"
            />
            
            <p className="mb-8 text-center text-(--muted) text-sm md:text-base">
              I've trained this AI on my blog posts and projects. You can ask about my specific work, 
              or general software engineering questions, career advice, and technical concepts.
            </p>

            <form onSubmit={handleSubmit} className="relative mb-8">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How do I become a senior engineer? What is RAG? Tell me about your stack..."
                className="w-full rounded-2xl border border-(--border) bg-(--bg) p-4 pr-12 text-base md:text-sm text-(--text) shadow-sm transition-all focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute right-2 top-2 rounded-xl p-2 text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--accent) disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>

            {answer && (
              <div className="rounded-2xl border border-(--accent)/20 bg-(--accent)/5 p-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-(--accent)">
                  <Sparkles className="h-4 w-4" />
                  AI Response
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-(--text)">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
