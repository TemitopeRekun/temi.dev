import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "../providers/ThemeProvider";
import { LenisProvider } from "../providers/LenisProvider";
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
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmMono.variable} ${fraunces.variable}`}
    >
      <body
        className="bg-(--bg) text-(--text) antialiased"
      >
        <ThemeProvider>
          <LenisProvider>{props.children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
