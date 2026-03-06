"use client";
import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { MagneticWrapper } from "@temi/ui";

type BaseProps = {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type RoundedButtonProps = ButtonProps | AnchorProps;

export function RoundedButton({
  children,
  accentColor = "var(--accent)",
  className = "",
  href,
  ...rest
}: RoundedButtonProps) {
  const circle = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const tid = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(
        circle.current,
        { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" },
        "enter",
      )
      .to(
        circle.current,
        { top: "-150%", width: "125%", duration: 0.25 },
        "exit",
      );
    return () => {
      timeline.current?.kill();
    };
  }, []);

  const onEnter = () => {
    if (tid.current) clearTimeout(tid.current);
    timeline.current?.tweenFromTo("enter", "exit");
  };
  const onLeave = () => {
    tid.current = setTimeout(() => timeline.current?.play(), 300);
  };

  const commonProps = {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    className: [
      "relative inline-flex items-center justify-center",
      "px-8 py-3.5 rounded-full border border-(--text) cursor-pointer",
      "text-sm font-medium text-(--text)",
      "overflow-hidden",
      className,
    ].join(" "),
  };

  const content = (
    <>
      <span className="relative z-10 mix-blend-difference">{children}</span>
      <div
        ref={circle}
        style={{ backgroundColor: accentColor }}
        className="absolute w-full h-[150%] rounded-full top-full left-1/2 -translate-x-1/2 pointer-events-none"
      />
    </>
  );

  return (
    <MagneticWrapper>
      {href ? (
        <a href={href} {...(rest as AnchorProps)} {...commonProps}>
          {content}
        </a>
      ) : (
        <button type="button" {...(rest as ButtonProps)} {...commonProps}>
          {content}
        </button>
      )}
    </MagneticWrapper>
  );
}
