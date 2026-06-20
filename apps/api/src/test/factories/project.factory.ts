import { faker } from "@faker-js/faker";

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string | null;
  category: string;
  year: number;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  coverImage: string | null;
  featured: boolean;
  order: number;
};

export function makeProject(
  overrides: Partial<ProjectRecord> = {},
): ProjectRecord {
  return {
    id: faker.string.uuid(),
    slug: faker.lorem.slug(),
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    body: faker.lorem.paragraphs(2),
    category: faker.helpers.arrayElement(["Web", "AI", "Other"]),
    year: faker.number.int({ min: 2020, max: 2026 }),
    techStack: faker.helpers.arrayElements(
      ["TypeScript", "NestJS", "React", "Prisma"],
      2,
    ),
    liveUrl: faker.internet.url(),
    repoUrl: faker.internet.url(),
    coverImage: faker.image.url(),
    featured: false,
    order: faker.number.int({ min: 0, max: 10 }),
    ...overrides,
  };
}
