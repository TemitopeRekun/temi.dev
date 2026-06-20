import { faker } from "@faker-js/faker";

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  tags: string[];
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function makeBlogPost(
  overrides: Partial<BlogPostRecord> = {},
): BlogPostRecord {
  const now = faker.date.recent();
  return {
    id: faker.string.uuid(),
    slug: faker.lorem.slug(),
    title: faker.lorem.sentence(),
    excerpt: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    tags: faker.helpers.arrayElements(["nestjs", "ai", "web", "prisma"], 2),
    coverImage: faker.image.url(),
    published: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
