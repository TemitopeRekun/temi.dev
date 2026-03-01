import type { ReactNode } from "react";
import { Navbar } from "../../components/nav/Navbar";

export default function PublicLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{props.children}</div>
    </>
  );
}

