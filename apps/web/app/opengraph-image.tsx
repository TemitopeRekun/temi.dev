import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Temitope Ogunrekun — Full-Stack Engineer";

export default function OgImage() {
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
        {/* Background texture — subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(226,201,126,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(226,201,126,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Right side glow */}
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

        {/* Top row — domain */}
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
            temi.dev
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
              FULL-STACK ENGINEER · LAGOS, NIGERIA
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              color: "#f5f5f5",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-3px",
            }}
          >
            Temitope
            <br />
            <span style={{ color: "rgba(245,245,245,0.2)" }}>Ogunrekun.</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "rgba(245,245,245,0.45)",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "-0.2px",
              maxWidth: 560,
              lineHeight: 1.5,
              marginTop: 8,
            }}
          >
            Building production-grade systems, AI-powered products,
            and the infrastructure that scales.
          </div>
        </div>

        {/* Bottom row — stack tags */}
        <div style={{ display: "flex", gap: 10 }}>
          {["Node.js", "TypeScript", "React", "NestJS", "React Native", "AI/LLM"].map(
            (tag) => (
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
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
