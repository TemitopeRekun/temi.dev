declare module "gsap" {
  export type QuickToFunc = (value: number) => void;

  export namespace core {
    interface Timeline {
      to(targets: unknown, vars: Record<string, unknown>): Timeline;
      fromTo(
        targets: unknown,
        fromVars: Record<string, unknown>,
        toVars: Record<string, unknown>
      ): Timeline;
      play(): void;
      pause?(): void;
      kill(): void;
    }
  }

  export interface GSAPContext {
    revert(): void;
  }

  export interface GSAPMatchMedia {
    add(queries: Record<string, string>, cb: () => void): void;
    kill(): void;
  }

  export interface GSAPStatic {
    set(target: unknown, vars: Record<string, unknown>): void;
    to(target: unknown, vars: Record<string, unknown>): unknown;
    fromTo(
      target: unknown,
      fromVars: Record<string, unknown>,
      toVars: Record<string, unknown>
    ): unknown;
    timeline(options?: Record<string, unknown>): core.Timeline;
    quickTo(target: unknown, property: string, options?: Record<string, unknown>): QuickToFunc;
    delayedCall(delay: number, callback: () => void): unknown;
    registerPlugin(...plugins: unknown[]): void;
    context(cb: () => void, scope?: unknown): GSAPContext;
    matchMedia(): GSAPMatchMedia;
  }

  const gsap: GSAPStatic;
  export default gsap;
}

declare module "gsap/ScrollTrigger" {
  export interface ScrollTriggerInstance {
    kill(): void;
  }
  export interface ScrollTriggerStatic {
    create(options: Record<string, unknown>): ScrollTriggerInstance;
  }
  const ScrollTrigger: ScrollTriggerStatic;
  export default ScrollTrigger;
  export type { ScrollTriggerInstance };
}

