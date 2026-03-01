"use client";
import { useMemo, useState } from "react";
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

const SAMPLE: Lead[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    service: "Web Development",
    score: 42,
    status: "new",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    service: "AI Automation",
    score: 73,
    status: "contacted",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "3",
    name: "Carla Gomez",
    email: "carla@example.com",
    service: "Design",
    score: 28,
    status: "new",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export default function LeadsClient() {
  const [sortDesc, setSortDesc] = useState(true);
  const leads = useMemo(() => {
    const copy: Lead[] = [...SAMPLE];
    copy.sort((a: Lead, b: Lead) =>
      sortDesc ? b.score - a.score : a.score - b.score,
    );
    return copy;
  }, [sortDesc]);
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
    </div>
  );
}
