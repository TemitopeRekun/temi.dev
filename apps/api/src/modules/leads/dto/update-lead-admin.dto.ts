import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateLeadAdminDto {
  @ApiPropertyOptional({ description: "Status label" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}
