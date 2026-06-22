import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  moduleFileExtensions: ["js", "json", "ts"],
  setupFiles: ["reflect-metadata"],
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      { tsconfig: "<rootDir>/../tsconfig.spec.json" },
    ],
  },
  collectCoverageFrom: [
    "**/*.(t|j)s",
    "!**/*.module.ts",
    "!**/*.dto.ts",
    "!**/main.ts",
    "!**/instrument.ts",
    "!**/*.d.ts",
    "!**/scripts/**",
    "!**/test/**",
    "!**/*.spec.ts",
  ],
  coverageDirectory: "../coverage",
  // Enforced when run with --coverage (the CI `test:cov` path). Current
  // coverage sits at ~99% lines / ~87% branches, so these are real floors with
  // headroom, not aspirational targets.
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
