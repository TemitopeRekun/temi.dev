import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const isDev = process.env.NODE_ENV === "development";

// Origins the browser legitimately connects to: the NestJS API (REST + SSE).
// Driven by the public env so the policy follows the deployment target.
const apiOrigins = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXT_PUBLIC_API_URL,
]
  .filter((value): value is string => Boolean(value))
  .join(" ");

// Remote image hosts (kept in sync with `images.remotePatterns` below).
const imgHosts =
  "https://*.supabase.co https://*.supabase.in https://picsum.photos https://media.licdn.com https://avatars.githubusercontent.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects a small inline bootstrap script; dev additionally needs
  // eval for React Refresh. A nonce-based policy (SEC-1b) is the path to
  // dropping 'unsafe-inline', but it forces dynamic rendering site-wide.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // styled-jsx and Tailwind emit inline styles.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${imgHosts}`,
  "font-src 'self' data:",
  "media-src 'self' https: blob:",
  // Three.js / @react-three workers run from blob: URLs.
  "worker-src 'self' blob:",
  `connect-src 'self' ${apiOrigins}${isDev ? " ws: http://localhost:* http://127.0.0.1:*" : ""}`.trim(),
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
]
  .join("; ")
  .replace(/\s{2,}/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  devIndicators: false,
  typedRoutes: true,
  transpilePackages: ["@temi/ui"],
  optimizePackageImports: [
    "@temi/ui",
    "lucide-react",
    "date-fns",
    "gsap",
    "framer-motion",
    "@radix-ui/react-icons",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "temitope.live",
      },
      {
        protocol: "https",
        hostname: "www.temitope.live",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
