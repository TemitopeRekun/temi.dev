import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/web/app/**/*.{ts,tsx}",
    "../../apps/web/components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
        "16/10": "16 / 10",
      },
      zIndex: {
        "201": "201",
      },
    },
  },
  plugins: [],
};

export default config;
