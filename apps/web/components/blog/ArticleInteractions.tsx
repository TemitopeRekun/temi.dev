"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { likePostAction } from "../../app/(public)/blog/actions";

type Props = {
  slug: string;
  likeCount: number;
};

export function ArticleInteractions({ slug, likeCount }: Props) {
  const [likes, setLikes] = useState(likeCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    if (hasLiked || isPending) return;

    // Optimistic update
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    setIsPending(true);

    try {
      await likePostAction(slug);
    } catch {
      // Rollback
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } finally {
      setIsPending(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to copy link
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const scrollToComments = () => {
    const commentsSection = document.getElementById("comments");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-(--border) bg-(--surface)/80 p-2 shadow-lg backdrop-blur-md transition-all hover:scale-105 md:bottom-12">
      <button
        onClick={handleLike}
        disabled={hasLiked}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          hasLiked
            ? "bg-red-500/10 text-red-500"
            : "text-(--muted) hover:bg-(--accent)/10 hover:text-(--accent)"
        }`}
      >
        <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </button>

      <div className="h-4 w-px bg-(--border)" />

      <button
        onClick={scrollToComments}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-(--muted) transition-colors hover:bg-(--accent)/10 hover:text-(--accent)"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Comment</span>
      </button>

      <div className="h-4 w-px bg-(--border)" />

      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-(--muted) transition-colors hover:bg-(--accent)/10 hover:text-(--accent)"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
