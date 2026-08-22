export class BlogDetailDto {
  id!: string;
  slug!: string;
  title!: string;
  excerpt?: string | null;
  content!: string;
  tags!: string[];
  publishedAt!: Date | null;
  /**
   * Surfaced so the sitemap can report a truthful <lastmod>. Without it the
   * sitemap fell back to publishedAt, so an edited post never signalled that
   * it had changed.
   */
  updatedAt!: Date | null;
}
