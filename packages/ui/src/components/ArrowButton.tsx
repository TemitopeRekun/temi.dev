"use client";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type Props = {
  label: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export const ArrowButton = forwardRef<HTMLButtonElement, Props>(function ArrowButton(
  { label, className, ...rest },
  ref
) {
  const base =
    "group inline-flex items-center gap-2 rounded-full border border-current px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface)]/60 transition-colors";
  return (
    <button ref={ref} className={[base, className].filter(Boolean).join(" ")} {...rest}>
      <span>{label}</span>
      <span
        aria-hidden
        className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
});

