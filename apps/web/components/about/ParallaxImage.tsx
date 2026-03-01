"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "../../lib/gsap";

type Props = {
  src: string;
  alt: string;
  aspect?: string;
};

export function ParallaxImage({ src, alt, aspect = "aspect-4/5" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const run = async () => {
      await registerGSAP();
      const root = ref.current;
      const img = imgRef.current;
      if (!root || !img) return;
      const ctx = gsap.context(() => {
        gsap.set(img, { yPercent: -8 });
        gsap.to(img, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, root);
      cleanup = () => ctx.revert();
    };
    void run();
    return () => cleanup?.();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl ${aspect}`}>
      <div ref={imgRef} className="h-full w-full will-change-transform">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1500}
          priority={false}
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

