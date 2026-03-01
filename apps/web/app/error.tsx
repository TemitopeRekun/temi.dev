"use client";
export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-4 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-semibold text-(--text)">Something went wrong</h1>
        <p className="mt-2 text-(--muted)">
          An unexpected error occurred. You can try again.
        </p>
        <button
          type="button"
          onClick={props.reset}
          className="mt-6 inline-flex rounded-full border border-(--border) px-5 py-2.5 text-sm text-(--text) hover:bg-(--surface)"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

