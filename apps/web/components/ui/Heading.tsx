"use client";
import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { registerGSAP } from "../../lib/gsap";

type HeadingSize = "h1" | "h2" | "h3" | "h4";

type Props = {
  children: ReactNode;
  className?: string;
  size?: HeadingSize;
  animate?: boolean;
  as?: HeadingSize;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "className">;

function sizeClasses(size: HeadingSize): string {
  switch (size) {
    case "h1":
      return "text-5xl sm:text-6xl lg:text-7xl leading-[1.05]";
    case "h2":
      return "text-4xl sm:text-5xl lg:text-6xl leading-tight";
    case "h3":
      return "text-3xl sm:text-4xl lg:text-5xl leading-snug";
    case "h4":
    default:
      return "text-2xl sm:text-3xl lg:text-4xl leading-snug";
  }
}

export function Heading({
  children,
  className,
  size = "h1",
  animate = false,
  as,
}: Props) {
  const Tag = as ?? size;
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    if (!animate) return cleanup ?? undefined;
    const el = ref.current;
    if (!el) return cleanup ?? undefined;

    let splitTargets: Element[] = [];
    let tl: gsap.core.Timeline | null = null;
    const mm = gsap.matchMedia();

    type SplitTextInstance = {
      words?: Element[];
      lines?: Element[];
      chars?: Element[];
      revert?: () => void;
    };
    type SplitTextConstructor = new (
      element: Element | Element[] | string,
      options?: Record<string, unknown>,
    ) => SplitTextInstance;

    const run = async () => {
      await registerGSAP();
      const mod = await import("gsap/SplitText").catch(
        () => null as unknown as { SplitText?: SplitTextConstructor } | null,
      );
      const SplitTextCtor: SplitTextConstructor | null =
        mod && "SplitText" in (mod as object)
          ? (mod as { SplitText: SplitTextConstructor }).SplitText
          : null;

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        () => {
          if (SplitTextCtor) {
            const split = new SplitTextCtor(el, { type: "lines,words" });
            splitTargets = split.words ?? [];
            el.style.willChange = "opacity, transform";
            gsap.set(splitTargets, { opacity: 0, y: 24 });
            tl = gsap.timeline({
              defaults: { duration: 0.7, ease: "power3.out" },
              onComplete: () => {
                el.style.willChange = "";
              },
            });
            tl.to(splitTargets, { opacity: 1, y: 0, stagger: 0.035 });
          } else {
            el.style.willChange = "opacity, transform";
            gsap.fromTo(
              el,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                onComplete: () => {
                  el.style.willChange = "";
                },
              },
            );
          }
          return () => {};
        },
      );
    };

    run().catch(() => {});

    cleanup = () => {
      if (tl) {
        tl.kill();
        tl = null;
      }
      if (splitTargets.length > 0) {
        gsap.set(splitTargets, { clearProps: "all" });
        splitTargets = [];
      }
      mm.kill();
    };

    return cleanup;
  }, [animate]);

  const classes = [
    "tracking-tight text-[var(--text)]",
    sizeClasses(size),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // eslint-disable-next-line react/no-unknown-property
    <Tag ref={ref as never} className={classes}>
      {children}
    </Tag>
  );
}
