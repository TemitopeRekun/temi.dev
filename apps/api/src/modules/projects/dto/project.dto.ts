export class ProjectDto {
  id!: string;
  slug!: string;
  title!: string;
  description!: string;
  body?: string | null;
  category!: string;
  year!: number;
  techStack!: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverImage?: string | null;
  featured!: boolean;
  order!: number;
  // Last-modified timestamp, surfaced so the sitemap can emit accurate
  // <lastmod> values instead of the request time.
  updatedAt!: Date;
}
