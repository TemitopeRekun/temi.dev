/**
 * Cursor pagination helper for the "fetch take+1" pattern.
 *
 * Callers fetch `take + 1` rows ordered by a stable, total ordering (the sort
 * columns MUST end in a unique tiebreaker such as `id`, otherwise the cursor
 * boundary is ambiguous and rows can be skipped or duplicated across pages).
 *
 * When more than `take` rows come back there is a next page: we drop the
 * lookahead row and set `nextCursor` to the id of the LAST RETURNED row. The
 * next page is then queried with `cursor: { id: nextCursor }, skip: 1`, which
 * resumes immediately after the last row shown — so no row is ever skipped.
 *
 * (Using the popped lookahead row as the cursor is a classic off-by-one: with
 * `skip: 1` that row would be skipped on the next page and never shown.)
 */
export function applyCursorPage<T extends { id: string }>(
  rows: T[],
  take: number,
): { items: T[]; nextCursor?: string } {
  if (rows.length > take) {
    rows.pop();
    return { items: rows, nextCursor: rows[rows.length - 1]?.id };
  }
  return { items: rows };
}
