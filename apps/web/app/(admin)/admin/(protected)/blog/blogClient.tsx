"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@temi/ui";

type BlogSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  tags: string[];
  publishedAt?: string | null;
  viewCount: number;
};

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  return (env && env.trim().length > 0 ? env : "http://localhost:4000") as string;
}

export default function BlogClient() {
  const [items, setItems] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiBaseUrl()}/api/blog?take=100`, {
        cache: "no-store",
      }).catch(() => null);
      setLoading(false);
      if (!res || !res.ok) {
        setError("Failed to load posts");
        return;
      }
      const data = (await res.json()) as { items: BlogSummary[] };
      setItems(data.items ?? []);
    };
    run().catch(() => {});
  }, []);

  const rows = useMemo(
    () =>
      items.map((p) => (
        <tr key={p.id} className="border-b border-(--border)/10">
          <td className="px-3 py-2">{p.title}</td>
          <td className="px-3 py-2 text-(--muted)">{p.tags.join(", ")}</td>
          <td className="px-3 py-2">{p.publishedAt ? "Published" : "Draft"}</td>
          <td className="px-3 py-2">
            <div className="flex gap-2">
              <button className="rounded-md border border-(--border)/40 px-2 py-1 text-sm">
                Edit
              </button>
              <button className="rounded-md border border-(--border)/40 px-2 py-1 text-sm">
                Delete
              </button>
            </div>
          </td>
        </tr>
      )),
    [items],
  );

  return (
    <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-(--muted)">
          Published posts are shown on the public blog.
        </p>
        <Button magnetic={false}>New Post</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-(--muted)">
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Tags</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>{loading ? null : rows}</tbody>
        </table>
      </div>
      {loading && <p className="py-6 text-center text-(--muted)">Loading…</p>}
      {error && (
        <p className="py-6 text-center text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
