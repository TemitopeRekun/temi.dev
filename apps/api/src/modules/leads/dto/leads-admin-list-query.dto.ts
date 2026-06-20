import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, IsIn, Min } from "class-validator";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

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

  @ApiPropertyOptional({ description: "Filter by status", enum: LEAD_STATUSES })
  @IsOptional()
  @IsIn(LEAD_STATUSES)
  status?: LeadStatus;
}
