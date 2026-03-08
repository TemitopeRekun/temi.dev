export default function LoadingBlogPost() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded-full bg-(--surface)" />
            <div className="mx-auto h-10 w-full max-w-[520px] animate-pulse rounded-xl bg-(--surface)" />
            <div className="mx-auto mt-4 h-4 w-40 animate-pulse rounded-full bg-(--surface)" />
          </div>

          <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-(--border)/20">
            <div className="h-full w-full animate-pulse bg-(--surface)" />
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded-full bg-(--surface)" />
            <div className="h-4 w-[92%] animate-pulse rounded-full bg-(--surface)" />
            <div className="h-4 w-[86%] animate-pulse rounded-full bg-(--surface)" />
            <div className="h-4 w-[90%] animate-pulse rounded-full bg-(--surface)" />
            <div className="h-4 w-[70%] animate-pulse rounded-full bg-(--surface)" />
          </div>
        </div>
      </section>
    </main>
  );
}
