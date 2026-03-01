import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: Props) {
  return (
    <section
      id={id}
      className={[
        "py-16 sm:py-20 lg:py-28 bg-[var(--bg)] text-[var(--text)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
