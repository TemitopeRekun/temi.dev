import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class AskWebsiteDto {
  @ApiProperty({ description: "User question across website content" })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  question!: string;
}
