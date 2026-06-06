import { ImageResponse } from "next/og";
import { getProjectBySlug } from "../../../../lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const title = truncate(project?.title ?? "Case Study", 80);
  const description = truncate(project?.description ?? "", 130);
  const category = project?.category ?? "";
  const year = project?.year ? String(project.year) : "";
  const tags = project?.tags?.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(226,201,126,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(226,201,126,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Right glow */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(226,201,126,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#141414",
              border: "1px solid rgba(226,201,126,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e2c97e",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            TO
          </div>
          <span
            style={{ color: "rgba(245,245,245,0.5)", fontSize: 18, letterSpacing: "0.08em" }}
          >
            temi.dev
          </span>
          {category && (
            <>
              <span style={{ color: "rgba(245,245,245,0.2)", fontSize: 18 }}>/</span>
              <span
                style={{
                  color: "#e2c97e",
                  fontSize: 14,
                  letterSpacing: "0.05em",
                  padding: "4px 12px",
                  borderRadius: 4,
                  border: "1px solid rgba(226,201,126,0.2)",
                }}
              >
                {category}
              </span>
              {year && (
                <span style={{ color: "rgba(245,245,245,0.3)", fontSize: 14 }}>
                  {year}
                </span>
              )}
            </>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 32, height: 1, background: "#e2c97e" }} />
            <span
              style={{
                color: "#e2c97e",
                fontSize: 14,
                letterSpacing: "0.2em",
                fontWeight: 500,
              }}
            >
              CASE STUDY
            </span>
          </div>

          <div
            style={{
              color: "#f5f5f5",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                color: "rgba(245,245,245,0.45)",
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom row — tech tags */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "7px 16px",
                  background: "rgba(245,245,245,0.05)",
                  border: "1px solid rgba(245,245,245,0.1)",
                  borderRadius: 6,
                  color: "rgba(245,245,245,0.5)",
                  fontSize: 14,
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(245,245,245,0.25)",
              fontSize: 13,
            }}
          >
            <span>Temitope Ogunrekun</span>
            <span style={{ width: 1, height: 12, background: "rgba(245,245,245,0.15)" }} />
            <span>Full-Stack Engineer</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
