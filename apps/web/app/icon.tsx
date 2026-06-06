import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f5f5f5",
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 5,
            width: 8,
            height: 1.5,
            background: "#d4af37",
            borderRadius: 999,
          }}
        />
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.06em",
          }}
        >
          T
        </span>
      </div>
    ),
    size
  );
}
