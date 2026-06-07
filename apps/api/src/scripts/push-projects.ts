/**
 * Push the real portfolio projects to a running API via the admin endpoints.
 *
 * Unlike the seed (which needs direct DB access and inserts by title), this talks
 * to the HTTP API: it logs in as admin, then upserts each project by slug. It works
 * against any reachable API — local or production.
 *
 * Usage:
 *   API_BASE_URL=https://api.example.com \
 *   ADMIN_EMAIL=admin@temi.dev ADMIN_PASSWORD=*** \
 *   pnpm --filter api push:projects
 *
 *   # also delete any project whose slug isn't one of ours (the old placeholders):
 *   PRUNE=1 ... pnpm --filter api push:projects
 */
import { PROJECTS } from "./seed-data";

const API = (process.env.API_BASE_URL ?? "http://localhost:4000").replace(
  /\/+$/,
  "",
);
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const PRUNE = process.env.PRUNE === "1";

type ExistingProject = { id: string; slug: string; title: string };

async function login(): Promise<string> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }
  const { accessToken } = (await res.json()) as { accessToken: string };
  return accessToken;
}

async function main(): Promise<void> {
  if (!EMAIL || !PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
    process.exit(1);
  }

  console.log(`Target API: ${API}`);
  const token = await login();
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const existing = (await (
    await fetch(`${API}/api/projects`)
  ).json()) as ExistingProject[];
  const bySlug = new Map(existing.map((p) => [p.slug, p]));
  const realSlugs = new Set(PROJECTS.map((p) => p.slug));

  for (const p of PROJECTS) {
    const dto = {
      slug: p.slug,
      title: p.title,
      description: p.description,
      body: p.body,
      category: p.category,
      year: p.year,
      techStack: p.techStack,
      liveUrl: p.liveUrl || null,
      repoUrl: p.repoUrl || null,
      featured: p.featured,
      order: p.order,
    };
    const found = bySlug.get(p.slug);
    const res = found
      ? await fetch(`${API}/api/admin/projects/${found.id}`, {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify(dto),
        })
      : await fetch(`${API}/api/admin/projects`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(dto),
        });
    const verb = found ? "updated" : "created";
    console.log(
      res.ok ? `✓ ${verb}: ${p.slug}` : `✗ FAILED (${res.status}): ${p.slug}`,
    );
  }

  const stale = existing.filter((p) => !realSlugs.has(p.slug));
  if (stale.length === 0) {
    console.log("No stale projects.");
  } else if (PRUNE) {
    for (const p of stale) {
      const res = await fetch(`${API}/api/admin/projects/${p.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      console.log(
        res.ok
          ? `✓ deleted stale: ${p.title} (${p.slug})`
          : `✗ FAILED delete (${res.status}): ${p.title}`,
      );
    }
  } else {
    console.log(
      `\n${stale.length} stale project(s) left in place (run with PRUNE=1 to delete):`,
    );
    stale.forEach((p) => console.log(`  - ${p.title} (${p.slug})`));
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
