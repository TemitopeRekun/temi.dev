"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function FooterReveal({ children }: Props) {
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const updateHeight = () => {
      if (contentRef.current) {
        setHeight(contentRef.current.offsetHeight);
      }
    };

    // Initial measure
    updateHeight();

    // Observe resize
    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="relative z-0" 
      style={{ height: height ? height : "auto" }}
    >
      <div 
        className="fixed bottom-0 left-0 right-0 w-full z-0"
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
}
