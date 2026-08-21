import { ApiProperty } from "@nestjs/swagger";
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

export class CreateProjectDto {
  @ApiProperty({
    description:
      "URL slug: lowercase alphanumerics separated by single hyphens.",
    example: "bicadriver",
  })
  @IsString()
  @MaxLength(100)
  @Matches(SLUG_PATTERN, {
    message:
      "slug must be lowercase alphanumerics separated by single hyphens (e.g. my-project)",
  })
  slug!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5000)
  description!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50000)
  body?: string | null;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  category!: string;

  @ApiProperty()
  @IsInt()
  @Min(2000)
  year!: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  techStack!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  liveUrl?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  repoUrl?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImage?: string | null;

  @ApiProperty({ default: false })
  @IsBoolean()
  featured!: boolean;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  order!: number;
}
