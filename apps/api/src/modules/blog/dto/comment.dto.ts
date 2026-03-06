import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  author!: string;

  @ApiProperty()
  createdAt!: Date;
}
