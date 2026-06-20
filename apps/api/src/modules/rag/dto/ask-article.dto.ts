import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class AskArticleDto {
  @ApiProperty({ description: "BlogPost ID" })
  @IsString()
  @IsNotEmpty()
  articleId!: string;

  @ApiProperty({ description: "User question" })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  question!: string;
}
