import type { ReactNode } from "react";
import { Navbar } from "../../components/nav/Navbar";
import { Footer } from "../../components/contact/Footer";
import { createLeadAction } from "../../actions/create-lead";
import { LenisProvider } from "../../providers/LenisProvider";
import { PreloaderWrapper } from "../../providers/PreloaderWrapper";

// Smooth-scroll and the intro preloader are scoped to the public site only so
// the admin area never loads them.
export default function PublicLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <LenisProvider>
      <PreloaderWrapper>
        <Navbar />
        <div id="main-content" className="relative z-10 bg-[var(--bg)]">
          <div className="pt-16 min-h-screen">{props.children}</div>
        </div>
        <Footer action={createLeadAction} />
      </PreloaderWrapper>
    </LenisProvider>
  );
}
