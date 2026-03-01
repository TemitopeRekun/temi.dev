"use client";
import type { ReactNode } from "react";
import { Children, isValidElement, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ScrollTriggerInstance } from "gsap/ScrollTrigger";

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
  stagger?: number;
  offsetY?: number;
};

export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  offsetY = 20,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const triggers = useRef<ScrollTriggerInstance[]>([]);

  useEffect(() => {
    ensureRegister();
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return;

    const mm = gsap.matchMedia();

    const setup = () => {
      const ctx = gsap.context(() => {
        gsap.set(items, { opacity: 0, y: offsetY });
        items.forEach((i) => (i.style.willChange = "transform, opacity"));
        const tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.6, ease: "power3.out" },
          onComplete: () => {
            items.forEach((i) => (i.style.willChange = ""));
          },
        });
        tl.to(items, { opacity: 1, y: 0, stagger });
        const trig = ScrollTrigger.create({
          trigger: el,
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
      triggers.current.forEach((t) => t.kill());
      triggers.current = [];
    };
  }, [offsetY, stagger]);

  // Ensure we only render element children directly to measure
  const normalized = Children.map(children, (child) =>
    isValidElement(child) ? child : null,
  );

  return (
    <div ref={ref} className={className}>
      {normalized}
    </div>
  );
}
