"use client";
import type { MouseEventHandler, ReactNode } from "react";
import { createElement } from "react";

type WarmCardTag = "div" | "article" | "li";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: string;
  as?: WarmCardTag;
  onClick?: MouseEventHandler<HTMLElement>;
};

export function WarmCard({
  children,
  className,
  padding = "p-6",
  as = "div",
  onClick,
}: Props) {
  const classes = ["card-warm", padding, className].filter(Boolean).join(" ");

  return createElement(as, {
    className: classes,
    onClick,
    children: <div className="relative z-10">{children}</div>,
  });
}
