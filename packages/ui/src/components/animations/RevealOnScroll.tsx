"use client";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ScrollTriggerInstance } from "gsap/ScrollTrigger";

// register plugin once in this module scope
let registered = false;
function ensureRegister() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Distance in pixels to slide up from
   */
  offsetY?: number;
  /**
   * Trigger element selector relative to the wrapper
   */
  triggerSelector?: string | null;
};

export function RevealOnScroll({
  children,
  className,
  offsetY = 24,
  triggerSelector = null,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const triggers = useRef<ScrollTriggerInstance[]>([]);

  useEffect(() => {
    ensureRegister();
    const el = ref.current;
    if (!el) return;

    const target: HTMLElement = triggerSelector
      ? ((el.querySelector(triggerSelector) as HTMLElement) ?? el)
      : el;

    const mm = gsap.matchMedia();

    const setup = () => {
      const ctx = gsap.context(() => {
        // set initial state
        gsap.set(el, { opacity: 0, y: offsetY });
        // will-change only while animating
        el.style.willChange = "transform, opacity";
        const tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.8, ease: "power3.out" },
          onComplete: () => {
            el.style.willChange = "";
          },
        });
        tl.to(el, { opacity: 1, y: 0 });
        const trig = ScrollTrigger.create({
          trigger: target,
          start: "top 85%",
          once: true,
          onEnter: () => tl.play(),
        });
        triggers.current.push(trig);
      }, el);
      return () => ctx.revert();
    };

    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      },
      () => {
        const teardown = setup();
        return () => {
          teardown();
        };
      },
    );

    return () => {
      mm.kill();
      triggers.current.forEach((st) => st.kill());
      triggers.current = [];
    };
  }, [offsetY, triggerSelector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
