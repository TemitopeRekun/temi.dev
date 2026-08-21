import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";
import { SLUG_PATTERN } from "../../../common/utils/slug";

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: "bicadriver" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(SLUG_PATTERN, {
    message:
      "slug must be lowercase alphanumerics separated by single hyphens (e.g. my-project)",
  })
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50000)
  body?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  techStack?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  liveUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  repoUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
