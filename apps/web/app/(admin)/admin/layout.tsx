import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Defense-in-depth against indexing. `robots.txt` disallows /admin, but that is
 * advisory and a disallowed URL can still be listed if something links to it —
 * robots.txt prevents crawling, not indexing. A `noindex` header is the
 * directive that actually keeps these pages out of results.
 *
 * This layout wraps every admin route, including `/admin/login`, which sits
 * outside the `(protected)` group and would otherwise be uncovered.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout(
  props: Readonly<{ children: ReactNode }>,
): ReactNode {
  return props.children;
}
