"use client";
export default function ErrorPublic(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="px-4 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-semibold text-(--text)">Page error</h1>
        <p className="mt-2 text-(--muted)">
          We couldn’t load this page. Please try again.
        </p>
        <button
          type="button"
          onClick={props.reset}
          className="mt-6 inline-flex rounded-full border border-(--border) px-5 py-2.5 text-sm text-(--text) hover:bg-(--surface)"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
