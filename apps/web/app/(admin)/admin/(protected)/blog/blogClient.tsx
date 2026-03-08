"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@temi/ui";
import { useRef, useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";

type BlogSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  tags: string[];
  publishedAt?: string | null;
  viewCount: number;
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
  
  // AI Generation State
  const [isGeneratingOpen, setIsGeneratingOpen] = useState(false);
  const [generateTopic, setGenerateTopic] = useState("");
  const suppressCloseRef = useRef(false);
  const publishToastRef = useRef(false);

  // Form state
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return (await res.json()) as BlogSummary[];
    },
  });

  const {
    data: trendingTopics = [],
    isLoading: isTrendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["admin-blog-trending"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/blog/trending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return (await res.json()) as string[];
    },
    enabled: isGeneratingOpen, // Only fetch when generating
  });

  const generateMutation = useMutation({
    mutationFn: async (vars: { topic: string; publishNow: boolean }) => {
      const res = await fetch(`${apiBaseUrl()}/api/admin/blog/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: vars.topic }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate post");
      }
      return res.json();
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setIsGeneratingOpen(false);
      setGenerateTopic("");
      const publishNow = vars.publishNow;
      
      // Auto-open editor with generated content
      setFormData({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content,
        tags: data.tags || [],
        published: true,
        coverImage: "",
      });
      // We don't have an ID for editingPost since it's a new draft, 
      // but we need to know if we are updating an existing one or creating new.
      // The generate endpoint actually CREATES a post in the DB.
      // So we should set it as editingPost.
      setEditingPost({
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        tags: data.tags || [],
        publishedAt: null,
        viewCount: 0,
        coverImage: null,
      });
      setIsEditorOpen(true);

      if (publishNow) {
        suppressCloseRef.current = true;
        publishToastRef.current = true;
        updateMutation.mutate(
          {
            id: data.id,
            data: {
              title: data.title,
              excerpt: data.excerpt || "",
              content: data.content || "",
              tags: data.tags || [],
              published: true,
              coverImage: "",
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
            },
          },
        );
      }
    },
    onError: (err) => {
      console.error("Generate failed:", err);
      alert(err instanceof Error ? err.message : "Failed to generate post");
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
      if (suppressCloseRef.current) {
        suppressCloseRef.current = false;
        if (publishToastRef.current) {
          toast.success("Post published.");
          publishToastRef.current = false;
        }
        return;
      }
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateTopic.trim()) return;
    generateMutation.mutate({ topic: generateTopic, publishNow: false });
  };

  const handlePublishNow = () => {
    if (!generateTopic.trim()) return;
    generateMutation.mutate({ topic: generateTopic, publishNow: true });
  };

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
    // Initial state with summary data
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: "", // Will be populated
      tags: post.tags,
      published: !!post.publishedAt,
      coverImage: post.coverImage || "",
    });
    setIsEditorOpen(true);

    // Fetch full content
    try {
      const res = await fetch(`${apiBaseUrl()}/api/blog/${post.slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          content: formData.content, // This might be empty if we didn't fetch full post
          tags: formData.tags,
          published: formData.published,
          coverImage: formData.coverImage,
        },
      });
    } else {
      publishToastRef.current = formData.published;
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="rounded-2xl border border-(--border)/20 bg-(--surface) p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-(--muted)">
          Published posts are shown on the public blog.
        </p>
        <div className="flex gap-2">
          <Button
            magnetic={false}
            onClick={() => setIsGeneratingOpen(!isGeneratingOpen)}
            className="bg-transparent border border-(--border)/20 hover:bg-(--surface)/80"
          >
            {isGeneratingOpen ? "Cancel AI" : "Generate with AI"}
          </Button>
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
      </div>

      {isGeneratingOpen && (
        <div className="mb-8 p-6 rounded-xl border border-(--border) bg-(--surface)">
          <h3 className="text-lg font-semibold mb-4 text-(--text)">Generate Blog Post</h3>
          <form onSubmit={handleGenerate} className="flex gap-2 mb-4">
            <input
              type="text"
              value={generateTopic}
              onChange={(e) => setGenerateTopic(e.target.value)}
              placeholder="Enter a topic (e.g. 'React Server Components vs Client Components')..."
              className="flex-1 rounded-md border border-(--border) bg-(--bg) p-2 text-(--text)"
              disabled={generateMutation.isPending}
            />
            <Button
              magnetic={false}
              type="submit"
              disabled={generateMutation.isPending || !generateTopic.trim()}
            >
              {generateMutation.isPending ? "Generating..." : "Generate Draft"}
            </Button>
            <Button
              magnetic={false}
              type="button"
              onClick={handlePublishNow}
              disabled={generateMutation.isPending || !generateTopic.trim()}
              className="bg-transparent border border-(--border)/20 hover:bg-(--surface)/80"
            >
              {generateMutation.isPending ? "Generating..." : "Publish Now"}
            </Button>
          </form>
          
          {trendingTopics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-(--muted)">Trending Topics:</p>
                <Button
                  type="button"
                  magnetic={false}
                  onClick={() => refetchTrending()}
                  disabled={isTrendingLoading}
                  className="bg-transparent border border-(--border)/20 hover:bg-(--surface)/80 px-3 py-1 text-xs"
                >
                  {isTrendingLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setGenerateTopic(topic)}
                    className="px-3 py-1 text-xs rounded-full bg-(--accent)/10 text-(--accent) hover:bg-(--accent)/20 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isTrendingLoading && trendingTopics.length === 0 && (
            <p className="text-sm text-(--muted)">Loading trending topics...</p>
          )}
          {trendingError && (
            <p className="text-sm text-red-400" role="alert">
              Failed to load trending topics.
            </p>
          )}
        </div>
      )}

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
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full rounded-md border border-(--border)/20 bg-transparent px-3 py-2 font-mono text-sm"
                  rows={10}
                />
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
