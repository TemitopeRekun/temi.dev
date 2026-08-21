/**
 * Rewrite blog-post and project slugs that do not conform to SLUG_PATTERN.
 *
 * A slug containing spaces or uppercase characters is served percent-encoded
 * (`My Post` -> `My%20Post`) in canonical tags, sitemap entries and OG URLs.
 * The DTOs now reject such slugs on write, but rows created before that
 * validation existed still need fixing — hence this one-off.
 *
 * Renaming a slug changes a live, possibly-linked URL, so the script is
 * dry-run by default and prints exactly what it would do. Re-run with APPLY=1
 * to commit. Add a redirect from each old path (see `next.config.ts`) before
 * applying, so existing inbound links do not 404.
 *
 * Usage:
 *   pnpm --filter api fix:slugs            # report only
 *   APPLY=1 pnpm --filter api fix:slugs    # perform the renames
 */
import "reflect-metadata";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { isValidSlug, slugify } from "../common/utils/slug";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
})
class ScriptModule {}

type Row = { id: string; slug: string; title: string };

/**
 * Pick a conforming slug for `row` that collides with nothing in `taken`.
 * Falls back to the id-suffixed form when the title yields nothing usable, so
 * the script never writes an empty slug.
 */
function planSlug(row: Row, taken: Set<string>): string {
  const base = slugify(row.slug) || slugify(row.title) || `post-${row.id}`;
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/**
 * One model's worth of work. Passed as closures rather than a Prisma delegate:
 * unioning two delegates collapses their generic call signatures into something
 * TypeScript will not let you invoke.
 */
type Target = {
  label: string;
  /** Public URL prefix, used to print the redirect that each rename needs. */
  urlPrefix: string;
  findAll: () => Promise<Row[]>;
  rename: (id: string, slug: string) => Promise<unknown>;
};

async function processTarget(target: Target, apply: boolean): Promise<number> {
  const rows = await target.findAll();

  // Seed `taken` with every current slug so a rename cannot collide with a row
  // this run is not touching.
  const taken = new Set(rows.map((r) => r.slug));
  const bad = rows.filter((r) => !isValidSlug(r.slug));

  console.log(
    `\n${target.label}: ${rows.length} rows, ${bad.length} non-conforming`,
  );

  for (const row of bad) {
    taken.delete(row.slug);
    const next = planSlug(row, taken);
    taken.add(next);

    console.log(`  ${row.slug}`);
    console.log(`    -> ${next}`);
    console.log(
      `    redirect: ${target.urlPrefix}/${encodeURIComponent(row.slug)}`,
    );

    if (apply) {
      await target.rename(row.id, next);
      console.log("    applied");
    }
  }

  return bad.length;
}

async function main(): Promise<void> {
  const apply = process.env.APPLY === "1";
  const app = await NestFactory.createApplicationContext(ScriptModule);
  const prisma = app.get(PrismaService);

  const targets: Target[] = [
    {
      label: "blogPost",
      urlPrefix: "/blog",
      findAll: () =>
        prisma.blogPost.findMany({
          select: { id: true, slug: true, title: true },
        }),
      rename: (id, slug) =>
        prisma.blogPost.update({ where: { id }, data: { slug } }),
    },
    {
      label: "project",
      urlPrefix: "/work",
      findAll: () =>
        prisma.project.findMany({
          select: { id: true, slug: true, title: true },
        }),
      rename: (id, slug) =>
        prisma.project.update({ where: { id }, data: { slug } }),
    },
  ];

  let renames = 0;
  for (const target of targets) {
    renames += await processTarget(target, apply);
  }

  if (renames === 0) {
    console.log("\nAll slugs already conform. Nothing to do.");
  } else if (!apply) {
    console.log(
      `\nDry run: ${renames} rename(s) planned. Re-run with APPLY=1 to commit.`,
    );
  } else {
    console.log(`\nApplied ${renames} rename(s).`);
  }

  await app.close();
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
