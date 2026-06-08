"use client";
import { ArrowButton } from "@temi/ui";

export function DownloadCvButton() {
  const onClick = () => {
    window.open("/Temitope_Ogunrekun_CV.pdf", "_blank");
  };
  return <ArrowButton label="Download CV" onClick={onClick} />;
}
