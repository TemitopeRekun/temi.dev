/**
 * Canonical domain shapes shared between the API (response contracts) and the
 * web app (fetch/mapping layer). Declaring them once here keeps the public data
 * contract in a single place: a field change surfaces as a type error in both
 * apps rather than drifting silently.
 */

/** Cursor-paginated list envelope returned by every public list endpoint. */
export interface ListResponse<T> {
  items: T[];
  nextCursor?: string;
}

/** Query parameters accepted by cursor-paginated list endpoints. */
export interface PaginationQuery {
  take?: number;
  cursor?: string;
}

/** Lead status lifecycle (mirrors the Prisma `LeadStatus` enum values). */
export type LeadStatus = "NEW" | "CONTACTED" | "WON" | "LOST";

/**
 * The fields a visitor submits through the public contact form. The API's
 * `CreateLeadDto` validates exactly this shape (plus a honeypot), and the web
 * server action builds its payload to match.
 */
export interface LeadInput {
  name: string;
  email: string;
  message: string;
  company?: string | null;
  service?: string | null;
}

/** Public project as emitted by the API list/detail endpoints (pre-mapping). */
export interface PublicProject {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  body: string | null;
  techStack: string[] | null;
  coverImage: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  category: string | null;
  year: number | null;
  featured: boolean | null;
  order: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Public blog post as emitted by the API list/detail endpoints (pre-mapping). */
export interface PublicBlogPost {
  id: string | null;
  slug: string;
  title: string;
  tags: string[] | null;
  excerpt: string | null;
  coverImage: string | null;
  content: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
}
