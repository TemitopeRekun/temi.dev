export default function LoadingPublic() {
  return (
    <div className="px-4 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="h-7 w-1/2 animate-pulse rounded-lg bg-(--surface)" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-(--surface)" />
          <div className="h-48 animate-pulse rounded-2xl bg-(--surface)" />
        </div>
      </div>
    </div>
  );
}

