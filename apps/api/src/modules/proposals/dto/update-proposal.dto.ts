import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateProposalDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}
