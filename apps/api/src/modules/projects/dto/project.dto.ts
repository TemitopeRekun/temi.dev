export class ProjectDto {
  id!: string;
  slug!: string;
  title!: string;
  description!: string;
  category!: string;
  year!: number;
  techStack!: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverImage?: string | null;
  featured!: boolean;
  order!: number;
}
