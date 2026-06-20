"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "../components/common/Preloader";

// Create context with default false (assuming loaded if context missing)
const PreloaderContext = createContext<boolean>(false);

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The intro overlay is only for the homepage — never block blog posts,
  // the admin panel, or any other route with it.
  const isHome = pathname === "/";
  const [loading, setLoading] = useState(isHome);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isHome) {
      setLoading(false);
      return;
    }
    // On the homepage, show it once per session.
    const hasSeenPreloader = sessionStorage.getItem("preloader-seen");
    setLoading(!hasSeenPreloader);
  }, [isHome]);

  const handleComplete = () => {
    sessionStorage.setItem("preloader-seen", "1");
    setLoading(false);
  };

  return (
    <PreloaderContext.Provider value={loading}>
      <AnimatePresence mode="wait">
        {loading && isHome && (
          <Preloader key="preloader" onComplete={handleComplete} />
        )}
      </AnimatePresence>
      {children}
    </PreloaderContext.Provider>
  );
}
