import { IsEmail, IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, ValidateIf } from "class-validator";

export enum JobPlatformDto {
  UPWORK = "UPWORK",
  FIVERR = "FIVERR",
  LINKEDIN = "LINKEDIN",
  REMOTEOK = "REMOTEOK",
  WELLFOUND = "WELLFOUND",
  DIRECT = "DIRECT",
  OTHER = "OTHER",
}

export enum JobSourceDto {
  MANUAL = "MANUAL",
  CSV = "CSV",
  RSS = "RSS",
}

export class CreateJobLeadDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  @MaxLength(160)
  company!: string;

  @IsEnum(JobPlatformDto)
  platform!: JobPlatformDto;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  budgetMin?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  budgetMax?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  currency?: string | null;

  @IsOptional()
  @ValidateIf((o) => !!o.url)
  @IsUrl()
  url?: string | null;

  @IsOptional()
  @IsEmail()
  contactEmail?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactName?: string | null;

  @IsOptional()
  @IsEnum(JobSourceDto)
  source?: JobSourceDto;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
