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
