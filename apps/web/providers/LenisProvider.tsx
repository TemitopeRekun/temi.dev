"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
};

export function LenisProvider({ children }: Props) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Initial refreshes to ensure perfect alignment after Next.js hydration and rendering
    const timer1 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 100);
    const timer2 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 800);
    const timer3 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 1500);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    // This ensures GSAP animations differ from Lenis scroll updates
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Disable lag smoothing in GSAP to prevent jumpy animations during heavy loads
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
