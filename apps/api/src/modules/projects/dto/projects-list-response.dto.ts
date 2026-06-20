import { ProjectDto } from "./project.dto";

export class ProjectsListResponseDto {
  items!: ProjectDto[];
  nextCursor?: string;
}
