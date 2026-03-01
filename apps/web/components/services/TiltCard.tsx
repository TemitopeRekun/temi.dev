"use client";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

export function TiltCard({ children, className, maxTilt = 10 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (dy / rect.height) * -2 * maxTilt;
      const ry = (dx / rect.width) * 2 * maxTilt;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [maxTilt]);

  return (
    <div
      ref={ref}
      className={[
        "transform-gpu transition-transform duration-200",
        "transform-[rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ perspective: "1000px" } as CSSProperties}
    >
      {children}
    </div>
  );
}
