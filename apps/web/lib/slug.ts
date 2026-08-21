/**
 * Slug helpers for the admin editor.
 *
 * The authoritative contract lives in the API — `apps/api/src/common/utils/slug.ts`
 * exports the same pattern and rejects non-conforming slugs at the DTO boundary.
 * This copy exists so the editor can derive and tidy a slug as the author types
 * instead of surfacing a 400 after submit; keep the two in sync.
 */

/** Mirrors `SLUG_PATTERN` in the API. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

function foldAccents(input: string): string {
  return input.normalize("NFKD").replace(/\p{M}/gu, "");
}

/**
 * Full normalisation — the exact shape the API accepts. Use on blur and before
 * submit, not on every keystroke: it strips trailing hyphens, so applying it
 * mid-typing would make hyphens impossible to enter.
 */
export function slugify(input: string): string {
  return foldAccents(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Typing-safe normalisation. Lowercases, folds accents and collapses invalid
 * characters, but leaves a trailing hyphen alone so the author can keep typing
 * past a word boundary. `slugify` finishes the job on blur.
 */
export function slugifyWhileTyping(input: string): string {
  return foldAccents(input)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "");
}
