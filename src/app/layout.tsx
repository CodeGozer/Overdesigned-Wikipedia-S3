import type { Metadata } from "next";
import { Space_Mono, Inter, Syne } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "NICOPEDIA // 2026",
  description: "A Neo-Brutalist Wiki Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${spaceMono.variable} ${inter.variable} antialiased min-h-screen bg-deep-void text-off-white font-body selection:bg-neon-green selection:text-black`}
        suppressHydrationWarning
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
