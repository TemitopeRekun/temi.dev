"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@temi/ui";
import { useRef, useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type BlogSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  tags: string[];
  publishedAt?: string | null;
  coverImage?: string | null;
};

type CreateBlogPostDto = {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  tags: string[];
  published: boolean;
  coverImage?: string;
};

type UpdateBlogPostDto = Partial<Omit<CreateBlogPostDto, "slug">>;

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export default function BlogClient({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogSummary | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const publishToastRef = useRef(false);

  const [formData, setFormData] = useState<CreateBlogPostDto>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    published: false,
    coverImage: "",
  });

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/blog/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      // The list endpoint returns a cursor-paginated { items, nextCursor }.
      const json = (await res.json()) as { items: BlogSummary[] };
      return json.items;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateBlogPostDto) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      if (publishToastRef.current) {
        toast.success("Post published.");
        publishToastRef.current = false;
      }
      setIsEditorOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBlogPostDto }) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      if (publishToastRef.current) {
        toast.success("Post published.");
        publishToastRef.current = false;
      }
      setIsEditorOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      tags: [],
      published: false,
      coverImage: "",
    });
    setEditingPost(null);
  };

  const handleEdit = async (post: BlogSummary) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: "",
      tags: post.tags,
      published: !!post.publishedAt,
      coverImage: post.coverImage || "",
    });
    setIsEditorOpen(true);

    try {
      const res = await fetch(`${apiBaseUrl()}/api/blog/${post.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const fullPost = await res.json();
        setFormData(prev => ({
          ...prev,
          content: fullPost.content || "",
          coverImage: fullPost.coverImage || "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch full post details", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    publishToastRef.current = formData.published;
    if (editingPost) {
      updateMutation.mutate({
        id: editingPost.id,
        data: {
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          tags: formData.tags,
          published: formData.published,
          coverImage: formData.coverImage,
        },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-(--muted)">
          Published posts are shown on the public blog.
        </p>
        <Button
          magnetic={false}
          onClick={() => {
            resetForm();
            setIsEditorOpen(true);
          }}
        >
          New Post
        </Button>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-(--surface) p-6 shadow-xl border border-(--border)/20 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">
              {editingPost ? "Edit Post" : "New Post"}
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
              {!editingPost && (
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                  rows={2}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Content</label>
                  <div className="flex rounded-lg border border-(--border)/20 p-1 bg-(--bg)">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        activeTab === "edit"
                          ? "bg-(--accent) text-white shadow-sm"
                          : "text-(--muted) hover:text-(--text)"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        activeTab === "preview"
                          ? "bg-(--accent) text-white shadow-sm"
                          : "text-(--muted) hover:text-(--text)"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {activeTab === "edit" ? (
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2 font-mono text-sm focus:border-(--accent) focus:outline-none"
                    rows={12}
                    placeholder="Write your story in Markdown..."
                  />
                ) : (
                  <div className="min-h-[300px] w-full rounded-md border border-(--border)/20 bg-(--bg) px-6 py-6 overflow-y-auto">
                    {formData.content ? (
                      <div className="case-study">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {formData.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-(--muted) italic">Nothing to preview yet...</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2"
                />
              </div>

              <ImageUpload
                token={token}
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                label="Cover Image"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="rounded border-(--border)/20"
                />
                <label htmlFor="published" className="text-sm">
                  Published
                </label>
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
                  {editingPost ? "Update" : "Create"}
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
              <th className="px-3 py-2 font-medium">Tags</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-(--border)/10 hover:bg-(--surface)/40">
                <td className="px-3 py-2 font-medium">{p.title}</td>
                <td className="px-3 py-2 text-(--muted)">{p.tags.join(", ")}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      p.publishedAt
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {p.publishedAt ? "Published" : "Draft"}
                  </span>
                </td>
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
