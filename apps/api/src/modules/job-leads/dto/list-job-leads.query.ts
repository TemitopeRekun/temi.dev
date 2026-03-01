import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { JobPlatformDto } from "./create-job-lead.dto";

export enum JobStatusDto {
  NEW = "NEW",
  DRAFTING = "DRAFTING",
  APPLIED = "APPLIED",
  INTERVIEWING = "INTERVIEWING",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
}

export class ListJobLeadsQuery {
  @IsOptional()
  @IsEnum(JobPlatformDto)
  platform?: JobPlatformDto;

  @IsOptional()
  @IsEnum(JobStatusDto)
  status?: JobStatusDto;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  maxScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => parseInt(value, 10))
  take?: number;

  @IsOptional()
  @IsString()
  cursor?: string;
}
