import { IsEnum, IsOptional, IsString } from "class-validator";
import { JobStatusDto } from "./list-job-leads.query";

export class UpdateJobLeadDto {
  @IsOptional()
  @IsEnum(JobStatusDto)
  status?: JobStatusDto;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
