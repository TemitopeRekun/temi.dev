import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => parseInt(value, 10))
  take?: number;

  @IsOptional()
  @IsString()
  cursor?: string;
}
