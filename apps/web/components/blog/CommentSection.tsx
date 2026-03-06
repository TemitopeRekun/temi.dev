"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MessageSquare, Send } from "lucide-react";
import { Comment } from "../../lib/blog";
import { addCommentAction } from "../../app/(public)/blog/actions";
import { AnimatedText } from "../common/AnimatedText";

type Props = {
  slug: string;
  comments: Comment[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute right-2 top-2 rounded-xl p-2 text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--accent) disabled:opacity-50"
    >
      <Send className="h-5 w-5" />
    </button>
  );
}

export function CommentSection({ slug, comments }: Props) {
  const [state, formAction] = useActionState(addCommentAction, {
    success: false,
  });

  return (
    <div id="comments" className="mx-auto max-w-3xl pt-16">
      <div className="mb-8 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-(--accent)" />
        <h2 className="text-2xl font-bold text-(--text)">
          Comments ({comments.length})
        </h2>
      </div>

      <div className="mb-12">
        <form action={formAction} className="relative mb-4">
          <input type="hidden" name="slug" value={slug} />
          <textarea
            name="content"
            placeholder="Share your thoughts..."
            required
            className="w-full rounded-2xl border border-(--border) bg-(--bg) p-4 pr-12 text-base text-(--text) shadow-sm transition-all focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent) min-h-[100px] resize-y"
          />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <input
              type="text"
              name="author"
              placeholder="Name (optional)"
              className="w-full rounded-lg border border-(--border) bg-(--bg) px-3 py-2 text-base sm:w-1/3 sm:mr-auto"
            />
            <div className="flex justify-end sm:contents">
              <SubmitButton />
            </div>
          </div>
        </form>
        {state?.message && (
          <p
            className={`text-sm ${state.success ? "text-green-500" : "text-red-500"}`}
          >
            {state.message}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-(--muted)">Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-(--border)/40 bg-(--surface) p-6 transition-all hover:border-(--accent)/20"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-(--text)">
                  {comment.author || "Anonymous"}
                </span>
                <span className="text-xs text-(--muted)">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-(--muted)">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
