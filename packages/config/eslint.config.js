import tseslint from "typescript-eslint";
export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: [
      // Build artifacts and generated output are never lint targets. Use a
      // `**/` prefix so the ignore matches whether ESLint runs from the repo
      // root or from a package subdirectory (e.g. `eslint .` inside packages/*).
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/next-env.d.ts",
    ],
  },
  {
    rules: {
      // Honor the `_`-prefix convention for intentionally unused bindings
      // (e.g. destructuring to omit a key, unused catch params).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
