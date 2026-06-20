/**
 * Builds a pgvector literal (e.g. `'[0.1, 0.2]'::vector`) from an embedding.
 * Non-finite values are coerced to 0 so the SQL never breaks. Shared by every
 * call site that interpolates an embedding into a raw query so the formatting
 * (fixed 6-decimal precision, cast) stays consistent.
 */
export function toVectorLiteral(embedding: number[]): string {
  const values = embedding
    .map((v) => (Number.isFinite(v) ? v.toFixed(6) : "0"))
    .join(", ");
  return `'[${values}]'::vector`;
}
