import { IsEnum, IsOptional, IsString } from "class-validator";

export enum OutreachChannelDto {
  EMAIL = "EMAIL",
  LINKEDIN = "LINKEDIN",
  PLATFORM = "PLATFORM",
}

export class CreateOutreachDto {
  @IsString()
  jobLeadId!: string;

  @IsEnum(OutreachChannelDto)
  channel!: OutreachChannelDto;

  @IsString()
  sentAt!: string;

  @IsOptional()
  @IsString()
  subject?: string | null;

  @IsOptional()
  @IsString()
  body?: string | null;
}
