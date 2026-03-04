import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class AskWebsiteDto {
  @ApiProperty({ description: "User question across website content" })
  @IsString()
  @IsNotEmpty()
  question!: string;
}
