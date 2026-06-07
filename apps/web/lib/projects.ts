export type ProjectCategory = string;

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: number;
  category: ProjectCategory;
  tags: string[];
  description: string;
  body: string;
  image: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
};

// Raw shape returned by the API before mapping to `Project`.
export type RawProject = {
  id: string;
  slug?: string;
  title: string;
  year?: number;
  createdAt?: string;
  category?: string;
  techStack?: string[];
  description?: string;
  body?: string | null;
  coverImage?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  order?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 30 },
      cache: process.env.NODE_ENV === "development" ? "no-store" : "default",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapProject);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/api/projects/slug/${slug}`, {
      next: { revalidate: 30 },
      cache: process.env.NODE_ENV === "development" ? "no-store" : "default",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return mapProject(data);
  } catch {
    return null;
  }
}

function mapProject(data: RawProject): Project {
  return {
    id: data.id,
    slug: data.slug || data.id,
    title: data.title,
    year:
      data.year ||
      (data.createdAt
        ? new Date(data.createdAt).getFullYear()
        : new Date().getFullYear()),
    category: data.category || "Other",
    tags: data.techStack || [],
    description: data.description || "",
    body: data.body || "",
    image: data.coverImage || "",
    liveUrl: data.liveUrl || "",
    repoUrl: data.repoUrl || "",
    featured: data.featured || false,
    order: data.order || 0,
  };
}
