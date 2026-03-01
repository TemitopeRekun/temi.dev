import { IsOptional, IsString } from "class-validator";

export class UpdateOutreachDto {
  @IsOptional()
  @IsString()
  response?: string | null;

  @IsOptional()
  @IsString()
  responseAt?: string | null;

  @IsOptional()
  @IsString()
  outcome?: string | null;
}
