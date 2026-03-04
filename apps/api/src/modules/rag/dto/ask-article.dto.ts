import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class AskArticleDto {
  @ApiProperty({ description: "BlogPost ID" })
  @IsString()
  @IsNotEmpty()
  articleId!: string;

  @ApiProperty({ description: "User question" })
  @IsString()
  @IsNotEmpty()
  question!: string;
}
