import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export async function registerGSAP(): Promise<void> {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  await import("gsap/SplitText")
    .then((mod: unknown) => {
      const anyMod = mod as { SplitText?: unknown };
      if (anyMod && "SplitText" in anyMod) {
        // @ts-expect-error: SplitText types are not bundled
        gsap.registerPlugin(anyMod.SplitText);
      }
    })
    .catch(() => {});
  registered = true;
}

export { gsap, ScrollTrigger };
