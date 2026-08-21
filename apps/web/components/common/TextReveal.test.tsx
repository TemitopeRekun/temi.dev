import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RefObject } from "react";

/**
 * framer-motion's useInView registers its IntersectionObserver in an effect
 * whose deps are [root, ref, margin, once, amount] — all stable across renders.
 * It runs once on mount and returns early if `ref.current` is null, and never
 * re-runs to pick the ref up later.
 *
 * TextReveal has two branches, and the disabled one used to render a span with
 * no ref. Mounting disabled therefore left the observer permanently
 * unregistered, so when `enabled` later flipped, isInView stayed false and the
 * characters sat at y:"100%" inside an overflow-hidden mask — invisible. The
 * homepage hero mounts in exactly that state while the preloader runs.
 *
 * This stub records the ref TextReveal hands to useInView so the test can
 * assert it is actually attached to a mounted node.
 */
type InViewRef = RefObject<Element | null> | null;

const captured: { ref: InViewRef } = { ref: null };

/**
 * Read the recorded ref through a call boundary. Touching `captured.ref`
 * directly after the `reset()` assignment would let TypeScript narrow it to
 * `null` — it cannot see the mocked hook write to it.
 */
function recordedRef(): InViewRef {
  return captured.ref;
}

function reset(): void {
  captured.ref = null;
}

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("framer-motion");
  return {
    ...actual,
    useInView: (ref: RefObject<Element | null>) => {
      captured.ref = ref;
      return false;
    },
  };
});

const { TextReveal } = await import("./TextReveal");

describe("TextReveal", () => {
  it("attaches the in-view ref while disabled, so the observer can register", () => {
    reset();
    render(<TextReveal text="Temitope Ogunrekun" enabled={false} />);

    const ref = recordedRef();
    expect(ref).not.toBeNull();
    // The regression: this was null, so useInView's effect bailed forever.
    expect(ref?.current).not.toBeNull();
    expect(ref?.current?.textContent).toBe("Temitope Ogunrekun");
  });

  it("attaches the in-view ref when enabled", () => {
    reset();
    render(<TextReveal text="Ogunrekun" type="chars" />);

    expect(recordedRef()?.current).not.toBeNull();
  });

  it("exposes the phrase once to assistive tech in both branches", () => {
    const { unmount } = render(
      <TextReveal text="Hello there" enabled={false} />,
    );
    expect(screen.getByText("Hello there")).toBeTruthy();
    unmount();

    render(<TextReveal text="Hello there" type="words" />);
    // The split layer is aria-hidden, so exactly one readable copy remains.
    expect(screen.getByText("Hello there")).toBeTruthy();
  });
});
