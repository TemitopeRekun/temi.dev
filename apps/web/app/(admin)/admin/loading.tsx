export default function LoadingAdmin() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-3">
        <div className="h-6 w-1/3 animate-pulse rounded bg-(--surface)" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded bg-(--surface)" />
          <div className="h-28 animate-pulse rounded bg-(--surface)" />
          <div className="h-28 animate-pulse rounded bg-(--surface)" />
        </div>
      </div>
    </div>
  );
}

