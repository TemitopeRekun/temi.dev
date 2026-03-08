export default function LoadingWorkDetail() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-4 h-12 w-3/4 max-w-lg animate-pulse rounded-lg bg-(--surface)" />
      <div className="mb-12 h-6 w-1/2 max-w-md animate-pulse rounded-lg bg-(--surface)" />
      
      <div className="aspect-video w-full animate-pulse rounded-2xl bg-(--surface)" />
      
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="h-6 w-full animate-pulse rounded bg-(--surface)" />
          <div className="h-6 w-[90%] animate-pulse rounded bg-(--surface)" />
          <div className="h-6 w-[95%] animate-pulse rounded bg-(--surface)" />
        </div>
        <div className="space-y-4">
          <div className="h-48 w-full animate-pulse rounded-xl bg-(--surface)" />
          <div className="h-12 w-full animate-pulse rounded-full bg-(--surface)" />
        </div>
      </div>
    </div>
  );
}
