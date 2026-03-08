"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@temi/ui";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverImage?: string | null;
  featured: boolean;
  order: number;
};

type CreateProjectDto = {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverImage?: string | null;
  featured: boolean;
  order: number;
};

type UpdateProjectDto = Partial<CreateProjectDto>;

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export default function ProjectsClient({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<CreateProjectDto>({
    title: "",
    description: "",
    techStack: [],
    liveUrl: "",
    repoUrl: "",
    featured: false,
    order: 0,
    coverImage: "",
  });

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      // Use the public endpoint for listing, or admin endpoint if available
      const res = await fetch(`${apiBaseUrl()}/api/projects`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return (await res.json()) as Project[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateProjectDto) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setIsEditorOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectDto }) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setIsEditorOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      techStack: [],
      liveUrl: "",
      repoUrl: "",
      featured: false,
      order: 0,
      coverImage: "",
    });
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
      featured: project.featured,
      order: project.order,
      coverImage: project.coverImage || "",
    });
    setIsEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      order: Number(formData.order),
      liveUrl: formData.liveUrl || null,
      repoUrl: formData.repoUrl || null,
      coverImage: formData.coverImage || null,
    };

    if (editingProject) {
      updateMutation.mutate({
        id: editingProject.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-(--muted)">
          Manage portfolio projects shown on the public site.
        </p>
        <Button
          magnetic={false}
          onClick={() => {
            resetForm();
            setIsEditorOpen(true);
          }}
        >
          Add Project
        </Button>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-(--surface) p-6 shadow-xl border border-(--border)/20 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tech Stack (comma separated)
                </label>
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
              
              <ImageUpload
                token={token}
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                label="Project Cover Image"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, liveUrl: e.target.value })
                    }
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Repo URL</label>
                  <input
                    type="url"
                    value={formData.repoUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, repoUrl: e.target.value })
                    }
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="rounded border-(--border)/20"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Featured
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  magnetic={false}
                  onClick={() => setIsEditorOpen(false)}
                  className="bg-transparent border border-(--border)/20 hover:bg-(--surface)/80"
                >
                  Cancel
                </Button>
                <Button type="submit" magnetic={false}>
                  {editingProject ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-(--muted)">
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Tech</th>
              <th className="px-3 py-2 font-medium">Featured</th>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-(--border)/10 hover:bg-(--surface)/40">
                <td className="px-3 py-2 font-medium">{p.title}</td>
                <td className="px-3 py-2 text-(--muted)">{p.techStack.join(", ")}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      p.featured
                        ? "bg-purple-500/10 text-purple-500"
                        : "text-(--muted)"
                    }`}
                  >
                    {p.featured ? "Featured" : "-"}
                  </span>
                </td>
                <td className="px-3 py-2 text-(--muted)">{p.order}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="rounded-md border border-(--border)/40 px-2 py-1 text-xs hover:bg-(--text)/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          deleteMutation.mutate(p.id);
                        }
                      }}
                      className="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <p className="py-6 text-center text-(--muted)">Loading…</p>}
      {error && (
        <p className="py-6 text-center text-red-400" role="alert">
          {(error as Error).message}
        </p>
      )}
    </div>
  );
}
