import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion, prefersReducedMotion } from "./useReducedMotion";

type Listener = (e: MediaQueryListEvent) => void;

/** Install a controllable matchMedia mock and return helpers to drive it. */
function mockMatchMedia(initialMatches: boolean) {
  let listener: Listener | null = null;
  const mql = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: (_: string, cb: Listener) => {
      listener = cb;
    },
    removeEventListener: () => {
      listener = null;
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;
  return {
    emitChange(matches: boolean) {
      mql.matches = matches;
      listener?.({ matches } as MediaQueryListEvent);
    },
  };
}

describe("useReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when the reduce query matches after mount", () => {
    // Arrange
    mockMatchMedia(true);

    // Act
    const { result } = renderHook(() => useReducedMotion());

    // Assert
    expect(result.current).toBe(true);
  });

  it("returns false when the reduce query does not match", () => {
    // Arrange
    mockMatchMedia(false);

    // Act
    const { result } = renderHook(() => useReducedMotion());

    // Assert
    expect(result.current).toBe(false);
  });

  it("stays in sync when the media query changes", () => {
    // Arrange
    const ctl = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Act
    act(() => ctl.emitChange(true));

    // Assert
    expect(result.current).toBe(true);
  });
});

describe("prefersReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("synchronously reflects the current match state", () => {
    // Arrange
    mockMatchMedia(true);

    // Act / Assert
    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false when matchMedia reports no match", () => {
    // Arrange
    mockMatchMedia(false);

    // Act / Assert
    expect(prefersReducedMotion()).toBe(false);
  });
});
