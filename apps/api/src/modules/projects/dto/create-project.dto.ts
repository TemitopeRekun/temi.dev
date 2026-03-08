import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  slug!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5000)
  description!: string;

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
