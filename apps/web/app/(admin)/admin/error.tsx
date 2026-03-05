"use client";
import { AnimatedText } from "../../../../components/common/AnimatedText";
export default function ErrorAdmin(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="sr-only">Admin error</h1>
        <AnimatedText
          phrase="Admin error"
          className="text-xl font-semibold text-(--text)"
        />
        <p className="mt-2 text-(--muted)">
          Something went wrong in the dashboard.
        </p>
        <button
          type="button"
          onClick={props.reset}
          className="mt-5 inline-flex rounded border border-(--border) px-4 py-2 text-sm text-(--text) hover:bg-(--surface)"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
