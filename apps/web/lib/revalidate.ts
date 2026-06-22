import { revalidateTag } from "next/cache";

/**
 * Cache tags attached to the public content fetches (lib/blog.ts,
 * lib/projects.ts). Admin write routes call `revalidateContent` with these
 * after a successful mutation so a publish/edit is reflected on the public site
 * within seconds, rather than waiting out the time-based ISR window.
 */
export const CONTENT_TAG = {
  posts: "posts",
  projects: "projects",
} as const;

/**
 * Invalidate one or more cache tags. `revalidateTag` throws when called outside
 * a request/render scope (e.g. in unit tests); that is treated as a no-op so
 * callers never need to guard it.
 */
export function revalidateContent(...tags: string[]): void {
  for (const tag of tags) {
    try {
      revalidateTag(tag);
    } catch {
      // No request scope (unit test / non-Next context) — nothing to do.
    }
  }
}
