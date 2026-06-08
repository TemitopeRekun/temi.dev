import type { ReactNode } from "react";
import { Navbar } from "../../components/nav/Navbar";
import { Footer } from "../../components/contact/Footer";
import { createLeadAction } from "../../actions/create-lead";

export default function PublicLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      <div id="main-content" className="relative z-10 bg-[var(--bg)]">
        <div className="pt-16 min-h-screen">{props.children}</div>
      </div>
      <Footer action={createLeadAction} />
    </>
  );
}
