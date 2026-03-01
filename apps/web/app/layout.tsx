import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "../providers/ThemeProvider";
import { LenisProvider } from "../providers/LenisProvider";
import { DM_Mono, Syne } from "next/font/google";

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

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmMono.variable} bg-(--bg) text-(--text) antialiased`}
      >
        <ThemeProvider>
          <LenisProvider>{props.children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
