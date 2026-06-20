import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsIn } from "class-validator";
import { LEAD_STATUSES, LeadStatus } from "./leads-admin-list-query.dto";

export class UpdateLeadAdminDto {
  @ApiPropertyOptional({ description: "Status label", enum: LEAD_STATUSES })
  @IsOptional()
  @IsIn(LEAD_STATUSES)
  status?: LeadStatus;
}
