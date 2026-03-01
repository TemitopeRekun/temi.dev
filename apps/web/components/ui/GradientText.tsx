"use client";
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /**
   * Optional override for gradient CSS value
   */
  gradient?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function GradientText({
  children,
  className,
  as: Tag = "span",
  gradient,
  ...rest
}: Props) {
  const classes = ["bg-clip-text text-transparent", className].filter(Boolean).join(" ");
  const background = gradient ?? "linear-gradient(90deg, var(--accent-pop) 0%, var(--accent) 100%)";
  return (
    // eslint-disable-next-line react/no-unknown-property
    <Tag className={classes} style={{ background }} {...rest}>
      {children}
    </Tag>
  );
}

