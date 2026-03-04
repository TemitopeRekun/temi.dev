"use client";
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLParagraphElement>, "className" | "children">;

export function Text({ children, className, ...rest }: Props) {
  const classes = [
    "text-base leading-7 text-[var(--text)] font-sans",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <p className={classes} {...rest}>
      {children}
    </p>
  );
}
