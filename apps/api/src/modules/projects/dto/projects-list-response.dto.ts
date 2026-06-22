import type { ListResponse } from "@temi/types";
import { ProjectDto } from "./project.dto";

export class ProjectsListResponseDto implements ListResponse<ProjectDto> {
  items!: ProjectDto[];
  nextCursor?: string;
}
