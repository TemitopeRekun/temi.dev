import { IsString } from "class-validator";

export class EmbedProjectDto {
  @IsString()
  projectId!: string;
}
