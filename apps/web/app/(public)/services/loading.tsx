export default function LoadingServices() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-24 text-center">
        <div className="mx-auto mb-6 h-4 w-32 animate-pulse rounded bg-(--surface)" />
        <div className="mx-auto mb-6 h-16 w-3/4 max-w-2xl animate-pulse rounded-lg bg-(--surface)" />
        <div className="mx-auto h-4 w-full max-w-lg animate-pulse rounded bg-(--surface)" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 w-full animate-pulse rounded-2xl bg-(--surface)" />
        ))}
      </div>
      
      {/* Process Steps */}
      <div className="mt-32">
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded bg-(--surface)" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-(--surface)" />
          ))}
        </div>
      </div>
    </div>
  );
}
