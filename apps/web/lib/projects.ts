export type ProjectCategory = string;

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: number;
  category: ProjectCategory;
  tags: string[];
  description: string;
  image: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapProject);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/api/projects/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return mapProject(data);
  } catch (error) {
    console.error(`Failed to fetch project ${slug}:`, error);
    return null;
  }
}

function mapProject(data: any): Project {
  return {
    id: data.id,
    slug: data.slug || data.id,
    title: data.title,
    year: data.year || new Date(data.createdAt).getFullYear(),
    category: data.category || "Other",
    tags: data.techStack || [],
    description: data.description,
    image: data.coverImage || "",
    liveUrl: data.liveUrl || "",
    repoUrl: data.repoUrl || "",
    featured: data.featured || false,
    order: data.order || 0,
  };
}
