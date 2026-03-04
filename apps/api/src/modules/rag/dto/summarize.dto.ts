import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SummarizeDto {
  @ApiProperty({ description: "BlogPost ID" })
  @IsString()
  @IsNotEmpty()
  articleId!: string;
}
