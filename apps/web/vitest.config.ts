import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@temi/ui": resolve(__dirname, "../../packages/ui/src"),
      "@": __dirname,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    /*
     * The default 5s is too tight for the jsdom + userEvent suites. They pass
     * comfortably in isolation but time out when `turbo run lint typecheck test`
     * runs concurrently and jsdom environment setup gets starved of CPU — a
     * false failure that says nothing about the code under test. CI runs the
     * lint/typecheck and test jobs separately so it never hit this, which is
     * exactly what makes it an easy flake to miss.
     */
    testTimeout: 20000,
    hookTimeout: 20000,
    setupFiles: ["./test/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Scope coverage to unit-testable logic only. Animation/3D/visual
      // components (gsap/three/framer-motion) are intentionally excluded —
      // they are not unit-testable in jsdom and are covered by manual/visual QA.
      include: ["lib/**", "actions/**", "app/api/**", "hooks/**"],
      exclude: [
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.test.*",
        ".next/**",
        "node_modules/**",
        // gsap helper is a thin re-export / plugin registration shim with no
        // testable branching; excluded from the logic coverage scope.
        "lib/gsap.ts",
        // upload.ts hits browser/File APIs and the upstream uploader; not part
        // of the unit-test scope.
        "lib/upload.ts",
        // useFocusTrap is a DOM-focus animation/interaction hook covered by
        // manual a11y QA, not unit tests.
        "hooks/useFocusTrap.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
});
