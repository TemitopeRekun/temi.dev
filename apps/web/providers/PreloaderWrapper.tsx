"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "../components/common/Preloader";

// Create context with default false (assuming loaded if context missing)
const PreloaderContext = createContext<boolean>(false);

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Check if preloader has been seen in this session
    const hasSeenPreloader = sessionStorage.getItem("preloader-seen");
    if (hasSeenPreloader) {
      setLoading(false);
    } else {
      // If not seen, keep loading true
      setLoading(true);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("preloader-seen", "1");
    setLoading(false);
  };

  return (
    <PreloaderContext.Provider value={loading}>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={handleComplete} />}
      </AnimatePresence>
      {children}
    </PreloaderContext.Provider>
  );
}
