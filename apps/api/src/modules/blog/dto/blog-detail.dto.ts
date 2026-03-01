export class BlogDetailDto {
  id!: string;
  slug!: string;
  title!: string;
  excerpt?: string | null;
  content!: string;
  tags!: string[];
  publishedAt!: Date | null;
  viewCount!: number;
}
