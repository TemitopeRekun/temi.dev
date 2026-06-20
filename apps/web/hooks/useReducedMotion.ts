"use client";
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe hook returning whether the user prefers reduced motion. Starts
 * `false` on the server / first paint and updates after mount, then stays in
 * sync with changes to the media query.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Synchronous, non-reactive read of the reduced-motion preference. Useful in
 * effects that only need the value once (e.g. before starting a one-shot
 * animation). Returns `false` during SSR.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}
