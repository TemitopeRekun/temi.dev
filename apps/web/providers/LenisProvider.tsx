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

    // Automatically refresh ScrollTrigger AND Lenis whenever the DOM height changes (hydration, images, etc.)
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      lenis.resize();
    });
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Initial refreshes to ensure perfect alignment after Next.js hydration and rendering
    const timer1 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 100);
    const timer2 = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 800);

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
      resizeObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
