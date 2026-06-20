import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { ContactForm, type LeadState } from "./ContactForm";

// StaggerReveal pulls in gsap/ScrollTrigger which do not run in jsdom. Replace
// the UI package with a no-op pass-through wrapper so we test the form itself.
vi.mock("@temi/ui", () => ({
  StaggerReveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("ContactForm", () => {
  // styled-jsx's `<style jsx>` is not transformed under vitest, so React warns
  // about the boolean `jsx` attribute reaching the DOM. This is a test-env-only
  // artifact (Next transforms it in production); silence just that one warning.
  let restoreError: () => void;
  beforeAll(() => {
    const real = console.error.bind(console);
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args: unknown[]) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes("non-boolean attribute") &&
          args.some((a) => a === "jsx")
        ) {
          return;
        }
        real(...args);
      });
    restoreError = () => spy.mockRestore();
  });
  afterAll(() => restoreError());
  it("exposes its inputs via accessible labels", () => {
    // Arrange / Act
    render(<ContactForm action={vi.fn().mockResolvedValue(null)} />);

    // Assert
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send it" })).toBeInTheDocument();
  });

  it("renders a polite aria-live status region", () => {
    // Arrange / Act
    render(<ContactForm action={vi.fn().mockResolvedValue(null)} />);

    // Assert
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("invokes the action with the submitted form data and shows success", async () => {
    // Arrange
    const user = userEvent.setup();
    const action = vi.fn(
      async (_prev: LeadState, data: FormData): Promise<LeadState> => {
        // Assert the form forwarded field values to the action.
        expect(data.get("name")).toBe("Ada");
        expect(data.get("email")).toBe("ada@example.com");
        expect(data.get("message")).toBe("Hello there");
        return { ok: true };
      },
    );
    render(<ContactForm action={action} />);

    // Act
    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Message"), "Hello there");
    await user.click(screen.getByRole("button", { name: "Send it" }));

    // Assert
    expect(action).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("Thanks! Your message has been received."),
    ).toBeInTheDocument();
  });

  it("renders the error message returned by the action", async () => {
    // Arrange
    const user = userEvent.setup();
    const action = vi
      .fn()
      .mockResolvedValue({ ok: false, error: "Something went wrong." });
    render(<ContactForm action={action} />);

    // Act
    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Message"), "Hi");
    await user.click(screen.getByRole("button", { name: "Send it" }));

    // Assert
    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();
  });
});
