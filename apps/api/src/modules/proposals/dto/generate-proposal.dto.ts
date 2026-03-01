import { IsEnum, IsString } from "class-validator";

export enum ProposalVariantDto {
  SHORT = "SHORT",
  TECHNICAL = "TECHNICAL",
  FRIENDLY = "FRIENDLY",
  CTO_PITCH = "CTO_PITCH",
}

export class GenerateProposalDto {
  @IsString()
  jobLeadId!: string;

  @IsEnum(ProposalVariantDto)
  variant!: ProposalVariantDto;
}
