import type { ReactElement } from "react";

/**
 * The "T" mark, rendered at an arbitrary pixel size.
 *
 * Shared between the 32px favicon (`app/icon.tsx`) and the 512px manifest icon
 * (`app/icon-512/route.tsx`) so the two cannot drift. Every dimension is
 * expressed as a fraction of `px`, because the original 32px artwork used fixed
 * pixel offsets that collapse to invisible slivers when scaled up.
 */
export function brandIconElement(px: number): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#f5f5f5",
        borderRadius: px * 0.25,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: px * 0.156,
          left: px * 0.156,
          width: px * 0.25,
          height: Math.max(1.5, px * 0.047),
          background: "#d4af37",
          borderRadius: 999,
        }}
      />
      <span
        style={{
          fontSize: px * 0.5625,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.06em",
        }}
      >
        T
      </span>
    </div>
  );
}
