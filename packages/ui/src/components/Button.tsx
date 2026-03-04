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
        "bg-[linear-gradient(135deg,var(--accent),var(--accent2))] text-white",
        "border-0",
        "hover:opacity-[0.92] hover:shadow-[0_0_20px_var(--accent-glow-strong)] hover:-translate-y-px",
        "active:translate-y-0 active:opacity-[0.85]"
      ].join(" ");
    case "outline":
    case "ghost":
      return [
        "bg-transparent text-[var(--text)]",
        "border border-[var(--border)]",
        "hover:border-[var(--border-hover)] hover:bg-[var(--surface2)] hover:shadow-[0_0_12px_var(--accent-glow)]"
      ].join(" ");
    default:
      return "";
  }
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, className, variant = "primary", magnetic = true, ...rest },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-[0.875rem] font-medium [transition:all_250ms_ease]";
  const classes = [base, variantClasses(variant), className].filter(Boolean).join(" ");
  const btn = (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
  return magnetic ? <MagneticWrapper strength={10}>{btn}</MagneticWrapper> : btn;
});
