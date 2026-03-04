"use client";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
type QuickTo = (value: number) => void;

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Maximum translation in pixels on each axis
   */
  strength?: number;
  /**
   * Whether to disable the magnetic effect
   */
  disabled?: boolean;
};

export function MagneticWrapper({
  children,
  className,
  strength = 12,
  disabled = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const quickTo = useRef<{ x: QuickTo; y: QuickTo } | null>(null);
  const cleanupFns = useRef<Array<() => void>>([]);

  const style = useMemo<CSSProperties>(() => ({ display: "inline-block" }), []);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner || disabled) return;

    quickTo.current = {
      x: gsap.quickTo(inner, "x", { duration: 0.3, ease: "power3.out" }),
      y: gsap.quickTo(inner, "y", { duration: 0.3, ease: "power3.out" }),
    };

    let active = false;

    const onEnter = () => {
      if (!active) {
        active = true;
        inner.style.willChange = "transform";
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!quickTo.current) return;
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const nx = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
      const ny = Math.max(-1, Math.min(1, dy / (rect.height / 2)));
      quickTo.current.x(nx * strength);
      quickTo.current.y(ny * strength);
    };

    const onLeave = () => {
      if (!quickTo.current) return;
      quickTo.current.x(0);
      quickTo.current.y(0);
      // clear will-change after the spring settles
      gsap.delayedCall(0.35, () => {
        if (inner) inner.style.willChange = "";
      });
      active = false;
    };

    root.addEventListener("pointerenter", onEnter, { passive: true });
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave, { passive: true });

    cleanupFns.current.push(() => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    });

    return () => {
      cleanupFns.current.forEach((fn) => fn());
      cleanupFns.current = [];
    };
  }, [disabled, strength]);

  return (
    <div ref={rootRef} className={className} style={style}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
