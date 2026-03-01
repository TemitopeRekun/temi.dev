import { IsString } from "class-validator";

export class CsvImportDto {
  @IsString()
  csv!: string;
}
