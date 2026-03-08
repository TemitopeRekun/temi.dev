"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { NavCurve } from "./NavCurve";

const NAV_ITEMS = [
  { title: "Home", href: "/" },
  { title: "Work", href: "/#work" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Services", href: "/services" },
  { title: "Contact", href: "/#contact" },
];

const SOCIALS = ["GitHub", "LinkedIn", "Twitter"];

const menuSlide = {
  initial: { x: "calc(100% + 100px)" },
  enter: {
    x: "0",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
};

export function FullscreenNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [hash, setHash] = useState("");
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    setHash(window.location.hash || "");
    const onHashChange = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const update = () => setAtTop(window.scrollY <= 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const currentHref = `${pathname}${hash}`;

  useEffect(() => {
    setSelectedIndicator(currentHref);
  }, [currentHref]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, hash]);

  return (
    <>
      {/* Burger button */}
      <AnimatePresence>
        {(isOpen || !atTop) && (
          <motion.button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((v) => !v)}
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-200 w-14 h-14 md:w-20 md:h-20 rounded-full bg-(--text) flex flex-col items-center justify-center gap-[6px] mix-blend-difference"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[22px] h-[1.5px] md:w-[28px] md:h-[2px] bg-(--bg) block"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[22px] h-[1.5px] md:w-[28px] md:h-[2px] bg-(--bg) block"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed top-0 right-0 h-screen w-[min(420px,90vw)] bg-(--bg) z-150 flex flex-col justify-between py-20 px-12 overflow-visible"
          >
            {/* Bezier SVG left edge */}
            <NavCurve />

            {/* Nav links */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-(--muted) mb-10 pb-6 border-b border-(--border)">
                Navigation
              </p>
              <nav
                className="flex flex-col gap-2"
                onMouseLeave={() => setSelectedIndicator(currentHref)}
              >
                {NAV_ITEMS.map((item, i) => (
                  <NavLink
                    key={item.href}
                    data={{ ...item, index: i }}
                    isActive={selectedIndicator === item.href}
                    setSelectedIndicator={setSelectedIndicator}
                  />
                ))}
              </nav>
            </div>

            {/* Social links footer inside nav */}
            <div className="flex gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-(--muted) hover:text-(--text) transition-colors cursor-pointer"
                >
                  {s}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-140 bg-black/20 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </>
  );
}
