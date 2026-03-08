export default function LoadingContact() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Info */}
        <div className="space-y-8">
          <div className="h-4 w-24 animate-pulse rounded bg-(--surface)" />
          <div className="h-16 w-3/4 animate-pulse rounded-lg bg-(--surface)" />
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-(--surface)" />
            <div className="h-4 w-[90%] animate-pulse rounded bg-(--surface)" />
          </div>
          
          <div className="mt-12 space-y-6">
            <div className="h-12 w-full max-w-sm animate-pulse rounded-lg bg-(--surface)" />
            <div className="h-12 w-full max-w-sm animate-pulse rounded-lg bg-(--surface)" />
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-(--border)/50 bg-(--surface)/50 p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-12 w-full animate-pulse rounded-lg bg-(--surface)" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-(--surface)" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-(--surface)" />
            <div className="h-32 w-full animate-pulse rounded-lg bg-(--surface)" />
            <div className="h-12 w-full animate-pulse rounded-full bg-(--surface)" />
          </div>
        </div>
      </div>
    </div>
  );
}
