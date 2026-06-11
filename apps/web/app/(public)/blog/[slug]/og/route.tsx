import { ImageResponse } from "next/og";
import { getPostBySlug } from "../../../../../lib/blog";

// Plain Route Handler (not the `opengraph-image` metadata convention) because
// dynamic metadata-image conventions 404 when nested inside a route group on
// Next 15.5.x. This is referenced explicitly from generateMetadata + cards.
const size = { width: 1200, height: 630 };

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = truncate(post?.title ?? "Blog Post", 80);
  const excerpt = truncate(post?.excerpt ?? "", 150);
  const tag = post?.tag ?? "";
  const readTime = post?.readTime ?? 3;

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
            style={{
              color: "rgba(245,245,245,0.5)",
              fontSize: 18,
              letterSpacing: "0.08em",
            }}
          >
            temitope.live
          </span>
          {tag && (
            <>
              <span style={{ color: "rgba(245,245,245,0.2)", fontSize: 18 }}>
                /
              </span>
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
                {tag}
              </span>
              <span
                style={{
                  color: "rgba(245,245,245,0.3)",
                  fontSize: 14,
                }}
              >
                {readTime} min read
              </span>
            </>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 900,
          }}
        >
          {/* Eyebrow */}
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
              BLOG
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              color: "#f5f5f5",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* Excerpt */}
          {excerpt && (
            <div
              style={{
                color: "rgba(245,245,245,0.45)",
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: "-0.1px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {excerpt}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "rgba(245,245,245,0.25)",
            fontSize: 13,
            letterSpacing: "0.05em",
          }}
        >
          <span>Temitope Ogunrekun</span>
          <span
            style={{
              width: 1,
              height: 12,
              background: "rgba(245,245,245,0.15)",
            }}
          />
          <span>Full-Stack Engineer</span>
          <span
            style={{
              width: 1,
              height: 12,
              background: "rgba(245,245,245,0.15)",
            }}
          />
          <span>temitope.live</span>
        </div>
      </div>
    ),
    { width: size.width, height: size.height },
  );
}
