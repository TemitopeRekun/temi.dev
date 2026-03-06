import type { ReactNode } from "react";
import { Navbar } from "../../components/nav/Navbar";
import { Footer } from "../../components/contact/Footer";
import { createLeadAction } from "./actions";
import { FooterReveal } from "../../components/ui/FooterReveal";

export default function PublicLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <div className="relative z-10 bg-[var(--bg)] shadow-2xl">
        <Navbar />
        <div className="pt-16 min-h-screen">{props.children}</div>
      </div>
      <FooterReveal>
        <Footer action={createLeadAction} />
      </FooterReveal>
    </>
  );
}
