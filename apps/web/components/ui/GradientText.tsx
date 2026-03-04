"use client";
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Optional override for gradient CSS value
   */
  gradient?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function GradientText({
  children,
  className,
  gradient,
  ...rest
}: Props) {
  const classes = ["bg-clip-text text-transparent", className]
    .filter(Boolean)
    .join(" ");
  const background =
    gradient ??
    "linear-gradient(90deg, var(--accent-pop) 0%, var(--accent) 100%)";
  return (
    <span className={classes} style={{ background }} {...rest}>
      {children}
    </span>
  );
}
