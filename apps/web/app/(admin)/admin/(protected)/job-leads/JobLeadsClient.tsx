"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@temi/ui";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

enum JobPlatform {
  UPWORK = "UPWORK",
  FIVERR = "FIVERR",
  LINKEDIN = "LINKEDIN",
  REMOTEOK = "REMOTEOK",
  WELLFOUND = "WELLFOUND",
  DIRECT = "DIRECT",
  OTHER = "OTHER",
}

enum JobSource {
  MANUAL = "MANUAL",
  CSV = "CSV",
  RSS = "RSS",
}

enum JobStatus {
  NEW = "NEW",
  DRAFTING = "DRAFTING",
  APPLIED = "APPLIED",
  INTERVIEWING = "INTERVIEWING",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
}

type JobLead = {
  id: string;
  title: string;
  company: string;
  platform: JobPlatform;
  description: string;
  techStack: string[];
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string | null;
  url?: string | null;
  contactEmail?: string | null;
  contactName?: string | null;
  score: number;
  scoreReason?: string | null;
  pitchAngle?: string | null;
  status: JobStatus;
  source: JobSource;
  notes?: string | null;
  createdAt: string;
};

type CreateJobLeadDto = {
  title: string;
  company: string;
  platform: JobPlatform;
  description: string;
  techStack: string[];
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string | null;
  url?: string | null;
  contactEmail?: string | null;
  contactName?: string | null;
  source?: JobSource;
  notes?: string | null;
};

type UpdateJobLeadDto = Partial<CreateJobLeadDto> & {
  status?: JobStatus;
};

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export function JobLeadsClient({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<JobLead | null>(null);
  const [proposalResult, setProposalResult] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateJobLeadDto & { status?: JobStatus }>({
    title: "",
    company: "",
    platform: JobPlatform.OTHER,
    description: "",
    techStack: [],
    budgetMin: null,
    budgetMax: null,
    currency: "USD",
    url: "",
    contactEmail: "",
    contactName: "",
    source: JobSource.MANUAL,
    notes: "",
    status: JobStatus.NEW,
  });

  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-job-leads"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/job-leads`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch job leads");
      const json = await res.json();
      return (json.items || []) as JobLead[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateJobLeadDto) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/job-leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create job lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-leads"] });
      setIsEditorOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateJobLeadDto }) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/job-leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update job lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-leads"] });
      setIsEditorOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/job-leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete job lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-leads"] });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/job-leads/${id}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to analyze job lead");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job-leads"] });
    },
  });

  const proposalMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/job-leads/${id}/proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ variant: "SHORT" }),
      });
      if (!res.ok) throw new Error("Failed to generate proposal");
      return res.json();
    },
    onSuccess: (data) => {
      setProposalResult(data.proposal);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      platform: JobPlatform.OTHER,
      description: "",
      techStack: [],
      budgetMin: null,
      budgetMax: null,
      currency: "USD",
      url: "",
      contactEmail: "",
      contactName: "",
      source: JobSource.MANUAL,
      notes: "",
      status: JobStatus.NEW,
    });
    setEditingLead(null);
  };

  const handleEdit = (lead: JobLead) => {
    setEditingLead(lead);
    setFormData({
      title: lead.title,
      company: lead.company,
      platform: lead.platform,
      description: lead.description,
      techStack: lead.techStack,
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      currency: lead.currency,
      url: lead.url,
      contactEmail: lead.contactEmail,
      contactName: lead.contactName,
      source: lead.source,
      notes: lead.notes,
      status: lead.status,
    });
    setIsEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      updateMutation.mutate({
        id: editingLead.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-4 text-(--muted)">Loading leads...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-(--muted)">
            Manage job leads, track applications, and generate AI proposals.
          </p>
          <Button
            magnetic={false}
            onClick={() => {
              resetForm();
              setIsEditorOpen(true);
            }}
          >
            Add Lead
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-(--border)/10 text-(--muted)">
              <tr>
                <th className="px-4 py-2 font-medium">Title / Company</th>
                <th className="px-4 py-2 font-medium">Platform</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-(--border)/5 last:border-0 hover:bg-(--surface)/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-(--text)">{lead.title}</div>
                    <div className="text-xs text-(--muted)">{lead.company}</div>
                  </td>
                  <td className="px-4 py-3 text-(--muted)">{lead.platform}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${lead.score >= 80 ? "text-green-400" : lead.score >= 50 ? "text-yellow-400" : "text-(--muted)"}`}>
                        {lead.score}
                      </span>
                      {lead.score === 0 && (
                        <button
                          onClick={() => analyzeMutation.mutate(lead.id)}
                          className="text-xs text-blue-400 hover:underline"
                          disabled={analyzeMutation.isPending}
                        >
                          {analyzeMutation.isPending ? "Analyzing..." : "Analyze"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-(--surface)/80 px-2 py-1 text-xs border border-(--border)/20">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-(--muted)">
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(lead)} className="text-(--muted) hover:text-(--text)">
                        Edit
                      </button>
                      <button
                        onClick={() => proposalMutation.mutate(lead.id)}
                        className="text-blue-400 hover:text-blue-300"
                        disabled={proposalMutation.isPending}
                      >
                        Proposal
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this lead?")) deleteMutation.mutate(lead.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-(--muted)">
                    No job leads found. Add one manually or import via CSV.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {proposalResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-(--surface) p-6 shadow-xl border border-(--border)/20 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">Generated Proposal</h2>
            <pre className="whitespace-pre-wrap rounded-md bg-black/20 p-4 text-sm text-(--text)/90 font-mono border border-(--border)/10">
              {proposalResult}
            </pre>
            <div className="mt-4 flex justify-end gap-2">
              <Button magnetic={false} onClick={() => navigator.clipboard.writeText(proposalResult)}>
                Copy
              </Button>
              <Button magnetic={false} onClick={() => setProposalResult(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-(--surface) p-6 shadow-xl border border-(--border)/20 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">
              {editingLead ? "Edit Lead" : "New Lead"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as JobPlatform })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  >
                    {Object.values(JobPlatform).map((p) => (
                      <option key={p} value={p} className="bg-black">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status ?? JobStatus.NEW}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  >
                    {Object.values(JobStatus).map((s) => (
                      <option key={s} value={s} className="bg-black">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Budget Min</label>
                  <input
                    type="number"
                    value={formData.budgetMin || ""}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Budget Max</label>
                  <input
                    type="number"
                    value={formData.budgetMax || ""}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.currency || "USD"}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  magnetic={false}
                  type="button"
                  onClick={() => {
                    setIsEditorOpen(false);
                    resetForm();
                  }}
                  className="bg-transparent border border-(--border)/20 hover:bg-(--surface)/50"
                >
                  Cancel
                </Button>
                <Button magnetic={false} type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Lead"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
