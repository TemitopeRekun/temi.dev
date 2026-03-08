export default function LoadingAbout() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-8">
          <div className="h-4 w-24 animate-pulse rounded bg-(--surface)" />
          <div className="h-20 w-3/4 animate-pulse rounded-lg bg-(--surface)" />
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-(--surface)" />
            <div className="h-4 w-[90%] animate-pulse rounded bg-(--surface)" />
            <div className="h-4 w-[95%] animate-pulse rounded bg-(--surface)" />
          </div>
        </div>
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-(--surface)" />
      </div>

      {/* Timeline section */}
      <div className="mt-32 space-y-12">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-(--surface)" />
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-8">
              <div className="hidden w-24 flex-none pt-2 md:block">
                <div className="h-4 w-16 animate-pulse rounded bg-(--surface)" />
              </div>
              <div className="relative flex-1 space-y-4 rounded-2xl border border-(--border)/50 p-6">
                <div className="h-6 w-48 animate-pulse rounded bg-(--surface)" />
                <div className="h-4 w-full animate-pulse rounded bg-(--surface)" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-(--surface)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
