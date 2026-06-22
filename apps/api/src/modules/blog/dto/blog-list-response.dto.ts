import type { ListResponse } from "@temi/types";
import { BlogSummaryDto } from "./blog-summary.dto";

export class BlogListResponseDto implements ListResponse<BlogSummaryDto> {
  items!: BlogSummaryDto[];
  nextCursor?: string;
}
