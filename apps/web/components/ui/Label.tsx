"use client";
import { createElement } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export function Label({
  children,
  className,
  as: Tag = "span",
  ...rest
}: Props) {
  const classes = ["uppercase tracking-[0.2em] text-xs text-[var(--muted)]", className]
    .filter(Boolean)
    .join(" ");
  return createElement(Tag, {
    className: classes,
    style: { fontFamily: "var(--font-dm-mono)" },
    ...rest,
    children,
  });
}

