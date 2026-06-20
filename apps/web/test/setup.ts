import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees and reset mocks between tests so suites stay isolated.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom does not implement matchMedia. Provide a default, non-matching mock so
// components/hooks that read it during render do not throw. Individual tests
// override `window.matchMedia` when they need a specific match result.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}

// jsdom lacks ResizeObserver, which some layout/animation components touch.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
