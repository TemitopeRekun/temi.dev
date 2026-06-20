import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class BlogAdminListQueryDto {
  @ApiPropertyOptional({ description: "Page size (default 20, max 100)" })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  take?: number;

  @ApiPropertyOptional({ description: "Cursor id for pagination" })
  @IsOptional()
  @IsString()
  cursor?: string;
}
