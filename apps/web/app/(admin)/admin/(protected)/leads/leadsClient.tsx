"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@temi/ui";

type Lead = {
  id: string;
  name: string;
  email: string;
  service?: string | null;
  score: number;
  status: string;
  createdAt: string;
};

async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch("/api/admin/leads?take=50", { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return [];
  const data = (await res.json()) as { items: Lead[] };
  return data.items ?? [];
}

export default function LeadsClient() {
  const [sortDesc, setSortDesc] = useState(true);
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      const rows = await fetchLeads();
      setItems(rows);
      setLoading(false);
      if (rows.length === 0) setError("No leads found or failed to load");
    };
    run().catch(() => {});
  }, []);
  const leads = useMemo(() => {
    const copy: Lead[] = [...items];
    copy.sort((a: Lead, b: Lead) =>
      sortDesc ? b.score - a.score : a.score - b.score,
    );
    return copy;
  }, [sortDesc, items]);
  return (
    <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-(--muted)">
          Sorted by score {sortDesc ? "(high → low)" : "(low → high)"}.
        </p>
        <Button
          onClick={() => setSortDesc((v) => !v)}
          magnetic={false}
          variant="outline"
        >
          Toggle Sort
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-(--muted)">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Service</th>
              <th className="px-3 py-2 font-medium">Score</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-(--border)/10">
                <td className="px-3 py-2">{l.name}</td>
                <td className="px-3 py-2 text-(--muted)">{l.email}</td>
                <td className="px-3 py-2">{l.service ?? "—"}</td>
                <td className="px-3 py-2">{l.score}</td>
                <td className="px-3 py-2">{l.status}</td>
              </tr>
            ))}
          </tbody>
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
