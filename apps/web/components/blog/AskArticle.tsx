"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  articleId: string;
  articleTitle: string;
};

export function AskArticle({ articleId, articleTitle }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnswer("");

    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch(`${base}/api/rag/ask-article-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, question }),
        signal: abort.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to get AI response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream not available");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              accumulated += parsed.text;
              setAnswer(accumulated);
            }
          } catch {}
        }
      }
    } catch (err) {
      if (abort.signal.aborted) return;
      if (process.env.NODE_ENV !== "production") console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "AI service is currently unavailable. Please try again later.",
      );
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="my-16 rounded-3xl border border-(--accent)/20 bg-(--accent)/5 p-8">
      <div className="mb-6 flex items-center gap-2 text-(--accent)">
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-medium uppercase tracking-wider">
          Ask this article
        </span>
      </div>

      <h3 className="mb-4 text-xl font-bold text-(--text)">
        Have a question about "{articleTitle}"?
      </h3>

      <p className="mb-6 text-(--muted)">
        Our AI can answer specific questions based on the content of this
        article.
      </p>

      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What is the main takeaway?"
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

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {answer && (
        <div
          className="prose prose-sm prose-invert max-w-none rounded-xl bg-(--surface) p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 leading-6 prose-p:my-5 prose-li:my-3 prose-ul:my-5 prose-ol:my-5 prose-blockquote:my-5 prose-pre:my-5 prose-pre:rounded-xl prose-pre:border prose-pre:border-(--border)/30 prose-pre:bg-(--surface2) prose-pre:p-4 prose-code:rounded prose-code:bg-(--surface2)/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
