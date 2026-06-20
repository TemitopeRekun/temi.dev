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
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
