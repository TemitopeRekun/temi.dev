"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { MagneticWrapper } from "./animations/MagneticWrapper";

type ButtonVariant = "primary" | "ghost" | "outline";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  magnetic?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return [
        "bg-[var(--accent)] text-[var(--bg)]",
        "border border-transparent",
        "hover:opacity-95",
        "active:opacity-90"
      ].join(" ");
    case "outline":
      return [
        "bg-transparent text-[var(--text)]",
        "border border-current",
        "hover:bg-[var(--surface)]/60",
        "active:bg-[var(--surface)]"
      ].join(" ");
    case "ghost":
    default:
      return [
        "bg-transparent text-[var(--text)]",
        "border border-transparent",
        "hover:bg-[var(--surface)]/50",
        "active:bg-[var(--surface)]/70"
      ].join(" ");
  }
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, className, variant = "primary", magnetic = true, ...rest },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors";
  const classes = [base, variantClasses(variant), className].filter(Boolean).join(" ");
  const btn = (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
  return magnetic ? <MagneticWrapper strength={10}>{btn}</MagneticWrapper> : btn;
});

