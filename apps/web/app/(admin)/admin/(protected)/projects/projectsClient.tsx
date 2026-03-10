"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@temi/ui";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  year: number;
  techStack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverImage?: string | null;
  featured: boolean;
  order: number;
};

type CreateProjectDto = {
  slug: string;
  title: string;
  description: string;
  category: string;
  year: number;
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
    slug: "",
    title: "",
    description: "",
    category: "Other",
    year: new Date().getFullYear(),
    techStack: [],
    liveUrl: "",
    repoUrl: "",
    featured: false,
    order: 0,
    coverImage: "",
  });

  const { data: items = [], isLoading } = useQuery({
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectDto;
    }) => {
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
      slug: "",
      title: "",
      description: "",
      category: "Other",
      year: new Date().getFullYear(),
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
      slug: project.slug,
      title: project.title,
      description: project.description,
      category: project.category,
      year: project.year,
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
      year: Number(formData.year),
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="number"
                    required
                    className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                  value={formData.techStack.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      techStack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Live URL
                  </label>
                  <input
                    type="url"
                    className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                    value={formData.liveUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, liveUrl: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Repo URL
                  </label>
                  <input
                    type="url"
                    className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2"
                    value={formData.repoUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, repoUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover Image
                </label>
                <ImageUpload
                  value={formData.coverImage || ""}
                  onChange={(url) =>
                    setFormData({ ...formData, coverImage: url })
                  }
                  token={token}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-sm">Order:</span>
                  <input
                    type="number"
                    className="w-20 rounded-lg border border-(--border) bg-transparent px-2 py-1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditorOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-lg border border-(--border)/10 bg-(--bg) p-3"
          >
            <div>
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-xs text-(--muted) line-clamp-1">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => handleEdit(project)}
                className="!px-4 !py-2 !text-xs h-auto"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm("Delete this project?")) {
                    deleteMutation.mutate(project.id);
                  }
                }}
                className="!px-4 !py-2 !text-xs h-auto !text-red-500 hover:!bg-red-500/10 hover:!text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && !isLoading && (
          <p className="text-center text-sm text-(--muted) py-4">
            No projects found. Add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
