/**
 * URL slug normalisation and validation.
 *
 * Slugs land in canonical tags, sitemap entries and Open Graph URLs, so a slug
 * containing spaces or uppercase characters is not merely untidy — it is served
 * percent-encoded (`My Post` becomes `My%20Post`), which reads as broken, is
 * re-encoded inconsistently by some clients, and loses the keyword-in-path
 * signal a clean slug carries.
 *
 * `SLUG_PATTERN` is the contract enforced at the DTO boundary; `slugify` is the
 * normaliser used to derive a conforming slug from arbitrary text.
 */

/**
 * Lowercase alphanumerics separated by single hyphens, no leading or trailing
 * hyphen. Anchored, because `class-validator`'s `@Matches` would otherwise test
 * for a match anywhere in the string.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** True when `value` is already a well-formed slug and needs no rewriting. */
export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

/**
 * Derive a URL-safe slug from arbitrary text.
 *
 * Accented characters are decomposed to their base letter (`í` becomes `i`)
 * rather than dropped, so a title like "Martínez" slugs to `martinez` instead
 * of `martnez`. Everything else outside `[a-z0-9]` collapses to a single
 * hyphen.
 *
 * Returns an empty string when the input has no usable characters — callers
 * must handle that case rather than storing an empty slug.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
