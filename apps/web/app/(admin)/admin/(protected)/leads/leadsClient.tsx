"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@temi/ui";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  message: string;
  service?: string | null;
  score: number;
  status: string;
  createdAt: string;
};

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export default function LeadsClient({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/leads?take=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = (await res.json()) as { items: Lead[] };
      return data.items || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedLead(null);
    },
  });

  const [generatedReply, setGeneratedReply] = useState<string>("");

  const replyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/leads/${id}/reply-draft`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to generate reply");
      return res.json() as Promise<{ reply: string }>;
    },
    onSuccess: (data) => {
      setGeneratedReply(data.reply);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete lead");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedLead(null);
    },
  });

  if (isLoading) return <div className="p-4 text-(--muted)">Loading leads...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-(--muted)">
            Manage incoming contact form submissions and inquiries.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-(--border)/10 text-(--muted)">
              <tr>
                <th className="px-4 py-2 font-medium">Name / Company</th>
                <th className="px-4 py-2 font-medium">Service</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Received</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-(--border)/5 last:border-0 hover:bg-(--surface)/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-(--text)">{lead.name}</div>
                    <div className="text-xs text-(--muted)">{lead.email}</div>
                    {lead.company && <div className="text-xs text-(--muted)">{lead.company}</div>}
                  </td>
                  <td className="px-4 py-3 text-(--muted)">{lead.service || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        lead.score >= 50
                          ? "bg-green-500/10 text-green-400"
                          : lead.score >= 20
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-(--surface2) text-(--muted)"
                      }`}
                    >
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-(--surface2) px-2 py-1 text-xs font-medium text-(--text)">
                      {lead.status || "new"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--muted)">
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      magnetic={false}
                      variant="ghost"
                      className="h-8 px-2 text-xs"
                      onClick={() => setSelectedLead(lead)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-(--muted)">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-(--border)/20 bg-(--surface) p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-(--text)">Lead Details</h2>
                <p className="text-sm text-(--muted)">
                  Received {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                magnetic={false}
                variant="ghost"
                onClick={() => setSelectedLead(null)}
                className="size-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-(--muted)">Name</label>
                  <div className="text-(--text)">{selectedLead.name}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-(--muted)">Email</label>
                  <div className="text-(--text)">
                    <a href={`mailto:${selectedLead.email}`} className="hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-(--muted)">Company</label>
                  <div className="text-(--text)">{selectedLead.company || "—"}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-(--muted)">Service Interest</label>
                  <div className="text-(--text)">{selectedLead.service || "—"}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-(--muted)">Message</label>
                <div className="mt-2 rounded-lg border border-(--border)/10 bg-(--surface2)/50 p-4 text-sm leading-relaxed text-(--text)">
                  {selectedLead.message}
                </div>
              </div>

                {generatedReply && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-xs font-medium text-(--accent)">AI Suggested Reply</label>
                    <div className="mt-2 rounded-lg border border-(--accent)/20 bg-(--accent)/5 p-4 text-sm leading-relaxed text-(--text)">
                      <textarea 
                        className="w-full bg-transparent border-none focus:outline-none resize-none h-48"
                        value={generatedReply}
                        readOnly
                      />
                    </div>
                  </div>
                )}

              <div className="flex items-end justify-between border-t border-(--border)/10 pt-6">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-(--muted)">Status</label>
                    <select
                      value={selectedLead.status || "new"}
                      onChange={(e) =>
                        updateMutation.mutate({ id: selectedLead.id, status: e.target.value })
                      }
                      className="rounded-lg border border-(--border) bg-(--surface) px-3 py-1.5 text-sm text-(--text)"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!generatedReply && (
                    <Button
                      magnetic={false}
                      variant="ghost"
                      className="text-(--accent) hover:bg-(--accent)/10"
                      onClick={() => replyMutation.mutate(selectedLead.id)}
                    >
                      {replyMutation.isPending ? "Generating..." : "Draft Reply"}
                    </Button>
                  )}
                  <Button
                    magnetic={false}
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this lead?")) {
                        deleteMutation.mutate(selectedLead.id);
                      }
                    }}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete Lead"}
                  </Button>
                  <Button
                    magnetic={false}
                    onClick={() => {
                      setSelectedLead(null);
                      setGeneratedReply("");
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
