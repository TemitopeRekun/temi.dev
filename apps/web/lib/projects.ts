import { z } from "zod";

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

const rawProjectSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  year: z.number().optional(),
  createdAt: z.string().optional(),
  category: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  description: z.string().optional(),
  body: z.string().nullable().optional(),
  coverImage: z.string().optional(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

// The API list endpoint returns a cursor-paginated envelope, not a bare array.
const projectListSchema = z.object({
  items: z.array(rawProjectSchema),
  nextCursor: z.string().optional(),
});

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const REVALIDATE = 30;

export async function getProjects(): Promise<Project[]> {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const res = await fetch(`${API_URL}/api/projects`, {
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: REVALIDATE } }),
    });
    if (!res.ok) {
      console.error(`[projects] getProjects: upstream returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    const parsed = projectListSchema.safeParse(data);
    if (!parsed.success) {
      console.error(
        "[projects] getProjects: unexpected payload shape",
        parsed.error.issues,
      );
      return [];
    }
    return parsed.data.items.map(mapProject);
  } catch (err) {
    console.error("[projects] getProjects: fetch failed", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const res = await fetch(`${API_URL}/api/projects/slug/${slug}`, {
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: REVALIDATE } }),
    });
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(
          `[projects] getProjectBySlug(${slug}): upstream returned ${res.status}`,
        );
      }
      return null;
    }
    const data = await res.json();
    const parsed = rawProjectSchema.safeParse(data);
    if (!parsed.success) {
      console.error(
        `[projects] getProjectBySlug(${slug}): unexpected payload shape`,
        parsed.error.issues,
      );
      return null;
    }
    return mapProject(parsed.data);
  } catch (err) {
    console.error(`[projects] getProjectBySlug(${slug}): fetch failed`, err);
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
