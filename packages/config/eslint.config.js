import tseslint from "typescript-eslint";
export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: [
      "dist/**",
      ".next/**",
      "coverage/**",
      "node_modules/**",
      "apps/**/next-env.d.ts",
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
