import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateLeadDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(180)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  company?: string | null;

  @IsString()
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  service?: string | null;

  /**
   * Honeypot field. It is rendered hidden in the UI and left blank by real
   * users; bots that auto-fill every input populate it. Any non-empty value is
   * rejected by validation (`@IsEmpty`), so spam never reaches the database.
   */
  @IsOptional()
  @IsEmpty()
  website?: string;
}

