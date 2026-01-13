import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: "800",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026 Nicopedia",
  description: "The next generation wiki experience",
};

import { SearchOverlay } from "@/components/search-overlay";
import { SearchProvider } from "@/components/search-context";
import { GeometricBackground } from "@/components/geometric-background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${spaceMono.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-deep-void text-off-white font-body selection:bg-neon-green selection:text-black`}
      >
        <SearchProvider>
          <GeometricBackground />
          <SiteHeader />
          <SearchOverlay />
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </SearchProvider>
      </body>
    </html>
  );
}
