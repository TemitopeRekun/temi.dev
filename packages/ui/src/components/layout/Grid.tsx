import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  cols?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: string;
};

function toCols(n?: number): string | null {
  if (!n) return null;
  return `grid-cols-${n}`;
}

export function Grid({
  children,
  className,
  cols = 1,
  sm,
  md,
  lg,
  xl,
  gap = "gap-6",
}: Props) {
  const classes = [
    "grid",
    gap,
    toCols(cols),
    sm ? `sm:grid-cols-${sm}` : null,
    md ? `md:grid-cols-${md}` : null,
    lg ? `lg:grid-cols-${lg}` : null,
    xl ? `xl:grid-cols-${xl}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
