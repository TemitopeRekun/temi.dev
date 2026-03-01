"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";

type Props = {
  children: ReactNode;
};

export function LenisProvider({ children }: Props) {
  useEffect(() => {
    const lenis: Lenis & { destroy?: () => void } = new (Lenis as unknown as {
      new (opts: Record<string, unknown>): Lenis;
    })({
      lerp: 0.1,
      smoothTouch: false,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof lenis.destroy === "function") {
        lenis.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
