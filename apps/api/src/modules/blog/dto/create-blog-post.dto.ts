import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBlogPostDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
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
