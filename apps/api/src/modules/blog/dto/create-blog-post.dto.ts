import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";
import { SLUG_PATTERN } from "../../../common/utils/slug";

export class CreateBlogPostDto {
  @ApiProperty({
    description:
      "URL slug: lowercase alphanumerics separated by single hyphens. Rejected rather than silently rewritten, so the caller knows what URL the post will live at.",
    example: "rls-in-plain-english",
  })
  @IsString()
  @MaxLength(150)
  @Matches(SLUG_PATTERN, {
    message:
      "slug must be lowercase alphanumerics separated by single hyphens (e.g. my-post-title)",
  })
  slug!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20000)
  content!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  tags!: string[];

  @ApiProperty({ default: false })
  @IsBoolean()
  published!: boolean;
}
