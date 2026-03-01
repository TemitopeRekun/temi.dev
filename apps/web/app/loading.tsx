export default function Loading() {
  return (
    <div className="px-4 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-(--surface)" />
        <div className="h-5 w-1/2 animate-pulse rounded-lg bg-(--surface)" />
        <div className="h-64 animate-pulse rounded-2xl bg-(--surface)" />
      </div>
    </div>
  );
}

