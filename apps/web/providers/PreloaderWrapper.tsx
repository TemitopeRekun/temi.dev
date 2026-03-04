"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "../components/common/Preloader";

export function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("preloader-seen");
    if (seen) setLoading(false);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("preloader-seen", "1");
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={handleComplete} />}
      </AnimatePresence>
      {children}
    </>
  );
}
