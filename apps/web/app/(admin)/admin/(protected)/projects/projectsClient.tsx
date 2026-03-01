"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@temi/ui";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  order: number;
};

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export default function ProjectsClient() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiBaseUrl()}/api/projects`, {
        cache: "no-store",
      }).catch(() => null);
      setLoading(false);
      if (!res || !res.ok) {
        setError("Failed to load projects");
        return;
      }
      const data = (await res.json()) as Project[];
      setItems(data);
    };
    run().catch(() => {});
  }, []);

  const rows = useMemo(
    () =>
      items.map((p) => (
        <tr key={p.id} className="border-b border-(--border)/10">
          <td className="px-3 py-2">{p.title}</td>
          <td className="px-3 py-2 text-(--muted)">{p.techStack.join(", ")}</td>
          <td className="px-3 py-2">{p.featured ? "Yes" : "No"}</td>
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
          Manage portfolio projects shown on the public site.
        </p>
        <Button onClick={() => setShowModal(true)} magnetic={false}>
          Add Project
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-(--muted)">
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Tech</th>
              <th className="px-3 py-2 font-medium">Featured</th>
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
      {showModal && <ProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ProjectModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg">New Project</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-(--border)/40 px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-(--muted)">
          Form implementation is pending API endpoints.
        </p>
      </div>
    </div>
  );
}
