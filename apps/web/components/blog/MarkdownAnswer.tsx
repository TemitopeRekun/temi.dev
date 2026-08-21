"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/**
 * Renders a streamed AI answer as markdown.
 *
 * Split into its own module so `AskAI` and `AskArticle` can pull it in with
 * `next/dynamic`. Both are client components, so importing `react-markdown` and
 * `rehype-highlight` directly put highlight.js — the full language set — into
 * the initial bundle of `/blog` and every article, roughly tripling their First
 * Load JS to syntax-highlight answers most visitors never request.
 *
 * Highlighting is kept rather than dropped: answers do contain code, and inside
 * a lazily-loaded chunk it costs nothing until an answer exists. Pair the
 * `dynamic()` call with `preloadMarkdownAnswer()` on submit so the chunk
 * downloads alongside the API request instead of after it.
 */
export default function MarkdownAnswer({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
      {children}
    </ReactMarkdown>
  );
}
