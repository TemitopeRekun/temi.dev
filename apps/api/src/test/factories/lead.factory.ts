import { faker } from "@faker-js/faker";

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  service: string | null;
  score: number;
  status: string;
  createdAt: Date;
};

export function makeLead(overrides: Partial<LeadRecord> = {}): LeadRecord {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    company: faker.company.name(),
    message: faker.lorem.paragraph(),
    service: faker.helpers.arrayElement(["ai automation", "web", null]),
    score: faker.number.int({ min: 0, max: 40 }),
    status: "new",
    createdAt: faker.date.recent(),
    ...overrides,
  };
}
