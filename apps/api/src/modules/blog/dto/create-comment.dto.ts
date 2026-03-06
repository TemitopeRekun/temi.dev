import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ example: "Great article!" })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: "John Doe", required: false })
  @IsString()
  @IsOptional()
  author?: string;
}
