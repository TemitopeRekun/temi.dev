import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class ProjectsQueryDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === "string") {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return undefined;
  })
  tech?: string[];
}
