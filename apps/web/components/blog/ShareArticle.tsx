"use client";

import { useState } from "react";
import { Linkedin, Link, Check } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type Props = {
  slug: string;
  title: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://temi.dev";

export function ShareArticle({ slug, title }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${slug}`;

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm font-medium uppercase tracking-wider text-(--muted)">
        Share this article
      </p>
      <div className="flex gap-3">
        <button
          onClick={shareTwitter}
          className="flex size-10 items-center justify-center rounded-xl border border-(--border)/20 bg-(--surface2)/50 text-(--muted) transition-all hover:border-(--accent)/30 hover:bg-(--accent)/10 hover:text-(--accent)"
          aria-label="Share on X"
        >
          <XIcon className="h-4 w-4" />
        </button>
        <button
          onClick={shareLinkedin}
          className="flex size-10 items-center justify-center rounded-xl border border-(--border)/20 bg-(--surface2)/50 text-(--muted) transition-all hover:border-(--accent)/30 hover:bg-(--accent)/10 hover:text-(--accent)"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          onClick={copyLink}
          className="flex size-10 items-center justify-center rounded-xl border border-(--border)/20 bg-(--surface2)/50 text-(--muted) transition-all hover:border-(--accent)/30 hover:bg-(--accent)/10 hover:text-(--accent)"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
