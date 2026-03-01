"use client";
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
} & Omit<HTMLAttributes<HTMLParagraphElement>, "className" | "children">;

export function Text({ children, className, as: Tag = "p", ...rest }: Props) {
  const classes = ["text-base leading-7 text-[var(--text)] font-sans", className]
    .filter(Boolean)
    .join(" ");
  return (
    // eslint-disable-next-line react/no-unknown-property
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

