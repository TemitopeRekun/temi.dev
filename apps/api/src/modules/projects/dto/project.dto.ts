export class ProjectDto {
  id!: string;
  title!: string;
  description!: string;
  techStack!: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  coverImage?: string | null;
  featured!: boolean;
  order!: number;
}
