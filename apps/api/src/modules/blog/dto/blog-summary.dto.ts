export class BlogSummaryDto {
  id!: string;
  slug!: string;
  title!: string;
  excerpt?: string | null;
  tags!: string[];
  publishedAt!: Date | null;
  viewCount!: number;
}
