export default function LoadingWork() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 h-12 w-48 animate-pulse rounded-lg bg-(--surface)" />
      <div className="mb-16 h-6 max-w-2xl animate-pulse rounded-lg bg-(--surface)" />

      {/* Filter tabs */}
      <div className="mb-12 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-24 animate-pulse rounded-full bg-(--surface)"
          />
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-4/3 w-full animate-pulse rounded-2xl bg-(--surface)"
          />
        ))}
      </div>
    </div>
  );
}
