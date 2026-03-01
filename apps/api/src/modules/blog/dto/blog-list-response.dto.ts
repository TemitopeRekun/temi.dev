import { BlogSummaryDto } from "./blog-summary.dto";

export class BlogListResponseDto {
  items!: BlogSummaryDto[];
  nextCursor?: string;
}
