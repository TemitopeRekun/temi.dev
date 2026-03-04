import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, Min } from "class-validator";

export class LeadsAdminListQueryDto {
  @ApiPropertyOptional({ description: "Cursor id for pagination" })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ description: "Page size (default 20)" })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({ description: "Filter by status" })
  @IsOptional()
  @IsString()
  status?: string;
}
