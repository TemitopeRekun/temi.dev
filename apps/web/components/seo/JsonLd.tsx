/**
 * Renders a JSON-LD structured-data block. Server-safe and shared across pages
 * so every schema.org payload is emitted consistently (escaped, hydration-safe).
 */
type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      // JSON.stringify output is inert data; "<" is escaped to avoid any chance
      // of breaking out of the <script> context.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
