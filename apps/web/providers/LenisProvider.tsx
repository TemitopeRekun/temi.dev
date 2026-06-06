"use client";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
};

export function LenisProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const timer1 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 100);
    const timer2 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 800);

    const update = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Jump to top instantly on every route change so the new page starts at 0
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
