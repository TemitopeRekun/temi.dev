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

// Nullable DB columns (coverImage, liveUrl, repoUrl, body, ...) come back as
// JSON `null`, so optional string fields use `.nullish()` (string|null|undefined)
// — `.optional()` alone rejects null and would fail the whole list parse.
const rawProjectSchema = z.object({
  id: z.string(),
  slug: z.string().nullish(),
  title: z.string(),
  year: z.number().nullish(),
  createdAt: z.string().nullish(),
  category: z.string().nullish(),
  techStack: z.array(z.string()).nullish(),
  description: z.string().nullish(),
  body: z.string().nullish(),
  coverImage: z.string().nullish(),
  liveUrl: z.string().nullish(),
  repoUrl: z.string().nullish(),
  featured: z.boolean().nullish(),
  order: z.number().nullish(),
});

// Raw shape returned by the API before mapping to `Project`, derived from the
// schema so it always matches what safeParse accepts (incl. nullable columns).
export type RawProject = z.infer<typeof rawProjectSchema>;

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
