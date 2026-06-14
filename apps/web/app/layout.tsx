import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "../providers/ThemeProvider";
import { LenisProvider } from "../providers/LenisProvider";
import { PreloaderWrapper } from "../providers/PreloaderWrapper";
import { QueryProvider } from "../providers/QueryProvider";
import { DM_Mono, Fraunces, Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  verification: {
    google: "zuL_znB3EWJEudjKxbRM1G8Jvab0VPKS-h_rfhanMgk",
  },
};

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmMono.variable} ${fraunces.variable} bg-(--bg) text-(--text) antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-full focus:bg-(--accent) focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-black focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <LenisProvider>
            <QueryProvider>
              <PreloaderWrapper>{props.children}</PreloaderWrapper>
            </QueryProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
